"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ProjectConfig, GenerationResult } from "@/lib/types";
import { steps, getOptionsForStep } from "@/lib/options";
import { generateProject } from "@/lib/generator";
import { useConfig } from "@/lib/config-context";
import { trackProjectGeneration, trackUserSession, trackInteraction } from "@/lib/analytics";
import { OptionCardComponent } from "@/components/option-card";
import { StepIndicator } from "@/components/step-indicator";
import { FileTree } from "@/components/file-tree";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Rocket,
  Sparkles,
  RotateCcw,
  FolderOpen,
  Check,
  Terminal,
  Loader2,
  Package,
  FileCode2,
  Layers,
  Shield,
  Activity,
  GitBranch,
  Cpu,
  Zap,
  Copy,
  CheckCheck,
  Clock,
  AlertTriangle,
  Info,
  Code,
  Database,
  Cloud,
  Settings,
} from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const defaultConfig: ProjectConfig = {
  projectName: "",
  pipeline: "nodejs-typescript",
  ci: "github-actions",
  infra: "aws-vpc-eks",
  deploy: "blue-green",
  envs: "dev,stage,prod",
  observability: "prometheus-grafana",
  security: "nist-csf",
};

const stepIcons: Record<string, React.ElementType> = {
  project: FolderOpen,
  pipeline: Terminal,
  ci: GitBranch,
  infra: Layers,
  deploy: Package,
  envs: Cpu,
  observability: Activity,
  security: Shield,
};

