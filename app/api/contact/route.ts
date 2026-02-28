import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    // Call the Magicloops loop with POST and JSON body
    const payload = {
      name,
      email,
      message,
    };

    const res = await fetch(
      `https://magicloops.dev/api/loop/run/e19ff238-f2f8-4df1-8aea-39e5fecce9e4`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json({ error }, { status: 500 });
    }

    const result = await res.json();
    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
