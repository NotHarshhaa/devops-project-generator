import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AUTHOR_STATS, AUTHOR_SOCIAL_LINKS } from "../data/landing-content";
import { SectionHeader } from "./section-header";

export function AuthorSection() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          badge="AUTHORIAL STATEMENT"
          title="Designed for Engineers by Engineers"
          description="A dedicated pursuit in distilling cloud architecture into concise, reproducible, production-ready code."
        />

        <div className="max-w-3xl mx-auto rounded-2xl border border-border/80 bg-card p-6 sm:p-10 relative overflow-hidden w-full shadow-sm">
          {/* Quote */}
          <div className="relative mb-6 sm:mb-8 pb-6 border-b border-border/60">
            <blockquote className="text-base sm:text-xl font-medium text-foreground leading-relaxed italic">
              &ldquo;True elegance in cloud architecture is not how many components you can add, but how much friction and bloat you can eliminate.&rdquo;
            </blockquote>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="rounded-2xl border-2 border-border overflow-hidden bg-background shadow-md">
                <Image
                  src="https://github.com/notharshhaa.png"
                  alt="HARSHHAA"
                  width={112}
                  height={112}
                  className="h-20 w-20 sm:h-28 sm:w-28 object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0 w-full">
              <h3 className="font-bold text-xl sm:text-2xl text-foreground">
                HARSHHAA
              </h3>
              <p className="font-mono text-xs uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-semibold mt-1">
                PLATFORM ARCHITECT &amp; SYSTEMS AUTOMATION
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                Platform Engineering specialist focused on declarative infrastructure, Kubernetes ecosystems, and developer tooling.
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 my-5 w-full">
                {AUTHOR_STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-border/80 bg-muted/40 p-3 text-center transition-all hover:border-brand/40"
                  >
                    <div className="text-xl sm:text-2xl font-extrabold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-0.5 truncate">
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
                      className="text-xs gap-2 h-9 rounded-lg"
                    >
                      <a href={link.href} target="_blank" rel="noopener noreferrer">
                        <Icon className="h-3.5 w-3.5" />
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
