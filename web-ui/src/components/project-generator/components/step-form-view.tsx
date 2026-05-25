"use client";

import { cn } from "@/lib/utils";
import { ProjectConfig } from "@/lib/types";
import { steps, getOptionsForStep } from "@/lib/options";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  ArrowRight,
  Rocket,
  FolderOpen,
  Terminal,
  GitBranch,
  Layers,
  Package,
  Cpu,
  Activity,
  Shield,
  AlertTriangle,
  Code,
  Database,
  Cloud,
  Settings,
} from "lucide-react";
import { OptionCard } from "./option-card";
import { StepIndicator } from "./step-indicator";
import { ConfigSummary } from "./config-summary";
import { STEP_ICONS, QUICK_START_TEMPLATES } from "../constants";

const templateIcons = {
  code: Code,
  database: Database,
  cloud: Cloud,
  settings: Settings,
};

interface StepFormViewProps {
  config: ProjectConfig;
  currentStep: number;
  completedSteps: Set<number>;
  isFirstStep: boolean;
  isLastStep: boolean;
  canProceed: () => boolean;
  onUpdateConfig: (field: keyof ProjectConfig, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepFormView({
  config,
  currentStep,
  completedSteps,
  isFirstStep,
  isLastStep,
  canProceed,
  onUpdateConfig,
  onNext,
  onBack,
}: StepFormViewProps) {
  const currentStepConfig = steps[currentStep];
  const options = getOptionsForStep(currentStepConfig.id);
  const StepIcon = STEP_ICONS[currentStepConfig.id] || FolderOpen;

  return (
    <div key={currentStep} className="space-y-5 sm:space-y-8 animate-fade-in">
      <div className="flex justify-center">
        <StepIndicator currentStep={currentStep} completedSteps={completedSteps} />
      </div>

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
                onChange={(e) => onUpdateConfig("projectName", e.target.value)}
                placeholder="my-devops-project"
                className="text-lg h-12"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && canProceed() && onNext()}
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

            <div className="pt-4">
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                Quick Start Templates
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_START_TEMPLATES.map((template) => {
                  const Icon = templateIcons[template.iconKey];
                  return (
                    <button
                      key={template.name}
                      onClick={() => onUpdateConfig("projectName", template.name)}
                      className={cn(
                        "rounded-lg border p-3 text-left transition-all hover:border-primary/40 hover:bg-accent/50",
                        config.projectName === template.name && "border-primary bg-primary/5"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium font-mono">{template.name}</span>
                      </div>
                      <span className="block text-xs text-muted-foreground mt-0.5">{template.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            {options.map((option) => (
              <OptionCard
                key={option.value}
                option={option}
                selected={config[currentStepConfig.field] === option.value}
                onSelect={(value) => onUpdateConfig(currentStepConfig.field, value)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between max-w-2xl mx-auto pt-2 sm:pt-4 px-1 sm:px-0">
        <Button
          onClick={onBack}
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
              onClick={onNext}
              size="default"
              disabled={!canProceed()}
              className="gap-1.5 sm:gap-2 px-4 sm:px-6 text-sm bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Rocket className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Generate Project
            </Button>
          ) : (
            <Button
              onClick={onNext}
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

      <ConfigSummary config={config} currentStep={currentStep} completedSteps={completedSteps} />
    </div>
  );
}
