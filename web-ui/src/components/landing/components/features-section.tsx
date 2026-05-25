import { Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { WHY_CHOOSE_FEATURES } from "../data/landing-content";
import { SectionHeader } from "./section-header";

export function FeaturesSection() {
  return (
    <section className="container mx-auto max-w-5xl px-4 py-16 sm:py-24">
      <SectionHeader
        badge={
          <>
            <Zap className="h-3 w-3" />
            Why Choose This Tool
          </>
        }
        title={
          <>
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              ship faster
            </span>
          </>
        }
        description="Stop spending hours setting up boilerplate. Generate a complete, production-ready DevOps project in seconds."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {WHY_CHOOSE_FEATURES.map((feature) => (
          <Card
            key={feature.title}
            className="group border bg-card/50 hover:bg-card hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="p-5 sm:p-6">
              <div
                className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl ${feature.bg} mb-4`}
              >
                <feature.icon className={`h-5 w-5 sm:h-5.5 sm:w-5.5 ${feature.color}`} />
              </div>
              <h3 className="font-semibold text-sm sm:text-base mb-1.5">{feature.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
