import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AUTHOR_STATS, AUTHOR_SOCIAL_LINKS } from "../data/landing-content";
import { SectionHeader } from "./section-header";

export function AuthorSection() {
  return (
    <section className="border-y-2 border-foreground bg-background py-20 sm:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          badge="AUTHORIAL STATEMENT"
          title="Designed for Engineers by Engineers"
          description="A solo pursuit in distilling cloud architecture into concise, reproducible, production-ready code."
        />

        <div className="max-w-3xl mx-auto border-2 border-foreground bg-card p-6 sm:p-10 relative">
          {/* Bold Choice #6: Editorial Pull Quote with Oversized Quotation Marks */}
          <div className="relative mb-8 pb-8 border-b border-foreground/20">
            <span className="font-display text-7xl sm:text-8xl text-foreground/20 leading-none absolute -top-8 -left-3 select-none pointer-events-none">
              “
            </span>
            <blockquote className="relative z-10 font-serif italic text-lg sm:text-2xl text-foreground leading-relaxed pl-6">
              True elegance in cloud architecture is not how many components you can add, but how much friction and bloat you can eliminate.
            </blockquote>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
            {/* Bold Choice #14: Image Borders Thicken & Grayscale to Scale on Hover */}
            <div className="group/avatar shrink-0">
              <div className="border-2 border-foreground group-hover/avatar:border-4 transition-all duration-100 overflow-hidden bg-background">
                <Image
                  src="https://github.com/notharshhaa.png"
                  alt="H A R S H H A A"
                  width={112}
                  height={112}
                  className="h-24 w-24 sm:h-28 sm:w-28 grayscale transition-all duration-300 group-hover/avatar:scale-105 group-hover/avatar:grayscale-0 object-cover"
                />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-display font-bold text-2xl tracking-wide text-foreground">
                H A R S H H A A
              </h3>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-1">
                PLATFORM ARCHITECT &amp; SYSTEMS AUTOMATION
              </p>
              <p className="font-serif text-sm text-foreground/80 mt-3 leading-relaxed">
                Platform Engineering specialist focused on declarative infrastructure, Kubernetes ecosystems, and developer tooling.
              </p>

              {/* Stats Inversion Row */}
              <div className="grid grid-cols-3 gap-3 my-6">
                {AUTHOR_STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="group/stat border border-foreground bg-background p-3 text-center transition-colors duration-100 hover:bg-foreground hover:text-background"
                  >
                    <div className="text-xl sm:text-2xl font-display font-bold">
                      {stat.value}
                    </div>
                    <div className="text-[9px] font-mono uppercase tracking-wider opacity-70 mt-0.5">
                      {stat.sub}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                {AUTHOR_SOCIAL_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Button
                      key={link.href}
                      asChild
                      variant="outline"
                      size="sm"
                      className="font-mono text-[11px] uppercase tracking-wider gap-2 h-9"
                    >
                      <a href={link.href} target="_blank" rel="noopener noreferrer">
                        <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                        {link.label}
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
