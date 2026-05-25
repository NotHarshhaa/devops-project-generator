"use client";

import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Search, FolderOpen, Copy, Download, File } from "lucide-react";
import { FileTreeProps, TreeNode } from "./types";
import { buildTree, getFileIcon, getFileCategory } from "./utils";
import { TreeNodeComponent } from "./tree-node";

export function FileTree({ files, projectName }: FileTreeProps) {
  const [selectedFile, setSelectedFile] = useState<TreeNode | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set([projectName]));
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const tree = useMemo(() => buildTree(files, projectName), [files, projectName]);

  const filteredFiles = useMemo(() => {
    if (!searchTerm) return files;
    return files.filter(
      (file) =>
        file.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.path.split("/").pop()?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [files, searchTerm]);

  useEffect(() => {
    if (searchTerm) {
      const pathsToExpand = new Set<string>();
      filteredFiles.forEach((file) => {
        const parts = file.path.split("/");
        let currentPath = "";
        for (let i = 0; i < parts.length - 1; i++) {
          currentPath += (i > 0 ? "/" : "") + parts[i];
          pathsToExpand.add(currentPath);
        }
      });
      setExpandedPaths(pathsToExpand);
    }
  }, [searchTerm, filteredFiles]);

  const handleCopyPath = async (path: string) => {
    try {
      await navigator.clipboard.writeText(path);
      setCopiedPath(path);
      setTimeout(() => setCopiedPath(null), 2000);
    } catch (err) {
      console.error("Failed to copy path:", err);
    }
  };

  const handleDownload = (file: TreeNode) => {
    if (file.content) {
      const blob = new Blob([file.content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[600px]">
      <div className="lg:w-80 shrink-0 rounded-xl border bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">
        <div className="p-4 border-b bg-gradient-to-r from-muted/50 to-muted/30">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Project Structure
            </h4>
            <Badge variant="secondary" className="text-xs">
              {files.length} files
            </Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-8 text-sm"
            />
          </div>
        </div>

        <div className="p-2 overflow-auto max-h-[250px] lg:max-h-[500px]">
          <TreeNodeComponent
            node={tree}
            depth={0}
            onFileSelect={setSelectedFile}
            searchTerm={searchTerm}
            expandedPaths={expandedPaths}
            setExpandedPaths={setExpandedPaths}
          />
        </div>
      </div>

      <div className="flex-1 rounded-xl border bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm min-w-0">
        {selectedFile?.content ? (
          <>
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-muted/50 to-muted/30">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {(() => {
                    const fileInfo = getFileIcon(selectedFile.name, false);
                    const Icon = fileInfo.icon;
                    return <Icon className={cn("h-4 w-4", fileInfo.color)} />;
                  })()}
                  <div>
                    <span className="text-sm font-mono text-foreground">{selectedFile.name}</span>
                    <div className="text-xs text-muted-foreground">{getFileCategory(selectedFile.path)}</div>
                  </div>
                </div>
                {selectedFile.language && (
                  <Badge variant="secondary" className="text-xs">
                    {selectedFile.language}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => handleCopyPath(selectedFile.path)} className="h-8 w-8 p-0">
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy path</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(selectedFile)} className="h-8 w-8 p-0">
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download file</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="relative h-[250px] lg:h-[calc(100%-73px)]">
              <ScrollArea className="h-full w-full">
                <pre className="p-4 text-xs font-mono leading-relaxed text-foreground/90 bg-muted/20 whitespace-pre overflow-x-auto min-w-full">
                  {selectedFile.content}
                </pre>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              {copiedPath === selectedFile.path && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md animate-in fade-in slide-in-from-top-2 duration-200">
                  Copied!
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex h-full min-h-[200px] items-center justify-center text-muted-foreground">
            <div className="text-center space-y-3">
              <div className="relative">
                <File className="h-12 w-12 mx-auto opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Search className="h-4 w-4 opacity-40" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Select a file to preview</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {searchTerm ? `No results for "${searchTerm}"` : "Browse the project structure on the left"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
