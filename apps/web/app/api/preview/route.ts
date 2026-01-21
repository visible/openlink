import { preview } from "openlink"
import { NextRequest, NextResponse } from "next/server"
import { cached, parseTTL, formatTTL } from "../../lib/cache"

const DEFAULT_TTL = 60 * 60 * 1000
const MIN_TTL = 60 * 1000
const MAX_TTL = 31 * 24 * 60 * 60 * 1000

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")
  const fresh = request.nextUrl.searchParams.get("fresh") === "true"
  const ttlParam = request.nextUrl.searchParams.get("ttl")

  if (!url) {
    return NextResponse.json(
      {
        error: "Missing required parameter: url",
        code: "MISSING_URL",
        docs: "https://openlink.sh/docs#preview",
      },
      { status: 400 }
    )
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    return NextResponse.json(
      {
        error: "Invalid URL format",
        code: "INVALID_URL",
        docs: "https://openlink.sh/docs#preview",
      },
      { status: 400 }
    )
  }

  let ttl = DEFAULT_TTL
  if (ttlParam) {
    const parsed = parseTTL(ttlParam)
    if (parsed < MIN_TTL || parsed > MAX_TTL) {
      return NextResponse.json(
        {
          error: `TTL must be between 1m and 31d`,
          code: "INVALID_TTL",
          docs: "https://openlink.sh/docs#caching",
        },
        { status: 400 }
      )
    }
    ttl = parsed
  }

  const cacheKey = `preview:${parsedUrl.href}`

  try {
    const result = await cached(
      cacheKey,
      async () => {
        const data = await preview(parsedUrl.href)
        return {
          ...data,
          requestedAt: new Date().toISOString(),
        }
      },
      { ttl, fresh }
    )

    const response = {
      data: result.data,
      meta: {
        cache: {
          status: result.status,
          age: result.age,
          ageHuman: formatTTL(result.age),
          ttl: result.ttl,
          ttlHuman: formatTTL(result.ttl),
          expiresIn: Math.max(0, result.ttl - result.age),
          expiresInHuman: formatTTL(Math.max(0, result.ttl - result.age)),
        },
        timing: {
          requestedAt: result.data.requestedAt,
        },
      },
    }

    return NextResponse.json(response, {
      headers: {
        "X-Cache-Status": result.status,
        "X-Cache-Age": String(Math.round(result.age / 1000)),
        "X-Cache-TTL": String(Math.round(result.ttl / 1000)),
        "Cache-Control": fresh
          ? "no-store"
          : `public, max-age=${Math.round(result.ttl / 1000)}, stale-while-revalidate=${Math.round(result.ttl / 1000)}`,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch preview",
        code: "FETCH_ERROR",
        message: error instanceof Error ? error.message : "Unknown error",
        docs: "https://openlink.sh/docs#errors",
      },
      { status: 500 }
    )
  }
}
