"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export function ThemeColor() {
	const { resolvedTheme } = useTheme();

	useEffect(() => {
		const isDark = resolvedTheme === "dark";
		const color = isDark ? "#0a0a0a" : "#ffffff";
		const stroke = isDark ? "%23fff" : "%23000";

		let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
		if (!meta) {
			meta = document.createElement("meta");
			meta.setAttribute("name", "theme-color");
			document.head.appendChild(meta);
		}
		meta.setAttribute("content", color);

		const svg = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="${stroke}" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path stroke="${stroke}" d="M14 4h6v6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path stroke="${stroke}" d="M20 4L10 14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

		document.querySelectorAll('link[rel="icon"]').forEach((el) => el.remove());

		const link = document.createElement("link");
		link.rel = "icon";
		link.type = "image/svg+xml";
		link.href = svg;
		document.head.appendChild(link);
	}, [resolvedTheme]);

	return null;
}
