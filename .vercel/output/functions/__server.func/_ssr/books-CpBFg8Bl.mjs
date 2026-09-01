import { i as STATUSES, t as FORMATS } from "./formats-jvG5fuHm.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { Ft as number, It as object, Ot as _enum, jt as boolean, zt as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as authMiddleware } from "./middleware-DYAJf2Iy.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/books-CpBFg8Bl.js
var formatZ = _enum(FORMATS);
var statusZ = _enum(STATUSES);
var bookInput = object({
	title: string().min(1).max(200),
	author: string().max(160).optional(),
	isbn: string().max(32).optional(),
	coverUrl: string().max(500).optional(),
	format: formatZ,
	genre: string().max(80).optional(),
	publisher: string().max(120).optional(),
	year: number().int().min(0).max(3e3).nullable().optional(),
	totalUnits: number().int().min(0).max(1e5).optional(),
	status: statusZ.optional(),
	progress: number().int().min(0).max(1e5).optional(),
	ongoing: boolean().optional(),
	notes: string().max(4e3).optional()
});
var listBooks = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("3781ce6f75e7fbe1b5d8b98e097a78c2e7369b1d1071db8ffbea986890ed20e3"));
var getBook = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(createSsrRpc("df16957da85357320fee380946d75a3ee8989296d87b0b4e2027e8fed6f453c6"));
var createBook = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(bookInput).handler(createSsrRpc("d2ae048a3a8d35071e2ea9b25909255ba022653305ebdb20d1e3452d54893a32"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(bookInput.extend({
	id: string(),
	rating: number().int().min(1).max(5).nullable().optional(),
	review: string().max(4e3).nullable().optional(),
	lastLocation: string().max(200).nullable().optional()
})).handler(createSsrRpc("3834360365e776ee6f1badfa0fcfd101f5fe29a1130eeed9e32632e7d562d2d6"));
var deleteBook = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(createSsrRpc("733171563dd476ae52cd072b121de965be26c901559725bea4c4540936e1b367"));
var logSession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	bookId: string(),
	durationSec: number().int().min(0).max(43200),
	unitsRead: number().int().min(0).max(1e4),
	progress: number().int().min(0).max(1e5).optional(),
	lastLocation: string().max(200).optional()
})).handler(createSsrRpc("456fba4292a579ba16f39549ad956c6458ed4be8ed744d9fd2cf43eebe7129b5"));
var getAnalytics = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("4bf0f3b0373ba441bdf3e166f1c39cc1f109dd681a98dba9f1ad605776082c4f"));
//#endregion
export { listBooks as a, getBook as i, deleteBook as n, logSession as o, getAnalytics as r, createBook as t };
