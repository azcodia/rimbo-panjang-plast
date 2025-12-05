import { NextRequest, NextResponse } from "next/server";
import ColorModel from "@/models/Color";
import dbConnect from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    const skip = (page - 1) * pageSize;

    const query: any = {};
    if (filter) query.color = { $regex: filter, $options: "i" };

    const total = await ColorModel.countDocuments(query);
    const colors = await ColorModel.find(query)
      .skip(skip)
      .limit(pageSize)
      .sort({ created_at: -1 });

    return NextResponse.json({
      success: true,
      total,
      data: colors,
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
    const { color } = await req.json();

    if (!color) {
      return NextResponse.json(
        { success: false, message: "Color is required" },
        { status: 400 }
      );
    }

    const exists = await ColorModel.findOne({ color });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Color already exists" },
        { status: 400 }
      );
    }

    const newColor = await ColorModel.create({ color });

    return NextResponse.json({ success: true, data: newColor });
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

    await ColorModel.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
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
    const { color } = await req.json();

    if (!id || !color) {
      return NextResponse.json(
        { success: false, message: "ID and color are required" },
        { status: 400 }
      );
    }

    const exists = await ColorModel.findOne({ color, _id: { $ne: id } });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Color already exists" },
        { status: 400 }
      );
    }

    const updated = await ColorModel.findByIdAndUpdate(
      id,
      { color },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
