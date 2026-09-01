import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  FileUp,
  Pause,
  Play,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getBook, logSession } from "@/lib/api/books";
import { formatMeta, percentOf, progressLabel } from "@/lib/formats";
import { parseEpub, type EpubChapter } from "@/lib/epub";
import { getLocalFile, saveLocalFile } from "@/lib/idb";
import { clamp, formatClock } from "@/lib/utils";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";

type PdfDoc = {
  numPages: number;
  getPage: (n: number) => Promise<{
    getViewport: (opts: { scale: number }) => { width: number; height: number };
    render: (opts: { canvasContext: CanvasRenderingContext2D; viewport: { width: number; height: number } }) => {
      promise: Promise<void>;
    };
  }>;
};

export function ReaderView({ bookId }: { bookId: string }) {
  const qc = useQueryClient();
  const bookQ = useQuery({
    queryKey: ["book", bookId],
    queryFn: () => getBook({ data: { id: bookId } }),
  });
  const book = bookQ.data;
  const [file, setFile] = useState<{ name: string; type: string; blob: Blob } | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const [progress, setProgress] = useState(0);
  const started = useRef(Date.now());
  const lastFlush = useRef(Date.now());
  const unitsAtStart = useRef(0);

  useEffect(() => {
    if (book) {
      setProgress(book.progress);
      unitsAtStart.current = book.progress;
    }
  }, [book?.id]);

  useEffect(() => {
    let cancelled = false;
    void getLocalFile(bookId).then((f) => {
      if (!cancelled && f) setFile({ name: f.name, type: f.type, blob: f.blob });
    });
    return () => {
      cancelled = true;
    };
  }, [bookId]);

  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [running]);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) setRunning(false);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const flush = useMutation({
    mutationFn: async (final: boolean) => {
      const elapsed = Math.max(0, Math.round((Date.now() - lastFlush.current) / 1000));
      lastFlush.current = Date.now();
      if (elapsed < 3 && !final) return book;
      return logSession({
        data: {
          bookId,
          durationSec: elapsed,
          unitsRead: Math.max(0, progress - unitsAtStart.current),
          progress,
          lastLocation: String(progress),
        },
      });
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["books"] });
      void qc.invalidateQueries({ queryKey: ["analytics"] });
      void qc.invalidateQueries({ queryKey: ["book", bookId] });
    },
  });

  useEffect(() => {
    const t = window.setInterval(() => {
      if (running) void flush.mutateAsync(false);
    }, 60_000);
    return () => window.clearInterval(t);
  }, [running, progress]);

  async function onFile(f: File) {
    if (f.size > 80 * 1024 * 1024) {
      toast.error("Arquivo acima de 80 MB.");
      return;
    }
    await saveLocalFile(bookId, f, f.name, f.type);
    setFile({ name: f.name, type: f.type, blob: f });
    toast.success("Arquivo salvo neste dispositivo.");
  }

  if (bookQ.isPending || !book) {
    return (
      <div className="grid min-h-dvh place-items-center text-sm text-reader-foreground/70">
        Abrindo a leitura…
      </div>
    );
  }

  const meta = formatMeta[book.format];
  const max = book.ongoing ? Math.max(progress, 1) : Math.max(book.totalUnits, 1);
  const kind = fileKind(file);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center gap-3 px-3 py-3 md:px-6">
        <Link
          to="/app/library"
          onClick={() => void flush.mutateAsync(true)}
          className="grid size-11 place-items-center rounded-full bg-reader-foreground/10"
          aria-label="Fechar leitor"
        >
          <X className="size-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base">{book.title}</p>
          <p className="truncate text-xs text-reader-foreground/60">{book.author}</p>
        </div>
        <button
          type="button"
          onClick={() => setRunning((v) => !v)}
          className="flex h-11 items-center gap-2 rounded-full bg-reader-foreground/10 px-3 text-sm tabular-nums"
        >
          {running ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          {formatClock(seconds)}
        </button>
      </header>

      <div className="flex flex-1 flex-col px-3 pb-4 md:px-6">
        {kind === "pdf" && file ? (
          <PdfPane
            blob={file.blob}
            page={Math.max(1, progress || 1)}
            onPage={(p, total) => {
              setProgress(p);
              if (book.totalUnits !== total) {
                /* total discovered from file */
              }
            }}
          />
        ) : kind === "epub" && file ? (
          <EpubPane
            blob={file.blob}
            index={Math.max(0, progress - 1)}
            onChapter={(i, total) => setProgress(Math.min(total, i + 1))}
          />
        ) : kind === "audio" && file ? (
          <AudioPane
            blob={file.blob}
            onTime={(sec) => setProgress(Math.round(sec / 60))}
          />
        ) : (
          <TrackerPane
            onFile={onFile}
            fileName={file?.name}
            formatLabel={meta.label}
          />
        )}
      </div>

      <footer className="border-t border-reader-foreground/10 px-4 py-4 md:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-reader-foreground/70">
            <span>{progressLabel(progress, book.totalUnits, book.unitType, book.ongoing)}</span>
            <span className="tabular-nums">
              {percentOf(progress, book.totalUnits, book.ongoing) == null
                ? "Em lançamento"
                : `${percentOf(progress, book.totalUnits, book.ongoing)}%`}
            </span>
          </div>
          <Slider
            min={0}
            max={max}
            step={1}
            value={[progress]}
            onValueChange={(v) => setProgress(v[0] ?? 0)}
            onValueCommit={() => void flush.mutateAsync(true)}
          />
          <p className="text-center text-[11px] text-reader-foreground/45">
            O arquivo permanece neste aparelho. Nada é enviado à nuvem.
          </p>
        </div>
      </footer>
    </div>
  );
}

