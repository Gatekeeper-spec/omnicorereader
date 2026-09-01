import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { BarChart3, BookMarked, Radio, Users } from "lucide-react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { user, isPending } = useCurrentUserState();
  if (!isPending && user) return <Navigate to="/app" />;

  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="font-display text-xl tracking-tight">OmniReader</span>
        <Button asChild>
          <Link to="/login">Entrar</Link>
        </Button>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-10 md:grid-cols-[1.1fr_0.9fr] md:py-20">
        <div>
          <p className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
            Clube do livro · tracker · leitor
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.1] tracking-tight md:text-6xl">
            A estante que acompanha o que você lê — e com quem.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            Unifique clubes, biblioteca pessoal e o hábito diário. Livros, mangás, áudios e manuais
            técnicos no mesmo ritmo, com progresso que se adapta ao formato.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/login">Começar a ler</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <a href="#como">Como funciona</a>
            </Button>
          </div>
        </div>
        <HeroShelf />
      </section>

      <section id="como" className="border-t border-border bg-card/50">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
          <Feature
            icon={BookMarked}
            title="Leitor nativo"
            text="PDF, EPUB e áudio no próprio aparelho. Zero upload, retomada exata, cronômetro silencioso."
          />
          <Feature
            icon={Radio}
            title="Formatos vivos"
            text="Páginas, capítulos, minutos ou porcentagem. Obras em lançamento sem teto artificial."
          />
          <Feature
            icon={Users}
            title="Clubes isolados"
            text="Convite por chave, votação, sorteio ou curadoria. Progresso coletivo sem spoilers."
          />
          <Feature
            icon={BarChart3}
            title="Hábitos visíveis"
            text="Ofensivas, páginas, horas e gêneros — um painel calmo para quem gosta de números."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-xl bg-primary px-8 py-12 text-primary-foreground md:px-14">
          <p className="text-xs tracking-[0.2em] uppercase opacity-70">Do romance ao manual</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-4xl">
            Feito para leitores casuais e para quem cataloga normativas em campo.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed opacity-80">
            Consulte um painel elétrico no aeroporto, marque o capítulo do clube no fim do dia, ouça
            um audiolivro no trajeto. O progresso não se perde.
          </p>
          <Button asChild className="mt-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            <Link to="/login">Criar minha biblioteca</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-8 text-center text-xs text-muted-foreground">
        OmniReader · leitura social e gestão de conhecimento
      </footer>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof BookMarked;
  title: string;
  text: string;
}) {
  return (
    <article>
      <div className="grid size-10 place-items-center rounded-lg bg-secondary">
        <Icon className="size-4" />
      </div>
      <h2 className="mt-4 font-display text-xl">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
    </article>
  );
}

function HeroShelf() {
  const spines = [
    { title: "Dom Casmurro", h: "h-56", tone: "bg-primary text-primary-foreground" },
    { title: "Sapiens", h: "h-64", tone: "bg-chart-2 text-primary-foreground" },
    { title: "NR-10", h: "h-52", tone: "bg-foreground text-background" },
    { title: "One Piece", h: "h-60", tone: "bg-chart-3 text-primary-foreground" },
    { title: "1984", h: "h-56", tone: "bg-chart-5 text-primary-foreground" },
  ];
  return (
    <div className="relative mx-auto flex h-80 w-full max-w-md items-end justify-center gap-2 rounded-xl bg-secondary/70 px-6 pb-8 paper-shadow">
      {spines.map((s) => (
        <div
          key={s.title}
          className={`flex ${s.h} w-10 items-center justify-center rounded-sm ${s.tone} shadow-sm md:w-12`}
        >
          <span className="rotate-180 text-[10px] tracking-widest uppercase [writing-mode:vertical-rl]">
            {s.title}
          </span>
        </div>
      ))}
    </div>
  );
}
