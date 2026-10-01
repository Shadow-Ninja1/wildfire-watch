// Fire-weather risk scoring.
//
// This is a simplified, educational model loosely inspired by the
// Hot-Dry-Windy Index and the National Weather Service "Red Flag" criteria.
// Heat, low humidity, strong wind and a long dry streak all make fires start
// easier and spread faster. It is NOT an official forecast.

export type Conditions = {
  tempF: number; // air temperature, °F
  humidity: number; // relative humidity, %
  windMph: number; // sustained wind, mph
  dryDays: number; // days since meaningful rain
};

export type RiskLevel = {
  label: "Low" | "Moderate" | "High" | "Very High" | "Extreme";
  color: string; // Tailwind background class for the badge
  advice: string;
};

// Clamp a number into the 0..1 range.
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export function riskScore(c: Conditions): number {
  const heat = clamp01((c.tempF - 50) / 50) * 25; // 50°F → 0, 100°F+ → max
  const dryAir = clamp01((60 - c.humidity) / 50) * 30; // 60% → 0, 10% or less → max
  const wind = clamp01(c.windMph / 40) * 30; // 40 mph+ → max
  const drought = clamp01(c.dryDays / 14) * 15; // two weeks dry → max
  return Math.round(heat + dryAir + wind + drought);
}

export function riskLevel(score: number): RiskLevel {
  if (score < 25)
    return { label: "Low", color: "bg-emerald-600", advice: "Good day to clear brush and review your plan." };
  if (score < 45)
    return { label: "Moderate", color: "bg-yellow-500", advice: "Be careful with anything that sparks. Stay aware." };
  if (score < 65)
    return { label: "High", color: "bg-orange-500", advice: "Avoid outdoor burning and equipment use. Keep your go-bag by the door." };
  if (score < 80)
    return { label: "Very High", color: "bg-red-600", advice: "Fires can spread fast. Park facing out and know your two exits." };
  return { label: "Extreme", color: "bg-fuchsia-700", advice: "Be ready to leave immediately. Don't wait for an order if you feel unsafe." };
}

// NWS Red Flag Warnings are typically issued around RH ≤ 15% with winds ≥ 25 mph.
export function isRedFlag(c: Conditions): boolean {
  return c.humidity <= 15 && c.windMph >= 25;
}
