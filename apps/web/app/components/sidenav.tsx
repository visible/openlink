"use client";

import { useEffect, useState } from "react";

const navItems = [
	{ id: "hero", label: "Index" },
	{ id: "features", label: "Features" },
	{ id: "usage", label: "Usage" },
	{ id: "colophon", label: "Colophon" },
];

export function SideNav() {
	const [active, setActive] = useState("hero");

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActive(entry.target.id);
					}
				}
			},
			{ threshold: 0.3 },
		);

		for (const { id } of navItems) {
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		}

		return () => observer.disconnect();
	}, []);

	const scrollTo = (id: string) => {
		const el = document.getElementById(id);
		if (el) el.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<nav
			className="fixed left-0 top-0 z-50 h-screen w-16 hidden md:flex flex-col justify-center"
			style={{
				borderRight: "1px solid #e8e4de",
				backgroundColor: "rgba(250, 249, 247, 0.8)",
				backdropFilter: "blur(8px)",
			}}
		>
			<div className="flex flex-col gap-6 px-4">
				{navItems.map(({ id, label }) => (
					<button
						type="button"
						key={id}
						onClick={() => scrollTo(id)}
						className="group relative flex items-center gap-3"
					>
						<span
							className="h-1.5 w-1.5 rounded-full transition-all duration-300"
							style={{
								backgroundColor: active === id ? "#c9b99a" : "rgba(0,0,0,0.2)",
								transform: active === id ? "scale(1.25)" : "scale(1)",
							}}
						/>
						<span
							className="absolute left-6 font-mono text-[10px] uppercase tracking-widest opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:left-8 whitespace-nowrap"
							style={{ color: active === id ? "#c9b99a" : "#999" }}
						>
							{label}
						</span>
					</button>
				))}
			</div>
		</nav>
	);
}
