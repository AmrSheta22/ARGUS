import { createFileRoute } from "@tanstack/react-router";

import { EyeField } from "../../components/marketing/eye-field";

export const Route = createFileRoute("/_public/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <EyeField />

      {/* soft paper vignette that keeps center readable */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_50%_46%,oklch(0.9606_0.01643_79.35/94%)_0_13%,oklch(0.9606_0.01643_79.35/68%)_28%,transparent_66%)]"
      />

      <section className="pointer-events-none relative z-3 flex min-h-svh flex-col items-center justify-center px-6 pt-21 pb-22.5 text-center">
        <img
          className="mb-2 h-[clamp(82px,8vw,118px)] w-[clamp(82px,8vw,118px)] rounded-full object-cover mix-blend-multiply shadow-[0_0_0_1px_oklch(0.3609_0.03245_55.14/18%)]"
          src="/logo-2.png"
          alt="ARGUS eye logo"
          width={118}
          height={118}
        />
        <p className="text-xs font-extrabold tracking-[0.24em] text-primary uppercase">
          Observe deeply · Question carefully
        </p>
        <h1 className="mt-3 max-w-220 text-[clamp(56px,7vw,104px)] leading-[0.84] font-medium tracking-[-0.055em]">
          Every question
          <br />
          begins with <span className="text-primary italic">looking.</span>
        </h1>
      </section>
    </div>
  );
}
