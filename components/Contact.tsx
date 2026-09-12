import { SectionLabel } from "@/components/ui/SectionLabel";

const EMAIL = "paschaloguike@gmail.com";

export function Contact() {
  return (
    <section
      id="contact"
      data-inverse
      className="px-[clamp(24px,4.5vw,64px)] pt-[clamp(56px,7vw,96px)] pb-[clamp(40px,5vw,64px)]"
      style={{ background: "var(--paper)", color: "var(--ink)" }}
    >
      <div className="grid grid-cols-1 gap-x-6 lg:grid-cols-12">
        <SectionLabel className="lg:col-span-2 lg:col-start-1">
          Contact
        </SectionLabel>

        <div className="mt-6 lg:col-start-3 lg:col-span-10 lg:mt-0">
          <p
            className="m-0 mb-7 max-w-[34em] text-[clamp(20px,1.8vw,24px)] leading-[1.5] text-pretty"
            style={{ color: "var(--body)" }}
          >
            Have a product that needs to exist, or a codebase that needs a spine? I take on a small number of
            projects at a time.
          </p>

          <a
            href={`mailto:${EMAIL}`}
            className="font-display inline-block bg-[linear-gradient(var(--accent),var(--accent))] bg-[length:0%_2px] bg-no-repeat bg-[position:0_96%] text-[clamp(28px,4.2vw,60px)] leading-[1.15] font-light italic break-words transition-[background-size] duration-[400ms] hover:bg-[length:100%_2px]"
          >
            {EMAIL}
          </a>

          <div className="mt-5 text-[11px] uppercase tracking-[0.14em]" style={{ color: "var(--faint)" }}>
            Replies within 1–2 working days · Lagos hours, GMT+1
          </div>
        </div>
      </div>
    </section>
  );
}
