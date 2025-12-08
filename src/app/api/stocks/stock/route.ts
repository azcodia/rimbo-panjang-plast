import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getUserIdFromReq } from "@/lib/auth";
import {
  createStock,
  deleteStock as deleteStockController,
  getStocks,
  updateStock as updateStockController,
} from "./stock.controller";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const colorFilter = searchParams.get("color") || "";
    const sizeFilter = searchParams.get("size") || "";
    const heavyFilter = searchParams.get("heavy") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const skip = (page - 1) * pageSize;

    const query: any = {};
    if (colorFilter) query.color_id = colorFilter;
    if (sizeFilter) query.size_id = sizeFilter;
    if (heavyFilter) query.heavy_id = heavyFilter;

    const result = await getStocks(query, skip, pageSize);
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
    const userId = getUserIdFromReq(req); // 🔒login required
    const { color_id, size_id, heavy_id, quantity } = await req.json();

    if (!color_id || !size_id || !heavy_id || quantity == null)
      throw new Error("All fields are required");

    const newStock = await createStock(color_id, size_id, heavy_id, quantity);
    return NextResponse.json({ success: true, data: newStock });
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
    const userId = getUserIdFromReq(req); // login required
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { color_id, size_id, heavy_id, quantity } = await req.json();

    if (!id || !color_id || !size_id || !heavy_id || quantity == null)
      throw new Error("All fields are required");

    const updated = await updateStockController(
      id,
      color_id,
      size_id,
      heavy_id,
      quantity
    );
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
    const userId = getUserIdFromReq(req); // 🔒 login required
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) throw new Error("ID is required");

    const deleted = await deleteStockController(id);
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
