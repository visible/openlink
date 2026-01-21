"use client";

import { useState } from "react";
import { Logo } from "../logo";
import { ThemeToggle } from "../components/theme";

type PreviewData = {
	url: string;
	title: string | null;
	description: string | null;
	image: string | null;
	favicon: string;
	siteName: string;
	domain: string;
	type: string;
	author: string | null;
	publishedTime: string | null;
	themeColor: string | null;
	twitterCard: string | null;
	locale: string | null;
	video: string | null;
	audio: string | null;
	keywords: string[] | null;
};

type ApiResponse = {
	data?: PreviewData;
	error?: string;
	code?: string;
	meta?: {
		cache: {
			status: string;
			age: number;
			ageHuman: string;
		};
	};
};

const examples = [
	{ name: "GitHub", url: "https://github.com" },
	{ name: "YouTube", url: "https://youtube.com" },
	{ name: "Twitter/X", url: "https://x.com" },
	{ name: "Vercel", url: "https://vercel.com" },
	{ name: "Stripe", url: "https://stripe.com" },
];

export default function Playground() {
	const [url, setUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<ApiResponse | null>(null);
	const [timing, setTiming] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!url.trim()) return;

		setLoading(true);
		setError(null);
		setResult(null);
		setTiming(null);

		const start = performance.now();

		try {
			const res = await fetch(`/api/preview?url=${encodeURIComponent(url)}`);
			const data = await res.json();
			const end = performance.now();

			setTiming(Math.round(end - start));
			setResult(data);

			if (data.error) {
				setError(data.error);
			}
		} catch (err) {
			setError("Failed to fetch preview");
		} finally {
			setLoading(false);
		}
	}

	function handleExample(exampleUrl: string) {
		setUrl(exampleUrl);
		setResult(null);
		setError(null);
		setTiming(null);
	}

	return (
		<main className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white">
			<div className="sticky top-0 z-50 max-w-5xl mx-auto px-8">
				<nav className="h-14 flex items-center justify-between bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
					<a href="/" className="flex items-center gap-2 group">
						<Logo className="w-5 h-5 text-black dark:text-white group-hover:scale-105 transition-transform" />
						<span className="text-sm font-semibold tracking-tight">OpenLink</span>
					</a>
					<div className="flex items-center gap-1">
						<a href="/docs" className="px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Docs</a>
						<a href="/benchmarks" className="px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Benchmarks</a>
						<a href="/playground" className="px-3 py-1.5 text-sm text-black dark:text-white">Playground</a>
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
				<section className="pb-12 border-b border-neutral-200 dark:border-neutral-800">
					<p className="text-xs font-mono text-neutral-400 tracking-widest mb-6">PLAYGROUND</p>
					<h1 className="text-4xl font-semibold tracking-tight mb-4">Test openlink</h1>
					<p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl">
						Enter any URL to extract metadata. See what openlink returns in real-time.
					</p>
				</section>

				<section className="py-12 border-b border-neutral-200 dark:border-neutral-800">
					<form onSubmit={handleSubmit} className="flex gap-4">
						<input
							type="text"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							placeholder="https://example.com"
							className="flex-1 px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-mono focus:outline-none focus:border-black dark:focus:border-white"
						/>
						<button
							type="submit"
							disabled={loading || !url.trim()}
							className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-sm font-medium disabled:opacity-50"
						>
							{loading ? "Loading..." : "Preview"}
						</button>
					</form>

					<div className="mt-6 flex flex-wrap items-center gap-2">
						<span className="text-xs text-neutral-400 mr-2">Try:</span>
						{examples.map((ex) => (
							<button
								key={ex.url}
								onClick={() => handleExample(ex.url)}
								className="px-3 py-1 text-xs font-mono border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-colors"
							>
								{ex.name}
							</button>
						))}
					</div>
				</section>

				{(result || error || loading) && (
					<section className="py-12 border-b border-neutral-200 dark:border-neutral-800">
						<div className="flex items-center justify-between mb-6">
							<p className="text-xs font-mono text-neutral-400 tracking-widest">RESULT</p>
							{timing && (
								<div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
									<span>{timing}ms</span>
									{result?.meta?.cache && (
										<span className={`px-2 py-0.5 ${result.meta.cache.status === "HIT" ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"}`}>
											{result.meta.cache.status === "HIT" ? "Cached" : "Fresh"}
										</span>
									)}
								</div>
							)}
						</div>

						{loading && (
							<div className="p-8 border border-neutral-200 dark:border-neutral-800 text-center text-neutral-400">
								Fetching preview...
							</div>
						)}

						{error && !loading && (
							<div className="p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 font-mono text-sm">
								{error}
							</div>
						)}

						{result?.data && !loading && (
							<div className="grid grid-cols-2 gap-8">
								<div className="flex flex-col">
									<h3 className="text-sm font-medium mb-4">Preview Card</h3>
									<div className="border border-neutral-200 dark:border-neutral-800 overflow-hidden flex-1">
										{result.data.image && (
											<img
												src={result.data.image}
												alt=""
												className="w-full h-40 object-cover"
												onError={(e) => (e.currentTarget.style.display = "none")}
											/>
										)}
										<div className="p-4">
											<div className="flex items-center gap-2 mb-2">
												{result.data.favicon && (
													<img
														src={result.data.favicon}
														alt=""
														className="w-4 h-4"
														onError={(e) => (e.currentTarget.style.display = "none")}
													/>
												)}
												<span className="text-xs text-neutral-400">{result.data.siteName || result.data.domain}</span>
											</div>
											<h4 className="font-medium mb-1 line-clamp-2">{result.data.title || "No title"}</h4>
											<p className="text-sm text-neutral-500 line-clamp-2">{result.data.description || "No description"}</p>
										</div>
									</div>
								</div>

								<div className="flex flex-col">
									<h3 className="text-sm font-medium mb-4">Raw Data</h3>
									<div className="p-4 bg-white dark:bg-neutral-950 text-black dark:text-white font-mono text-xs overflow-hidden flex-1 border border-neutral-200 dark:border-neutral-800">
										<pre className="whitespace-pre-wrap break-all">{JSON.stringify(result.data, null, 2)}</pre>
									</div>
								</div>
							</div>
						)}
					</section>
				)}

				<section className="py-12 border-b border-neutral-200 dark:border-neutral-800">
					<p className="text-xs font-mono text-neutral-400 tracking-widest mb-6">METADATA FIELDS</p>
					<h2 className="text-xl font-semibold mb-6">What openlink extracts</h2>
					<div className="grid grid-cols-3 gap-4 font-mono text-sm">
						{[
							{ field: "title", source: "og:title, twitter:title, <title>" },
							{ field: "description", source: "og:description, meta description" },
							{ field: "image", source: "og:image, twitter:image" },
							{ field: "favicon", source: "link[rel=icon], /favicon.ico" },
							{ field: "siteName", source: "og:site_name" },
							{ field: "url", source: "og:url, canonical" },
							{ field: "type", source: "og:type" },
							{ field: "author", source: "article:author, meta author" },
							{ field: "publishedTime", source: "article:published_time" },
							{ field: "themeColor", source: "meta theme-color" },
							{ field: "twitterCard", source: "twitter:card" },
							{ field: "locale", source: "og:locale" },
							{ field: "video", source: "og:video" },
							{ field: "audio", source: "og:audio" },
							{ field: "keywords", source: "meta keywords" },
						].map((item) => (
							<div key={item.field} className="p-3 border border-neutral-200 dark:border-neutral-800">
								<p className="font-medium text-black dark:text-white">{item.field}</p>
								<p className="text-xs text-neutral-400 mt-1">{item.source}</p>
							</div>
						))}
					</div>
				</section>

				<section className="py-12">
					<p className="text-xs font-mono text-neutral-400 tracking-widest mb-6">API USAGE</p>
					<h2 className="text-xl font-semibold mb-6">Use in your code</h2>
					<div className="grid grid-cols-2 gap-8">
						<div className="flex flex-col">
							<h3 className="text-sm font-medium mb-3">npm package</h3>
							<div className="p-4 bg-white dark:bg-neutral-950 text-black dark:text-white font-mono text-sm border border-neutral-200 dark:border-neutral-800 flex-1">
								<pre className="whitespace-pre-wrap">{`import { preview } from "openlink"

const data = await preview("github.com")
console.log(data.title)`}</pre>
							</div>
						</div>
						<div className="flex flex-col">
							<h3 className="text-sm font-medium mb-3">Hosted API</h3>
							<div className="p-4 bg-white dark:bg-neutral-950 text-black dark:text-white font-mono text-sm border border-neutral-200 dark:border-neutral-800 flex-1">
								<pre className="whitespace-pre-wrap">{`const url = "openlink.sh/api/preview"
const res = await fetch(url + "?url=github.com")
const { data } = await res.json()`}</pre>
							</div>
						</div>
					</div>
				</section>

				<footer className="py-8 flex items-center justify-between text-sm text-neutral-400">
					<p>© 2026 Visible</p>
					<ThemeToggle />
				</footer>
			</div>
		</main>
	);
}
