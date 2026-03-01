import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
export const runtime = "nodejs";

// Simple placeholder; you can expand into full CRUD later
export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const orders = await db.collection("orders").find({}).toArray();
    const sanitized = orders.map(o => ({ ...o, id: o._id.toString() }));
    return NextResponse.json(sanitized);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection("orders").insertOne(body);
    const inserted = { ...body, id: result.insertedId.toString() };
    return NextResponse.json(inserted, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to create order" }, { status: 500 });
  }
}