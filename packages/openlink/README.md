# openlink

Edge-first link preview. Zero dependencies, ~2kb gzipped.

```bash
npm install openlink
```

```js
import { preview } from 'openlink'

const data = await preview('https://github.com')
```

Returns `{ url, title, description, image, favicon, siteName, domain, type }`

## oEmbed

```js
const data = await preview('https://youtube.com/watch?v=...', {
  includeOembed: true
})

console.log(data.oembed) // { provider, title, html, thumbnail, ... }
```

Supports YouTube, Vimeo, Twitter/X, Spotify, TikTok, Instagram, CodePen, CodeSandbox, Figma.

## JSON-LD

```js
const data = await preview('https://bbc.com/news', {
  includeJsonLd: true
})

console.log(data.jsonLd) // { types, article, product, organization, ... }
```

## Retry

```js
const data = await preview('https://example.com', {
  retry: 3,
  retryDelay: 1000
})
```

## Cache

```js
import { createCache, memoryCache, withCache, preview } from 'openlink'

const cache = createCache(memoryCache())
const cachedPreview = withCache(cache, preview)

const data = await cachedPreview('https://github.com')
```

## Image Size

```js
import { getImageSize } from 'openlink'

const size = await getImageSize('https://example.com/image.png')
console.log(size) // { width: 1200, height: 630, type: 'png' }
```

Works on Cloudflare Workers, Vercel Edge, Deno, Bun, and Node 18+.

[Docs](https://openlink.sh/docs) · [API](https://openlink.sh/docs/api) · [TypeScript](https://openlink.sh/docs/typescript)

MIT
