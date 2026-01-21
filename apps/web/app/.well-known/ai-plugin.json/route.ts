import { NextResponse } from "next/server";

export function GET() {
	return NextResponse.json({
		schema_version: "v1",
		name_for_human: "OpenLink",
		name_for_model: "openlink",
		description_for_human: "Extract link previews and metadata from any URL",
		description_for_model:
			"Use this to fetch Open Graph metadata, titles, descriptions, images, and favicons from URLs. Returns structured data about web pages.",
		auth: { type: "none" },
		api: {
			type: "openapi",
			url: "https://openlink.sh/.well-known/openapi.json",
		},
		logo_url: "https://openlink.sh/og",
		contact_email: "hi@visible.com",
		legal_info_url: "https://openlink.sh",
	});
}
