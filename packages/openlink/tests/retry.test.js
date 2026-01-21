import assert from "node:assert";
import { test } from "node:test";
import { PreviewError } from "../src/index.js";
import { isRetryable, withRetry } from "../src/retry.js";

test("withRetry succeeds on first try", async () => {
	let attempts = 0;
	const result = await withRetry(async () => {
		attempts++;
		return "success";
	});

	assert.strictEqual(result, "success");
	assert.strictEqual(attempts, 1);
});

test("withRetry retries on failure", async () => {
	let attempts = 0;
	const result = await withRetry(
		async () => {
			attempts++;
			if (attempts < 3) throw new Error("fail");
			return "success";
		},
		{ retries: 3, delay: 10 },
	);

	assert.strictEqual(result, "success");
	assert.strictEqual(attempts, 3);
});

test("withRetry throws after max retries", async () => {
	let attempts = 0;

	await assert.rejects(
		async () => {
			await withRetry(
				async () => {
					attempts++;
					throw new Error("always fails");
				},
				{ retries: 2, delay: 10 },
			);
		},
		{ message: "always fails" },
	);

	assert.strictEqual(attempts, 3);
});

test("withRetry respects shouldRetry", async () => {
	let attempts = 0;

	await assert.rejects(
		async () => {
			await withRetry(
				async () => {
					attempts++;
					throw new Error("no retry");
				},
				{
					retries: 3,
					delay: 10,
					shouldRetry: () => false,
				},
			);
		},
		{ message: "no retry" },
	);

	assert.strictEqual(attempts, 1);
});

test("withRetry passes attempt number", async () => {
	const attemptNumbers = [];

	await withRetry(
		async (attempt) => {
			attemptNumbers.push(attempt);
			if (attempt < 2) throw new Error("fail");
			return "success";
		},
		{ retries: 3, delay: 10 },
	);

	assert.deepStrictEqual(attemptNumbers, [0, 1, 2]);
});

test("withRetry applies backoff", async () => {
	const times = [];
	let lastTime = Date.now();

	await withRetry(
		async (attempt) => {
			const now = Date.now();
			times.push(now - lastTime);
			lastTime = now;
			if (attempt < 2) throw new Error("fail");
			return "success";
		},
		{ retries: 3, delay: 50, backoff: 2 },
	);

	assert.strictEqual(times[0] < 10, true);
	assert.strictEqual(times[1] >= 40, true);
	assert.strictEqual(times[2] >= 80, true);
});

test("isRetryable returns true for TIMEOUT", () => {
	const error = new PreviewError("timeout", "TIMEOUT");
	assert.strictEqual(isRetryable(error), true);
});

test("isRetryable returns true for FETCH_ERROR", () => {
	const error = new PreviewError("fetch error", "FETCH_ERROR");
	assert.strictEqual(isRetryable(error), true);
});

test("isRetryable returns true for HTTP 429", () => {
	const error = new PreviewError("rate limited", "HTTP_ERROR", { status: 429 });
	assert.strictEqual(isRetryable(error), true);
});

test("isRetryable returns true for HTTP 500", () => {
	const error = new PreviewError("server error", "HTTP_ERROR", { status: 500 });
	assert.strictEqual(isRetryable(error), true);
});

test("isRetryable returns true for HTTP 503", () => {
	const error = new PreviewError("unavailable", "HTTP_ERROR", { status: 503 });
	assert.strictEqual(isRetryable(error), true);
});

test("isRetryable returns false for HTTP 404", () => {
	const error = new PreviewError("not found", "HTTP_ERROR", { status: 404 });
	assert.strictEqual(isRetryable(error), false);
});

test("isRetryable returns false for INVALID_URL", () => {
	const error = new PreviewError("invalid", "INVALID_URL");
	assert.strictEqual(isRetryable(error), false);
});
