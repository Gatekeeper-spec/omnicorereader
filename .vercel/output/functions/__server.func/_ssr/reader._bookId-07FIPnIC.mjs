import { o as __toESM } from "../_runtime.mjs";
import { a as formatMeta, c as progressLabel, o as percentOf } from "./formats-jvG5fuHm.mjs";
import { r as formatClock, t as clamp } from "./utils-DMDW2zwJ.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as ChevronLeft, h as ChevronRight, l as Play, m as FileUp, t as X, u as Pause } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Route } from "./router-DSLlvk3O.mjs";
import { t as Button } from "./button-DeZLCCCG.mjs";
import { t as Slider } from "./slider-CVSFWB6n.mjs";
import { i as getBook, o as logSession } from "./books-CpBFg8Bl.mjs";
import { n as getLocalFile, r as saveLocalFile } from "./idb-DCH0hIyx.mjs";
import { t as require_lib } from "../_libs/jszip+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reader._bookId-07FIPnIC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
function xmlAttr(xml, attr) {
	return xml.match(new RegExp(`${attr}="([^"]+)"`))?.[1] ?? null;
}
function resolvePath(base, rel) {
	if (!rel || rel.startsWith("/")) return rel.replace(/^\//, "");
	const parts = base.split("/").slice(0, -1);
	for (const seg of rel.split("/")) if (seg === "..") parts.pop();
	else if (seg && seg !== ".") parts.push(seg);
	return parts.join("/");
}
function stripUnsafe(html) {
	return html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<iframe[\s\S]*?<\/iframe>/gi, "").replace(/<object[\s\S]*?<\/object>/gi, "").replace(/<embed[\s\S]*?>/gi, "").replace(/\son\w+="[^"]*"/gi, "").replace(/\son\w+='[^']*'/gi, "").replace(/javascript:/gi, "");
}
async function parseEpub(blob) {
	const zip = await import_lib.default.loadAsync(blob);
	const container = await zip.file("META-INF/container.xml")?.async("string");
	if (!container) throw new Error("EPUB inválido: container.xml ausente.");
	const opfPath = xmlAttr(container, "full-path");
	if (!opfPath) throw new Error("EPUB inválido: OPF não encontrado.");
	const opf = await zip.file(opfPath)?.async("string");
	if (!opf) throw new Error("EPUB inválido: OPF ilegível.");
	const manifest = /* @__PURE__ */ new Map();
	const itemRe = /<item\b[^>]*>/gi;
	let m;
	while (m = itemRe.exec(opf)) {
		const tag = m[0];
		const id = xmlAttr(tag, "id");
		const href = xmlAttr(tag, "href");
		const type = xmlAttr(tag, "media-type") ?? "";
		if (id && href) manifest.set(id, {
			href,
			type
		});
	}
	const spineIds = [];
	const spineRe = /<itemref\b[^>]*>/gi;
	while (m = spineRe.exec(opf)) {
		const idref = xmlAttr(m[0], "idref");
		if (idref) spineIds.push(idref);
	}
	const chapters = [];
	for (const id of spineIds) {
		const item = manifest.get(id);
		if (!item) continue;
		const path = resolvePath(opfPath, item.href);
		const file = zip.file(path);
		if (!file) continue;
		let html = await file.async("string");
		const imgRe = /src=["']([^"']+)["']/gi;
		const replacements = [];
		let im;
		while (im = imgRe.exec(html)) {
			const src = im[1];
			if (src.startsWith("data:") || src.startsWith("http")) continue;
			const imgPath = resolvePath(path, src);
			const imgFile = zip.file(imgPath);
			if (!imgFile) continue;
			const buf = await imgFile.async("blob");
			const url = URL.createObjectURL(buf);
			replacements.push({
				from: src,
				to: url
			});
		}
		for (const r of replacements) html = html.replaceAll(srcAttr(r.from), srcAttr(r.to));
		const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
		const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, "").trim() || `Capítulo ${chapters.length + 1}`;
		chapters.push({
			href: path,
			title,
			html: stripUnsafe(body)
		});
	}
	if (chapters.length === 0) throw new Error("Nenhum capítulo encontrado neste EPUB.");
	return chapters;
}
function srcAttr(v) {
	return `src="${v}"`;
}
function ReaderView({ bookId }) {
	const qc = useQueryClient();
	const bookQ = useQuery({
		queryKey: ["book", bookId],
		queryFn: () => getBook({ data: { id: bookId } })
	});
	const book = bookQ.data;
	const [file, setFile] = (0, import_react.useState)(null);
	const [seconds, setSeconds] = (0, import_react.useState)(0);
	const [running, setRunning] = (0, import_react.useState)(true);
	const [progress, setProgress] = (0, import_react.useState)(0);
	(0, import_react.useRef)(Date.now());
	const lastFlush = (0, import_react.useRef)(Date.now());
	const unitsAtStart = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		if (book) {
			setProgress(book.progress);
			unitsAtStart.current = book.progress;
		}
	}, [book?.id]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		getLocalFile(bookId).then((f) => {
			if (!cancelled && f) setFile({
				name: f.name,
				type: f.type,
				blob: f.blob
			});
		});
		return () => {
			cancelled = true;
		};
	}, [bookId]);
	(0, import_react.useEffect)(() => {
		if (!running) return;
		const t = window.setInterval(() => setSeconds((s) => s + 1), 1e3);
		return () => window.clearInterval(t);
	}, [running]);
	(0, import_react.useEffect)(() => {
		const onVis = () => {
			if (document.hidden) setRunning(false);
		};
		document.addEventListener("visibilitychange", onVis);
		return () => document.removeEventListener("visibilitychange", onVis);
	}, []);
	const flush = useMutation({
		mutationFn: async (final) => {
			const elapsed = Math.max(0, Math.round((Date.now() - lastFlush.current) / 1e3));
			lastFlush.current = Date.now();
			if (elapsed < 3 && !final) return book;
			return logSession({ data: {
				bookId,
				durationSec: elapsed,
				unitsRead: Math.max(0, progress - unitsAtStart.current),
				progress,
				lastLocation: String(progress)
			} });
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["books"] });
			qc.invalidateQueries({ queryKey: ["analytics"] });
			qc.invalidateQueries({ queryKey: ["book", bookId] });
		}
	});
	(0, import_react.useEffect)(() => {
		const t = window.setInterval(() => {
			if (running) flush.mutateAsync(false);
		}, 6e4);
		return () => window.clearInterval(t);
	}, [running, progress]);
	async function onFile(f) {
		if (f.size > 83886080) {
			toast.error("Arquivo acima de 80 MB.");
			return;
		}
		await saveLocalFile(bookId, f, f.name, f.type);
		setFile({
			name: f.name,
			type: f.type,
			blob: f
		});
		toast.success("Arquivo salvo neste dispositivo.");
	}
	if (bookQ.isPending || !book) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center text-sm text-reader-foreground/70",
		children: "Abrindo a leitura…"
	});
	const meta = formatMeta[book.format];
	const max = book.ongoing ? Math.max(progress, 1) : Math.max(book.totalUnits, 1);
	const kind = fileKind(file);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-3 px-3 py-3 md:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/library",
						onClick: () => void flush.mutateAsync(true),
						className: "grid size-11 place-items-center rounded-full bg-reader-foreground/10",
						"aria-label": "Fechar leitor",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-display text-base",
							children: book.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-reader-foreground/60",
							children: book.author
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setRunning((v) => !v),
						className: "flex h-11 items-center gap-2 rounded-full bg-reader-foreground/10 px-3 text-sm tabular-nums",
						children: [running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5" }), formatClock(seconds)]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-1 flex-col px-3 pb-4 md:px-6",
				children: kind === "pdf" && file ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PdfPane, {
					blob: file.blob,
					page: Math.max(1, progress || 1),
					onPage: (p, total) => {
						setProgress(p);
						if (book.totalUnits !== total) {}
					}
				}) : kind === "epub" && file ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EpubPane, {
					blob: file.blob,
					index: Math.max(0, progress - 1),
					onChapter: (i, total) => setProgress(Math.min(total, i + 1))
				}) : kind === "audio" && file ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudioPane, {
					blob: file.blob,
					onTime: (sec) => setProgress(Math.round(sec / 60))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackerPane, {
					onFile,
					fileName: file?.name,
					formatLabel: meta.label
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-reader-foreground/10 px-4 py-4 md:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-3xl flex-col gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs text-reader-foreground/70",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: progressLabel(progress, book.totalUnits, book.unitType, book.ongoing) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: percentOf(progress, book.totalUnits, book.ongoing) == null ? "Em lançamento" : `${percentOf(progress, book.totalUnits, book.ongoing)}%`
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							min: 0,
							max,
							step: 1,
							value: [progress],
							onValueChange: (v) => setProgress(v[0] ?? 0),
							onValueCommit: () => void flush.mutateAsync(true)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-[11px] text-reader-foreground/45",
							children: "O arquivo permanece neste aparelho. Nada é enviado à nuvem."
						})
					]
				})
			})
		]
	});
}
function fileKind(file) {
	if (!file) return "none";
	const t = file.type.toLowerCase();
	const n = file.name.toLowerCase();
	if (t.includes("pdf") || n.endsWith(".pdf")) return "pdf";
	if (t.includes("epub") || n.endsWith(".epub")) return "epub";
	if (t.startsWith("audio/") || /\.(mp3|m4a|ogg|wav|aac)$/.test(n)) return "audio";
	return "other";
}
function TrackerPane({ onFile, fileName, formatLabel }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid size-16 place-items-center rounded-2xl bg-reader-foreground/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "size-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl",
				children: "Modo acompanhamento"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 max-w-sm text-sm text-reader-foreground/65",
				children: [
					"Marque o progresso de um ",
					formatLabel.toLowerCase(),
					" físico, ou anexe um PDF, EPUB ou áudio para ler aqui — o arquivo não sai deste dispositivo."
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "inline-flex h-11 cursor-pointer items-center rounded-md bg-reader-foreground px-4 text-sm font-medium text-reader",
				children: [fileName ? "Trocar arquivo" : "Anexar arquivo local", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "file",
					accept: ".pdf,.epub,application/pdf,application/epub+zip,audio/*",
					className: "sr-only",
					onChange: (e) => {
						const f = e.target.files?.[0];
						if (f) onFile(f);
					}
				})]
			}),
			fileName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-reader-foreground/50",
				children: fileName
			}) : null
		]
	});
}
function PdfPane({ blob, page, onPage }) {
	const canvasRef = (0, import_react.useRef)(null);
	const pdfRef = (0, import_react.useRef)(null);
	const [total, setTotal] = (0, import_react.useState)(1);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			const pdfjs = await import("../_libs/pdfjs-dist.mjs").then((n) => n.t);
			const worker = await import("./pdf.worker.min-rIC0noZo.mjs");
			pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
			const data = await blob.arrayBuffer();
			const doc = await pdfjs.getDocument({ data }).promise;
			if (cancelled) return;
			pdfRef.current = doc;
			setTotal(doc.numPages);
			setReady(true);
			onPage(clamp(page, 1, doc.numPages), doc.numPages);
		})();
		return () => {
			cancelled = true;
		};
	}, [blob]);
	const render = (0, import_react.useCallback)(async (n) => {
		const pdf = pdfRef.current;
		const canvas = canvasRef.current;
		if (!pdf || !canvas) return;
		const pg = await pdf.getPage(n);
		const base = pg.getViewport({ scale: 1 });
		const scale = Math.min(900, canvas.parentElement?.clientWidth ?? 700) / base.width;
		const viewport = pg.getViewport({ scale: Math.min(2, scale) });
		canvas.width = viewport.width;
		canvas.height = viewport.height;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		await pg.render({
			canvasContext: ctx,
			viewport
		}).promise;
	}, []);
	(0, import_react.useEffect)(() => {
		if (ready) render(clamp(page, 1, total));
	}, [
		page,
		ready,
		total,
		render
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-4xl flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-center gap-2 py-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon-sm",
					className: "text-reader-foreground",
					onClick: () => onPage(Math.max(1, page - 1), total),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs tabular-nums text-reader-foreground/70",
					children: [
						page,
						" / ",
						total
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon-sm",
					className: "text-reader-foreground",
					onClick: () => onPage(Math.min(total, page + 1), total),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-1 justify-center overflow-auto rounded-lg bg-background/95 p-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "max-w-full"
			})
		})]
	});
}
function EpubPane({ blob, index, onChapter }) {
	const [chapters, setChapters] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		parseEpub(blob).then((chs) => {
			if (!cancelled) {
				setChapters(chs);
				onChapter(clamp(index, 0, chs.length - 1), chs.length);
			}
		}).catch((e) => {
			if (!cancelled) setErr(e.message);
		});
		return () => {
			cancelled = true;
		};
	}, [blob]);
	if (err) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "m-auto text-sm text-reader-foreground/70",
		children: err
	});
	if (!chapters) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "m-auto text-sm text-reader-foreground/70",
		children: "Preparando EPUB…"
	});
	const ch = chapters[clamp(index, 0, chapters.length - 1)];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-2xl flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-2 py-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					className: "text-reader-foreground",
					onClick: () => onChapter(Math.max(0, index - 1), chapters.length),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {}), " Anterior"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-reader-foreground/70",
					children: [
						index + 1,
						" / ",
						chapters.length
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					className: "text-reader-foreground",
					onClick: () => onChapter(Math.min(chapters.length - 1, index + 1), chapters.length),
					children: ["Próximo ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
			className: "flex-1 overflow-auto rounded-lg bg-background p-6 text-foreground font-serif leading-relaxed",
			dangerouslySetInnerHTML: { __html: ch.html }
		})]
	});
}
function AudioPane({ blob, onTime }) {
	const url = (0, import_react.useRef)(null);
	if (!url.current) url.current = URL.createObjectURL(blob);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "m-auto flex w-full max-w-lg flex-col items-center gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl",
			children: "Audiolivro"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
			className: "w-full",
			controls: true,
			src: url.current,
			onTimeUpdate: (e) => onTime(e.currentTarget.currentTime)
		})]
	});
}
function ReaderPage() {
	const { bookId } = Route.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReaderView, { bookId });
}
//#endregion
export { ReaderPage as component };
