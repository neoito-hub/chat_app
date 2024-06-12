import { NextResponse } from "next/server";

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Health Check
 *     description: Health Check.
 */
export async function GET() {
  return NextResponse.json({ msg: "Hey, I am Fine" });
}
