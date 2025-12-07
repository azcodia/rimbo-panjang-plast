import { NextRequest, NextResponse } from "next/server";
import ColorModel from "@/models/Color";
import SizeModel from "@/models/Size";
import HeavyModel from "@/models/Heavy";
import dbConnect from "@/lib/mongodb";
import Stock from "@/models/Stock";

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

    if (colorFilter) {
      const colors = await ColorModel.find({
        color: { $regex: colorFilter, $options: "i" },
      }).select("_id");
      query.color_id = { $in: colors.map((c) => c._id) };
    }

    if (sizeFilter) {
      const sizes = await SizeModel.find({
        size: parseFloat(sizeFilter),
      }).select("_id");
      query.size_id = { $in: sizes.map((s) => s._id) };
    }

    if (heavyFilter) {
      const heavies = await HeavyModel.find({
        weight: parseFloat(heavyFilter),
      }).select("_id");
      query.heavy_id = { $in: heavies.map((h) => h._id) };
    }

    const total = await Stock.countDocuments(query);

    const stocks = await Stock.find(query)
      .populate("color_id", "color") // hanya ambil field color
      .populate("size_id", "size") // hanya ambil field size
      .populate("heavy_id", "weight") // hanya ambil field weight
      .skip(skip)
      .limit(pageSize)
      .sort({ created_at: -1 });

    // Map ke format lebih jelas
    const mappedStocks = stocks.map((s) => ({
      id: s._id,
      color_id: s.color_id._id,
      color: s.color_id.color,
      size_id: s.size_id._id,
      size: s.size_id.size,
      heavy_id: s.heavy_id._id,
      heavy: s.heavy_id.weight,
      quantity: s.quantity,
      created_at: s.created_at,
    }));

    return NextResponse.json({
      success: true,
      total,
      data: mappedStocks,
    });
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
    const { color_id, size_id, heavy_id, quantity } = await req.json();

    if (!color_id || !size_id || !heavy_id || quantity == null) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const exists = await Stock.findOne({ color_id, size_id, heavy_id });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Stock already exists" },
        { status: 400 }
      );
    }

    const newStock = await Stock.create({
      color_id,
      size_id,
      heavy_id,
      quantity,
    });

    return NextResponse.json({ success: true, data: newStock });
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
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { color_id, size_id, heavy_id, quantity } = await req.json();

    if (!id || !color_id || !size_id || !heavy_id || quantity == null) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const exists = await Stock.findOne({
      color_id,
      size_id,
      heavy_id,
      _id: { $ne: id },
    });

    if (exists) {
      return NextResponse.json(
        { success: false, message: "Stock combination already exists" },
        { status: 400 }
      );
    }

    const updated = await Stock.findByIdAndUpdate(
      id,
      { color_id, size_id, heavy_id, quantity, updated_at: new Date() },
      { new: true }
    )
      .populate("color_id")
      .populate("size_id")
      .populate("heavy_id");

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
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    await Stock.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
