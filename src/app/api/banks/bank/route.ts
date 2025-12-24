import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getUserIdFromReq } from "@/lib/auth";
import { createBank, deleteBank, getBanks, updateBank } from "./bank.services";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    getUserIdFromReq(req);

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "";
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const skip = (page - 1) * pageSize;

    const query: any = {};
    if (filter) {
      query.name = { $regex: filter, $options: "i" };
    }

    if (type) {
      query.type = type;
    }

    const result = await getBanks(query, skip, pageSize);
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

    const { type, name, account_name, account_number, note } = await req.json();
    if (!type || !name) throw new Error("Type and name are required");

    const bank = await createBank({
      type,
      name,
      account_name,
      account_number,
      note,
    });

    return NextResponse.json({ success: true, data: bank });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  try {
    getUserIdFromReq(req);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) throw new Error("ID is required");

    const { type, name, account_name, account_number, note } = await req.json();

    if (!name) throw new Error("Name is required");

    const updated = await updateBank(id, {
      type,
      name,
      account_name,
      account_number,
      note,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 400 }
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

    const deleted = await deleteBank(id);
    return NextResponse.json({ success: true, data: deleted });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 400 }
    );
  }
}
