export function createProxyFetch(proxyUrl, baseFetch = globalThis.fetch) {
	return async (url, options = {}) => {
		const proxied = proxyUrl.replace("{url}", encodeURIComponent(url));
		return baseFetch(proxied, options);
	};
}

export function corsProxy(url) {
	return `https://corsproxy.io/?${encodeURIComponent(url)}`;
}

export function allOriginsProxy(url) {
	return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
}
