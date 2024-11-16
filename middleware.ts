import { NextRequest, NextResponse } from "next/server";
import {
	protectedRoutes,
	authRoutes,
	DEFAULT_LOGIN_REDIRECT,
} from "@/constants/routes";

export const middleware = async (req: NextRequest) => {
	const { nextUrl } = req;

	const isProtectedRoute = protectedRoutes.includes(nextUrl.pathname);
	const isAuthRoute = authRoutes.includes(nextUrl.pathname);

	const session = req.cookies.get("appwrite-session");

	if (isProtectedRoute && !session) {
		return NextResponse.redirect(new URL("/sign-in", nextUrl));
	}

	if (isAuthRoute && session) {
		return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
	}

	return NextResponse.next();
};

// Optionally, don't invoke Middleware on some paths
export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
