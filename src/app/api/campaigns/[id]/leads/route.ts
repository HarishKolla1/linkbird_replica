import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { leads, campaigns } from '@/db/schema';
import { sql, asc } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const campaignId = Number(params.id);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const limit = 20;
    const offset = page * limit;

    const campaignLeads = await db.select()
      .from(leads)
      .leftJoin(campaigns, sql`${leads.campaignId} = ${campaigns.id}`)
      .where(sql`${leads.campaignId} = ${campaignId}`)
      .limit(limit)
      .offset(offset)
      .orderBy(asc(leads.name));

    return NextResponse.json(campaignLeads);
  } catch (error) {
    console.error('Failed to fetch campaign leads:', error);
    return NextResponse.json({ error: 'Failed to fetch campaign leads' }, { status: 500 });
  }
}
