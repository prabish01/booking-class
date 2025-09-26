import { NextResponse } from "next/server";
import { strapiAPI } from "@/lib/strapi";

export async function GET() {
  try {
    const result = await strapiAPI.getAllUpcomingClassOccurrences();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Classes API error:", error);
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}
