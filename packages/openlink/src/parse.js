const patterns = {
  ogTitle: /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i,
  ogTitleAlt: /<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:title["'][^>]*>/i,
  ogDescription: /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["'][^>]*>/i,
  ogDescriptionAlt: /<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:description["'][^>]*>/i,
  ogImage: /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["'][^>]*>/i,
  ogImageAlt: /<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:image["'][^>]*>/i,
  ogType: /<meta[^>]*property=["']og:type["'][^>]*content=["']([^"']*)["'][^>]*>/i,
  ogTypeAlt: /<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:type["'][^>]*>/i,
  ogSiteName: /<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']*)["'][^>]*>/i,
  ogSiteNameAlt: /<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:site_name["'][^>]*>/i,
  ogUrl: /<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']*)["'][^>]*>/i,
  ogUrlAlt: /<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:url["'][^>]*>/i,
  twitterTitle: /<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']*)["'][^>]*>/i,
  twitterTitleAlt: /<meta[^>]*content=["']([^"']*)["'][^>]*name=["']twitter:title["'][^>]*>/i,
  twitterDescription: /<meta[^>]*name=["']twitter:description["'][^>]*content=["']([^"']*)["'][^>]*>/i,
  twitterDescriptionAlt: /<meta[^>]*content=["']([^"']*)["'][^>]*name=["']twitter:description["'][^>]*>/i,
  twitterImage: /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']*)["'][^>]*>/i,
  twitterImageAlt: /<meta[^>]*content=["']([^"']*)["'][^>]*name=["']twitter:image["'][^>]*>/i,
  twitterCard: /<meta[^>]*name=["']twitter:card["'][^>]*content=["']([^"']*)["'][^>]*>/i,
  twitterCardAlt: /<meta[^>]*content=["']([^"']*)["'][^>]*name=["']twitter:card["'][^>]*>/i,
  title: /<title[^>]*>([^<]*)<\/title>/i,
  description: /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i,
  descriptionAlt: /<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i,
  favicon: /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']*)["'][^>]*>/i,
  faviconAlt: /<link[^>]*href=["']([^"']*)["'][^>]*rel=["'](?:shortcut )?icon["'][^>]*>/i,
  canonical: /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i,
  canonicalAlt: /<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["'][^>]*>/i
}

export function parse(html) {
  const get = (key) => {
    const match = html.match(patterns[key]) || html.match(patterns[key + 'Alt'])
    return match ? decode(match[1].trim()) : null
  }

  return {
    ogTitle: get('ogTitle'),
    ogDescription: get('ogDescription'),
    ogImage: get('ogImage'),
    ogType: get('ogType'),
    ogSiteName: get('ogSiteName'),
    ogUrl: get('ogUrl'),
    twitterTitle: get('twitterTitle'),
    twitterDescription: get('twitterDescription'),
    twitterImage: get('twitterImage'),
    twitterCard: get('twitterCard'),
    title: get('title'),
    description: get('description'),
    favicon: get('favicon'),
    canonical: get('canonical')
  }
}

function decode(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
}
