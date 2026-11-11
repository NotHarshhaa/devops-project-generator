"use client";

import { useState, useMemo } from "react";
import { useConfig } from "@/lib/config-context";
import { getPreviewableFiles, PreviewableFile } from "@/lib/generator/file-preview-helpers";
import { CodeViewer } from "@/components/common/code-viewer";
import { SectionHeader } from "./section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectConfig } from "@/lib/types";
import {
  FileCode,
  FolderTree,
  ArrowRight,
  Search,
  Layers,
  Ship,
  Shield,
  Activity,
  Terminal,
  Sparkles,
} from "lucide-react";

const EXPLORER_PRESETS: Array<{
  id: string;
  label: string;
  badge: string;
  icon: string;
  config: Partial<ProjectConfig>;
}> = [
  {
    id: "active",
    label: "Active Stack",
    badge: "CUSTOM",
    icon: "sparkles",
    config: {},
  },
  {
    id: "opentofu",
    label: "OpenTofu & Zero-Trust",
    badge: "OPENTOFU 1.8+",
    icon: "shield",
    config: {
      projectName: "tofu-zero-trust-platform",
      pipeline: "go",
      infra: "opentofu-aws",
      ci: "github-actions",
      deploy: "gitops-argocd",
      observability: "opentelemetry",
      security: "zero-trust",
      devcontainer: "full",
      securityAddons: ["cosign", "sbom", "trivy", "gitleaks", "rbac", "infracost", "precommit"],
    },
  },
  {
    id: "finops",
    label: "FinOps & KEDA Scale",
    badge: "COST GUARDRAIL",
    icon: "cpu",
    config: {
      projectName: "finops-cloud-stack",
      pipeline: "python",
      infra: "aws-vpc-eks",
      ci: "github-actions",
      deploy: "gitops-argocd",
      observability: "prometheus-grafana",
      security: "soc2",
      devcontainer: "full",
      securityAddons: ["infracost", "scorecard", "precommit", "dependabot", "gitleaks"],
    },
  },
  {
    id: "crossplane",
    label: "Crossplane K8s Control Plane",
    badge: "STATELESS IAC",
    icon: "layers",
    config: {
      projectName: "crossplane-k8s-platform",
      pipeline: "nodejs-typescript",
      infra: "crossplane-kubernetes",
      ci: "argo-workflows",
      deploy: "canary",
      observability: "opentelemetry",
      security: "cis-benchmarks",
      devcontainer: "minimal",
      securityAddons: ["cosign", "sbom", "rbac", "precommit"],
    },
  },
  {
    id: "enterprise",
    label: "Enterprise Microservices",
    badge: "ENTERPRISE",
    icon: "ship",
    config: {
      projectName: "enterprise-mesh-app",
      pipeline: "java-maven",
      infra: "azure-vnet-aks",
      ci: "gitlab-ci",
      deploy: "gitops-argocd",
      observability: "datadog",
      security: "soc2",
      devcontainer: "full",
      securityAddons: ["cosign", "sbom", "trivy", "gitleaks", "rbac"],
    },
  },
];

