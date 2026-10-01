"use client";

import { useState } from "react";
import { riskScore, riskLevel, isRedFlag, type Conditions } from "@/lib/risk";

// Handy places to demo from if you don't want to share your location.
const presets = [
  { name: "Berkeley, CA", lat: 37.87, lon: -122.27 },
  { name: "Paradise, CA", lat: 39.76, lon: -121.62 },
  { name: "Los Angeles, CA", lat: 34.05, lon: -118.24 },
  { name: "Phoenix, AZ", lat: 33.45, lon: -112.07 },
];

const sliders: { key: keyof Conditions; label: string; unit: string; min: number; max: number }[] = [
  { key: "tempF", label: "Temperature", unit: "°F", min: 30, max: 115 },
  { key: "humidity", label: "Humidity", unit: "%", min: 3, max: 100 },
  { key: "windMph", label: "Wind", unit: "mph", min: 0, max: 60 },
  { key: "dryDays", label: "Days since rain", unit: "days", min: 0, max: 30 },
];

export default function RiskChecker() {
  const [conditions, setConditions] = useState<Conditions>({ tempF: 85, humidity: 20, windMph: 15, dryDays: 10 });
  const [place, setPlace] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const score = riskScore(conditions);
  const level = riskLevel(score);
  const redFlag = isRedFlag(conditions);

  // Ask our own API route (src/app/api/conditions/route.ts) for live weather.
  async function loadLive(lat: number, lon: number, name: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/conditions?lat=${lat}&lon=${lon}`);
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setConditions(data.conditions);
      setPlace(name);
    } catch {
      setError("Couldn't load live weather. Try again or use the sliders.");
    } finally {
      setLoading(false);
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError("Your browser doesn't support location.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => loadLive(pos.coords.latitude, pos.coords.longitude, "your location"),
      () => {
        setLoading(false);
        setError("Location permission denied. Pick a city below instead.");
      },
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Left: result */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm text-white/60">
          {place ? `Live conditions for ${place}` : "What-if mode (drag the sliders)"}
        </p>
        <div className="mt-4 flex items-end gap-3">
          <span className="text-7xl font-black tabular-nums">{score}</span>
          <span className="pb-3 text-white/50">/ 100</span>
        </div>
        <span className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold text-white ${level.color}`}>
          {level.label} risk
        </span>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-orange-500 to-fuchsia-600 transition-all duration-500"
            style={{ width: `${score}%` }}
          />
        </div>
        <p className="mt-4 text-white/80">{level.advice}</p>
        {redFlag && (
          <p className="mt-4 rounded-lg border border-red-500/50 bg-red-500/15 p-3 text-sm text-red-200">
            🚩 <strong>Red Flag conditions:</strong> humidity ≤ 15% with winds ≥ 25 mph. Any spark can become a
            fast-moving fire.
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={useMyLocation}
            disabled={loading}
            className="rounded-full bg-orange-500 px-4 py-2 font-semibold text-black transition hover:bg-orange-400 disabled:opacity-50"
          >
            {loading ? "Checking…" : "📍 Check my location"}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => loadLive(p.lat, p.lon, p.name)}
              disabled={loading}
              className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70 transition hover:bg-white/10 disabled:opacity-50"
            >
              {p.name}
            </button>
          ))}
        </div>
        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      </section>

      {/* Right: inputs */}
      <section className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="font-semibold">Conditions</h2>
        {sliders.map((s) => (
          <label key={s.key} className="block">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">{s.label}</span>
              <span className="font-mono">
                {conditions[s.key]} {s.unit}
              </span>
            </div>
            <input
              type="range"
              min={s.min}
              max={s.max}
              value={conditions[s.key]}
              onChange={(e) => {
                setConditions({ ...conditions, [s.key]: Number(e.target.value) });
                setPlace(null); // edited by hand, so it's no longer "live"
              }}
              className="mt-2 w-full accent-orange-500"
            />
          </label>
        ))}
        <p className="text-xs text-white/40">
          Score = heat (25) + dry air (30) + wind (30) + dry streak (15). A simplified teaching model, not an
          official fire-danger rating.
        </p>
      </section>
    </div>
  );
}
