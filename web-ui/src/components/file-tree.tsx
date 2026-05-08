"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { GeneratedFile } from "@/lib/types";
import { 
  ChevronRight, 
  File, 
  Folder, 
  FolderOpen, 
  Search, 
  Copy, 
  Download,
  FileText,
  FileCode,
  FileJson,
  FileImage,
  Archive} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface FileTreeProps {
  files: GeneratedFile[];
  projectName: string;
}

interface TreeNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children: TreeNode[];
  content?: string;
  size?: number;
  language?: string;
}

function getFileIcon(fileName: string, isDirectory: boolean) {
  if (isDirectory) return { icon: Folder, color: "text-amber-500" };
  
  const extension = fileName.split('.').pop()?.toLowerCase();
  const iconMap: Record<string, { icon: any; color: string; language?: string }> = {
    'js': { icon: FileCode, color: "text-yellow-500", language: "javascript" },
    'ts': { icon: FileCode, color: "text-blue-500", language: "typescript" },
    'tsx': { icon: FileCode, color: "text-blue-600", language: "typescript" },
    'jsx': { icon: FileCode, color: "text-yellow-600", language: "javascript" },
    'py': { icon: FileCode, color: "text-green-500", language: "python" },
    'java': { icon: FileCode, color: "text-orange-500", language: "java" },
    'go': { icon: FileCode, color: "text-cyan-500", language: "go" },
    'json': { icon: FileJson, color: "text-gray-500" },
    'yaml': { icon: FileJson, color: "text-purple-500" },
    'yml': { icon: FileJson, color: "text-purple-500" },
    'md': { icon: FileText, color: "text-blue-400" },
    'txt': { icon: FileText, color: "text-gray-400" },
    'dockerfile': { icon: FileCode, color: "text-blue-600", language: "dockerfile" },
    'docker': { icon: FileCode, color: "text-blue-600" },
    'sh': { icon: FileCode, color: "text-green-600", language: "bash" },
    'bash': { icon: FileCode, color: "text-green-600", language: "bash" },
    'tf': { icon: FileCode, color: "text-purple-600", language: "terraform" },
    'hcl': { icon: FileCode, color: "text-purple-600", language: "terraform" },
    'png': { icon: FileImage, color: "text-pink-500" },
    'jpg': { icon: FileImage, color: "text-pink-500" },
    'jpeg': { icon: FileImage, color: "text-pink-500" },
    'gif': { icon: FileImage, color: "text-pink-500" },
    'svg': { icon: FileImage, color: "text-pink-500" },
    'zip': { icon: Archive, color: "text-orange-600" },
    'tar': { icon: Archive, color: "text-orange-600" },
    'gz': { icon: Archive, color: "text-orange-600" },
  };
  
  return iconMap[extension || ''] || { icon: File, color: "text-gray-400" };
}

function getFileCategory(path: string): string {
  if (path.includes('/app/') || path.includes('/src/')) return "Application";
  if (path.includes('/test/') || path.includes('/tests/')) return "Tests";
  if (path.includes('/.github/') || path.includes('/ci/') || path.includes('/.gitlab-ci.yml')) return "CI/CD";
  if (path.includes('/deploy/') || path.includes('/k8s/') || path.includes('/helm/')) return "Deployment";
  if (path.includes('/infra/') || path.includes('/terraform/')) return "Infrastructure";
  if (path.includes('/monitoring/') || path.includes('/prometheus/')) return "Monitoring";
  if (path.includes('/security/') || path.includes('/policy/')) return "Security";
  if (path.includes('/script/') || path.includes('/scripts/')) return "Scripts";
  if (path.includes('/docs/') || path.includes('/doc/')) return "Documentation";
  return "Configuration";
}

