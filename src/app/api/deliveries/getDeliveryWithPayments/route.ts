import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getDeliveryWithPayments } from "./getDeliveryWithPayments.services";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const deliveryId = searchParams.get("deliveryId");

    if (!deliveryId) {
      return NextResponse.json(
        { success: false, message: "Code is required" },
        { status: 400 }
      );
    }

    const deliveryData = await getDeliveryWithPayments(deliveryId);

    if (!deliveryData) {
      return NextResponse.json(
        { success: false, message: "Delivery not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deliveryData });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
