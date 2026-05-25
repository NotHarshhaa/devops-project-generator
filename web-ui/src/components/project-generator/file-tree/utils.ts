import {
  File,
  Folder,
  FileText,
  FileCode,
  FileJson,
  FileImage,
  Archive,
} from "lucide-react";
import { GeneratedFile } from "@/lib/types";
import { TreeNode } from "./types";

export function getFileIcon(fileName: string, isDirectory: boolean) {
  if (isDirectory) return { icon: Folder, color: "text-amber-500" };

  const extension = fileName.split(".").pop()?.toLowerCase();
  const iconMap: Record<string, { icon: typeof File; color: string; language?: string }> = {
    js: { icon: FileCode, color: "text-yellow-500", language: "javascript" },
    ts: { icon: FileCode, color: "text-blue-500", language: "typescript" },
    tsx: { icon: FileCode, color: "text-blue-600", language: "typescript" },
    jsx: { icon: FileCode, color: "text-yellow-600", language: "javascript" },
    py: { icon: FileCode, color: "text-green-500", language: "python" },
    java: { icon: FileCode, color: "text-orange-500", language: "java" },
    go: { icon: FileCode, color: "text-cyan-500", language: "go" },
    json: { icon: FileJson, color: "text-gray-500" },
    yaml: { icon: FileJson, color: "text-purple-500" },
    yml: { icon: FileJson, color: "text-purple-500" },
    md: { icon: FileText, color: "text-blue-400" },
    txt: { icon: FileText, color: "text-gray-400" },
    dockerfile: { icon: FileCode, color: "text-blue-600", language: "dockerfile" },
    docker: { icon: FileCode, color: "text-blue-600" },
    sh: { icon: FileCode, color: "text-green-600", language: "bash" },
    bash: { icon: FileCode, color: "text-green-600", language: "bash" },
    tf: { icon: FileCode, color: "text-purple-600", language: "terraform" },
    hcl: { icon: FileCode, color: "text-purple-600", language: "terraform" },
    png: { icon: FileImage, color: "text-pink-500" },
    jpg: { icon: FileImage, color: "text-pink-500" },
    jpeg: { icon: FileImage, color: "text-pink-500" },
    gif: { icon: FileImage, color: "text-pink-500" },
    svg: { icon: FileImage, color: "text-pink-500" },
    zip: { icon: Archive, color: "text-orange-600" },
    tar: { icon: Archive, color: "text-orange-600" },
    gz: { icon: Archive, color: "text-orange-600" },
  };

  return iconMap[extension || ""] || { icon: File, color: "text-gray-400" };
}

export function getFileCategory(path: string): string {
  if (path.includes("/app/") || path.includes("/src/")) return "Application";
  if (path.includes("/test/") || path.includes("/tests/")) return "Tests";
  if (path.includes("/.github/") || path.includes("/ci/") || path.includes("/.gitlab-ci.yml")) return "CI/CD";
  if (path.includes("/deploy/") || path.includes("/k8s/") || path.includes("/helm/")) return "Deployment";
  if (path.includes("/infra/") || path.includes("/terraform/")) return "Infrastructure";
  if (path.includes("/monitoring/") || path.includes("/prometheus/")) return "Monitoring";
  if (path.includes("/security/") || path.includes("/policy/")) return "Security";
  if (path.includes("/script/") || path.includes("/scripts/")) return "Scripts";
  if (path.includes("/docs/") || path.includes("/doc/")) return "Documentation";
  return "Configuration";
}

export function buildTree(files: GeneratedFile[], projectName: string): TreeNode {
  const root: TreeNode = {
    name: projectName,
    path: projectName,
    type: "directory",
    children: [],
  };

  const actualFiles = files.filter((f) => f.type === "file");

  for (const file of actualFiles) {
    const parts = file.path.split("/").slice(1);
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

  const removeEmptyDirs = (node: TreeNode): boolean => {
    if (node.type === "file") return true;
    node.children = node.children.filter((child) => removeEmptyDirs(child));
    return node.children.length > 0;
  };
  removeEmptyDirs(root);

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
