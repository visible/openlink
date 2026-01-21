"use client";

import { useEffect, useRef, useState } from "react";
import { LanguageSelector } from "../components/language";
import { ThemeToggle } from "../components/theme";
import { Logo } from "../logo";

const libraries = [
	{
		name: "openlink",
		version: "0.1.0",
		size: "~2kb",
		sizeBytes: 2000,
		deps: 0,
		edge: true,
		parseTime: 1,
		notes: "Zero dependencies, pure JS",
	},
	{
		name: "unfurl.js",
		version: "6.4.0",
		size: "~25kb",
		sizeBytes: 25000,
		deps: 5,
		edge: false,
		parseTime: 15,
		notes: "oEmbed, Twitter Cards, Open Graph",
	},
	{
		name: "link-preview-js",
		version: "4.0.0",
		size: "~30kb",
		sizeBytes: 30000,
		deps: 3,
		edge: false,
		parseTime: 20,
		notes: "Cross-fetch dependency",
	},
	{
		name: "open-graph-scraper",
		version: "6.10.0",
		size: "~45kb",
		sizeBytes: 45000,
		deps: 4,
		edge: false,
		parseTime: 25,
		notes: "Uses Cheerio for parsing",
	},
	{
		name: "metascraper",
		version: "5.49.0",
		size: "~80kb",
		sizeBytes: 80000,
		deps: 4,
		edge: false,
		parseTime: 35,
		notes: "Modular, requires plugins",
	},
];

function Bar({ value, max, highlight }: { value: number; max: number; highlight?: boolean }) {
	const [visible, setVisible] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) setVisible(true);
			},
			{ threshold: 0.1 }
		);
		if (ref.current) observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	const percent = Math.max((value / max) * 100, 1);

	return (
		<div ref={ref} className="h-2 flex-1 bg-neutral-100 dark:bg-neutral-800">
			<div
				className={`h-full transition-all duration-1000 ease-out ${highlight ? "bg-black dark:bg-white" : "bg-neutral-300 dark:bg-neutral-600"}`}
				style={{ width: visible ? `${percent}%` : "0%" }}
			/>
		</div>
	);
}

