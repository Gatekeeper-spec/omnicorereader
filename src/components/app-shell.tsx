import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { BarChart3, BookOpen, Bookmark, House, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { ensureProfile } from "@/lib/api/profile";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";
import { AccountMenu } from "./account-menu";

const nav: { to: "/app" | "/app/library" | "/app/clubs" | "/app/analytics" | "/app/wishlist"; label: string; icon: typeof House; exact?: boolean }[] = [
  { to: "/app", label: "Início", icon: House, exact: true },
  { to: "/app/library", label: "Biblioteca", icon: BookOpen },
  { to: "/app/clubs", label: "Clubes", icon: Users },
  { to: "/app/analytics", label: "Dados", icon: BarChart3 },
  { to: "/app/wishlist", label: "Desejos", icon: Bookmark },
];

export function AppShell() {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) {
      setReady(false);
      return;
    }
    let cancelled = false;
    void ensureProfile()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (isPending || (user && !ready)) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  const isReader = pathname.includes("/reader/");

  if (isReader) {
    return (
      <div className="min-h-dvh bg-reader text-reader-foreground">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-dvh">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-sidebar-border bg-sidebar px-3 py-6 md:flex">
        <Link to="/app" className="mb-8 px-3">
          <span className="font-display text-xl tracking-tight">OmniReader</span>
          <span className="mt-0.5 block text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            Biblioteca
          </span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                  active ? "bg-card text-foreground paper-shadow" : "text-muted-foreground hover:bg-card/70 hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-2 pt-4">
          <AccountMenu />
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur md:hidden">
        <Link to="/app" className="font-display text-lg">
          OmniReader
        </Link>
        <AccountMenu />
      </header>

      <main className="md:pl-56">
        <div className="mx-auto max-w-5xl px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-10">
          <Outlet />
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-5">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-0.5 text-[10px] font-medium",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
