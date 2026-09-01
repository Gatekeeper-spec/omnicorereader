import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import { createClub, joinClub, listClubs } from "@/lib/api/clubs";
import { SELECTION_MODES, selectionMeta, type SelectionMode } from "@/lib/formats";

export const Route = createFileRoute("/app/clubs/")({ component: ClubsPage });

function ClubsPage() {
  const qc = useQueryClient();
  const listQ = useQuery({ queryKey: ["clubs"], queryFn: () => listClubs() });
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState<SelectionMode>("vote");
  const [code, setCode] = useState("");

  const create = useMutation({
    mutationFn: () => createClub({ data: { name, description, selectionMode: mode } }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["clubs"] });
      setCreateOpen(false);
      setName("");
      setDescription("");
      toast.success("Clube criado");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const join = useMutation({
    mutationFn: () => joinClub({ data: { code } }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["clubs"] });
      setJoinOpen(false);
      setCode("");
      toast.success("Você entrou no clube");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const clubs = listQ.data ?? [];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Social</p>
          <h1 className="mt-1 font-display text-3xl tracking-tight">Clubes</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setJoinOpen(true)}>
            Entrar
          </Button>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            Criar
          </Button>
        </div>
      </header>

      {clubs.length === 0 && !listQ.isPending ? (
        <Card className="p-10 text-center">
          <p className="font-display text-xl">Nenhum clube ainda</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Crie um espaço privado ou use um código de convite.
          </p>
        </Card>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {clubs.map((c) => (
            <li key={c.id}>
              <Link to="/app/clubs/$clubId" params={{ clubId: c.id }}>
                <Card className="p-5 transition-shadow paper-shadow-hover">
                  <p className="font-display text-xl">{c.name}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {c.description || "Sem descrição"}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {c.memberCount} {c.memberCount === 1 ? "membro" : "membros"} ·{" "}
                    {selectionMeta[c.selectionMode].label} · chave {c.inviteCode}
                  </p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo clube</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="c-name">Nome</Label>
              <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="c-desc">Descrição</Label>
              <Textarea id="c-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Escolha da próxima leitura</Label>
              <Select value={mode} onValueChange={(v) => setMode(v as SelectionMode)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SELECTION_MODES.map((m) => (
                    <SelectItem key={m} value={m}>
                      {selectionMeta[m].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{selectionMeta[mode].hint}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancelar
            </Button>
            <Button disabled={name.trim().length < 2 || create.isPending} onClick={() => create.mutate()}>
              Criar clube
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Entrar com convite</DialogTitle>
          </DialogHeader>
          <div className="grid gap-1.5">
            <Label htmlFor="code">Código</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ABC123"
              className="tracking-[0.3em] uppercase"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setJoinOpen(false)}>
              Cancelar
            </Button>
            <Button disabled={code.trim().length < 4 || join.isPending} onClick={() => join.mutate()}>
              Entrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
