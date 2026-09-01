import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AddBookDialog } from "@/components/add-book-dialog";
import { Cover } from "@/components/cover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteBook, listBooks } from "@/lib/api/books";
import { FORMATS, STATUSES, formatMeta, percentOf, progressLabel, statusMeta, type Format, type Status } from "@/lib/formats";
import { deleteLocalFile } from "@/lib/idb";
import type { Book } from "@/lib/types";

export const Route = createFileRoute("/app/library")({ component: LibraryPage });

function LibraryPage() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<Status | "all">("all");
  const [format, setFormat] = useState<Format | "all">("all");
  const [pendingDelete, setPendingDelete] = useState<Book | null>(null);
  const qc = useQueryClient();
  const booksQ = useQuery({ queryKey: ["books"], queryFn: () => listBooks() });

  const filtered = useMemo(() => {
    const list = booksQ.data ?? [];
    const query = q.trim().toLowerCase();
    return list.filter((b) => {
      if (status !== "all" && b.status !== status) return false;
      if (format !== "all" && b.format !== format) return false;
      if (!query) return true;
      return `${b.title} ${b.author} ${b.genre ?? ""}`.toLowerCase().includes(query);
    });
  }, [booksQ.data, q, status, format]);

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await deleteBook({ data: { id } });
      await deleteLocalFile(id);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["books"] });
      toast.success("Obra removida");
      setPendingDelete(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Acervo</p>
          <h1 className="mt-1 font-display text-3xl tracking-tight">Biblioteca</h1>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Adicionar
        </Button>
      </header>

      <div className="flex flex-col gap-2 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar título, autor, gênero" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as Status | "all")}>
          <SelectTrigger className="md:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {statusMeta[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={format} onValueChange={(v) => setFormat(v as Format | "all")}>
          <SelectTrigger className="md:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os formatos</SelectItem>
            {FORMATS.map((f) => (
              <SelectItem key={f} value={f}>
                {formatMeta[f].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {booksQ.isPending ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] rounded-md" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">Nenhuma obra neste filtro.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((b) => {
            const pct = percentOf(b.progress, b.totalUnits, b.ongoing);
            return (
              <li key={b.id} className="group relative">
                <Link to="/app/reader/$bookId" params={{ bookId: b.id }} className="block">
                  <Cover title={b.title} author={b.author} coverUrl={b.coverUrl} />
                  <p className="mt-2 truncate text-sm font-medium">{b.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{b.author || formatMeta[b.format].label}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {statusMeta[b.status].label}
                    {b.ongoing ? " · Lançamento" : ""} ·{" "}
                    {progressLabel(b.progress, b.totalUnits, b.unitType, b.ongoing)}
                  </p>
                  {pct != null ? <Progress className="mt-2" value={pct} /> : null}
                </Link>
                <button
                  type="button"
                  className="absolute top-2 right-2 grid size-9 place-items-center rounded-full bg-background/90 text-muted-foreground opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 hover:text-destructive"
                  onClick={() => setPendingDelete(b)}
                  aria-label={`Remover ${b.title}`}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <AddBookDialog open={open} onOpenChange={setOpen} />
      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(v) => !v && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover da biblioteca?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.title} sai do acervo. O arquivo local, se houver, também é apagado neste
              aparelho.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => pendingDelete && remove.mutate(pendingDelete.id)}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
