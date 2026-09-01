import { getSql, type Sql } from "@/lib/db";
import type { Book, Club, ClubWork, Profile, WishlistItem } from "@/lib/types";
import type { Format, Priority, SelectionMode, Status, UnitType } from "@/lib/formats";

export async function sql() {
  return getSql();
}

export function asString(v: unknown): string {
  if (v == null) return "";
  if (v instanceof Date) return v.toISOString();
  return String(v);
}

export function asStringOrNull(v: unknown): string | null {
  if (v == null) return null;
  if (v instanceof Date) return v.toISOString();
  const s = String(v);
  return s.length ? s : null;
}

export function asNumber(v: unknown, fallback = 0): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "string" && v.trim()) {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

export function asNumberOrNull(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = asNumber(v, Number.NaN);
  return Number.isFinite(n) ? n : null;
}

export function asBool(v: unknown): boolean {
  return v === true || v === "t" || v === "true" || v === 1 || v === "1";
}

type BookRow = Record<string, unknown>;

export function mapBook(row: BookRow): Book {
  return {
    id: asString(row.id),
    userId: asString(row.user_id),
    title: asString(row.title),
    author: asString(row.author),
    isbn: asStringOrNull(row.isbn),
    coverUrl: asStringOrNull(row.cover_url),
    format: asString(row.format) as Format,
    genre: asStringOrNull(row.genre),
    publisher: asStringOrNull(row.publisher),
    year: asNumberOrNull(row.year),
    totalUnits: asNumber(row.total_units),
    unitType: asString(row.unit_type) as UnitType,
    status: asString(row.status) as Status,
    progress: asNumber(row.progress),
    ongoing: asBool(row.ongoing),
    rating: asNumberOrNull(row.rating),
    review: asStringOrNull(row.review),
    startedAt: asStringOrNull(row.started_at),
    finishedAt: asStringOrNull(row.finished_at),
    lastLocation: asStringOrNull(row.last_location),
    notes: asStringOrNull(row.notes),
    createdAt: asString(row.created_at),
    updatedAt: asString(row.updated_at),
  };
}

export function mapProfile(row: BookRow): Profile {
  return {
    userId: asString(row.user_id),
    displayName: asString(row.display_name),
    avatarUrl: asStringOrNull(row.avatar_url),
    bio: asString(row.bio ?? ""),
    seeded: asBool(row.seeded),
  };
}

export function mapWish(row: BookRow): WishlistItem {
  return {
    id: asString(row.id),
    userId: asString(row.user_id),
    title: asString(row.title),
    author: asString(row.author),
    isbn: asStringOrNull(row.isbn),
    coverUrl: asStringOrNull(row.cover_url),
    format: row.format ? (asString(row.format) as Format) : null,
    priority: asString(row.priority) as Priority,
    estimatedPrice: asNumberOrNull(row.estimated_price),
    notes: asStringOrNull(row.notes),
    createdAt: asString(row.created_at),
  };
}

export function mapClub(row: BookRow): Club {
  return {
    id: asString(row.id),
    name: asString(row.name),
    description: asString(row.description),
    inviteCode: asString(row.invite_code),
    ownerId: asString(row.owner_id),
    selectionMode: asString(row.selection_mode) as SelectionMode,
    memberLimit: asNumber(row.member_limit, 40),
    createdAt: asString(row.created_at),
    role: asString(row.role) as Club["role"],
    memberCount: asNumber(row.member_count),
  };
}

export function mapWork(row: BookRow): ClubWork {
  return {
    id: asString(row.id),
    clubId: asString(row.club_id),
    title: asString(row.title),
    author: asString(row.author),
    coverUrl: asStringOrNull(row.cover_url),
    isbn: asStringOrNull(row.isbn),
    format: asString(row.format) as Format,
    totalUnits: asNumber(row.total_units),
    unitType: asString(row.unit_type) as UnitType,
    synopsis: asString(row.synopsis ?? ""),
    status: asString(row.status) as ClubWork["status"],
    nominatedBy: asString(row.nominated_by),
    nominatedByName: asString(row.nominated_by_name ?? "Membro"),
    startedAt: asStringOrNull(row.started_at),
    finishedAt: asStringOrNull(row.finished_at),
    createdAt: asString(row.created_at),
    voteCount: asNumber(row.vote_count),
    votedByMe: asBool(row.voted_by_me),
  };
}

export async function assertClubMember(db: Sql, clubId: string, userId: string) {
  const rows = await db<{ role: string }>`
    select role from club_members where club_id = ${clubId} and user_id = ${userId} limit 1
  `;
  const row = rows[0];
  if (!row) throw new Error("Você não faz parte deste clube.");
  return row.role as "owner" | "admin" | "member";
}

export async function assertClubAdmin(db: Sql, clubId: string, userId: string) {
  const role = await assertClubMember(db, clubId, userId);
  if (role !== "owner" && role !== "admin") throw new Error("Apenas administradores podem fazer isso.");
  return role;
}

export function displayFromUser(name: string | null | undefined, email: string | null | undefined) {
  const n = (name ?? "").trim();
  if (n) return n;
  const e = (email ?? "").trim();
  if (e.includes("@")) return e.split("@")[0]!;
  return "Leitor";
}
