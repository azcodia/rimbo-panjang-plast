import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import {
  createHistoryTransaction,
  getHistoryTransactions,
  softDeleteHistoryTransaction,
  updateHistoryTransactionByToken,
} from "@/app/api/history-transactions/history-transaction/history.services";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader)
      return NextResponse.json(
        { success: false, message: "Authorization header missing" },
        { status: 401 }
      );

    verifyToken(authHeader.replace("Bearer ", ""));

    const { searchParams } = new URL(req.url);
    const typeFilter = searchParams.get("type") || "";
    const noteFilter = searchParams.get("note") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const skip = (page - 1) * pageSize;

    const query: any = { deleted: { $ne: true } };
    if (typeFilter) query.type = typeFilter;
    if (noteFilter) query.note = { $regex: noteFilter, $options: "i" };

    const result = await getHistoryTransactions(query, skip, pageSize);
    return NextResponse.json({ success: true, ...result });
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
    if (!authHeader)
      return NextResponse.json(
        { success: false, message: "Authorization header missing" },
        { status: 401 }
      );

    const token = authHeader.replace("Bearer ", "");
    const userId = verifyToken(token);

    const body = await req.json();

    if (
      !body.stock_id ||
      !body.color_id ||
      !body.size_id ||
      !body.heavy_id ||
      !body.type ||
      body.quantity == null ||
      !body.note ||
      !body.tokenHistory
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (body.type === "out" && body.unit_price == null) {
      return NextResponse.json(
        {
          success: false,
          message: "unit_price is required for out transaction",
        },
        { status: 400 }
      );
    }

    const transaction = await createHistoryTransaction({
      ...body,
      user_id: userId,
      input_date: body.input_date ? new Date(body.input_date) : new Date(),
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
    if (!authHeader)
      return NextResponse.json(
        { success: false, message: "Authorization header missing" },
        { status: 401 }
      );

    const token = authHeader.replace("Bearer ", "");
    const userId = verifyToken(token);

    const { searchParams } = new URL(req.url);
    const tokenHistory = searchParams.get("tokenHistory");
    const body = await req.json();

    if (!tokenHistory) {
      return NextResponse.json(
        { success: false, message: "tokenHistory is required" },
        { status: 400 }
      );
    }

    const updated = await updateHistoryTransactionByToken(tokenHistory, {
      ...body,
      user_id: userId,
      input_date: body.input_date ? new Date(body.input_date) : undefined,
    });

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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader)
      return NextResponse.json(
        { success: false, message: "Authorization header missing" },
        { status: 401 }
      );

    verifyToken(authHeader.replace("Bearer ", ""));

    const body = await req.json();
    const { tokenHistory, note } = body;

    if (!tokenHistory) {
      return NextResponse.json(
        { success: false, message: "tokenHistory is required" },
        { status: 400 }
      );
    }

    const result = await softDeleteHistoryTransaction(tokenHistory, note);

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
