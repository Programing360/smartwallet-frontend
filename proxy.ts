import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// const protectedPaths = [
//   "/dashboard",
//   "/transactions",
//   "/reports",
//   "/manage",
// ];

// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Replace this with your actual JWT/Cookie check logic
  const token = request.cookies.get('token')?.value; 
  const { pathname } = request.nextUrl;
  // Protect paths starting with /items/add or /items/manage
  if (!token && (pathname.startsWith('/dashboard/transaction') || pathname.startsWith('/transaction'))) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/transaction','/report', '/manage' ], // Applies middleware to all subroutes of /items
};