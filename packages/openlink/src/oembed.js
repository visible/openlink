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
		name: "dailymotion",
		pattern: /dailymotion\.com\/video\/([a-zA-Z0-9]+)/,
		endpoint: (url) => `https://www.dailymotion.com/services/oembed?url=${encodeURIComponent(url)}&format=json`,
	},
	{
		name: "twitch",
		pattern: /twitch\.tv\/(?:videos\/(\d+)|(\w+)\/clip\/(\w+)|(\w+))/,
		endpoint: (url) => `https://api.twitch.tv/v5/oembed?url=${encodeURIComponent(url)}`,
	},
	{
		name: "twitter",
		pattern: /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/,
		endpoint: (url) => `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`,
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
		name: "mixcloud",
		pattern: /mixcloud\.com\/[\w-]+\/[\w-]+/,
		endpoint: (url) => `https://www.mixcloud.com/oembed/?url=${encodeURIComponent(url)}&format=json`,
	},
	{
		name: "tiktok",
		pattern: /tiktok\.com\/@[\w.-]+\/video\/(\d+)/,
		endpoint: (url) => `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`,
	},
	{
		name: "instagram",
		pattern: /instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/,
		endpoint: (url) => `https://api.instagram.com/oembed?url=${encodeURIComponent(url)}`,
	},
	{
		name: "facebook",
		pattern: /facebook\.com\/(?:[\w.]+\/(?:posts|videos)\/|watch\/\?v=)(\d+)/,
		endpoint: (url) => `https://www.facebook.com/plugins/post/oembed.json/?url=${encodeURIComponent(url)}`,
	},
	{
		name: "tumblr",
		pattern: /tumblr\.com\/post\/(\d+)/,
		endpoint: (url) => `https://www.tumblr.com/oembed/1.0?url=${encodeURIComponent(url)}`,
	},
	{
		name: "reddit",
		pattern: /reddit\.com\/r\/[\w]+\/comments\/[\w]+/,
		endpoint: (url) => `https://www.reddit.com/oembed?url=${encodeURIComponent(url)}`,
	},
	{
		name: "flickr",
		pattern: /flickr\.com\/photos\/[\w@-]+\/(\d+)/,
		endpoint: (url) => `https://www.flickr.com/services/oembed?url=${encodeURIComponent(url)}&format=json`,
	},
	{
		name: "giphy",
		pattern: /giphy\.com\/(?:gifs|clips)\/(?:[\w-]+-)?([a-zA-Z0-9]+)/,
		endpoint: (url) => `https://giphy.com/services/oembed?url=${encodeURIComponent(url)}`,
	},
	{
		name: "imgur",
		pattern: /imgur\.com\/(?:a\/|gallery\/)?([a-zA-Z0-9]+)/,
		endpoint: (url) => `https://api.imgur.com/oembed.json?url=${encodeURIComponent(url)}`,
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
		name: "jsfiddle",
		pattern: /jsfiddle\.net\/[\w]+\/[\w]+/,
		endpoint: (url) => `https://jsfiddle.net/oembed?url=${encodeURIComponent(url)}&format=json`,
	},
	{
		name: "replit",
		pattern: /replit\.com\/@[\w]+\/[\w-]+/,
		endpoint: (url) => `https://replit.com/data/oembed?url=${encodeURIComponent(url)}`,
	},
	{
		name: "glitch",
		pattern: /glitch\.com\/~[\w-]+/,
		endpoint: (url) => `https://glitch.com/oembed?url=${encodeURIComponent(url)}&format=json`,
	},
	{
		name: "figma",
		pattern: /figma\.com\/(file|design|proto|board)\/([a-zA-Z0-9]+)/,
		endpoint: (url) => `https://www.figma.com/api/oembed?url=${encodeURIComponent(url)}`,
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
		name: "kickstarter",
		pattern: /kickstarter\.com\/projects\/[\w-]+\/[\w-]+/,
		endpoint: (url) => `https://www.kickstarter.com/services/oembed?url=${encodeURIComponent(url)}`,
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
