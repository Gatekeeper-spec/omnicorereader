import { o as __toESM } from "../_runtime.mjs";
import { n as PRIORITIES, s as priorityMeta } from "./formats-jvG5fuHm.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { C as ArrowRight, c as Plus } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Card } from "./card-EWUJUN9N.mjs";
import { t as Cover } from "./cover-dshU3l_C.mjs";
import { t as Button } from "./button-DeZLCCCG.mjs";
import { n as Label, t as Input } from "./label-TZSlR7cg.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BwAq5yX9.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-BQ1oX6Ns.mjs";
import { i as listWishlist, n as convertWishlist, r as deleteWishlist, t as addWishlist } from "./catalog-DRL3qH3i.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wishlist-CMfEiKwX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WishlistPage() {
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)("");
	const [author, setAuthor] = (0, import_react.useState)("");
	const [priority, setPriority] = (0, import_react.useState)("medium");
	const [price, setPrice] = (0, import_react.useState)("");
	const listQ = useQuery({
		queryKey: ["wishlist"],
		queryFn: () => listWishlist()
	});
	const add = useMutation({
		mutationFn: () => addWishlist({ data: {
			title,
			author,
			priority,
			estimatedPrice: price ? Number(price) : null
		} }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["wishlist"] });
			setOpen(false);
			setTitle("");
			setAuthor("");
			setPrice("");
			toast.success("Adicionado à lista");
		},
		onError: (e) => toast.error(e.message)
	});
	const convert = useMutation({
		mutationFn: (id) => convertWishlist({ data: { id } }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["wishlist"] });
			qc.invalidateQueries({ queryKey: ["books"] });
			toast.success("Foi para a biblioteca");
		},
		onError: (e) => toast.error(e.message)
	});
	const remove = useMutation({
		mutationFn: (id) => deleteWishlist({ data: { id } }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["wishlist"] });
		}
	});
	const items = listQ.data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.2em] text-muted-foreground uppercase",
					children: "Aquisições"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-3xl tracking-tight",
					children: "Lista de desejos"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Desejo"]
				})]
			}),
			items.length === 0 && !listQ.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-10 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl",
					children: "Nada na lista"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Guarde títulos para comprar depois."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "flex items-center gap-4 p-3 md:p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cover, {
							title: item.title,
							author: item.author,
							coverUrl: item.coverUrl,
							className: "w-14 shrink-0"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-medium",
									children: item.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm text-muted-foreground",
									children: item.author
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: [
										"Prioridade ",
										priorityMeta[item.priority].label,
										item.estimatedPrice != null ? ` · R$ ${item.estimatedPrice}` : ""
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => convert.mutate(item.id),
								children: ["Biblioteca", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => remove.mutate(item.id),
								children: "Remover"
							})]
						})
					]
				}) }, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Novo desejo" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "w-title",
									children: "Título"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "w-title",
									value: title,
									onChange: (e) => setTitle(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "w-author",
									children: "Autor"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "w-author",
									value: author,
									onChange: (e) => setAuthor(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Prioridade" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: priority,
										onValueChange: (v) => setPriority(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PRIORITIES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: p,
											children: priorityMeta[p].label
										}, p)) })]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "w-price",
										children: "Preço estimado (R$)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "w-price",
										inputMode: "numeric",
										value: price,
										onChange: (e) => setPrice(e.target.value)
									})]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setOpen(false),
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: !title.trim() || add.isPending,
						onClick: () => add.mutate(),
						children: "Salvar"
					})] })
				] })
			})
		]
	});
}
//#endregion
export { WishlistPage as component };
