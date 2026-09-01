import { i as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { r as getSql } from "./db-BpGtqVoV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shared-C85Sz4oq.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
async function sql() {
	return getSql();
}
function asString(v) {
	if (v == null) return "";
	if (v instanceof Date) return v.toISOString();
	return String(v);
}
function asStringOrNull(v) {
	if (v == null) return null;
	if (v instanceof Date) return v.toISOString();
	const s = String(v);
	return s.length ? s : null;
}
function asNumber(v, fallback = 0) {
	if (typeof v === "number" && Number.isFinite(v)) return v;
	if (typeof v === "bigint") return Number(v);
	if (typeof v === "string" && v.trim()) {
		const n = Number(v);
		if (Number.isFinite(n)) return n;
	}
	return fallback;
}
function asNumberOrNull(v) {
	if (v == null || v === "") return null;
	const n = asNumber(v, NaN);
	return Number.isFinite(n) ? n : null;
}
function asBool(v) {
	return v === true || v === "t" || v === "true" || v === 1 || v === "1";
}
function mapBook(row) {
	return {
		id: asString(row.id),
		userId: asString(row.user_id),
		title: asString(row.title),
		author: asString(row.author),
		isbn: asStringOrNull(row.isbn),
		coverUrl: asStringOrNull(row.cover_url),
		format: asString(row.format),
		genre: asStringOrNull(row.genre),
		publisher: asStringOrNull(row.publisher),
		year: asNumberOrNull(row.year),
		totalUnits: asNumber(row.total_units),
		unitType: asString(row.unit_type),
		status: asString(row.status),
		progress: asNumber(row.progress),
		ongoing: asBool(row.ongoing),
		rating: asNumberOrNull(row.rating),
		review: asStringOrNull(row.review),
		startedAt: asStringOrNull(row.started_at),
		finishedAt: asStringOrNull(row.finished_at),
		lastLocation: asStringOrNull(row.last_location),
		notes: asStringOrNull(row.notes),
		createdAt: asString(row.created_at),
		updatedAt: asString(row.updated_at)
	};
}
function mapProfile(row) {
	return {
		userId: asString(row.user_id),
		displayName: asString(row.display_name),
		avatarUrl: asStringOrNull(row.avatar_url),
		bio: asString(row.bio ?? ""),
		seeded: asBool(row.seeded)
	};
}
function mapWish(row) {
	return {
		id: asString(row.id),
		userId: asString(row.user_id),
		title: asString(row.title),
		author: asString(row.author),
		isbn: asStringOrNull(row.isbn),
		coverUrl: asStringOrNull(row.cover_url),
		format: row.format ? asString(row.format) : null,
		priority: asString(row.priority),
		estimatedPrice: asNumberOrNull(row.estimated_price),
		notes: asStringOrNull(row.notes),
		createdAt: asString(row.created_at)
	};
}
function mapClub(row) {
	return {
		id: asString(row.id),
		name: asString(row.name),
		description: asString(row.description),
		inviteCode: asString(row.invite_code),
		ownerId: asString(row.owner_id),
		selectionMode: asString(row.selection_mode),
		memberLimit: asNumber(row.member_limit, 40),
		createdAt: asString(row.created_at),
		role: asString(row.role),
		memberCount: asNumber(row.member_count)
	};
}
function mapWork(row) {
	return {
		id: asString(row.id),
		clubId: asString(row.club_id),
		title: asString(row.title),
		author: asString(row.author),
		coverUrl: asStringOrNull(row.cover_url),
		isbn: asStringOrNull(row.isbn),
		format: asString(row.format),
		totalUnits: asNumber(row.total_units),
		unitType: asString(row.unit_type),
		synopsis: asString(row.synopsis ?? ""),
		status: asString(row.status),
		nominatedBy: asString(row.nominated_by),
		nominatedByName: asString(row.nominated_by_name ?? "Membro"),
		startedAt: asStringOrNull(row.started_at),
		finishedAt: asStringOrNull(row.finished_at),
		createdAt: asString(row.created_at),
		voteCount: asNumber(row.vote_count),
		votedByMe: asBool(row.voted_by_me)
	};
}
async function assertClubMember(db, clubId, userId) {
	const row = (await db`
    select role from club_members where club_id = ${clubId} and user_id = ${userId} limit 1
  `)[0];
	if (!row) throw new Error("Você não faz parte deste clube.");
	return row.role;
}
async function assertClubAdmin(db, clubId, userId) {
	const role = await assertClubMember(db, clubId, userId);
	if (role !== "owner" && role !== "admin") throw new Error("Apenas administradores podem fazer isso.");
	return role;
}
function displayFromUser(name, email) {
	const n = (name ?? "").trim();
	if (n) return n;
	const e = (email ?? "").trim();
	if (e.includes("@")) return e.split("@")[0];
	return "Leitor";
}
//#endregion
export { assertClubMember as a, mapBook as c, mapWish as d, mapWork as f, assertClubAdmin as i, mapClub as l, asString as n, createServerRpc as o, sql as p, asStringOrNull as r, displayFromUser as s, asNumber as t, mapProfile as u };
