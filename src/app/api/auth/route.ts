import { NextResponse } from "next/server";
import {
  createSessionCookie,
  clearSessionCookie,
  getEditorPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
  const { password, action } = await request.json();

  if (action === "logout") {
    const response = NextResponse.json({ success: true });
    response.cookies.set(clearSessionCookie());
    return response;
  }

  if (password === getEditorPassword()) {
    const response = NextResponse.json({ success: true });
    response.cookies.set(createSessionCookie());
    return response;
  }

  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}

export async function GET(request: Request) {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const authenticated =
    cookieStore.get("portfolio_editor_session")?.value === "authenticated";
  return NextResponse.json({ authenticated });
}
