import { o as __toESM } from "../_runtime.mjs";
import { c as progressLabel, l as selectionMeta, o as percentOf } from "./formats-jvG5fuHm.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { c as Plus, p as Flame } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as useCurrentUser } from "./use-current-user-DG6UNzh9.mjs";
import { t as Card } from "./card-EWUJUN9N.mjs";
import { t as Cover } from "./cover-dshU3l_C.mjs";
import { t as Button } from "./button-DeZLCCCG.mjs";
import { t as Progress } from "./switch-weiBYwYQ.mjs";
import { l as listClubs } from "./clubs-KtP5dkox.mjs";
import { t as Skeleton } from "./skeleton-DSVeUbi9.mjs";
import { a as listBooks, r as getAnalytics } from "./books-CpBFg8Bl.mjs";
import { t as AddBookDialog } from "./add-book-dialog-DWPwx-4W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-DLb1H2gY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppHome() {
	const user = useCurrentUser();
	const [open, setOpen] = (0, import_react.useState)(false);
	const booksQ = useQuery({
		queryKey: ["books"],
		queryFn: () => listBooks()
	});
	const statsQ = useQuery({
		queryKey: ["analytics"],
		queryFn: () => getAnalytics()
	});
	const clubsQ = useQuery({
		queryKey: ["clubs"],
		queryFn: () => listClubs()
	});
	const reading = (booksQ.data ?? []).filter((b) => b.status === "reading");
	const first = user?.displayName?.split(" ")[0] ?? "olá";
	const stats = statsQ.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.2em] text-muted-foreground uppercase",
					children: "Leitura solo"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-1 font-display text-3xl tracking-tight md:text-4xl",
					children: [
						"Bom retorno, ",
						first,
						"."
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Nova obra"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Ofensiva",
						value: statsQ.isPending ? "—" : `${stats?.streak ?? 0} dias`,
						icon: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Nesta semana",
						value: statsQ.isPending ? "—" : `${stats?.minutesThisWeek ?? 0} min`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Lendo agora",
						value: statsQ.isPending ? "—" : String(stats?.booksReading ?? 0)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-baseline justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Continuar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/library",
					className: "text-sm text-muted-foreground hover:text-foreground",
					children: "Biblioteca"
				})]
			}), booksQ.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-4",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "aspect-[2/3] rounded-md" }, i))
			}) : reading.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl",
						children: "Nada em andamento"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Adicione uma obra ou retome a estante."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4",
						onClick: () => setOpen(true),
						children: "Começar uma leitura"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-4 md:grid-cols-4",
				children: reading.slice(0, 4).map((b) => {
					const pct = percentOf(b.progress, b.totalUnits, b.ongoing);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/app/reader/$bookId",
						params: { bookId: b.id },
						className: "group",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cover, {
								title: b.title,
								author: b.author,
								coverUrl: b.coverUrl
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 truncate text-sm font-medium",
								children: b.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs text-muted-foreground",
								children: progressLabel(b.progress, b.totalUnits, b.unitType, b.ongoing)
							}),
							pct != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
								className: "mt-2",
								value: pct
							}) : null
						]
					}, b.id);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-baseline justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Clubes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/clubs",
					className: "text-sm text-muted-foreground hover:text-foreground",
					children: "Ver todos"
				})]
			}), clubsQ.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }) : (clubsQ.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Crie um clube ou entre com um código de convite."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: (clubsQ.data ?? []).slice(0, 4).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/clubs/$clubId",
					params: { clubId: c.id },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5 transition-shadow paper-shadow-hover",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg",
							children: c.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: [
								c.memberCount,
								" ",
								c.memberCount === 1 ? "membro" : "membros",
								" · ",
								selectionMeta[c.selectionMode].label
							]
						})]
					})
				}, c.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddBookDialog, {
				open,
				onOpenChange: setOpen
			})
		]
	});
}
function StatCard({ label, value, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "flex items-center gap-1.5 text-xs tracking-[0.16em] text-muted-foreground uppercase",
			children: [icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-3.5" }) : null, label]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 font-display text-2xl tabular-nums",
			children: value
		})]
	});
}
//#endregion
export { AppHome as component };
