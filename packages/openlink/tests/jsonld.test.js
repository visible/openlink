import { test } from "node:test"
import assert from "node:assert"
import { parseJsonLd, extractJsonLd } from "../src/jsonld.js"

test("parseJsonLd extracts single object", () => {
	const html = `
		<html>
			<head>
				<script type="application/ld+json">
					{"@type": "Article", "headline": "Test Article"}
				</script>
			</head>
		</html>
	`
	const result = parseJsonLd(html)

	assert.strictEqual(result.length, 1)
	assert.strictEqual(result[0]["@type"], "Article")
	assert.strictEqual(result[0].headline, "Test Article")
})

test("parseJsonLd extracts multiple scripts", () => {
	const html = `
		<html>
			<head>
				<script type="application/ld+json">{"@type": "Article"}</script>
				<script type="application/ld+json">{"@type": "Organization"}</script>
			</head>
		</html>
	`
	const result = parseJsonLd(html)

	assert.strictEqual(result.length, 2)
	assert.strictEqual(result[0]["@type"], "Article")
	assert.strictEqual(result[1]["@type"], "Organization")
})

test("parseJsonLd handles arrays", () => {
	const html = `
		<html>
			<head>
				<script type="application/ld+json">
					[{"@type": "Article"}, {"@type": "Person"}]
				</script>
			</head>
		</html>
	`
	const result = parseJsonLd(html)

	assert.strictEqual(result.length, 2)
	assert.strictEqual(result[0]["@type"], "Article")
	assert.strictEqual(result[1]["@type"], "Person")
})

test("parseJsonLd ignores invalid json", () => {
	const html = `
		<html>
			<head>
				<script type="application/ld+json">invalid json</script>
				<script type="application/ld+json">{"@type": "Valid"}</script>
			</head>
		</html>
	`
	const result = parseJsonLd(html)

	assert.strictEqual(result.length, 1)
	assert.strictEqual(result[0]["@type"], "Valid")
})

test("parseJsonLd returns empty array for no jsonld", () => {
	const html = "<html><head></head></html>"
	const result = parseJsonLd(html)

	assert.deepStrictEqual(result, [])
})

test("extractJsonLd returns null for empty array", () => {
	const result = extractJsonLd([])
	assert.strictEqual(result, null)
})

test("extractJsonLd extracts types", () => {
	const items = [{ "@type": "Article" }, { "@type": "Organization" }]
	const result = extractJsonLd(items)

	assert.deepStrictEqual(result.types, ["Article", "Organization"])
})

test("extractJsonLd handles array types", () => {
	const items = [{ "@type": ["Article", "NewsArticle"] }]
	const result = extractJsonLd(items)

	assert.deepStrictEqual(result.types, ["Article", "NewsArticle"])
})

test("extractJsonLd extracts article", () => {
	const items = [
		{
			"@type": "Article",
			headline: "Test Headline",
			description: "Test Description",
			author: { name: "John Doe" },
			publisher: { name: "News Site", logo: { url: "https://example.com/logo.png" } },
			datePublished: "2024-01-15",
			dateModified: "2024-01-16",
			image: "https://example.com/image.png",
		},
	]
	const result = extractJsonLd(items)

	assert.strictEqual(result.article.headline, "Test Headline")
	assert.strictEqual(result.article.description, "Test Description")
	assert.strictEqual(result.article.author, "John Doe")
	assert.deepStrictEqual(result.article.publisher, {
		name: "News Site",
		logo: "https://example.com/logo.png",
	})
	assert.strictEqual(result.article.datePublished, "2024-01-15")
	assert.strictEqual(result.article.dateModified, "2024-01-16")
	assert.strictEqual(result.article.image, "https://example.com/image.png")
})

test("extractJsonLd extracts product", () => {
	const items = [
		{
			"@type": "Product",
			name: "Test Product",
			description: "Product description",
			image: "https://example.com/product.png",
			brand: { name: "Brand Name" },
			offers: {
				price: "99.99",
				priceCurrency: "USD",
				availability: "https://schema.org/InStock",
			},
			aggregateRating: { ratingValue: 4.5, reviewCount: 100 },
		},
	]
	const result = extractJsonLd(items)

	assert.strictEqual(result.product.name, "Test Product")
	assert.strictEqual(result.product.description, "Product description")
	assert.strictEqual(result.product.image, "https://example.com/product.png")
	assert.strictEqual(result.product.brand, "Brand Name")
	assert.deepStrictEqual(result.product.price, {
		amount: "99.99",
		currency: "USD",
		availability: "InStock",
	})
	assert.deepStrictEqual(result.product.rating, { value: 4.5, count: 100 })
})

test("extractJsonLd extracts organization", () => {
	const items = [
		{
			"@type": "Organization",
			name: "Example Corp",
			url: "https://example.com",
			logo: "https://example.com/logo.png",
		},
	]
	const result = extractJsonLd(items)

	assert.strictEqual(result.organization.name, "Example Corp")
	assert.strictEqual(result.organization.url, "https://example.com")
	assert.strictEqual(result.organization.logo, "https://example.com/logo.png")
})

test("extractJsonLd extracts video", () => {
	const items = [
		{
			"@type": "VideoObject",
			name: "Test Video",
			description: "Video description",
			thumbnailUrl: "https://example.com/thumb.png",
			duration: "PT5M30S",
			uploadDate: "2024-01-15",
		},
	]
	const result = extractJsonLd(items)

	assert.strictEqual(result.video.name, "Test Video")
	assert.strictEqual(result.video.description, "Video description")
	assert.strictEqual(result.video.thumbnail, "https://example.com/thumb.png")
	assert.strictEqual(result.video.duration, "PT5M30S")
	assert.strictEqual(result.video.uploadDate, "2024-01-15")
})

test("extractJsonLd extracts breadcrumbs", () => {
	const items = [
		{
			"@type": "BreadcrumbList",
			itemListElement: [
				{ position: 2, name: "Category", item: { "@id": "https://example.com/cat" } },
				{ position: 1, name: "Home", item: "https://example.com" },
			],
		},
	]
	const result = extractJsonLd(items)

	assert.strictEqual(result.breadcrumbs.length, 2)
	assert.strictEqual(result.breadcrumbs[0].name, "Home")
	assert.strictEqual(result.breadcrumbs[0].url, "https://example.com")
	assert.strictEqual(result.breadcrumbs[1].name, "Category")
	assert.strictEqual(result.breadcrumbs[1].url, "https://example.com/cat")
})

test("extractJsonLd handles string author", () => {
	const items = [{ "@type": "Article", author: "Jane Doe" }]
	const result = extractJsonLd(items)

	assert.strictEqual(result.article.author, "Jane Doe")
})

test("extractJsonLd handles array authors", () => {
	const items = [{ "@type": "Article", author: [{ name: "John" }, { name: "Jane" }] }]
	const result = extractJsonLd(items)

	assert.strictEqual(result.article.author, "John, Jane")
})
