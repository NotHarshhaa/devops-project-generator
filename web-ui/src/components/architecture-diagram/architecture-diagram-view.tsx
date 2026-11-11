"use client";

import { useState } from "react";
import { ProjectConfig } from "@/lib/types";
import { generateMermaidCode } from "@/lib/diagram/generate-mermaid";
import { generateAdrDocument } from "@/lib/diagram/generate-adr";
import { CodeViewer } from "@/components/common/code-viewer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GitGraph,
  Copy,
  Check,
  Download,
  FileText,
  Workflow,
} from "lucide-react";

interface ArchitectureDiagramViewProps {
  config: ProjectConfig;
}

export function ArchitectureDiagramView({ config }: ArchitectureDiagramViewProps) {
  const [activeView, setActiveView] = useState<"visual" | "mermaid" | "adr">("visual");
  const [copiedMermaid, setCopiedMermaid] = useState(false);
  const [copiedAdr, setCopiedAdr] = useState(false);

  const mermaidCode = generateMermaidCode(config);
  const adrDocument = generateAdrDocument(config);

  const handleCopyMermaid = async () => {
    try {
      await navigator.clipboard.writeText(mermaidCode);
      setCopiedMermaid(true);
      setTimeout(() => setCopiedMermaid(false), 2000);
    } catch (err) {
      console.error("Failed to copy Mermaid code:", err);
    }
  };

  const handleCopyAdr = async () => {
    try {
      await navigator.clipboard.writeText(adrDocument);
      setCopiedAdr(true);
      setTimeout(() => setCopiedAdr(false), 2000);
    } catch (err) {
      console.error("Failed to copy ADR:", err);
    }
  };

  const handleDownloadAdr = () => {
    const blob = new Blob([adrDocument], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ADR-001-${config.projectName}-architecture.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadSvg = () => {
    const svgEl = document.getElementById("architecture-svg-canvas");
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${config.projectName}-architecture-topology.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* View Switcher & Action Export Bar */}
      <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-sm">
        {/* Mode Selector Tabs */}
        <div className="inline-flex items-center gap-1 p-1 bg-muted/70 rounded-xl border border-border/60 overflow-x-auto max-w-full scrollbar-none">
          <button
            onClick={() => setActiveView("visual")}
            className={`text-xs font-medium px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeView === "visual"
                ? "bg-background text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Workflow className="h-3.5 w-3.5 text-cyan-500" strokeWidth={1.8} />
            Visual Topology
          </button>
          <button
            onClick={() => setActiveView("mermaid")}
            className={`text-xs font-medium px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeView === "mermaid"
                ? "bg-background text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GitGraph className="h-3.5 w-3.5 text-indigo-500" strokeWidth={1.8} />
            Mermaid Source
          </button>
          <button
            onClick={() => setActiveView("adr")}
            className={`text-xs font-medium px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeView === "adr"
                ? "bg-background text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-emerald-500" strokeWidth={1.8} />
            Architecture ADR
          </button>
        </div>

        {/* Global Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {activeView === "mermaid" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyMermaid}
              className="text-xs gap-1.5 h-9 rounded-lg"
            >
              {copiedMermaid ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedMermaid ? "Copied" : "Copy Mermaid"}
            </Button>
          )}
          {activeView === "adr" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyAdr}
              className="text-xs gap-1.5 h-9 rounded-lg"
            >
              {copiedAdr ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedAdr ? "Copied" : "Copy ADR"}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadSvg}
            className="text-xs gap-1.5 h-9 rounded-lg"
          >
            <Download className="h-3.5 w-3.5" />
            Download SVG
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadAdr}
            className="text-xs gap-1.5 h-9 rounded-lg"
          >
            <FileText className="h-3.5 w-3.5" />
            Download ADR
          </Button>
        </div>
      </div>

      {/* Main Content Area depending on active view */}
      {activeView === "visual" && (
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-8 w-full overflow-hidden shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-border/60">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                DECLARATIVE TOPOLOGY MAP
              </span>
              <h3 className="text-xl font-bold text-foreground mt-0.5">
                End-to-End Delivery Architecture
              </h3>
            </div>
            <Badge variant="outline" className="font-mono text-[10px] uppercase border-cyan-500/30 text-cyan-600 dark:text-cyan-400">
              LIVE COMPILED
            </Badge>
          </div>

          {/* Interactive Responsive SVG Canvas */}
          <div className="w-full overflow-x-auto pb-4">
            <svg
              id="architecture-svg-canvas"
              viewBox="0 0 960 420"
              className="w-full min-w-[760px] h-auto rounded-xl bg-muted/20 border border-border/40 p-2"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <marker
                  id="arrow-cyan"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#06b6d4" />
                </marker>
              </defs>

              {/* Column 1: CI/CD Pipeline & Source */}
              <text x="120" y="30" fill="currentColor" opacity="0.6" fontSize="11" fontWeight="600" textAnchor="middle" className="font-mono">
                STAGE 01: CI/CD &amp; AUTOMATION
              </text>
              <rect x="30" y="45" width="180" height="340" rx="10" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.15" strokeDasharray="4 4" />

              {/* Node: Git Repository */}
              <rect x="45" y="70" width="150" height="50" rx="8" fill="var(--card)" stroke="var(--border)" strokeWidth="1.5" />
              <text x="120" y="93" fill="currentColor" fontSize="12" fontWeight="bold" textAnchor="middle">Git Repository</text>
              <text x="120" y="108" fill="currentColor" opacity="0.6" fontSize="10" textAnchor="middle">Trunk-Based / PR Flow</text>

              {/* Connection: Repo to CI */}
              <line x1="120" y1="120" x2="120" y2="155" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrow-cyan)" />

              {/* Node: CI Engine */}
              <rect x="45" y="160" width="150" height="60" rx="8" fill="var(--card)" stroke="#06b6d4" strokeWidth="1.5" />
              <text x="120" y="184" fill="#06b6d4" fontSize="12" fontWeight="bold" textAnchor="middle">CI Pipeline</text>
              <text x="120" y="202" fill="currentColor" fontSize="10" textAnchor="middle">{config.ci.toUpperCase()}</text>

              {/* Connection: CI to Pipeline Runner */}
              <line x1="120" y1="220" x2="120" y2="255" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrow-cyan)" />

              {/* Node: Pipeline Runtime */}
              <rect x="45" y="260" width="150" height="55" rx="8" fill="var(--card)" stroke="var(--border)" strokeWidth="1.5" />
              <text x="120" y="283" fill="currentColor" fontSize="11" fontWeight="bold" textAnchor="middle">Application Framework</text>
              <text x="120" y="299" fill="currentColor" opacity="0.6" fontSize="10" textAnchor="middle">{config.pipeline}</text>

              {/* Horizontal Connection: CI/CD to Governance */}
              <path d="M 195 190 L 275 190" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrow-cyan)" />

              {/* Column 2: Security & Supply Chain */}
              <text x="360" y="30" fill="currentColor" opacity="0.6" fontSize="11" fontWeight="600" textAnchor="middle" className="font-mono">
                STAGE 02: SUPPLY CHAIN SECURITY
              </text>
              <rect x="270" y="45" width="180" height="340" rx="10" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.15" strokeDasharray="4 4" />

              {/* Node: Container Security Scanner */}
              <rect x="285" y="70" width="150" height="60" rx="8" fill="var(--card)" stroke="var(--border)" strokeWidth="1.5" />
              <text x="360" y="93" fill="currentColor" fontSize="12" fontWeight="bold" textAnchor="middle">Vulnerability Gate</text>
              <text x="360" y="110" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">TRIVY + GITLEAKS</text>

              {/* Node: Compliance Baseline */}
              <rect x="285" y="160" width="150" height="60" rx="8" fill="var(--card)" stroke="var(--border)" strokeWidth="1.5" />
              <text x="360" y="184" fill="currentColor" fontSize="12" fontWeight="bold" textAnchor="middle">Compliance Standard</text>
              <text x="360" y="202" fill="currentColor" opacity="0.7" fontSize="10" textAnchor="middle">{config.security.toUpperCase()}</text>

              {/* Node: Container Sandbox */}
              <rect x="285" y="260" width="150" height="60" rx="8" fill="var(--card)" stroke="var(--border)" strokeWidth="1.5" />
              <text x="360" y="284" fill="currentColor" fontSize="12" fontWeight="bold" textAnchor="middle">DevContainer Sandbox</text>
              <text x="360" y="300" fill="currentColor" opacity="0.7" fontSize="10" textAnchor="middle">VS Code / Codespaces</text>

              {/* Connections in Security */}
              <line x1="360" y1="130" x2="360" y2="155" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrow-cyan)" />
              <line x1="360" y1="220" x2="360" y2="255" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrow-cyan)" />

              {/* Horizontal Connection: Security to Orchestration */}
              <path d="M 435 190 L 515 190" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrow-cyan)" />

              {/* Column 3: Orchestration & Cloud */}
              <text x="600" y="30" fill="currentColor" opacity="0.6" fontSize="11" fontWeight="600" textAnchor="middle" className="font-mono">
                STAGE 03: CLOUD TOPOLOGY
              </text>
              <rect x="510" y="45" width="180" height="340" rx="10" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.15" strokeDasharray="4 4" />

              {/* Node: Terraform Infrastructure */}
              <rect x="525" y="70" width="150" height="65" rx="8" fill="var(--card)" stroke="#6366f1" strokeWidth="1.5" />
              <text x="600" y="94" fill="#6366f1" fontSize="12" fontWeight="bold" textAnchor="middle">Infrastructure as Code</text>
              <text x="600" y="112" fill="currentColor" fontSize="10" textAnchor="middle">{config.infra.toUpperCase()}</text>

              {/* Connection: IaC to Deploy */}
              <line x1="600" y1="135" x2="600" y2="165" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrow-cyan)" />

              {/* Node: Deployment Strategy */}
              <rect x="525" y="170" width="150" height="65" rx="8" fill="var(--card)" stroke="var(--border)" strokeWidth="1.5" />
              <text x="600" y="194" fill="currentColor" fontSize="12" fontWeight="bold" textAnchor="middle">Deployment Pattern</text>
              <text x="600" y="212" fill="currentColor" opacity="0.7" fontSize="10" textAnchor="middle">{config.deploy.toUpperCase()}</text>

              {/* Connection: Deploy to Envs */}
              <line x1="600" y1="235" x2="600" y2="265" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrow-cyan)" />

              {/* Node: Envs */}
              <rect x="525" y="270" width="150" height="50" rx="8" fill="var(--card)" stroke="var(--border)" strokeWidth="1.5" />
              <text x="600" y="292" fill="currentColor" fontSize="11" fontWeight="bold" textAnchor="middle">ENVIRONMENTS</text>
              <text x="600" y="307" fill="currentColor" opacity="0.6" fontSize="9" textAnchor="middle">{config.envs.toUpperCase()}</text>

              {/* Connection: Deploy to Observability */}
              <path d="M 675 200 L 745 200" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrow-cyan)" />

              {/* Column 4: Observability */}
              <text x="825" y="30" fill="currentColor" opacity="0.6" fontSize="11" fontWeight="600" textAnchor="middle" className="font-mono">
                STAGE 04: OBSERVABILITY
              </text>
              <rect x="740" y="45" width="180" height="340" rx="10" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.15" strokeDasharray="4 4" />

              {/* Node: Observability Stack */}
              <rect x="755" y="110" width="150" height="75" rx="8" fill="var(--card)" stroke="#10b981" strokeWidth="1.5" />
              <text x="830" y="135" fill="#10b981" fontSize="12" fontWeight="bold" textAnchor="middle">Observability &amp; APM</text>
              <text x="830" y="152" fill="currentColor" fontSize="10" textAnchor="middle">{config.observability.toUpperCase()}</text>
              <text x="830" y="167" fill="currentColor" opacity="0.6" fontSize="9" textAnchor="middle">Prometheus / Alerts</text>

              {/* Connection: Obs to Dashboards */}
              <line x1="830" y1="185" x2="830" y2="215" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrow-cyan)" />

              {/* Node: Dashboards & Alerts */}
              <rect x="755" y="220" width="150" height="65" rx="8" fill="var(--card)" stroke="var(--border)" strokeWidth="1.5" />
              <text x="830" y="246" fill="currentColor" fontSize="11" fontWeight="bold" textAnchor="middle">Grafana Dashboards</text>
              <text x="830" y="263" fill="currentColor" opacity="0.7" fontSize="10" textAnchor="middle">Golden Signals (Latency/Sat)</text>
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/60 text-xs font-mono text-muted-foreground">
            <span>READY TO COMMIT: {config.projectName}</span>
            <div className="flex items-center gap-4">
              <span>● MERMAID V10 COMPATIBLE</span>
              <span>● SVG VECTOR SCALABLE</span>
            </div>
          </div>
        </div>
      )}

      {activeView === "mermaid" && (
        <div className="w-full">
          <div className="mb-3">
            <p className="text-sm text-muted-foreground">
              Copy and paste this raw Mermaid snippet directly into your GitHub <code className="font-mono text-foreground font-semibold">README.md</code>, pull request descriptions, or architecture documentation.
            </p>
          </div>
          <CodeViewer
            filename={`${config.projectName}-architecture.mermaid`}
            path={`diagrams/${config.projectName}-flow.mermaid`}
            content={mermaidCode}
            language="MERMAID"
            maxHeight="520px"
          />
        </div>
      )}

      {activeView === "adr" && (
        <div className="w-full">
          <div className="mb-3">
            <p className="text-sm text-muted-foreground">
              A formalized Architecture Decision Record (ADR-001) documenting the technical justification, consequences, and operational runbook for your repository.
            </p>
          </div>
          <CodeViewer
            filename={`ADR-001-${config.projectName}-architecture.md`}
            path={`docs/adr/ADR-001-devops-blueprint.md`}
            content={adrDocument}
            language="MARKDOWN"
            maxHeight="520px"
          />
        </div>
      )}
    </div>
  );
}
