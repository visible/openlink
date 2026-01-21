import { type NextRequest, NextResponse } from "next/server";
import { cached, parseTTL } from "../../lib/cache";

const DEFAULT_TTL = 24 * 60 * 60 * 1000;
const MIN_TTL = 60 * 1000;
const MAX_TTL = 31 * 24 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
	const domain = request.nextUrl.searchParams.get("domain");
	const fresh = request.nextUrl.searchParams.get("fresh") === "true";
	const ttlParam = request.nextUrl.searchParams.get("ttl");
	const theme = request.nextUrl.searchParams.get("theme") as "light" | "dark" | null;

	if (!domain) {
		return NextResponse.json(
			{ error: "Missing required parameter: domain", code: "MISSING_DOMAIN" },
			{ status: 400 },
		);
	}

	let ttl = DEFAULT_TTL;
	if (ttlParam) {
		const parsed = parseTTL(ttlParam);
		if (parsed >= MIN_TTL && parsed <= MAX_TTL) {
			ttl = parsed;
		}
	}

	const cacheKey = `favicon:v3:${domain}:${theme || "default"}`;

	try {
		const result = await cached(cacheKey, async () => fetchBestFavicon(domain, theme), {
			ttl,
			fresh,
		});

		if (result.data) {
			return new NextResponse(result.data.buffer, {
				headers: {
					"Content-Type": result.data.type,
					"X-Cache-Status": result.status,
					"X-Cache-Age": String(Math.round(result.age / 1000)),
					"X-Favicon-Source": result.data.source || "unknown",
					"Cache-Control": `public, max-age=${Math.round(ttl / 1000)}, stale-while-revalidate=${Math.round(ttl / 1000)}`,
				},
			});
		}

		const fallback = generateFallback(domain);
		return new NextResponse(fallback, {
			headers: {
				"Content-Type": "image/svg+xml",
				"X-Cache-Status": "GENERATED",
				"Cache-Control": `public, max-age=${Math.round(ttl / 1000)}`,
			},
		});
	} catch {
		const fallback = generateFallback(domain);
		return new NextResponse(fallback, {
			headers: {
				"Content-Type": "image/svg+xml",
				"X-Cache-Status": "ERROR",
				"Cache-Control": "public, max-age=3600",
			},
		});
	}
}

type FaviconResult = { buffer: ArrayBuffer; type: string; source?: string } | null;

async function fetchBestFavicon(
	domain: string,
	theme: "light" | "dark" | null,
): Promise<FaviconResult> {
	const icons: { url: string; priority: number; source: string }[] = [];

	try {
		const html = await fetchWithTimeout(`https://${domain}`, 5000, false);
		if (html) {
			icons.push(...parseIconsFromHtml(html, domain, theme));
		}
	} catch {}

	icons.sort((a, b) => b.priority - a.priority);

	for (const icon of icons) {
		const result = await fetchIcon(icon.url, icon.source);
		if (result) return result;
	}

	const commonResult = await tryCommonPaths(domain);
	if (commonResult) return commonResult;

	const externalResult = await tryExternalServices(domain);
	if (externalResult) return externalResult;

	return null;
}

