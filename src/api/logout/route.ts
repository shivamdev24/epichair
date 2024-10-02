import db from "@/utils/db";
import {  NextResponse } from "next/server";

db();

export async function POST() {
  try {
    const response = NextResponse.json({
      message: "Logout Successfully",
      success: true,
    });

    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    console.log(response);
    return response;
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
