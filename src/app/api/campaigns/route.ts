// src/app/api/campaigns/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { campaigns } from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const allCampaigns = await db.select().from(campaigns);
    return NextResponse.json(allCampaigns);
  } catch (error) {
    console.error('Failed to fetch campaigns:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}