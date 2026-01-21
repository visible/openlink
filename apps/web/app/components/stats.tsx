"use client";

import { useEffect, useRef, useState } from "react";

function parseSize(size: string | null | undefined): number {
	if (!size || typeof size !== "string") return 0;
	const match = size.match(/([\d.]+)\s*(b|kb|mb|gb)?/i);
	if (!match) return 0;
	const value = parseFloat(match[1]);
	if (isNaN(value) || value < 0) return 0;
	const unit = (match[2] || "kb").toLowerCase();
	const multipliers: Record<string, number> = { b: 0.001, kb: 1, mb: 1000, gb: 1000000 };
	return value * (multipliers[unit] || 1);
}

function parseDeps(deps: string | number | null | undefined): number {
	if (deps === null || deps === undefined) return 0;
	const num = typeof deps === "number" ? deps : parseInt(String(deps));
	if (isNaN(num) || num < 0) return 0;
	return Math.min(num, 6);
}

function parseTime(time: string | null | undefined): number {
	if (!time || typeof time !== "string") return 0;
	const match = time.match(/([\d.]+)\s*(μs|us|ms|s)?/i);
	if (!match) return 0;
	const value = parseFloat(match[1]);
	if (isNaN(value) || value < 0) return 0;
	const unit = (match[2] || "ms").toLowerCase();
	const multipliers: Record<string, number> = { μs: 0.001, us: 0.001, ms: 1, s: 1000 };
	return value * (multipliers[unit] || 1);
}

function BundleViz({ sizeKb }: { sizeKb: number }) {
	const [visible, setVisible] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) setVisible(true);
			},
			{ threshold: 0.3 }
		);
		if (ref.current) observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	const maxKb = 50;
	const openLinkHeight = Math.max(4, (sizeKb / maxKb) * 100);

	const bars = [
		{ label: "others", height: 100 },
		{ label: "openlink", height: openLinkHeight },
	];

	return (
		<div ref={ref} className="h-44 flex items-end justify-center gap-6">
			{bars.map((bar, i) => (
				<div key={bar.label} className="flex flex-col items-center">
					<div
						className="w-12 bg-black dark:bg-white transition-all duration-1000 ease-out"
						style={{
							height: visible ? bar.height : 0,
							transitionDelay: `${i * 200}ms`,
						}}
					/>
					<span className="text-xs text-neutral-400 mt-2 font-mono">{bar.label}</span>
				</div>
			))}
		</div>
	);
}

function DepsViz({ deps }: { deps: number }) {
	const [visible, setVisible] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) setVisible(true);
			},
			{ threshold: 0.3 }
		);
		if (ref.current) observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	const nodes = [
		{ x: 95, y: 60 },
		{ x: 77.5, y: 90.31 },
		{ x: 42.5, y: 90.31 },
		{ x: 25, y: 60 },
		{ x: 42.5, y: 29.69 },
		{ x: 77.5, y: 29.69 },
	];

	return (
		<div ref={ref} className="h-44 flex items-center justify-center">
			<svg viewBox="0 0 120 120" className="w-32 h-32" aria-hidden="true">
				<circle
					cx="60"
					cy="60"
					r="6"
					className="fill-black dark:fill-white transition-all duration-700"
					style={{
						opacity: visible ? 1 : 0,
						transform: visible ? "scale(1)" : "scale(0)",
						transformOrigin: "60px 60px",
					}}
				/>
				{nodes.map((node, i) => {
					const x = node.x;
					const y = node.y;
					const isActive = i < deps;
					return (
						<g key={i}>
							<line
								x1="60"
								y1="60"
								x2={x}
								y2={y}
								className={isActive ? "stroke-black dark:stroke-white" : "stroke-neutral-200 dark:stroke-neutral-800"}
								strokeWidth="1"
								strokeDasharray={isActive ? "0" : "4 4"}
								style={{
									opacity: visible ? 1 : 0,
									transition: "opacity 500ms ease",
									transitionDelay: `${400 + i * 100}ms`,
								}}
							/>
							<circle
								cx={x}
								cy={y}
								r="4"
								className={isActive ? "fill-black dark:fill-white" : "stroke-neutral-300 dark:stroke-neutral-700 fill-none"}
								strokeWidth={isActive ? 0 : 1}
								strokeDasharray={isActive ? "0" : "2 2"}
								style={{
									opacity: visible ? 1 : 0,
									transition: "opacity 500ms ease",
									transitionDelay: `${400 + i * 100}ms`,
								}}
							/>
						</g>
					);
				})}
			</svg>
		</div>
	);
}

