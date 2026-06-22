import { NextResponse } from "next/server";
import { getSiteData, saveSiteData } from "@/lib/site-data";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const data = await getSiteData();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    await saveSiteData(body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
