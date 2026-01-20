export interface PreviewOptions {
  timeout?: number
  headers?: Record<string, string>
  followRedirects?: boolean
}

export interface PreviewResult {
  url: string
  title: string | null
  description: string | null
  image: string | null
  favicon: string
  siteName: string
  domain: string
  type: string
}

export interface ParseResult {
  ogTitle: string | null
  ogDescription: string | null
  ogImage: string | null
  ogType: string | null
  ogSiteName: string | null
  ogUrl: string | null
  twitterTitle: string | null
  twitterDescription: string | null
  twitterImage: string | null
  twitterCard: string | null
  title: string | null
  description: string | null
  favicon: string | null
  canonical: string | null
}

export function preview(url: string, options?: PreviewOptions): Promise<PreviewResult>
export function parse(html: string): ParseResult
export function extract(parsed: ParseResult, url: string): PreviewResult
