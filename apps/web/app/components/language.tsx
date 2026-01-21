"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/context";
import type { Locale } from "../i18n/translations";

const languages: { code: Locale; label: string }[] = [
	{ code: "en", label: "English" },
	{ code: "zh-CN", label: "简体中文" },
	{ code: "ja", label: "日本語" },
	{ code: "zh-TW", label: "繁體中文" },
];

export function LanguageSelector() {
	const [open, setOpen] = useState(false);
	const { locale } = useI18n();
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("click", handleClick);
		return () => document.removeEventListener("click", handleClick);
	}, []);

	function handleSelect(code: Locale) {
		if (code === locale) {
			setOpen(false);
			return;
		}
		localStorage.setItem("locale", code);
		window.location.href = window.location.pathname;
	}

	const current = languages.find((l) => l.code === locale);

	return (
		<div ref={ref} className="relative">
			<button
				type="button"
				onClick={() => setOpen(!open)}
				className="flex items-center gap-2 px-2 py-1 text-xs border border-neutral-300 dark:border-neutral-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
			>
				<svg
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					aria-hidden="true"
				>
					<circle cx="12" cy="12" r="10" />
					<path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
				</svg>
				<span>{current?.label}</span>
			</button>

			{open && (
				<div className="absolute bottom-full left-0 mb-1 min-w-[120px] bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700">
					{languages.map((lang) => (
						<button
							key={lang.code}
							type="button"
							onClick={() => handleSelect(lang.code)}
							className="flex items-center justify-between w-full px-3 py-2 text-xs text-left transition-colors hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
						>
							<span>{lang.label}</span>
							{lang.code === locale && (
								<svg
									width="10"
									height="10"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="3"
									aria-hidden="true"
								>
									<polyline points="20 6 9 17 4 12" />
								</svg>
							)}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
