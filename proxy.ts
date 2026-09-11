import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parseSetCookie } from 'cookie';

import { checkSession } from '@/lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // Case 1: access token is valid — user is logged in
  if (accessToken) {
    if (isPublicRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  }

  // Case 2: access token expired, but refresh token is still there
  if (refreshToken) {
    try {
      const apiResponse = await checkSession();
      const setCookie = apiResponse.headers['set-cookie'];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        const response = isPublicRoute
          ? NextResponse.redirect(new URL('/', request.url))
          : NextResponse.next();

        for (const cookieString of cookieArray) {
          const parsed = parseSetCookie(cookieString);
          
          if (!parsed.name || !parsed.value) {
            continue;
          }

          response.cookies.set(parsed.name, parsed.value, {
            path: parsed.path,
            maxAge: parsed.maxAge,
            expires: parsed.expires,
            domain: parsed.domain,
            httpOnly: parsed.httpOnly,
            secure: parsed.secure,
            sameSite: parsed.sameSite,
          });
        }

        return response;
      }
    } catch {
      // Session refresh failed — treat the user as a guest
    }
  }

  // Case 3: no valid tokens — user is a guest
  if (isPrivateRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
