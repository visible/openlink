import { NextResponse } from "next/server";

export function GET() {
	return NextResponse.json({
		openapi: "3.1.0",
		info: {
			title: "OpenLink API",
			version: "1.0.0",
			description: "Extract link previews and metadata from any URL",
		},
		servers: [{ url: "https://openlink.sh" }],
		paths: {
			"/api/preview": {
				get: {
					operationId: "getPreview",
					summary: "Get link preview for a URL",
					parameters: [
						{
							name: "url",
							in: "query",
							required: true,
							schema: { type: "string" },
							description: "The URL to fetch preview for",
						},
					],
					responses: {
						"200": {
							description: "Link preview data",
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: {
											url: { type: "string" },
											title: { type: "string" },
											description: { type: "string" },
											image: { type: "string" },
											favicon: { type: "string" },
											siteName: { type: "string" },
											domain: { type: "string" },
											type: { type: "string" },
										},
									},
								},
							},
						},
					},
				},
			},
			"/api/favicon": {
				get: {
					operationId: "getFavicon",
					summary: "Get favicon for a domain",
					parameters: [
						{
							name: "url",
							in: "query",
							required: true,
							schema: { type: "string" },
							description: "The domain to fetch favicon for",
						},
					],
					responses: {
						"200": {
							description: "Favicon image",
							content: { "image/*": {} },
						},
					},
				},
			},
		},
	});
}
