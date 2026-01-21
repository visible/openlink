import { preview, fetchOembed, hasOembedSupport, detectProvider } from './src/index.js'

console.log('oembed tests\n')

const urls = [
	'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
	'https://vimeo.com/148751763',
	'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT',
	'https://twitter.com/OpenAI/status/1234567890',
	'https://github.com',
]

console.log('testing detectProvider:')
for (const url of urls) {
	const provider = detectProvider(url)
	console.log(`  ${url}`)
	console.log(`    provider: ${provider ? provider.name : 'none'}`)
	console.log(`    hasSupport: ${hasOembedSupport(url)}`)
}

console.log('\ntesting fetchOembed:')
for (const url of urls.slice(0, 3)) {
	console.log(`\n  ${url}`)
	try {
		const oembed = await fetchOembed(url, { timeout: 10000 })
		if (oembed) {
			console.log(`    provider: ${oembed.provider}`)
			console.log(`    type: ${oembed.type}`)
			console.log(`    title: ${oembed.title?.slice(0, 50)}...`)
			console.log(`    thumbnail: ${oembed.thumbnail ? 'yes' : 'no'}`)
		} else {
			console.log(`    result: null (provider may not respond)`)
		}
	} catch (err) {
		console.log(`    error: ${err.message}`)
	}
}

console.log('\ntesting preview with includeOembed:')
try {
	const result = await preview('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
		includeOembed: true,
		timeout: 15000
	})
	console.log(`  title: ${result.title}`)
	console.log(`  oembed: ${result.oembed ? 'present' : 'not present'}`)
	if (result.oembed) {
		console.log(`  oembed.provider: ${result.oembed.provider}`)
		console.log(`  oembed.title: ${result.oembed.title?.slice(0, 50)}...`)
	}
} catch (err) {
	console.log(`  error: ${err.message}`)
}

console.log('\nall oembed tests completed')
