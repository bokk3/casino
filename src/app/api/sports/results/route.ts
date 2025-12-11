import { NextResponse } from "next/server";

const API_KEY = process.env.THE_ODDS_API_KEY;
const BASE_URL = "https://api.the-odds-api.com/v4/sports";

export async function GET(req: Request) {
  if (!API_KEY) {
    return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const sport = searchParams.get("sport") || "soccer_epl"; 
  const daysFrom = "3"; // Last 3 days

  try {
      const url = `${BASE_URL}/${sport}/scores/?daysFrom=${daysFrom}&apiKey=${API_KEY}`;
      console.log("Fetching results from:", url);
      
      const res = await fetch(url);
      if (!res.ok) {
          // If 401/403, might be free tier limit or restriction on scores endpoint
          throw new Error(`External API Error: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      // Filter only finished games
      const finishedGames = Array.isArray(data) 
        ? data.filter((m: any) => m.completed)
        : [];

      return NextResponse.json({ data: finishedGames });
  } catch (error: any) {
      console.error("Results fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
  }
}
