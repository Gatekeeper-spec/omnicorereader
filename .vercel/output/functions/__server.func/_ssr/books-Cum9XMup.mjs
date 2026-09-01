import { d as unitForFormat, i as STATUSES, t as FORMATS } from "./formats-jvG5fuHm.mjs";
import { c as todayISO, s as newId } from "./utils-DMDW2zwJ.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { Ft as number, It as object, Ot as _enum, jt as boolean, zt as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as authMiddleware } from "./middleware-DYAJf2Iy.mjs";
import { c as mapBook, o as createServerRpc, p as sql, t as asNumber } from "./shared-C85Sz4oq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/books-Cum9XMup.js
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
var listBooks_createServerFn_handler = createServerRpc({
	id: "3781ce6f75e7fbe1b5d8b98e097a78c2e7369b1d1071db8ffbea986890ed20e3",
	name: "listBooks",
	filename: "src/lib/api/books.ts"
}, (opts) => listBooks.__executeServer(opts));
var listBooks = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listBooks_createServerFn_handler, async ({ context }) => {
	return (await (await sql())`
      select * from books where user_id = ${context.userId} order by updated_at desc
    `).map(mapBook);
});
var getBook_createServerFn_handler = createServerRpc({
	id: "df16957da85357320fee380946d75a3ee8989296d87b0b4e2027e8fed6f453c6",
	name: "getBook",
	filename: "src/lib/api/books.ts"
}, (opts) => getBook.__executeServer(opts));
var getBook = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(getBook_createServerFn_handler, async ({ context, data }) => {
	const row = (await (await sql())`
      select * from books where id = ${data.id} and user_id = ${context.userId} limit 1
    `)[0];
	if (!row) throw new Error("Obra não encontrada.");
	return mapBook(row);
});
var createBook_createServerFn_handler = createServerRpc({
	id: "d2ae048a3a8d35071e2ea9b25909255ba022653305ebdb20d1e3452d54893a32",
	name: "createBook",
	filename: "src/lib/api/books.ts"
}, (opts) => createBook.__executeServer(opts));
var createBook = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(bookInput).handler(createBook_createServerFn_handler, async ({ context, data }) => {
	const title = data.title.trim();
	if (!title) throw new Error("Informe o título.");
	const format = data.format;
	const unit = unitForFormat(format);
	const total = data.totalUnits ?? (unit === "percent" ? 100 : 0);
	const id = newId();
	const status = data.status ?? "to_read";
	const db = await sql();
	await db`
      insert into books (
        id, user_id, title, author, isbn, cover_url, format, genre, publisher, year,
        total_units, unit_type, status, progress, ongoing, notes, started_at
      ) values (
        ${id}, ${context.userId}, ${title}, ${data.author?.trim() ?? ""},
        ${data.isbn?.trim() || null}, ${data.coverUrl?.trim() || null}, ${format},
        ${data.genre?.trim() || null}, ${data.publisher?.trim() || null}, ${data.year ?? null},
        ${total}, ${unit}, ${status}, ${data.progress ?? 0}, ${data.ongoing ?? false},
        ${data.notes?.trim() || null}, ${status === "reading" ? (/* @__PURE__ */ new Date()).toISOString() : null}
      )
    `;
	const rows = await db`select * from books where id = ${id}`;
	return mapBook(rows[0]);
});
var updateBook_createServerFn_handler = createServerRpc({
	id: "3834360365e776ee6f1badfa0fcfd101f5fe29a1130eeed9e32632e7d562d2d6",
	name: "updateBook",
	filename: "src/lib/api/books.ts"
}, (opts) => updateBook.__executeServer(opts));
var updateBook = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(bookInput.extend({
	id: string(),
	rating: number().int().min(1).max(5).nullable().optional(),
	review: string().max(4e3).nullable().optional(),
	lastLocation: string().max(200).nullable().optional()
})).handler(updateBook_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	const prev = (await db`
      select * from books where id = ${data.id} and user_id = ${context.userId} limit 1
    `)[0];
	if (!prev) throw new Error("Obra não encontrada.");
	const current = mapBook(prev);
	const format = data.format;
	const unit = unitForFormat(format);
	const status = data.status ?? current.status;
	const progress = data.progress ?? current.progress;
	const startedAt = status !== "to_read" ? current.startedAt ?? (/* @__PURE__ */ new Date()).toISOString() : current.startedAt;
	const finishedAt = status === "finished" ? current.finishedAt ?? (/* @__PURE__ */ new Date()).toISOString() : null;
	await db`
      update books set
        title = ${data.title.trim()},
        author = ${data.author?.trim() ?? ""},
        isbn = ${data.isbn?.trim() || null},
        cover_url = ${data.coverUrl?.trim() || null},
        format = ${format},
        genre = ${data.genre?.trim() || null},
        publisher = ${data.publisher?.trim() || null},
        year = ${data.year ?? null},
        total_units = ${data.totalUnits ?? current.totalUnits},
        unit_type = ${unit},
        status = ${status},
        progress = ${progress},
        ongoing = ${data.ongoing ?? current.ongoing},
        notes = ${data.notes === void 0 ? current.notes : data.notes?.trim() || null},
        rating = ${data.rating === void 0 ? current.rating : data.rating},
        review = ${data.review === void 0 ? current.review : data.review},
        last_location = ${data.lastLocation === void 0 ? current.lastLocation : data.lastLocation},
        started_at = ${startedAt},
        finished_at = ${finishedAt},
        updated_at = now()
      where id = ${data.id} and user_id = ${context.userId}
    `;
	const rows = await db`select * from books where id = ${data.id}`;
	return mapBook(rows[0]);
});
var deleteBook_createServerFn_handler = createServerRpc({
	id: "733171563dd476ae52cd072b121de965be26c901559725bea4c4540936e1b367",
	name: "deleteBook",
	filename: "src/lib/api/books.ts"
}, (opts) => deleteBook.__executeServer(opts));
var deleteBook = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(deleteBook_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	await db`delete from reading_sessions where book_id = ${data.id} and user_id = ${context.userId}`;
	await db`delete from books where id = ${data.id} and user_id = ${context.userId}`;
	return { ok: true };
});
var logSession_createServerFn_handler = createServerRpc({
	id: "456fba4292a579ba16f39549ad956c6458ed4be8ed744d9fd2cf43eebe7129b5",
	name: "logSession",
	filename: "src/lib/api/books.ts"
}, (opts) => logSession.__executeServer(opts));
var logSession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	bookId: string(),
	durationSec: number().int().min(0).max(43200),
	unitsRead: number().int().min(0).max(1e4),
	progress: number().int().min(0).max(1e5).optional(),
	lastLocation: string().max(200).optional()
})).handler(logSession_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	const row = (await db`
      select * from books where id = ${data.bookId} and user_id = ${context.userId} limit 1
    `)[0];
	if (!row) throw new Error("Obra não encontrada.");
	const book = mapBook(row);
	const nextProgress = data.progress ?? book.progress;
	let status = book.status;
	if (status === "to_read" && nextProgress > 0) status = "reading";
	if (!book.ongoing && book.totalUnits > 0 && nextProgress >= book.totalUnits) status = "finished";
	await db`
      insert into reading_sessions (id, user_id, book_id, duration_sec, units_read, day)
      values (${newId()}, ${context.userId}, ${data.bookId}, ${data.durationSec}, ${data.unitsRead}, ${todayISO()})
    `;
	await db`
      update books set
        progress = ${nextProgress},
        status = ${status},
        last_location = ${data.lastLocation ?? book.lastLocation},
        started_at = ${book.startedAt ?? (/* @__PURE__ */ new Date()).toISOString()},
        finished_at = ${status === "finished" ? book.finishedAt ?? (/* @__PURE__ */ new Date()).toISOString() : book.finishedAt},
        updated_at = now()
      where id = ${data.bookId} and user_id = ${context.userId}
    `;
	const updated = await db`select * from books where id = ${data.bookId}`;
	return mapBook(updated[0]);
});
var getAnalytics_createServerFn_handler = createServerRpc({
	id: "4bf0f3b0373ba441bdf3e166f1c39cc1f109dd681a98dba9f1ad605776082c4f",
	name: "getAnalytics",
	filename: "src/lib/api/books.ts"
}, (opts) => getAnalytics.__executeServer(opts));
var getAnalytics = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAnalytics_createServerFn_handler, async ({ context }) => {
	const db = await sql();
	const books = (await db`select * from books where user_id = ${context.userId}`).map(mapBook);
	const sessions = await db`
      select day, duration_sec, units_read from reading_sessions
      where user_id = ${context.userId}
    `;
	const pages = books.filter((b) => b.unitType === "pages").reduce((a, b) => a + (b.status === "finished" ? b.totalUnits : b.progress), 0);
	const chapters = books.filter((b) => b.unitType === "chapters").reduce((a, b) => a + b.progress, 0);
	const minutes = books.filter((b) => b.unitType === "minutes").reduce((a, b) => a + b.progress, 0);
	const byFormatMap = /* @__PURE__ */ new Map();
	const byGenreMap = /* @__PURE__ */ new Map();
	const byAuthorMap = /* @__PURE__ */ new Map();
	for (const b of books) {
		byFormatMap.set(b.format, (byFormatMap.get(b.format) ?? 0) + 1);
		if (b.genre) byGenreMap.set(b.genre, (byGenreMap.get(b.genre) ?? 0) + 1);
		if (b.author) byAuthorMap.set(b.author, (byAuthorMap.get(b.author) ?? 0) + 1);
	}
	const sortedDays = [...new Set(sessions.map((s) => String(s.day).slice(0, 10)))].sort();
	const streak = computeStreak(sortedDays);
	const bestStreak = computeBestStreak(sortedDays);
	const last14 = [];
	for (let i = 13; i >= 0; i--) {
		const d = /* @__PURE__ */ new Date();
		d.setDate(d.getDate() - i);
		const key = todayISO(d);
		const ofDay = sessions.filter((s) => String(s.day).slice(0, 10) === key);
		last14.push({
			day: key,
			minutes: Math.round(ofDay.reduce((a, s) => a + asNumber(s.duration_sec), 0) / 60),
			units: ofDay.reduce((a, s) => a + asNumber(s.units_read), 0)
		});
	}
	const weekStart = /* @__PURE__ */ new Date();
	weekStart.setDate(weekStart.getDate() - 6);
	const weekKey = todayISO(weekStart);
	const weekSessions = sessions.filter((s) => String(s.day).slice(0, 10) >= weekKey);
	return {
		pages,
		chapters,
		minutes,
		booksFinished: books.filter((b) => b.status === "finished").length,
		booksReading: books.filter((b) => b.status === "reading").length,
		streak,
		bestStreak,
		sessionsThisWeek: weekSessions.length,
		minutesThisWeek: Math.round(weekSessions.reduce((a, s) => a + asNumber(s.duration_sec), 0) / 60),
		byFormat: [...byFormatMap.entries()].map(([format, count]) => ({
			format,
			count
		})),
		byGenre: [...byGenreMap.entries()].map(([genre, count]) => ({
			genre,
			count
		})).sort((a, b) => b.count - a.count).slice(0, 8),
		byAuthor: [...byAuthorMap.entries()].map(([author, count]) => ({
			author,
			count
		})).sort((a, b) => b.count - a.count).slice(0, 8),
		last14
	};
});
function computeStreak(sortedDays) {
	if (sortedDays.length === 0) return 0;
	const set = new Set(sortedDays);
	const today = todayISO();
	const y = /* @__PURE__ */ new Date();
	y.setDate(y.getDate() - 1);
	const yesterday = todayISO(y);
	if (!set.has(today) && !set.has(yesterday)) return 0;
	let cursor = set.has(today) ? /* @__PURE__ */ new Date() : y;
	let n = 0;
	while (set.has(todayISO(cursor))) {
		n += 1;
		cursor.setDate(cursor.getDate() - 1);
	}
	return n;
}
function computeBestStreak(sortedDays) {
	if (sortedDays.length === 0) return 0;
	let best = 1;
	let cur = 1;
	for (let i = 1; i < sortedDays.length; i++) {
		const prev = /* @__PURE__ */ new Date(sortedDays[i - 1] + "T00:00:00");
		const diff = ((/* @__PURE__ */ new Date(sortedDays[i] + "T00:00:00")).getTime() - prev.getTime()) / 864e5;
		if (diff === 1) {
			cur += 1;
			best = Math.max(best, cur);
		} else if (diff > 1) cur = 1;
	}
	return best;
}
//#endregion
export { createBook_createServerFn_handler, deleteBook_createServerFn_handler, getAnalytics_createServerFn_handler, getBook_createServerFn_handler, listBooks_createServerFn_handler, logSession_createServerFn_handler, updateBook_createServerFn_handler };
