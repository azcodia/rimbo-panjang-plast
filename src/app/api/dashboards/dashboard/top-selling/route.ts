import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getTopSellingItems } from "./top-selling.services";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const limit = parseInt(searchParams.get("limit") || "5", 10);

    const result = await getTopSellingItems({
      startDate,
      endDate,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result,
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
