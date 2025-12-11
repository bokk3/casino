import { NextResponse } from "next/server";

const API_KEY = process.env.THE_ODDS_API_KEY;
const BASE_URL = "https://api.the-odds-api.com/v4/sports";

// Simple in-memory cache
let oddsCache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 60 * 60 * 1000; // 1 Hour

export async function GET(req: Request) {
  if (!API_KEY) {
    return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const sport = searchParams.get("sport") || "upcoming"; // e.g. 'americanfootball_nfl'
  const region = searchParams.get("region") || "eu"; // Default to EU as requested
  const markets = "h2h"; // head to head (moneyline)

  // specific cache key
  const cacheKey = `${sport}-${region}-${markets}`;

  // Check Cache
  if (oddsCache[cacheKey]) {
      const { data, timestamp } = oddsCache[cacheKey];
      if (Date.now() - timestamp < CACHE_DURATION) {
          return NextResponse.json({ 
              data, 
              source: "cache",
              nextUpdate: new Date(timestamp + CACHE_DURATION).toISOString()
          });
      }
  }

  try {
      const url = `${BASE_URL}/${sport}/odds/?regions=${region}&markets=${markets}&apiKey=${API_KEY}`;
      console.log("Fetching odds from:", url);
      
      const res = await fetch(url);
      if (!res.ok) {
          throw new Error(`External API Error: ${res.statusText}`);
      }
      
      const data = await res.json();

      // Sort by time (soonest first)
      if (Array.isArray(data)) {
          data.sort((a: any, b: any) => new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime());
      }

      // Update Cache
      oddsCache[cacheKey] = {
          data,
          timestamp: Date.now()
      };

      return NextResponse.json({ 
          data, 
          source: "api" 
      });
  } catch (error: any) {
      console.error("Odds fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch odds" }, { status: 500 });
  }
}
