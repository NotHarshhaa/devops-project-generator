import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AUTHOR_STATS, AUTHOR_SOCIAL_LINKS } from "../data/landing-content";
import { SectionHeader } from "./section-header";

export function AuthorSection() {
  return (
    <section className="border-y border-border/60 bg-muted/10">
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <SectionHeader
          badge={
            <>
              <Heart className="h-3 w-3" />
              Meet the Creator
            </>
          }
          title={
            <>
              Built by a <span className="text-brand-gradient">passionate engineer</span>
            </>
          }
        />

        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-border/60 glass-panel overflow-hidden">
            <div className="relative px-5 sm:px-8 pt-6 sm:pt-8 pb-6 sm:pb-8">
              <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

              <div className="relative flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
                <div className="shrink-0">
                  <div className="relative">
                    <Image
                      src="https://github.com/notharshhaa.png"
                      alt="H A R S H H A A"
                      width={96}
                      height={96}
                      className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border-2 border-brand/30 shadow-lg object-cover brand-glow"
                    />
                  </div>
                </div>
                <div className="pb-1">
                  <h3 className="text-lg sm:text-xl font-bold tracking-wide">H A R S H H A A</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                    Development Platform &amp; Automation Enthusiast | Cloud, DevOps &amp; MLops Engineer |
                    Platform Engineering
                  </p>
                </div>
              </div>

              <div className="relative grid grid-cols-3 gap-3 sm:gap-4 my-6 sm:my-8">
                {AUTHOR_STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center rounded-xl border border-border/60 bg-background/50 p-3 sm:p-4"
                  >
                    <div className="text-lg sm:text-2xl font-bold font-mono text-brand">{stat.value}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{stat.sub}</div>
                  </div>
                ))}
              </div>

              <div className="relative flex flex-wrap gap-2 sm:gap-3">
                {AUTHOR_SOCIAL_LINKS.map((link) => {
                  const Icon = link.icon;
                  const isPrimary = link.variant === "default";
                  return (
                    <Button
                      key={link.href}
                      asChild
                      variant={link.variant ?? "outline"}
                      size="sm"
                      className={`gap-1.5 ${isPrimary ? "bg-brand hover:bg-brand/90 text-brand-foreground" : "border-border/80"}`}
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
