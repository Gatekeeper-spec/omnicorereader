import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { joinClub } from "@/lib/api/clubs";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/join/$code")({ component: JoinPage });

function JoinPage() {
  const { code } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const nav = useNavigate();
  const join = useMutation({
    mutationFn: () => joinClub({ data: { code } }),
    onSuccess: (club) => {
      void nav({ to: "/app/clubs/$clubId", params: { clubId: club.id } });
    },
  });

  useEffect(() => {
    if (user && !join.isPending && !join.isSuccess && !join.isError) join.mutate();
  }, [user]);

  if (isPending) return <div className="grid min-h-dvh place-items-center text-sm">Abrindo convite…</div>;
  if (!user) return <RedirectToSignIn />;

  return (
    <main className="grid min-h-dvh place-items-center px-6">
      <div className="max-w-sm text-center">
        <h1 className="font-display text-3xl">Convite {code}</h1>
        {join.isError ? (
          <>
            <p className="mt-3 text-sm text-destructive">
              {join.error instanceof Error ? join.error.message : "Não foi possível entrar."}
            </p>
            <Button asChild className="mt-6">
              <Link to="/app/clubs">Ir aos clubes</Link>
            </Button>
          </>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">Entrando no clube…</p>
        )}
      </div>
    </main>
  );
}
