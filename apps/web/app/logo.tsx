import type { CSSProperties } from "react";

export function Logo({
	className = "w-5 h-5",
	style,
}: {
	className?: string;
	style?: CSSProperties;
}) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			className={className}
			style={style}
			aria-hidden="true"
		>
			<path
				d="M10 6H6v12h12v-4"
				stroke="currentColor"
				strokeWidth={2}
				strokeLinecap="square"
				strokeLinejoin="miter"
			/>
			<path
				d="M14 4h6v6"
				stroke="currentColor"
				strokeWidth={2}
				strokeLinecap="square"
				strokeLinejoin="miter"
			/>
			<path
				d="M20 4L10 14"
				stroke="currentColor"
				strokeWidth={2}
				strokeLinecap="square"
				strokeLinejoin="miter"
			/>
		</svg>
	);
}
