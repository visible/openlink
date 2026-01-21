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

Works on Cloudflare Workers, Vercel Edge, Deno, Bun, and Node 18+.

[Docs](https://openlink.sh/docs) · [API](https://openlink.sh/docs/api) · [TypeScript](https://openlink.sh/docs/typescript)

MIT
