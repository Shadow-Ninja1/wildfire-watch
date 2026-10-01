import type { Metadata } from "next";
import EscapePlan from "@/components/EscapePlan";

export const metadata: Metadata = { title: "Escape Plan · Ember Watch" };

export default function EscapePage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-black tracking-tight">Escape plan</h1>
        <p className="mt-3 max-w-2xl text-white/70">
          In a fast fire you may get minutes, not hours. Decide now where you&apos;ll go, how you&apos;ll get there,
          and what you&apos;ll grab. Everything saves in this browser; nothing is sent anywhere.
        </p>
      </section>
      <EscapePlan />
    </div>
  );
}
