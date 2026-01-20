import { preview, parse, extract } from './src/index.js'

const tests = [
  'github.com',
  'https://vercel.com',
  'https://cloudflare.com'
]

async function run() {
  console.log('openlink tests\n')

  for (const url of tests) {
    console.log(`testing: ${url}`)
    try {
      const result = await preview(url)
      console.log(`  title: ${result.title}`)
      console.log(`  description: ${result.description?.slice(0, 60)}...`)
      console.log(`  image: ${result.image}`)
      console.log(`  favicon: ${result.favicon}`)
      console.log('')
    } catch (err) {
      console.log(`  error: ${err.message}\n`)
    }
  }
}

run()
