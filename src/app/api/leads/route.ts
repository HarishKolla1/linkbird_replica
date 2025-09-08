// src/app/api/leads/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle'; // Your Drizzle DB instance
import { leads, campaigns } from '@/db/schema'; // Your Drizzle schema
import { sql, asc } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const limit = 20; // Number of leads per page
    const offset = page * limit;

    const allLeads = await db.select()
      .from(leads)
      .leftJoin(campaigns, sql`${leads.campaignId} = ${campaigns.id}`)
      .limit(limit)
      .offset(offset)
      .orderBy(asc(leads.name));

    return NextResponse.json(allLeads);
  } catch (error) {
    console.error('Failed to fetch leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}