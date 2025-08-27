import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import { checkServerSession } from './lib/api/serverApi';

const privateRoutes = ['/profile'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));

  // Якщо немає accessToken
  if (!accessToken) {
    if (refreshToken) {
      // пробуємо оновити сесію
      const data = await checkServerSession();
      const setCookie = data.headers['set-cookie'];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        const response = NextResponse.next();

        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);
          if (parsed.accessToken) {
            response.cookies.set('accessToken', parsed.accessToken, {
              path: parsed.Path,
              maxAge: Number(parsed['Max-Age']),
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            });
          }
          if (parsed.refreshToken) {
            response.cookies.set('refreshToken', parsed.refreshToken, {
              path: parsed.Path,
              maxAge: Number(parsed['Max-Age']),
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            });
          }
        }

        // Якщо користувач йде на публічну сторінку → редіректимо на /
        if (isPublicRoute) {
          return NextResponse.redirect(new URL('/', request.url));
        }

        return response;
      }
    }

    // Без токена йдемо тільки на публічні сторінки
    if (isPublicRoute) return NextResponse.next();

    // Якщо приватний маршрут → редіректимо на логін
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  // Якщо користувач вже авторизований і йде на публічну сторінку
  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/sign-in', '/sign-up'],
};
