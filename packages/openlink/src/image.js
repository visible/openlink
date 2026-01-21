export async function getImageSize(url, options = {}) {
	const fetchFn = options.fetch || globalThis.fetch;
	const controller = new AbortController();
	const timeout = options.timeout || 5000;
	const timer = setTimeout(() => controller.abort(), timeout);

	try {
		const response = await fetchFn(url, {
			method: "GET",
			signal: controller.signal,
			headers: {
				Range: "bytes=0-65535",
			},
		});

		if (!response.ok) return null;

		const buffer = await response.arrayBuffer();
		const bytes = new Uint8Array(buffer);

		return detectSize(bytes);
	} catch {
		return null;
	} finally {
		clearTimeout(timer);
	}
}

function detectSize(bytes) {
	if (isPng(bytes)) return parsePng(bytes);
	if (isJpeg(bytes)) return parseJpeg(bytes);
	if (isGif(bytes)) return parseGif(bytes);
	if (isWebp(bytes)) return parseWebp(bytes);
	return null;
}

function isPng(bytes) {
	return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
}

function isJpeg(bytes) {
	return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
}

function isGif(bytes) {
	return bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38;
}

function isWebp(bytes) {
	return (
		bytes[0] === 0x52 &&
		bytes[1] === 0x49 &&
		bytes[2] === 0x46 &&
		bytes[3] === 0x46 &&
		bytes[8] === 0x57 &&
		bytes[9] === 0x45 &&
		bytes[10] === 0x42 &&
		bytes[11] === 0x50
	);
}

function parsePng(bytes) {
	if (bytes.length < 24) return null;
	const width = (bytes[16] << 24) | (bytes[17] << 16) | (bytes[18] << 8) | bytes[19];
	const height = (bytes[20] << 24) | (bytes[21] << 16) | (bytes[22] << 8) | bytes[23];
	return { width, height, type: "png" };
}

function parseJpeg(bytes) {
	let offset = 2;
	while (offset < bytes.length - 8) {
		if (bytes[offset] !== 0xff) return null;

		const marker = bytes[offset + 1];
		if (marker === 0xc0 || marker === 0xc2) {
			const height = (bytes[offset + 5] << 8) | bytes[offset + 6];
			const width = (bytes[offset + 7] << 8) | bytes[offset + 8];
			return { width, height, type: "jpeg" };
		}

		const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
		offset += 2 + length;
	}
	return null;
}

function parseGif(bytes) {
	if (bytes.length < 10) return null;
	const width = bytes[6] | (bytes[7] << 8);
	const height = bytes[8] | (bytes[9] << 8);
	return { width, height, type: "gif" };
}

function parseWebp(bytes) {
	if (bytes.length < 30) return null;

	if (bytes[12] === 0x56 && bytes[13] === 0x50 && bytes[14] === 0x38) {
		if (bytes[15] === 0x20) {
			const width = ((bytes[26] | (bytes[27] << 8)) & 0x3fff) + 1;
			const height = ((bytes[28] | (bytes[29] << 8)) & 0x3fff) + 1;
			return { width, height, type: "webp" };
		}
		if (bytes[15] === 0x4c) {
			const bits = bytes[21] | (bytes[22] << 8) | (bytes[23] << 16) | (bytes[24] << 24);
			const width = (bits & 0x3fff) + 1;
			const height = ((bits >> 14) & 0x3fff) + 1;
			return { width, height, type: "webp" };
		}
		if (bytes[15] === 0x58) {
			const width = (bytes[24] | (bytes[25] << 8) | (bytes[26] << 16)) + 1;
			const height = (bytes[27] | (bytes[28] << 8) | (bytes[29] << 16)) + 1;
			return { width, height, type: "webp" };
		}
	}
	return null;
}
