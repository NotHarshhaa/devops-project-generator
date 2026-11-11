"use client";

import { useState, useMemo } from "react";
import { useConfig } from "@/lib/config-context";
import { getPreviewableFiles, PreviewableFile } from "@/lib/generator/file-preview-helpers";
import { CodeViewer } from "@/components/common/code-viewer";
import { SectionHeader } from "./section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileCode, FolderTree, ArrowRight } from "lucide-react";

export function GeneratedOutputSection() {
  const { config } = useConfig();
  const previewFiles = useMemo(() => getPreviewableFiles(config), [config]);

  const [selectedFile, setSelectedFile] = useState<PreviewableFile>(previewFiles[0]);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Files" },
    { id: "ci", label: "CI/CD" },
    { id: "infra", label: "Terraform" },
    { id: "deploy", label: "Deploy & K8s" },
    { id: "observability", label: "Monitoring" },
  ];

  const filteredFiles = useMemo(() => {
    if (activeCategory === "all") return previewFiles;
    return previewFiles.filter((f) => f.category === activeCategory);
  }, [previewFiles, activeCategory]);

  return (
    <section id="output-section" className="container mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28 w-full max-w-full overflow-hidden">
      <SectionHeader
        badge="INTERACTIVE ARTIFACT EXPLORER"
        title="Inspect Production Manifests Live"
        description="Every template is compiled in-browser according to your active stack parameters. Click any file to inspect real, runnable code before downloading."
      />

      {/* Category Filter Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6 pb-3 border-b border-border/60">
        <div className="inline-flex items-center gap-1 p-1 bg-muted/60 rounded-xl border border-border/60 overflow-x-auto max-w-full scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-background text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span>SPECIFICATION:</span>
          <Badge variant="outline" className="text-[10px] font-mono">
            {config.projectName || "my-devops-project"}
          </Badge>
        </div>
      </div>

      {/* Split Interactive View: File Selector (Left) + Code Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        {/* Left Column: Interactive File List Terminal */}
        <div className="lg:col-span-4 rounded-2xl border border-border/80 bg-card w-full overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-border/60 bg-muted/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <FolderTree className="h-4 w-4 text-brand" strokeWidth={1.8} />
              <span className="font-semibold text-foreground tracking-wide">MANIFEST TREE</span>
            </div>
            <span className="text-[10px] font-mono uppercase text-muted-foreground">
              {filteredFiles.length} FILES
            </span>
          </div>

          <div className="p-2 divide-y divide-border/40 max-h-[460px] overflow-y-auto">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile?.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start justify-between gap-3 cursor-pointer group ${
                    isSelected
                      ? "bg-brand/10 border border-brand/30 text-foreground"
                      : "hover:bg-muted/50 text-foreground"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <FileCode className={`h-4 w-4 shrink-0 ${isSelected ? "text-brand" : "text-muted-foreground group-hover:text-foreground"}`} strokeWidth={1.8} />
                      <span className="font-mono text-xs font-semibold truncate">
                        {file.name}
                      </span>
                    </div>
                    <p className="font-mono text-[11px] mt-1 truncate text-muted-foreground">
                      {file.path}
                    </p>
                  </div>

                  <div className="flex flex-col items-end shrink-0 gap-1">
                    <Badge
                      variant="secondary"
                      className="text-[9px] px-1.5 py-0 font-mono uppercase"
                    >
                      {file.category}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code Viewer Panel */}
        <div className="lg:col-span-8 w-full min-w-0">
          {selectedFile ? (
            <CodeViewer
              filename={selectedFile.name}
              path={selectedFile.path}
              content={selectedFile.content}
              language={selectedFile.language}
              maxHeight="460px"
            />
          ) : (
            <div className="h-[460px] rounded-2xl border border-dashed border-border flex items-center justify-center p-6 text-center text-muted-foreground bg-card">
              <p className="text-sm">Select a manifest from the tree to view its content.</p>
            </div>
          )}
        </div>
      </div>

      {/* Direct Generation Action Bar */}
      <div className="mt-8 p-4 sm:p-5 rounded-2xl border border-border/80 bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="text-sm font-semibold text-foreground">Like what you see in the code inspection?</p>
          <p className="text-xs text-muted-foreground mt-0.5">Scaffold the complete repository archive with all tests, workflows, and cloud configs.</p>
        </div>
        <Button
          size="sm"
          className="gap-2 shrink-0 bg-brand hover:bg-brand/90 text-brand-foreground font-semibold rounded-lg"
          onClick={() => {
            document.getElementById("generator-section")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Generate Full Package
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </section>
  );
}
