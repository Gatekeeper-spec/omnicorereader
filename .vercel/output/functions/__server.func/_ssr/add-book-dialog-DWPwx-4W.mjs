import { o as __toESM } from "../_runtime.mjs";
import { a as formatMeta, t as FORMATS } from "./formats-jvG5fuHm.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { o as Search } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Cover } from "./cover-dshU3l_C.mjs";
import { t as Button } from "./button-DeZLCCCG.mjs";
import { n as Label, t as Input } from "./label-TZSlR7cg.mjs";
import { n as Switch } from "./switch-weiBYwYQ.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BwAq5yX9.mjs";
import { t as createBook } from "./books-CpBFg8Bl.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BQ1oX6Ns.mjs";
import { a as searchCatalog } from "./catalog-DRL3qH3i.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/add-book-dialog-DWPwx-4W.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AddBookDialog({ open, onOpenChange, onCreated }) {
	const qc = useQueryClient();
	const [q, setQ] = (0, import_react.useState)("");
	const [hits, setHits] = (0, import_react.useState)([]);
	const [searching, setSearching] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)("");
	const [author, setAuthor] = (0, import_react.useState)("");
	const [format, setFormat] = (0, import_react.useState)("book");
	const [total, setTotal] = (0, import_react.useState)("");
	const [genre, setGenre] = (0, import_react.useState)("");
	const [coverUrl, setCoverUrl] = (0, import_react.useState)("");
	const [isbn, setIsbn] = (0, import_react.useState)("");
	const [year, setYear] = (0, import_react.useState)("");
	const [ongoing, setOngoing] = (0, import_react.useState)(false);
	function applyHit(hit) {
		setTitle(hit.title);
		setAuthor(hit.author);
		setCoverUrl(hit.coverUrl ?? "");
		setIsbn(hit.isbn ?? "");
		setYear(hit.year ? String(hit.year) : "");
		setGenre(hit.categories[0] ?? "");
		if (hit.pageCount) setTotal(String(hit.pageCount));
	}
	const save = useMutation({
		mutationFn: () => createBook({ data: {
			title,
			author,
			format,
			coverUrl: coverUrl || void 0,
			isbn: isbn || void 0,
			genre: genre || void 0,
			year: year ? Number(year) : null,
			totalUnits: total ? Number(total) : void 0,
			ongoing,
			status: "to_read"
		} }),
		onSuccess: (book) => {
			qc.invalidateQueries({ queryKey: ["books"] });
			toast.success("Obra adicionada à biblioteca");
			onOpenChange(false);
			onCreated?.(book.id);
			setTitle("");
			setAuthor("");
			setHits([]);
			setQ("");
		},
		onError: (e) => toast.error(e.message)
	});
	async function onSearch(e) {
		e.preventDefault();
		if (q.trim().length < 2) return;
		setSearching(true);
		try {
			const res = await searchCatalog({ data: { q } });
			setHits(res);
			if (res.length === 0) toast.message("Nenhum resultado. Preencha manualmente.");
		} catch {
			toast.error("Não foi possível buscar metadados.");
		} finally {
			setSearching(false);
		}
	}
	const meta = formatMeta[format];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90dvh] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Nova obra" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Busque por título ou ISBN, ou cadastre na mão." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: onSearch,
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Título, autor ou ISBN",
						"aria-label": "Buscar no catálogo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						variant: "secondary",
						disabled: searching,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" }), searching ? "…" : "Buscar"]
					})]
				}),
				hits.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid max-h-40 gap-2 overflow-y-auto",
					children: hits.map((hit, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => applyHit(hit),
						className: "flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cover, {
							title: hit.title,
							author: hit.author,
							coverUrl: hit.coverUrl,
							className: "h-14 w-auto"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-sm font-medium",
								children: hit.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-xs text-muted-foreground",
								children: hit.author
							})]
						})]
					}) }, `${hit.title}-${i}`))
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "title",
								children: "Título"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "title",
								value: title,
								onChange: (e) => setTitle(e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "author",
								children: "Autor"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "author",
								value: author,
								onChange: (e) => setAuthor(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Formato" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: format,
									onValueChange: (v) => setFormat(v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: FORMATS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: f,
										children: formatMeta[f].label
									}, f)) })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "total",
									children: meta.unitLabel
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "total",
									inputMode: "numeric",
									value: total,
									onChange: (e) => setTotal(e.target.value),
									disabled: ongoing
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "genre",
									children: "Gênero"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "genre",
									value: genre,
									onChange: (e) => setGenre(e.target.value)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "year",
									children: "Ano"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "year",
									inputMode: "numeric",
									value: year,
									onChange: (e) => setYear(e.target.value)
								})]
							})]
						}),
						format === "manga" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center justify-between gap-3 rounded-lg bg-muted px-3 py-2 text-sm",
							children: ["Em lançamento", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: ongoing,
								onCheckedChange: setOngoing
							})]
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: !title.trim() || save.isPending,
					onClick: () => save.mutate(),
					children: save.isPending ? "Salvando…" : "Adicionar"
				})] })
			]
		})
	});
}
//#endregion
export { AddBookDialog as t };
