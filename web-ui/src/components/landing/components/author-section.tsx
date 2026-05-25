import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AUTHOR_STATS, AUTHOR_SOCIAL_LINKS } from "../data/landing-content";
import { SectionHeader } from "./section-header";

export function AuthorSection() {
  return (
    <section className="border-y bg-muted/20">
      <div className="container mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <SectionHeader
          badge={
            <>
              <Heart className="h-3 w-3" />
              Meet the Creator
            </>
          }
          title={
            <>
              Built by a{" "}
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                passionate engineer
              </span>
            </>
          }
          className="mb-10 sm:mb-14"
        />

        <div className="max-w-2xl mx-auto">
          <Card className="overflow-hidden border bg-card/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="px-5 sm:px-8 pb-6 sm:pb-8">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
                  <div className="shrink-0">
                    <Image
                      src="https://github.com/notharshhaa.png"
                      alt="H A R S H H A A"
                      width={96}
                      height={96}
                      className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-background shadow-lg object-cover"
                    />
                  </div>
                  <div className="pb-1">
                    <h3 className="text-lg sm:text-xl font-bold tracking-wide">H A R S H H A A</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
                      Development Platform &amp; Automation Enthusiast | Cloud, DevOps &amp; MLops Engineer |
                      Platform Engineering
                    </p>
                  </div>
                </div>

                <Separator className="my-5 sm:my-6" />

                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
                  {AUTHOR_STATS.map((stat) => (
                    <div key={stat.label} className="text-center rounded-lg bg-muted/50 p-3 sm:p-4">
                      <div className="text-lg sm:text-2xl font-bold">{stat.value}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">{stat.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {AUTHOR_SOCIAL_LINKS.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Button
                        key={link.href}
                        asChild
                        variant={link.variant ?? "outline"}
                        size="sm"
                        className="gap-1.5"
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
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
