"use client";

import { useSavedState } from "@/lib/useSavedState";

// The "6 P's" of evacuation, plus a few extras.
const goBagItems = [
  "People & pets (carriers, leashes, pet food)",
  "Papers: IDs, insurance, deeds (or photos of them)",
  "Prescriptions, glasses, first-aid kit",
  "Pictures & irreplaceable keepsakes",
  "Personal computer, phone + chargers & battery pack",
  "Plastic: credit cards and some cash",
  "N95 masks for smoke",
  "Water (1 gal per person per day) and snacks",
  "Flashlight and a change of clothes",
];

const leaveNowSteps = [
  "Grab the go-bag and pets",
  "Close all windows and doors (don't lock), and shut off gas",
  "Move furniture away from windows",
  "Leave lights on so firefighters can see the house through smoke",
  "Text your out-of-area contact that you're leaving",
  "Drive with headlights on and windows up",
];

type Plan = {
  household: string;
  meetingSpot: string;
  routeA: string;
  routeB: string;
  contactName: string;
  contactPhone: string;
  bag: Record<number, boolean>;
};

const emptyPlan: Plan = {
  household: "",
  meetingSpot: "",
  routeA: "",
  routeB: "",
  contactName: "",
  contactPhone: "",
  bag: {},
};

const fields: { key: Exclude<keyof Plan, "bag">; label: string; placeholder: string }[] = [
  { key: "household", label: "Who's in the household (incl. pets)", placeholder: "Me, 2 roommates, Mochi the cat" },
  { key: "meetingSpot", label: "Meeting spot outside the danger area", placeholder: "Target parking lot on San Pablo Ave" },
  { key: "routeA", label: "Escape route #1", placeholder: "Down Hearst → I-80 West" },
  { key: "routeB", label: "Escape route #2 (in case #1 is blocked)", placeholder: "Shattuck south → Ashby → Hwy 24" },
  { key: "contactName", label: "Out-of-area contact", placeholder: "Mom (in Sacramento)" },
  { key: "contactPhone", label: "Their phone", placeholder: "(555) 123-4567" },
];

export default function EscapePlan() {
  const [plan, setPlan] = useSavedState<Plan>("ember-escape", emptyPlan);

  const filled = fields.filter((f) => plan[f.key].trim() !== "").length;
  const packed = Object.values(plan.bag).filter(Boolean).length;
  const ready = filled === fields.length && packed === goBagItems.length;

  return (
    <div className="space-y-6">
      <section className="grid gap-3 sm:grid-cols-3 print:hidden">
        {[
          { word: "READY", text: "Prepare now: plan, go-bag, defensible space.", color: "border-emerald-500/50" },
          { word: "SET", text: "Fire nearby: bag in car, car facing out, stay alert.", color: "border-yellow-500/50" },
          { word: "GO!", text: "Leave early. Don't wait for flames or an order.", color: "border-red-500/50" },
        ].map((s) => (
          <div key={s.word} className={`rounded-2xl border-2 ${s.color} bg-white/5 p-4`}>
            <p className="font-black tracking-wider">{s.word}</p>
            <p className="mt-1 text-sm text-white/70">{s.text}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 print:border-black">
        <h2 className="text-lg font-semibold">Our plan</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <label key={f.key} className="block text-sm">
              <span className="text-white/70 print:text-black">{f.label}</span>
              <input
                value={plan[f.key]}
                onChange={(e) => setPlan({ ...plan, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white placeholder:text-white/25 focus:border-orange-400 focus:outline-none print:border-black print:bg-white print:text-black"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Go-bag</h2>
          <span className="font-mono text-sm text-white/60">
            {packed}/{goBagItems.length} packed
          </span>
        </div>
        <ul className="mt-3 grid gap-1 sm:grid-cols-2">
          {goBagItems.map((item, i) => (
            <li key={item}>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-white/5">
                <input
                  type="checkbox"
                  checked={!!plan.bag[i]}
                  onChange={() => setPlan({ ...plan, bag: { ...plan.bag, [i]: !plan.bag[i] } })}
                  className="mt-1 size-4 accent-orange-500"
                />
                <span className={plan.bag[i] ? "text-white/40 line-through" : ""}>{item}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
        <h2 className="text-lg font-semibold">When it&apos;s time to go</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-white/80 print:text-black">
          {leaveNowSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <button
          onClick={() => window.print()}
          className="rounded-full bg-orange-500 px-5 py-2 font-semibold text-black hover:bg-orange-400"
        >
          🖨️ Print my plan
        </button>
        <button
          onClick={() => setPlan(emptyPlan)}
          className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 hover:bg-white/10"
        >
          Clear
        </button>
        <span className={`text-sm ${ready ? "text-emerald-400" : "text-white/50"}`}>
          {ready ? "✅ Plan complete. You're READY." : `${filled}/${fields.length} fields filled in`}
        </span>
      </div>
    </div>
  );
}
