import { next, rewrite } from '@vercel/edge';

export const config = {
  matcher: ['/((?!maintenance.html|_next/static|assets|favicon.ico).*)'],
};

export default function middleware(request) {
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';

  if (isMaintenanceMode) {
    const url = new URL('/maintenance.html', request.url);
    return rewrite(url, {
      status: 503,
      headers: {
        'Retry-After': '3600',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  }

  return next();
}