function ParseViz({ timeMs }: { timeMs: number }) {
	const [visible, setVisible] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) setVisible(true);
			},
			{ threshold: 0.3 }
		);
		if (ref.current) observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	const maxMs = 100;
	const lineStart = 20;
	const lineEnd = 140;
	const lineWidth = lineEnd - lineStart;
	const progress = Math.min(timeMs / maxMs, 1);
	const dotX = lineStart + progress * lineWidth;

	return (
		<div ref={ref} className="h-44 flex items-center justify-center">
			<svg viewBox="0 0 160 60" className="w-full h-20" aria-hidden="true">
				<line
					x1={lineStart}
					y1="30"
					x2={lineEnd}
					y2="30"
					className="stroke-neutral-200 dark:stroke-neutral-800"
					strokeWidth="1"
				/>
				{[0, 0.25, 0.5, 0.75, 1].map((pct) => {
					const x = lineStart + pct * lineWidth;
					return (
						<line
							key={pct}
							x1={x}
							y1="25"
							x2={x}
							y2="35"
							className="stroke-neutral-300 dark:stroke-neutral-700"
							strokeWidth="1"
						/>
					);
				})}
				<line
					x1={lineStart}
					y1="30"
					x2={dotX}
					y2="30"
					className="stroke-black dark:stroke-white transition-all duration-300 ease-out"
					strokeWidth="2"
					style={{
						strokeDasharray: dotX - lineStart,
						strokeDashoffset: visible ? 0 : dotX - lineStart,
					}}
				/>
				<circle
					cx={dotX}
					cy="30"
					r="5"
					className="fill-black dark:fill-white transition-all duration-300 ease-out"
					style={{
						opacity: visible ? 1 : 0,
						transitionDelay: "200ms",
					}}
				/>
				<text x={lineStart} y="50" className="fill-neutral-400 text-[8px] font-mono">
					0ms
				</text>
				<text x={lineEnd - 18} y="50" className="fill-neutral-400 text-[8px] font-mono">
					{maxMs}ms
				</text>
			</svg>
		</div>
	);
}

type Specs = {
	size?: string | null;
	deps?: string | number | null;
	parse?: string | null;
};

export function StatsGrid({ specs }: { specs: Specs }) {
	const sizeKb = parseSize(specs?.size);
	const deps = parseDeps(specs?.deps);
	const timeMs = parseTime(specs?.parse);

	return (
		<div className="grid grid-cols-3 gap-8">
			<div className="text-center">
				<BundleViz sizeKb={sizeKb} />
				<p className="font-mono text-sm mt-6">
					<span className="text-black dark:text-white">{specs?.size || "—"}</span>{" "}
					<span className="text-neutral-500">gzipped</span>
				</p>
			</div>
			<div className="text-center">
				<DepsViz deps={deps} />
				<p className="font-mono text-sm mt-6">
					<span className="text-black dark:text-white">{specs?.deps ?? "—"}</span>{" "}
					<span className="text-neutral-500">dependencies</span>
				</p>
			</div>
			<div className="text-center">
				<ParseViz timeMs={timeMs} />
				<p className="font-mono text-sm mt-6">
					<span className="text-black dark:text-white">{specs?.parse || "—"}</span>{" "}
					<span className="text-neutral-500">parse time</span>
				</p>
			</div>
		</div>
	);
}
