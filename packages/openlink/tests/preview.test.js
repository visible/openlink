import assert from "node:assert";
import { test } from "node:test";
import { PreviewError, preview } from "../src/index.js";

const mockHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
	<title>Test Page</title>
	<meta property="og:title" content="OG Title">
	<meta property="og:description" content="OG Description">
	<meta property="og:image" content="https://example.com/image.png">
	<meta property="og:type" content="article">
	<meta property="og:site_name" content="Test Site">
	<meta name="description" content="HTML Description">
	<link rel="icon" href="/favicon.ico">
</head>
<body></body>
</html>
`;

function createMockFetch(html = mockHtml, status = 200) {
	return async (url) => ({
		ok: status >= 200 && status < 300,
		status,
		url,
		text: async () => html,
	});
}

test("preview extracts metadata", async () => {
	const result = await preview("https://example.com", {
		fetch: createMockFetch(),
	});

	assert.strictEqual(result.title, "OG Title");
	assert.strictEqual(result.description, "OG Description");
	assert.strictEqual(result.image, "https://example.com/image.png");
	assert.strictEqual(result.type, "article");
	assert.strictEqual(result.siteName, "Test Site");
	assert.strictEqual(result.domain, "example.com");
	assert.strictEqual(result.lang, "en");
});

test("preview normalizes url", async () => {
	const result = await preview("example.com", {
		fetch: createMockFetch(),
	});

	assert.strictEqual(result.url, "https://example.com");
});

test("preview resolves relative favicon", async () => {
	const result = await preview("https://example.com/page", {
		fetch: createMockFetch(),
	});

	assert.strictEqual(result.favicon, "https://example.com/favicon.ico");
});

test("preview throws on invalid url", async () => {
	await assert.rejects(
		async () => {
			await preview("");
		},
		{ code: "INVALID_URL" },
	);
});

test("preview throws on http error", async () => {
	await assert.rejects(
		async () => {
			await preview("https://example.com", {
				fetch: createMockFetch(mockHtml, 404),
			});
		},
		(err) => {
			assert.strictEqual(err instanceof PreviewError, true);
			assert.strictEqual(err.code, "HTTP_ERROR");
			assert.strictEqual(err.status, 404);
			return true;
		},
	);
});

test("preview throws on timeout", async () => {
	const slowFetch = () =>
		new Promise((_, reject) => {
			const err = new Error("aborted");
			err.name = "AbortError";
			setTimeout(() => reject(err), 10);
		});

	await assert.rejects(
		async () => {
			await preview("https://example.com", {
				fetch: slowFetch,
				timeout: 5,
			});
		},
		{ code: "TIMEOUT" },
	);
});

test("preview throws on network error", async () => {
	const failingFetch = async () => {
		throw new Error("Network failed");
	};

	await assert.rejects(
		async () => {
			await preview("https://example.com", {
				fetch: failingFetch,
			});
		},
		{ code: "FETCH_ERROR" },
	);
});

test("preview includes raw when requested", async () => {
	const result = await preview("https://example.com", {
		fetch: createMockFetch(),
		includeRaw: true,
	});

	assert.strictEqual(result.raw !== undefined, true);
	assert.strictEqual(result.raw.ogTitle, "OG Title");
});

test("preview skips url validation when disabled", async () => {
	const result = await preview("custom://url", {
		fetch: createMockFetch(),
		validateUrl: false,
	});

	assert.strictEqual(result.title, "OG Title");
});

test("preview uses custom headers", async () => {
	let capturedHeaders = null;
	const trackingFetch = async (url, options) => {
		capturedHeaders = options.headers;
		return {
			ok: true,
			url,
			text: async () => mockHtml,
		};
	};

	await preview("https://example.com", {
		fetch: trackingFetch,
		headers: { "X-Custom": "value" },
	});

	assert.strictEqual(capturedHeaders["X-Custom"], "value");
});

test("preview with retry succeeds after failure", async () => {
	let attempts = 0;
	const flakeyFetch = async (url) => {
		attempts++;
		if (attempts < 2) {
			throw new Error("Temporary failure");
		}
		return {
			ok: true,
			url,
			text: async () => mockHtml,
		};
	};

	const result = await preview("https://example.com", {
		fetch: flakeyFetch,
		retry: 3,
		retryDelay: 10,
	});

	assert.strictEqual(result.title, "OG Title");
	assert.strictEqual(attempts, 2);
});

test("preview detects content type", async () => {
	const result = await preview("https://example.com", {
		fetch: createMockFetch(),
	});

	assert.strictEqual(result.contentType, "article");
});

test("preview fallback to html title", async () => {
	const html = `
		<html>
			<head><title>HTML Only Title</title></head>
		</html>
	`;
	const result = await preview("https://example.com", {
		fetch: createMockFetch(html),
	});

	assert.strictEqual(result.title, "HTML Only Title");
});

test("preview default favicon", async () => {
	const html = "<html><head></head></html>";
	const result = await preview("https://example.com", {
		fetch: createMockFetch(html),
	});

	assert.strictEqual(result.favicon, "https://example.com/favicon.ico");
});
