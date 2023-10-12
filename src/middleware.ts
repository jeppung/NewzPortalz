import { NextRequest, NextResponse } from "next/server";
import { IUser } from "./pages/login";

export function middleware(req: NextRequest) {
    const userData = req.cookies.get("userData")

    if (userData !== undefined) {
        const user: IUser = JSON.parse(userData.value)
        return user.isAdmin ? NextResponse.next() : NextResponse.redirect(new URL("/", req.url))
    } else {
        return NextResponse.redirect(new URL("/", req.url))
    }
}

export const config = {
    matcher: '/admin/:path*',
}