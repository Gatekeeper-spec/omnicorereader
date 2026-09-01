import { n as cn } from "./utils-DMDW2zwJ.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as AvatarFallback$1, r as AvatarImage$1, t as Avatar$1 } from "../_libs/radix-ui__react-avatar.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/avatar-27rXcILX.js
var import_jsx_runtime = require_jsx_runtime();
function Avatar({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar$1, {
		className: cn("relative flex size-9 shrink-0 overflow-hidden rounded-full", className),
		...props
	});
}
function AvatarImage({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage$1, {
		className: cn("aspect-square size-full object-cover", className),
		...props
	});
}
function AvatarFallback({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback$1, {
		className: cn("flex size-full items-center justify-center bg-primary text-xs font-medium text-primary-foreground", className),
		...props
	});
}
//#endregion
export { AvatarFallback as n, AvatarImage as r, Avatar as t };
