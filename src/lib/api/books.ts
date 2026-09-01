import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { FORMATS, STATUSES, unitForFormat, type Format, type Status, type UnitType } from "@/lib/formats";
import { newId, todayISO } from "@/lib/utils";
import { asNumber, mapBook, sql } from "./shared";

const formatZ = z.enum(FORMATS);
const statusZ = z.enum(STATUSES);

const bookInput = z.object({
  title: z.string().min(1).max(200),
  author: z.string().max(160).optional(),
  isbn: z.string().max(32).optional(),
  coverUrl: z.string().max(500).optional(),
  format: formatZ,
  genre: z.string().max(80).optional(),
  publisher: z.string().max(120).optional(),
  year: z.number().int().min(0).max(3000).nullable().optional(),
  totalUnits: z.number().int().min(0).max(100000).optional(),
  status: statusZ.optional(),
  progress: z.number().int().min(0).max(100000).optional(),
  ongoing: z.boolean().optional(),
  notes: z.string().max(4000).optional(),
});

export const listBooks = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const db = await sql();
    const rows = await db`
      select * from books where user_id = ${context.userId} order by updated_at desc
    `;
    return rows.map(mapBook);
  });

export const getBook = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    const db = await sql();
    const rows = await db`
      select * from books where id = ${data.id} and user_id = ${context.userId} limit 1
    `;
    const row = rows[0];
    if (!row) throw new Error("Obra não encontrada.");
    return mapBook(row);
  });

export const createBook = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(bookInput)
  .handler(async ({ context, data }) => {
    const title = data.title.trim();
    if (!title) throw new Error("Informe o título.");
    const format = data.format;
    const unit: UnitType = unitForFormat(format);
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
        ${data.notes?.trim() || null}, ${status === "reading" ? new Date().toISOString() : null}
      )
    `;
    const rows = await db`select * from books where id = ${id}`;
    return mapBook(rows[0]!);
  });

export const updateBook = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    bookInput.extend({
      id: z.string(),
      rating: z.number().int().min(1).max(5).nullable().optional(),
      review: z.string().max(4000).nullable().optional(),
      lastLocation: z.string().max(200).nullable().optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    const db = await sql();
    const existing = await db`
      select * from books where id = ${data.id} and user_id = ${context.userId} limit 1
    `;
    const prev = existing[0];
    if (!prev) throw new Error("Obra não encontrada.");
    const current = mapBook(prev);
    const format = data.format;
    const unit = unitForFormat(format);
    const status = data.status ?? current.status;
    const progress = data.progress ?? current.progress;
    const startedAt =
      status !== "to_read" ? (current.startedAt ?? new Date().toISOString()) : current.startedAt;
    const finishedAt =
      status === "finished" ? (current.finishedAt ?? new Date().toISOString()) : null;
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
        notes = ${data.notes === undefined ? current.notes : data.notes?.trim() || null},
        rating = ${data.rating === undefined ? current.rating : data.rating},
        review = ${data.review === undefined ? current.review : data.review},
        last_location = ${data.lastLocation === undefined ? current.lastLocation : data.lastLocation},
        started_at = ${startedAt},
        finished_at = ${finishedAt},
        updated_at = now()
      where id = ${data.id} and user_id = ${context.userId}
    `;
    const rows = await db`select * from books where id = ${data.id}`;
    return mapBook(rows[0]!);
  });

export const deleteBook = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    const db = await sql();
    await db`delete from reading_sessions where book_id = ${data.id} and user_id = ${context.userId}`;
    await db`delete from books where id = ${data.id} and user_id = ${context.userId}`;
    return { ok: true };
  });

