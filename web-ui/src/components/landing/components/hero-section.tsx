import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HERO_TAGS } from "../data/landing-content";

export function HeroSection() {
  return (
    <section className="container mx-auto max-w-7xl px-4 pt-10 sm:pt-14 pb-8 text-center">
      <Badge
        variant="outline"
        className="mb-4 gap-1.5 px-3 py-1 text-xs border-brand/30 bg-brand/5 text-brand"
      >
        <Sparkles className="h-3 w-3" />
        Production-Ready DevOps Scaffolding
      </Badge>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.15] max-w-3xl mx-auto">
        Build your DevOps stack <span className="text-brand-gradient">in seconds, not hours</span>
      </h1>

      <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
        Configure CI/CD, infrastructure, deployment, observability, and security — then download a complete,
        production-ready project structure.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
        {HERO_TAGS.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-[10px] font-mono px-2.5 py-0.5">
            {tag}
          </Badge>
        ))}
      </div>
    </section>
  );
}
