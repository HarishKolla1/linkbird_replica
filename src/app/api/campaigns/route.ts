import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { campaigns } from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);

    const allCampaigns = await db
      .select()
      .from(campaigns)
      .limit(pageSize)
      .offset(page * pageSize);

    // Check if there are more campaigns to fetch
    const totalCountResult = await db.select({ count: sql<number>`count(*)` }).from(campaigns);
    const totalCount = totalCountResult[0].count;
    const hasNextPage = (page + 1) * pageSize < totalCount;

    return NextResponse.json({
      data: allCampaigns,
      hasNextPage,
    });
  } catch (error) {
    console.error('Failed to fetch campaigns:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}
