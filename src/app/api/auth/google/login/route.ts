import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000';
  const proto = req.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const origin = `${proto}://${host}`;

  // Default to user's specified client_id or environment variable
  const clientId =
    process.env.GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '720853280071-aafuf58ki4o8af4eh8n5ki20uqiffj3a.apps.googleusercontent.com';

  const redirectUri = `${origin}/api/auth/google/callback`;

  // Standard Google OAuth 2.0 Authorization Endpoint
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('prompt', 'select_account');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('state', 'civicpulse_oauth_flow');

  // Direct redirection to Google Accounts
  return NextResponse.redirect(googleAuthUrl.toString());
}
