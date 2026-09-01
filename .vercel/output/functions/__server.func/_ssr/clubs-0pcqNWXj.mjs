import { o as __toESM } from "../_runtime.mjs";
import { l as selectionMeta, r as SELECTION_MODES } from "./formats-jvG5fuHm.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { c as Plus } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Card } from "./card-EWUJUN9N.mjs";
import { t as Button } from "./button-DeZLCCCG.mjs";
import { n as Label, t as Input } from "./label-TZSlR7cg.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BwAq5yX9.mjs";
import { t as Textarea } from "./textarea-CZUa0RVX.mjs";
import { l as listClubs, n as createClub, o as joinClub } from "./clubs-KtP5dkox.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-BQ1oX6Ns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/clubs-0pcqNWXj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ClubsPage() {
	const qc = useQueryClient();
	const listQ = useQuery({
		queryKey: ["clubs"],
		queryFn: () => listClubs()
	});
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [joinOpen, setJoinOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [mode, setMode] = (0, import_react.useState)("vote");
	const [code, setCode] = (0, import_react.useState)("");
	const create = useMutation({
		mutationFn: () => createClub({ data: {
			name,
			description,
			selectionMode: mode
		} }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["clubs"] });
			setCreateOpen(false);
			setName("");
			setDescription("");
			toast.success("Clube criado");
		},
		onError: (e) => toast.error(e.message)
	});
	const join = useMutation({
		mutationFn: () => joinClub({ data: { code } }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["clubs"] });
			setJoinOpen(false);
			setCode("");
			toast.success("Você entrou no clube");
		},
		onError: (e) => toast.error(e.message)
	});
	const clubs = listQ.data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.2em] text-muted-foreground uppercase",
					children: "Social"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-3xl tracking-tight",
					children: "Clubes"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setJoinOpen(true),
						children: "Entrar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => setCreateOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Criar"]
					})]
				})]
			}),
			clubs.length === 0 && !listQ.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-10 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl",
					children: "Nenhum clube ainda"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Crie um espaço privado ou use um código de convite."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-3 md:grid-cols-2",
				children: clubs.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/clubs/$clubId",
					params: { clubId: c.id },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5 transition-shadow paper-shadow-hover",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xl",
								children: c.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 line-clamp-2 text-sm text-muted-foreground",
								children: c.description || "Sem descrição"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-xs text-muted-foreground",
								children: [
									c.memberCount,
									" ",
									c.memberCount === 1 ? "membro" : "membros",
									" ·",
									" ",
									selectionMeta[c.selectionMode].label,
									" · chave ",
									c.inviteCode
								]
							})
						]
					})
				}) }, c.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: createOpen,
				onOpenChange: setCreateOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Novo clube" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "c-name",
									children: "Nome"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "c-name",
									value: name,
									onChange: (e) => setName(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "c-desc",
									children: "Descrição"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "c-desc",
									value: description,
									onChange: (e) => setDescription(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Escolha da próxima leitura" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: mode,
										onValueChange: (v) => setMode(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: SELECTION_MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: m,
											children: selectionMeta[m].label
										}, m)) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: selectionMeta[mode].hint
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setCreateOpen(false),
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: name.trim().length < 2 || create.isPending,
						onClick: () => create.mutate(),
						children: "Criar clube"
					})] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: joinOpen,
				onOpenChange: setJoinOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Entrar com convite" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "code",
							children: "Código"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "code",
							value: code,
							onChange: (e) => setCode(e.target.value.toUpperCase()),
							placeholder: "ABC123",
							className: "tracking-[0.3em] uppercase"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setJoinOpen(false),
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: code.trim().length < 4 || join.isPending,
						onClick: () => join.mutate(),
						children: "Entrar"
					})] })
				] })
			})
		]
	});
}
//#endregion
export { ClubsPage as component };
