import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { FORMATS, SELECTION_MODES, unitForFormat } from "@/lib/formats";
import { inviteCode, newId } from "@/lib/utils";
import {
  asNumber,
  asString,
  asStringOrNull,
  assertClubAdmin,
  assertClubMember,
  mapClub,
  mapWork,
  sql,
} from "./shared";

const formatZ = z.enum(FORMATS);

export const listClubs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const db = await sql();
    const rows = await db`
      select c.*, cm.role,
        (select count(*)::int from club_members m where m.club_id = c.id) as member_count
      from clubs c
      join club_members cm on cm.club_id = c.id
      where cm.user_id = ${context.userId}
      order by c.created_at desc
    `;
    return rows.map(mapClub);
  });

export const getClub = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ clubId: z.string() }))
  .handler(async ({ context, data }) => {
    const db = await sql();
    await assertClubMember(db, data.clubId, context.userId);
    const rows = await db`
      select c.*, cm.role,
        (select count(*)::int from club_members m where m.club_id = c.id) as member_count
      from clubs c
      join club_members cm on cm.club_id = c.id and cm.user_id = ${context.userId}
      where c.id = ${data.clubId}
      limit 1
    `;
    const row = rows[0];
    if (!row) throw new Error("Clube não encontrado.");
    return mapClub(row);
  });

export const createClub = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      name: z.string().min(2).max(80),
      description: z.string().max(400).optional(),
      selectionMode: z.enum(SELECTION_MODES).optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    const db = await sql();
    const id = newId();
    let code = inviteCode();
    for (let i = 0; i < 5; i++) {
      const clash = await db`select 1 from clubs where invite_code = ${code} limit 1`;
      if (clash.length === 0) break;
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
    return mapClub(rows[0]!);
  });

export const joinClub = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ code: z.string().min(4).max(12) }))
  .handler(async ({ context, data }) => {
    const db = await sql();
    const code = data.code.trim().toUpperCase();
    const clubs = await db`select * from clubs where invite_code = ${code} limit 1`;
    const club = clubs[0];
    if (!club) throw new Error("Código inválido.");
    const clubId = asString(club.id);
    const existing = await db`
      select 1 from club_members where club_id = ${clubId} and user_id = ${context.userId}
    `;
    if (existing.length) {
      const rows = await db`
        select c.*, cm.role,
          (select count(*)::int from club_members m where m.club_id = c.id) as member_count
        from clubs c join club_members cm on cm.club_id = c.id and cm.user_id = ${context.userId}
        where c.id = ${clubId}
      `;
      return mapClub(rows[0]!);
    }
    const [{ n }] = await db<{ n: number }>`
      select count(*)::int as n from club_members where club_id = ${clubId}
    `;
    if (asNumber(n) >= asNumber(club.member_limit, 40)) throw new Error("Este clube está lotado.");
    await db`insert into club_members (club_id, user_id, role) values (${clubId}, ${context.userId}, 'member')`;
    const rows = await db`
      select c.*, 'member' as role,
        (select count(*)::int from club_members m where m.club_id = c.id) as member_count
      from clubs c where c.id = ${clubId}
    `;
    return mapClub(rows[0]!);
  });

export const updateClub = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      clubId: z.string(),
      name: z.string().min(2).max(80),
      description: z.string().max(400),
      selectionMode: z.enum(SELECTION_MODES),
      memberLimit: z.number().int().min(2).max(200),
    }),
  )
  .handler(async ({ context, data }) => {
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

export const leaveClub = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ clubId: z.string() }))
  .handler(async ({ context, data }) => {
    const db = await sql();
    const role = await assertClubMember(db, data.clubId, context.userId);
    if (role === "owner") throw new Error("Transfira a liderança ou apague o clube antes de sair.");
    await db`delete from club_members where club_id = ${data.clubId} and user_id = ${context.userId}`;
    return { ok: true };
  });

export const deleteClub = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ clubId: z.string() }))
  .handler(async ({ context, data }) => {
    const db = await sql();
    const role = await assertClubMember(db, data.clubId, context.userId);
    if (role !== "owner") throw new Error("Apenas o criador pode apagar o clube.");
    await db`delete from club_ratings where work_id in (select id from club_works where club_id = ${data.clubId})`;
    await db`delete from club_votes where work_id in (select id from club_works where club_id = ${data.clubId})`;
    await db`delete from club_progress where club_id = ${data.clubId}`;
    await db`delete from club_posts where club_id = ${data.clubId}`;
    await db`delete from club_works where club_id = ${data.clubId}`;
    await db`delete from club_members where club_id = ${data.clubId}`;
    await db`delete from clubs where id = ${data.clubId}`;
    return { ok: true };
  });

export const listMembers = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ clubId: z.string() }))
  .handler(async ({ context, data }) => {
    const db = await sql();
    await assertClubMember(db, data.clubId, context.userId);
    const rows = await db`
      select m.user_id, m.role, m.joined_at, p.display_name, p.avatar_url
      from club_members m
      left join profiles p on p.user_id = m.user_id
      where m.club_id = ${data.clubId}
      order by m.joined_at
    `;
    return rows.map((r) => ({
      userId: asString(r.user_id),
      displayName: asString(r.display_name || "Leitor"),
      avatarUrl: asStringOrNull(r.avatar_url),
      role: asString(r.role) as "owner" | "admin" | "member",
      joinedAt: asString(r.joined_at),
    }));
  });

