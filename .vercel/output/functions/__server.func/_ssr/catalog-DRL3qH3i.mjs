import { n as PRIORITIES, t as FORMATS } from "./formats-jvG5fuHm.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { Ft as number, It as object, Ot as _enum, zt as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as authMiddleware } from "./middleware-DYAJf2Iy.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-DRL3qH3i.js
var listWishlist = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("abd001709b82e06034fd76a99c02cf11874d11cd7ae427b832f3b534d7a91bef"));
var addWishlist = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	title: string().min(1).max(200),
	author: string().max(160).optional(),
	isbn: string().max(32).optional(),
	coverUrl: string().max(500).optional(),
	format: _enum(FORMATS).optional(),
	priority: _enum(PRIORITIES).optional(),
	estimatedPrice: number().int().min(0).max(1e5).nullable().optional(),
	notes: string().max(500).optional()
})).handler(createSsrRpc("c0a4d9c3c493684f09ee44903418a2de0c44b8a1a1a56f28e9b9c854e40ca0ff"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string(),
	priority: _enum(PRIORITIES).optional(),
	estimatedPrice: number().int().min(0).max(1e5).nullable().optional(),
	notes: string().max(500).nullable().optional()
})).handler(createSsrRpc("82afe3dde6519f79442687a286bc6ac8628bed8608a1f80ac8c401b1abeee938"));
var deleteWishlist = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(createSsrRpc("98fc96a4ef1d3a604654d3157618b8102d4060a5293030be876bc0bb03aca114"));
var convertWishlist = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(createSsrRpc("7dda445917416423ab61d1143330cf7f3603b05a48d846f1f979c79d38e98f5b"));
var searchCatalog = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ q: string().min(2).max(120) })).handler(createSsrRpc("5b71cb6e655112875614593888081902d070170de22d4858664d05bb3704d35e"));
//#endregion
export { searchCatalog as a, listWishlist as i, convertWishlist as n, deleteWishlist as r, addWishlist as t };
