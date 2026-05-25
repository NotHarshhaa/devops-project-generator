import { GeneratedFile } from '@/lib/types';

export function normalizeProjectName(projectName: string): string {
  return projectName.toLowerCase().replace(/\s+/g, '-');
}

// Helper function to ensure parent directories exist for a file
export function ensureDirectories(filePath: string): GeneratedFile[] {
  const dirs: GeneratedFile[] = [];
  const parts = filePath.split('/');
  
  // Remove filename and project name
  parts.pop(); // Remove filename
  const projectName = parts.shift(); // Remove project name
  
  // Build up directory paths
  let currentPath = projectName || '';
  for (const part of parts) {
    currentPath += '/' + part;
    dirs.push({
      path: currentPath,
      content: "",
      type: "directory"
    });
  }
  
  return dirs;
}
