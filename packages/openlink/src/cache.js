export function createCache(storage) {
	return {
		async get(url) {
			const key = cacheKey(url);
			const cached = await storage.get(key);
			if (!cached) return null;

			const data = typeof cached === "string" ? JSON.parse(cached) : cached;
			if (data.expires && Date.now() > data.expires) {
				await storage.delete?.(key);
				return null;
			}
			return data.value;
		},

		async set(url, value, ttl = 3600000) {
			const key = cacheKey(url);
			const data = {
				value,
				expires: ttl > 0 ? Date.now() + ttl : 0,
			};
			await storage.set(key, JSON.stringify(data));
		},

		async delete(url) {
			await storage.delete?.(cacheKey(url));
		},
	};
}

export function cacheKey(url) {
	return `openlink:${url}`;
}

export function memoryCache() {
	const store = new Map();
	return {
		get: (key) => store.get(key),
		set: (key, value) => store.set(key, value),
		delete: (key) => store.delete(key),
		clear: () => store.clear(),
	};
}

export function withCache(cache, previewFn) {
	return async (url, options = {}) => {
		const cached = await cache.get(url);
		if (cached) return cached;

		const result = await previewFn(url, options);
		await cache.set(url, result, options.cacheTtl);
		return result;
	};
}
