import { parse } from "./parse.js";
import { extract } from "./extract.js";
import { fetchOembed, hasOembedSupport, detectProvider } from "./oembed.js";

export class PreviewError extends Error {
	constructor(message, code, options = {}) {
		super(message);
		this.name = "PreviewError";
		this.code = code;
		this.status = options.status;
		this.cause = options.cause;
	}
}

const defaults = {
	timeout: 10000,
	headers: {
		"User-Agent": "OpenLinkBot/1.0 (+https://openlink.sh)",
		Accept: "text/html,application/xhtml+xml",
	},
	followRedirects: true,
	includeRaw: false,
	includeOembed: false,
	validateUrl: true,
};

export async function preview(url, options = {}) {
	const opts = { ...defaults, ...options };
	const fetchFn = opts.fetch || globalThis.fetch;

	if (!url || typeof url !== "string") {
		throw new PreviewError("URL is required", "INVALID_URL");
	}

	url = normalizeUrl(url);

	if (opts.validateUrl && !isValidUrl(url)) {
		throw new PreviewError("Invalid URL format", "INVALID_URL");
	}

	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), opts.timeout);

	try {
		const response = await fetchFn(url, {
			method: "GET",
			headers: opts.headers,
			signal: controller.signal,
			redirect: opts.followRedirects ? "follow" : "manual",
		});

		if (!response.ok) {
			throw new PreviewError(`HTTP ${response.status}`, "HTTP_ERROR", {
				status: response.status,
			});
		}

		const html = await response.text();
		const parsed = parse(html);
		const data = extract(parsed, response.url || url);

		if (opts.includeRaw) {
			data.raw = parsed;
		}

		if (opts.includeOembed && hasOembedSupport(url)) {
			data.oembed = await fetchOembed(url, { fetch: fetchFn, timeout: opts.timeout });
		}

		return data;
	} catch (err) {
		if (err instanceof PreviewError) throw err;

		if (err.name === "AbortError") {
			throw new PreviewError("Request timed out", "TIMEOUT", { cause: err });
		}

		throw new PreviewError(err.message || "Failed to fetch", "FETCH_ERROR", {
			cause: err,
		});
	} finally {
		clearTimeout(timer);
	}
}

export function isValidUrl(url) {
	try {
		const parsed = new URL(url);
		return parsed.protocol === "http:" || parsed.protocol === "https:";
	} catch {
		return false;
	}
}

export function normalizeUrl(url, base) {
	if (!url) return url;

	url = url.trim();

	if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("//")) {
		url = "https://" + url;
	}

	if (base) {
		try {
			return new URL(url, base).href;
		} catch {
			return url;
		}
	}

	return url;
}

export { parse } from "./parse.js";
export { extract } from "./extract.js";
export { fetchOembed, hasOembedSupport, detectProvider } from "./oembed.js";
