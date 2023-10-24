import { NextRequest, NextResponse } from "next/server";
import { IUser } from "./pages/login";
import { ISubsTransaction, decrypt } from "./pages/subscription";

export function middleware(req: NextRequest) {
    const userData = req.cookies.get("userData")

    if (req.nextUrl.pathname.startsWith("/admin")) {
        if (userData !== undefined) {
            const user: IUser = JSON.parse(userData.value)
            return user.isAdmin ? NextResponse.next() : NextResponse.redirect(new URL("/", req.url))
        } else {
            return NextResponse.redirect(new URL("/", req.url))
        }
    }

    if (req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register")) {
        if (userData !== undefined) {
            const user: IUser = JSON.parse(userData.value)
            return user.isAdmin ? NextResponse.redirect(new URL("/admin", req.url)) : NextResponse.redirect(new URL("/", req.url))
        } else {
            return NextResponse.next()
        }
    }

    if (req.nextUrl.pathname.startsWith("/transaction")) {
        if (userData !== undefined) {
            const data = req.nextUrl.pathname.split("/")[2]
            try {
                decrypt((atob(data)))
                return NextResponse.next()
            } catch (e) {
                return NextResponse.redirect(new URL("/", req.url))
            }
        } else {
            return NextResponse.redirect(new URL("/", req.url))
        }
    }

    if (req.nextUrl.pathname.startsWith("/subscription") || req.nextUrl.pathname.startsWith("/profile")) {
        if (userData !== undefined) {
            return NextResponse.next()
        } else {
            return NextResponse.redirect(new URL("/", req.url))
        }
    }


}