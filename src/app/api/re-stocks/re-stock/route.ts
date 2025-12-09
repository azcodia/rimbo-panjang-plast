import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getUserIdFromReq } from "@/lib/auth";
import {
  createReStock,
  deleteReStock as deleteReStockController,
  getReStocks,
  updateReStock as updateReStockController,
} from "./restock.services";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const skip = (page - 1) * pageSize;

    const result = await getReStocks({}, skip, pageSize);
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
    const user_id = getUserIdFromReq(req); // login required
    const { code, note, description, items } = await req.json();

    if (!code || !items || !Array.isArray(items) || items.length === 0)
      throw new Error("Code and items are required");

    const newReStock = await createReStock({
      code,
      user_id,
      note,
      description,
      items,
    });

    return NextResponse.json({ success: true, data: newReStock });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      {
        status: ["Authorization header missing", "Invalid token"].includes(
          err.message
        )
          ? 401
          : 400,
      }
    );
  }
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  try {
    const user_id = getUserIdFromReq(req); // login required
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { code, note, description, items } = await req.json();

    if (!id || !code || !items || !Array.isArray(items) || items.length === 0)
      throw new Error("All fields are required");

    const updated = await updateReStockController(id, {
      code,
      user_id,
      note,
      description,
      items,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      {
        status: ["Authorization header missing", "Invalid token"].includes(
          err.message
        )
          ? 401
          : 400,
      }
    );
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  try {
    getUserIdFromReq(req); // login required
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) throw new Error("ID is required");

    const deleted = await deleteReStockController(id);
    return NextResponse.json({ success: true, data: deleted });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      {
        status: ["Authorization header missing", "Invalid token"].includes(
          err.message
        )
          ? 401
          : 400,
      }
    );
  }
}
