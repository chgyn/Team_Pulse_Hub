import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Team Pulse Hub',
    defaultTeam: Number(process.env.NEXT_PUBLIC_DEFAULT_TEAM_ID ?? 127),
    defaultLeague: Number(process.env.NEXT_PUBLIC_DEFAULT_LEAGUE_ID ?? 71),
    season: Number(process.env.NEXT_PUBLIC_SEASON ?? 2026),
    hasApiKey: Boolean(process.env.FOOTBALL_API_KEY?.trim()),
    timestamp: new Date().toISOString(),
  });
}
