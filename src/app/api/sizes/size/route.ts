import { NextRequest, NextResponse } from "next/server";
import SizeModel from "@/models/Size";
import dbConnect from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "";
    const color_id = searchParams.get("color_id");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const skip = (page - 1) * pageSize;

    const query: any = {};
    if (filter) query.size = { $regex: filter, $options: "i" };
    if (color_id) query.color_id = color_id;

    const total = await SizeModel.countDocuments(query);
    const sizes = await SizeModel.find(query)
      .skip(skip)
      .limit(pageSize)
      .sort({ created_at: -1 })
      .populate("color_id", "color");

    return NextResponse.json({ success: true, total, data: sizes });
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
    const { color_id, size } = await req.json();

    if (!color_id || !size) {
      return NextResponse.json(
        { success: false, message: "Color and size are required" },
        { status: 400 }
      );
    }

    const exists = await SizeModel.findOne({ color_id, size });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Size already exists for this color" },
        { status: 400 }
      );
    }

    const newSize = await SizeModel.create({ color_id, size });
    return NextResponse.json({ success: true, data: newSize });
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
    const { id, size, color_id } = await req.json();

    if (!id || !size || !color_id) {
      return NextResponse.json(
        { success: false, message: "ID, size, and color_id are required" },
        { status: 400 }
      );
    }

    const sizeNum = Number(size);
    if (isNaN(sizeNum) || sizeNum <= 0) {
      return NextResponse.json(
        { success: false, message: "Size must be a positive number" },
        { status: 400 }
      );
    }

    const updated = await SizeModel.findByIdAndUpdate(
      id,
      { size: sizeNum, color_id, updated_at: new Date() },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Size not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
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

    await SizeModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Size deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
