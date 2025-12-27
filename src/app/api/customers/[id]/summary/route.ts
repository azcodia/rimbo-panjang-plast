import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";
import { getCustomerSummary } from "./summary.services";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  const unwrappedParams = await params;
  const customerId = unwrappedParams.id;

  if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
    return NextResponse.json(
      { success: false, message: "Invalid customerId" },
      { status: 400 }
    );
  }

  try {
    const summary = await getCustomerSummary(customerId);

    if (!summary) {
      return NextResponse.json(
        { success: false, message: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: summary });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
