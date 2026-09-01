import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Cover } from "@/components/cover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  closeVote,
  createPost,
  deleteClub,
  getClub,
  leaveClub,
  listClubProgress,
  listMembers,
  listPosts,
  listWorks,
  nominateWork,
  raffleWork,
  setCurrentWork,
  toggleVote,
  updateClub,
  updateClubProgress,
} from "@/lib/api/clubs";
import { FORMATS, SELECTION_MODES, formatMeta, percentOf, selectionMeta, type Format, type SelectionMode } from "@/lib/formats";
import { initials } from "@/lib/utils";
import type { ClubWork } from "@/lib/types";
import { useCurrentUser } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/app/clubs/$clubId")({ component: ClubPage });

function ClubPage() {
  const { clubId } = Route.useParams();
  const clubQ = useQuery({ queryKey: ["club", clubId], queryFn: () => getClub({ data: { clubId } }) });
  const worksQ = useQuery({ queryKey: ["works", clubId], queryFn: () => listWorks({ data: { clubId } }) });
  const membersQ = useQuery({ queryKey: ["members", clubId], queryFn: () => listMembers({ data: { clubId } }) });
  const postsQ = useQuery({ queryKey: ["posts", clubId], queryFn: () => listPosts({ data: { clubId } }) });

  const club = clubQ.data;
  const works = worksQ.data ?? [];
  const current = works.find((w) => w.status === "current");
  const nominated = works.filter((w) => w.status === "nominated");
  const archived = works.filter((w) => w.status === "archived");

  if (!club) {
    return <p className="text-sm text-muted-foreground">Carregando clube…</p>;
  }

  const isAdmin = club.role === "owner" || club.role === "admin";

  return (
    <div className="space-y-8">
      <header>
        <Link to="/app/clubs" className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
          Clubes
        </Link>
        <h1 className="mt-1 font-display text-3xl tracking-tight">{club.name}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{club.description}</p>
        <p className="mt-3 text-xs text-muted-foreground">
          Convite <span className="font-medium tracking-[0.2em] text-foreground">{club.inviteCode}</span> ·{" "}
          {club.memberCount} membros · {selectionMeta[club.selectionMode].label}
        </p>
      </header>

      {current ? <CurrentPanel clubId={clubId} work={current} /> : (
        <Card className="p-6">
          <p className="font-display text-xl">Sem leitura coletiva no momento</p>
          <p className="mt-1 text-sm text-muted-foreground">Indique uma obra e feche a escolha.</p>
        </Card>
      )}

      <Tabs defaultValue="talk">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="talk">Discussão</TabsTrigger>
          <TabsTrigger value="noms">Indicações</TabsTrigger>
          <TabsTrigger value="shelf">Estante</TabsTrigger>
          <TabsTrigger value="people">Membros</TabsTrigger>
          {isAdmin ? <TabsTrigger value="admin">Ajustes</TabsTrigger> : null}
        </TabsList>
        <TabsContent value="talk">
          <Talk clubId={clubId} workId={current?.id ?? null} posts={postsQ.data ?? []} />
        </TabsContent>
        <TabsContent value="noms">
          <Noms clubId={clubId} works={nominated} isAdmin={isAdmin} mode={club.selectionMode} />
        </TabsContent>
        <TabsContent value="shelf">
          {archived.length === 0 ? (
            <p className="text-sm text-muted-foreground">O histórico aparece aqui quando uma leitura termina.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {archived.map((w) => (
                <li key={w.id}>
                  <Cover title={w.title} author={w.author} coverUrl={w.coverUrl} />
                  <p className="mt-2 truncate text-sm font-medium">{w.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{w.author}</p>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
        <TabsContent value="people">
          <ul className="divide-y divide-border rounded-xl bg-card paper-shadow">
            {(membersQ.data ?? []).map((m) => (
              <li key={m.userId} className="flex items-center gap-3 px-4 py-3">
                <Avatar>
                  {m.avatarUrl ? <AvatarImage src={m.avatarUrl} alt="" /> : null}
                  <AvatarFallback>{initials(m.displayName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{m.displayName}</p>
                  <p className="text-xs text-muted-foreground capitalize">{m.role === "owner" ? "criador" : m.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>
        {isAdmin ? (
          <TabsContent value="admin">
            <Admin clubId={clubId} name={club.name} description={club.description} mode={club.selectionMode} limit={club.memberLimit} role={club.role} />
          </TabsContent>
        ) : (
          <Leave clubId={clubId} />
        )}
      </Tabs>
    </div>
  );
}

function CurrentPanel({ clubId, work }: { clubId: string; work: ClubWork }) {
  const qc = useQueryClient();
  const user = useCurrentUser();
  const progressQ = useQuery({
    queryKey: ["cprogress", clubId, work.id],
    queryFn: () => listClubProgress({ data: { clubId, workId: work.id } }),
  });
  const [mine, setMine] = useState(0);
  const save = useMutation({
    mutationFn: (progress: number) => updateClubProgress({ data: { clubId, workId: work.id, progress } }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["cprogress", clubId, work.id] }),
  });
  const max = Math.max(work.totalUnits, 1);
  const rows = progressQ.data ?? [];

  useEffect(() => {
    const row = rows.find((r) => r.userId === user?.id);
    if (row) setMine(row.progress);
  }, [rows, user?.id]);

  return (
    <Card className="grid gap-6 p-5 md:grid-cols-[140px_1fr] md:p-6">
      <Cover title={work.title} author={work.author} coverUrl={work.coverUrl} />
      <div>
        <Badge>Leitura atual</Badge>
        <h2 className="mt-2 font-display text-2xl">{work.title}</h2>
        <p className="text-sm text-muted-foreground">{work.author}</p>
        {work.synopsis ? <p className="mt-3 text-sm leading-relaxed">{work.synopsis}</p> : null}
        <div className="mt-4">
          <p className="mb-2 text-xs tracking-[0.16em] text-muted-foreground uppercase">Seu progresso</p>
          <Slider
            min={0}
            max={max}
            value={[mine]}
            onValueChange={(v) => setMine(v[0] ?? 0)}
            onValueCommit={(v) => save.mutate(v[0] ?? 0)}
          />
        </div>
        <ul className="mt-5 space-y-3">
          {rows.map((r) => {
            const pct = percentOf(r.progress, work.totalUnits, false) ?? 0;
            return (
              <li key={r.userId}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span>{r.displayName}</span>
                  <span className="tabular-nums text-muted-foreground">{r.progress}/{work.totalUnits || "—"}</span>
                </div>
                <Progress value={pct} />
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}

function Talk({
  clubId,
  workId,
  posts,
}: {
  clubId: string;
  workId: string | null;
  posts: Awaited<ReturnType<typeof listPosts>>;
}) {
  const qc = useQueryClient();
  const [body, setBody] = useState("");
  const [spoiler, setSpoiler] = useState(false);
  const send = useMutation({
    mutationFn: () => createPost({ data: { clubId, workId, body, spoiler } }),
    onSuccess: () => {
      setBody("");
      setSpoiler(false);
      void qc.invalidateQueries({ queryKey: ["posts", clubId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <form
        className="space-y-3 rounded-xl bg-card p-4 paper-shadow"
        onSubmit={(e) => {
          e.preventDefault();
          send.mutate();
        }}
      >
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Comente a leitura atual. Marque spoiler se passar do ponto combinado."
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={spoiler} onCheckedChange={setSpoiler} />
            Contém spoiler
          </label>
          <Button type="submit" disabled={!body.trim() || send.isPending} size="sm">
            Publicar
          </Button>
        </div>
      </form>
      <ul className="space-y-3">
        {posts.map((p) => (
          <li key={p.id}>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground">
                {p.displayName} · {new Date(p.createdAt).toLocaleString("pt-BR")}
              </p>
              {p.spoiler ? <SpoilerText text={p.body} /> : <p className="mt-2 whitespace-pre-wrap text-sm">{p.body}</p>}
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SpoilerText({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="mt-2 text-sm text-muted-foreground underline-offset-4 hover:underline">
        Revelar spoiler
      </button>
    );
  }
  return <p className="mt-2 whitespace-pre-wrap text-sm">{text}</p>;
}

function Noms({
  clubId,
  works,
  isAdmin,
  mode,
}: {
  clubId: string;
  works: ClubWork[];
  isAdmin: boolean;
  mode: SelectionMode;
}) {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [format, setFormat] = useState<Format>("book");
  const [total, setTotal] = useState("");

  const nom = useMutation({
    mutationFn: () =>
      nominateWork({
        data: { clubId, title, author, format, totalUnits: total ? Number(total) : undefined },
      }),
    onSuccess: () => {
      setTitle("");
      setAuthor("");
      setTotal("");
      void qc.invalidateQueries({ queryKey: ["works", clubId] });
      toast.success("Indicação enviada");
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const vote = useMutation({
    mutationFn: (workId: string) => toggleVote({ data: { clubId, workId } }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["works", clubId] }),
  });
  const pick = useMutation({
    mutationFn: (workId: string) => setCurrentWork({ data: { clubId, workId } }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["works", clubId] });
      toast.success("Leitura definida");
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const raffle = useMutation({
    mutationFn: () => raffleWork({ data: { clubId } }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["works", clubId] });
      toast.success("Sorteio feito");
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const close = useMutation({
    mutationFn: () => closeVote({ data: { clubId } }),
    onSuccess: (r) => {
      void qc.invalidateQueries({ queryKey: ["works", clubId] });
      toast.success(r.tied ? "Empate: a sorte decidiu" : "Votação encerrada");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const maxVotes = Math.max(1, ...works.map((w) => w.voteCount));

  return (
    <div className="space-y-6">
      {isAdmin ? (
        <div className="flex flex-wrap gap-2">
          {mode === "vote" ? (
            <Button size="sm" onClick={() => close.mutate()} disabled={works.length === 0}>
              Encerrar votação
            </Button>
          ) : null}
          {mode === "raffle" ? (
            <Button size="sm" onClick={() => raffle.mutate()} disabled={works.length === 0}>
              Sortear
            </Button>
          ) : null}
        </div>
      ) : null}
      <ul className="space-y-3">
        {works.map((w) => (
          <li key={w.id}>
            <Card className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{w.title}</p>
                  <p className="text-sm text-muted-foreground">{w.author || "Autor não informado"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Indicada por {w.nominatedByName}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {mode === "vote" ? (
                    <Button size="sm" variant={w.votedByMe ? "default" : "outline"} onClick={() => vote.mutate(w.id)}>
                      {w.voteCount} {w.votedByMe ? "seu voto" : "votar"}
                    </Button>
                  ) : null}
                  {isAdmin && mode === "curator" ? (
                    <Button size="sm" onClick={() => pick.mutate(w.id)}>
                      Escolher
                    </Button>
                  ) : null}
                </div>
              </div>
              {mode === "vote" ? (
                <Progress className="mt-3" value={Math.round((w.voteCount / maxVotes) * 100)} />
              ) : null}
            </Card>
          </li>
        ))}
      </ul>
      <Card className="space-y-3 p-4">
        <p className="font-display text-lg">Indicar uma obra</p>
        <Input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input placeholder="Autor" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
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
          <Input placeholder={formatMeta[format].unitLabel} value={total} onChange={(e) => setTotal(e.target.value)} />
        </div>
        <Button disabled={!title.trim() || nom.isPending} onClick={() => nom.mutate()}>
          Enviar indicação
        </Button>
      </Card>
    </div>
  );
}

function Admin({
  clubId,
  name,
  description,
  mode,
  limit,
  role,
}: {
  clubId: string;
  name: string;
  description: string;
  mode: SelectionMode;
  limit: number;
  role: string;
}) {
  const qc = useQueryClient();
  const nav = useNavigate();
  const [n, setN] = useState(name);
  const [d, setD] = useState(description);
  const [m, setM] = useState(mode);
  const [lim, setLim] = useState(String(limit));
  const save = useMutation({
    mutationFn: () =>
      updateClub({
        data: { clubId, name: n, description: d, selectionMode: m, memberLimit: Number(lim) || 40 },
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["club", clubId] });
      toast.success("Clube atualizado");
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const wipe = useMutation({
    mutationFn: () => deleteClub({ data: { clubId } }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["clubs"] });
      void nav({ to: "/app/clubs" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-1.5">
        <Label>Nome</Label>
        <Input value={n} onChange={(e) => setN(e.target.value)} />
      </div>
      <div className="grid gap-1.5">
        <Label>Descrição</Label>
        <Textarea value={d} onChange={(e) => setD(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label>Método</Label>
          <Select value={m} onValueChange={(v) => setM(v as SelectionMode)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SELECTION_MODES.map((x) => (
                <SelectItem key={x} value={x}>
                  {selectionMeta[x].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label>Limite de membros</Label>
          <Input value={lim} onChange={(e) => setLim(e.target.value)} inputMode="numeric" />
        </div>
      </div>
      <Button onClick={() => save.mutate()} disabled={save.isPending}>
        Salvar ajustes
      </Button>
      {role === "owner" ? (
        <Button variant="destructive" onClick={() => wipe.mutate()}>
          Apagar clube
        </Button>
      ) : null}
    </div>
  );
}

function Leave({ clubId }: { clubId: string }) {
  const nav = useNavigate();
  const leave = useMutation({
    mutationFn: () => leaveClub({ data: { clubId } }),
    onSuccess: () => void nav({ to: "/app/clubs" }),
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <Button variant="outline" className="mt-4" onClick={() => leave.mutate()}>
      Sair do clube
    </Button>
  );
}
