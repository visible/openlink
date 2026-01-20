import { parse } from './parse.js'
import { extract } from './extract.js'

const defaults = {
  timeout: 10000,
  headers: {
    'User-Agent': 'OpenLinkBot/1.0 (+https://openlink.sh)',
    'Accept': 'text/html,application/xhtml+xml'
  },
  followRedirects: true
}

export async function preview(url, options = {}) {
  const opts = { ...defaults, ...options }

  if (!url || typeof url !== 'string') {
    throw new Error('url required')
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), opts.timeout)

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: opts.headers,
      signal: controller.signal,
      redirect: opts.followRedirects ? 'follow' : 'manual'
    })

    if (!response.ok) {
      throw new Error(`http ${response.status}`)
    }

    const html = await response.text()
    const parsed = parse(html)
    const data = extract(parsed, response.url || url)

    return data
  } finally {
    clearTimeout(timer)
  }
}

export { parse } from './parse.js'
export { extract } from './extract.js'
