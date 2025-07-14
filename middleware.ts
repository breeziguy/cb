import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets, API routes, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.') ||
    pathname.startsWith('/images/')
  ) {
    return response;
  }

  // Public paths that don't require authentication
  const publicPaths = ['/auth/login', '/auth/create-account'];

  if (publicPaths.includes(pathname)) {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return response;
  }

  if (!user) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Role-based access control for /admin routes
  if (pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      const redirectPath = profile?.role === 'creator' ? '/creators' : '/dashboard';
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}