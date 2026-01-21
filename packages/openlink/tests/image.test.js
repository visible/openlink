import { test } from "node:test"
import assert from "node:assert"

const pngHeader = new Uint8Array([
	0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
	0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
	0x00, 0x00, 0x04, 0xb0,
	0x00, 0x00, 0x02, 0x76,
	0x08, 0x06, 0x00, 0x00, 0x00,
])

const gifHeader = new Uint8Array([
	0x47, 0x49, 0x46, 0x38, 0x39, 0x61,
	0x20, 0x03,
	0x58, 0x02,
])

const jpegHeader = new Uint8Array([
	0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46,
	0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01,
	0x00, 0x01, 0x00, 0x00, 0xff, 0xc0, 0x00, 0x11,
	0x08,
	0x01, 0x90,
	0x02, 0x80,
])

test("detect png dimensions", async () => {
	const mockFetch = async () => ({
		ok: true,
		arrayBuffer: async () => pngHeader.buffer,
	})

	const { getImageSize } = await import("../src/image.js")
	const result = await getImageSize("https://example.com/image.png", { fetch: mockFetch })

	assert.strictEqual(result.width, 1200)
	assert.strictEqual(result.height, 630)
	assert.strictEqual(result.type, "png")
})

test("detect gif dimensions", async () => {
	const mockFetch = async () => ({
		ok: true,
		arrayBuffer: async () => gifHeader.buffer,
	})

	const { getImageSize } = await import("../src/image.js")
	const result = await getImageSize("https://example.com/image.gif", { fetch: mockFetch })

	assert.strictEqual(result.width, 800)
	assert.strictEqual(result.height, 600)
	assert.strictEqual(result.type, "gif")
})

test("detect jpeg dimensions", async () => {
	const mockFetch = async () => ({
		ok: true,
		arrayBuffer: async () => jpegHeader.buffer,
	})

	const { getImageSize } = await import("../src/image.js")
	const result = await getImageSize("https://example.com/image.jpg", { fetch: mockFetch })

	assert.strictEqual(result.width, 640)
	assert.strictEqual(result.height, 400)
	assert.strictEqual(result.type, "jpeg")
})

test("returns null for failed fetch", async () => {
	const mockFetch = async () => ({
		ok: false,
	})

	const { getImageSize } = await import("../src/image.js")
	const result = await getImageSize("https://example.com/image.png", { fetch: mockFetch })

	assert.strictEqual(result, null)
})

test("returns null for network error", async () => {
	const mockFetch = async () => {
		throw new Error("Network error")
	}

	const { getImageSize } = await import("../src/image.js")
	const result = await getImageSize("https://example.com/image.png", { fetch: mockFetch })

	assert.strictEqual(result, null)
})

test("returns null for unknown format", async () => {
	const unknownData = new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04, 0x05])
	const mockFetch = async () => ({
		ok: true,
		arrayBuffer: async () => unknownData.buffer,
	})

	const { getImageSize } = await import("../src/image.js")
	const result = await getImageSize("https://example.com/unknown", { fetch: mockFetch })

	assert.strictEqual(result, null)
})

test("returns null for truncated data", async () => {
	const truncated = new Uint8Array([0x89, 0x50, 0x4e, 0x47])
	const mockFetch = async () => ({
		ok: true,
		arrayBuffer: async () => truncated.buffer,
	})

	const { getImageSize } = await import("../src/image.js")
	const result = await getImageSize("https://example.com/image.png", { fetch: mockFetch })

	assert.strictEqual(result, null)
})