export const listWorks = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ clubId: z.string() }))
  .handler(async ({ context, data }) => {
    const db = await sql();
    await assertClubMember(db, data.clubId, context.userId);
    const rows = await db`
      select w.*,
        coalesce(p.display_name, 'Membro') as nominated_by_name,
        (select count(*)::int from club_votes v where v.work_id = w.id) as vote_count,
        exists(select 1 from club_votes v where v.work_id = w.id and v.user_id = ${context.userId}) as voted_by_me
      from club_works w
      left join profiles p on p.user_id = w.nominated_by
      where w.club_id = ${data.clubId}
      order by w.created_at desc
    `;
    return rows.map(mapWork);
  });

export const nominateWork = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      clubId: z.string(),
      title: z.string().min(1).max(200),
      author: z.string().max(160).optional(),
      coverUrl: z.string().max(500).optional(),
      isbn: z.string().max(32).optional(),
      format: formatZ,
      totalUnits: z.number().int().min(0).max(100000).optional(),
      synopsis: z.string().max(800).optional(),
    }),
  )
  .handler(async ({ context, data }) => {
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

export const toggleVote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ clubId: z.string(), workId: z.string() }))
  .handler(async ({ context, data }) => {
    const db = await sql();
    await assertClubMember(db, data.clubId, context.userId);
    const work = await db`
      select id, status from club_works where id = ${data.workId} and club_id = ${data.clubId} limit 1
    `;
    if (!work[0] || asString(work[0].status) !== "nominated") throw new Error("Esta indicação não está aberta.");
    const existing = await db`
      select 1 from club_votes where work_id = ${data.workId} and user_id = ${context.userId}
    `;
    if (existing.length) {
      await db`delete from club_votes where work_id = ${data.workId} and user_id = ${context.userId}`;
      return { voted: false };
    }
    await db`insert into club_votes (work_id, user_id) values (${data.workId}, ${context.userId})`;
    return { voted: true };
  });

export const setCurrentWork = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ clubId: z.string(), workId: z.string() }))
  .handler(async ({ context, data }) => {
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

export const raffleWork = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ clubId: z.string() }))
  .handler(async ({ context, data }) => {
    const db = await sql();
    await assertClubAdmin(db, data.clubId, context.userId);
    const noms = await db<{ id: string }>`
      select id from club_works where club_id = ${data.clubId} and status = 'nominated'
    `;
    if (noms.length === 0) throw new Error("Não há indicações para sortear.");
    const pick = noms[Math.floor(Math.random() * noms.length)]!;
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

export const closeVote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ clubId: z.string() }))
  .handler(async ({ context, data }) => {
    const db = await sql();
    await assertClubAdmin(db, data.clubId, context.userId);
    const ranked = await db<{ id: string; n: number }>`
      select w.id, count(v.user_id)::int as n
      from club_works w
      left join club_votes v on v.work_id = w.id
      where w.club_id = ${data.clubId} and w.status = 'nominated'
      group by w.id
      order by n desc
    `;
    if (ranked.length === 0) throw new Error("Não há indicações.");
    const top = asNumber(ranked[0]!.n);
    const tied = ranked.filter((r) => asNumber(r.n) === top);
    const pick = tied[Math.floor(Math.random() * tied.length)]!;
    await db`
      update club_works set status = 'archived', finished_at = now()
      where club_id = ${data.clubId} and status = 'current'
    `;
    await db`
      update club_works set status = 'current', started_at = now()
      where id = ${pick.id} and club_id = ${data.clubId}
    `;
    return { workId: pick.id, tied: tied.length > 1 };
  });

export const listClubProgress = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ clubId: z.string(), workId: z.string() }))
  .handler(async ({ context, data }) => {
    const db = await sql();
    await assertClubMember(db, data.clubId, context.userId);
    const rows = await db`
      select m.user_id, coalesce(p.display_name, 'Leitor') as display_name, p.avatar_url,
        pr.progress, pr.updated_at
      from club_members m
      left join profiles p on p.user_id = m.user_id
      left join club_progress pr on pr.club_id = m.club_id and pr.user_id = m.user_id and pr.work_id = ${data.workId}
      where m.club_id = ${data.clubId}
      order by coalesce(pr.progress, 0) desc, p.display_name
    `;
    return rows.map((r) => ({
      userId: asString(r.user_id),
      displayName: asString(r.display_name),
      avatarUrl: asStringOrNull(r.avatar_url),
      progress: asNumber(r.progress),
      updatedAt: asStringOrNull(r.updated_at),
    }));
  });

export const updateClubProgress = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ clubId: z.string(), workId: z.string(), progress: z.number().int().min(0).max(100000) }))
  .handler(async ({ context, data }) => {
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

export const listPosts = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ clubId: z.string() }))
  .handler(async ({ context, data }) => {
    const db = await sql();
    await assertClubMember(db, data.clubId, context.userId);
    const rows = await db`
      select po.*, coalesce(p.display_name, 'Leitor') as display_name, p.avatar_url
      from club_posts po
      left join profiles p on p.user_id = po.user_id
      where po.club_id = ${data.clubId}
      order by po.created_at desc
      limit 80
    `;
    return rows.map((r) => ({
      id: asString(r.id),
      clubId: asString(r.club_id),
      workId: asStringOrNull(r.work_id),
      userId: asString(r.user_id),
      displayName: asString(r.display_name),
      avatarUrl: asStringOrNull(r.avatar_url),
      body: asString(r.body),
      spoiler: r.spoiler === true || r.spoiler === "t" || r.spoiler === "true",
      createdAt: asString(r.created_at),
    }));
  });

export const createPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      clubId: z.string(),
      workId: z.string().nullable().optional(),
      body: z.string().min(1).max(2000),
      spoiler: z.boolean().optional(),
    }),
  )
  .handler(async ({ context, data }) => {
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
