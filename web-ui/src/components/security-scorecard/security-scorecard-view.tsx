"use client";

import { useState } from "react";
import { ProjectConfig } from "@/lib/types";
import {
  SECURITY_CONTROLS,
  calculateComplianceScores,
  generateComplianceReport,
} from "@/lib/security/compliance-engine";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Copy,
  CheckCheck,
  Check,
  Shield,
} from "lucide-react";

interface SecurityScorecardViewProps {
  config: ProjectConfig;
  onUpdateConfig?: (config: ProjectConfig) => void;
}

export function SecurityScorecardView({ config, onUpdateConfig }: SecurityScorecardViewProps) {
  const [activeControlIds, setActiveControlIds] = useState<string[]>(
    config.securityAddons || ["cosign", "sbom", "trivy", "gitleaks", "rbac"]
  );
  const [copied, setCopied] = useState(false);

  const scores = calculateComplianceScores(activeControlIds, config);

  const toggleControl = (id: string) => {
    let next: string[];
    if (activeControlIds.includes(id)) {
      next = activeControlIds.filter((c) => c !== id);
    } else {
      next = [...activeControlIds, id];
    }
    setActiveControlIds(next);

    if (onUpdateConfig) {
      onUpdateConfig({
        ...config,
        securityAddons: next,
      });
    }
  };

  const handleDownloadReport = () => {
    const report = generateComplianceReport(config, activeControlIds, scores);
    const blob = new Blob([report], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `COMPLIANCE-AUDIT-${config.projectName || "devops-stack"}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyReport = () => {
    const report = generateComplianceReport(config, activeControlIds, scores);
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in w-full max-w-full">
      {/* Header */}
      <div className="border-b border-border/60 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-semibold">
                GOVERNANCE &amp; SECURITY AUDIT
              </span>
              <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                LIVE GAUGE
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Compliance &amp; Security Scorecard
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Audit your infrastructure against CIS Benchmarks, SOC 2 Type II, NIST SP 800-53, HIPAA, and SLSA Level 3 supply chain standards.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm" onClick={handleCopyReport} className="gap-1.5 text-xs rounded-lg">
              {copied ? <CheckCheck className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy Audit"}
            </Button>
            <Button size="sm" onClick={handleDownloadReport} className="gap-1.5 text-xs rounded-lg bg-brand hover:bg-brand/90 text-brand-foreground font-semibold">
              <Download className="h-3.5 w-3.5" />
              Download Audit.md
            </Button>
          </div>
        </div>
      </div>

      {/* Central Security Gauge Block */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Grade Metric */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-border/60 pb-6 lg:pb-0 lg:pr-8 text-center lg:text-left flex flex-col items-center lg:items-start">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
              Overall Security Posture
            </span>
            <div className="flex items-baseline gap-3 my-2">
              <span className="text-6xl sm:text-7xl font-extrabold text-foreground leading-none">
                {scores.overallGrade}
              </span>
              <span className="font-mono text-2xl font-bold text-muted-foreground">
                / {scores.overallScore}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {scores.overallScore >= 90
                ? "Enterprise Grade: Meets strict zero-trust and defense-in-depth criteria."
                : scores.overallScore >= 75
                ? "Hardened Baseline: Suitable for high-availability production workloads."
                : "Standard Configuration: Additional supply-chain controls recommended."}
            </p>
          </div>

          {/* Framework Gauges Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-border/80 p-4 bg-muted/40">
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
                CIS Kubernetes
              </span>
              <div className="font-mono text-2xl font-bold text-foreground">
                {scores.cisScore}%
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-2.5">
                <div className="h-full bg-cyan-500 rounded-full transition-all duration-300" style={{ width: `${scores.cisScore}%` }} />
              </div>
            </div>

            <div className="rounded-xl border border-border/80 p-4 bg-muted/40">
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
                SOC 2 Type II
              </span>
              <div className="font-mono text-2xl font-bold text-foreground">
                {scores.soc2Score}%
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-2.5">
                <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${scores.soc2Score}%` }} />
              </div>
            </div>

            <div className="rounded-xl border border-border/80 p-4 bg-muted/40">
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
                NIST SP 800-53
              </span>
              <div className="font-mono text-2xl font-bold text-foreground">
                {scores.nistScore}%
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-2.5">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${scores.nistScore}%` }} />
              </div>
            </div>

            <div className="rounded-xl border border-border/80 p-4 bg-muted/40">
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
                Supply Chain
              </span>
              <div className="font-mono text-base font-bold text-foreground truncate mt-1">
                SLSA {scores.slsaLevel}
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-3">
                <div
                  className="h-full bg-teal-500 rounded-full transition-all duration-300"
                  style={{
                    width: scores.slsaLevel === "Level 3" ? "100%" : scores.slsaLevel === "Level 2" ? "66%" : "33%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Security Controls Checklist */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground">Interactive Security Controls</h3>
            <p className="text-xs text-muted-foreground">
              Toggle controls on/off to see live compliance impact and generate corresponding manifest artifacts.
            </p>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {activeControlIds.length} of {SECURITY_CONTROLS.length} active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SECURITY_CONTROLS.map((control) => {
            const isChecked = activeControlIds.includes(control.id);
            return (
              <div
                key={control.id}
                onClick={() => toggleControl(control.id)}
                className={`rounded-xl border p-4 sm:p-5 transition-all cursor-pointer select-none ${
                  isChecked
                    ? "border-brand/60 bg-brand/5 shadow-xs"
                    : "border-border/70 bg-card/60 opacity-70 hover:opacity-100 hover:border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors ${
                        isChecked
                          ? "border-brand bg-brand text-brand-foreground"
                          : "border-border bg-background"
                      }`}
                    >
                      {isChecked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                    </div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {control.name}
                    </h4>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px] shrink-0 border-border/80">
                    {control.tool}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground pl-8.5 mb-3 leading-relaxed">
                  {control.description}
                </p>

                <div className="pl-8.5 flex flex-wrap gap-1.5 items-center">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground mr-1">
                    Target:
                  </span>
                  {control.frameworks.map((fw) => (
                    <span
                      key={fw}
                      className="font-mono text-[9px] rounded-md border border-border/60 px-2 py-0.5 bg-muted/60 text-muted-foreground"
                    >
                      {fw}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-World Artifact Reference Box */}
      <div className="rounded-xl border border-border/80 p-5 bg-muted/30 font-mono text-xs space-y-3">
        <div className="flex items-center gap-2 font-semibold text-foreground tracking-wide">
          <Shield className="h-4 w-4 text-cyan-500" />
          <span>Manifests Generated by Active Controls</span>
        </div>
        <p className="text-muted-foreground text-xs font-sans">
          When you scaffold or download this repository, the enabled security controls automatically generate real configuration files:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <div className="rounded-lg border border-border/60 p-3 bg-card/80">
            <span className="text-foreground font-semibold text-xs">.github/workflows/cosign-sign.yml</span>
            <p className="text-[11px] text-muted-foreground mt-0.5 font-sans">Keyless Sigstore OIDC image signing</p>
          </div>
          <div className="rounded-lg border border-border/60 p-3 bg-card/80">
            <span className="text-foreground font-semibold text-xs">.github/workflows/syft-sbom.yml</span>
            <p className="text-[11px] text-muted-foreground mt-0.5 font-sans">CycloneDX &amp; SPDX supply-chain metadata</p>
          </div>
          <div className="rounded-lg border border-border/60 p-3 bg-card/80">
            <span className="text-foreground font-semibold text-xs">.gitleaks.toml</span>
            <p className="text-[11px] text-muted-foreground mt-0.5 font-sans">Pre-commit token &amp; private key detection</p>
          </div>
          <div className="rounded-lg border border-border/60 p-3 bg-card/80">
            <span className="text-foreground font-semibold text-xs">k8s/security-policies.yaml</span>
            <p className="text-[11px] text-muted-foreground mt-0.5 font-sans">PodDisruptionBudget, RBAC, NetworkPolicies</p>
          </div>
        </div>
      </div>
    </div>
  );
}
