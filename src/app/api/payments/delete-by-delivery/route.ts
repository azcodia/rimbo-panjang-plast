import { getUserIdFromReq } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Delivery from "@/models/Delivery";
import { NextRequest, NextResponse } from "next/server";
import { deletePaymentsByDeliveryId } from "./delete-by-delivery.services";

export async function DELETE(req: NextRequest) {
  await dbConnect();
  try {
    getUserIdFromReq(req);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) throw new Error("ID is required");

    const deleted = await Delivery.findByIdAndDelete(id);

    await deletePaymentsByDeliveryId(id);

    return NextResponse.json({ success: true, data: deleted });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 400 }
    );
  }
}
