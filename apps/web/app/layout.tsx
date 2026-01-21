import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { RootProvider } from "fumadocs-ui/provider/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { ThemeColor } from "./components/themecolor";
import { I18nProvider } from "./i18n/context";

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
	],
};

export const metadata: Metadata = {
	title: {
		default: "OpenLink - Edge-first link preview",
		template: "%s | OpenLink",
	},
	description:
		"Link preview library for the edge. Zero dependencies, ~2kb gzipped. Works on Cloudflare Workers, Vercel Edge, Deno, Bun.",
	keywords: [
		"link preview",
		"unfurl",
		"opengraph",
		"twitter cards",
		"meta tags",
		"edge",
		"cloudflare workers",
		"vercel edge",
		"deno",
		"bun",
	],
	authors: [{ name: "visible" }],
	creator: "visible",
	metadataBase: new URL("https://openlink.sh"),
	openGraph: {
		title: "OpenLink - Edge-first link preview",
		description:
			"Link preview library for the edge. Zero dependencies, ~2kb gzipped.",
		url: "https://openlink.sh",
		siteName: "OpenLink",
		type: "website",
		images: [{ url: "/og", width: 1200, height: 630 }],
	},
	twitter: {
		card: "summary_large_image",
		title: "OpenLink - Edge-first link preview",
		description:
			"Link preview library for the edge. Zero dependencies, ~2kb gzipped.",
		images: ["/og"],
	},
	robots: {
		index: true,
		follow: true,
	},
	alternates: {
		canonical: "https://openlink.sh",
	},
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="en"
			className={`${GeistSans.variable} ${GeistMono.variable}`}
			suppressHydrationWarning
		>
			<body className="bg-white dark:bg-neutral-950">
				<RootProvider>
					<ThemeColor />
					<I18nProvider>
						{children}
					</I18nProvider>
				</RootProvider>
				<Analytics />
			</body>
		</html>
	);
}
