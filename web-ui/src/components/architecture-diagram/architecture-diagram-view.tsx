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
  Share2,
  ExternalLink,
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
      <div className="border-2 border-foreground bg-background p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setActiveView("visual")}
            className={`font-mono text-xs uppercase tracking-wider px-3.5 py-2 border transition-colors duration-100 flex items-center gap-2 shrink-0 cursor-pointer ${
              activeView === "visual"
                ? "bg-foreground text-background border-foreground font-bold"
                : "bg-background text-foreground border-foreground/40 hover:border-foreground"
            }`}
          >
            <Workflow className="h-3.5 w-3.5" strokeWidth={1.5} />
            Visual Topology
          </button>
          <button
            onClick={() => setActiveView("mermaid")}
            className={`font-mono text-xs uppercase tracking-wider px-3.5 py-2 border transition-colors duration-100 flex items-center gap-2 shrink-0 cursor-pointer ${
              activeView === "mermaid"
                ? "bg-foreground text-background border-foreground font-bold"
                : "bg-background text-foreground border-foreground/40 hover:border-foreground"
            }`}
          >
            <GitGraph className="h-3.5 w-3.5" strokeWidth={1.5} />
            Mermaid.js Code
          </button>
          <button
            onClick={() => setActiveView("adr")}
            className={`font-mono text-xs uppercase tracking-wider px-3.5 py-2 border transition-colors duration-100 flex items-center gap-2 shrink-0 cursor-pointer ${
              activeView === "adr"
                ? "bg-foreground text-background border-foreground font-bold"
                : "bg-background text-foreground border-foreground/40 hover:border-foreground"
            }`}
          >
            <FileText className="h-3.5 w-3.5" strokeWidth={1.5} />
            Decision Record (ADR)
          </button>
        </div>

        {/* Global Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyMermaid}
            className="font-mono text-xs uppercase tracking-wider gap-1.5 h-9"
          >
            {copiedMermaid ? <Check className="h-3.5 w-3.5" strokeWidth={2} /> : <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />}
            {copiedMermaid ? "Copied" : "Copy Mermaid"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadSvg}
            className="font-mono text-xs uppercase tracking-wider gap-1.5 h-9"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
            Download SVG
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadAdr}
            className="font-mono text-xs uppercase tracking-wider gap-1.5 h-9"
          >
            <FileText className="h-3.5 w-3.5" strokeWidth={1.5} />
            Download ADR
          </Button>
        </div>
      </div>

      {/* Main Content Area depending on active view */}
      {activeView === "visual" && (
        <div className="border-2 border-foreground bg-background p-4 sm:p-8 w-full overflow-hidden">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-foreground/15">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                DECLARATIVE TOPOLOGY MAP
              </span>
              <h3 className="font-display font-bold text-xl text-foreground">
                End-to-End Delivery Architecture
              </h3>
            </div>
            <Badge variant="outline" className="font-mono text-[10px] uppercase">
              LIVE COMPILED
            </Badge>
          </div>

          {/* Interactive Responsive SVG Canvas */}
          <div className="w-full overflow-x-auto pb-4">
            <svg
              id="architecture-svg-canvas"
              viewBox="0 0 960 480"
              className="w-full min-w-[760px] h-auto font-mono text-xs select-none"
              style={{ background: "#ffffff" }}
            >
              <defs>
                <marker
                  id="arrow-black"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#000000" />
                </marker>
              </defs>

              {/* Stage Groups */}
              {/* Stage 1: Build & Source */}
              <rect x="20" y="40" width="220" height="380" fill="#fcfcfc" stroke="#000000" strokeWidth="1" strokeDasharray="3 3" />
              <text x="35" y="65" fill="#525252" fontSize="10" fontWeight="bold" letterSpacing="0.1em">01. INGESTION & CI</text>

              {/* Stage 2: Quality & Container */}
              <rect x="260" y="40" width="220" height="380" fill="#fcfcfc" stroke="#000000" strokeWidth="1" strokeDasharray="3 3" />
              <text x="275" y="65" fill="#525252" fontSize="10" fontWeight="bold" letterSpacing="0.1em">02. COMPLIANCE & BUILD</text>

              {/* Stage 3: Infrastructure & Deploy */}
              <rect x="500" y="40" width="220" height="380" fill="#fcfcfc" stroke="#000000" strokeWidth="1" strokeDasharray="3 3" />
              <text x="515" y="65" fill="#525252" fontSize="10" fontWeight="bold" letterSpacing="0.1em">03. CLUSTER & DELIVERY</text>

              {/* Stage 4: Observability */}
              <rect x="740" y="40" width="200" height="380" fill="#fcfcfc" stroke="#000000" strokeWidth="1" strokeDasharray="3 3" />
              <text x="755" y="65" fill="#525252" fontSize="10" fontWeight="bold" letterSpacing="0.1em">04. TELEMETRICS</text>

              {/* Node: Developer */}
              <rect x="40" y="100" width="180" height="55" fill="#000000" stroke="#000000" strokeWidth="2" />
              <text x="130" y="125" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">Developer Workstation</text>
              <text x="130" y="142" fill="#d4d4d4" fontSize="10" textAnchor="middle">Git Push / Branch PR</text>

              {/* Connection: Developer -> CI */}
              <line x1="130" y1="155" x2="130" y2="195" stroke="#000000" strokeWidth="2" markerEnd="url(#arrow-black)" />

              {/* Node: CI Engine */}
              <rect x="40" y="200" width="180" height="70" fill="#ffffff" stroke="#000000" strokeWidth="2" />
              <text x="130" y="228" fill="#000000" fontSize="11" fontWeight="bold" textAnchor="middle">CI Automation</text>
              <text x="130" y="246" fill="#000000" fontSize="11" textAnchor="middle">{config.ci.toUpperCase()}</text>
              <text x="130" y="260" fill="#525252" fontSize="9" textAnchor="middle">Parallel Runners</text>

              {/* Connection: CI -> Stage 2 */}
              <path d="M 220 235 L 260 235" stroke="#000000" strokeWidth="2" markerEnd="url(#arrow-black)" />

              {/* Node: Security Scan */}
              <rect x="280" y="100" width="180" height="65" fill="#ffffff" stroke="#000000" strokeWidth="2" />
              <text x="370" y="125" fill="#000000" fontSize="11" fontWeight="bold" textAnchor="middle">Security &amp; Compliance</text>
              <text x="370" y="142" fill="#525252" fontSize="10" textAnchor="middle">{config.security.toUpperCase()}</text>
              <text x="370" y="156" fill="#525252" fontSize="9" textAnchor="middle">Trivy + Cosign Audit</text>

              {/* Node: Container Build */}
              <rect x="280" y="200" width="180" height="70" fill="#ffffff" stroke="#000000" strokeWidth="2" />
              <text x="370" y="228" fill="#000000" fontSize="11" fontWeight="bold" textAnchor="middle">OCI Container Engine</text>
              <text x="370" y="246" fill="#000000" fontSize="10" textAnchor="middle">{config.pipeline}</text>
              <text x="370" y="260" fill="#525252" fontSize="9" textAnchor="middle">Multi-Stage Build</text>

              {/* Connection: Scan to Container */}
              <line x1="370" y1="165" x2="370" y2="195" stroke="#000000" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrow-black)" />

              {/* Connection: Container to Stage 3 */}
              <path d="M 460 235 L 500 235" stroke="#000000" strokeWidth="2" markerEnd="url(#arrow-black)" />

              {/* Node: Infrastructure Cluster */}
              <rect x="520" y="100" width="180" height="65" fill="#000000" stroke="#000000" strokeWidth="2" />
              <text x="610" y="125" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Cloud Infrastructure</text>
              <text x="610" y="142" fill="#d4d4d4" fontSize="10" textAnchor="middle">{config.infra.toUpperCase()}</text>
              <text x="610" y="156" fill="#a3a3a3" fontSize="9" textAnchor="middle">Terraform Provisioned</text>

              {/* Connection: Infra -> Cluster Deploy */}
              <line x1="610" y1="165" x2="610" y2="195" stroke="#000000" strokeWidth="2" markerEnd="url(#arrow-black)" />

              {/* Node: Deployment Strategy */}
              <rect x="520" y="200" width="180" height="70" fill="#ffffff" stroke="#000000" strokeWidth="2" />
              <text x="610" y="228" fill="#000000" fontSize="11" fontWeight="bold" textAnchor="middle">Deployment Engine</text>
              <text x="610" y="246" fill="#000000" fontSize="10" textAnchor="middle">{config.deploy.toUpperCase()}</text>
              <text x="610" y="260" fill="#525252" fontSize="9" textAnchor="middle">Zero-Downtime Traffic Shift</text>

              {/* Connection: Deployment to Environments */}
              <line x1="610" y1="270" x2="610" y2="305" stroke="#000000" strokeWidth="2" markerEnd="url(#arrow-black)" />

              {/* Node: Envs */}
              <rect x="520" y="310" width="180" height="50" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
              <text x="610" y="332" fill="#000000" fontSize="10" fontWeight="bold" textAnchor="middle">ENVIRONMENTS</text>
              <text x="610" y="347" fill="#525252" fontSize="9" textAnchor="middle">{config.envs.toUpperCase()}</text>

              {/* Connection: Deploy to Observability */}
              <path d="M 700 235 L 740 235" stroke="#000000" strokeWidth="2" markerEnd="url(#arrow-black)" />

              {/* Node: Observability Stack */}
              <rect x="750" y="100" width="180" height="75" fill="#000000" stroke="#000000" strokeWidth="2" />
              <text x="840" y="125" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Observability &amp; APM</text>
              <text x="840" y="142" fill="#d4d4d4" fontSize="10" textAnchor="middle">{config.observability.toUpperCase()}</text>
              <text x="840" y="156" fill="#a3a3a3" fontSize="9" textAnchor="middle">Scrape &amp; Alert Rules</text>

              {/* Node: Dashboards & Alerts */}
              <rect x="750" y="200" width="180" height="65" fill="#ffffff" stroke="#000000" strokeWidth="2" />
              <text x="840" y="228" fill="#000000" fontSize="11" fontWeight="bold" textAnchor="middle">Grafana Dashboards</text>
              <text x="840" y="246" fill="#525252" fontSize="10" textAnchor="middle">Golden Signals (Latency/Sat)</text>
              <text x="840" y="258" fill="#525252" fontSize="9" textAnchor="middle">PagerDuty / Slack Hooks</text>

              {/* Connection: Obs to Dashboards */}
              <line x1="840" y1="175" x2="840" y2="195" stroke="#000000" strokeWidth="2" markerEnd="url(#arrow-black)" />
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-foreground/10 text-xs font-mono text-muted-foreground">
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
          <div className="mb-3 flex items-center justify-between">
            <p className="font-serif text-sm text-muted-foreground">
              Copy and paste this raw Mermaid snippet directly into your GitHub <code className="font-mono text-foreground font-bold">README.md</code>, pull request descriptions, or Notion engineering docs.
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
          <div className="mb-3 flex items-center justify-between">
            <p className="font-serif text-sm text-muted-foreground">
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
