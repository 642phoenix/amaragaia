import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;

    // ✅ MUST explicitly select DB
    const db = client.db();
    const collection = db.collection("products");

    const products = await collection.find({}).toArray();

    const sanitized = products.map(p => ({
      ...p,
      id: p._id.toString(),
    }));

    return NextResponse.json(sanitized);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Unable to fetch products" },
      { status: 500 }
    );
  }
}