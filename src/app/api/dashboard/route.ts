// src/app/api/dashboard/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { leads, campaigns } from '@/db/schema';
import { desc, sql, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const totalLeads = await db.select({ count: sql<number>`count(*)` }).from(leads);
    const totalCampaigns = await db.select({ count: sql<number>`count(*)` }).from(campaigns);

    // Join leads and campaigns tables to get campaign name
    const recentLeads = await db
      .select({
        id: leads.id,
        name: leads.name,
        company: leads.company,
        status: leads.status,
        lastContactDate: leads.lastContactDate,
        interactionHistory: leads.interactionHistory,
        campaign: {
          name: campaigns.name,
        },
      })
      .from(leads)
      .innerJoin(campaigns, eq(leads.campaignId, campaigns.id))
      .orderBy(desc(leads.id))
      .limit(5);

    const recentCampaigns = await db.select().from(campaigns).orderBy(desc(campaigns.id)).limit(5);

    return NextResponse.json({
      totalLeads: totalLeads[0].count,
      totalCampaigns: totalCampaigns[0].count,
      recentLeads,
      recentCampaigns,
    });
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}