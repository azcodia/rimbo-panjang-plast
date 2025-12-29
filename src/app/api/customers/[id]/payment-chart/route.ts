import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";
import { getCustomerPaymentChart } from "./paymentChart.services";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  const { id: customerId } = await params;

  if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
    return NextResponse.json(
      { success: false, message: "Invalid customerId" },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start_date");
  const end = searchParams.get("end_date");

  try {
    const data = await getCustomerPaymentChart({
      customerId,
      startDate: start,
      endDate: end,
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
