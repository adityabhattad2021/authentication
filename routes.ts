export const publicRoutes = [
    "/",
    "/auth/verify-email",
    "/auth/new-password"
];



// This routes can be only accessed when the user is logged out.
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset-password",
];



export const apiAuthPrefix = "/api/auth";


export const DEFAULT_LOGIN_REDIRECT = "/settings";