import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { campaigns } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "0");
    const status = url.searchParams.get("status") || "All";

    const limit = 20;
    const offset = page * limit;

    let allCampaigns;

    if (status === "All") {
      allCampaigns = await db
        .select()
        .from(campaigns)
        .limit(limit)
        .offset(offset);
    } else {
      allCampaigns = await db
        .select()
        .from(campaigns)
        .where(eq(campaigns.status, status as any))
        .limit(limit)
        .offset(offset);
    }

    return NextResponse.json(allCampaigns);
  } catch (error) {
    console.error("Failed to fetch campaigns:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}
