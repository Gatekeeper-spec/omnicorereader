import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { i as Route$4 } from "./router-DSLlvk3O.mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
import { t as Button } from "./button-DeZLCCCG.mjs";
import { o as joinClub } from "./clubs-KtP5dkox.mjs";
import { t as RedirectToSignIn } from "./gates-CUxTjxua.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/join._code-BprNc4cT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function JoinPage() {
	const { code } = Route$4.useParams();
	const { user, isPending } = useCurrentUserState();
	const nav = useNavigate();
	const join = useMutation({
		mutationFn: () => joinClub({ data: { code } }),
		onSuccess: (club) => {
			nav({
				to: "/app/clubs/$clubId",
				params: { clubId: club.id }
			});
		}
	});
	(0, import_react.useEffect)(() => {
		if (user && !join.isPending && !join.isSuccess && !join.isError) join.mutate();
	}, [user]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center text-sm",
		children: "Abrindo convite…"
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-sm text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "font-display text-3xl",
				children: ["Convite ", code]
			}), join.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-destructive",
				children: join.error instanceof Error ? join.error.message : "Não foi possível entrar."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/clubs",
					children: "Ir aos clubes"
				})
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "Entrando no clube…"
			})]
		})
	});
}
//#endregion
export { JoinPage as component };
