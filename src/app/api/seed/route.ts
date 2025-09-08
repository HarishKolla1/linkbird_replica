// src/app/api/seed/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { campaigns, leads } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { campaignStatusEnum, leadStatusEnum } from '@/db/schema';

export async function POST() {
  try {
    console.log("Seeding database...");

    // Delete existing data to prevent duplicates
    await db.execute(sql`DELETE FROM ${leads}`);
    await db.execute(sql`DELETE FROM ${campaigns}`);
    
    // Define static campaigns data with explicit enum types
    const staticCampaigns = [
      { 
        name: "Summer Sale 2024", 
        status: "Active" as typeof campaignStatusEnum.enumValues[number], 
        totalLeads: 50, 
        successfulLeads: 10, 
        responseRate: 20, 
        userId: "user_1" 
      },
      { 
        name: "Q3 Outreach", 
        status: "Paused" as typeof campaignStatusEnum.enumValues[number], 
        totalLeads: 150, 
        successfulLeads: 25, 
        responseRate: 16, 
        userId: "user_1" 
      },
      { 
        name: "Winter Webinar", 
        status: "Draft" as typeof campaignStatusEnum.enumValues[number], 
        totalLeads: 0, 
        successfulLeads: 0, 
        responseRate: 0, 
        userId: "user_1" 
      },
    ];

    // Insert campaigns and get the returned IDs
    const insertedCampaigns = await db.insert(campaigns)
      .values(staticCampaigns)
      .returning();
    
    const summerSaleId = insertedCampaigns.find(c => c.name === "Summer Sale 2024")?.id;
    const q3OutreachId = insertedCampaigns.find(c => c.name === "Q3 Outreach")?.id;

    // Define static leads data with explicit enum types
    const staticLeads = [
      { 
        name: "John Doe", 
        email: "john@example.com", 
        company: "ABC Corp", 
        campaignId: summerSaleId!, 
        status: "Responded" as typeof leadStatusEnum.enumValues[number] 
      },
      { 
        name: "Jane Smith", 
        email: "jane@example.com", 
        company: "XYZ Ltd", 
        campaignId: summerSaleId!, 
        status: "Pending" as typeof leadStatusEnum.enumValues[number] 
      },
      { 
        name: "Peter Jones", 
        email: "peter@example.com", 
        company: "Tech Solutions", 
        campaignId: q3OutreachId!, 
        status: "Contacted" as typeof leadStatusEnum.enumValues[number] 
      },
      { 
        name: "Mary Brown", 
        email: "mary@example.com", 
        company: "Innovate Inc.", 
        campaignId: q3OutreachId!, 
        status: "Converted" as typeof leadStatusEnum.enumValues[number] 
      },
    ];

    // Insert leads
    await db.insert(leads)
      .values(staticLeads);
    
    console.log("Database seeded successfully. 🎉");
    return NextResponse.json({ message: "Database seeded successfully!" });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}