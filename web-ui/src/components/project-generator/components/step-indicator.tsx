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
    <div className="flex items-center justify-center gap-1 overflow-x-auto pb-1">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.has(index);
        const isCurrent = index === currentStep;

        return (
          <div key={step.id} className="flex items-center shrink-0">
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold transition-all",
                isCurrent && "bg-brand text-brand-foreground scale-110 shadow-md shadow-brand/30",
                isCompleted && !isCurrent && "bg-brand/20 text-brand",
                !isCurrent && !isCompleted && "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted && !isCurrent ? <Check className="h-3.5 w-3.5" /> : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-4 mx-0.5 rounded-full",
                  isCompleted ? "bg-brand/60" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
