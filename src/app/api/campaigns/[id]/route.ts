// src/app/api/campaigns/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { campaigns } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = parseInt(params.id);

    if (isNaN(campaignId)) {
      return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 });
    }

    const campaign = await db.select().from(campaigns).where(eq(campaigns.id, campaignId));

    if (campaign.length === 0) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json(campaign[0]);
  } catch (error) {
    console.error('Failed to fetch campaign:', error);
    return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 });
  }
}