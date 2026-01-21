const providers = [
	{
		name: "youtube",
		pattern: /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/,
		endpoint: (url) => `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
	},
	{
		name: "vimeo",
		pattern: /vimeo\.com\/(\d+)/,
		endpoint: (url) => `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`,
	},
	{
		name: "spotify",
		pattern: /open\.spotify\.com\/(track|album|playlist|artist|episode|show)\/([a-zA-Z0-9]+)/,
		endpoint: (url) => `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`,
	},
	{
		name: "soundcloud",
		pattern: /soundcloud\.com\/[\w-]+\/[\w-]+/,
		endpoint: (url) => `https://soundcloud.com/oembed?url=${encodeURIComponent(url)}&format=json`,
	},
	{
		name: "tiktok",
		pattern: /tiktok\.com\/@[\w.-]+\/video\/(\d+)/,
		endpoint: (url) => `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`,
	},
	{
		name: "codepen",
		pattern: /codepen\.io\/[\w-]+\/pen\/([a-zA-Z0-9]+)/,
		endpoint: (url) => `https://codepen.io/api/oembed?url=${encodeURIComponent(url)}&format=json`,
	},
	{
		name: "codesandbox",
		pattern: /codesandbox\.io\/s\/([a-zA-Z0-9-]+)/,
		endpoint: (url) => `https://codesandbox.io/oembed?url=${encodeURIComponent(url)}`,
	},
	{
		name: "loom",
		pattern: /loom\.com\/share\/([a-zA-Z0-9]+)/,
		endpoint: (url) => `https://www.loom.com/v1/oembed?url=${encodeURIComponent(url)}`,
	},
	{
		name: "speakerdeck",
		pattern: /speakerdeck\.com\/[\w-]+\/[\w-]+/,
		endpoint: (url) => `https://speakerdeck.com/oembed.json?url=${encodeURIComponent(url)}`,
	},
	{
		name: "twitter",
		pattern: /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/,
		endpoint: (url) => `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`,
	},
	{
		name: "instagram",
		pattern: /instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/,
		endpoint: (url) => `https://api.instagram.com/oembed?url=${encodeURIComponent(url)}`,
	},
	{
		name: "figma",
		pattern: /figma\.com\/(file|design|proto|board)\/([a-zA-Z0-9]+)/,
		endpoint: (url) => `https://www.figma.com/api/oembed?url=${encodeURIComponent(url)}`,
	},
];

export function detectProvider(url) {
	for (const provider of providers) {
		if (provider.pattern.test(url)) {
			return provider;
		}
	}
	return null;
}

export async function fetchOembed(url, options = {}) {
	const provider = detectProvider(url);
	if (!provider) return null;

	const endpoint = provider.endpoint(url);
	const fetchFn = options.fetch || globalThis.fetch;
	const timeout = options.timeout || 5000;

	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeout);

	try {
		const response = await fetchFn(endpoint, {
			signal: controller.signal,
			headers: { Accept: "application/json" },
		});

		if (!response.ok) return null;

		const data = await response.json();

		return {
			provider: provider.name,
			type: data.type || "rich",
			title: data.title || null,
			author: data.author_name || null,
			authorUrl: data.author_url || null,
			thumbnail: data.thumbnail_url || null,
			thumbnailWidth: data.thumbnail_width || null,
			thumbnailHeight: data.thumbnail_height || null,
			html: data.html || null,
			width: data.width || null,
			height: data.height || null,
		};
	} catch {
		return null;
	} finally {
		clearTimeout(timer);
	}
}

export function hasOembedSupport(url) {
	return detectProvider(url) !== null;
}
