"use client";

import gsap from "gsap";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ScrambleProps {
	text: string;
	className?: string;
	delay?: number;
	duration?: number;
}

interface ScrambleHoverProps {
	text: string;
	className?: string;
	duration?: number;
	as?: "span" | "button" | "div" | "a";
	href?: string;
	onClick?: () => void;
	style?: CSSProperties;
}

const GLYPHS = "!@#$%^&*()_+-=<>?/\\[]{}Xx";

function runScramble(
	text: string,
	duration: number,
	setDisplayText: (text: string) => void,
	onComplete?: () => void,
): gsap.core.Tween {
	const lockedIndices = new Set<number>();
	const finalChars = text.split("");
	const totalChars = finalChars.length;
	const scrambleObj = { progress: 0 };

	return gsap.to(scrambleObj, {
		progress: 1,
		duration,
		ease: "power2.out",
		onUpdate: () => {
			const numLocked = Math.floor(scrambleObj.progress * totalChars);

			for (let i = 0; i < numLocked; i++) {
				lockedIndices.add(i);
			}

			const newDisplay = finalChars
				.map((char, i) => {
					if (lockedIndices.has(i)) return char;
					return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
				})
				.join("");

			setDisplayText(newDisplay);
		},
		onComplete: () => {
			setDisplayText(text);
			onComplete?.();
		},
	});
}

export function Scramble({
	text,
	className,
	delay = 0,
	duration = 0.9,
}: ScrambleProps) {
	const [displayText, setDisplayText] = useState(text);
	const [hasAnimated, setHasAnimated] = useState(false);
	const containerRef = useRef<HTMLSpanElement>(null);
	const animationRef = useRef<gsap.core.Tween | null>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const initialText = useRef(text);
	const initialDelay = useRef(delay);
	const initialDuration = useRef(duration);

	useEffect(() => {
		if (hasAnimated) return;
		const t = initialText.current;
		const d = initialDelay.current;
		const dur = initialDuration.current;

		const scrambledStart = t
			.split("")
			.map(() => GLYPHS[Math.floor(Math.random() * GLYPHS.length)])
			.join("");
		setDisplayText(scrambledStart);

		timeoutRef.current = setTimeout(() => {
			animationRef.current = runScramble(t, dur, setDisplayText, () => {
				setHasAnimated(true);
			});
		}, d);

		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
			if (animationRef.current) animationRef.current.kill();
		};
	}, [hasAnimated]);

	useEffect(() => {
		if (hasAnimated && displayText !== text) {
			setDisplayText(text);
		}
	}, [text, hasAnimated, displayText]);

	return (
		<span ref={containerRef} className={className}>
			{displayText || text}
		</span>
	);
}

export function ScrambleHover({
	text,
	className,
	duration = 0.4,
	as: Component = "span",
	href,
	onClick,
	style,
}: ScrambleHoverProps) {
	const [displayText, setDisplayText] = useState(text);
	const isAnimating = useRef(false);
	const tweenRef = useRef<gsap.core.Tween | null>(null);

	const handleMouseEnter = useCallback(() => {
		if (isAnimating.current) return;
		isAnimating.current = true;

		if (tweenRef.current) {
			tweenRef.current.kill();
		}

		const scrambledStart = text
			.split("")
			.map(() => GLYPHS[Math.floor(Math.random() * GLYPHS.length)])
			.join("");
		setDisplayText(scrambledStart);

		tweenRef.current = runScramble(text, duration, setDisplayText, () => {
			isAnimating.current = false;
		});
	}, [text, duration]);

	useEffect(() => {
		if (!isAnimating.current) {
			setDisplayText(text);
		}
	}, [text]);

	if (Component === "a" && href) {
		return (
			<a
				href={href}
				className={className}
				style={style}
				onMouseEnter={handleMouseEnter}
				onClick={onClick}
			>
				{displayText}
			</a>
		);
	}

	return (
		<Component
			className={className}
			style={style}
			onMouseEnter={handleMouseEnter}
			onClick={onClick}
		>
			{displayText}
		</Component>
	);
}
