import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteAccount, ensureProfile, getMeStats, updateProfile } from "@/lib/api/profile";
import { signOut } from "@/lib/auth/client";
import { useCurrentUser } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/app/profile")({ component: ProfilePage });

function ProfilePage() {
  const user = useCurrentUser();
  const qc = useQueryClient();
  const profileQ = useQuery({ queryKey: ["profile"], queryFn: () => ensureProfile() });
  const statsQ = useQuery({ queryKey: ["me-stats"], queryFn: () => getMeStats() });
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (profileQ.data) {
      setName(profileQ.data.displayName);
      setBio(profileQ.data.bio);
    }
  }, [profileQ.data]);

  const save = useMutation({
    mutationFn: () => updateProfile({ data: { displayName: name, bio } }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Perfil atualizado");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const wipe = useMutation({
    mutationFn: () => deleteAccount(),
    onSuccess: () => {
      toast.success("Conta encerrada");
      void signOut("/");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <header>
        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Conta</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight">Perfil</h1>
      </header>

      <Card className="space-y-4 p-6">
        <div className="grid gap-1.5">
          <Label htmlFor="display">Nome</Label>
          <Input id="display" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={280} />
        </div>
        <p className="text-xs text-muted-foreground">{user?.primaryEmail}</p>
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          Salvar
        </Button>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-[0.16em]">Obras</p>
          <p className="mt-1 font-display text-2xl tabular-nums">{statsQ.data?.books ?? "—"}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-[0.16em]">Clubes</p>
          <p className="mt-1 font-display text-2xl tabular-nums">{statsQ.data?.clubs ?? "—"}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="font-display text-lg">Exclusão da conta</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Remove biblioteca, sessões, clubes que você criou e o cadastro. Esta ação não pode ser
          desfeita (LGPD).
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="mt-4">
              Excluir minha conta
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Encerrar a conta?</AlertDialogTitle>
              <AlertDialogDescription>
                Todos os dados pessoais neste aplicativo serão apagados de forma permanente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Manter conta</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => wipe.mutate()}
              >
                Excluir tudo
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </div>
  );
}
