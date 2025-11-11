import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { decrypt } from "@/src/core/session";
import { ADMIN_PASSWORD_ROUTE, AUTH_SESSION_KEY, DAK_STATS_ROUTE, HOME_ROUTE, LOGIN_ROUTE } from "@/src/core/config";

const publicRoutes = [LOGIN_ROUTE, ADMIN_PASSWORD_ROUTE, DAK_STATS_ROUTE];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    const isPublicRoute = publicRoutes.includes(path);
    const isDakStatsRoute = path === DAK_STATS_ROUTE;

    const cookie = (await cookies()).get(AUTH_SESSION_KEY)?.value;
    const session = await decrypt(cookie);

    if (!isPublicRoute && !session?.userId) {
        return NextResponse.redirect(new URL(LOGIN_ROUTE, req.nextUrl));
    }

    if (isPublicRoute && !isDakStatsRoute && session?.userId && !req.nextUrl.pathname.startsWith(HOME_ROUTE)) {
        return NextResponse.redirect(new URL(HOME_ROUTE, req.nextUrl));
    }

    return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"]
};
