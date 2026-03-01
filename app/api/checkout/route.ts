import { NextResponse } from "next/server";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch("https://magicloops.dev/api/loop/run/41008c0c-0a9e-4355-8e36-4d2cd74484b1?input=", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MAGICLOOPS_API_KEY}`,
      },
      body: JSON.stringify({
        to: "danialavegana@gmail.com",
        subject: "New Order – Amar a Gaia",
        html: `
          <h2>New Order 🌱</h2>
          <p><strong>Name:</strong> ${body.name}</p>
          <p><strong>Contact:</strong> ${body.contact}</p>
          <pre>${body.items}</pre>
          <p><strong>Total:</strong> $${body.total}</p>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json({ error }, { status: 500 });
    }
    console.log("Order sent:", body);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
