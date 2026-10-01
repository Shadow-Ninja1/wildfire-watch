// API route: GET /api/conditions?lat=37.87&lon=-122.27
//
// Runs on the server. It asks the free Open-Meteo weather API (no key needed)
// for current conditions + the last week of rainfall, then scores the fire risk.

import { riskScore, riskLevel, isRedFlag, type Conditions } from "@/lib/risk";

type OpenMeteoResponse = {
  timezone: string;
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_gusts_10m: number;
  };
  daily: { time: string[]; precipitation_sum: number[] };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return Response.json({ error: "lat and lon are required" }, { status: 400 });
  }

  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${lat}&longitude=${lon}` +
    "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_gusts_10m" +
    "&daily=precipitation_sum&past_days=7&forecast_days=1" +
    "&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto";

  const res = await fetch(url);
  if (!res.ok) {
    return Response.json({ error: "Weather service unavailable" }, { status: 502 });
  }
  const data: OpenMeteoResponse = await res.json();

  // Count days in a row (going backwards from today) with basically no rain.
  let dryDays = 0;
  for (const inches of [...data.daily.precipitation_sum].reverse()) {
    if (inches >= 0.05) break;
    dryDays++;
  }

  const conditions: Conditions = {
    tempF: Math.round(data.current.temperature_2m),
    humidity: Math.round(data.current.relative_humidity_2m),
    windMph: Math.round(data.current.wind_speed_10m),
    dryDays,
  };
  const score = riskScore(conditions);

  return Response.json({
    conditions,
    gustsMph: Math.round(data.current.wind_gusts_10m),
    timezone: data.timezone,
    score,
    level: riskLevel(score),
    redFlag: isRedFlag(conditions),
  });
}
