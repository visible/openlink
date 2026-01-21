import { test } from "node:test"
import assert from "node:assert"
import { createCache, cacheKey, memoryCache, withCache } from "../src/cache.js"

test("cacheKey generates correct key", () => {
	assert.strictEqual(cacheKey("https://example.com"), "openlink:https://example.com")
	assert.strictEqual(cacheKey("https://test.com/path"), "openlink:https://test.com/path")
})

test("memoryCache set and get", () => {
	const storage = memoryCache()

	storage.set("key1", "value1")
	assert.strictEqual(storage.get("key1"), "value1")
	assert.strictEqual(storage.get("key2"), undefined)
})

test("memoryCache delete", () => {
	const storage = memoryCache()

	storage.set("key1", "value1")
	storage.delete("key1")
	assert.strictEqual(storage.get("key1"), undefined)
})

test("memoryCache clear", () => {
	const storage = memoryCache()

	storage.set("key1", "value1")
	storage.set("key2", "value2")
	storage.clear()
	assert.strictEqual(storage.get("key1"), undefined)
	assert.strictEqual(storage.get("key2"), undefined)
})

test("createCache set and get", async () => {
	const storage = memoryCache()
	const cache = createCache(storage)

	const data = { title: "Test", url: "https://example.com" }
	await cache.set("https://example.com", data)

	const result = await cache.get("https://example.com")
	assert.deepStrictEqual(result, data)
})

test("createCache returns null for missing key", async () => {
	const storage = memoryCache()
	const cache = createCache(storage)

	const result = await cache.get("https://missing.com")
	assert.strictEqual(result, null)
})

test("createCache respects ttl", async () => {
	const storage = memoryCache()
	const cache = createCache(storage)

	const data = { title: "Test" }
	await cache.set("https://example.com", data, 50)

	const before = await cache.get("https://example.com")
	assert.deepStrictEqual(before, data)

	await new Promise((r) => setTimeout(r, 60))

	const after = await cache.get("https://example.com")
	assert.strictEqual(after, null)
})

test("createCache delete", async () => {
	const storage = memoryCache()
	const cache = createCache(storage)

	await cache.set("https://example.com", { title: "Test" })
	await cache.delete("https://example.com")

	const result = await cache.get("https://example.com")
	assert.strictEqual(result, null)
})

test("withCache returns cached result", async () => {
	const storage = memoryCache()
	const cache = createCache(storage)

	let fetchCount = 0
	const mockPreview = async (url) => {
		fetchCount++
		return { title: "Fetched", url }
	}

	const cachedPreview = withCache(cache, mockPreview)

	const first = await cachedPreview("https://example.com")
	const second = await cachedPreview("https://example.com")

	assert.strictEqual(fetchCount, 1)
	assert.deepStrictEqual(first, second)
})

test("withCache fetches for different urls", async () => {
	const storage = memoryCache()
	const cache = createCache(storage)

	let fetchCount = 0
	const mockPreview = async (url) => {
		fetchCount++
		return { title: "Fetched", url }
	}

	const cachedPreview = withCache(cache, mockPreview)

	await cachedPreview("https://example1.com")
	await cachedPreview("https://example2.com")

	assert.strictEqual(fetchCount, 2)
})

test("withCache passes options to preview", async () => {
	const storage = memoryCache()
	const cache = createCache(storage)

	let receivedOptions = null
	const mockPreview = async (url, options) => {
		receivedOptions = options
		return { title: "Fetched", url }
	}

	const cachedPreview = withCache(cache, mockPreview)
	await cachedPreview("https://example.com", { timeout: 5000 })

	assert.deepStrictEqual(receivedOptions, { timeout: 5000 })
})

test("createCache works with async storage", async () => {
	const store = new Map()
	const asyncStorage = {
		get: async (key) => store.get(key),
		set: async (key, value) => store.set(key, value),
		delete: async (key) => store.delete(key),
	}

	const cache = createCache(asyncStorage)
	const data = { title: "Test" }

	await cache.set("https://example.com", data)
	const result = await cache.get("https://example.com")

	assert.deepStrictEqual(result, data)
})
