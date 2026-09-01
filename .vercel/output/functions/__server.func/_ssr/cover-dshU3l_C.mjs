import { i as hashHue, n as cn } from "./utils-DMDW2zwJ.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cover-dshU3l_C.js
var import_jsx_runtime = require_jsx_runtime();
var palettes = [
	"bg-primary text-primary-foreground",
	"bg-foreground text-background",
	"bg-chart-2 text-primary-foreground",
	"bg-chart-3 text-primary-foreground",
	"bg-chart-5 text-primary-foreground"
];
function Cover({ title, author, coverUrl, className }) {
	const tone = palettes[hashHue(title + (author ?? "")) % palettes.length];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative aspect-[2/3] overflow-hidden rounded-md", "outline outline-1 -outline-offset-1 outline-foreground/10", className),
		children: [coverUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: coverUrl,
			alt: "",
			className: "size-full object-cover",
			onError: (e) => {
				e.currentTarget.style.display = "none";
				const fallback = e.currentTarget.nextElementSibling;
				if (fallback instanceof HTMLElement) fallback.hidden = false;
			}
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			hidden: Boolean(coverUrl),
			className: cn("absolute inset-0 flex flex-col justify-between p-3", tone),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] font-medium tracking-[0.18em] uppercase opacity-70 line-clamp-2",
					children: author || "Autor desconhecido"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-[15px] leading-tight line-clamp-5",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[9px] tracking-[0.2em] uppercase opacity-50",
					children: "OmniReader"
				})
			]
		})]
	});
}
//#endregion
export { Cover as t };
