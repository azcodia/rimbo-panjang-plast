import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getUserIdFromReq } from "@/lib/auth";
import {
  createStock,
  deleteStock as deleteStockController,
  getStocks,
  updateStock as updateStockController,
  updateStockQuantity,
} from "./stock.services";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "";
    const color_id = searchParams.get("color_id") || "";
    const size_id = searchParams.get("size_id") || "";
    const heavy_id = searchParams.get("heavy_id") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const skip = (page - 1) * pageSize;

    const query: any = {};
    if (filter)
      query.$or = [
        { quantity: { $regex: filter, $options: "i" } },
        { tokenHistory: { $regex: filter, $options: "i" } },
      ];
    if (color_id) query.color_id = color_id;
    if (size_id) query.size_id = size_id;
    if (heavy_id) query.heavy_id = heavy_id;

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
    getUserIdFromReq(req); // login required

    const { color_id, size_id, heavy_id, quantity, input_date, tokenHistory } =
      await req.json();

    if (!color_id || !size_id || !heavy_id || quantity == null || !tokenHistory)
      throw new Error("All fields are required");

    const newStock = await createStock(
      color_id,
      size_id,
      heavy_id,
      quantity,
      input_date ? new Date(input_date) : undefined,
      tokenHistory
    );

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
    getUserIdFromReq(req); // login required
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { color_id, size_id, heavy_id, quantity, input_date, tokenHistory } =
      await req.json();

    if (
      !id ||
      !color_id ||
      !size_id ||
      !heavy_id ||
      quantity == null ||
      !tokenHistory
    )
      throw new Error("All fields are required");

    const updated = await updateStockController(
      id,
      color_id,
      size_id,
      heavy_id,
      quantity,
      input_date ? new Date(input_date) : undefined,
      tokenHistory
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
    getUserIdFromReq(req); // login required
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

export async function PATCH(req: NextRequest) {
  await dbConnect();
  try {
    getUserIdFromReq(req); // login required

    const { stock_id, quantityChange } = await req.json();
    if (!stock_id) throw new Error("stock_id is required");

    const updatedStock = await updateStockQuantity(
      stock_id,
      Number(quantityChange)
    );
    return NextResponse.json({ success: true, data: updatedStock });
  } catch (err: any) {
    console.error(err);
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
