import { v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { S as BookMarked, n as Users, s as Radio, y as ChartColumn } from "../_libs/lucide-react.mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
import { t as Button } from "./button-DeZLCCCG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-FCimK1LE.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const { user, isPending } = useCurrentUserState();
	if (!isPending && user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/app" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto flex max-w-6xl items-center justify-between px-6 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-xl tracking-tight",
					children: "OmniReader"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						children: "Entrar"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto grid max-w-6xl items-center gap-12 px-6 py-10 md:grid-cols-[1.1fr_0.9fr] md:py-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase",
						children: "Clube do livro · tracker · leitor"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 font-display text-4xl leading-[1.1] tracking-tight md:text-6xl",
						children: "A estante que acompanha o que você lê — e com quem."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg",
						children: "Unifique clubes, biblioteca pessoal e o hábito diário. Livros, mangás, áudios e manuais técnicos no mesmo ritmo, com progresso que se adapta ao formato."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col gap-3 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							className: "w-full sm:w-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								children: "Começar a ler"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							variant: "outline",
							className: "w-full sm:w-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#como",
								children: "Como funciona"
							})
						})]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroShelf, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "como",
				className: "border-t border-border bg-card/50",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
							icon: BookMarked,
							title: "Leitor nativo",
							text: "PDF, EPUB e áudio no próprio aparelho. Zero upload, retomada exata, cronômetro silencioso."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
							icon: Radio,
							title: "Formatos vivos",
							text: "Páginas, capítulos, minutos ou porcentagem. Obras em lançamento sem teto artificial."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
							icon: Users,
							title: "Clubes isolados",
							text: "Convite por chave, votação, sorteio ou curadoria. Progresso coletivo sem spoilers."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
							icon: ChartColumn,
							title: "Hábitos visíveis",
							text: "Ofensivas, páginas, horas e gêneros — um painel calmo para quem gosta de números."
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto max-w-6xl px-6 py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-primary px-8 py-12 text-primary-foreground md:px-14",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-[0.2em] uppercase opacity-70",
							children: "Do romance ao manual"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 max-w-2xl font-display text-3xl md:text-4xl",
							children: "Feito para leitores casuais e para quem cataloga normativas em campo."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-xl text-sm leading-relaxed opacity-80",
							children: "Consulte um painel elétrico no aeroporto, marque o capítulo do clube no fim do dia, ouça um audiolivro no trajeto. O progresso não se perde."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "mt-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								children: "Criar minha biblioteca"
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border px-6 py-8 text-center text-xs text-muted-foreground",
				children: "OmniReader · leitura social e gestão de conhecimento"
			})
		]
	});
}
function Feature({ icon: Icon, title, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid size-10 place-items-center rounded-lg bg-secondary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-4 font-display text-xl",
			children: title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm leading-relaxed text-muted-foreground",
			children: text
		})
	] });
}
function HeroShelf() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative mx-auto flex h-80 w-full max-w-md items-end justify-center gap-2 rounded-xl bg-secondary/70 px-6 pb-8 paper-shadow",
		children: [
			{
				title: "Dom Casmurro",
				h: "h-56",
				tone: "bg-primary text-primary-foreground"
			},
			{
				title: "Sapiens",
				h: "h-64",
				tone: "bg-chart-2 text-primary-foreground"
			},
			{
				title: "NR-10",
				h: "h-52",
				tone: "bg-foreground text-background"
			},
			{
				title: "One Piece",
				h: "h-60",
				tone: "bg-chart-3 text-primary-foreground"
			},
			{
				title: "1984",
				h: "h-56",
				tone: "bg-chart-5 text-primary-foreground"
			}
		].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `flex ${s.h} w-10 items-center justify-center rounded-sm ${s.tone} shadow-sm md:w-12`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rotate-180 text-[10px] tracking-widest uppercase [writing-mode:vertical-rl]",
				children: s.title
			})
		}, s.title))
	});
}
//#endregion
export { Home as component };
