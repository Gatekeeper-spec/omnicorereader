import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { FORMATS, PRIORITIES, unitForFormat } from "@/lib/formats";
import type { CatalogHit } from "@/lib/types";
import { newId } from "@/lib/utils";
import { mapWish, sql } from "./shared";

export const listWishlist = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const db = await sql();
    const rows = await db`
      select * from wishlist where user_id = ${context.userId}
      order by case priority when 'high' then 0 when 'medium' then 1 else 2 end, created_at desc
    `;
    return rows.map(mapWish);
  });

export const addWishlist = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      title: z.string().min(1).max(200),
      author: z.string().max(160).optional(),
      isbn: z.string().max(32).optional(),
      coverUrl: z.string().max(500).optional(),
      format: z.enum(FORMATS).optional(),
      priority: z.enum(PRIORITIES).optional(),
      estimatedPrice: z.number().int().min(0).max(100000).nullable().optional(),
      notes: z.string().max(500).optional(),
    }),
  )
  .handler(async ({ context, data }) => {
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
    return mapWish(rows[0]!);
  });

export const updateWishlist = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.string(),
      priority: z.enum(PRIORITIES).optional(),
      estimatedPrice: z.number().int().min(0).max(100000).nullable().optional(),
      notes: z.string().max(500).nullable().optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    const db = await sql();
    const existing = await db`
      select * from wishlist where id = ${data.id} and user_id = ${context.userId} limit 1
    `;
    if (!existing[0]) throw new Error("Item não encontrado.");
    const cur = mapWish(existing[0]);
    await db`
      update wishlist set
        priority = ${data.priority ?? cur.priority},
        estimated_price = ${data.estimatedPrice === undefined ? cur.estimatedPrice : data.estimatedPrice},
        notes = ${data.notes === undefined ? cur.notes : data.notes}
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { ok: true };
  });

export const deleteWishlist = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    const db = await sql();
    await db`delete from wishlist where id = ${data.id} and user_id = ${context.userId}`;
    return { ok: true };
  });

export const convertWishlist = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    const db = await sql();
    const rows = await db`
      select * from wishlist where id = ${data.id} and user_id = ${context.userId} limit 1
    `;
    const row = rows[0];
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

type GVolume = {
  volumeInfo?: {
    title?: string;
    authors?: string[];
    publishedDate?: string;
    publisher?: string;
    pageCount?: number;
    description?: string;
    categories?: string[];
    industryIdentifiers?: { type: string; identifier: string }[];
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
  };
};

export const searchCatalog = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ q: z.string().min(2).max(120) }))
  .handler(async ({ data }) => {
    const q = data.q.trim();
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=8&printType=books&langRestrict=pt`;
    let res: Response;
    try {
      res = await fetch(url, { headers: { Accept: "application/json" } });
    } catch {
      return [] as CatalogHit[];
    }
    if (!res.ok) return [] as CatalogHit[];
    const json = (await res.json()) as { items?: GVolume[] };
    const items = json.items ?? [];
    return items.map((it): CatalogHit => {
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
        categories: v.categories ?? [],
      };
    });
  });
