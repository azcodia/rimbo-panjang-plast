import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getUserIdFromReq } from "@/lib/auth";
import { getStockAlert } from "./stockAlertService";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    getUserIdFromReq(req);

    const { searchParams } = new URL(req.url);
    const threshold = Number(searchParams.get("threshold"));

    const data = await getStockAlert({ threshold });

    return NextResponse.json({
      success: true,
      data,
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
