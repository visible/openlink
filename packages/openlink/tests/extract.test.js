import assert from "node:assert";
import { test } from "node:test";
import { extract } from "../src/extract.js";

test("extract with og data", () => {
	const parsed = {
		ogTitle: "OG Title",
		ogDescription: "OG Description",
		ogImage: "https://example.com/og.png",
		ogType: "article",
		ogSiteName: "Example Site",
		ogUrl: "https://example.com/page",
		ogLocale: "en_US",
		twitterTitle: null,
		twitterDescription: null,
		twitterImage: null,
		twitterCard: null,
		title: "HTML Title",
		description: "HTML Description",
		favicon: null,
		appleTouchIcon: null,
		canonical: null,
		themeColor: null,
		keywords: null,
		author: null,
		articleAuthor: null,
		articlePublishedTime: null,
		ogVideo: null,
		ogAudio: null,
		htmlLang: "en",
		contentLanguage: null,
	};

	const result = extract(parsed, "https://example.com/page");

	assert.strictEqual(result.title, "OG Title");
	assert.strictEqual(result.description, "OG Description");
	assert.strictEqual(result.image, "https://example.com/og.png");
	assert.strictEqual(result.type, "article");
	assert.strictEqual(result.siteName, "Example Site");
	assert.strictEqual(result.locale, "en_US");
	assert.strictEqual(result.lang, "en");
	assert.strictEqual(result.contentType, "article");
});

test("extract fallback to twitter", () => {
	const parsed = {
		ogTitle: null,
		ogDescription: null,
		ogImage: null,
		twitterTitle: "Twitter Title",
		twitterDescription: "Twitter Desc",
		twitterImage: "https://example.com/twitter.png",
		twitterCard: "summary",
		title: "HTML Title",
		description: null,
		favicon: null,
		appleTouchIcon: null,
		canonical: null,
		ogType: null,
		ogSiteName: null,
		ogUrl: null,
		ogLocale: null,
		themeColor: null,
		keywords: null,
		author: null,
		articleAuthor: null,
		articlePublishedTime: null,
		ogVideo: null,
		ogAudio: null,
		htmlLang: null,
		contentLanguage: null,
	};

	const result = extract(parsed, "https://example.com");

	assert.strictEqual(result.title, "Twitter Title");
	assert.strictEqual(result.description, "Twitter Desc");
	assert.strictEqual(result.image, "https://example.com/twitter.png");
	assert.strictEqual(result.twitterCard, "summary");
});

test("extract fallback to html", () => {
	const parsed = {
		ogTitle: null,
		ogDescription: null,
		ogImage: null,
		twitterTitle: null,
		twitterDescription: null,
		twitterImage: null,
		twitterCard: null,
		title: "HTML Title",
		description: "HTML Description",
		favicon: "/favicon.ico",
		appleTouchIcon: null,
		canonical: null,
		ogType: null,
		ogSiteName: null,
		ogUrl: null,
		ogLocale: null,
		themeColor: "#000",
		keywords: "test, keywords",
		author: "Author Name",
		articleAuthor: null,
		articlePublishedTime: null,
		ogVideo: null,
		ogAudio: null,
		htmlLang: null,
		contentLanguage: null,
	};

	const result = extract(parsed, "https://example.com");

	assert.strictEqual(result.title, "HTML Title");
	assert.strictEqual(result.description, "HTML Description");
	assert.strictEqual(result.favicon, "https://example.com/favicon.ico");
	assert.strictEqual(result.themeColor, "#000");
	assert.deepStrictEqual(result.keywords, ["test", "keywords"]);
	assert.strictEqual(result.author, "Author Name");
});

test("resolve relative urls", () => {
	const parsed = {
		ogTitle: null,
		ogDescription: null,
		ogImage: "/images/og.png",
		twitterTitle: null,
		twitterDescription: null,
		twitterImage: null,
		twitterCard: null,
		title: null,
		description: null,
		favicon: "/favicon.ico",
		appleTouchIcon: "/apple-icon.png",
		canonical: null,
		ogType: null,
		ogSiteName: null,
		ogUrl: null,
		ogLocale: null,
		themeColor: null,
		keywords: null,
		author: null,
		articleAuthor: null,
		articlePublishedTime: null,
		ogVideo: "/video.mp4",
		ogAudio: null,
		htmlLang: null,
		contentLanguage: null,
	};

	const result = extract(parsed, "https://example.com/page");

	assert.strictEqual(result.image, "https://example.com/images/og.png");
	assert.strictEqual(result.favicon, "https://example.com/apple-icon.png");
	assert.strictEqual(result.video, "https://example.com/video.mp4");
});

