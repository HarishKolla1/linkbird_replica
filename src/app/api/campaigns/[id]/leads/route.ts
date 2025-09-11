import { NextResponse } from 'next/server'
import { db } from '@/db/drizzle'
import { leads, campaigns } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)

    // Extract campaignId from URL path: /api/campaigns/[id]/leads
    const segments = url.pathname.split('/')
    const campaignId = Number(segments[segments.length - 2])

    if (isNaN(campaignId)) {
      return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 })
    }

    // Pagination
    const page = parseInt(url.searchParams.get('page') || '0')
    const limit = 20
    const offset = page * limit

    const campaignLeads = await db
      .select()
      .from(leads)
      .leftJoin(campaigns, eq(leads.campaignId, campaigns.id))
      .where(eq(leads.campaignId, campaignId))
      .limit(limit)
      .offset(offset)
      .orderBy(asc(leads.name))

    return NextResponse.json(campaignLeads)
  } catch (error) {
    console.error('Failed to fetch campaign leads:', error)
    return NextResponse.json({ error: 'Failed to fetch campaign leads' }, { status: 500 })
  }
}
