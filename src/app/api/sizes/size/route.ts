import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getUserIdFromReq } from "@/lib/auth";
import {
  createSize,
  deleteSize,
  getSizes,
  updateSize,
} from "./size.controller";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    getUserIdFromReq(req);

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "";
    const color_id = searchParams.get("color_id");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const skip = (page - 1) * pageSize;

    const query: any = {};
    if (filter) query.size = { $regex: filter, $options: "i" };
    if (color_id) query.color_id = color_id;

    const result = await getSizes(query, skip, pageSize);
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      {
        status: ["Authorization header missing", "Invalid token"].includes(
          err.message
        )
          ? 401
          : 500,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    getUserIdFromReq(req);

    const { color_id, size } = await req.json();
    if (!color_id || size == null)
      throw new Error("Color and size are required");

    const newSize = await createSize(color_id, Number(size));
    return NextResponse.json({ success: true, data: newSize });
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

    const { id, color_id, size } = await req.json();
    if (!id || !color_id || size == null)
      throw new Error("ID, color, and size are required");

    const updated = await updateSize(id, color_id, Number(size));
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

    const deleted = await deleteSize(id);
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
