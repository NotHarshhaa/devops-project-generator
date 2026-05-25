"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronRight } from "lucide-react";
import { TreeNode } from "./types";
import { getFileIcon, getFileCategory } from "./utils";

interface TreeNodeComponentProps {
  node: TreeNode;
  depth: number;
  onFileSelect: (file: TreeNode) => void;
  searchTerm: string;
  expandedPaths: Set<string>;
  setExpandedPaths: (paths: Set<string>) => void;
}

export function TreeNodeComponent({
  node,
  depth,
  onFileSelect,
  searchTerm,
  expandedPaths,
  setExpandedPaths,
}: TreeNodeComponentProps) {
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

  const shouldHighlight =
    searchTerm &&
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
              {node.size !== undefined && node.size > 0 && (
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
          className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isExpanded && "rotate-90")}
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
