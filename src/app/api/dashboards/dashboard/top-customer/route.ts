import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import {
  getAllCustomersWithWeight,
  getTopCustomersByWeight,
} from "./top-customer.services";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    const result = await getAllCustomersWithWeight({ page, pageSize });

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
