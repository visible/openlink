import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { source } from "../lib/source";
import { Logo } from "../logo";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<DocsLayout
			tree={source.pageTree}
			nav={{
				title: (
					<div className="flex items-center gap-2">
						<Logo className="w-4 h-4" />
						<span className="font-semibold tracking-tight">OpenLink</span>
					</div>
				),
				url: "/",
			}}
			links={[
				{
					text: "Benchmarks",
					url: "/benchmarks",
				},
			]}
			githubUrl="https://github.com/visible/openlink"
			sidebar={{
				defaultOpenLevel: 1,
			}}
		>
			{children}
		</DocsLayout>
	);
}