function parseIconsFromHtml(
	html: string,
	domain: string,
	theme: "light" | "dark" | null,
): { url: string; priority: number; source: string }[] {
	const icons: { url: string; priority: number; source: string }[] = [];
	const base = `https://${domain}`;

	const linkRegex = /<link[^>]*>/gi;
	let linkMatch;
	while ((linkMatch = linkRegex.exec(html)) !== null) {
		const tag = linkMatch[0];
		const icon = parseLinkTag(tag, base, theme);
		if (icon && !icons.some((i) => i.url === icon.url)) {
			icons.push(icon);
		}
	}

	const manifestMatch =
		html.match(/<link[^>]*rel=["']manifest["'][^>]*href=["']([^"']+)["']/i) ||
		html.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']manifest["']/i);
	if (manifestMatch) {
		const manifestUrl = resolveUrl(manifestMatch[1], base);
		if (manifestUrl) {
			icons.push({ url: `__manifest__${manifestUrl}`, priority: 500, source: "manifest" });
		}
	}

	return icons;
}

function parseLinkTag(
	tag: string,
	base: string,
	theme: "light" | "dark" | null,
): { url: string; priority: number; source: string } | null {
	const relMatch = tag.match(/rel=["']([^"']+)["']/i);
	const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
	const sizesMatch = tag.match(/sizes=["']([^"']+)["']/i);
	const typeMatch = tag.match(/type=["']([^"']+)["']/i);
	const mediaMatch = tag.match(/media=["']([^"']+)["']/i);

	if (!relMatch || !hrefMatch) return null;

	const rel = relMatch[1].toLowerCase();
	const href = hrefMatch[1];
	const sizes = sizesMatch?.[1] || "";
	const type = typeMatch?.[1]?.toLowerCase() || "";
	const media = mediaMatch?.[1]?.toLowerCase() || "";

	const hasLightScheme =
		media.includes("prefers-color-scheme: light") || media.includes("prefers-color-scheme:light");
	const hasDarkScheme =
		media.includes("prefers-color-scheme: dark") || media.includes("prefers-color-scheme:dark");

	if (theme === "light" && hasDarkScheme) return null;
	if (theme === "dark" && hasLightScheme) return null;

	const url = resolveUrl(href, base);
	if (!url) return null;

	let priority = 0;
	let source = "link";

	if (theme === "light" && hasLightScheme) priority += 2000;
	if (theme === "dark" && hasDarkScheme) priority += 2000;

	if (rel.includes("apple-touch-icon")) {
		source = "apple-touch-icon";
		priority += 1000;

		const size = parseSize(sizes);
		if (size >= 180) priority += 200;
		else if (size >= 152) priority += 150;
		else if (size >= 120) priority += 100;
		else if (size > 0) priority += size / 2;

		if (rel.includes("precomposed")) priority += 10;
	} else if (rel === "icon" || rel === "shortcut icon") {
		source = "icon";
		priority += 100;

		if (type.includes("svg")) {
			priority += 700;
			source = "svg-icon";
		} else if (type.includes("png")) {
			priority += 50;
		}

		const size = parseSize(sizes);
		if (size >= 192) priority += 300;
		else if (size >= 128) priority += 200;
		else if (size >= 64) priority += 100;
		else if (size >= 32) priority += 50;
		else if (size > 0) priority += size / 2;
	} else {
		return null;
	}

	return { url, priority, source };
}

function parseSize(sizes: string): number {
	if (!sizes) return 0;
	const match = sizes.match(/(\d+)x(\d+)/i);
	if (!match) return 0;
	return Math.max(Number.parseInt(match[1]), Number.parseInt(match[2]));
}

function resolveUrl(path: string, base: string): string | null {
	if (!path) return null;
	try {
		if (path.startsWith("data:")) return null;
		if (path.startsWith("http://") || path.startsWith("https://")) return path;
		if (path.startsWith("//")) return `https:${path}`;
		return new URL(path, base).href;
	} catch {
		return null;
	}
}

async function tryCommonPaths(domain: string): Promise<FaviconResult> {
	const paths = [
		{ path: "/apple-touch-icon.png", source: "apple-touch-icon-path" },
		{ path: "/apple-touch-icon-180x180.png", source: "apple-touch-icon-180" },
		{ path: "/apple-touch-icon-precomposed.png", source: "apple-touch-icon-precomposed" },
		{ path: "/favicon-192x192.png", source: "favicon-192" },
		{ path: "/favicon-96x96.png", source: "favicon-96" },
		{ path: "/favicon-32x32.png", source: "favicon-32" },
		{ path: "/favicon.svg", source: "favicon-svg" },
		{ path: "/favicon.png", source: "favicon-png" },
		{ path: "/favicon.ico", source: "favicon-ico" },
	];

	for (const { path, source } of paths) {
		const result = await fetchIcon(`https://${domain}${path}`, source);
		if (result) return result;
	}

	return null;
}

async function tryExternalServices(domain: string): Promise<FaviconResult> {
	const services = [
		{ url: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`, source: "google" },
		{ url: `https://icons.duckduckgo.com/ip3/${domain}.ico`, source: "duckduckgo" },
	];

	for (const { url, source } of services) {
		const result = await fetchIcon(url, source);
		if (result) return result;
	}

	return null;
}

async function fetchIcon(url: string, source: string): Promise<FaviconResult> {
	if (url.startsWith("__manifest__")) {
		return await fetchFromManifest(url.replace("__manifest__", ""));
	}

	try {
		const res = await fetchWithTimeout(url, 4000, true);
		if (!res) return null;

		const type = res.headers.get("content-type") || "image/x-icon";
		if (!type.includes("image") && !type.includes("icon") && !type.includes("svg")) return null;

		const buffer = await res.arrayBuffer();
		if (buffer.byteLength < 50) return null;

		return { buffer, type, source };
	} catch {
		return null;
	}
}

async function fetchFromManifest(manifestUrl: string): Promise<FaviconResult> {
	try {
		const res = await fetchWithTimeout(manifestUrl, 3000, true);
		if (!res) return null;

		const manifest = await res.json();
		const icons = manifest.icons as
			| { src: string; sizes?: string; type?: string; purpose?: string }[]
			| undefined;

		if (!icons?.length) return null;

		const sorted = [...icons]
			.filter((i) => !i.purpose?.includes("maskable"))
			.sort((a, b) => {
				const sizeA = parseSize(a.sizes || "");
				const sizeB = parseSize(b.sizes || "");
				if (sizeB !== sizeA) return sizeB - sizeA;
				if (a.type?.includes("png") && !b.type?.includes("png")) return -1;
				if (b.type?.includes("png") && !a.type?.includes("png")) return 1;
				return 0;
			});

		const baseUrl = new URL(manifestUrl);
		for (const icon of sorted) {
			try {
				const iconUrl = new URL(icon.src, baseUrl).href;
				const result = await fetchIcon(iconUrl, "manifest");
				if (result) return result;
			} catch {}
		}
	} catch {}

	return null;
}

async function fetchWithTimeout(
	url: string,
	timeout: number,
	asResponse?: true,
): Promise<Response | null>;
async function fetchWithTimeout(
	url: string,
	timeout: number,
	asResponse?: false,
): Promise<string | null>;
async function fetchWithTimeout(
	url: string,
	timeout: number,
	asResponse = false,
): Promise<Response | string | null> {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeout);

	try {
		const res = await fetch(url, {
			signal: controller.signal,
			headers: {
				"User-Agent": "Mozilla/5.0 (compatible; OpenLinkBot/2.0; +https://openlink.sh)",
				Accept: "image/*,*/*;q=0.8",
			},
			redirect: "follow",
		});
		clearTimeout(timeoutId);

		if (!res.ok) return null;
		if (asResponse) return res;
		return await res.text();
	} catch {
		clearTimeout(timeoutId);
		return null;
	}
}

function generateFallback(domain: string): string {
	const letter = domain.charAt(0).toUpperCase();
	const hue = hashCode(domain) % 360;

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="20" fill="hsl(${hue}, 60%, 65%)"/>
    <text x="50" y="50" dy=".35em" text-anchor="middle" font-family="system-ui, sans-serif" font-size="50" font-weight="600" fill="white">${letter}</text>
  </svg>`;
}

function hashCode(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i);
		hash |= 0;
	}
	return Math.abs(hash);
}
