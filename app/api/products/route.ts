import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    console.log("Fetching products from MongoDB...", db);

    const products = await db.collection("products").find({}).toArray();

    // convert ObjectId to id string for clients
    const sanitized = products.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toString(),
    }));

    return NextResponse.json(sanitized);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unable to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db();

    // ✅ FIX: insert into products collection
    const result = await db.collection("products").insertOne(body);

    const inserted = {
      ...body,
      id: result.insertedId.toString(),
    };

    return NextResponse.json(inserted, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unable to create product" },
      { status: 500 }
    );
  }
}


/*import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    console.log("Fetching products from MongoDB...", db);
    const products = await db.collection("products").find({}).toArray();
    // convert ObjectId to id string for clients
    const sanitized = products.map(p => ({
      ...p,
      id: p._id.toString(),
    }));
    return NextResponse.json(sanitized);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection("user-data").insertOne(body);
    const inserted = { ...body, id: result.insertedId.toString() };
    return NextResponse.json(inserted, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to create product" }, { status: 500 });
  }
}*/