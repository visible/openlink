import { preview, fetchOembed, hasOembedSupport, detectProvider, parseJsonLd, extractJsonLd, corsProxy, allOriginsProxy, withRetry, isRetryable, PreviewError, createCache, memoryCache, withCache, cacheKey, getImageSize } from './src/index.js'

const urls = [
	'github.com',
	'https://vercel.com',
	'https://cloudflare.com'
]

const oembedUrls = [
	'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
	'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT',
]

async function run() {
	console.log('openlink tests\n')

	console.log('preview tests:')
	for (const url of urls) {
		console.log(`\n  ${url}`)
		try {
			const result = await preview(url)
			console.log(`    title: ${result.title}`)
			console.log(`    favicon: ${result.favicon}`)
		} catch (err) {
			console.log(`    error: ${err.message}`)
		}
	}

	console.log('\n\noembed tests:')
	console.log('\n  detectProvider:')
	for (const url of [...oembedUrls, 'https://github.com']) {
		const provider = detectProvider(url)
		console.log(`    ${url.slice(0, 40)}... → ${provider ? provider.name : 'none'}`)
	}

	console.log('\n  fetchOembed:')
	for (const url of oembedUrls) {
		try {
			const oembed = await fetchOembed(url, { timeout: 10000 })
			if (oembed) {
				console.log(`    ${oembed.provider}: ${oembed.title?.slice(0, 40)}...`)
			}
		} catch (err) {
			console.log(`    error: ${err.message}`)
		}
	}

	console.log('\n  preview with oembed:')
	try {
		const result = await preview(oembedUrls[0], { includeOembed: true, timeout: 15000 })
		console.log(`    title: ${result.title?.slice(0, 50)}...`)
		console.log(`    oembed: ${result.oembed ? 'yes' : 'no'}`)
	} catch (err) {
		console.log(`    error: ${err.message}`)
	}

	console.log('\n\njsonld tests:')
	const jsonldUrls = [
		'https://www.bbc.com/news',
		'https://github.com',
	]

	for (const url of jsonldUrls) {
		console.log(`\n  ${url}`)
		try {
			const result = await preview(url, { includeJsonLd: true })
			if (result.jsonLd) {
				console.log(`    types: ${result.jsonLd.types.join(', ') || 'none'}`)
				console.log(`    items: ${result.jsonLd.data.length}`)
			} else {
				console.log(`    jsonLd: none`)
			}
		} catch (err) {
			console.log(`    error: ${err.message}`)
		}
	}

	console.log('\n\nproxy tests:')
	console.log(`  corsProxy: ${corsProxy('https://example.com').slice(0, 50)}...`)
	console.log(`  allOriginsProxy: ${allOriginsProxy('https://example.com').slice(0, 50)}...`)

	console.log('\n\nretry tests:')
	let attempts = 0
	try {
		await withRetry(async () => {
			attempts++
			if (attempts < 3) throw new Error('fail')
			return 'success'
		}, { retries: 3, delay: 100 })
		console.log(`  withRetry: passed after ${attempts} attempts`)
	} catch {
		console.log(`  withRetry: failed`)
	}

	const timeoutErr = new PreviewError('timeout', 'TIMEOUT')
	const invalidErr = new PreviewError('invalid', 'INVALID_URL')
	console.log(`  isRetryable(TIMEOUT): ${isRetryable(timeoutErr)}`)
	console.log(`  isRetryable(INVALID_URL): ${isRetryable(invalidErr)}`)

	console.log('\n\ncache tests:')
	const storage = memoryCache()
	const cache = createCache(storage)

	await cache.set('https://test.com', { title: 'Test', url: 'https://test.com' })
	const cached = await cache.get('https://test.com')
	console.log(`  set/get: ${cached?.title === 'Test' ? 'passed' : 'failed'}`)
	console.log(`  cacheKey: ${cacheKey('https://test.com')}`)

	let fetchCount = 0
	const cachedPreview = withCache(cache, async (url) => {
		fetchCount++
		return { title: 'Fetched', url }
	})

	await cachedPreview('https://cached.com')
	await cachedPreview('https://cached.com')
	console.log(`  withCache: ${fetchCount === 1 ? 'passed (1 fetch for 2 calls)' : 'failed'}`)

	console.log('\n\nimage tests:')
	const testImages = [
		'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
		'https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png'
	]

	for (const imgUrl of testImages) {
		try {
			const size = await getImageSize(imgUrl)
			if (size) {
				console.log(`  ${imgUrl.slice(-30)}: ${size.width}x${size.height} (${size.type})`)
			} else {
				console.log(`  ${imgUrl.slice(-30)}: failed`)
			}
		} catch (err) {
			console.log(`  ${imgUrl.slice(-30)}: error - ${err.message}`)
		}
	}

	console.log('\n\nall tests completed')
}

run()