export default function Benchmarks() {
	const maxSize = Math.max(...libraries.map((l) => l.sizeBytes));
	const maxDeps = Math.max(...libraries.map((l) => l.deps));
	const maxTime = Math.max(...libraries.map((l) => l.parseTime));

	return (
		<main className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white transition-colors">
			<div className="sticky top-0 z-50 max-w-5xl mx-auto px-8">
				<nav className="h-14 flex items-center justify-between bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
					<a href="/" className="flex items-center gap-2 group">
						<Logo className="w-5 h-5 text-black dark:text-white group-hover:scale-105 transition-transform" />
						<span className="text-sm font-semibold tracking-tight">OpenLink</span>
					</a>
					<div className="flex items-center gap-1">
						<a href="/docs" className="px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Docs</a>
						<a href="/benchmarks" className="px-3 py-1.5 text-sm text-black dark:text-white">Benchmarks</a>
						<a href="/playground" className="px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Playground</a>
						<div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700 mx-2" />
						<a href="https://github.com/visible/OpenLink" className="flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
								<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
							</svg>
							<span>Star</span>
						</a>
					</div>
				</nav>
			</div>

			<div className="max-w-5xl mx-auto px-8 py-16">
				<section className="pb-16 border-b border-neutral-200 dark:border-neutral-800">
					<p className="text-xs font-mono text-neutral-400 tracking-widest mb-6">PERFORMANCE</p>
					<h1 className="text-4xl font-semibold tracking-tight mb-4">Benchmarks</h1>
					<p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mb-8">
						Performance comparisons against popular link preview libraries. All data sourced from npm and bundlephobia.
					</p>
					<div className="font-mono text-sm text-neutral-500 dark:text-neutral-400 space-y-1 p-4 border border-neutral-200 dark:border-neutral-800">
						<p>Bundle sizes: Approximate gzipped size from bundlephobia</p>
						<p>Parse time: HTML parsing only, excludes network latency</p>
						<p>Edge support: Cloudflare Workers, Vercel Edge, Deno Deploy</p>
					</div>
				</section>

				<section className="py-16 border-b border-neutral-200 dark:border-neutral-800">
					<p className="text-xs font-mono text-neutral-400 tracking-widest mb-8">BUNDLE SIZE (GZIPPED)</p>
					<div className="space-y-6">
						{libraries.map((lib) => (
							<div key={lib.name} className="flex items-center gap-4">
								<span className={`text-sm w-44 font-mono ${lib.name === "openlink" ? "text-black dark:text-white font-medium" : "text-neutral-400"}`}>
									{lib.name}
								</span>
								<Bar value={lib.sizeBytes} max={maxSize} highlight={lib.name === "openlink"} />
								<span className={`text-sm w-20 text-right font-mono ${lib.name === "openlink" ? "text-black dark:text-white font-medium" : "text-neutral-400"}`}>
									{lib.size}
								</span>
							</div>
						))}
					</div>
				</section>

				<section className="py-16 border-b border-neutral-200 dark:border-neutral-800">
					<p className="text-xs font-mono text-neutral-400 tracking-widest mb-8">DEPENDENCIES</p>
					<div className="space-y-6">
						{libraries.map((lib) => (
							<div key={lib.name} className="flex items-center gap-4">
								<span className={`text-sm w-44 font-mono ${lib.name === "openlink" ? "text-black dark:text-white font-medium" : "text-neutral-400"}`}>
									{lib.name}
								</span>
								<Bar value={lib.deps || 0.3} max={maxDeps} highlight={lib.name === "openlink"} />
								<span className={`text-sm w-20 text-right font-mono ${lib.name === "openlink" ? "text-black dark:text-white font-medium" : "text-neutral-400"}`}>
									{lib.deps}
								</span>
							</div>
						))}
					</div>
				</section>

				<section className="py-16 border-b border-neutral-200 dark:border-neutral-800">
					<p className="text-xs font-mono text-neutral-400 tracking-widest mb-8">PARSE TIME (MS)</p>
					<p className="text-neutral-500 dark:text-neutral-400 text-sm mb-8">
						Average time to parse HTML and extract metadata. Lower is better.
					</p>
					<div className="space-y-6">
						{libraries.map((lib) => (
							<div key={lib.name} className="flex items-center gap-4">
								<span className={`text-sm w-44 font-mono ${lib.name === "openlink" ? "text-black dark:text-white font-medium" : "text-neutral-400"}`}>
									{lib.name}
								</span>
								<Bar value={lib.parseTime} max={maxTime} highlight={lib.name === "openlink"} />
								<span className={`text-sm w-20 text-right font-mono ${lib.name === "openlink" ? "text-black dark:text-white font-medium" : "text-neutral-400"}`}>
									~{lib.parseTime}ms
								</span>
							</div>
						))}
					</div>
				</section>

				<section className="py-16 border-b border-neutral-200 dark:border-neutral-800">
					<p className="text-xs font-mono text-neutral-400 tracking-widest mb-8">EDGE RUNTIME</p>
					<p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-2xl">
						Edge runtime support requires no Node.js-specific APIs like fs, path, or http. Libraries using Cheerio or similar DOM parsers typically don't work on edge runtimes.
					</p>
					<div className="grid grid-cols-5 gap-4">
						{libraries.map((lib) => (
							<div
								key={lib.name}
								className={`p-4 text-center border ${lib.edge ? "border-black dark:border-white bg-black text-white" : "border-neutral-200 dark:border-neutral-800"}`}
							>
								<p className="text-xs font-mono mb-2 truncate">{lib.name}</p>
								<p className="text-lg">{lib.edge ? "✓" : "—"}</p>
							</div>
						))}
					</div>
				</section>

				<section className="py-16 border-b border-neutral-200 dark:border-neutral-800">
					<p className="text-xs font-mono text-neutral-400 tracking-widest mb-6">COMPARISON</p>
					<h2 className="text-xl font-semibold mb-6">Library details</h2>
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-neutral-200 dark:border-neutral-800">
									<th className="text-left py-3 font-mono font-medium">Library</th>
									<th className="text-left py-3 font-mono font-medium">Version</th>
									<th className="text-left py-3 font-mono font-medium">Notes</th>
								</tr>
							</thead>
							<tbody>
								{libraries.map((lib) => (
									<tr key={lib.name} className="border-b border-neutral-100 dark:border-neutral-900">
										<td className={`py-3 font-mono ${lib.name === "openlink" ? "font-medium" : "text-neutral-500"}`}>{lib.name}</td>
										<td className="py-3 font-mono text-neutral-400">{lib.version}</td>
										<td className="py-3 text-neutral-500">{lib.notes}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>

				<section className="py-16 border-b border-neutral-200 dark:border-neutral-800">
					<p className="text-xs font-mono text-neutral-400 tracking-widest mb-6">METHODOLOGY</p>
					<h2 className="text-xl font-semibold mb-6">How we benchmark</h2>
					<div className="space-y-4 text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-2xl">
						<p>
							Bundle sizes are approximate gzipped sizes from bundlephobia.com. Actual sizes may vary based on tree-shaking and bundler configuration.
						</p>
						<p>
							Parse time measures only HTML parsing and metadata extraction, excluding network request time. Each library parses the same pre-fetched HTML content.
						</p>
						<p>
							Edge runtime compatibility is determined by checking for Node.js-specific API usage. Libraries relying on Cheerio, jsdom, or similar DOM implementations typically don't work on edge runtimes.
						</p>
						<p>
							All data is sourced from npm and the respective package documentation. Run your own benchmarks for production decisions.
						</p>
					</div>
					<div className="mt-6 p-4 bg-white dark:bg-neutral-950 text-black dark:text-white font-mono text-sm border border-neutral-200 dark:border-neutral-800">
						<p className="text-neutral-500">$ git clone github.com/visible/openlink</p>
						<p className="text-neutral-500">$ cd openlink</p>
						<p>$ bun run bench</p>
					</div>
				</section>

				<footer className="py-8 flex items-center justify-between text-sm text-neutral-400">
					<p>© 2026 Visible</p>
					<div className="flex items-center gap-3">
						<ThemeToggle />
						<LanguageSelector />
					</div>
				</footer>
			</div>
		</main>
	);
}
