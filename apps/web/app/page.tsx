"use client";

import { Downloads } from "./components/downloads";
import { InstallCommand } from "./components/install";
import { LanguageSelector } from "./components/language";
import { StatsGrid } from "./components/stats";
import { ThemeToggle } from "./components/theme";
import { useI18n } from "./i18n/context";
import { Logo } from "./logo";
import specs from "./specs.json";

export default function Page() {
	const { t } = useI18n();

	return (
		<main className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white transition-colors">
			<div className="sticky top-0 z-50 max-w-5xl mx-auto px-8">
				<nav className="h-14 flex items-center justify-between bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
					<a href="/" className="flex items-center gap-2 group">
						<Logo className="w-5 h-5 text-black dark:text-white group-hover:scale-105 transition-transform" />
						<span className="text-sm font-semibold tracking-tight">OpenLink</span>
					</a>
					<div className="flex items-center gap-1">
						<a href="/docs" className="px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">{t.nav.docs}</a>
						<a href="/benchmarks" className="px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Benchmarks</a>
						<a href="/playground" className="px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Playground</a>
						<div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700 mx-2" />
						<a href="https://github.com/visible/OpenLink" className="flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
								<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
							</svg>
							<span>Star</span>
						</a>
					</div>
				</nav>
			</div>

			<div className="max-w-5xl mx-auto px-8 py-16">

				<section className="grid grid-cols-2 gap-16 pb-24 border-b border-neutral-200 dark:border-neutral-800">
					<div className="flex flex-col">
						<p className="text-xs font-mono text-neutral-400 tracking-widest mb-6">INTRODUCTION</p>
						<h1 className="text-5xl font-semibold tracking-tight leading-tight mb-6">
							Link previews<br />for the edge
						</h1>
						<p className="text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed mb-10">{t.hero.description}</p>
						<div className="flex items-center gap-3 mt-auto">
							<a href="/docs" className="get-started px-5 py-2.5 bg-black dark:bg-white text-sm font-medium">{t.nav.getStarted}</a>
							<a href="https://github.com/visible/OpenLink" className="px-5 py-2.5 border border-black dark:border-white text-sm font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">GitHub</a>
						</div>
					</div>
					<div className="flex flex-col">
						<div className="bg-white dark:bg-neutral-950 text-black dark:text-white p-6 font-mono text-sm border border-neutral-200 dark:border-neutral-800">
							<div className="flex items-center justify-end mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
								<InstallCommand />
							</div>
							<div className="space-y-4">
								<div>
									<p className="flex items-center gap-2">
										<span className="text-neutral-400 dark:text-neutral-600 select-none">&gt;</span>
										<span><span className="text-neutral-500">await</span> preview<span className="text-neutral-500">(</span><span className="text-emerald-600 dark:text-emerald-400">"github.com"</span><span className="text-neutral-500">)</span></span>
									</p>
								</div>
								<div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
									<p><span className="text-neutral-500">{"{"}</span></p>
									<p className="pl-4">title<span className="text-neutral-500">:</span> <span className="text-emerald-600 dark:text-emerald-400">"GitHub"</span></p>
									<p className="pl-4">description<span className="text-neutral-500">:</span> <span className="text-emerald-600 dark:text-emerald-400">"Where the world builds..."</span></p>
									<p className="pl-4">image<span className="text-neutral-500">:</span> <span className="text-emerald-600 dark:text-emerald-400">"https://github.githubassets..."</span></p>
									<p className="pl-4">favicon<span className="text-neutral-500">:</span> <span className="text-emerald-600 dark:text-emerald-400">"https://github.com/favicon.ico"</span></p>
									<p><span className="text-neutral-500">{"}"}</span></p>
								</div>
							</div>
						</div>
						<div className="flex items-center justify-between text-sm text-neutral-500 mt-auto">
							<Downloads />
							<div className="flex items-center gap-4">
								<span>MIT</span>
								<span>TypeScript</span>
							</div>
						</div>
					</div>
				</section>

				<section className="py-24 border-b border-neutral-200 dark:border-neutral-800">
					<h2 className="text-xl font-semibold mb-6">The link preview library</h2>
					<p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-2xl font-mono text-sm">
						<span className="text-neutral-400">[*]</span> OpenLink is an open source library that extracts metadata from any URL. Zero dependencies, TypeScript native, and runs anywhere JavaScript runs.
					</p>
					<a href="/docs" className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-sm font-mono hover:border-black dark:hover:border-white transition-colors">
						Read docs <span aria-hidden="true">→</span>
					</a>
				</section>

				<section className="py-24 border-b border-neutral-200 dark:border-neutral-800">
					<h2 className="text-xl font-semibold mb-6">The minimal link preview library</h2>
					<p className="text-neutral-500 dark:text-neutral-400 mb-16 max-w-3xl font-mono text-sm">
						<span className="text-neutral-400">[*]</span> With only <span className="text-black dark:text-white font-semibold">{specs.size}</span> gzipped, <span className="text-black dark:text-white font-semibold">{specs.deps}</span> dependencies, and <span className="text-black dark:text-white font-semibold">{specs.parse}</span> average parse time, OpenLink is built for performance at the edge.
					</p>
					<StatsGrid specs={specs} />
				</section>

				<section className="py-24 border-b border-neutral-200 dark:border-neutral-800">
					<p className="text-xs font-mono text-neutral-400 tracking-widest mb-8">FEATURES</p>
					<div className="space-y-4 font-mono text-sm">
						{[
							{ label: "Zero dependencies", desc: "No external packages, pure JavaScript" },
							{ label: "TypeScript native", desc: "Full type definitions included" },
							{ label: "Edge ready", desc: "Works on Vercel Edge, Cloudflare Workers, Deno" },
							{ label: "Lightweight", desc: "Under 2kb gzipped, tree-shakeable" },
							{ label: "AI compatible", desc: "Perfect for LLM tool calls and agents" },
							{ label: "Open Graph", desc: "Extracts og:title, og:description, og:image" },
						].map((f) => (
							<div key={f.label} className="flex items-start gap-4">
								<span className="text-neutral-400">[*]</span>
								<span>
									<span className="font-semibold">{f.label}</span>
									<span className="text-neutral-500 ml-4">{f.desc}</span>
								</span>
							</div>
						))}
					</div>
				</section>

				<section className="py-24 border-b border-neutral-200 dark:border-neutral-800">
					<p className="text-xs font-mono text-neutral-400 tracking-widest mb-8">RUNTIMES</p>
					<div className="flex items-center gap-4">
						{["Vercel Edge", "Cloudflare Workers", "Deno Deploy", "Node.js", "Bun"].map((r) => (
							<span key={r} className="px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm">{r}</span>
						))}
					</div>
				</section>

				<section className="py-24 border-b border-neutral-200 dark:border-neutral-800">
					<p className="text-xs font-mono text-neutral-400 tracking-widest mb-6">WORKS WITH</p>
					<p className="text-lg text-neutral-500 dark:text-neutral-400 mb-8 max-w-2xl">
						Use OpenLink as a tool for any AI model with function calling. Extract link previews in your agents, chatbots, and AI applications.
					</p>
					<div className="flex items-center gap-10 mb-8">
						<svg className="h-6 w-6 text-neutral-700 dark:text-neutral-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<title>OpenAI</title>
							<path d="M21.55 10.004a5.416 5.416 0 00-.478-4.501c-1.217-2.09-3.662-3.166-6.05-2.66A5.59 5.59 0 0010.831 1C8.39.995 6.224 2.546 5.473 4.838A5.553 5.553 0 001.76 7.496a5.487 5.487 0 00.691 6.5 5.416 5.416 0 00.477 4.502c1.217 2.09 3.662 3.165 6.05 2.66A5.586 5.586 0 0013.168 23c2.443.006 4.61-1.546 5.361-3.84a5.553 5.553 0 003.715-2.66 5.488 5.488 0 00-.693-6.497v.001zm-8.381 11.558a4.199 4.199 0 01-2.675-.954c.034-.018.093-.05.132-.074l4.44-2.53a.71.71 0 00.364-.623v-6.176l1.877 1.069c.02.01.033.029.036.05v5.115c-.003 2.274-1.87 4.118-4.174 4.123zM4.192 17.78a4.059 4.059 0 01-.498-2.763c.032.02.09.055.131.078l4.44 2.53c.225.13.504.13.73 0l5.42-3.088v2.138a.068.068 0 01-.027.057L9.9 19.288c-1.999 1.136-4.552.46-5.707-1.51h-.001zM3.023 8.216A4.15 4.15 0 015.198 6.41l-.002.151v5.06a.711.711 0 00.364.624l5.42 3.087-1.876 1.07a.067.067 0 01-.063.005l-4.489-2.559c-1.995-1.14-2.679-3.658-1.53-5.63h.001zm15.417 3.54l-5.42-3.088L14.896 7.6a.067.067 0 01.063-.006l4.489 2.557c1.998 1.14 2.683 3.662 1.529 5.633a4.163 4.163 0 01-2.174 1.807V12.38a.71.71 0 00-.363-.623zm1.867-2.773a6.04 6.04 0 00-.132-.078l-4.44-2.53a.731.731 0 00-.729 0l-5.42 3.088V7.325a.068.068 0 01.027-.057L14.1 4.713c2-1.137 4.555-.46 5.707 1.513.487.833.664 1.809.499 2.757h.001zm-11.741 3.81l-1.877-1.068a.065.065 0 01-.036-.051V6.559c.001-2.277 1.873-4.122 4.181-4.12.976 0 1.92.338 2.671.954-.034.018-.092.05-.131.073l-4.44 2.53a.71.71 0 00-.365.623l-.003 6.173v.002zm1.02-2.168L12 9.25l2.414 1.375v2.75L12 14.75l-2.415-1.375v-2.75z"/>
						</svg>
						<svg className="h-6 w-6 text-neutral-700 dark:text-neutral-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<title>Anthropic</title>
							<path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z"/>
						</svg>
						<svg className="h-6 w-6 text-neutral-700 dark:text-neutral-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<title>xAI</title>
							<path d="M6.469 8.776L16.512 23h-4.464L2.005 8.776H6.47zm-.004 7.9l2.233 3.164L6.467 23H2l4.465-6.324zM22 2.582V23h-3.659V7.764L22 2.582zM22 1l-9.952 14.095-2.233-3.163L17.533 1H22z"/>
						</svg>
						<svg className="h-6 w-6 text-neutral-700 dark:text-neutral-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<title>Google</title>
							<path d="M23 12.245c0-.905-.075-1.565-.236-2.25h-10.54v4.083h6.186c-.124 1.014-.797 2.542-2.294 3.569l-.021.136 3.332 2.53.23.022C21.779 18.417 23 15.593 23 12.245z"/>
							<path d="M12.225 23c3.03 0 5.574-.978 7.433-2.665l-3.542-2.688c-.948.648-2.22 1.1-3.891 1.1a6.745 6.745 0 01-6.386-4.572l-.132.011-3.465 2.628-.045.124C4.043 20.531 7.835 23 12.225 23z"/>
							<path d="M5.84 14.175A6.65 6.65 0 015.463 12c0-.758.138-1.491.361-2.175l-.006-.147-3.508-2.67-.115.054A10.831 10.831 0 001 12c0 1.772.436 3.447 1.197 4.938l3.642-2.763z"/>
							<path d="M12.225 5.253c2.108 0 3.529.892 4.34 1.638l3.167-3.031C17.787 2.088 15.255 1 12.225 1 7.834 1 4.043 3.469 2.197 7.062l3.63 2.763a6.77 6.77 0 016.398-4.572z"/>
						</svg>
					</div>
					<p className="text-sm text-neutral-500">OpenAI, Anthropic, xAI, Google and more</p>
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
