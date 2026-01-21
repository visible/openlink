import "./globals.css";
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
	title: "OpenLink",
	description: "Link previews from any URL. Zero dependencies.",
	openGraph: {
		title: "OpenLink",
		description: "Link previews from any URL. Zero dependencies.",
		url: "https://openlink.sh",
		siteName: "OpenLink",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "OpenLink",
		description: "Link previews from any URL. Zero dependencies.",
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
			</body>
		</html>
	);
}
