// Imports
// ========================================================
import { NextResponse, type NextRequest } from "next/server";

// Config
// ========================================================
const corsOptions: {
  allowedMethods: string[];
  allowedOrigins: string[];
  allowedHeaders: string[];
  exposedHeaders?: string[];
  maxAge?: number;
  credentials?: boolean;
} = {
  allowedMethods: "GET,DELETE,PATCH,POST,PUT,OPTIONS".split(","),
  allowedOrigins: (process.env?.CORS_ORIGINS || "").split(","),
  allowedHeaders: (
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version,Authorization" ||
    ""
  ).split(","),
};

// Middleware
// ========================================================
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Response
  const response = NextResponse.next();
  // Allowed origins check
  const origin = request.headers.get("origin") ?? "";
  if (
    corsOptions.allowedOrigins.includes("*") ||
    corsOptions.allowedOrigins.includes(origin)
  ) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    corsOptions.allowedMethods.join(",")
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    corsOptions.allowedHeaders.join(",")
  );

  // Return
  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/api/:path*",
};
