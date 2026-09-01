import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Cover } from "@/components/cover";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addWishlist, convertWishlist, deleteWishlist, listWishlist } from "@/lib/api/catalog";
import { PRIORITIES, priorityMeta, type Priority } from "@/lib/formats";

export const Route = createFileRoute("/app/wishlist")({ component: WishlistPage });

function WishlistPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [price, setPrice] = useState("");
  const listQ = useQuery({ queryKey: ["wishlist"], queryFn: () => listWishlist() });

  const add = useMutation({
    mutationFn: () =>
      addWishlist({
        data: {
          title,
          author,
          priority,
          estimatedPrice: price ? Number(price) : null,
        },
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["wishlist"] });
      setOpen(false);
      setTitle("");
      setAuthor("");
      setPrice("");
      toast.success("Adicionado à lista");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const convert = useMutation({
    mutationFn: (id: string) => convertWishlist({ data: { id } }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["wishlist"] });
      void qc.invalidateQueries({ queryKey: ["books"] });
      toast.success("Foi para a biblioteca");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteWishlist({ data: { id } }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const items = listQ.data ?? [];

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Aquisições</p>
          <h1 className="mt-1 font-display text-3xl tracking-tight">Lista de desejos</h1>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Desejo
        </Button>
      </header>

      {items.length === 0 && !listQ.isPending ? (
        <Card className="p-10 text-center">
          <p className="font-display text-xl">Nada na lista</p>
          <p className="mt-1 text-sm text-muted-foreground">Guarde títulos para comprar depois.</p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id}>
              <Card className="flex items-center gap-4 p-3 md:p-4">
                <Cover title={item.title} author={item.author} coverUrl={item.coverUrl} className="w-14 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{item.title}</p>
                  <p className="truncate text-sm text-muted-foreground">{item.author}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Prioridade {priorityMeta[item.priority].label}
                    {item.estimatedPrice != null ? ` · R$ ${item.estimatedPrice}` : ""}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" onClick={() => convert.mutate(item.id)}>
                    Biblioteca
                    <ArrowRight className="size-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => remove.mutate(item.id)}>
                    Remover
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo desejo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="w-title">Título</Label>
              <Input id="w-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="w-author">Autor</Label>
              <Input id="w-author" value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Prioridade</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {priorityMeta[p].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="w-price">Preço estimado (R$)</Label>
                <Input id="w-price" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button disabled={!title.trim() || add.isPending} onClick={() => add.mutate()}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