export const logSession = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      bookId: z.string(),
      durationSec: z.number().int().min(0).max(12 * 3600),
      unitsRead: z.number().int().min(0).max(10000),
      progress: z.number().int().min(0).max(100000).optional(),
      lastLocation: z.string().max(200).optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    const db = await sql();
    const rows = await db`
      select * from books where id = ${data.bookId} and user_id = ${context.userId} limit 1
    `;
    const row = rows[0];
    if (!row) throw new Error("Obra não encontrada.");
    const book = mapBook(row);
    const nextProgress = data.progress ?? book.progress;
    let status: Status = book.status;
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
        started_at = ${book.startedAt ?? new Date().toISOString()},
        finished_at = ${status === "finished" ? (book.finishedAt ?? new Date().toISOString()) : book.finishedAt},
        updated_at = now()
      where id = ${data.bookId} and user_id = ${context.userId}
    `;
    const updated = await db`select * from books where id = ${data.bookId}`;
    return mapBook(updated[0]!);
  });

export const getAnalytics = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const db = await sql();
    const books = (await db`select * from books where user_id = ${context.userId}`).map(mapBook);
    const sessions = await db<{ day: string; duration_sec: unknown; units_read: unknown }>`
      select day, duration_sec, units_read from reading_sessions
      where user_id = ${context.userId}
    `;

    const pages = books
      .filter((b) => b.unitType === "pages")
      .reduce((a, b) => a + (b.status === "finished" ? b.totalUnits : b.progress), 0);
    const chapters = books
      .filter((b) => b.unitType === "chapters")
      .reduce((a, b) => a + b.progress, 0);
    const minutes = books
      .filter((b) => b.unitType === "minutes")
      .reduce((a, b) => a + b.progress, 0);

    const byFormatMap = new Map<Format, number>();
    const byGenreMap = new Map<string, number>();
    const byAuthorMap = new Map<string, number>();
    for (const b of books) {
      byFormatMap.set(b.format, (byFormatMap.get(b.format) ?? 0) + 1);
      if (b.genre) byGenreMap.set(b.genre, (byGenreMap.get(b.genre) ?? 0) + 1);
      if (b.author) byAuthorMap.set(b.author, (byAuthorMap.get(b.author) ?? 0) + 1);
    }

    const daySet = new Set(sessions.map((s) => String(s.day).slice(0, 10)));
    const sortedDays = [...daySet].sort();
    const streak = computeStreak(sortedDays);
    const bestStreak = computeBestStreak(sortedDays);

    const last14: { day: string; minutes: number; units: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = todayISO(d);
      const ofDay = sessions.filter((s) => String(s.day).slice(0, 10) === key);
      last14.push({
        day: key,
        minutes: Math.round(ofDay.reduce((a, s) => a + asNumber(s.duration_sec), 0) / 60),
        units: ofDay.reduce((a, s) => a + asNumber(s.units_read), 0),
      });
    }

    const weekStart = new Date();
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
      byFormat: [...byFormatMap.entries()].map(([format, count]) => ({ format, count })),
      byGenre: [...byGenreMap.entries()]
        .map(([genre, count]) => ({ genre, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8),
      byAuthor: [...byAuthorMap.entries()]
        .map(([author, count]) => ({ author, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8),
      last14,
    };
  });

function computeStreak(sortedDays: string[]) {
  if (sortedDays.length === 0) return 0;
  const set = new Set(sortedDays);
  const today = todayISO();
  const y = new Date();
  y.setDate(y.getDate() - 1);
  const yesterday = todayISO(y);
  if (!set.has(today) && !set.has(yesterday)) return 0;
  let cursor = set.has(today) ? new Date() : y;
  let n = 0;
  while (set.has(todayISO(cursor))) {
    n += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return n;
}

function computeBestStreak(sortedDays: string[]) {
  if (sortedDays.length === 0) return 0;
  let best = 1;
  let cur = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    const prev = new Date(sortedDays[i - 1]! + "T00:00:00");
    const now = new Date(sortedDays[i]! + "T00:00:00");
    const diff = (now.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) {
      cur += 1;
      best = Math.max(best, cur);
    } else if (diff > 1) {
      cur = 1;
    }
  }
  return best;
}
