# openlink

Edge-first link preview. Zero dependencies.

## Install

```bash
npm install openlink
```

## Usage

```js
import { preview } from 'openlink'

const data = await preview('https://github.com')

// {
//   url: 'https://github.com',
//   title: 'GitHub',
//   description: 'Where the world builds software',
//   image: 'https://github.githubassets.com/images/modules/og.png',
//   favicon: 'https://github.com/favicon.ico',
//   siteName: 'GitHub',
//   domain: 'github.com',
//   type: 'website'
// }
```

## Options

```js
await preview(url, {
  timeout: 10000,
  headers: { 'User-Agent': 'custom' },
  followRedirects: true
})
```

## Edge Support

Works in all edge runtimes:

- Cloudflare Workers
- Vercel Edge Functions
- Deno Deploy
- Bun

## API

### preview(url, options?)

Fetches and parses link metadata.

### parse(html)

Parses HTML string for metadata tags.

### extract(parsed, url)

Normalizes parsed metadata into clean output.

## License

MIT