test("resolve protocol-relative urls", () => {
	const parsed = {
		ogTitle: null,
		ogDescription: null,
		ogImage: "//cdn.example.com/image.png",
		twitterTitle: null,
		twitterDescription: null,
		twitterImage: null,
		twitterCard: null,
		title: null,
		description: null,
		favicon: null,
		appleTouchIcon: null,
		canonical: null,
		ogType: null,
		ogSiteName: null,
		ogUrl: null,
		ogLocale: null,
		themeColor: null,
		keywords: null,
		author: null,
		articleAuthor: null,
		articlePublishedTime: null,
		ogVideo: null,
		ogAudio: null,
		htmlLang: null,
		contentLanguage: null,
	};

	const result = extract(parsed, "https://example.com");

	assert.strictEqual(result.image, "https://cdn.example.com/image.png");
});

test("default favicon", () => {
	const parsed = {
		ogTitle: null,
		ogDescription: null,
		ogImage: null,
		twitterTitle: null,
		twitterDescription: null,
		twitterImage: null,
		twitterCard: null,
		title: null,
		description: null,
		favicon: null,
		appleTouchIcon: null,
		canonical: null,
		ogType: null,
		ogSiteName: null,
		ogUrl: null,
		ogLocale: null,
		themeColor: null,
		keywords: null,
		author: null,
		articleAuthor: null,
		articlePublishedTime: null,
		ogVideo: null,
		ogAudio: null,
		htmlLang: null,
		contentLanguage: null,
	};

	const result = extract(parsed, "https://example.com/page");

	assert.strictEqual(result.favicon, "https://example.com/favicon.ico");
	assert.strictEqual(result.domain, "example.com");
	assert.strictEqual(result.siteName, "example.com");
});

test("detect content type video", () => {
	const parsed = {
		ogTitle: null,
		ogDescription: null,
		ogImage: null,
		twitterTitle: null,
		twitterDescription: null,
		twitterImage: null,
		twitterCard: null,
		title: null,
		description: null,
		favicon: null,
		appleTouchIcon: null,
		canonical: null,
		ogType: "website",
		ogSiteName: null,
		ogUrl: null,
		ogLocale: null,
		themeColor: null,
		keywords: null,
		author: null,
		articleAuthor: null,
		articlePublishedTime: null,
		ogVideo: "https://example.com/video.mp4",
		ogAudio: null,
		htmlLang: null,
		contentLanguage: null,
	};

	const result = extract(parsed, "https://example.com");

	assert.strictEqual(result.contentType, "video");
});

test("detect content type article by published time", () => {
	const parsed = {
		ogTitle: null,
		ogDescription: null,
		ogImage: null,
		twitterTitle: null,
		twitterDescription: null,
		twitterImage: null,
		twitterCard: null,
		title: null,
		description: null,
		favicon: null,
		appleTouchIcon: null,
		canonical: null,
		ogType: "website",
		ogSiteName: null,
		ogUrl: null,
		ogLocale: null,
		themeColor: null,
		keywords: null,
		author: null,
		articleAuthor: null,
		articlePublishedTime: "2024-01-15",
		ogVideo: null,
		ogAudio: null,
		htmlLang: null,
		contentLanguage: null,
	};

	const result = extract(parsed, "https://example.com");

	assert.strictEqual(result.contentType, "article");
});

test("language from locale fallback", () => {
	const parsed = {
		ogTitle: null,
		ogDescription: null,
		ogImage: null,
		twitterTitle: null,
		twitterDescription: null,
		twitterImage: null,
		twitterCard: null,
		title: null,
		description: null,
		favicon: null,
		appleTouchIcon: null,
		canonical: null,
		ogType: null,
		ogSiteName: null,
		ogUrl: null,
		ogLocale: "fr_FR",
		themeColor: null,
		keywords: null,
		author: null,
		articleAuthor: null,
		articlePublishedTime: null,
		ogVideo: null,
		ogAudio: null,
		htmlLang: null,
		contentLanguage: null,
	};

	const result = extract(parsed, "https://example.com");

	assert.strictEqual(result.lang, "fr");
	assert.strictEqual(result.locale, "fr_FR");
});
