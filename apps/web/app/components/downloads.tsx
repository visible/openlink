"use client";

import { useEffect, useState } from "react";

export function Downloads() {
	const [count, setCount] = useState("0");

	useEffect(() => {
		fetch("https://api.npmjs.org/downloads/point/last-week/openlink")
			.then((res) => res.json())
			.then((data) => {
				const num = data.downloads ?? 0;
				if (num >= 1000000) {
					setCount(`${(num / 1000000).toFixed(1)}m`);
				} else if (num >= 1000) {
					setCount(`${(num / 1000).toFixed(1)}k`);
				} else {
					setCount(num.toString());
				}
			})
			.catch(() => setCount("0"));
	}, []);

	return <span>{count} weekly installs</span>;
}
