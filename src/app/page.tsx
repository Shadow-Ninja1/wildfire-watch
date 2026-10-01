import Link from "next/link";
import RiskChecker from "@/components/RiskChecker";

export default function Home() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Know the risk. <span className="text-orange-400">Have a plan.</span>
        </h1>
        <p className="mt-3 max-w-2xl text-white/70">
          Wildfires move fast, sometimes faster than a car on a clogged road. Ember Watch pulls live weather for
          any location, scores how fire-friendly the conditions are, and helps you prepare before it matters.
        </p>
      </section>

      <RiskChecker />

      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/protect"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-orange-400/60"
        >
          <p className="text-2xl">🏡</p>
          <h2 className="mt-2 font-semibold">Protect your home →</h2>
          <p className="mt-1 text-sm text-white/60">Score your defensible space, zone by zone.</p>
        </Link>
        <Link
          href="/escape"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-orange-400/60"
        >
          <p className="text-2xl">🚗</p>
          <h2 className="mt-2 font-semibold">Build an escape plan →</h2>
          <p className="mt-1 text-sm text-white/60">Go-bag, meeting spot, routes. Print it and stick it on the fridge.</p>
        </Link>
      </section>
    </div>
  );
}
