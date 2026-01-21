export async function withRetry(fn, options = {}) {
	const { retries = 3, delay = 1000, backoff = 2, shouldRetry = () => true } = options;

	let lastError;
	let currentDelay = delay;

	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			return await fn(attempt);
		} catch (error) {
			lastError = error;

			if (attempt === retries || !shouldRetry(error, attempt)) {
				throw error;
			}

			await sleep(currentDelay);
			currentDelay *= backoff;
		}
	}

	throw lastError;
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isRetryable(error) {
	if (error.code === "TIMEOUT") return true;
	if (error.code === "FETCH_ERROR") return true;
	if (error.code === "HTTP_ERROR") {
		const status = error.status;
		return status === 429 || status >= 500;
	}
	return false;
}
