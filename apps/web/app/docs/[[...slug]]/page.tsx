import { CopyMarkdown } from "@/app/components/copymd";
import { source } from "@/app/lib/source";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { Callout } from "fumadocs-ui/components/callout";
import { Card, Cards } from "fumadocs-ui/components/card";
import { File, Files, Folder } from "fumadocs-ui/components/files";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { MDXContent } from "mdx/types";
import { notFound } from "next/navigation";

const components = {
	...defaultMdxComponents,
	Accordion,
	Accordions,
	Step,
	Steps,
	Tab,
	Tabs,
	Callout,
	Card,
	Cards,
	File,
	Folder,
	Files,
};

type TocItem = { title: string; url: string; depth: number };

type PageData = {
	title: string;
	description?: string;
	body: MDXContent;
	toc: TocItem[];
};

export default async function Page(props: {
	params: Promise<{ slug?: string[] }>;
}) {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	const { body: MDX, toc, title, description } = page.data as unknown as PageData;
	const mdxUrl = `/api/mdx/${params.slug ? params.slug.join("/") : "index"}`;

	return (
		<DocsPage
			toc={toc}
			tableOfContent={{
				style: "clerk",
				footer: <CopyMarkdown url={mdxUrl} />,
			}}
		>
			<DocsTitle>{title}</DocsTitle>
			<DocsDescription>{description}</DocsDescription>
			<DocsBody>
				<MDX components={components} />
			</DocsBody>
		</DocsPage>
	);
}

export async function generateStaticParams() {
	return source.generateParams();
}

export async function generateMetadata(props: {
	params: Promise<{ slug?: string[] }>;
}) {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	return {
		title: `${page.data.title} | OpenLink`,
		description: page.data.description,
	};
}
