import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAnalytics } from "@/lib/api/books";
import { formatMeta } from "@/lib/formats";

export const Route = createFileRoute("/app/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  const q = useQuery({ queryKey: ["analytics"], queryFn: () => getAnalytics() });
  const data = q.data;

  if (q.isPending || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  const chart = data.last14.map((d) => ({
    ...d,
    label: d.day.slice(8),
  }));

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Hábitos</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight">Painel</h1>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Metric label="Páginas" value={data.pages} />
        <Metric label="Capítulos" value={data.chapters} />
        <Metric label="Minutos" value={data.minutes} />
        <Metric label="Ofensiva" value={data.streak} suffix="dias" />
      </div>

      <Card className="p-5">
        <h2 className="font-display text-lg">Últimos 14 dias</h2>
        <p className="text-sm text-muted-foreground">Minutos registrados por dia</p>
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart}>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} width={32} />
              <Tooltip
                cursor={{ fill: "var(--color-muted)" }}
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="minutes" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-display text-lg">Por formato</h2>
          <ul className="mt-4 space-y-3">
            {data.byFormat.length === 0 ? (
              <li className="text-sm text-muted-foreground">Sem dados ainda.</li>
            ) : (
              data.byFormat.map((row) => (
                <li key={row.format} className="flex items-center justify-between text-sm">
                  <span>{formatMeta[row.format].label}</span>
                  <span className="tabular-nums text-muted-foreground">{row.count}</span>
                </li>
              ))
            )}
          </ul>
        </Card>
        <Card className="p-5">
          <h2 className="font-display text-lg">Gêneros</h2>
          <ul className="mt-4 space-y-3">
            {data.byGenre.length === 0 ? (
              <li className="text-sm text-muted-foreground">Cadastre gêneros nas obras.</li>
            ) : (
              data.byGenre.map((row) => (
                <li key={row.genre} className="flex items-center justify-between text-sm">
                  <span>{row.genre}</span>
                  <span className="tabular-nums text-muted-foreground">{row.count}</span>
                </li>
              ))
            )}
          </ul>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground">
        Melhor ofensiva: {data.bestStreak} dias · {data.booksFinished} obras concluídas
      </p>
    </div>
  );
}

function Metric({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <Card className="p-5">
      <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">{label}</p>
      <p className="mt-2 font-display text-2xl tabular-nums">
        {value.toLocaleString("pt-BR")}
        {suffix ? <span className="ml-1 text-base text-muted-foreground">{suffix}</span> : null}
      </p>
    </Card>
  );
}
