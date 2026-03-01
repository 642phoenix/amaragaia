import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
console.log("Connecting to MongoDB...");  
export const runtime = "nodejs";

export async function GET() {
  try {
    const client = await clientPromise;

    // 🔑 MUST MATCH ATLAS EXACTLY
    const db = client.db();
    const collection = db.collection("products");

    const products = await collection.find({}).toArray();

    return NextResponse.json(
      products.map(p => ({
        ...p,
        id: p._id.toString(),
      }))
    );
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Unable to fetch products" },
      { status: 500 }
    );
  }
}