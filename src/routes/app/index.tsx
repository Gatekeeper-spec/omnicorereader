import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Plus } from "lucide-react";
import { useState } from "react";
import { AddBookDialog } from "@/components/add-book-dialog";
import { Cover } from "@/components/cover";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getAnalytics, listBooks } from "@/lib/api/books";
import { listClubs } from "@/lib/api/clubs";
import { percentOf, progressLabel, selectionMeta } from "@/lib/formats";
import { useCurrentUser } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/app/")({ component: AppHome });

function AppHome() {
  const user = useCurrentUser();
  const [open, setOpen] = useState(false);
  const booksQ = useQuery({ queryKey: ["books"], queryFn: () => listBooks() });
  const statsQ = useQuery({ queryKey: ["analytics"], queryFn: () => getAnalytics() });
  const clubsQ = useQuery({ queryKey: ["clubs"], queryFn: () => listClubs() });

  const reading = (booksQ.data ?? []).filter((b) => b.status === "reading");
  const first = user?.displayName?.split(" ")[0] ?? "olá";
  const stats = statsQ.data;

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Leitura solo</p>
          <h1 className="mt-1 font-display text-3xl tracking-tight md:text-4xl">Bom retorno, {first}.</h1>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Nova obra
        </Button>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Ofensiva"
          value={statsQ.isPending ? "—" : `${stats?.streak ?? 0} dias`}
          icon
        />
        <StatCard
          label="Nesta semana"
          value={statsQ.isPending ? "—" : `${stats?.minutesThisWeek ?? 0} min`}
        />
        <StatCard
          label="Lendo agora"
          value={statsQ.isPending ? "—" : String(stats?.booksReading ?? 0)}
        />
      </div>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-display text-xl">Continuar</h2>
          <Link to="/app/library" className="text-sm text-muted-foreground hover:text-foreground">
            Biblioteca
          </Link>
        </div>
        {booksQ.isPending ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] rounded-md" />
            ))}
          </div>
        ) : reading.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="font-display text-xl">Nada em andamento</p>
            <p className="mt-1 text-sm text-muted-foreground">Adicione uma obra ou retome a estante.</p>
            <Button className="mt-4" onClick={() => setOpen(true)}>
              Começar uma leitura
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {reading.slice(0, 4).map((b) => {
              const pct = percentOf(b.progress, b.totalUnits, b.ongoing);
              return (
                <Link key={b.id} to="/app/reader/$bookId" params={{ bookId: b.id }} className="group">
                  <Cover title={b.title} author={b.author} coverUrl={b.coverUrl} />
                  <p className="mt-2 truncate text-sm font-medium">{b.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {progressLabel(b.progress, b.totalUnits, b.unitType, b.ongoing)}
                  </p>
                  {pct != null ? <Progress className="mt-2" value={pct} /> : null}
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-display text-xl">Clubes</h2>
          <Link to="/app/clubs" className="text-sm text-muted-foreground hover:text-foreground">
            Ver todos
          </Link>
        </div>
        {clubsQ.isPending ? (
          <Skeleton className="h-24 rounded-xl" />
        ) : (clubsQ.data ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">Crie um clube ou entre com um código de convite.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {(clubsQ.data ?? []).slice(0, 4).map((c) => (
              <Link key={c.id} to="/app/clubs/$clubId" params={{ clubId: c.id }}>
                <Card className="p-5 transition-shadow paper-shadow-hover">
                  <p className="font-display text-lg">{c.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {c.memberCount} {c.memberCount === 1 ? "membro" : "membros"} · {selectionMeta[c.selectionMode].label}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
      <AddBookDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon?: boolean }) {
  return (
    <Card className="p-5">
      <p className="flex items-center gap-1.5 text-xs tracking-[0.16em] text-muted-foreground uppercase">
        {icon ? <Flame className="size-3.5" /> : null}
        {label}
      </p>
      <p className="mt-2 font-display text-2xl tabular-nums">{value}</p>
    </Card>
  );
}

