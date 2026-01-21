import { test } from "node:test"
import assert from "node:assert"
import { corsProxy, allOriginsProxy, createProxyFetch } from "../src/proxy.js"

test("corsProxy encodes url", () => {
	const result = corsProxy("https://example.com/path?query=value")
	assert.strictEqual(
		result,
		"https://corsproxy.io/?https%3A%2F%2Fexample.com%2Fpath%3Fquery%3Dvalue"
	)
})

test("allOriginsProxy encodes url", () => {
	const result = allOriginsProxy("https://example.com/path?query=value")
	assert.strictEqual(
		result,
		"https://api.allorigins.win/raw?url=https%3A%2F%2Fexample.com%2Fpath%3Fquery%3Dvalue"
	)
})

test("createProxyFetch replaces url placeholder", async () => {
	let capturedUrl = null
	const mockFetch = async (url) => {
		capturedUrl = url
		return { ok: true }
	}

	const proxiedFetch = createProxyFetch("https://proxy.com/?url={url}", mockFetch)
	await proxiedFetch("https://example.com")

	assert.strictEqual(capturedUrl, "https://proxy.com/?url=https%3A%2F%2Fexample.com")
})

test("createProxyFetch passes options", async () => {
	let capturedOptions = null
	const mockFetch = async (url, options) => {
		capturedOptions = options
		return { ok: true }
	}

	const proxiedFetch = createProxyFetch("https://proxy.com/?url={url}", mockFetch)
	await proxiedFetch("https://example.com", { headers: { "X-Test": "value" } })

	assert.deepStrictEqual(capturedOptions, { headers: { "X-Test": "value" } })
})
