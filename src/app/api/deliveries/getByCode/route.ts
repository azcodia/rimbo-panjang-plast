import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getDeliveryItemsByCodePaginated } from "./deliveryByCode.services";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Code is required" },
        { status: 400 }
      );
    }

    const result = await getDeliveryItemsByCodePaginated(code, page, pageSize);

    return NextResponse.json({
      success: true,
      data: result.items,
      total: result.total,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
