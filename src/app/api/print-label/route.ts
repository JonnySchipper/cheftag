import { NextRequest, NextResponse } from "next/server";

const DEFAULT_BASE = "http://cheftag-pi.local:8000";

export async function POST(req: NextRequest) {
  const base = process.env.CHEFTAG_PRINT_SERVER_URL ?? DEFAULT_BASE;
  const url = `${base.replace(/\/$/, "")}/print-label`;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let data: unknown = null;
    if (text) {
      try {
        data = JSON.parse(text) as unknown;
      } catch {
        data = { message: text };
      }
    }

    return NextResponse.json(data ?? {}, { status: res.status });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Print server unreachable";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
