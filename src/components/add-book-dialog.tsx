import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createBook } from "@/lib/api/books";
import { searchCatalog } from "@/lib/api/catalog";
import { FORMATS, formatMeta, type Format } from "@/lib/formats";
import type { CatalogHit } from "@/lib/types";
import { Cover } from "./cover";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";

export function AddBookDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated?: (id: string) => void;
}) {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<CatalogHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [format, setFormat] = useState<Format>("book");
  const [total, setTotal] = useState("");
  const [genre, setGenre] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [isbn, setIsbn] = useState("");
  const [year, setYear] = useState("");
  const [ongoing, setOngoing] = useState(false);

  function applyHit(hit: CatalogHit) {
    setTitle(hit.title);
    setAuthor(hit.author);
    setCoverUrl(hit.coverUrl ?? "");
    setIsbn(hit.isbn ?? "");
    setYear(hit.year ? String(hit.year) : "");
    setGenre(hit.categories[0] ?? "");
    if (hit.pageCount) setTotal(String(hit.pageCount));
  }

  const save = useMutation({
    mutationFn: () =>
      createBook({
        data: {
          title,
          author,
          format,
          coverUrl: coverUrl || undefined,
          isbn: isbn || undefined,
          genre: genre || undefined,
          year: year ? Number(year) : null,
          totalUnits: total ? Number(total) : undefined,
          ongoing,
          status: "to_read",
        },
      }),
    onSuccess: (book) => {
      void qc.invalidateQueries({ queryKey: ["books"] });
      toast.success("Obra adicionada à biblioteca");
      onOpenChange(false);
      onCreated?.(book.id);
      setTitle("");
      setAuthor("");
      setHits([]);
      setQ("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function onSearch(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (q.trim().length < 2) return;
    setSearching(true);
    try {
      const res = await searchCatalog({ data: { q } });
      setHits(res);
      if (res.length === 0) toast.message("Nenhum resultado. Preencha manualmente.");
    } catch {
      toast.error("Não foi possível buscar metadados.");
    } finally {
      setSearching(false);
    }
  }

  const meta = formatMeta[format];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova obra</DialogTitle>
          <DialogDescription>Busque por título ou ISBN, ou cadastre na mão.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSearch} className="flex gap-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Título, autor ou ISBN"
            aria-label="Buscar no catálogo"
          />
          <Button type="submit" variant="secondary" disabled={searching}>
            <Search className="size-4" />
            {searching ? "…" : "Buscar"}
          </Button>
        </form>
        {hits.length > 0 ? (
          <ul className="grid max-h-40 gap-2 overflow-y-auto">
            {hits.map((hit, i) => (
              <li key={`${hit.title}-${i}`}>
                <button
                  type="button"
                  onClick={() => applyHit(hit)}
                  className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-muted"
                >
                  <Cover title={hit.title} author={hit.author} coverUrl={hit.coverUrl} className="h-14 w-auto" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{hit.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">{hit.author}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="author">Autor</Label>
            <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Formato</Label>
              <Select value={format} onValueChange={(v) => setFormat(v as Format)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FORMATS.map((f) => (
                    <SelectItem key={f} value={f}>
                      {formatMeta[f].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="total">{meta.unitLabel}</Label>
              <Input
                id="total"
                inputMode="numeric"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                disabled={ongoing}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="genre">Gênero</Label>
              <Input id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="year">Ano</Label>
              <Input id="year" inputMode="numeric" value={year} onChange={(e) => setYear(e.target.value)} />
            </div>
          </div>
          {format === "manga" ? (
            <label className="flex items-center justify-between gap-3 rounded-lg bg-muted px-3 py-2 text-sm">
              Em lançamento
              <Switch checked={ongoing} onCheckedChange={setOngoing} />
            </label>
          ) : null}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button disabled={!title.trim() || save.isPending} onClick={() => save.mutate()}>
            {save.isPending ? "Salvando…" : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
