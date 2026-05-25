"use client";

import { cn } from "@/lib/utils";
import { OptionCard as OptionCardType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  GitBranch,
  Github,
  Server,
  X,
  Layers,
  Cloud,
  Container,
  Ship,
  Monitor,
  Box,
  FileText,
  BarChart3,
  Activity,
  Shield,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  github: Github,
  gitlab: Server,
  server: Server,
  x: X,
  layers: Layers,
  cloud: Cloud,
  container: Container,
  ship: Ship,
  monitor: Monitor,
  box: Box,
  "git-branch": GitBranch,
  "file-text": FileText,
  "bar-chart": BarChart3,
  activity: Activity,
  shield: Shield,
  "shield-check": ShieldCheck,
  "shield-alert": ShieldAlert,
};

interface OptionCardProps {
  option: OptionCardType;
  selected: boolean;
  onSelect: (value: string) => void;
}

export function OptionCard({ option, selected, onSelect }: OptionCardProps) {
  const Icon = iconMap[option.icon] || Box;

  return (
    <button
      onClick={() => onSelect(option.value)}
      className={cn(
        "group relative flex w-full flex-col gap-2 sm:gap-3 rounded-xl border-2 p-3.5 sm:p-5 text-left transition-all duration-200",
        "hover:shadow-md hover:border-primary/40 hover:bg-accent/50",
        selected
          ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20"
          : "border-border bg-card"
      )}
    >
      {option.recommended && (
        <Badge
          variant="secondary"
          className="absolute -top-2.5 right-3 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 font-semibold"
        >
          Recommended
        </Badge>
      )}

      <div className="flex items-start gap-3.5">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
            selected
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <span
            className={cn(
              "font-semibold text-sm leading-tight",
              selected ? "text-primary" : "text-foreground"
            )}
          >
            {option.label}
          </span>
          <span className="text-xs text-muted-foreground leading-relaxed">
            {option.description}
          </span>
        </div>
      </div>

      <div
        className={cn(
          "absolute top-4 right-4 h-5 w-5 rounded-full border-2 transition-all flex items-center justify-center",
          selected ? "border-primary bg-primary" : "border-muted-foreground/30"
        )}
      >
        {selected && (
          <svg
            className="h-3 w-3 text-primary-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </button>
  );
}
