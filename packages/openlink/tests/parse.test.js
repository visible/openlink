import { test } from "node:test"
import assert from "node:assert"
import { parse } from "../src/parse.js"

test("parse og tags", () => {
	const html = `
		<html>
			<head>
				<meta property="og:title" content="Test Title">
				<meta property="og:description" content="Test Description">
				<meta property="og:image" content="https://example.com/image.png">
				<meta property="og:type" content="article">
				<meta property="og:site_name" content="Test Site">
				<meta property="og:url" content="https://example.com/page">
			</head>
		</html>
	`
	const result = parse(html)

	assert.strictEqual(result.ogTitle, "Test Title")
	assert.strictEqual(result.ogDescription, "Test Description")
	assert.strictEqual(result.ogImage, "https://example.com/image.png")
	assert.strictEqual(result.ogType, "article")
	assert.strictEqual(result.ogSiteName, "Test Site")
	assert.strictEqual(result.ogUrl, "https://example.com/page")
})

test("parse twitter tags", () => {
	const html = `
		<html>
			<head>
				<meta name="twitter:title" content="Twitter Title">
				<meta name="twitter:description" content="Twitter Desc">
				<meta name="twitter:image" content="https://example.com/twitter.png">
				<meta name="twitter:card" content="summary_large_image">
				<meta name="twitter:site" content="@example">
			</head>
		</html>
	`
	const result = parse(html)

	assert.strictEqual(result.twitterTitle, "Twitter Title")
	assert.strictEqual(result.twitterDescription, "Twitter Desc")
	assert.strictEqual(result.twitterImage, "https://example.com/twitter.png")
	assert.strictEqual(result.twitterCard, "summary_large_image")
	assert.strictEqual(result.twitterSite, "@example")
})

test("parse standard meta tags", () => {
	const html = `
		<html>
			<head>
				<title>Page Title</title>
				<meta name="description" content="Page description">
				<meta name="author" content="John Doe">
				<meta name="keywords" content="test, example, keywords">
				<meta name="theme-color" content="#ff0000">
			</head>
		</html>
	`
	const result = parse(html)

	assert.strictEqual(result.title, "Page Title")
	assert.strictEqual(result.description, "Page description")
	assert.strictEqual(result.author, "John Doe")
	assert.strictEqual(result.keywords, "test, example, keywords")
	assert.strictEqual(result.themeColor, "#ff0000")
})

test("parse link tags", () => {
	const html = `
		<html>
			<head>
				<link rel="icon" href="/favicon.ico">
				<link rel="apple-touch-icon" href="/apple-icon.png">
				<link rel="canonical" href="https://example.com/canonical">
			</head>
		</html>
	`
	const result = parse(html)

	assert.strictEqual(result.favicon, "/favicon.ico")
	assert.strictEqual(result.appleTouchIcon, "/apple-icon.png")
	assert.strictEqual(result.canonical, "https://example.com/canonical")
})

test("parse language attributes", () => {
	const html = `
		<html lang="en-US">
			<head>
				<meta http-equiv="content-language" content="en">
			</head>
		</html>
	`
	const result = parse(html)

	assert.strictEqual(result.htmlLang, "en-US")
	assert.strictEqual(result.contentLanguage, "en")
})

test("decode html entities", () => {
	const html = `
		<html>
			<head>
				<meta property="og:title" content="Test &amp; Title &quot;quoted&quot;">
				<meta property="og:description" content="It&#39;s a test &lt;tag&gt;">
			</head>
		</html>
	`
	const result = parse(html)

	assert.strictEqual(result.ogTitle, 'Test & Title "quoted"')
	assert.strictEqual(result.ogDescription, "It's a test <tag>")
})

test("handle missing tags", () => {
	const html = "<html><head></head></html>"
	const result = parse(html)

	assert.strictEqual(result.ogTitle, null)
	assert.strictEqual(result.ogDescription, null)
	assert.strictEqual(result.title, null)
	assert.strictEqual(result.favicon, null)
})

test("handle reversed attribute order", () => {
	const html = `
		<html>
			<head>
				<meta content="Reversed Title" property="og:title">
				<meta content="Reversed Desc" name="description">
			</head>
		</html>
	`
	const result = parse(html)

	assert.strictEqual(result.ogTitle, "Reversed Title")
	assert.strictEqual(result.description, "Reversed Desc")
})

test("parse article metadata", () => {
	const html = `
		<html>
			<head>
				<meta property="article:author" content="Jane Smith">
				<meta property="article:published_time" content="2024-01-15T10:00:00Z">
			</head>
		</html>
	`
	const result = parse(html)

	assert.strictEqual(result.articleAuthor, "Jane Smith")
	assert.strictEqual(result.articlePublishedTime, "2024-01-15T10:00:00Z")
})

test("parse og image dimensions", () => {
	const html = `
		<html>
			<head>
				<meta property="og:image" content="https://example.com/image.png">
				<meta property="og:image:width" content="1200">
				<meta property="og:image:height" content="630">
				<meta property="og:image:alt" content="Image description">
			</head>
		</html>
	`
	const result = parse(html)

	assert.strictEqual(result.ogImage, "https://example.com/image.png")
	assert.strictEqual(result.ogImageWidth, "1200")
	assert.strictEqual(result.ogImageHeight, "630")
	assert.strictEqual(result.ogImageAlt, "Image description")
})
