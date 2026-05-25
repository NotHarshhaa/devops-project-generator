"use client";

import { cn } from "@/lib/utils";
import { steps } from "@/lib/options";
import { Check, ChevronRight } from "lucide-react";
import { STEP_ICONS } from "../constants";

interface StepSidebarProps {
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick?: (step: number) => void;
}

export function StepSidebar({ currentStep, completedSteps, onStepClick }: StepSidebarProps) {
  const progress = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <aside className="hidden lg:flex flex-col w-56 xl:w-64 shrink-0 border-r border-border/60 pr-4">
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-muted-foreground font-medium uppercase tracking-wider">Progress</span>
          <span className="font-mono text-brand font-semibold">{progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand to-cyan-400 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(index);
          const isCurrent = index === currentStep;
          const isAccessible = isCompleted || isCurrent;
          const Icon = STEP_ICONS[step.id];

          return (
            <button
              key={step.id}
              type="button"
              disabled={!isAccessible || !onStepClick}
              onClick={() => isAccessible && onStepClick?.(index)}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200",
                isCurrent && "bg-brand/10 border border-brand/30 brand-glow",
                isCompleted && !isCurrent && "hover:bg-muted/80 cursor-pointer",
                !isCurrent && !isCompleted && "opacity-45 cursor-default"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                  isCurrent && "bg-brand text-brand-foreground",
                  isCompleted && !isCurrent && "bg-brand/20 text-brand",
                  !isCurrent && !isCompleted && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted && !isCurrent ? (
                  <Check className="h-4 w-4" />
                ) : Icon ? (
                  <Icon className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-xs font-semibold truncate",
                    isCurrent ? "text-brand" : "text-foreground"
                  )}
                >
                  {step.title}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">{step.description}</p>
              </div>
              {isCurrent && <ChevronRight className="h-4 w-4 text-brand shrink-0" />}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
