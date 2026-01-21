import { preview, fetchOembed, hasOembedSupport, detectProvider } from './src/index.js'

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

	console.log('\n\nall tests completed')
}

run()