export function GeneratedOutputSection() {
  const { config: globalConfig } = useConfig();
  const [selectedPresetId, setSelectedPresetId] = useState<string>("active");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Compute active preview config based on selected preset
  const activeConfig = useMemo<ProjectConfig>(() => {
    if (selectedPresetId === "active") return globalConfig;
    const preset = EXPLORER_PRESETS.find((p) => p.id === selectedPresetId);
    if (!preset) return globalConfig;
    return { ...globalConfig, ...preset.config };
  }, [globalConfig, selectedPresetId]);

  const previewFiles = useMemo(() => getPreviewableFiles(activeConfig), [activeConfig]);

  const categories = useMemo(() => {
    const counts: Record<string, number> = {
      all: previewFiles.length,
      infra: previewFiles.filter((f) => f.category === "infra").length,
      deploy: previewFiles.filter((f) => f.category === "deploy").length,
      security: previewFiles.filter((f) => f.category === "security").length,
      ci: previewFiles.filter((f) => f.category === "ci").length,
      observability: previewFiles.filter((f) => f.category === "observability").length,
      scripts: previewFiles.filter((f) => f.category === "scripts").length,
    };

    return [
      { id: "all", label: "All Manifests", count: counts.all },
      { id: "infra", label: "IaC & OpenTofu", count: counts.infra },
      { id: "deploy", label: "Deploy & K8s", count: counts.deploy },
      { id: "security", label: "Security & FinOps", count: counts.security },
      { id: "ci", label: "CI/CD Workflows", count: counts.ci },
      { id: "observability", label: "Observability", count: counts.observability },
      { id: "scripts", label: "Dev Scripts", count: counts.scripts },
    ];
  }, [previewFiles]);

  const filteredFiles = useMemo(() => {
    let list = previewFiles;
    if (activeCategory !== "all") {
      list = list.filter((f) => f.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.relativePath.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.categoryLabel.toLowerCase().includes(q)
      );
    }
    return list;
  }, [previewFiles, activeCategory, searchQuery]);

  // Selected file state with graceful fallback
  const [selectedFilePath, setSelectedFilePath] = useState<string>("");

  const selectedFile = useMemo(() => {
    if (filteredFiles.length === 0) return null;
    const found = filteredFiles.find((f) => f.path === selectedFilePath);
    return found || filteredFiles[0];
  }, [filteredFiles, selectedFilePath]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const getCategoryIcon = (category: PreviewableFile["category"]) => {
    switch (category) {
      case "infra":
        return Layers;
      case "deploy":
        return Ship;
      case "security":
        return Shield;
      case "observability":
        return Activity;
      case "scripts":
        return Terminal;
      default:
        return FileCode;
    }
  };

  return (
    <section id="output-section" className="container mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28 w-full max-w-full overflow-hidden">
      <SectionHeader
        badge="INTERACTIVE ARTIFACT EXPLORER"
        title="Inspect Production Manifests Live"
        description="Every template is compiled in-browser according to real cloud architecture patterns. Test presets, search manifests, and inspect runnable configs before deploying."
      />

      {/* Preset Architecture Switcher Pills */}
      <div className="mb-6 p-2 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xs">
        <div className="flex items-center justify-between px-3 py-2 text-xs border-b border-border/60 mb-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
            Switch Live Topology Preset
          </span>
          <span className="font-mono text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold">
            {activeConfig.projectName}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {EXPLORER_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setSelectedPresetId(preset.id);
                  setSelectedFilePath("");
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium shrink-0 transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-brand text-brand-foreground border-brand font-semibold shadow-xs"
                    : "border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span>{preset.label}</span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md ${
                    isSelected ? "bg-black/20 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {preset.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6 pb-4 border-b border-border/60">
        {/* Category Pills */}
        <div className="inline-flex items-center gap-1 p-1 bg-muted/60 rounded-xl border border-border/60 overflow-x-auto max-w-full scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{cat.label}</span>
              <span className="text-[10px] font-mono opacity-70">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="h-3.5 w-3.5 absolute left-3 top-3 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search manifests..."
            className="pl-8.5 pr-3 h-9 text-xs rounded-xl font-mono border-border/80 bg-card/60"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Split Interactive View: File Selector (Left) + Code Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        {/* Left Column: Interactive File List Terminal */}
        <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-card w-full overflow-hidden shadow-xs flex flex-col">
          <div className="px-4 py-3 border-b border-border/60 bg-muted/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <FolderTree className="h-4 w-4 text-cyan-600 dark:text-cyan-400" strokeWidth={1.8} />
              <span className="font-semibold text-foreground tracking-wide">MANIFEST TREE</span>
            </div>
            <span className="text-[10px] font-mono uppercase text-muted-foreground">
              {filteredFiles.length} {filteredFiles.length === 1 ? "FILE" : "FILES"}
            </span>
          </div>

          <div className="p-2 space-y-1 max-h-[500px] overflow-y-auto">
            {filteredFiles.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-xs space-y-2">
                <FileCode className="h-8 w-8 mx-auto opacity-40" />
                <p>No manifests match &ldquo;{searchQuery}&rdquo;</p>
                <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              filteredFiles.map((file) => {
                const isSelected = selectedFile?.path === file.path;
                const IconComponent = getCategoryIcon(file.category);

                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFilePath(file.path)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-start justify-between gap-3 cursor-pointer group ${
                      isSelected
                        ? "bg-brand/10 border border-brand/40 text-foreground shadow-xs"
                        : "hover:bg-muted/50 border border-transparent text-foreground"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <IconComponent
                          className={`h-4 w-4 shrink-0 ${
                            isSelected
                              ? "text-cyan-600 dark:text-cyan-400"
                              : "text-muted-foreground group-hover:text-foreground"
                          }`}
                          strokeWidth={1.8}
                        />
                        <span className="font-mono text-xs font-semibold truncate">
                          {file.name}
                        </span>
                      </div>
                      <p className="font-mono text-[11px] mt-1 truncate text-muted-foreground">
                        {file.relativePath}
                      </p>
                    </div>

                    <div className="flex flex-col items-end shrink-0 gap-1 text-right">
                      <Badge
                        variant="secondary"
                        className="text-[9px] px-1.5 py-0 font-mono uppercase border-border/80"
                      >
                        {file.categoryLabel}
                      </Badge>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {file.lineCount}L · {formatFileSize(file.sizeBytes)}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Code Viewer Panel & Artifact Explainer */}
        <div className="lg:col-span-7 w-full min-w-0 space-y-4">
          {selectedFile ? (
            <>
              {/* Manifest Explainer Header Card */}
              <div className="rounded-xl border border-border/80 bg-muted/30 p-4 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-mono text-xs font-semibold text-foreground">
                      {selectedFile.relativePath}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-mono uppercase border-cyan-500/30 text-cyan-600 dark:text-cyan-400">
                      {selectedFile.language.toUpperCase()}
                    </Badge>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {selectedFile.lineCount} lines • {formatFileSize(selectedFile.sizeBytes)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedFile.description}
                </p>
              </div>

              {/* Code Viewer */}
              <CodeViewer
                filename={selectedFile.name}
                path={selectedFile.path}
                content={selectedFile.content}
                language={selectedFile.language.toUpperCase()}
                maxHeight="480px"
              />
            </>
          ) : (
            <div className="h-[480px] rounded-2xl border border-dashed border-border flex items-center justify-center p-6 text-center text-muted-foreground bg-card">
              <p className="text-sm">Select a manifest from the tree to view its content.</p>
            </div>
          )}
        </div>
      </div>

      {/* Direct Generation Action Bar */}
      <div className="mt-8 p-5 rounded-2xl border border-border/80 bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left space-y-0.5">
          <p className="text-sm font-semibold text-foreground">Ready to provision this complete infrastructure package?</p>
          <p className="text-xs text-muted-foreground">
            Includes all Kubernetes YAMLs, OpenTofu modules, OTel pipelines, FinOps guardrails, and local Kind test scripts.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            size="sm"
            className="gap-2 bg-brand hover:bg-brand/90 text-brand-foreground font-semibold rounded-lg shadow-xs"
            onClick={() => {
              document.getElementById("generator-section")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Generate Full Stack
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
