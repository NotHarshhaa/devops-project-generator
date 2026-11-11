import { ProjectConfig, GeneratedFile, GenerationResult, FileBreakdown } from '@/lib/types';
import { calculateComplexity, estimateSetupTimeMinutes } from './complexity';
import { ensureDirectories } from './file-utils';
import { lintGeneratedManifests } from './manifest-linter';
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

// Main enhanced project generation engine
export function generateEnhancedProject(config: ProjectConfig): GenerationResult {
  const allFiles: GeneratedFile[] = [];
  const components: string[] = [];
  
  // Calculate complexity & time estimations
  const complexityScore = calculateComplexity(config);
  const estimatedSetupTimeMinutes = estimateSetupTimeMinutes(complexityScore);
  
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
  
  // Static analysis & production manifest linting
  const validationReport = lintGeneratedManifests(allFiles, config);

  // Compute file breakdown statistics
  const fileBreakdown: FileBreakdown = {
    yaml: 0,
    terraform: 0,
    scripts: 0,
    docker: 0,
    documentation: 0,
    configs: 0,
  };

  for (const file of allFiles) {
    const lower = file.path.toLowerCase();
    if (lower.endsWith(".yaml") || lower.endsWith(".yml")) {
      fileBreakdown.yaml++;
    } else if (lower.endsWith(".tf") || lower.endsWith(".tofu")) {
      fileBreakdown.terraform++;
    } else if (lower.endsWith(".sh") || lower.endsWith(".bash") || lower.endsWith(".ps1")) {
      fileBreakdown.scripts++;
    } else if (lower.includes("dockerfile") || lower.endsWith(".dockerignore")) {
      fileBreakdown.docker++;
    } else if (lower.endsWith(".md")) {
      fileBreakdown.documentation++;
    } else {
      fileBreakdown.configs++;
    }
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
      components,
      complexityScore,
      estimatedSetupTimeMinutes,
      fileBreakdown,
      validationReport,
    }
  };
}

// Export the enhanced generator as default
export default generateEnhancedProject;

// Export with original name for backward compatibility
export { generateEnhancedProject as generateProject };
