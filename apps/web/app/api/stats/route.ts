import { NextResponse } from "next/server";

export const revalidate = 3600;

async function fetchNpmDownloads(): Promise<number> {
	try {
		const res = await fetch(
			"https://api.npmjs.org/downloads/point/last-week/openlink",
			{ next: { revalidate: 3600 } }
		);
		const data = await res.json();
		return data.downloads ?? 0;
	} catch {
		return 0;
	}
}

async function fetchGithubStars(): Promise<number> {
	try {
		const res = await fetch(
			"https://api.github.com/repos/visible/openlink",
			{
				headers: { Accept: "application/vnd.github.v3+json" },
				next: { revalidate: 3600 },
			}
		);
		const data = await res.json();
		return data.stargazers_count ?? 0;
	} catch {
		return 0;
	}
}

function format(num: number): string {
	if (num >= 1000000) return `${(num / 1000000).toFixed(1)}m`;
	if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
	return num.toString();
}

export async function GET() {
	const [downloads, stars] = await Promise.all([
		fetchNpmDownloads(),
		fetchGithubStars(),
	]);

	return NextResponse.json({
		downloads: { raw: downloads, formatted: format(downloads) },
		stars: { raw: stars, formatted: format(stars) },
	});
}
