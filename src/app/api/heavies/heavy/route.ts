import { NextRequest, NextResponse } from "next/server";
import HeavyModel from "@/models/Heavy";
import dbConnect from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.max(
      1,
      parseInt(searchParams.get("pageSize") || "10", 10)
    );
    const skip = (page - 1) * pageSize;

    const query: any = {};

    if (filter) {
      query.$expr = {
        $regexMatch: {
          input: { $toString: "$weight" },
          regex: filter,
          options: "i",
        },
      };
    }

    const total = await HeavyModel.countDocuments(query);
    const heavies = await HeavyModel.find(query)
      .skip(skip)
      .limit(pageSize)
      .sort({ created_at: -1 });

    return NextResponse.json({
      success: true,
      total,
      data: heavies,
    });
  } catch (err) {
    console.error("GET /api/heavies/heavy error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { weight } = await req.json();

    if (weight === undefined || weight === null) {
      return NextResponse.json(
        { success: false, message: "Weight is required" },
        { status: 400 }
      );
    }

    const exists = await HeavyModel.findOne({ weight });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Weight already exists" },
        { status: 400 }
      );
    }

    const newHeavy = await HeavyModel.create({ weight });

    return NextResponse.json({ success: true, data: newHeavy });
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

    await HeavyModel.findByIdAndDelete(id);

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
    const { weight } = await req.json();

    if (!id || weight === undefined || weight === null) {
      return NextResponse.json(
        { success: false, message: "ID and weight are required" },
        { status: 400 }
      );
    }

    const exists = await HeavyModel.findOne({ weight, _id: { $ne: id } });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Weight already exists" },
        { status: 400 }
      );
    }

    const updated = await HeavyModel.findByIdAndUpdate(
      id,
      { weight, updated_at: new Date() },
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
