export interface PreviewOptions {
	/**
	 * Request timeout in milliseconds
	 * @default 10000
	 */
	timeout?: number;

	/**
	 * Custom headers to send with the request
	 * @default { 'User-Agent': 'OpenLinkBot/1.0 (+https://openlink.sh)', 'Accept': 'text/html,application/xhtml+xml' }
	 */
	headers?: Record<string, string>;

	/**
	 * Whether to follow redirects
	 * @default true
	 */
	followRedirects?: boolean;

	/**
	 * Custom fetch function for testing or custom runtimes
	 * @default globalThis.fetch
	 */
	fetch?: typeof fetch;

	/**
	 * Include raw parsed metadata in the result
	 * @default false
	 */
	includeRaw?: boolean;

	/**
	 * Validate that the URL is reachable before parsing
	 * @default true
	 */
	validateUrl?: boolean;
}

export interface PreviewResult {
	/** Canonical URL of the page */
	url: string;

	/** Page title from og:title, twitter:title, or <title> */
	title: string | null;

	/** Page description from og:description, twitter:description, or meta description */
	description: string | null;

	/** Primary image URL from og:image or twitter:image */
	image: string | null;

	/** Favicon URL, defaults to /favicon.ico if not found */
	favicon: string;

	/** Site name from og:site_name or domain */
	siteName: string;

	/** Hostname extracted from URL */
	domain: string;

	/** Content type from og:type */
	type: string;

	/** Author name if available */
	author: string | null;

	/** Published date if available */
	publishedTime: string | null;

	/** Theme color from meta theme-color */
	themeColor: string | null;

	/** Twitter card type */
	twitterCard: string | null;

	/** Locale from og:locale */
	locale: string | null;

	/** Video URL from og:video */
	video: string | null;

	/** Audio URL from og:audio */
	audio: string | null;

	/** Keywords from meta keywords */
	keywords: string[] | null;

	/** Raw parsed metadata (only if includeRaw: true) */
	raw?: ParseResult;
}

export interface ParseResult {
	ogTitle: string | null;
	ogDescription: string | null;
	ogImage: string | null;
	ogImageWidth: string | null;
	ogImageHeight: string | null;
	ogImageAlt: string | null;
	ogType: string | null;
	ogSiteName: string | null;
	ogUrl: string | null;
	ogLocale: string | null;
	ogVideo: string | null;
	ogAudio: string | null;
	articleAuthor: string | null;
	articlePublishedTime: string | null;
	twitterTitle: string | null;
	twitterDescription: string | null;
	twitterImage: string | null;
	twitterCard: string | null;
	twitterSite: string | null;
	twitterCreator: string | null;
	title: string | null;
	description: string | null;
	favicon: string | null;
	appleTouchIcon: string | null;
	canonical: string | null;
	themeColor: string | null;
	keywords: string | null;
	author: string | null;
	robots: string | null;
}

export class PreviewError extends Error {
	/** Error code for programmatic handling */
	code: "INVALID_URL" | "TIMEOUT" | "FETCH_ERROR" | "HTTP_ERROR";

	/** HTTP status code if applicable */
	status?: number;

	/** Original error if wrapped */
	cause?: Error;

	constructor(
		message: string,
		code: PreviewError["code"],
		options?: { status?: number; cause?: Error }
	);
}

/**
 * Fetch and parse link preview metadata from a URL
 *
 * @example
 * ```ts
 * import { preview } from 'openlink'
 *
 * const data = await preview('https://github.com')
 * console.log(data.title) // "GitHub"
 * ```
 *
 * @example With options
 * ```ts
 * const data = await preview('https://github.com', {
 *   timeout: 5000,
 *   includeRaw: true
 * })
 * ```
 */
export function preview(
	url: string,
	options?: PreviewOptions
): Promise<PreviewResult>;

/**
 * Parse HTML string for Open Graph, Twitter Card, and standard meta tags
 *
 * @example
 * ```ts
 * import { parse } from 'openlink'
 *
 * const html = await fetch('https://example.com').then(r => r.text())
 * const metadata = parse(html)
 * ```
 */
export function parse(html: string): ParseResult;

/**
 * Extract and normalize metadata from parsed result
 *
 * @example
 * ```ts
 * import { parse, extract } from 'openlink'
 *
 * const parsed = parse(html)
 * const result = extract(parsed, 'https://example.com')
 * ```
 */
export function extract(parsed: ParseResult, url: string): PreviewResult;

/**
 * Check if a string is a valid URL
 */
export function isValidUrl(url: string): boolean;

/**
 * Normalize a URL (add https:// if missing, resolve relative paths)
 */
export function normalizeUrl(url: string, base?: string): string;
