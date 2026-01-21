"use client";

import { useState } from "react";

export function CopyMarkdown({ url }: { url: string }) {
	const [copied, setCopied] = useState(false);

	async function handleCopy() {
		try {
			const res = await fetch(url);
			const text = await res.text();
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	}

	return (
		<button
			onClick={handleCopy}
			className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
			title="Copy page as markdown"
		>
			{copied ? (
				<>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<polyline points="20 6 9 17 4 12" />
					</svg>
					<span>Copied</span>
				</>
			) : (
				<>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
						<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
					</svg>
					<span>Copy as MD</span>
				</>
			)}
		</button>
	);
}
