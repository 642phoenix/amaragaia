import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const prod = await db.collection("products").findOne({ _id: new ObjectId(params.id) });
    if (!prod) return NextResponse.json({ error: "Not found" }, { status: 404 });
    // convert to client format
    const sanitized = { ...prod, id: prod._id.toString() };
    return NextResponse.json(sanitized);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db();
    const result = await db
      .collection("products")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: body });
    if (result.matchedCount === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(params.id) });
    if (result.deletedCount === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to delete product" }, { status: 500 });
  }
}