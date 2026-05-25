"use client";

import { ProjectConfig, GenerationResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Check,
  Download,
  RotateCcw,
  FileCode2,
  FolderOpen,
  Package,
  Zap,
  Terminal,
  Copy,
  CheckCheck,
  Clock,
  Info,
  Sparkles,
} from "lucide-react";
import { FileTree } from "../file-tree";
import { buildCliCommand } from "../utils";

interface ResultViewProps {
  config: ProjectConfig;
  result: GenerationResult;
  generationTime: number;
  copied: boolean;
  onDownload: () => void;
  onReset: () => void;
  onCopyCommand: () => void;
}

const statCards = [
  { key: "files", icon: FileCode2, label: "Files", color: "text-brand" },
  { key: "dirs", icon: FolderOpen, label: "Directories", color: "text-cyan-500" },
  { key: "components", icon: Package, label: "Components", color: "text-emerald-500" },
  { key: "envs", icon: Zap, label: "Environments", color: "text-amber-500" },
] as const;

export function ResultView({
  config,
  result,
  generationTime,
  copied,
  onDownload,
  onReset,
  onCopyCommand,
}: ResultViewProps) {
  const cliCommand = buildCliCommand(config);
  const envCount = config.envs === "single" ? 1 : config.envs.split(",").length;

  const statValues = {
    files: result.summary.totalFiles,
    dirs: result.summary.totalDirs,
    components: result.summary.components.length,
    envs: envCount,
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-brand/5 to-transparent p-6 sm:p-8 text-center brand-glow">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="relative">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30">
              <Check className="h-8 w-8 text-emerald-500" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-brand" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Project ready to ship</h2>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
            <span className="font-semibold font-mono text-foreground">{result.projectName}</span> includes{" "}
            <span className="font-semibold text-foreground">{result.summary.totalFiles} files</span> across{" "}
            <span className="font-semibold text-foreground">{result.summary.totalDirs} directories</span>
          </p>
          {generationTime > 0 && (
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-3">
              <Clock className="h-3.5 w-3.5" />
              <span>Generated in {generationTime.toFixed(1)}s</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map(({ key, icon: Icon, label, color }) => (
          <div
            key={key}
            className="rounded-xl border border-border/60 bg-card/50 p-4 text-center transition-colors hover:border-brand/30"
          >
            <Icon className={`h-4 w-4 mx-auto mb-2 ${color}`} />
            <div className={`text-2xl font-bold font-mono ${color}`}>{statValues[key]}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
              {label}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Generated components
        </p>
        <div className="flex flex-wrap gap-2">
          {result.summary.components.map((component) => (
            <Badge
              key={component}
              variant="outline"
              className="gap-1.5 py-1.5 px-3 border-brand/20 bg-brand/5 font-mono text-xs"
            >
              <Check className="h-3 w-3 text-emerald-500" />
              {component}
            </Badge>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border/60 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60 bg-muted/40">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Terminal className="h-3.5 w-3.5" />
            <span>Equivalent CLI command</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onCopyCommand} className="gap-1.5 h-7 text-xs">
            {copied ? <CheckCheck className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <code className="block text-[11px] sm:text-xs font-mono p-4 overflow-x-auto text-foreground/80 bg-[oklch(0.12_0.02_250)] dark:bg-[oklch(0.1_0.02_250)] text-emerald-400/90">
          <span className="text-brand">$</span> {cliCommand}
        </code>
      </div>

      <FileTree files={result.files} projectName={result.projectName} />

      <Alert className="border-brand/20 bg-brand/5">
        <Info className="h-4 w-4 text-brand" />
        <AlertDescription className="text-sm">
          <strong>Next steps:</strong> Extract the ZIP, run{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">make setup</code> in the project
          directory, and customize configs for your environment. Everything is production-ready out of the box.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <Button
          onClick={onDownload}
          size="lg"
          className="gap-2 px-8 bg-brand hover:bg-brand/90 text-brand-foreground shadow-lg shadow-brand/20"
        >
          <Download className="h-4 w-4" />
          Download ZIP
        </Button>
        <Button onClick={onReset} variant="outline" size="lg" className="gap-2 px-8 border-border/80">
          <RotateCcw className="h-4 w-4" />
          Generate Another
        </Button>
      </div>
    </div>
  );
}
