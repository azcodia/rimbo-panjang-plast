import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getDashboardRestocks } from "./recent-restock.services";

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start_date");
  const end = searchParams.get("end_date");

  try {
    const result = await getDashboardRestocks({
      startDate: start,
      endDate: end,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Server error",
      },
      { status: 500 }
    );
  }
}
