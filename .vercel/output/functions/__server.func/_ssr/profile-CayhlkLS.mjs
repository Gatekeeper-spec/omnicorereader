import { c as todayISO, o as inviteCode, s as newId } from "./utils-DMDW2zwJ.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { At as array, It as object, zt as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as authMiddleware } from "./middleware-DYAJf2Iy.mjs";
import { n as asString, o as createServerRpc, p as sql, s as displayFromUser, t as asNumber, u as mapProfile } from "./shared-C85Sz4oq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-CayhlkLS.js
async function seedLibrary(userId, displayName) {
	const db = await sql();
	const daysAgo = (n) => {
		const d = /* @__PURE__ */ new Date();
		d.setDate(d.getDate() - n);
		return todayISO(d);
	};
	const books = [
		{
			id: newId(),
			title: "Dom Casmurro",
			author: "Machado de Assis",
			format: "book",
			unit: "pages",
			total: 256,
			progress: 118,
			status: "reading",
			genre: "Clássico",
			year: 1899,
			ongoing: false
		},
		{
			id: newId(),
			title: "O Alienista",
			author: "Machado de Assis",
			format: "book",
			unit: "pages",
			total: 96,
			progress: 96,
			status: "finished",
			genre: "Clássico",
			year: 1882,
			ongoing: false
		},
		{
			id: newId(),
			title: "1984",
			author: "George Orwell",
			format: "book",
			unit: "pages",
			total: 328,
			progress: 0,
			status: "to_read",
			genre: "Distopia",
			year: 1949,
			ongoing: false
		},
		{
			id: newId(),
			title: "One Piece",
			author: "Eiichiro Oda",
			format: "manga",
			unit: "chapters",
			total: 0,
			progress: 1102,
			status: "reading",
			genre: "Aventura",
			year: 1997,
			ongoing: true
		},
		{
			id: newId(),
			title: "Sapiens",
			author: "Yuval Noah Harari",
			format: "audiobook",
			unit: "minutes",
			total: 930,
			progress: 240,
			status: "reading",
			genre: "História",
			year: 2011,
			ongoing: false
		},
		{
			id: newId(),
			title: "NR-10 — Segurança em Instalações Elétricas",
			author: "Ministério do Trabalho",
			format: "document",
			unit: "percent",
			total: 100,
			progress: 35,
			status: "reading",
			genre: "Técnico",
			year: 2019,
			ongoing: false
		}
	];
	for (const b of books) {
		const finished = b.status === "finished" ? (/* @__PURE__ */ new Date()).toISOString() : null;
		const started = b.status !== "to_read" ? (/* @__PURE__ */ new Date()).toISOString() : null;
		await db`
      insert into books (
        id, user_id, title, author, format, genre, year, total_units, unit_type,
        status, progress, ongoing, started_at, finished_at, rating
      ) values (
        ${b.id}, ${userId}, ${b.title}, ${b.author}, ${b.format}, ${b.genre}, ${b.year},
        ${b.total}, ${b.unit}, ${b.status}, ${b.progress}, ${b.ongoing},
        ${started}, ${finished}, ${b.status === "finished" ? 5 : null}
      )
    `;
	}
	const reading = books.filter((b) => b.status === "reading");
	for (let i = 0; i < 5; i++) {
		const book = reading[i % reading.length];
		await db`
      insert into reading_sessions (id, user_id, book_id, duration_sec, units_read, day)
      values (${newId()}, ${userId}, ${book.id}, ${1200 + i * 180}, ${8 + i * 3}, ${daysAgo(i)})
    `;
	}
	await db`
    insert into wishlist (id, user_id, title, author, priority, estimated_price, notes)
    values
      (${newId()}, ${userId}, 'A Hora da Estrela', 'Clarice Lispector', 'high', 42, 'Edição comentada'),
      (${newId()}, ${userId}, 'O Sol é para Todos', 'Harper Lee', 'medium', 55, null)
  `;
	const clubId = newId();
	await db`
    insert into clubs (id, name, description, invite_code, owner_id, selection_mode)
    values (
      ${clubId},
      'Clube Aurora',
      'Um círculo íntimo para clássicos, mangás e manuais técnicos — leitura sem pressa.',
      ${inviteCode()},
      ${userId},
      'vote'
    )
  `;
	await db`
    insert into club_members (club_id, user_id, role) values (${clubId}, ${userId}, 'owner')
  `;
	const currentId = newId();
	const nomId = newId();
	await db`
    insert into club_works (
      id, club_id, title, author, format, total_units, unit_type, synopsis, status, nominated_by, started_at
    ) values (
      ${currentId}, ${clubId}, 'Dom Casmurro', 'Machado de Assis', 'book', 256, 'pages',
      'Bentinho narra sua juventude e a dúvida que nunca se resolve.',
      'current', ${userId}, ${(/* @__PURE__ */ new Date()).toISOString()}
    )
  `;
	await db`
    insert into club_works (
      id, club_id, title, author, format, total_units, unit_type, synopsis, status, nominated_by
    ) values (
      ${nomId}, ${clubId}, 'Grande Sertão: Veredas', 'João Guimarães Rosa', 'book', 624, 'pages',
      'Riobaldo e o sertão como língua, destino e travessia.',
      'nominated', ${userId}
    )
  `;
	await db`
    insert into club_progress (club_id, user_id, work_id, progress)
    values (${clubId}, ${userId}, ${currentId}, 118)
  `;
	await db`
    insert into club_posts (id, club_id, work_id, user_id, body, spoiler)
    values (
      ${newId()}, ${clubId}, ${currentId}, ${userId},
      'Vamos combinar: sem falar do final até todo mundo passar da página 150.',
      false
    )
  `;
}
var ensureProfile_createServerFn_handler = createServerRpc({
	id: "1a751a46cd4d6ecca7ae7c1d2dd851f6e7fd31528a59ad5f9aa0d73436dced90",
	name: "ensureProfile",
	filename: "src/lib/api/profile.ts"
}, (opts) => ensureProfile.__executeServer(opts));
var ensureProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(ensureProfile_createServerFn_handler, async ({ context }) => {
	const db = await sql();
	const existing = await db`
      select user_id, display_name, avatar_url, bio, seeded from profiles where user_id = ${context.userId}
    `;
	if (existing[0]) return mapProfile(existing[0]);
	const u = (await db`
      select "name", "email", "image" from "user" where "id" = ${context.userId} limit 1
    `)[0];
	const name = displayFromUser(u?.name, u?.email ?? null);
	const avatar = u?.image ?? null;
	await db`
      insert into profiles (user_id, display_name, avatar_url, seeded)
      values (${context.userId}, ${name}, ${avatar}, false)
    `;
	await seedLibrary(context.userId, name);
	await db`update profiles set seeded = true where user_id = ${context.userId}`;
	const created = await db`
      select user_id, display_name, avatar_url, bio, seeded from profiles where user_id = ${context.userId}
    `;
	return mapProfile(created[0]);
});
var updateProfile_createServerFn_handler = createServerRpc({
	id: "ee204b84accba23daa557bd5874a20c059872c13312de5c401ceadb756fe579b",
	name: "updateProfile",
	filename: "src/lib/api/profile.ts"
}, (opts) => updateProfile.__executeServer(opts));
var updateProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	displayName: string().min(1).max(80),
	bio: string().max(280)
})).handler(updateProfile_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	const name = data.displayName.trim();
	if (!name) throw new Error("Informe um nome.");
	await db`
      update profiles
      set display_name = ${name}, bio = ${data.bio.trim()}, updated_at = now()
      where user_id = ${context.userId}
    `;
	return { ok: true };
});
var deleteAccount_createServerFn_handler = createServerRpc({
	id: "a72cdc2925afb3deff7532faa088fc1ed5349c66eee402e239fb4c44c82f1cd8",
	name: "deleteAccount",
	filename: "src/lib/api/profile.ts"
}, (opts) => deleteAccount.__executeServer(opts));
var deleteAccount = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(deleteAccount_createServerFn_handler, async ({ context }) => {
	const db = await sql();
	const uid = context.userId;
	const owned = await db`select id from clubs where owner_id = ${uid}`;
	for (const club of owned) {
		await db`delete from club_ratings where work_id in (select id from club_works where club_id = ${club.id})`;
		await db`delete from club_votes where work_id in (select id from club_works where club_id = ${club.id})`;
		await db`delete from club_progress where club_id = ${club.id}`;
		await db`delete from club_posts where club_id = ${club.id}`;
		await db`delete from club_works where club_id = ${club.id}`;
		await db`delete from club_members where club_id = ${club.id}`;
		await db`delete from clubs where id = ${club.id}`;
	}
	await db`delete from club_ratings where user_id = ${uid}`;
	await db`delete from club_votes where user_id = ${uid}`;
	await db`delete from club_progress where user_id = ${uid}`;
	await db`delete from club_posts where user_id = ${uid}`;
	await db`delete from club_members where user_id = ${uid}`;
	await db`delete from reading_sessions where user_id = ${uid}`;
	await db`delete from wishlist where user_id = ${uid}`;
	await db`delete from books where user_id = ${uid}`;
	await db`delete from profiles where user_id = ${uid}`;
	await db`delete from "session" where "userId" = ${uid}`;
	await db`delete from "account" where "userId" = ${uid}`;
	await db`delete from "user" where "id" = ${uid}`;
	return { ok: true };
});
var getMeStats_createServerFn_handler = createServerRpc({
	id: "803f9db2bcaa3f8852f1adc49ef69e4698fbf1ce0402404c93595d0aee2f0a3d",
	name: "getMeStats",
	filename: "src/lib/api/profile.ts"
}, (opts) => getMeStats.__executeServer(opts));
var getMeStats = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMeStats_createServerFn_handler, async ({ context }) => {
	const db = await sql();
	const [books] = await db`
      select count(*)::int as n from books where user_id = ${context.userId}
    `;
	const [clubs] = await db`
      select count(*)::int as n from club_members where user_id = ${context.userId}
    `;
	return {
		books: asNumber(books?.n),
		clubs: asNumber(clubs?.n)
	};
});
var listProfilesByIds_createServerFn_handler = createServerRpc({
	id: "0635fbf219e3baa0c26d989c4b28be8e75009418196fcf58e89b60cde6ad89bf",
	name: "listProfilesByIds",
	filename: "src/lib/api/profile.ts"
}, (opts) => listProfilesByIds.__executeServer(opts));
var listProfilesByIds = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ ids: array(string()).max(80) })).handler(listProfilesByIds_createServerFn_handler, async ({ data }) => {
	if (data.ids.length === 0) return [];
	const rows = await (await sql())`
      select user_id, display_name, avatar_url from profiles
    `;
	const wanted = new Set(data.ids);
	return rows.filter((r) => wanted.has(asString(r.user_id))).map((r) => ({
		userId: asString(r.user_id),
		displayName: asString(r.display_name),
		avatarUrl: r.avatar_url ? asString(r.avatar_url) : null
	}));
});
//#endregion
export { deleteAccount_createServerFn_handler, ensureProfile_createServerFn_handler, getMeStats_createServerFn_handler, listProfilesByIds_createServerFn_handler, updateProfile_createServerFn_handler };
