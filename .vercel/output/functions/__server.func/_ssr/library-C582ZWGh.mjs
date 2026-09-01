import { o as __toESM } from "../_runtime.mjs";
import { a as formatMeta, c as progressLabel, i as STATUSES, o as percentOf, t as FORMATS, u as statusMeta } from "./formats-jvG5fuHm.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as Trash2, c as Plus, o as Search } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Cover } from "./cover-dshU3l_C.mjs";
import { t as Button } from "./button-DeZLCCCG.mjs";
import { t as Input } from "./label-TZSlR7cg.mjs";
import { t as Progress } from "./switch-weiBYwYQ.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BwAq5yX9.mjs";
import { t as Skeleton } from "./skeleton-DSVeUbi9.mjs";
import { a as listBooks, n as deleteBook } from "./books-CpBFg8Bl.mjs";
import { t as AddBookDialog } from "./add-book-dialog-DWPwx-4W.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-0dFbArGK.mjs";
import { t as deleteLocalFile } from "./idb-DCH0hIyx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library-C582ZWGh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LibraryPage() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [q, setQ] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [format, setFormat] = (0, import_react.useState)("all");
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const qc = useQueryClient();
	const booksQ = useQuery({
		queryKey: ["books"],
		queryFn: () => listBooks()
	});
	const filtered = (0, import_react.useMemo)(() => {
		const list = booksQ.data ?? [];
		const query = q.trim().toLowerCase();
		return list.filter((b) => {
			if (status !== "all" && b.status !== status) return false;
			if (format !== "all" && b.format !== format) return false;
			if (!query) return true;
			return `${b.title} ${b.author} ${b.genre ?? ""}`.toLowerCase().includes(query);
		});
	}, [
		booksQ.data,
		q,
		status,
		format
	]);
	const remove = useMutation({
		mutationFn: async (id) => {
			await deleteBook({ data: { id } });
			await deleteLocalFile(id);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["books"] });
			toast.success("Obra removida");
			setPendingDelete(null);
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.2em] text-muted-foreground uppercase",
					children: "Acervo"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-3xl tracking-tight",
					children: "Biblioteca"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Adicionar"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 md:flex-row",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "pl-9",
							placeholder: "Buscar título, autor, gênero",
							value: q,
							onChange: (e) => setQ(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: status,
						onValueChange: (v) => setStatus(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "md:w-40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Todos os status"
						}), STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s,
							children: statusMeta[s].label
						}, s))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: format,
						onValueChange: (v) => setFormat(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "md:w-44",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Todos os formatos"
						}), FORMATS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: f,
							children: formatMeta[f].label
						}, f))] })]
					})
				]
			}),
			booksQ.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5",
				children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "aspect-[2/3] rounded-md" }, i))
			}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-16 text-center text-sm text-muted-foreground",
				children: "Nenhuma obra neste filtro."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5",
				children: filtered.map((b) => {
					const pct = percentOf(b.progress, b.totalUnits, b.ongoing);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "group relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/app/reader/$bookId",
							params: { bookId: b.id },
							className: "block",
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
									children: b.author || formatMeta[b.format].label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-[11px] text-muted-foreground",
									children: [
										statusMeta[b.status].label,
										b.ongoing ? " · Lançamento" : "",
										" ·",
										" ",
										progressLabel(b.progress, b.totalUnits, b.unitType, b.ongoing)
									]
								}),
								pct != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
									className: "mt-2",
									value: pct
								}) : null
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "absolute top-2 right-2 grid size-9 place-items-center rounded-full bg-background/90 text-muted-foreground opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 hover:text-destructive",
							onClick: () => setPendingDelete(b),
							"aria-label": `Remover ${b.title}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
						})]
					}, b.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddBookDialog, {
				open,
				onOpenChange: setOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: Boolean(pendingDelete),
				onOpenChange: (v) => !v && setPendingDelete(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Remover da biblioteca?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [pendingDelete?.title, " sai do acervo. O arquivo local, se houver, também é apagado neste aparelho."] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancelar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
					onClick: () => pendingDelete && remove.mutate(pendingDelete.id),
					children: "Remover"
				})] })] })
			})
		]
	});
}
//#endregion
export { LibraryPage as component };
