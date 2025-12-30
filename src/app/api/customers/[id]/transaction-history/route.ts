import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getCustomerTransactions } from "./customerTransaction.services";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  const { id: customerId } = await params;

  if (!customerId) {
    return NextResponse.json(
      { success: false, message: "Invalid customerId" },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start_date");
  const end = searchParams.get("end_date");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const skip = (page - 1) * pageSize;

  try {
    const result = await getCustomerTransactions({
      customerId,
      startDate: start,
      endDate: end,
      skip,
      limit: pageSize,
    });

    return NextResponse.json({
      success: true,
      ...result,
      page,
      pageSize,
      totalPages: Math.ceil(result.total / pageSize),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