export function ProjectGenerator() {
  const { config: globalConfig, updateConfig: updateGlobalConfig } = useConfig();
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<ProjectConfig>(defaultConfig);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);
  const [generationTime, setGenerationTime] = useState<number>(0);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Track user session on mount
  useState(() => {
    trackUserSession();
  });

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  const isResultView = result !== null;

  const updateConfig = useCallback(
    (field: keyof ProjectConfig, value: string) => {
      const newConfig = { ...config, [field]: value };
      setConfig(newConfig);
      updateGlobalConfig(newConfig);
      trackInteraction();
    },
    [config, updateGlobalConfig]
  );

  const canProceed = useCallback(() => {
    const step = steps[currentStep];
    const value = config[step.field];
    if (step.field === "projectName") {
      return (
        typeof value === "string" &&
        value.trim().length > 0 &&
        value.length <= 50 &&
        /^[a-zA-Z0-9_-]+$/.test(value)
      );
    }
    return value !== undefined && value !== "";
  }, [currentStep, config]);

  const handleNext = useCallback(() => {
    if (!canProceed()) return;

    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    trackInteraction();

    if (isLastStep) {
      handleGenerate();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }, [canProceed, currentStep, isLastStep]);

  const handleBack = useCallback(() => {
    if (isResultView) {
      setResult(null);
      setGenerationError(null);
      return;
    }
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
      trackInteraction();
    }
  }, [isFirstStep, isResultView]);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setGenerationError(null);
    const startTime = Date.now();

    try {
      // Simulate realistic generation time based on complexity
      const complexity = calculateComplexity(config);
      const delay = Math.min(5000, 1000 + complexity * 200);
      
      await new Promise((r) => setTimeout(r, delay));

      const generationResult = generateProject(config);
      setResult(generationResult);
      setCompletedSteps((prev) => new Set([...prev, steps.length - 1]));
      
      const actualTime = (Date.now() - startTime) / 1000;
      setGenerationTime(actualTime);
      
      // Track analytics with realistic data
      trackProjectGeneration(config, actualTime, true);
    } catch (error) {
      console.error("Generation failed:", error);
      setGenerationError(error instanceof Error ? error.message : "Unknown error occurred");
      
      // Track failed generation
      const actualTime = (Date.now() - startTime) / 1000;
      trackProjectGeneration(config, actualTime, false, generationError || "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  }, [config]);

  const handleDownload = useCallback(async () => {
    if (!result) return;

    const zip = new JSZip();

    // Add files to ZIP
    for (const file of result.files) {
      if (file.type === "file") {
        zip.file(file.path, file.content);
      }
    }

    // Add metadata
    const metadata = {
      generated: new Date().toISOString(),
      projectName: result.projectName,
      config: config,
      summary: result.summary,
      generationTime: generationTime,
    };
    
    zip.file("project-metadata.json", JSON.stringify(metadata, null, 2));

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${result.projectName}-devops-project.zip`);
    trackInteraction();
  }, [result, config, generationTime]);

  const handleCopyCommand = useCallback(() => {
    const command = `devops-project-generator init --name ${config.projectName} --pipeline ${config.pipeline} --ci ${config.ci} --infra ${config.infra} --deploy ${config.deploy} --envs "${config.envs}" --observability ${config.observability} --security ${config.security}`;
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    trackInteraction();
  }, [config]);

  const handleReset = useCallback(() => {
    setConfig(defaultConfig);
    updateGlobalConfig(defaultConfig);
    setCurrentStep(0);
    setResult(null);
    setCompletedSteps(new Set());
    setGenerationError(null);
    setGenerationTime(0);
    trackInteraction();
  }, [updateGlobalConfig]);

  // Calculate project complexity for realistic generation time
  function calculateComplexity(cfg: ProjectConfig): number {
    let complexity = 1;
    
    // Infrastructure complexity
    if (cfg.infra.includes("multi-cloud")) complexity += 3;
    if (cfg.infra.includes("eks") || cfg.infra.includes("aks") || cfg.infra.includes("gke")) complexity += 2;
    if (cfg.infra.includes("on-prem")) complexity += 4;
    
    // Deployment complexity
    if (cfg.deploy.includes("gitops") || cfg.deploy.includes("helm")) complexity += 2;
    if (cfg.deploy.includes("canary")) complexity += 1;
    if (cfg.deploy.includes("serverless")) complexity += 2;
    
    // Environment complexity
    const envCount = cfg.envs.split(",").length;
    complexity += envCount - 1;
    
    // Security complexity
    if (cfg.security.includes("zero-trust") || cfg.security.includes("soc2") || cfg.security.includes("hipaa")) complexity += 3;
    if (cfg.security.includes("cis")) complexity += 2;
    
    // Observability complexity
    if (cfg.observability.includes("datadog") || cfg.observability.includes("new-relic")) complexity += 2;
    if (cfg.observability.includes("elk")) complexity += 2;
    
    return complexity;
  }

  // Generating state with realistic progress
  if (isGenerating) {
    const complexity = calculateComplexity(config);
    const estimatedTime = 1 + complexity * 0.5;
    
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-24 gap-4 sm:gap-6 animate-fade-in px-2">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-lg sm:text-xl font-semibold">Generating your project...</h3>
          <p className="text-sm text-muted-foreground">
            Creating {config.projectName} with your selected stack
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Estimated time: {estimatedTime}s</span>
          </div>
        </div>

        {/* Progress indicators */}
        <div className="w-full max-w-md space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Setting up base structure</span>
              <span>✓</span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: "100%" }} />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Generating pipeline files</span>
              <span>{complexity > 2 ? "✓" : "..."}</span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: complexity > 2 ? "100%" : "60%" }} />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Configuring infrastructure</span>
              <span>{complexity > 3 ? "✓" : "..."}</span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: complexity > 3 ? "100%" : "40%" }} />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Setting up deployment</span>
              <span>...</span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: "20%" }} />
            </div>
          </div>
        </div>

        {/* Configuration badges */}
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {config.ci !== "none" && (
            <Badge variant="secondary" className="gap-1">
              <GitBranch className="h-3 w-3" /> {config.ci}
            </Badge>
          )}
          <Badge variant="secondary" className="gap-1">
            <Layers className="h-3 w-3" /> {config.infra}
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Package className="h-3 w-3" /> {config.deploy}
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Activity className="h-3 w-3" /> {config.observability}
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Shield className="h-3 w-3" /> {config.security}
          </Badge>
        </div>
      </div>
    );
  }

  // Result view with enhanced information
  if (isResultView && result) {
    return (
      <div className="space-y-6 animate-slide-up">
        {/* Success Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">Project Generated Successfully!</h2>
          <p className="text-sm sm:text-base text-muted-foreground px-2">
            <span className="font-semibold text-foreground">{result.projectName}</span> is ready with{" "}
            <span className="font-semibold text-foreground">{result.summary.totalFiles} files</span> across{" "}
            <span className="font-semibold text-foreground">{result.summary.totalDirs} directories</span>
          </p>
          {generationTime > 0 && (
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Generated in {generationTime.toFixed(1)}s</span>
            </div>
          )}
        </div>

        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardContent className="p-4 text-center">
              <FileCode2 className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 sm:mb-1.5 text-blue-500" />
              <div className="text-xl sm:text-2xl font-bold text-blue-500">{result.summary.totalFiles}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">Files</div>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-500/5 border-amber-500/20">
            <CardContent className="p-4 text-center">
              <FolderOpen className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 sm:mb-1.5 text-amber-500" />
              <div className="text-xl sm:text-2xl font-bold text-amber-500">{result.summary.totalDirs}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">Directories</div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-500/5 border-green-500/20">
            <CardContent className="p-4 text-center">
              <Package className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 sm:mb-1.5 text-green-500" />
              <div className="text-xl sm:text-2xl font-bold text-green-500">{result.summary.components.length}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">Components</div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-500/5 border-purple-500/20">
            <CardContent className="p-4 text-center">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 sm:mb-1.5 text-purple-500" />
              <div className="text-xl sm:text-2xl font-bold text-purple-500">{config.envs === "single" ? 1 : config.envs.split(",").length}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">Environments</div>
            </CardContent>
          </Card>
        </div>

        {/* Component Badges with descriptions */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-center">
            Generated Components
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {result.summary.components.map((component) => (
              <Badge key={component} variant="outline" className="gap-1.5 py-1 px-3">
                <Check className="h-3 w-3 text-green-500" />
                {component}
              </Badge>
            ))}
          </div>
        </div>

        {/* Enhanced CLI Command */}
        <Card className="bg-muted/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-muted-foreground">
                <Terminal className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>Equivalent CLI command</span>
              </div>
              <Button variant="ghost" size="xs" onClick={handleCopyCommand} className="gap-1.5">
                {copied ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <code className="block text-[10px] sm:text-xs font-mono bg-background rounded-md p-2 sm:p-3 overflow-x-auto text-foreground/80 break-all sm:break-normal">
              devops-project-generator init --name {config.projectName} --pipeline {config.pipeline} --ci {config.ci} --infra {config.infra} --deploy {config.deploy} --envs &quot;{config.envs}&quot; --observability {config.observability} --security {config.security}
            </code>
          </CardContent>
        </Card>

        {/* File Tree */}
        <FileTree files={result.files} projectName={result.projectName} />

        {/* Project Information */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Next Steps:</strong> Extract the downloaded ZIP file, navigate to the project directory, and run <code className="bg-muted px-1 rounded">make setup</code> to initialize your DevOps project. All configurations are production-ready and can be customized for your specific needs.
          </AlertDescription>
        </Alert>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button onClick={handleDownload} size="lg" className="gap-2 px-6">
            <Download className="h-4 w-4" />
            Download as ZIP
          </Button>
          <Button onClick={handleReset} variant="outline" size="lg" className="gap-2 px-6">
            <RotateCcw className="h-4 w-4" />
            Generate Another
          </Button>
        </div>
      </div>
    );
  }

  // Form view with enhanced features
  const currentStepConfig = steps[currentStep];
  const options = getOptionsForStep(currentStepConfig.id);
  const StepIcon = stepIcons[currentStepConfig.id] || FolderOpen;

  return (
    <div key={currentStep} className="space-y-5 sm:space-y-8 animate-fade-in">
      {/* Step Indicator */}
      <div className="flex justify-center">
        <StepIndicator currentStep={currentStep} completedSteps={completedSteps} />
      </div>

      {/* Step Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-3">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary/10">
            <StepIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{currentStepConfig.title}</h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto px-2">
          {currentStepConfig.description}
        </p>
        <Badge variant="outline" className="text-[10px]">
          Step {currentStep + 1} of {steps.length}
        </Badge>
      </div>

      {/* Step Content */}
      <div className="max-w-2xl mx-auto px-1 sm:px-0">
        {currentStepConfig.field === "projectName" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-sm font-medium">
                Project Name
              </Label>
              <Input
                id="projectName"
                value={config.projectName}
                onChange={(e) => updateConfig("projectName", e.target.value)}
                placeholder="my-devops-project"
                className="text-lg h-12"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && canProceed() && handleNext()}
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground">
                Use letters, numbers, hyphens, and underscores only (max 50 chars)
              </p>
            </div>

            {config.projectName && !canProceed() && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Invalid name. Use only letters, numbers, hyphens, and underscores.
                </AlertDescription>
              </Alert>
            )}

            {/* Enhanced Quick Start Templates */}
            <div className="pt-4">
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                Quick Start Templates
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { name: "web-app", desc: "Web Application", icon: Code },
                  { name: "api-service", desc: "API Microservice", icon: Database },
                  { name: "infra-platform", desc: "Infrastructure Platform", icon: Cloud },
                  { name: "data-pipeline", desc: "Data Pipeline", icon: Settings },
                ].map((template) => (
                  <button
                    key={template.name}
                    onClick={() => updateConfig("projectName", template.name)}
                    className={cn(
                      "rounded-lg border p-3 text-left transition-all hover:border-primary/40 hover:bg-accent/50",
                      config.projectName === template.name && "border-primary bg-primary/5"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <template.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium font-mono">{template.name}</span>
                    </div>
                    <span className="block text-xs text-muted-foreground mt-0.5">{template.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className={cn(
            "grid gap-3",
            options.length <= 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2"
          )}>
            {options.map((option) => (
              <OptionCardComponent
                key={option.value}
                option={option}
                selected={config[currentStepConfig.field] === option.value}
                onSelect={(value) => updateConfig(currentStepConfig.field, value)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between max-w-2xl mx-auto pt-2 sm:pt-4 px-1 sm:px-0">
        <Button
          onClick={handleBack}
          variant="outline"
          size="default"
          disabled={isFirstStep}
          className="gap-1.5 sm:gap-2 text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back
        </Button>

        <div className="flex gap-3">
          {isLastStep ? (
            <Button
              onClick={handleNext}
              size="default"
              disabled={!canProceed()}
              className="gap-1.5 sm:gap-2 px-4 sm:px-6 text-sm bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Rocket className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Generate Project
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              size="default"
              disabled={!canProceed()}
              className="gap-1.5 sm:gap-2 px-4 sm:px-6 text-sm"
            >
              Next
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Enhanced Config Summary */}
      {currentStep > 0 && (
        <>
          <Separator className="max-w-2xl mx-auto" />
          <div className="max-w-2xl mx-auto px-1 sm:px-0">
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
              Your selections
            </p>
            <div className="flex flex-wrap gap-2">
              {config.projectName && (
                <Badge variant="outline" className="gap-1.5">
                  <FolderOpen className="h-3 w-3" />
                  {config.projectName}
                </Badge>
              )}
              {completedSteps.has(1) && (
                <Badge variant="outline" className="gap-1.5">
                  <Terminal className="h-3 w-3" />
                  {config.pipeline}
                </Badge>
              )}
              {completedSteps.has(2) && config.ci !== "none" && (
                <Badge variant="outline" className="gap-1.5">
                  <GitBranch className="h-3 w-3" />
                  {config.ci}
                </Badge>
              )}
              {completedSteps.has(3) && (
                <Badge variant="outline" className="gap-1.5">
                  <Layers className="h-3 w-3" />
                  {config.infra}
                </Badge>
              )}
              {completedSteps.has(4) && (
                <Badge variant="outline" className="gap-1.5">
                  <Package className="h-3 w-3" />
                  {config.deploy}
                </Badge>
              )}
              {completedSteps.has(5) && (
                <Badge variant="outline" className="gap-1.5">
                  <Cpu className="h-3 w-3" />
                  {config.envs}
                </Badge>
              )}
              {completedSteps.has(6) && (
                <Badge variant="outline" className="gap-1.5">
                  <Activity className="h-3 w-3" />
                  {config.observability}
                </Badge>
              )}
              {completedSteps.has(7) && (
                <Badge variant="outline" className="gap-1.5">
                  <Shield className="h-3 w-3" />
                  {config.security}
                </Badge>
              )}
            </div>
            
            {/* Complexity indicator */}
            {currentStep >= 3 && (
              <div className="mt-3 p-2 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Project Complexity:</span>
                  <Badge variant="outline" className={
                    calculateComplexity(config) <= 3 ? "bg-green-500/10 text-green-500 border-0" :
                    calculateComplexity(config) <= 6 ? "bg-amber-500/10 text-amber-500 border-0" :
                    "bg-red-500/10 text-red-500 border-0"
                  }>
                    {calculateComplexity(config) <= 3 ? "Simple" : 
                     calculateComplexity(config) <= 6 ? "Medium" : "Complex"}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
