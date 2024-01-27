export const publicRoutes = [
    "/",
    "/auth/verify-email"
];



// This routes can be only accessed when the user is logged out.
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error"
];



export const apiAuthPrefix = "/api/auth";


export const DEFAULT_LOGIN_REDIRECT = "/settings";