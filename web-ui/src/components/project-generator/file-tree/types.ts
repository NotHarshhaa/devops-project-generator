import { GeneratedFile } from "@/lib/types";

export interface TreeNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children: TreeNode[];
  content?: string;
  size?: number;
  language?: string;
}

export interface FileTreeProps {
  files: GeneratedFile[];
  projectName: string;
}
