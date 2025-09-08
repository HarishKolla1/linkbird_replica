// src/app/api/campaigns/[id]/leads/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { leads, campaigns } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = parseInt(params.id);

    if (isNaN(campaignId)) {
      return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 });
    }

    const campaignLeads = await db.select()
      .from(leads)
      .leftJoin(campaigns, sql`${leads.campaignId} = ${campaigns.id}`)
      .where(eq(leads.campaignId, campaignId));

    return NextResponse.json(campaignLeads);
  } catch (error) {
    console.error('Failed to fetch campaign leads:', error);
    return NextResponse.json({ error: 'Failed to fetch campaign leads' }, { status: 500 });
  }
}