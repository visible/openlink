export function extract(parsed, url) {
	const base = new URL(url);

	const title = parsed.ogTitle || parsed.twitterTitle || parsed.title || null;
	const description =
		parsed.ogDescription || parsed.twitterDescription || parsed.description || null;
	const image = resolve(parsed.ogImage || parsed.twitterImage, base);
	const favicon =
		resolve(parsed.appleTouchIcon, base) ||
		resolve(parsed.favicon, base) ||
		`${base.origin}/favicon.ico`;
	const canonical = parsed.canonical || parsed.ogUrl || url;
	const type = parsed.ogType || "website";
	const siteName = parsed.ogSiteName || base.hostname;
	const author = parsed.articleAuthor || parsed.author || null;
	const publishedTime = parsed.articlePublishedTime || null;
	const themeColor = parsed.themeColor || null;
	const twitterCard = parsed.twitterCard || null;
	const locale = parsed.ogLocale || null;
	const video = resolve(parsed.ogVideo, base);
	const audio = resolve(parsed.ogAudio, base);
	const keywords = parsed.keywords ? parsed.keywords.split(",").map((k) => k.trim()) : null;
	const lang = parsed.htmlLang || parsed.contentLanguage || (locale ? locale.split("_")[0] : null);
	const contentType = detectContentType(type, video, audio, parsed);

	return {
		url: canonical,
		title,
		description,
		image,
		favicon,
		siteName,
		domain: base.hostname,
		type,
		contentType,
		author,
		publishedTime,
		themeColor,
		twitterCard,
		locale,
		lang,
		video,
		audio,
		keywords,
	};
}

function detectContentType(ogType, video, audio, parsed) {
	if (video) return "video";
	if (audio) return "audio";
	if (ogType === "article" || parsed.articlePublishedTime) return "article";
	if (ogType === "product") return "product";
	if (ogType === "profile") return "profile";
	if (ogType === "music.song" || ogType === "music.album") return "music";
	if (ogType === "video.movie" || ogType === "video.episode") return "video";
	return "website";
}

function resolve(path, base) {
	if (!path) return null;
	if (path.startsWith("http://") || path.startsWith("https://")) return path;
	if (path.startsWith("//")) return base.protocol + path;
	if (path.startsWith("/")) return base.origin + path;
	return new URL(path, base.origin).href;
}
