import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-DMDW2zwJ.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function newId() {
	return crypto.randomUUID();
}
function inviteCode() {
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	const bytes = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(6));
	let out = "";
	for (const b of bytes) out += alphabet[b % 32];
	return out;
}
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
function formatClock(totalSec) {
	const s = Math.max(0, Math.floor(totalSec));
	const h = Math.floor(s / 3600);
	const m = Math.floor(s % 3600 / 60);
	const sec = s % 60;
	if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
	return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}
function todayISO(d = /* @__PURE__ */ new Date()) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function initials(name) {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "OR";
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
function hashHue(input) {
	let h = 0;
	for (let i = 0; i < input.length; i++) h = h * 31 + input.charCodeAt(i) >>> 0;
	return h;
}
//#endregion
export { initials as a, todayISO as c, hashHue as i, cn as n, inviteCode as o, formatClock as r, newId as s, clamp as t };
