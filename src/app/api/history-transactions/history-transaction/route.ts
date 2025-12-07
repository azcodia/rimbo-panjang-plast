// file: app/api/history-transactions/route.ts
import { NextRequest, NextResponse } from "next/server";
import HistoryTransactionModel from "@/models/History-Transaction";
import dbConnect from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authorization header missing" },
        { status: 401 }
      );
    }
    try {
      verifyToken(authHeader.replace("Bearer ", ""));
    } catch (err: any) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const typeFilter = searchParams.get("type") || "";
    const noteFilter = searchParams.get("note") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const skip = (page - 1) * pageSize;

    const query: any = { deleted: { $ne: true } };
    if (typeFilter) query.type = typeFilter;
    if (noteFilter) query.note = { $regex: noteFilter, $options: "i" };

    const total = await HistoryTransactionModel.countDocuments(query);
    const transactions = await HistoryTransactionModel.find(query)
      .populate("color_id")
      .populate("size_id")
      .populate("heavy_id")
      .populate("user_id")
      .skip(skip)
      .limit(pageSize)
      .sort({ created_at: -1 });

    return NextResponse.json({ success: true, total, data: transactions });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authorization header missing" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    let userId: string;
    try {
      userId = verifyToken(token);
    } catch (err: any) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 401 }
      );
    }

    const {
      stock_id,
      color_id,
      size_id,
      heavy_id,
      type,
      quantity,
      note,
      description,
    } = await req.json();

    // Validasi semua fields
    if (
      !stock_id ||
      !color_id ||
      !size_id ||
      !heavy_id ||
      !type ||
      quantity == null ||
      !note
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Convert ke ObjectId
    const transaction = await HistoryTransactionModel.create({
      stock_id: new mongoose.Types.ObjectId(stock_id),
      color_id: new mongoose.Types.ObjectId(color_id),
      size_id: new mongoose.Types.ObjectId(size_id),
      heavy_id: new mongoose.Types.ObjectId(heavy_id),
      type,
      quantity,
      note,
      description,
      user_id: new mongoose.Types.ObjectId(userId),
    });

    return NextResponse.json({ success: true, data: transaction });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authorization header missing" },
        { status: 401 }
      );
    }
    const token = authHeader.replace("Bearer ", "");
    let userId: string;
    try {
      userId = verifyToken(token);
    } catch (err: any) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    const {
      stock_id,
      color_id,
      size_id,
      heavy_id,
      type,
      quantity,
      note,
      description,
    } = await req.json();

    if (
      !stock_id ||
      !color_id ||
      !size_id ||
      !heavy_id ||
      !type ||
      quantity == null ||
      !note
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const updated = await HistoryTransactionModel.findByIdAndUpdate(
      id,
      {
        stock_id: new mongoose.Types.ObjectId(stock_id),
        color_id: new mongoose.Types.ObjectId(color_id),
        size_id: new mongoose.Types.ObjectId(size_id),
        heavy_id: new mongoose.Types.ObjectId(heavy_id),
        type,
        quantity,
        note,
        description,
        user_id: new mongoose.Types.ObjectId(userId),
        created_at: new Date(),
      },
      { new: true }
    )
      .populate("color_id")
      .populate("size_id")
      .populate("heavy_id")
      .populate("user_id");

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  try {
    // 🔒 verifikasi token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authorization header missing" },
        { status: 401 }
      );
    }
    try {
      verifyToken(authHeader.replace("Bearer ", ""));
    } catch (err: any) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 401 }
      );
    }

    const body = await req.json();
    const stock_id = body.stock_id;
    if (!stock_id) {
      return NextResponse.json(
        { success: false, message: "stock_id is required" },
        { status: 400 }
      );
    }

    const result = await HistoryTransactionModel.updateMany(
      { stock_id },
      { $set: { deleted: true } }
    );

    return NextResponse.json({
      success: true,
      message: "Soft delete success",
      data: result,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
