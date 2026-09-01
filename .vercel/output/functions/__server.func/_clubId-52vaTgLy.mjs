import { o as __toESM } from "./_runtime.mjs";
import { a as formatMeta, l as selectionMeta, o as percentOf, r as SELECTION_MODES, t as FORMATS } from "./_ssr/formats-jvG5fuHm.mjs";
import { t as cva } from "./_libs/class-variance-authority+clsx.mjs";
import { a as initials, n as cn } from "./_ssr/utils-DMDW2zwJ.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate, v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "./_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { r as Route$1 } from "./_ssr/router-DSLlvk3O.mjs";
import { t as useCurrentUser } from "./_ssr/use-current-user-DG6UNzh9.mjs";
import { n as AvatarFallback, r as AvatarImage, t as Avatar } from "./_ssr/avatar-27rXcILX.mjs";
import { t as Card } from "./_ssr/card-EWUJUN9N.mjs";
import { t as Cover } from "./_ssr/cover-dshU3l_C.mjs";
import { t as Button } from "./_ssr/button-DeZLCCCG.mjs";
import { n as Label, t as Input } from "./_ssr/label-TZSlR7cg.mjs";
import { n as Switch, t as Progress } from "./_ssr/switch-weiBYwYQ.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./_ssr/select-BwAq5yX9.mjs";
import { t as Slider } from "./_ssr/slider-CVSFWB6n.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./_ssr/tabs-D13J5GME.mjs";
import { t as Textarea } from "./_ssr/textarea-CZUa0RVX.mjs";
import { _ as updateClub, a as getClub, c as listClubProgress, d as listPosts, f as listWorks, g as toggleVote, h as setCurrentWork, i as deleteClub, m as raffleWork, p as nominateWork, r as createPost, s as leaveClub, t as closeVote, u as listMembers, v as updateClubProgress } from "./_ssr/clubs-KtP5dkox.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_clubId-52vaTgLy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground",
		secondary: "border-transparent bg-secondary text-secondary-foreground",
		outline: "border-border text-foreground",
		muted: "border-transparent bg-muted text-muted-foreground"
	} },
	defaultVariants: { variant: "muted" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function ClubPage() {
	const { clubId } = Route$1.useParams();
	const clubQ = useQuery({
		queryKey: ["club", clubId],
		queryFn: () => getClub({ data: { clubId } })
	});
	const worksQ = useQuery({
		queryKey: ["works", clubId],
		queryFn: () => listWorks({ data: { clubId } })
	});
	const membersQ = useQuery({
		queryKey: ["members", clubId],
		queryFn: () => listMembers({ data: { clubId } })
	});
	const postsQ = useQuery({
		queryKey: ["posts", clubId],
		queryFn: () => listPosts({ data: { clubId } })
	});
	const club = clubQ.data;
	const works = worksQ.data ?? [];
	const current = works.find((w) => w.status === "current");
	const nominated = works.filter((w) => w.status === "nominated");
	const archived = works.filter((w) => w.status === "archived");
	if (!club) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Carregando clube…"
	});
	const isAdmin = club.role === "owner" || club.role === "admin";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/clubs",
					className: "text-xs tracking-[0.16em] text-muted-foreground uppercase",
					children: "Clubes"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-3xl tracking-tight",
					children: club.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm text-muted-foreground",
					children: club.description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-xs text-muted-foreground",
					children: [
						"Convite ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium tracking-[0.2em] text-foreground",
							children: club.inviteCode
						}),
						" ·",
						" ",
						club.memberCount,
						" membros · ",
						selectionMeta[club.selectionMode].label
					]
				})
			] }),
			current ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrentPanel, {
				clubId,
				work: current
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl",
					children: "Sem leitura coletiva no momento"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Indique uma obra e feche a escolha."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "talk",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "w-full justify-start overflow-x-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "talk",
								children: "Discussão"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "noms",
								children: "Indicações"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "shelf",
								children: "Estante"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "people",
								children: "Membros"
							}),
							isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "admin",
								children: "Ajustes"
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "talk",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Talk, {
							clubId,
							workId: current?.id ?? null,
							posts: postsQ.data ?? []
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "noms",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Noms, {
							clubId,
							works: nominated,
							isAdmin,
							mode: club.selectionMode
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "shelf",
						children: archived.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "O histórico aparece aqui quando uma leitura termina."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "grid grid-cols-2 gap-4 md:grid-cols-4",
							children: archived.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cover, {
									title: w.title,
									author: w.author,
									coverUrl: w.coverUrl
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 truncate text-sm font-medium",
									children: w.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs text-muted-foreground",
									children: w.author
								})
							] }, w.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "people",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border rounded-xl bg-card paper-shadow",
							children: (membersQ.data ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3 px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, { children: [m.avatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
									src: m.avatarUrl,
									alt: ""
								}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, { children: initials(m.displayName) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-medium",
										children: m.displayName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground capitalize",
										children: m.role === "owner" ? "criador" : m.role
									})]
								})]
							}, m.userId))
						})
					}),
					isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "admin",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Admin, {
							clubId,
							name: club.name,
							description: club.description,
							mode: club.selectionMode,
							limit: club.memberLimit,
							role: club.role
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leave, { clubId })
				]
			})
		]
	});
}
function CurrentPanel({ clubId, work }) {
	const qc = useQueryClient();
	const user = useCurrentUser();
	const progressQ = useQuery({
		queryKey: [
			"cprogress",
			clubId,
			work.id
		],
		queryFn: () => listClubProgress({ data: {
			clubId,
			workId: work.id
		} })
	});
	const [mine, setMine] = (0, import_react.useState)(0);
	const save = useMutation({
		mutationFn: (progress) => updateClubProgress({ data: {
			clubId,
			workId: work.id,
			progress
		} }),
		onSuccess: () => void qc.invalidateQueries({ queryKey: [
			"cprogress",
			clubId,
			work.id
		] })
	});
	const max = Math.max(work.totalUnits, 1);
	const rows = progressQ.data ?? [];
	(0, import_react.useEffect)(() => {
		const row = rows.find((r) => r.userId === user?.id);
		if (row) setMine(row.progress);
	}, [rows, user?.id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "grid gap-6 p-5 md:grid-cols-[140px_1fr] md:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cover, {
			title: work.title,
			author: work.author,
			coverUrl: work.coverUrl
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Leitura atual" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 font-display text-2xl",
				children: work.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: work.author
			}),
			work.synopsis ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed",
				children: work.synopsis
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs tracking-[0.16em] text-muted-foreground uppercase",
					children: "Seu progresso"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					min: 0,
					max,
					value: [mine],
					onValueChange: (v) => setMine(v[0] ?? 0),
					onValueCommit: (v) => save.mutate(v[0] ?? 0)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-5 space-y-3",
				children: rows.map((r) => {
					const pct = percentOf(r.progress, work.totalUnits, false) ?? 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex items-center justify-between text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.displayName }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums text-muted-foreground",
							children: [
								r.progress,
								"/",
								work.totalUnits || "—"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: pct })] }, r.userId);
				})
			})
		] })]
	});
}
function Talk({ clubId, workId, posts }) {
	const qc = useQueryClient();
	const [body, setBody] = (0, import_react.useState)("");
	const [spoiler, setSpoiler] = (0, import_react.useState)(false);
	const send = useMutation({
		mutationFn: () => createPost({ data: {
			clubId,
			workId,
			body,
			spoiler
		} }),
		onSuccess: () => {
			setBody("");
			setSpoiler(false);
			qc.invalidateQueries({ queryKey: ["posts", clubId] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-3 rounded-xl bg-card p-4 paper-shadow",
			onSubmit: (e) => {
				e.preventDefault();
				send.mutate();
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				value: body,
				onChange: (e) => setBody(e.target.value),
				placeholder: "Comente a leitura atual. Marque spoiler se passar do ponto combinado."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: spoiler,
						onCheckedChange: setSpoiler
					}), "Contém spoiler"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: !body.trim() || send.isPending,
					size: "sm",
					children: "Publicar"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-3",
			children: posts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						p.displayName,
						" · ",
						new Date(p.createdAt).toLocaleString("pt-BR")
					]
				}), p.spoiler ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpoilerText, { text: p.body }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 whitespace-pre-wrap text-sm",
					children: p.body
				})]
			}) }, p.id))
		})]
	});
}
function SpoilerText({ text }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	if (!open) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: () => setOpen(true),
		className: "mt-2 text-sm text-muted-foreground underline-offset-4 hover:underline",
		children: "Revelar spoiler"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-2 whitespace-pre-wrap text-sm",
		children: text
	});
}
function Noms({ clubId, works, isAdmin, mode }) {
	const qc = useQueryClient();
	const [title, setTitle] = (0, import_react.useState)("");
	const [author, setAuthor] = (0, import_react.useState)("");
	const [format, setFormat] = (0, import_react.useState)("book");
	const [total, setTotal] = (0, import_react.useState)("");
	const nom = useMutation({
		mutationFn: () => nominateWork({ data: {
			clubId,
			title,
			author,
			format,
			totalUnits: total ? Number(total) : void 0
		} }),
		onSuccess: () => {
			setTitle("");
			setAuthor("");
			setTotal("");
			qc.invalidateQueries({ queryKey: ["works", clubId] });
			toast.success("Indicação enviada");
		},
		onError: (e) => toast.error(e.message)
	});
	const vote = useMutation({
		mutationFn: (workId) => toggleVote({ data: {
			clubId,
			workId
		} }),
		onSuccess: () => void qc.invalidateQueries({ queryKey: ["works", clubId] })
	});
	const pick = useMutation({
		mutationFn: (workId) => setCurrentWork({ data: {
			clubId,
			workId
		} }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["works", clubId] });
			toast.success("Leitura definida");
		},
		onError: (e) => toast.error(e.message)
	});
	const raffle = useMutation({
		mutationFn: () => raffleWork({ data: { clubId } }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["works", clubId] });
			toast.success("Sorteio feito");
		},
		onError: (e) => toast.error(e.message)
	});
	const close = useMutation({
		mutationFn: () => closeVote({ data: { clubId } }),
		onSuccess: (r) => {
			qc.invalidateQueries({ queryKey: ["works", clubId] });
			toast.success(r.tied ? "Empate: a sorte decidiu" : "Votação encerrada");
		},
		onError: (e) => toast.error(e.message)
	});
	const maxVotes = Math.max(1, ...works.map((w) => w.voteCount));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [mode === "vote" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: () => close.mutate(),
					disabled: works.length === 0,
					children: "Encerrar votação"
				}) : null, mode === "raffle" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: () => raffle.mutate(),
					disabled: works.length === 0,
					children: "Sortear"
				}) : null]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: works.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: w.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: w.author || "Autor não informado"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: ["Indicada por ", w.nominatedByName]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-end gap-2",
							children: [mode === "vote" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: w.votedByMe ? "default" : "outline",
								onClick: () => vote.mutate(w.id),
								children: [
									w.voteCount,
									" ",
									w.votedByMe ? "seu voto" : "votar"
								]
							}) : null, isAdmin && mode === "curator" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => pick.mutate(w.id),
								children: "Escolher"
							}) : null]
						})]
					}), mode === "vote" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
						className: "mt-3",
						value: Math.round(w.voteCount / maxVotes * 100)
					}) : null]
				}) }, w.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg",
						children: "Indicar uma obra"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Título",
						value: title,
						onChange: (e) => setTitle(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Autor",
						value: author,
						onChange: (e) => setAuthor(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: format,
							onValueChange: (v) => setFormat(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: FORMATS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: f,
								children: formatMeta[f].label
							}, f)) })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: formatMeta[format].unitLabel,
							value: total,
							onChange: (e) => setTotal(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: !title.trim() || nom.isPending,
						onClick: () => nom.mutate(),
						children: "Enviar indicação"
					})
				]
			})
		]
	});
}
function Admin({ clubId, name, description, mode, limit, role }) {
	const qc = useQueryClient();
	const nav = useNavigate();
	const [n, setN] = (0, import_react.useState)(name);
	const [d, setD] = (0, import_react.useState)(description);
	const [m, setM] = (0, import_react.useState)(mode);
	const [lim, setLim] = (0, import_react.useState)(String(limit));
	const save = useMutation({
		mutationFn: () => updateClub({ data: {
			clubId,
			name: n,
			description: d,
			selectionMode: m,
			memberLimit: Number(lim) || 40
		} }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["club", clubId] });
			toast.success("Clube atualizado");
		},
		onError: (e) => toast.error(e.message)
	});
	const wipe = useMutation({
		mutationFn: () => deleteClub({ data: { clubId } }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["clubs"] });
			nav({ to: "/app/clubs" });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nome" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: n,
					onChange: (e) => setN(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Descrição" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: d,
					onChange: (e) => setD(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Método" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: m,
						onValueChange: (v) => setM(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: SELECTION_MODES.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: x,
							children: selectionMeta[x].label
						}, x)) })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Limite de membros" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: lim,
						onChange: (e) => setLim(e.target.value),
						inputMode: "numeric"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => save.mutate(),
				disabled: save.isPending,
				children: "Salvar ajustes"
			}),
			role === "owner" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "destructive",
				onClick: () => wipe.mutate(),
				children: "Apagar clube"
			}) : null
		]
	});
}
function Leave({ clubId }) {
	const nav = useNavigate();
	const leave = useMutation({
		mutationFn: () => leaveClub({ data: { clubId } }),
		onSuccess: () => void nav({ to: "/app/clubs" }),
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		variant: "outline",
		className: "mt-4",
		onClick: () => leave.mutate(),
		children: "Sair do clube"
	});
}
//#endregion
export { ClubPage as component };
