import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    platform: 'CivicPulse API (Next.js Serverless)',
    timestamp: new Date().toISOString(),
  });
}
