import { authMiddleware } from '@clerk/nextjs/server';

// Check if Clerk is configured
const isClerkConfigured = 
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  process.env.CLERK_SECRET_KEY;

// If Clerk is not configured, allow all routes
export default isClerkConfigured ? authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: [
    '/',
    '/verify(.*)',
    '/credit(.*)',
    '/dashboard(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/(.*)',
  ],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: [
    '/api/(.*)',
  ],
}) : () => null;

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

