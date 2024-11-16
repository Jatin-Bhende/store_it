/**
 * An array of routes that are protected.
 * These routes require authentication.
 */
export const protectedRoutes = [
	"/",
	"/documents",
	"/images",
	"/media",
	"/others",
];

/**
 * An array of routes that are used for authentication.
 * These routes will redirect users to homepage if they are authenticated.
 */
export const authRoutes = ["/sign-in", "/sign-up"];

/**
 * The default redirect route for login.
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
