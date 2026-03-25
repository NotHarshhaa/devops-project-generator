"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GeneratedFile } from "@/lib/types";
import { ChevronRight, File, Folder, FolderOpen } from "lucide-react";

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
        child = {
          name: part,
          path: file.path,
          type: isLast ? file.type : "directory",
          children: [],
          content: isLast && file.type === "file" ? file.content : undefined,
        };
        current.children.push(child);
      }
      current = child;
    }
  }

  // Remove empty directories recursively
  const removeEmptyDirs = (node: TreeNode): boolean => {
    if (node.type === "file") return true;
    
    // Filter children, keeping only non-empty ones
    node.children = node.children.filter(child => removeEmptyDirs(child));
    
    // A directory is non-empty if it has children
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
}: {
  node: TreeNode;
  depth: number;
  onFileSelect: (file: TreeNode) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 2);

  if (node.type === "file") {
    return (
      <button
        onClick={() => onFileSelect(node)}
        className="flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <File className="h-3.5 w-3.5 shrink-0 text-blue-400" />
        <span className="truncate">{node.name}</span>
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-foreground hover:bg-accent transition-colors"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
            expanded && "rotate-90"
          )}
        />
        {expanded ? (
          <FolderOpen className="h-3.5 w-3.5 shrink-0 text-amber-400" />
        ) : (
          <Folder className="h-3.5 w-3.5 shrink-0 text-amber-400" />
        )}
        <span className="truncate">{node.name}</span>
        <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">
          {node.children.length}
        </span>
      </button>
      {expanded && (
        <div>
          {node.children.map((child) => (
            <TreeNodeComponent
              key={child.path + child.name}
              node={child}
              depth={depth + 1}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree({ files, projectName }: FileTreeProps) {
  const [selectedFile, setSelectedFile] = useState<TreeNode | null>(null);
  const tree = buildTree(files, projectName);

  return (
    <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 h-auto lg:h-[500px]">
      <div className="lg:w-72 shrink-0 rounded-lg border bg-card overflow-auto max-h-[250px] lg:max-h-none">
        <div className="p-2.5 sm:p-3 border-b bg-muted/50">
          <h4 className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Project Structure
          </h4>
        </div>
        <div className="p-1">
          <TreeNodeComponent
            node={tree}
            depth={0}
            onFileSelect={setSelectedFile}
          />
        </div>
      </div>

      <div className="flex-1 rounded-lg border bg-card overflow-hidden min-w-0 min-h-[200px] sm:min-h-[250px]">
        {selectedFile && selectedFile.content ? (
          <>
            <div className="flex items-center gap-2 p-2.5 sm:p-3 border-b bg-muted/50">
              <File className="h-3.5 w-3.5 shrink-0 text-blue-400" />
              <span className="text-[10px] sm:text-xs font-mono text-muted-foreground truncate">
                {selectedFile.path}
              </span>
            </div>
            <pre className="p-3 sm:p-4 text-[10px] sm:text-xs font-mono overflow-auto h-[250px] lg:h-[calc(100%-44px)] leading-relaxed text-foreground/90">
              {selectedFile.content}
            </pre>
          </>
        ) : (
          <div className="flex h-full min-h-[200px] items-center justify-center text-muted-foreground">
            <div className="text-center">
              <File className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-2 sm:mb-3 opacity-30" />
              <p className="text-xs sm:text-sm">Select a file to preview its contents</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
