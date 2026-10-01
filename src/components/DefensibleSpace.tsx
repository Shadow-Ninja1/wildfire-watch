"use client";

import { useSavedState } from "@/lib/useSavedState";

// Based on CAL FIRE's defensible space zones and home-hardening guidance.
const zones = [
  {
    id: "zone0",
    title: "Zone 0 · Ember-resistant (0–5 ft)",
    why: "Most homes ignite from wind-blown embers, not the fire front. This is the zone that matters most.",
    items: [
      "No wood mulch or bark right against the house (use gravel or bare soil)",
      "No firewood, lumber, or trash cans stacked against walls",
      "Remove dead plants, leaves, and needles from roof, gutters, and decks",
      "No flammable furniture or doormats directly under windows",
    ],
  },
  {
    id: "zone1",
    title: "Zone 1 · Lean, clean & green (5–30 ft)",
    why: "Keeps flames from climbing toward your house.",
    items: [
      "Trees trimmed so branches are 10 ft from the roof and chimney",
      "Dead grass and weeds cleared; lawn kept watered",
      "Plants spaced out with gaps between shrub groups",
      "Propane tank has 10 ft of clearance",
    ],
  },
  {
    id: "zone2",
    title: "Zone 2 · Reduce fuel (30–100 ft)",
    why: "Slows the fire and keeps it on the ground, where it's easier to fight.",
    items: [
      "Grass mowed to 4 inches or less",
      "Tree branches pruned 6 ft up from the ground (no 'ladder fuels')",
      "Fallen branches and leaf litter cleared out",
    ],
  },
  {
    id: "home",
    title: "Hardening the house itself",
    why: "Close the gaps embers slip through.",
    items: [
      "Attic and foundation vents covered with 1/8-inch metal mesh",
      "Class A fire-rated roof",
      "Gutters cleaned or covered with guards",
      "Dual-pane (ideally tempered) windows",
      "Garden hose long enough to reach every side of the house",
    ],
  },
];

const totalItems = zones.reduce((sum, z) => sum + z.items.length, 0);

export default function DefensibleSpace() {
  // Keys look like "zone0-2" → true when checked.
  const [checked, setChecked] = useSavedState<Record<string, boolean>>("ember-protect", {});

  const done = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((done / totalItems) * 100);
  const grade = pct >= 90 ? "Fire-wise" : pct >= 60 ? "Getting there" : pct >= 30 ? "Vulnerable" : "High exposure";

  function toggle(key: string) {
    setChecked({ ...checked, [key]: !checked[key] });
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-2 z-10 rounded-2xl border border-white/10 bg-[#1c110c]/90 p-5 backdrop-blur">
        <div className="flex items-baseline justify-between">
          <p className="font-semibold">
            Home readiness: <span className="text-orange-400">{grade}</span>
          </p>
          <p className="font-mono text-sm text-white/60">
            {done}/{totalItems} · {pct}%
          </p>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {zones.map((zone) => (
        <section key={zone.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">{zone.title}</h2>
          <p className="mt-1 text-sm text-white/60">{zone.why}</p>
          <ul className="mt-4 space-y-2">
            {zone.items.map((item, i) => {
              const key = `${zone.id}-${i}`;
              return (
                <li key={key}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-white/5">
                    <input
                      type="checkbox"
                      checked={!!checked[key]}
                      onChange={() => toggle(key)}
                      className="mt-1 size-4 accent-emerald-500"
                    />
                    <span className={checked[key] ? "text-white/40 line-through" : ""}>{item}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <button
        onClick={() => setChecked({})}
        className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 hover:bg-white/10"
      >
        Reset checklist
      </button>
    </div>
  );
}
