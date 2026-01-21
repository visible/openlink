export function JsonLd() {
	const data = {
		"@context": "https://schema.org",
		"@type": "SoftwareSourceCode",
		name: "OpenLink",
		description: "Edge-first link preview library. Zero dependencies, ~2kb gzipped.",
		url: "https://openlink.sh",
		codeRepository: "https://github.com/visible/openlink",
		programmingLanguage: ["JavaScript", "TypeScript"],
		runtimePlatform: ["Node.js", "Deno", "Bun", "Cloudflare Workers", "Vercel Edge"],
		license: "https://opensource.org/licenses/MIT",
		author: { "@type": "Organization", name: "Visible", url: "https://visible.com" },
	};

	return (
		<script
			type="application/ld+json"
			suppressHydrationWarning
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	);
}
