import { ProjectConfig, GeneratedFile, GenerationResult } from '@/lib/types';
import { calculateComplexity } from './complexity';
import { ensureDirectories } from './file-utils';
import {
  generateRealisticBaseFiles,
  generateRealisticApplicationFiles,
  generateRealisticScriptFiles,
  generateRealisticCIFiles,
  generateRealisticInfraFiles,
  generateRealisticDeployFiles,
  generateRealisticMonitoringFiles,
  generateRealisticSecurityFiles,
  generateRealisticDevContainerFiles,
  generateRealisticSecurityAddonFiles,
} from './templates';

// Main enhanced project generation function
export function generateEnhancedProject(config: ProjectConfig): GenerationResult {
  const allFiles: GeneratedFile[] = [];
  const components: string[] = [];
  
  // Calculate complexity
  calculateComplexity(config);
  
  // Generate base files (always included)
  allFiles.push(...generateRealisticBaseFiles(config));
  components.push("Base Files & Documentation");
  
  // Generate application files
  allFiles.push(...generateRealisticApplicationFiles(config));
  components.push("Application Code & Tests");
  
  // Generate script files
  allFiles.push(...generateRealisticScriptFiles(config));
  components.push("Deployment & Utility Scripts");

  // Generate DevContainer sandbox files
  if (config.devcontainer && config.devcontainer !== "none") {
    allFiles.push(...generateRealisticDevContainerFiles(config));
    components.push(`DevContainer Sandbox (${config.devcontainer})`);
  }
  
  // Generate CI/CD files if enabled
  if (config.ci && config.ci !== "none") {
    allFiles.push(...generateRealisticCIFiles(config));
    components.push(`CI/CD Pipeline (${config.ci})`);
  }
  
  // Generate Infrastructure as Code files
  allFiles.push(...generateRealisticInfraFiles(config));
  components.push(`Infrastructure as Code (${config.infra})`);
  
  // Generate Deployment & Container manifests
  allFiles.push(...generateRealisticDeployFiles(config));
  components.push(`Deployment Manifests (${config.deploy})`);
  
  // Generate Observability & Monitoring files
  allFiles.push(...generateRealisticMonitoringFiles(config));
  components.push(`Observability Stack (${config.observability})`);
  
  // Generate Security & Compliance files
  allFiles.push(...generateRealisticSecurityFiles(config));
  components.push(`Security Policies (${config.security})`);

  // Generate Compliance & Governance Add-ons
  const securityAddonFiles = generateRealisticSecurityAddonFiles(config);
  if (securityAddonFiles.length > 0) {
    allFiles.push(...securityAddonFiles);
    components.push("Compliance & Supply Chain Hardening");
  }
  
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
