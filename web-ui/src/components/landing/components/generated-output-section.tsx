"use client";

import { useState, useMemo } from "react";
import { useConfig } from "@/lib/config-context";
import { getPreviewableFiles, PreviewableFile } from "@/lib/generator/file-preview-helpers";
import { CodeViewer } from "@/components/common/code-viewer";
import { SectionHeader } from "./section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileCode, FolderTree, Terminal, ArrowRight, Layers } from "lucide-react";

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
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6 pb-3 border-b border-foreground/20">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`font-mono text-xs uppercase tracking-wider px-3 py-1.5 border transition-colors duration-100 shrink-0 cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-foreground text-background border-foreground font-bold"
                  : "bg-background text-foreground border-foreground/30 hover:border-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span>SPECIFICATION:</span>
          <Badge variant="outline" className="text-[10px]">
            {config.projectName}
          </Badge>
        </div>
      </div>

      {/* Split Interactive View: File Selector (Left) + Code Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        {/* Left Column: Interactive File List Terminal */}
        <div className="lg:col-span-4 border-2 border-foreground bg-background w-full overflow-hidden">
          <div className="px-4 py-2.5 sm:py-3 border-b-2 border-foreground bg-muted flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <FolderTree className="h-3.5 w-3.5 text-foreground" strokeWidth={1.5} />
              <span className="font-bold tracking-wider truncate">MANIFEST TREE</span>
            </div>
            <span className="text-[10px] uppercase text-muted-foreground">
              {filteredFiles.length} FILES
            </span>
          </div>

          <div className="p-2 divide-y divide-foreground/10 max-h-[460px] overflow-y-auto">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile?.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-3 transition-colors duration-100 flex items-start justify-between gap-3 cursor-pointer group ${
                    isSelected
                      ? "bg-foreground text-background"
                      : "hover:bg-muted/60 text-foreground"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <FileCode className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-background" : "text-foreground"}`} strokeWidth={1.5} />
                      <span className="font-mono text-xs font-bold truncate">
                        {file.name}
                      </span>
                    </div>
                    <p className={`font-mono text-[10px] mt-1 truncate ${isSelected ? "text-background/70" : "text-muted-foreground"}`}>
                      {file.path}
                    </p>
                  </div>

                  <div className="flex flex-col items-end shrink-0 gap-1">
                    <Badge
                      variant="outline"
                      className={`text-[8px] px-1 py-0 uppercase ${
                        isSelected
                          ? "border-background text-background"
                          : "border-foreground/30 text-foreground"
                      }`}
                    >
                      {file.language}
                    </Badge>
                    <span className={`font-mono text-[9px] ${isSelected ? "text-background/60" : "text-muted-foreground"}`}>
                      {file.lineCount}L
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 border-t border-foreground bg-muted/30 flex items-center justify-between">
            <span className="font-mono text-[10px] text-muted-foreground uppercase">
              PROD-READY TEMPLATES
            </span>
            <Button asChild variant="ghost" size="sm" className="h-7 text-xs font-mono uppercase tracking-wider gap-1">
              <a href="#generator-section">
                Configure Stack
                <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
              </a>
            </Button>
          </div>
        </div>

        {/* Right Column: Code Viewer (Feature 1) */}
        <div className="lg:col-span-8 w-full min-w-0">
          {selectedFile ? (
            <CodeViewer
              filename={selectedFile.name}
              path={selectedFile.path}
              content={selectedFile.content}
              language={selectedFile.language.toUpperCase()}
              maxHeight="480px"
            />
          ) : (
            <div className="border-2 border-foreground bg-background p-12 text-center font-mono text-xs text-muted-foreground">
              Select a file from the manifest tree to inspect its generated source code.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
