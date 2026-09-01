import { d as unitForFormat, r as SELECTION_MODES, t as FORMATS } from "./formats-jvG5fuHm.mjs";
import { o as inviteCode, s as newId } from "./utils-DMDW2zwJ.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { Ft as number, It as object, Ot as _enum, jt as boolean, zt as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as authMiddleware } from "./middleware-DYAJf2Iy.mjs";
import { a as assertClubMember, f as mapWork, i as assertClubAdmin, l as mapClub, n as asString, o as createServerRpc, p as sql, r as asStringOrNull, t as asNumber } from "./shared-C85Sz4oq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/clubs-2qPrWmY4.js
var formatZ = _enum(FORMATS);
var listClubs_createServerFn_handler = createServerRpc({
	id: "7c7ed9717b30da7b421697898a7a6e45a4d29ddcf0f9897c3d445a259c08bb82",
	name: "listClubs",
	filename: "src/lib/api/clubs.ts"
}, (opts) => listClubs.__executeServer(opts));
var listClubs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listClubs_createServerFn_handler, async ({ context }) => {
	return (await (await sql())`
      select c.*, cm.role,
        (select count(*)::int from club_members m where m.club_id = c.id) as member_count
      from clubs c
      join club_members cm on cm.club_id = c.id
      where cm.user_id = ${context.userId}
      order by c.created_at desc
    `).map(mapClub);
});
var getClub_createServerFn_handler = createServerRpc({
	id: "1820012bb513593ab8cd23a2190a3fdde689eeca4380f2a75b03967dbcd05cbd",
	name: "getClub",
	filename: "src/lib/api/clubs.ts"
}, (opts) => getClub.__executeServer(opts));
var getClub = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ clubId: string() })).handler(getClub_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	await assertClubMember(db, data.clubId, context.userId);
	const row = (await db`
      select c.*, cm.role,
        (select count(*)::int from club_members m where m.club_id = c.id) as member_count
      from clubs c
      join club_members cm on cm.club_id = c.id and cm.user_id = ${context.userId}
      where c.id = ${data.clubId}
      limit 1
    `)[0];
	if (!row) throw new Error("Clube não encontrado.");
	return mapClub(row);
});
var createClub_createServerFn_handler = createServerRpc({
	id: "33bc0ae011531051774597bc32bb6d2f12beb1c2a161411eac0a42eb6a33c109",
	name: "createClub",
	filename: "src/lib/api/clubs.ts"
}, (opts) => createClub.__executeServer(opts));
var createClub = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	name: string().min(2).max(80),
	description: string().max(400).optional(),
	selectionMode: _enum(SELECTION_MODES).optional()
})).handler(createClub_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	const id = newId();
	let code = inviteCode();
	for (let i = 0; i < 5; i++) {
		if ((await db`select 1 from clubs where invite_code = ${code} limit 1`).length === 0) break;
		code = inviteCode();
	}
	await db`
      insert into clubs (id, name, description, invite_code, owner_id, selection_mode)
      values (
        ${id}, ${data.name.trim()}, ${data.description?.trim() ?? ""}, ${code},
        ${context.userId}, ${data.selectionMode ?? "vote"}
      )
    `;
	await db`insert into club_members (club_id, user_id, role) values (${id}, ${context.userId}, 'owner')`;
	const rows = await db`
      select c.*, 'owner' as role, 1 as member_count from clubs c where c.id = ${id}
    `;
	return mapClub(rows[0]);
});
var joinClub_createServerFn_handler = createServerRpc({
	id: "2d05fd06c58a5da9b8d64358f2c79d9cc3eeedd981c98b981cb56b1667bf7164",
	name: "joinClub",
	filename: "src/lib/api/clubs.ts"
}, (opts) => joinClub.__executeServer(opts));
var joinClub = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ code: string().min(4).max(12) })).handler(joinClub_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	const club = (await db`select * from clubs where invite_code = ${data.code.trim().toUpperCase()} limit 1`)[0];
	if (!club) throw new Error("Código inválido.");
	const clubId = asString(club.id);
	if ((await db`
      select 1 from club_members where club_id = ${clubId} and user_id = ${context.userId}
    `).length) {
		const rows = await db`
        select c.*, cm.role,
          (select count(*)::int from club_members m where m.club_id = c.id) as member_count
        from clubs c join club_members cm on cm.club_id = c.id and cm.user_id = ${context.userId}
        where c.id = ${clubId}
      `;
		return mapClub(rows[0]);
	}
	const [{ n }] = await db`
      select count(*)::int as n from club_members where club_id = ${clubId}
    `;
	if (asNumber(n) >= asNumber(club.member_limit, 40)) throw new Error("Este clube está lotado.");
	await db`insert into club_members (club_id, user_id, role) values (${clubId}, ${context.userId}, 'member')`;
	const rows = await db`
      select c.*, 'member' as role,
        (select count(*)::int from club_members m where m.club_id = c.id) as member_count
      from clubs c where c.id = ${clubId}
    `;
	return mapClub(rows[0]);
});
var updateClub_createServerFn_handler = createServerRpc({
	id: "a69734995c28603ba7ae6635657e3b335564416ba0a79478272694dbd08de922",
	name: "updateClub",
	filename: "src/lib/api/clubs.ts"
}, (opts) => updateClub.__executeServer(opts));
var updateClub = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	clubId: string(),
	name: string().min(2).max(80),
	description: string().max(400),
	selectionMode: _enum(SELECTION_MODES),
	memberLimit: number().int().min(2).max(200)
})).handler(updateClub_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	await assertClubAdmin(db, data.clubId, context.userId);
	await db`
      update clubs set
        name = ${data.name.trim()},
        description = ${data.description.trim()},
        selection_mode = ${data.selectionMode},
        member_limit = ${data.memberLimit}
      where id = ${data.clubId}
    `;
	return { ok: true };
});
var leaveClub_createServerFn_handler = createServerRpc({
	id: "9356e44ef07d97fc831beec9f9ac77fd131c0903cbb81995d20fb46b32d8f661",
	name: "leaveClub",
	filename: "src/lib/api/clubs.ts"
}, (opts) => leaveClub.__executeServer(opts));
var leaveClub = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ clubId: string() })).handler(leaveClub_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	if (await assertClubMember(db, data.clubId, context.userId) === "owner") throw new Error("Transfira a liderança ou apague o clube antes de sair.");
	await db`delete from club_members where club_id = ${data.clubId} and user_id = ${context.userId}`;
	return { ok: true };
});
var deleteClub_createServerFn_handler = createServerRpc({
	id: "86815f8db08447780cb193dffd12b0baef5115c29f596dff5e9d930becab5b37",
	name: "deleteClub",
	filename: "src/lib/api/clubs.ts"
}, (opts) => deleteClub.__executeServer(opts));
var deleteClub = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ clubId: string() })).handler(deleteClub_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	if (await assertClubMember(db, data.clubId, context.userId) !== "owner") throw new Error("Apenas o criador pode apagar o clube.");
	await db`delete from club_ratings where work_id in (select id from club_works where club_id = ${data.clubId})`;
	await db`delete from club_votes where work_id in (select id from club_works where club_id = ${data.clubId})`;
	await db`delete from club_progress where club_id = ${data.clubId}`;
	await db`delete from club_posts where club_id = ${data.clubId}`;
	await db`delete from club_works where club_id = ${data.clubId}`;
	await db`delete from club_members where club_id = ${data.clubId}`;
	await db`delete from clubs where id = ${data.clubId}`;
	return { ok: true };
});
var listMembers_createServerFn_handler = createServerRpc({
	id: "284582f91fefaf74dbca8c0325b742e120907df4eaaaad5b191b18ffb6d52401",
	name: "listMembers",
	filename: "src/lib/api/clubs.ts"
}, (opts) => listMembers.__executeServer(opts));
var listMembers = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ clubId: string() })).handler(listMembers_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	await assertClubMember(db, data.clubId, context.userId);
	return (await db`
      select m.user_id, m.role, m.joined_at, p.display_name, p.avatar_url
      from club_members m
      left join profiles p on p.user_id = m.user_id
      where m.club_id = ${data.clubId}
      order by m.joined_at
    `).map((r) => ({
		userId: asString(r.user_id),
		displayName: asString(r.display_name || "Leitor"),
		avatarUrl: asStringOrNull(r.avatar_url),
		role: asString(r.role),
		joinedAt: asString(r.joined_at)
	}));
});
var listWorks_createServerFn_handler = createServerRpc({
	id: "b40aaae1121277975fe5a1c5d354a7aec786c3efcaa75c7deb9d715b15f008fa",
	name: "listWorks",
	filename: "src/lib/api/clubs.ts"
}, (opts) => listWorks.__executeServer(opts));
var listWorks = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ clubId: string() })).handler(listWorks_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	await assertClubMember(db, data.clubId, context.userId);
	return (await db`
      select w.*,
        coalesce(p.display_name, 'Membro') as nominated_by_name,
        (select count(*)::int from club_votes v where v.work_id = w.id) as vote_count,
        exists(select 1 from club_votes v where v.work_id = w.id and v.user_id = ${context.userId}) as voted_by_me
      from club_works w
      left join profiles p on p.user_id = w.nominated_by
      where w.club_id = ${data.clubId}
      order by w.created_at desc
    `).map(mapWork);
});
var nominateWork_createServerFn_handler = createServerRpc({
	id: "47b56108586e5a3ce1b8d2b6d079304e5d22461dc4bceb427dc5fb8e52018a4a",
	name: "nominateWork",
	filename: "src/lib/api/clubs.ts"
}, (opts) => nominateWork.__executeServer(opts));
var nominateWork = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	clubId: string(),
	title: string().min(1).max(200),
	author: string().max(160).optional(),
	coverUrl: string().max(500).optional(),
	isbn: string().max(32).optional(),
	format: formatZ,
	totalUnits: number().int().min(0).max(1e5).optional(),
	synopsis: string().max(800).optional()
})).handler(nominateWork_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	await assertClubMember(db, data.clubId, context.userId);
	const id = newId();
	const unit = unitForFormat(data.format);
	await db`
      insert into club_works (
        id, club_id, title, author, cover_url, isbn, format, total_units, unit_type, synopsis, status, nominated_by
      ) values (
        ${id}, ${data.clubId}, ${data.title.trim()}, ${data.author?.trim() ?? ""},
        ${data.coverUrl?.trim() || null}, ${data.isbn?.trim() || null}, ${data.format},
        ${data.totalUnits ?? (unit === "percent" ? 100 : 0)}, ${unit},
        ${data.synopsis?.trim() ?? ""}, 'nominated', ${context.userId}
      )
    `;
	return { id };
});
var toggleVote_createServerFn_handler = createServerRpc({
	id: "84288a4ee574f732cd45b71116eee9efcf8e83411fb2ac8f042d6d9fda8ba0da",
	name: "toggleVote",
	filename: "src/lib/api/clubs.ts"
}, (opts) => toggleVote.__executeServer(opts));
var toggleVote = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	clubId: string(),
	workId: string()
})).handler(toggleVote_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	await assertClubMember(db, data.clubId, context.userId);
	const work = await db`
      select id, status from club_works where id = ${data.workId} and club_id = ${data.clubId} limit 1
    `;
	if (!work[0] || asString(work[0].status) !== "nominated") throw new Error("Esta indicação não está aberta.");
	if ((await db`
      select 1 from club_votes where work_id = ${data.workId} and user_id = ${context.userId}
    `).length) {
		await db`delete from club_votes where work_id = ${data.workId} and user_id = ${context.userId}`;
		return { voted: false };
	}
	await db`insert into club_votes (work_id, user_id) values (${data.workId}, ${context.userId})`;
	return { voted: true };
});
var setCurrentWork_createServerFn_handler = createServerRpc({
	id: "27fc39987348c8a6eb28c144c1f2ef5bac32d5bcb822bc97acc94ca6e15cf6c8",
	name: "setCurrentWork",
	filename: "src/lib/api/clubs.ts"
}, (opts) => setCurrentWork.__executeServer(opts));
var setCurrentWork = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	clubId: string(),
	workId: string()
})).handler(setCurrentWork_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	await assertClubAdmin(db, data.clubId, context.userId);
	await db`
      update club_works set status = 'archived', finished_at = now()
      where club_id = ${data.clubId} and status = 'current'
    `;
	await db`
      update club_works set status = 'current', started_at = now()
      where id = ${data.workId} and club_id = ${data.clubId}
    `;
	return { ok: true };
});
var raffleWork_createServerFn_handler = createServerRpc({
	id: "83d654a47dae7dd4d8be38c5d3459d8760eea5e2d2aa9f930d47609adabdc8e9",
	name: "raffleWork",
	filename: "src/lib/api/clubs.ts"
}, (opts) => raffleWork.__executeServer(opts));
var raffleWork = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ clubId: string() })).handler(raffleWork_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	await assertClubAdmin(db, data.clubId, context.userId);
	const noms = await db`
      select id from club_works where club_id = ${data.clubId} and status = 'nominated'
    `;
	if (noms.length === 0) throw new Error("Não há indicações para sortear.");
	const pick = noms[Math.floor(Math.random() * noms.length)];
	await db`
      update club_works set status = 'archived', finished_at = now()
      where club_id = ${data.clubId} and status = 'current'
    `;
	await db`
      update club_works set status = 'current', started_at = now()
      where id = ${pick.id} and club_id = ${data.clubId}
    `;
	return { workId: pick.id };
});
var closeVote_createServerFn_handler = createServerRpc({
	id: "0b391d14b00e90956a5b6f7fd6bf3828c09db3c8eb76693628f311e569157ad3",
	name: "closeVote",
	filename: "src/lib/api/clubs.ts"
}, (opts) => closeVote.__executeServer(opts));
var closeVote = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ clubId: string() })).handler(closeVote_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	await assertClubAdmin(db, data.clubId, context.userId);
	const ranked = await db`
      select w.id, count(v.user_id)::int as n
      from club_works w
      left join club_votes v on v.work_id = w.id
      where w.club_id = ${data.clubId} and w.status = 'nominated'
      group by w.id
      order by n desc
    `;
	if (ranked.length === 0) throw new Error("Não há indicações.");
	const top = asNumber(ranked[0].n);
	const tied = ranked.filter((r) => asNumber(r.n) === top);
	const pick = tied[Math.floor(Math.random() * tied.length)];
	await db`
      update club_works set status = 'archived', finished_at = now()
      where club_id = ${data.clubId} and status = 'current'
    `;
	await db`
      update club_works set status = 'current', started_at = now()
      where id = ${pick.id} and club_id = ${data.clubId}
    `;
	return {
		workId: pick.id,
		tied: tied.length > 1
	};
});
var listClubProgress_createServerFn_handler = createServerRpc({
	id: "b45808fe7966cd16774d9749047ff38032b909a4640a200b3c7f82ac910d6ecc",
	name: "listClubProgress",
	filename: "src/lib/api/clubs.ts"
}, (opts) => listClubProgress.__executeServer(opts));
var listClubProgress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	clubId: string(),
	workId: string()
})).handler(listClubProgress_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	await assertClubMember(db, data.clubId, context.userId);
	return (await db`
      select m.user_id, coalesce(p.display_name, 'Leitor') as display_name, p.avatar_url,
        pr.progress, pr.updated_at
      from club_members m
      left join profiles p on p.user_id = m.user_id
      left join club_progress pr on pr.club_id = m.club_id and pr.user_id = m.user_id and pr.work_id = ${data.workId}
      where m.club_id = ${data.clubId}
      order by coalesce(pr.progress, 0) desc, p.display_name
    `).map((r) => ({
		userId: asString(r.user_id),
		displayName: asString(r.display_name),
		avatarUrl: asStringOrNull(r.avatar_url),
		progress: asNumber(r.progress),
		updatedAt: asStringOrNull(r.updated_at)
	}));
});
var updateClubProgress_createServerFn_handler = createServerRpc({
	id: "672b49549634b613160750fd8624d8aa904840bd7d420850eb29af999f602c65",
	name: "updateClubProgress",
	filename: "src/lib/api/clubs.ts"
}, (opts) => updateClubProgress.__executeServer(opts));
var updateClubProgress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	clubId: string(),
	workId: string(),
	progress: number().int().min(0).max(1e5)
})).handler(updateClubProgress_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	await assertClubMember(db, data.clubId, context.userId);
	await db`
      insert into club_progress (club_id, user_id, work_id, progress, updated_at)
      values (${data.clubId}, ${context.userId}, ${data.workId}, ${data.progress}, now())
      on conflict (club_id, user_id, work_id)
      do update set progress = ${data.progress}, updated_at = now()
    `;
	return { ok: true };
});
var listPosts_createServerFn_handler = createServerRpc({
	id: "c15b4c7a02485923220ecb171e0e6eed1f78b14940ec715e9546aac0c6e47894",
	name: "listPosts",
	filename: "src/lib/api/clubs.ts"
}, (opts) => listPosts.__executeServer(opts));
var listPosts = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ clubId: string() })).handler(listPosts_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	await assertClubMember(db, data.clubId, context.userId);
	return (await db`
      select po.*, coalesce(p.display_name, 'Leitor') as display_name, p.avatar_url
      from club_posts po
      left join profiles p on p.user_id = po.user_id
      where po.club_id = ${data.clubId}
      order by po.created_at desc
      limit 80
    `).map((r) => ({
		id: asString(r.id),
		clubId: asString(r.club_id),
		workId: asStringOrNull(r.work_id),
		userId: asString(r.user_id),
		displayName: asString(r.display_name),
		avatarUrl: asStringOrNull(r.avatar_url),
		body: asString(r.body),
		spoiler: r.spoiler === true || r.spoiler === "t" || r.spoiler === "true",
		createdAt: asString(r.created_at)
	}));
});
var createPost_createServerFn_handler = createServerRpc({
	id: "a72df6192e80ea9f220f3af725b4f3cee7fadd76b5052b98e8476e91fe8ac92d",
	name: "createPost",
	filename: "src/lib/api/clubs.ts"
}, (opts) => createPost.__executeServer(opts));
var createPost = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	clubId: string(),
	workId: string().nullable().optional(),
	body: string().min(1).max(2e3),
	spoiler: boolean().optional()
})).handler(createPost_createServerFn_handler, async ({ context, data }) => {
	const db = await sql();
	await assertClubMember(db, data.clubId, context.userId);
	const body = data.body.trim();
	if (!body) throw new Error("Escreva algo.");
	const id = newId();
	await db`
      insert into club_posts (id, club_id, work_id, user_id, body, spoiler)
      values (${id}, ${data.clubId}, ${data.workId ?? null}, ${context.userId}, ${body}, ${data.spoiler ?? false})
    `;
	return { id };
});
//#endregion
export { closeVote_createServerFn_handler, createClub_createServerFn_handler, createPost_createServerFn_handler, deleteClub_createServerFn_handler, getClub_createServerFn_handler, joinClub_createServerFn_handler, leaveClub_createServerFn_handler, listClubProgress_createServerFn_handler, listClubs_createServerFn_handler, listMembers_createServerFn_handler, listPosts_createServerFn_handler, listWorks_createServerFn_handler, nominateWork_createServerFn_handler, raffleWork_createServerFn_handler, setCurrentWork_createServerFn_handler, toggleVote_createServerFn_handler, updateClubProgress_createServerFn_handler, updateClub_createServerFn_handler };
