import { readFileSync, writeFileSync, existsSync } from "fs";
import { gzipSync } from "zlib";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgPath = join(__dirname, "../../../packages/openlink");
const specsPath = join(__dirname, "../app/specs.json");

function getPackageJson() {
	return JSON.parse(readFileSync(join(pkgPath, "package.json"), "utf-8"));
}

function getDeps() {
	const pkg = getPackageJson();
	return Object.keys(pkg.dependencies || {}).length;
}

function getTyped() {
	const pkg = getPackageJson();
	const hasTypesExport = pkg.exports?.["."]?.types;
	const hasTypesFile = existsSync(join(pkgPath, "src/index.d.ts"));
	return hasTypesExport || hasTypesFile;
}

function getBundleSize() {
	try {
		const entryPoint = join(pkgPath, "src/index.js");
		const result = execSync(
			`bunx esbuild ${entryPoint} --bundle --minify --format=esm --platform=neutral`,
			{ encoding: "utf-8", cwd: pkgPath }
		);
		const gzipped = gzipSync(result);
		return gzipped.length;
	} catch {
		const files = ["index.js", "parse.js", "fetch.js"]
			.map(f => join(pkgPath, "src", f))
			.filter(existsSync);

		let total = 0;
		for (const file of files) {
			const content = readFileSync(file, "utf-8");
			const minified = content
				.replace(/\/\*[\s\S]*?\*\//g, "")
				.replace(/\/\/.*/g, "")
				.replace(/\s+/g, " ")
				.trim();
			total += gzipSync(minified).length;
		}
		return total;
	}
}

function getParseTime() {
	try {
		const testHtml = `
			<!DOCTYPE html>
			<html>
			<head>
				<meta property="og:title" content="Test">
				<meta property="og:description" content="Test description">
				<meta property="og:image" content="https://example.com/image.png">
			</head>
			<body></body>
			</html>
		`;

		const benchScript = `
			import { parse } from "./src/parse.js";
			const html = ${JSON.stringify(testHtml)};
			const runs = 1000;
			const start = performance.now();
			for (let i = 0; i < runs; i++) {
				parse(html, "https://example.com");
			}
			const elapsed = performance.now() - start;
			console.log((elapsed / runs).toFixed(2));
		`;

		writeFileSync(join(pkgPath, "_bench.js"), benchScript);
		const result = execSync("node _bench.js", { cwd: pkgPath, encoding: "utf-8" });
		execSync("rm _bench.js", { cwd: pkgPath });

		const ms = parseFloat(result.trim());
		if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`;
		return `${ms.toFixed(1)}ms`;
	} catch {
		return "~1ms";
	}
}

function formatSize(bytes) {
	if (bytes < 1024) return `${bytes}b`;
	return `${(bytes / 1024).toFixed(1)}kb`;
}

const specs = {
	size: formatSize(getBundleSize()),
	deps: getDeps().toString(),
	parse: getParseTime(),
	typed: getTyped() ? "100%" : "0%",
	version: getPackageJson().version,
	updated: new Date().toISOString().split("T")[0],
};

writeFileSync(specsPath, JSON.stringify(specs, null, "\t") + "\n");
console.log("specs:", specs);
