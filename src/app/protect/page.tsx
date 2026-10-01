import type { Metadata } from "next";
import DefensibleSpace from "@/components/DefensibleSpace";

export const metadata: Metadata = { title: "Protect · Ember Watch" };

export default function ProtectPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-black tracking-tight">Protect your home</h1>
        <p className="mt-3 max-w-2xl text-white/70">
          Defensible space is the buffer between your house and whatever could burn around it. Check off what
          you&apos;ve already done; your progress is saved in this browser.
        </p>
      </section>
      <DefensibleSpace />
    </div>
  );
}
