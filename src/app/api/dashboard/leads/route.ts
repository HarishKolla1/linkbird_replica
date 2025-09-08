import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { leads, campaigns } from "@/db/schema";
import { sql, desc, asc } from "drizzle-orm";

// Helper to capitalize each word
function capitalizeWords(str: string) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "0");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = page * limit;

    const sortBy = url.searchParams.get("sortBy") || "lastContactDate";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";

    // Map sortBy -> DB column
    let orderColumn: any;
    switch (sortBy) {
      case "name":
        orderColumn = leads.name;
        break;
      case "campaign":
        orderColumn = campaigns.name;
        break;
      case "status":
        // We don’t store status directly, fallback to lastContactDate
        orderColumn = leads.lastContactDate;
        break;
      default:
        orderColumn = leads.lastContactDate;
    }

    const orderDirection = sortOrder === "asc" ? asc(orderColumn) : desc(orderColumn);

    // Fetch leads with joined campaign
    const rawLeads = await db
      .select({
        id: leads.id,
        name: leads.name,
        company: leads.company,
        campaignName: campaigns.name,
        interactionHistory: leads.interactionHistory,
        lastContactDate: leads.lastContactDate,
      })
      .from(leads)
      .leftJoin(campaigns, sql`${leads.campaignId} = ${campaigns.id}`)
      .orderBy(orderDirection)
      .limit(limit)
      .offset(offset);

    // Transform data
    const recentLeads = rawLeads.map((lead) => {
      const interactions: string[] = Array.isArray(lead.interactionHistory)
        ? lead.interactionHistory
        : [];

      const lastInteraction = interactions[interactions.length - 1] || null;

      let displayStatus = "No Status";

      if (lastInteraction) {
        const normalized = lastInteraction.toLowerCase().trim();

        if (normalized === "follow up" || normalized === "sent") {
          if (lead.lastContactDate) {
            const now = new Date();
            const lastDate = new Date(lead.lastContactDate);
            const diffInMinutes = Math.round(
              (now.getTime() - lastDate.getTime()) / (1000 * 60)
            );
            displayStatus = `${capitalizeWords(
              lastInteraction
            )} ${diffInMinutes} mins ago`;
          } else {
            displayStatus = capitalizeWords(lastInteraction);
          }
        } else if (["pending approval", "do not contact"].includes(normalized)) {
          displayStatus = capitalizeWords(lastInteraction);
        } else {
          displayStatus = capitalizeWords(lastInteraction);
        }
      }

      return {
        id: lead.id,
        name: lead.name,
        company: lead.company,
        campaign: { name: lead.campaignName },
        status: displayStatus,
      };
    });

    // Count total leads
    const totalLeadsResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(leads);
    const totalLeads = totalLeadsResult[0]?.count || 0;

    return NextResponse.json({
      totalLeads,
      recentLeads,
    });
  } catch (error) {
    console.error("Failed to fetch leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
