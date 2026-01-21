import assert from "node:assert";
import { test } from "node:test";
import { PreviewError, isValidUrl, normalizeUrl } from "../src/index.js";

test("isValidUrl accepts https", () => {
	assert.strictEqual(isValidUrl("https://example.com"), true);
	assert.strictEqual(isValidUrl("https://example.com/path"), true);
	assert.strictEqual(isValidUrl("https://example.com?query=1"), true);
});

test("isValidUrl accepts http", () => {
	assert.strictEqual(isValidUrl("http://example.com"), true);
});

test("isValidUrl rejects invalid urls", () => {
	assert.strictEqual(isValidUrl("example.com"), false);
	assert.strictEqual(isValidUrl("not-a-url"), false);
	assert.strictEqual(isValidUrl(""), false);
	assert.strictEqual(isValidUrl("ftp://example.com"), false);
	assert.strictEqual(isValidUrl("javascript:alert(1)"), false);
});

test("normalizeUrl adds https", () => {
	assert.strictEqual(normalizeUrl("example.com"), "https://example.com");
	assert.strictEqual(normalizeUrl("example.com/path"), "https://example.com/path");
});

test("normalizeUrl preserves https", () => {
	assert.strictEqual(normalizeUrl("https://example.com"), "https://example.com");
});

test("normalizeUrl preserves http", () => {
	assert.strictEqual(normalizeUrl("http://example.com"), "http://example.com");
});

test("normalizeUrl trims whitespace", () => {
	assert.strictEqual(normalizeUrl("  example.com  "), "https://example.com");
});

test("normalizeUrl handles protocol-relative", () => {
	assert.strictEqual(normalizeUrl("//example.com"), "//example.com");
});

test("normalizeUrl resolves relative with base", () => {
	assert.strictEqual(normalizeUrl("/path", "https://example.com"), "https://example.com/path");
	assert.strictEqual(normalizeUrl("path", "https://example.com"), "https://example.com/path");
});

test("normalizeUrl handles empty", () => {
	assert.strictEqual(normalizeUrl(""), "");
	assert.strictEqual(normalizeUrl(null), null);
	assert.strictEqual(normalizeUrl(undefined), undefined);
});

test("PreviewError has correct properties", () => {
	const error = new PreviewError("test message", "TIMEOUT");

	assert.strictEqual(error.message, "test message");
	assert.strictEqual(error.code, "TIMEOUT");
	assert.strictEqual(error.name, "PreviewError");
	assert.strictEqual(error instanceof Error, true);
});

test("PreviewError with status", () => {
	const error = new PreviewError("not found", "HTTP_ERROR", { status: 404 });

	assert.strictEqual(error.status, 404);
	assert.strictEqual(error.code, "HTTP_ERROR");
});

test("PreviewError with cause", () => {
	const cause = new Error("original error");
	const error = new PreviewError("wrapped", "FETCH_ERROR", { cause });

	assert.strictEqual(error.cause, cause);
});
