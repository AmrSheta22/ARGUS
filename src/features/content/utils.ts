export type ParsedVideoSource =
  | { kind: "iframe"; src: string }
  | { kind: "file" }
  | { kind: "link"; href: string };

export function splitTags(raw: string): string[] {
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

const DIRECT_VIDEO_PATTERN = /\.(mp4|webm|ogg|ogv|mov)(?:$|[?#])/i;
const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export function parseVideoSource(raw: string): ParsedVideoSource | null {
  if (!raw.trim()) return null;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return { kind: "link", href: raw };
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return { kind: "link", href: raw };

  const host = url.hostname.replace(/^(www|m)\./, "");
  if (host === "youtu.be" || host === "youtube.com" || host.endsWith(".youtube.com")) {
    const id =
      host === "youtu.be"
        ? (url.pathname.split("/")[1] ?? "")
        : (url.searchParams.get("v") ??
          url.pathname.match(/\/(?:embed|shorts|live)\/([A-Za-z0-9_-]{11})/)?.[1] ??
          "");
    return id && VIDEO_ID_PATTERN.test(id)
      ? { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${id}` }
      : { kind: "link", href: raw };
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = url.pathname.match(/(\d+)/)?.[1];
    return id
      ? { kind: "iframe", src: `https://player.vimeo.com/video/${id}` }
      : { kind: "link", href: raw };
  }

  if (DIRECT_VIDEO_PATTERN.test(url.href)) return { kind: "file" };

  return { kind: "link", href: raw };
}
