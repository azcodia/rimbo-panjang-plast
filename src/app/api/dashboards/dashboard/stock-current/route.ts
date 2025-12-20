import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getCurrentStock } from "./stock-current.services";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const color_id = searchParams.get("color_id") || "";
    const size_id = searchParams.get("size_id") || "";
    const heavy_id = searchParams.get("heavy_id") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const skip = (page - 1) * pageSize;

    const query: any = { quantity: { $gt: 0 } };
    if (color_id) query.color_id = color_id;
    if (size_id) query.size_id = size_id;
    if (heavy_id) query.heavy_id = heavy_id;

    const result = await getCurrentStock(query, skip, pageSize);
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
