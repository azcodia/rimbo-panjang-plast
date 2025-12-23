import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getUserIdFromReq } from "@/lib/auth";
import {
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentsByDelivery,
} from "./payment.services";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    getUserIdFromReq(req);

    const { searchParams } = new URL(req.url);
    const deliveryId = searchParams.get("deliveryId");

    if (!deliveryId) {
      return NextResponse.json(
        { success: false, message: "deliveryId is required" },
        { status: 400 }
      );
    }

    const result = await getPaymentsByDelivery(deliveryId);

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

    const { delivery_id, bank_id, amount, note, input_date, status } =
      await req.json();

    if (!delivery_id || !bank_id || !amount)
      throw new Error("delivery_id, bank_id and amount are required");

    const payment = await createPayment({
      delivery_id,
      bank_id,
      amount,
      note,
      input_date,
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
