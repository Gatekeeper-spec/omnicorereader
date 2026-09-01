import { d as unitForFormat, n as PRIORITIES, t as FORMATS } from "./formats-jvG5fuHm.mjs";
import { s as newId } from "./utils-DMDW2zwJ.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { Ft as number, It as object, Ot as _enum, zt as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as authMiddleware } from "./middleware-DYAJf2Iy.mjs";
import { d as mapWish, o as createServerRpc, p as sql } from "./shared-C85Sz4oq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-BV2xgFxt.js
var listWishlist_createServerFn_handler = createServerRpc({
	id: "abd001709b82e06034fd76a99c02cf11874d11cd7ae427b832f3b534d7a91bef",
	name: "listWishlist",
	filename: "src/lib/api/catalog.ts"
}, (opts) => listWishlist.__executeServer(opts));
var listWishlist = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listWishlist_createServerFn_handler, async ({ context }) => {
	return (await (await sql())`
      select * from wishlist where user_id = ${context.userId}
      order by case priority when 'high' then 0 when 'medium' then 1 else 2 end, created_at desc
    `).map(mapWish);
});
var addWishlist_createServerFn_handler = createServerRpc({
	id: "c0a4d9c3c493684f09ee44903418a2de0c44b8a1a1a56f28e9b9c854e40ca0ff",
	name: "addWishlist",
	filename: "src/lib/api/catalog.ts"
}, (opts) => addWishlist.__executeServer(opts));
var addWishlist = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	title: string().min(1).max(200),
	author: string().max(160).optional(),
	isbn: string().max(32).optional(),
	coverUrl: string().max(500).optional(),
	format: _enum(FORMATS).optional(),
	priority: _enum(PRIORITIES).optional(),
	estimatedPrice: number().int().min(0).max(1e5).nullable().optional(),
	notes: string().max(500).optional()
})).handler(addWishlist_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	const id = newId();
	await db`
      insert into wishlist (id, user_id, title, author, isbn, cover_url, format, priority, estimated_price, notes)
      values (
        ${id}, ${context.userId}, ${data.title.trim()}, ${data.author?.trim() ?? ""},
        ${data.isbn?.trim() || null}, ${data.coverUrl?.trim() || null}, ${data.format ?? null},
        ${data.priority ?? "medium"}, ${data.estimatedPrice ?? null}, ${data.notes?.trim() || null}
      )
    `;
	const rows = await db`select * from wishlist where id = ${id}`;
	return mapWish(rows[0]);
});
var updateWishlist_createServerFn_handler = createServerRpc({
	id: "82afe3dde6519f79442687a286bc6ac8628bed8608a1f80ac8c401b1abeee938",
	name: "updateWishlist",
	filename: "src/lib/api/catalog.ts"
}, (opts) => updateWishlist.__executeServer(opts));
var updateWishlist = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string(),
	priority: _enum(PRIORITIES).optional(),
	estimatedPrice: number().int().min(0).max(1e5).nullable().optional(),
	notes: string().max(500).nullable().optional()
})).handler(updateWishlist_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	const existing = await db`
      select * from wishlist where id = ${data.id} and user_id = ${context.userId} limit 1
    `;
	if (!existing[0]) throw new Error("Item não encontrado.");
	const cur = mapWish(existing[0]);
	await db`
      update wishlist set
        priority = ${data.priority ?? cur.priority},
        estimated_price = ${data.estimatedPrice === void 0 ? cur.estimatedPrice : data.estimatedPrice},
        notes = ${data.notes === void 0 ? cur.notes : data.notes}
      where id = ${data.id} and user_id = ${context.userId}
    `;
	return { ok: true };
});
var deleteWishlist_createServerFn_handler = createServerRpc({
	id: "98fc96a4ef1d3a604654d3157618b8102d4060a5293030be876bc0bb03aca114",
	name: "deleteWishlist",
	filename: "src/lib/api/catalog.ts"
}, (opts) => deleteWishlist.__executeServer(opts));
var deleteWishlist = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(deleteWishlist_createServerFn_handler, async ({ context, data }) => {
	await (await sql())`delete from wishlist where id = ${data.id} and user_id = ${context.userId}`;
	return { ok: true };
});
var convertWishlist_createServerFn_handler = createServerRpc({
	id: "7dda445917416423ab61d1143330cf7f3603b05a48d846f1f979c79d38e98f5b",
	name: "convertWishlist",
	filename: "src/lib/api/catalog.ts"
}, (opts) => convertWishlist.__executeServer(opts));
var convertWishlist = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(convertWishlist_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	const row = (await db`
      select * from wishlist where id = ${data.id} and user_id = ${context.userId} limit 1
    `)[0];
	if (!row) throw new Error("Item não encontrado.");
	const item = mapWish(row);
	const format = item.format ?? "book";
	const unit = unitForFormat(format);
	const bookId = newId();
	await db`
      insert into books (id, user_id, title, author, isbn, cover_url, format, total_units, unit_type, status)
      values (
        ${bookId}, ${context.userId}, ${item.title}, ${item.author}, ${item.isbn}, ${item.coverUrl},
        ${format}, ${unit === "percent" ? 100 : 0}, ${unit}, 'to_read'
      )
    `;
	await db`delete from wishlist where id = ${data.id} and user_id = ${context.userId}`;
	return { bookId };
});
var searchCatalog_createServerFn_handler = createServerRpc({
	id: "5b71cb6e655112875614593888081902d070170de22d4858664d05bb3704d35e",
	name: "searchCatalog",
	filename: "src/lib/api/catalog.ts"
}, (opts) => searchCatalog.__executeServer(opts));
var searchCatalog = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ q: string().min(2).max(120) })).handler(searchCatalog_createServerFn_handler, async ({ data }) => {
	const q = data.q.trim();
	const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=8&printType=books&langRestrict=pt`;
	let res;
	try {
		res = await fetch(url, { headers: { Accept: "application/json" } });
	} catch {
		return [];
	}
	if (!res.ok) return [];
	return ((await res.json()).items ?? []).map((it) => {
		const v = it.volumeInfo ?? {};
		const ids = v.industryIdentifiers ?? [];
		const isbn13 = ids.find((i) => i.type === "ISBN_13")?.identifier;
		const isbn10 = ids.find((i) => i.type === "ISBN_10")?.identifier;
		const cover = v.imageLinks?.thumbnail ?? v.imageLinks?.smallThumbnail ?? null;
		const yearRaw = v.publishedDate ? Number(v.publishedDate.slice(0, 4)) : NaN;
		return {
			title: v.title ?? "Sem título",
			author: (v.authors ?? []).join(", "),
			isbn: isbn13 ?? isbn10 ?? null,
			coverUrl: cover ? cover.replace("http://", "https://") : null,
			year: Number.isFinite(yearRaw) ? yearRaw : null,
			publisher: v.publisher ?? null,
			pageCount: v.pageCount ?? null,
			synopsis: v.description ? v.description.replace(/<[^>]+>/g, "").slice(0, 400) : null,
			categories: v.categories ?? []
		};
	});
});
//#endregion
export { addWishlist_createServerFn_handler, convertWishlist_createServerFn_handler, deleteWishlist_createServerFn_handler, listWishlist_createServerFn_handler, searchCatalog_createServerFn_handler, updateWishlist_createServerFn_handler };
