"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
	const { theme, setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const dark = mounted ? resolvedTheme === "dark" : false;
	const current = mounted ? theme : "system";

	return (
		<div className="flex items-center border border-neutral-300 dark:border-neutral-700">
			<button
				type="button"
				onClick={() => setTheme("system")}
				className={`p-1.5 transition-colors ${current === "system" ? (dark ? "bg-white text-black" : "bg-black text-white") : (dark ? "text-white" : "text-black")}`}
				aria-label="System theme"
			>
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
					<rect x="2" y="3" width="20" height="14" rx="0" />
					<path d="M8 21h8M12 17v4" />
				</svg>
			</button>
			<button
				type="button"
				onClick={() => setTheme("light")}
				className={`p-1.5 transition-colors border-l border-r border-neutral-300 dark:border-neutral-700 ${current === "light" ? (dark ? "bg-white text-black" : "bg-black text-white") : (dark ? "text-white" : "text-black")}`}
				aria-label="Light theme"
			>
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
					<circle cx="12" cy="12" r="5" />
					<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
				</svg>
			</button>
			<button
				type="button"
				onClick={() => setTheme("dark")}
				className={`p-1.5 transition-colors ${current === "dark" ? (dark ? "bg-white text-black" : "bg-black text-white") : (dark ? "text-white" : "text-black")}`}
				aria-label="Dark theme"
			>
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
					<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
				</svg>
			</button>
		</div>
	);
}
