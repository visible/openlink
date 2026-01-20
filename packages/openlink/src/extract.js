export function extract(parsed, url) {
  const base = new URL(url)

  const title = parsed.ogTitle || parsed.twitterTitle || parsed.title || null
  const description = parsed.ogDescription || parsed.twitterDescription || parsed.description || null
  const image = resolve(parsed.ogImage || parsed.twitterImage, base)
  const favicon = resolve(parsed.favicon, base) || `${base.origin}/favicon.ico`
  const canonical = parsed.canonical || parsed.ogUrl || url
  const type = parsed.ogType || 'website'
  const siteName = parsed.ogSiteName || base.hostname

  return {
    url: canonical,
    title,
    description,
    image,
    favicon,
    siteName,
    domain: base.hostname,
    type
  }
}

function resolve(path, base) {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (path.startsWith('//')) return base.protocol + path
  if (path.startsWith('/')) return base.origin + path
  return new URL(path, base.origin).href
}
