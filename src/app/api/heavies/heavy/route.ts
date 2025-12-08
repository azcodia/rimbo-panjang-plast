import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getUserIdFromReq } from "@/lib/auth";
import {
  createHeavy,
  deleteHeavy,
  getHeavies,
  updateHeavy,
} from "./heavy.controller";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    getUserIdFromReq(req);

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

    const result = await getHeavies(query, skip, pageSize);
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

    const { weight } = await req.json();
    if (weight === undefined || weight === null)
      throw new Error("Weight is required");

    const newHeavy = await createHeavy(Number(weight));
    return NextResponse.json({ success: true, data: newHeavy });
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
    const { weight } = await req.json();

    if (!id || weight === undefined || weight === null)
      throw new Error("ID and weight are required");

    const updated = await updateHeavy(id, Number(weight));
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

    const deleted = await deleteHeavy(id);
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
