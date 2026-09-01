import { hashHue } from "@/lib/utils";
import { cn } from "@/lib/utils";

const palettes = [
  "bg-primary text-primary-foreground",
  "bg-foreground text-background",
  "bg-chart-2 text-primary-foreground",
  "bg-chart-3 text-primary-foreground",
  "bg-chart-5 text-primary-foreground",
] as const;

export function Cover({
  title,
  author,
  coverUrl,
  className,
}: {
  title: string;
  author?: string;
  coverUrl?: string | null;
  className?: string;
}) {
  const tone = palettes[hashHue(title + (author ?? "")) % palettes.length]!;
  return (
    <div
      className={cn(
        "relative aspect-[2/3] overflow-hidden rounded-md",
        "outline outline-1 -outline-offset-1 outline-foreground/10",
        className,
      )}
    >
      {coverUrl ? (
        <img
          src={coverUrl}
          alt=""
          className="size-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            const fallback = e.currentTarget.nextElementSibling;
            if (fallback instanceof HTMLElement) fallback.hidden = false;
          }}
        />
      ) : null}
      <div
        hidden={Boolean(coverUrl)}
        className={cn("absolute inset-0 flex flex-col justify-between p-3", tone)}
      >
        <p className="text-[10px] font-medium tracking-[0.18em] uppercase opacity-70 line-clamp-2">
          {author || "Autor desconhecido"}
        </p>
        <p className="font-display text-[15px] leading-tight line-clamp-5">{title}</p>
        <p className="text-[9px] tracking-[0.2em] uppercase opacity-50">OmniReader</p>
      </div>
    </div>
  );
}