function buildTree(files: GeneratedFile[], projectName: string): TreeNode {
  const root: TreeNode = {
    name: projectName,
    path: projectName,
    type: "directory",
    children: [],
  };

  // Only process actual files, not directory entries
  const actualFiles = files.filter(f => f.type === "file");

  for (const file of actualFiles) {
    const parts = file.path.split("/").slice(1); // Remove project name prefix
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      let child = current.children.find((c) => c.name === part);

      if (!child) {
        const fileInfo = getFileIcon(part, isLast ? file.type === "directory" : false);
        child = {
          name: part,
          path: file.path,
          type: isLast ? file.type : "directory",
          children: [],
          content: isLast && file.type === "file" ? file.content : undefined,
          size: file.content?.length || 0,
          language: fileInfo.language,
        };
        current.children.push(child);
      }
      current = child;
    }
  }

  // Remove empty directories recursively
  const removeEmptyDirs = (node: TreeNode): boolean => {
    if (node.type === "file") return true;
    
    node.children = node.children.filter(child => removeEmptyDirs(child));
    return node.children.length > 0;
  };
  removeEmptyDirs(root);

  // Sort: directories first, then files, alphabetically
  const sortChildren = (node: TreeNode) => {
    node.children.sort((a, b) => {
      if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    node.children.forEach(sortChildren);
  };
  sortChildren(root);

  return root;
}

function TreeNodeComponent({
  node,
  depth,
  onFileSelect,
  searchTerm,
  expandedPaths,
  setExpandedPaths,
}: {
  node: TreeNode;
  depth: number;
  onFileSelect: (file: TreeNode) => void;
  searchTerm: string;
  expandedPaths: Set<string>;
  setExpandedPaths: (paths: Set<string>) => void;
}) {
  const isExpanded = expandedPaths.has(node.path);
  const fileInfo = getFileIcon(node.name, node.type === "directory");
  const Icon = fileInfo.icon;
  
  const toggleExpanded = () => {
    const newPaths = new Set(expandedPaths);
    if (isExpanded) {
      newPaths.delete(node.path);
    } else {
      newPaths.add(node.path);
    }
    setExpandedPaths(newPaths);
  };

  const shouldHighlight = searchTerm && 
    (node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     node.path.toLowerCase().includes(searchTerm.toLowerCase()));

  if (node.type === "file") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => onFileSelect(node)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-all duration-200",
                "hover:bg-accent/50 hover:text-foreground",
                "focus:bg-accent focus:outline-none focus:ring-2 focus:ring-ring/20",
                shouldHighlight && "bg-yellow-50 border-l-2 border-yellow-400"
              )}
              style={{ paddingLeft: `${depth * 20 + 12}px` }}
            >
              <Icon className={cn("h-4 w-4 shrink-0", fileInfo.color)} />
              <span className="truncate font-medium">{node.name}</span>
              {node.language && (
                <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0.5">
                  {node.language}
                </Badge>
              )}
              {node.size && (
                <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">
                  {node.size > 1024 ? `${(node.size / 1024).toFixed(1)}KB` : `${node.size}B`}
                </span>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            <div className="space-y-1">
              <p className="font-medium">{node.name}</p>
              <p className="text-muted-foreground">{node.path}</p>
              <p className="text-muted-foreground">{getFileCategory(node.path)}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div>
      <button
        onClick={toggleExpanded}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
          "hover:bg-accent/50 hover:text-foreground",
          "focus:bg-accent focus:outline-none focus:ring-2 focus:ring-ring/20",
          shouldHighlight && "bg-yellow-50 border-l-2 border-yellow-400"
        )}
        style={{ paddingLeft: `${depth * 20 + 12}px` }}
      >
        <ChevronRight
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200",
            isExpanded && "rotate-90"
          )}
        />
        <Icon className={cn("h-4 w-4 shrink-0", fileInfo.color)} />
        <span className="truncate">{node.name}</span>
        <Badge variant="outline" className="ml-auto text-[10px]">
          {node.children.length}
        </Badge>
      </button>
      {isExpanded && (
        <div className="animate-in slide-in-from-top-1 duration-200">
          {node.children.map((child) => (
            <TreeNodeComponent
              key={child.path + child.name}
              node={child}
              depth={depth + 1}
              onFileSelect={onFileSelect}
              searchTerm={searchTerm}
              expandedPaths={expandedPaths}
              setExpandedPaths={setExpandedPaths}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree({ files, projectName }: FileTreeProps) {
  const [selectedFile, setSelectedFile] = useState<TreeNode | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set([projectName]));
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  
  const tree = useMemo(() => buildTree(files, projectName), [files, projectName]);
  
  const filteredFiles = useMemo(() => {
    if (!searchTerm) return files;
    return files.filter(file => 
      file.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.path.split('/').pop()?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [files, searchTerm]);

  const handleCopyPath = async (path: string) => {
    try {
      await navigator.clipboard.writeText(path);
      setCopiedPath(path);
      setTimeout(() => setCopiedPath(null), 2000);
    } catch (err) {
      console.error('Failed to copy path:', err);
    }
  };

  const handleDownload = (file: TreeNode) => {
    if (file.content) {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Auto-expand directories that contain search results
  useMemo(() => {
    if (searchTerm) {
      const pathsToExpand = new Set<string>();
      filteredFiles.forEach(file => {
        const parts = file.path.split('/');
        let currentPath = '';
        for (let i = 0; i < parts.length - 1; i++) {
          currentPath += (i > 0 ? '/' : '') + parts[i];
          pathsToExpand.add(currentPath);
        }
      });
      setExpandedPaths(pathsToExpand);
    }
  }, [searchTerm, filteredFiles]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[600px]">
      {/* File Tree Panel */}
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
          
          {/* Search */}
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

      {/* File Preview Panel */}
      <div className="flex-1 rounded-xl border bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm min-w-0">
        {selectedFile && selectedFile.content ? (
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
                    <span className="text-sm font-mono text-foreground">
                      {selectedFile.name}
                    </span>
                    <div className="text-xs text-muted-foreground">
                      {getFileCategory(selectedFile.path)}
                    </div>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyPath(selectedFile.path)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy path</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(selectedFile)}
                        className="h-8 w-8 p-0"
                      >
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
