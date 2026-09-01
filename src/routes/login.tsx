import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  if (!isPending && user) return <Navigate to="/app" />;

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between bg-primary px-12 py-12 text-primary-foreground lg:flex">
        <Link to="/" className="font-display text-2xl">
          OmniReader
        </Link>
        <div className="max-w-md">
          <p className="font-display text-4xl leading-tight">
            “Ler é sonhar pela mão de outrem.”
          </p>
          <p className="mt-4 text-sm tracking-[0.18em] uppercase opacity-70">Fernando Pessoa</p>
        </div>
        <p className="text-sm opacity-70">Biblioteca pessoal, clubes e hábitos — no mesmo lugar.</p>
      </section>
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 block font-display text-2xl lg:hidden">
            OmniReader
          </Link>
          <h1 className="font-display text-3xl tracking-tight">Entrar</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sua estante, seus clubes, seu ritmo.
          </p>
          {authEnabled ? (
            <div className="mt-8 space-y-3">
              {GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => void signIn(p.providerId, { callbackURL: "/app" })}
                >
                  Continuar com {p.label}
                </Button>
              ))}
              <div className="flex items-center gap-3 py-2 text-xs tracking-[0.18em] text-muted-foreground uppercase">
                <span className="h-px flex-1 bg-border" />
                ou e-mail
                <span className="h-px flex-1 bg-border" />
              </div>
              <EmailAuth />
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">O acesso está desativado.</p>
          )}
        </div>
      </section>
    </main>
  );
}

function EmailAuth() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: name.trim() || email.split("@")[0]!,
          callbackURL: "/app",
        });
        if (err) throw new Error(err.message ?? "Não foi possível criar a conta.");
      } else {
        const { error: err } = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/app",
        });
        if (err) throw new Error(err.message ?? "E-mail ou senha inválidos.");
      }
      window.location.href = "/app";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no acesso.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Tabs value={mode} onValueChange={(v) => setMode(v as "in" | "up")}>
      <TabsList className="w-full">
        <TabsTrigger value="in" className="flex-1">
          Entrar
        </TabsTrigger>
        <TabsTrigger value="up" className="flex-1">
          Criar conta
        </TabsTrigger>
      </TabsList>
      <TabsContent value={mode}>
        <form onSubmit={submit} className="grid gap-3">
          {mode === "up" ? (
            <div className="grid gap-1.5">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </div>
          ) : null}
          <div className="grid gap-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "up" ? "new-password" : "current-password"}
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Aguarde…" : mode === "up" ? "Criar conta" : "Entrar"}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}
