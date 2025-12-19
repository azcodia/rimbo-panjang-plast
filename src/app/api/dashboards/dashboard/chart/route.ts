import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getUserIdFromReq } from "@/lib/auth";
import { getChartData } from "./chart.services";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    getUserIdFromReq(req);

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    const data = await getChartData(startDate, endDate);

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