function fileKind(file: { type: string; name: string } | null) {
  if (!file) return "none";
  const t = file.type.toLowerCase();
  const n = file.name.toLowerCase();
  if (t.includes("pdf") || n.endsWith(".pdf")) return "pdf";
  if (t.includes("epub") || n.endsWith(".epub")) return "epub";
  if (t.startsWith("audio/") || /\.(mp3|m4a|ogg|wav|aac)$/.test(n)) return "audio";
  return "other";
}

function TrackerPane({
  onFile,
  fileName,
  formatLabel,
}: {
  onFile: (f: File) => void;
  fileName?: string;
  formatLabel: string;
}) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-6 text-center">
      <div className="grid size-16 place-items-center rounded-2xl bg-reader-foreground/10">
        <FileUp className="size-6" />
      </div>
      <div>
        <p className="font-display text-2xl">Modo acompanhamento</p>
        <p className="mt-2 max-w-sm text-sm text-reader-foreground/65">
          Marque o progresso de um {formatLabel.toLowerCase()} físico, ou anexe um PDF, EPUB ou áudio
          para ler aqui — o arquivo não sai deste dispositivo.
        </p>
      </div>
      <label className="inline-flex h-11 cursor-pointer items-center rounded-md bg-reader-foreground px-4 text-sm font-medium text-reader">
        {fileName ? "Trocar arquivo" : "Anexar arquivo local"}
        <input
          type="file"
          accept=".pdf,.epub,application/pdf,application/epub+zip,audio/*"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onFile(f);
          }}
        />
      </label>
      {fileName ? <p className="text-xs text-reader-foreground/50">{fileName}</p> : null}
    </div>
  );
}

function PdfPane({
  blob,
  page,
  onPage,
}: {
  blob: Blob;
  page: number;
  onPage: (page: number, total: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfRef = useRef<PdfDoc | null>(null);
  const [total, setTotal] = useState(1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const pdfjs = await import("pdfjs-dist");
      const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
      const data = await blob.arrayBuffer();
      const doc = (await pdfjs.getDocument({ data }).promise) as unknown as PdfDoc;
      if (cancelled) return;
      pdfRef.current = doc;
      setTotal(doc.numPages);
      setReady(true);
      onPage(clamp(page, 1, doc.numPages), doc.numPages);
    })();
    return () => {
      cancelled = true;
    };
  }, [blob]);

  const render = useCallback(async (n: number) => {
    const pdf = pdfRef.current;
    const canvas = canvasRef.current;
    if (!pdf || !canvas) return;
    const pg = await pdf.getPage(n);
    const base = pg.getViewport({ scale: 1 });
    const width = Math.min(900, canvas.parentElement?.clientWidth ?? 700);
    const scale = width / base.width;
    const viewport = pg.getViewport({ scale: Math.min(2, scale) });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    await pg.render({ canvasContext: ctx, viewport }).promise;
  }, []);

  useEffect(() => {
    if (ready) void render(clamp(page, 1, total));
  }, [page, ready, total, render]);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
      <div className="flex items-center justify-center gap-2 py-2">
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-reader-foreground"
          onClick={() => onPage(Math.max(1, page - 1), total)}
        >
          <ChevronLeft />
        </Button>
        <span className="text-xs tabular-nums text-reader-foreground/70">
          {page} / {total}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-reader-foreground"
          onClick={() => onPage(Math.min(total, page + 1), total)}
        >
          <ChevronRight />
        </Button>
      </div>
      <div className="flex flex-1 justify-center overflow-auto rounded-lg bg-background/95 p-2">
        <canvas ref={canvasRef} className="max-w-full" />
      </div>
    </div>
  );
}

function EpubPane({
  blob,
  index,
  onChapter,
}: {
  blob: Blob;
  index: number;
  onChapter: (i: number, total: number) => void;
}) {
  const [chapters, setChapters] = useState<EpubChapter[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void parseEpub(blob)
      .then((chs) => {
        if (!cancelled) {
          setChapters(chs);
          onChapter(clamp(index, 0, chs.length - 1), chs.length);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) setErr(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [blob]);

  if (err) return <p className="m-auto text-sm text-reader-foreground/70">{err}</p>;
  if (!chapters) return <p className="m-auto text-sm text-reader-foreground/70">Preparando EPUB…</p>;
  const ch = chapters[clamp(index, 0, chapters.length - 1)]!;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
      <div className="flex items-center justify-between gap-2 py-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-reader-foreground"
          onClick={() => onChapter(Math.max(0, index - 1), chapters.length)}
        >
          <ChevronLeft /> Anterior
        </Button>
        <span className="text-xs text-reader-foreground/70">
          {index + 1} / {chapters.length}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="text-reader-foreground"
          onClick={() => onChapter(Math.min(chapters.length - 1, index + 1), chapters.length)}
        >
          Próximo <ChevronRight />
        </Button>
      </div>
      <article
        className="flex-1 overflow-auto rounded-lg bg-background p-6 text-foreground font-serif leading-relaxed"
        dangerouslySetInnerHTML={{ __html: ch.html }}
      />
    </div>
  );
}

function AudioPane({ blob, onTime }: { blob: Blob; onTime: (sec: number) => void }) {
  const url = useRef<string | null>(null);
  if (!url.current) url.current = URL.createObjectURL(blob);
  return (
    <div className="m-auto flex w-full max-w-lg flex-col items-center gap-6">
      <p className="font-display text-2xl">Audiolivro</p>
      <audio
        className="w-full"
        controls
        src={url.current}
        onTimeUpdate={(e) => onTime(e.currentTarget.currentTime)}
      />
    </div>
  );
}
