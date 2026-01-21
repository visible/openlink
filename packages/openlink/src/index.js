import { extract } from "./extract.js";
import { extractJsonLd, parseJsonLd } from "./jsonld.js";
import { detectProvider, fetchOembed, hasOembedSupport } from "./oembed.js";
import { parse } from "./parse.js";
import { isRetryable, withRetry } from "./retry.js";

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
	includeJsonLd: false,
	validateUrl: true,
	retry: 0,
	retryDelay: 1000,
};

export async function preview(url, options = {}) {
	const opts = { ...defaults, ...options };

	if (!url || typeof url !== "string") {
		throw new PreviewError("URL is required", "INVALID_URL");
	}

	const normalized = normalizeUrl(url);

	if (opts.validateUrl && !isValidUrl(normalized)) {
		throw new PreviewError("Invalid URL format", "INVALID_URL");
	}

	const doFetch = () => fetchPreview(normalized, opts);

	if (opts.retry > 0) {
		return withRetry(doFetch, {
			retries: opts.retry,
			delay: opts.retryDelay,
			shouldRetry: isRetryable,
		});
	}

	return doFetch();
}

async function fetchPreview(url, opts) {
	const fetchFn = opts.fetch || globalThis.fetch;
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
			const statusText = getStatusText(response.status);
			throw new PreviewError(`${statusText} (${response.status})`, "HTTP_ERROR", {
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

		if (opts.includeJsonLd) {
			const items = parseJsonLd(html);
			data.jsonLd = extractJsonLd(items);
		}

		return data;
	} catch (err) {
		if (err instanceof PreviewError) throw err;

		if (err.name === "AbortError") {
			throw new PreviewError(`Request timed out after ${opts.timeout}ms`, "TIMEOUT", {
				cause: err,
			});
		}

		if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
			throw new PreviewError(`Cannot connect to ${new URL(url).hostname}`, "FETCH_ERROR", {
				cause: err,
			});
		}

		if (err.code === "CERT_HAS_EXPIRED" || err.code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE") {
			throw new PreviewError(`SSL certificate error for ${new URL(url).hostname}`, "FETCH_ERROR", {
				cause: err,
			});
		}

		throw new PreviewError(err.message || `Failed to fetch ${url}`, "FETCH_ERROR", {
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

	let result = url.trim();

	if (base) {
		try {
			return new URL(result, base).href;
		} catch {
			return result;
		}
	}

	if (!result.startsWith("http://") && !result.startsWith("https://") && !result.startsWith("//")) {
		result = `https://${result}`;
	}

	return result;
}

function getStatusText(status) {
	const texts = {
		400: "Bad Request",
		401: "Unauthorized",
		403: "Forbidden",
		404: "Not Found",
		405: "Method Not Allowed",
		408: "Request Timeout",
		410: "Gone",
		429: "Too Many Requests",
		500: "Internal Server Error",
		502: "Bad Gateway",
		503: "Service Unavailable",
		504: "Gateway Timeout",
	};
	return texts[status] || "HTTP Error";
}

export { parse } from "./parse.js";
export { extract } from "./extract.js";
export { fetchOembed, hasOembedSupport, detectProvider } from "./oembed.js";
export { parseJsonLd, extractJsonLd } from "./jsonld.js";
export { withRetry, isRetryable } from "./retry.js";
export { createProxyFetch, corsProxy, allOriginsProxy } from "./proxy.js";
export { createCache, cacheKey, memoryCache, withCache } from "./cache.js";
export { getImageSize } from "./image.js";
