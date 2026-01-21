const og = (p) =>
	new RegExp(
		`<meta[^>]*(?:property=["']${p}["'][^>]*content=["']([^"']*)["']|content=["']([^"']*)["'][^>]*property=["']${p}["'])[^>]*>`,
		"i",
	);
const meta = (n) =>
	new RegExp(
		`<meta[^>]*(?:name=["']${n}["'][^>]*content=["']([^"']*)["']|content=["']([^"']*)["'][^>]*name=["']${n}["'])[^>]*>`,
		"i",
	);
const link = (r) =>
	new RegExp(
		`<link[^>]*(?:rel=["']${r}["'][^>]*href=["']([^"']*)["']|href=["']([^"']*)["'][^>]*rel=["']${r}["'])[^>]*>`,
		"i",
	);

const patterns = {
	ogTitle: og("og:title"),
	ogDescription: og("og:description"),
	ogImage: og("og:image"),
	ogImageWidth: og("og:image:width"),
	ogImageHeight: og("og:image:height"),
	ogImageAlt: og("og:image:alt"),
	ogType: og("og:type"),
	ogSiteName: og("og:site_name"),
	ogUrl: og("og:url"),
	ogLocale: og("og:locale"),
	ogVideo: og("og:video"),
	ogAudio: og("og:audio"),
	articleAuthor: og("article:author"),
	articlePublishedTime: og("article:published_time"),
	twitterTitle: meta("twitter:title"),
	twitterDescription: meta("twitter:description"),
	twitterImage: meta("twitter:image"),
	twitterCard: meta("twitter:card"),
	twitterSite: meta("twitter:site"),
	twitterCreator: meta("twitter:creator"),
	description: meta("description"),
	themeColor: meta("theme-color"),
	keywords: meta("keywords"),
	author: meta("author"),
	robots: meta("robots"),
	favicon: link("(?:shortcut )?icon"),
	appleTouchIcon: link("apple-touch-icon"),
	canonical: link("canonical"),
	title: /<title[^>]*>([^<]*)<\/title>/i,
	htmlLang: /<html[^>]*\slang=["']([^"']*)["'][^>]*>/i,
	contentLanguage:
		/<meta[^>]*http-equiv=["']content-language["'][^>]*content=["']([^"']*)["'][^>]*>/i,
};

const entities = {
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&quot;": '"',
	"&#39;": "'",
	"&#x27;": "'",
	"&#x2F;": "/",
	"&apos;": "'",
	"&#x3D;": "=",
	"&nbsp;": " ",
};

const entityPattern = /&(?:amp|lt|gt|quot|apos|nbsp|#39|#x27|#x2F|#x3D);/g;

function decode(str) {
	if (!str) return null;
	return str.replace(entityPattern, (match) => entities[match] || match);
}

export function parse(html) {
	const get = (key) => {
		const match = html.match(patterns[key]);
		if (!match) return null;
		return decode((match[1] || match[2] || "").trim()) || null;
	};

	return {
		ogTitle: get("ogTitle"),
		ogDescription: get("ogDescription"),
		ogImage: get("ogImage"),
		ogImageWidth: get("ogImageWidth"),
		ogImageHeight: get("ogImageHeight"),
		ogImageAlt: get("ogImageAlt"),
		ogType: get("ogType"),
		ogSiteName: get("ogSiteName"),
		ogUrl: get("ogUrl"),
		ogLocale: get("ogLocale"),
		ogVideo: get("ogVideo"),
		ogAudio: get("ogAudio"),
		articleAuthor: get("articleAuthor"),
		articlePublishedTime: get("articlePublishedTime"),
		twitterTitle: get("twitterTitle"),
		twitterDescription: get("twitterDescription"),
		twitterImage: get("twitterImage"),
		twitterCard: get("twitterCard"),
		twitterSite: get("twitterSite"),
		twitterCreator: get("twitterCreator"),
		title: get("title"),
		description: get("description"),
		favicon: get("favicon"),
		appleTouchIcon: get("appleTouchIcon"),
		canonical: get("canonical"),
		themeColor: get("themeColor"),
		keywords: get("keywords"),
		author: get("author"),
		robots: get("robots"),
		htmlLang: get("htmlLang"),
		contentLanguage: get("contentLanguage"),
	};
}
