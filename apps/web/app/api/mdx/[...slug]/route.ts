import { notFound } from "next/navigation";
import fs from "fs/promises";
import path from "path";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ slug: string[] }> }
) {
	const { slug } = await params;
	const slugPath = slug.join("/");
	const fileName = slugPath === "index" ? "index.mdx" : `${slugPath}.mdx`;

	const filePath = path.join(process.cwd(), "content/docs", fileName);

	try {
		const content = await fs.readFile(filePath, "utf-8");
		return new Response(content, {
			headers: {
				"Content-Type": "text/markdown; charset=utf-8",
			},
		});
	} catch {
		notFound();
	}
}
