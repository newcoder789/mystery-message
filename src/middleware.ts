import { NextResponse, NextRequest  } from 'next/server';
export {default} from "next-auth/middleware";
import { getToken } from 'next-auth/jwt';
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token  = await getToken({req:request})
    const url = request.nextUrl
    // it will redirect anyone who already has token from these 4 pages to dashboard
    if(token && 
        (
            url.pathname.startsWith('sign-in')||
            url.pathname.startsWith('sign-up') ||
            url.pathname.startsWith('verify') ||
            url.pathname.startsWith('/')
        )
    ){    
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    // return NextResponse.redirect(new URL('/home', request.url))
    return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // here we need to write all the route where we want to add middleware
    '/sign-in',
    '/sign-up',
    '/',
    // /:path*--- this applies middle ware to every path inside these paths
    '/dashboard/:path*',
    '/verify/:path*'
  ]
}