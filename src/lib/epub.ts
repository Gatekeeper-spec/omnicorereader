import JSZip from "jszip";

export type EpubChapter = { href: string; title: string; html: string };

function xmlAttr(xml: string, attr: string) {
  return xml.match(new RegExp(`${attr}="([^"]+)"`))?.[1] ?? null;
}

function resolvePath(base: string, rel: string) {
  if (!rel || rel.startsWith("/")) return rel.replace(/^\//, "");
  const parts = base.split("/").slice(0, -1);
  for (const seg of rel.split("/")) {
    if (seg === "..") parts.pop();
    else if (seg && seg !== ".") parts.push(seg);
  }
  return parts.join("/");
}

function stripUnsafe(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[\s\S]*?>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

export async function parseEpub(blob: Blob): Promise<EpubChapter[]> {
  const zip = await JSZip.loadAsync(blob);
  const container = await zip.file("META-INF/container.xml")?.async("string");
  if (!container) throw new Error("EPUB inválido: container.xml ausente.");
  const opfPath = xmlAttr(container, "full-path");
  if (!opfPath) throw new Error("EPUB inválido: OPF não encontrado.");
  const opf = await zip.file(opfPath)?.async("string");
  if (!opf) throw new Error("EPUB inválido: OPF ilegível.");

  const manifest = new Map<string, { href: string; type: string }>();
  const itemRe = /<item\b[^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(opf))) {
    const tag = m[0];
    const id = xmlAttr(tag, "id");
    const href = xmlAttr(tag, "href");
    const type = xmlAttr(tag, "media-type") ?? "";
    if (id && href) manifest.set(id, { href, type });
  }

  const spineIds: string[] = [];
  const spineRe = /<itemref\b[^>]*>/gi;
  while ((m = spineRe.exec(opf))) {
    const idref = xmlAttr(m[0], "idref");
    if (idref) spineIds.push(idref);
  }

  const chapters: EpubChapter[] = [];
  for (const id of spineIds) {
    const item = manifest.get(id);
    if (!item) continue;
    const path = resolvePath(opfPath, item.href);
    const file = zip.file(path);
    if (!file) continue;
    let html = await file.async("string");
    const imgRe = /src=["']([^"']+)["']/gi;
    const replacements: { from: string; to: string }[] = [];
    let im: RegExpExecArray | null;
    while ((im = imgRe.exec(html))) {
      const src = im[1]!;
      if (src.startsWith("data:") || src.startsWith("http")) continue;
      const imgPath = resolvePath(path, src);
      const imgFile = zip.file(imgPath);
      if (!imgFile) continue;
      const buf = await imgFile.async("blob");
      const url = URL.createObjectURL(buf);
      replacements.push({ from: src, to: url });
    }
    for (const r of replacements) html = html.replaceAll(srcAttr(r.from), srcAttr(r.to));
    const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
    const title =
      html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, "").trim() ||
      `Capítulo ${chapters.length + 1}`;
    chapters.push({ href: path, title, html: stripUnsafe(body) });
  }
  if (chapters.length === 0) throw new Error("Nenhum capítulo encontrado neste EPUB.");
  return chapters;
}

function srcAttr(v: string) {
  return `src="${v}"`;
}
