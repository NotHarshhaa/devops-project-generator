// Types
export type {
  ProjectConfig,
  PipelineOption,
  CIOption,
  InfraOption,
  DeployOption,
  EnvOption,
  ObservabilityOption,
  SecurityOption,
  OptionCard,
  StepConfig,
  GeneratedFile,
  GenerationResult,
} from "./types";

// Constants
export { DEFAULT_PROJECT_CONFIG, DEFAULT_CONFIG } from "./constants";

// Options
export {
  steps,
  getOptionsForStep,
  pipelineOptions,
  ciOptions,
  infraOptions,
  deployOptions,
  envOptions,
  observabilityOptions,
  securityOptions,
} from "./options/";

// Generator
export { generateProject, generateEnhancedProject, calculateComplexity } from "./generator/";

// Validation
export {
  validateProjectName,
  validateProjectConfig,
  canProceedToNextStep,
} from "./validation";
export type { ValidationError, ValidationResult } from "./validation";

// Analytics
export {
  getAnalyticsData,
  saveAnalyticsData,
  resetAnalytics,
  trackProjectGeneration,
  trackUserSession,
  trackInteraction,
  trackProjectInSession,
  calculateTechnologyStats,
  getPopularCombinations,
  getTrendingTechnologies,
  exportAnalyticsData,
} from "./analytics/";
export type { AnalyticsData, ProjectGeneration, UserSession } from "./analytics/";

// API client
export { generateProjectViaApi, checkApiHealth, ApiClientError } from "./api";

// Config context
export { ConfigProvider, useConfig } from "./config-context";

// Utils
export { cn } from "./utils";
