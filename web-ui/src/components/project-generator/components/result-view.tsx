"use client";

import { useState } from "react";
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
  Github,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Cpu,
} from "lucide-react";
import { FileTree } from "../file-tree";
import { buildCliCommand } from "../utils";
import { GitHubScaffoldDialog } from "./github-scaffold-dialog";

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
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [showLintDetails, setShowLintDetails] = useState(false);
  const [copiedBootstrap, setCopiedBootstrap] = useState(false);

  const cliCommand = buildCliCommand(config);
  const envCount = config.envs === "single" ? 1 : config.envs.split(",").length;
  const validation = result.summary.validationReport;
  const breakdown = result.summary.fileBreakdown;

  const statValues = {
    files: result.summary.totalFiles,
    dirs: result.summary.totalDirs,
    components: result.summary.components.length,
    envs: envCount,
  };

  const handleCopyBootstrap = () => {
    navigator.clipboard.writeText(`bash scripts/bootstrap-local.sh`);
    setCopiedBootstrap(true);
    setTimeout(() => setCopiedBootstrap(false), 2000);
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-linear-to-br from-emerald-500/10 via-brand/5 to-transparent p-6 sm:p-8 text-center brand-glow">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="relative">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30">
              <Check className="h-8 w-8 text-emerald-500" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-brand" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Project ready to ship</h2>
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
              {result.summary.estimatedSetupTimeMinutes && (
                <>
                  <span>•</span>
                  <span>Estimated local setup: ~{result.summary.estimatedSetupTimeMinutes} mins</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stat Cards */}
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

      {/* Manifest Linter & Spec Compliance Report */}
      {validation && (
        <div className="rounded-xl border border-border/80 bg-card p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-foreground">
                    Automated Manifest Linter &amp; Spec Audit
                  </h4>
                  <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                    GRADE {validation.grade}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Static analysis verified {validation.checksPassed} of {validation.totalChecks} cloud-native best practice checks
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right">
                <span className="text-xl font-bold font-mono text-emerald-500">
                  {validation.score}%
                </span>
                <span className="text-[11px] text-muted-foreground block">Pass Rate</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLintDetails(!showLintDetails)}
                className="gap-1.5 text-xs rounded-lg"
              >
                {showLintDetails ? "Hide Checks" : "View Checks"}
                {showLintDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>

          {showLintDetails && (
            <div className="pt-2 border-t border-border/60 grid grid-cols-1 md:grid-cols-2 gap-2.5 animate-fade-in">
              {validation.checks.map((check) => (
                <div
                  key={check.id}
                  className="rounded-lg border border-border/60 p-3 bg-muted/20 text-xs flex items-start gap-2.5"
                >
                  <div
                    className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      check.status === "pass"
                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-foreground">{check.name}</p>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      {check.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* File Breakdown Badges */}
      {breakdown && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            File Manifest Breakdown
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <span className="rounded-md border border-border/70 px-2.5 py-1 bg-muted/40 text-foreground">
              YAML: <strong>{breakdown.yaml}</strong>
            </span>
            <span className="rounded-md border border-border/70 px-2.5 py-1 bg-muted/40 text-foreground">
              Terraform / Tofu: <strong>{breakdown.terraform}</strong>
            </span>
            <span className="rounded-md border border-border/70 px-2.5 py-1 bg-muted/40 text-foreground">
              Dockerfiles: <strong>{breakdown.docker}</strong>
            </span>
            <span className="rounded-md border border-border/70 px-2.5 py-1 bg-muted/40 text-foreground">
              Shell Scripts: <strong>{breakdown.scripts}</strong>
            </span>
            <span className="rounded-md border border-border/70 px-2.5 py-1 bg-muted/40 text-foreground">
              Documentation: <strong>{breakdown.documentation}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Components list */}
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

      {/* CLI & Local Emulation Bootstrap Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* CLI Command */}
        <div className="rounded-xl border border-border/60 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-muted/40">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Terminal className="h-3.5 w-3.5" />
              <span>Equivalent CLI command</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onCopyCommand} className="gap-1.5 h-6 text-xs">
              {copied ? <CheckCheck className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <code className="terminal-panel block text-[11px] font-mono p-3 overflow-x-auto">
            <span className="text-brand">$</span> <span className="terminal-accent">{cliCommand}</span>
          </code>
        </div>

        {/* Local Kind Bootstrap */}
        <div className="rounded-xl border border-border/60 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-muted/40">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Cpu className="h-3.5 w-3.5 text-cyan-500" />
              <span>Instant Local Cluster (Kind)</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleCopyBootstrap} className="gap-1.5 h-6 text-xs">
              {copiedBootstrap ? <CheckCheck className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
              {copiedBootstrap ? "Copied!" : "Copy"}
            </Button>
          </div>
          <code className="terminal-panel block text-[11px] font-mono p-3 overflow-x-auto">
            <span className="text-cyan-500">$</span> <span className="terminal-accent">bash scripts/bootstrap-local.sh</span>
          </code>
        </div>
      </div>

      {/* Interactive File Tree */}
      <FileTree files={result.files} projectName={result.projectName} />

      <Alert className="border-brand/20 bg-brand/5 rounded-xl">
        <Info className="h-4 w-4 text-brand" />
        <AlertDescription className="text-xs sm:text-sm leading-relaxed">
          <strong>Production Next Steps:</strong> Extract the ZIP or push directly to GitHub, run{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">make setup</code>, or execute{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">bash scripts/bootstrap-local.sh</code> to test with an in-memory cluster in under 60 seconds.
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <Button
          onClick={onDownload}
          size="lg"
          className="gap-2 px-6 rounded-lg bg-brand hover:bg-brand/90 text-brand-foreground font-semibold shadow-xs"
        >
          <Download className="h-4 w-4" />
          Download ZIP
        </Button>
        <Button
          onClick={() => setIsGitHubModalOpen(true)}
          size="lg"
          variant="outline"
          className="gap-2 px-6 rounded-lg border-border hover:bg-muted"
        >
          <Github className="h-4 w-4" />
          Push to GitHub
        </Button>
        <Button onClick={onReset} variant="outline" size="lg" className="gap-2 px-6 rounded-lg border-border hover:bg-muted">
          <RotateCcw className="h-4 w-4" />
          Generate Another
        </Button>
      </div>

      <GitHubScaffoldDialog
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        projectName={result.projectName}
        files={result.files}
      />
    </div>
  );
}
