"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);

	async function copy() {
		await navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<button
			type="button"
			onClick={copy}
			className="p-1 transition-opacity hover:opacity-60"
			style={{ opacity: copied ? 1 : 0.4 }}
		>
			{copied ? (
				<svg
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					aria-hidden="true"
				>
					<polyline points="20 6 9 17 4 12" />
				</svg>
			) : (
				<svg
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					aria-hidden="true"
				>
					<rect x="9" y="9" width="13" height="13" rx="0" />
					<path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
				</svg>
			)}
		</button>
	);
}
