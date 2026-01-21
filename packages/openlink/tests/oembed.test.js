import assert from "node:assert";
import { test } from "node:test";
import { detectProvider, hasOembedSupport } from "../src/oembed.js";

test("detectProvider youtube watch url", () => {
	const result = detectProvider("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
	assert.strictEqual(result.name, "youtube");
});

test("detectProvider youtube short url", () => {
	const result = detectProvider("https://youtu.be/dQw4w9WgXcQ");
	assert.strictEqual(result.name, "youtube");
});

test("detectProvider youtube embed url", () => {
	const result = detectProvider("https://www.youtube.com/embed/dQw4w9WgXcQ");
	assert.strictEqual(result.name, "youtube");
});

test("detectProvider vimeo", () => {
	const result = detectProvider("https://vimeo.com/123456789");
	assert.strictEqual(result.name, "vimeo");
});

test("detectProvider twitter status", () => {
	const result = detectProvider("https://twitter.com/user/status/123456789");
	assert.strictEqual(result.name, "twitter");
});

test("detectProvider x.com status", () => {
	const result = detectProvider("https://x.com/user/status/123456789");
	assert.strictEqual(result.name, "twitter");
});

test("detectProvider spotify track", () => {
	const result = detectProvider("https://open.spotify.com/track/abc123");
	assert.strictEqual(result.name, "spotify");
});

test("detectProvider spotify album", () => {
	const result = detectProvider("https://open.spotify.com/album/abc123");
	assert.strictEqual(result.name, "spotify");
});

test("detectProvider spotify playlist", () => {
	const result = detectProvider("https://open.spotify.com/playlist/abc123");
	assert.strictEqual(result.name, "spotify");
});

test("detectProvider soundcloud", () => {
	const result = detectProvider("https://soundcloud.com/artist/track");
	assert.strictEqual(result.name, "soundcloud");
});

test("detectProvider tiktok", () => {
	const result = detectProvider("https://www.tiktok.com/@user/video/123456");
	assert.strictEqual(result.name, "tiktok");
});

test("detectProvider instagram post", () => {
	const result = detectProvider("https://www.instagram.com/p/abc123");
	assert.strictEqual(result.name, "instagram");
});

test("detectProvider instagram reel", () => {
	const result = detectProvider("https://www.instagram.com/reel/abc123");
	assert.strictEqual(result.name, "instagram");
});

test("detectProvider codepen", () => {
	const result = detectProvider("https://codepen.io/user/pen/abc123");
	assert.strictEqual(result.name, "codepen");
});

test("detectProvider codesandbox", () => {
	const result = detectProvider("https://codesandbox.io/s/abc123");
	assert.strictEqual(result.name, "codesandbox");
});

test("detectProvider figma file", () => {
	const result = detectProvider("https://www.figma.com/file/abc123/design");
	assert.strictEqual(result.name, "figma");
});

test("detectProvider figma design", () => {
	const result = detectProvider("https://www.figma.com/design/abc123/design");
	assert.strictEqual(result.name, "figma");
});

test("detectProvider returns null for unsupported", () => {
	const result = detectProvider("https://example.com");
	assert.strictEqual(result, null);
});

test("detectProvider returns null for github", () => {
	const result = detectProvider("https://github.com/user/repo");
	assert.strictEqual(result, null);
});

test("hasOembedSupport returns true for youtube", () => {
	assert.strictEqual(hasOembedSupport("https://www.youtube.com/watch?v=abc"), true);
});

test("hasOembedSupport returns true for spotify", () => {
	assert.strictEqual(hasOembedSupport("https://open.spotify.com/track/abc"), true);
});

test("hasOembedSupport returns false for github", () => {
	assert.strictEqual(hasOembedSupport("https://github.com"), false);
});

test("hasOembedSupport returns false for random url", () => {
	assert.strictEqual(hasOembedSupport("https://example.com"), false);
});
