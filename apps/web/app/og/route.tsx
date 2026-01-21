import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
	return new ImageResponse(
		(
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "#0a0a0a",
					fontFamily: "system-ui",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "24px",
						marginBottom: "40px",
					}}
				>
					<svg
						width="80"
						height="80"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#fff"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4" />
						<path d="M14 4h6v6" />
						<path d="M20 4L10 14" />
					</svg>
					<span
						style={{
							fontSize: "72px",
							fontWeight: "bold",
							color: "#fff",
							letterSpacing: "-2px",
						}}
					>
						openlink
					</span>
				</div>
				<div
					style={{
						fontSize: "32px",
						color: "#888",
						marginBottom: "60px",
					}}
				>
					Edge-first link preview. Zero dependencies.
				</div>
				<div
					style={{
						display: "flex",
						gap: "40px",
						fontSize: "24px",
						color: "#666",
					}}
				>
					<span>~2kb gzipped</span>
					<span>0 dependencies</span>
					<span>TypeScript</span>
				</div>
			</div>
		),
		{
			width: 1200,
			height: 630,
		}
	);
}
