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
  Check,
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
      type="button"
      onClick={() => onSelect(option.value)}
      className={cn(
        "group relative flex w-full flex-col gap-3 rounded-2xl border p-4 text-left transition-all duration-200",
        "hover:border-brand/40 hover:bg-brand/5 hover:shadow-md hover:shadow-brand/5",
        selected
          ? "border-brand bg-brand/10 shadow-lg shadow-brand/10 ring-1 ring-brand/30"
          : "border-border/70 bg-card/50"
      )}
    >
      {option.recommended && (
        <Badge className="absolute -top-2 right-3 bg-brand text-brand-foreground text-[10px] px-2 py-0 border-0">
          Recommended
        </Badge>
      )}

      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all",
            selected
              ? "bg-brand text-brand-foreground shadow-md shadow-brand/30"
              : "bg-muted text-muted-foreground group-hover:bg-brand/15 group-hover:text-brand"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex flex-col gap-1 min-w-0 pr-6">
          <span className={cn("font-semibold text-sm leading-tight", selected && "text-brand")}>
            {option.label}
          </span>
          <span className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {option.description}
          </span>
        </div>
      </div>

      <div
        className={cn(
          "absolute top-4 right-4 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
          selected ? "border-brand bg-brand" : "border-muted-foreground/25 bg-transparent"
        )}
      >
        {selected && <Check className="h-3 w-3 text-brand-foreground" strokeWidth={3} />}
      </div>
    </button>
  );
}
