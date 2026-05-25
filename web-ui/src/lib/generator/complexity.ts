import { ProjectConfig } from '@/lib/types';

// Enhanced complexity calculation for realistic generation time estimation
export function calculateComplexity(config: ProjectConfig): number {
  let complexity = 1;
  
  // Infrastructure complexity
  if (config.infra.includes("multi-cloud")) complexity += 3;
  if (config.infra.includes("eks") || config.infra.includes("aks") || config.infra.includes("gke")) complexity += 2;
  if (config.infra.includes("on-prem")) complexity += 4;
  if (config.infra.includes("terraform")) complexity += 2;
  
  // Deployment complexity
  if (config.deploy.includes("gitops") || config.deploy.includes("helm")) complexity += 2;
  if (config.deploy.includes("canary")) complexity += 1;
  if (config.deploy.includes("serverless")) complexity += 2;
  if (config.deploy.includes("blue-green")) complexity += 1;
  
  // Environment complexity
  const envCount = config.envs.split(",").length;
  complexity += envCount - 1;
  
  // Security complexity
  if (config.security.includes("zero-trust") || config.security.includes("soc2") || config.security.includes("hipaa")) complexity += 3;
  if (config.security.includes("cis")) complexity += 2;
  if (config.security.includes("nist")) complexity += 2;
  
  // Observability complexity
  if (config.observability.includes("datadog") || config.observability.includes("new-relic")) complexity += 2;
  if (config.observability.includes("elk")) complexity += 2;
  if (config.observability.includes("prometheus")) complexity += 1;
  
  // CI/CD complexity
  if (config.ci === "github-actions") complexity += 1;
  if (config.ci === "gitlab-ci") complexity += 1;
  if (config.ci === "jenkins") complexity += 2;
  
  return complexity;
}
