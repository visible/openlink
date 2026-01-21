"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "./copy";

const pms = [
	{ name: "bun", verb: "add" },
	{ name: "pnpm", verb: "add" },
	{ name: "npm", verb: "install" },
	{ name: "yarn", verb: "add" },
];

export function InstallCommand() {
	const [index, setIndex] = useState(0);
	const [animating, setAnimating] = useState(false);
	const [verbAnimating, setVerbAnimating] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => {
			const next = (index + 1) % pms.length;
			const verbWillChange = pms[index].verb !== pms[next].verb;

			setAnimating(true);
			if (verbWillChange) setVerbAnimating(true);

			setTimeout(() => {
				setIndex(next);
				setAnimating(false);
				if (verbWillChange) setVerbAnimating(false);
			}, 250);
		}, 3000);

		return () => clearInterval(interval);
	}, [index]);

	const current = pms[index];
	const cmd = `${current.name} ${current.verb} openlink`;

	return (
		<div className="flex items-center gap-2">
			<span>
				<span
					style={{
						display: "inline-block",
						opacity: animating ? 0 : 1,
						transform: animating ? "translateY(-6px)" : "translateY(0)",
						transition: "opacity 250ms ease, transform 250ms ease",
					}}
				>
					{current.name}
				</span>{" "}
				<span
					style={{
						display: "inline-block",
						opacity: verbAnimating ? 0 : 1,
						transform: verbAnimating ? "translateY(-6px)" : "translateY(0)",
						transition: "opacity 250ms ease, transform 250ms ease",
					}}
				>
					{current.verb}
				</span>{" "}
				openlink
			</span>
			<CopyButton text={cmd} />
		</div>
	);
}
