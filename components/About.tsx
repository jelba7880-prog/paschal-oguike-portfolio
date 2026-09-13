import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** Empty on purpose — content to be filled in later. */
export function About() {
  return (
    <section id="about" className="relative overflow-hidden px-[clamp(24px,4.5vw,64px)] py-[clamp(56px,6vw,88px)]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src="/images/kratos-thor-hero-bg.png"
          alt=""
          fill
          sizes="100vw"
          className="object-contain opacity-20"
        />
      </div>

      <div
        className="relative grid grid-cols-1 gap-x-6 gap-y-3 border-t pt-8 lg:grid-cols-12"
        style={{ borderColor: "var(--ink)" }}
      >
        <SectionLabel className="lg:col-span-2 lg:col-start-1">About me</SectionLabel>
        <h2 className="font-display m-0 text-[clamp(30px,3.4vw,50px)] leading-[1.12] font-light tracking-[-0.01em] lg:col-start-3 lg:col-span-7">
          About me
        </h2>
      </div>

      {/* Content placeholder — nothing here yet. */}
      <div className="relative min-h-[200px]" />
    </section>
  );
}
