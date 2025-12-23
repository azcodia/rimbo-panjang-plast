import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getUserIdFromReq } from "@/lib/auth";
import {
  createPayment,
  getPayments,
  updatePayment,
  deletePayment,
} from "./payment.services";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    getUserIdFromReq(req);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const skip = (page - 1) * pageSize;

    const delivery_id = searchParams.get("delivery_id");

    const query: any = {};
    if (delivery_id) query.delivery_id = delivery_id;

    const result = await getPayments(query, skip, pageSize);

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    getUserIdFromReq(req);

    const { delivery_id, bank_id, amount, note, status } = await req.json();

    if (!delivery_id || !bank_id || !amount)
      throw new Error("delivery_id, bank_id and amount are required");

    const payment = await createPayment({
      delivery_id,
      bank_id,
      amount,
      note,
      status,
    });

    return NextResponse.json({ success: true, data: payment });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  try {
    getUserIdFromReq(req);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) throw new Error("ID is required");

    const { bank_id, amount, note, status } = await req.json();

    const updated = await updatePayment(id, {
      bank_id,
      amount,
      note,
      status,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  try {
    getUserIdFromReq(req);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) throw new Error("ID is required");

    const deleted = await deletePayment(id);

    return NextResponse.json({ success: true, data: deleted });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 400 }
    );
  }
}
