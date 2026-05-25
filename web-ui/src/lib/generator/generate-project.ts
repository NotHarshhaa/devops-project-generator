import { ProjectConfig, GeneratedFile, GenerationResult } from '@/lib/types';
import { calculateComplexity } from './complexity';
import { ensureDirectories } from './file-utils';
import {
  generateRealisticBaseFiles,
  generateRealisticApplicationFiles,
  generateRealisticScriptFiles,
  generateRealisticCIFiles,
} from './templates';

// Main enhanced project generation function
export function generateEnhancedProject(config: ProjectConfig): GenerationResult {
  const allFiles: GeneratedFile[] = [];
  const components: string[] = [];
  
  // Calculate complexity for realistic generation time
  const complexity = calculateComplexity(config);
  const estimatedTime = Math.max(2, complexity * 0.5); // Base time + complexity factor
  
  // Generate base files (always included)
  allFiles.push(...generateRealisticBaseFiles(config));
  components.push("Base Files & Documentation");
  
  // Generate application files
  allFiles.push(...generateRealisticApplicationFiles(config));
  components.push("Application Code & Tests");
  
  // Generate script files
  allFiles.push(...generateRealisticScriptFiles(config));
  components.push("Deployment & Utility Scripts");
  
  // Generate CI/CD files if enabled
  if (config.ci && config.ci !== "none") {
    allFiles.push(...generateRealisticCIFiles(config));
    components.push(`CI/CD Pipeline (${config.ci})`);
  }
  
  // TODO: Add infrastructure, deployment, monitoring, and security files
  // These will be implemented in subsequent iterations
  
  // Ensure all directories exist
  const directories: GeneratedFile[] = [];
  const seenDirs = new Set<string>();
  
  for (const file of allFiles) {
    const dirs = ensureDirectories(file.path);
    for (const dir of dirs) {
      if (!seenDirs.has(dir.path)) {
        directories.push(dir);
        seenDirs.add(dir.path);
      }
    }
  }
  
  const finalFiles = [...directories, ...allFiles];
  
  return {
    success: true,
    projectName: config.projectName,
    files: finalFiles,
    summary: {
      totalFiles: finalFiles.length,
      totalDirs: directories.length,
      components
    }
  };
}

// Export the enhanced generator as default
export default generateEnhancedProject;

// Export with original name for backward compatibility
export { generateEnhancedProject as generateProject };
