import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getUserIdFromReq } from "@/lib/auth";
import {
  createColor,
  deleteColor,
  getColors,
  updateColor,
} from "./color.controller";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    getUserIdFromReq(req);

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const skip = (page - 1) * pageSize;

    const query: any = {};
    if (filter) query.color = { $regex: filter, $options: "i" };

    const result = await getColors(query, skip, pageSize);
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: err.message.includes("Authorization") ? 401 : 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    getUserIdFromReq(req);

    const { color } = await req.json();
    if (!color) throw new Error("Color is required");

    const newColor = await createColor(color);
    return NextResponse.json({ success: true, data: newColor });
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
    getUserIdFromReq(req);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { color } = await req.json();
    if (!id || !color) throw new Error("ID and color are required");

    const updated = await updateColor(id, color);
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
    getUserIdFromReq(req);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) throw new Error("ID is required");

    const deleted = await deleteColor(id);
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
