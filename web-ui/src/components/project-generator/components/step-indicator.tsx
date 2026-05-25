"use client";

import { cn } from "@/lib/utils";
import { steps } from "@/lib/options";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  completedSteps: Set<number>;
}

export function StepIndicator({ currentStep, completedSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.has(index);
        const isCurrent = index === currentStep;

        return (
          <div key={step.id} className="flex items-center">
            <div
              className={cn(
                "flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full text-[10px] sm:text-xs font-semibold transition-all duration-300",
                isCurrent && "bg-primary text-primary-foreground ring-2 sm:ring-4 ring-primary/20 scale-110",
                isCompleted && !isCurrent && "bg-primary/80 text-primary-foreground",
                !isCurrent && !isCompleted && "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted && !isCurrent ? (
                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                index + 1
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-3 sm:w-6 mx-0.5 sm:mx-1 rounded-full transition-all duration-300",
                  isCompleted ? "bg-primary/60" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
