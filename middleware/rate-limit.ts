import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export async function rateLimit(
  request: NextRequest,
  limit: number = 100,
  window: number = 60
): Promise<NextResponse | null> {
  const ip = request.ip ?? '127.0.0.1'
  const key = `rate_limit:${ip}`

  try {
    const current = await redis.incr(key)
    
    if (current === 1) {
      await redis.expire(key, window)
    }

    if (current > limit) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          retryAfter: window,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': window.toString(),
          },
        }
      )
    }
  } catch (error) {
    console.error('Rate limiting error:', error)
  }

  return null
}