"use client";

import { cn } from "@/lib/utils";
import { steps, getOptionsForStep } from "@/lib/options";
import { ProjectConfig } from "@/lib/types";
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
  AlertTriangle,
  Code,
  Database,
  Cloud,
  Settings,
  CornerDownLeft,
} from "lucide-react";
import { OptionCard } from "./option-card";
import { StepIndicator } from "./step-indicator";
import { StepSidebar } from "./step-sidebar";
import { StackPreviewPanel } from "./stack-preview-panel";
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
  onApplyTemplate?: (name: string, templateConfig: Partial<ProjectConfig>) => void;
  onNext: () => void;
  onBack: () => void;
  onGoToStep: (step: number) => void;
}

export function StepFormView({
  config,
  currentStep,
  completedSteps,
  isFirstStep,
  isLastStep,
  canProceed,
  onUpdateConfig,
  onApplyTemplate,
  onNext,
  onBack,
  onGoToStep,
}: StepFormViewProps) {
  const currentStepConfig = steps[currentStep];
  const options = getOptionsForStep(currentStepConfig.id);
  const StepIcon = STEP_ICONS[currentStepConfig.id] || FolderOpen;

  return (
    <div key={currentStep} className="animate-fade-in">
      <div className="lg:hidden mb-6">
        <StepIndicator currentStep={currentStep} completedSteps={completedSteps} />
      </div>

      <div className="flex gap-6 xl:gap-8 min-h-[520px]">
        <StepSidebar
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={onGoToStep}
        />

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10 border border-brand/20 brand-glow">
                <StepIcon className="h-6 w-6 text-brand" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                    {currentStepConfig.title}
                  </h2>
                  <Badge variant="outline" className="text-[10px] font-mono border-brand/30 text-brand">
                    {currentStep + 1}/{steps.length}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{currentStepConfig.description}</p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            {currentStepConfig.field === "projectName" ? (
              <div className="space-y-5 max-w-xl">
                <div className="space-y-2">
                  <Label htmlFor="projectName" className="text-sm font-medium">
                    Project identifier
                  </Label>
                  <Input
                    id="projectName"
                    value={config.projectName}
                    onChange={(e) => onUpdateConfig("projectName", e.target.value)}
                    placeholder="my-devops-project"
                    className="text-lg h-12 font-mono border-border/80 focus-visible:ring-brand/40"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && canProceed() && onNext()}
                    maxLength={50}
                  />
                  <p className="text-xs text-muted-foreground">
                    Letters, numbers, hyphens, underscores · max 50 characters
                  </p>
                </div>

                {config.projectName && !canProceed() && (
                  <Alert className="border-amber-500/30 bg-amber-500/5">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <AlertDescription className="text-xs">
                      Invalid name. Use only letters, numbers, hyphens, and underscores.
                    </AlertDescription>
                  </Alert>
                )}

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                    Quick start templates
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {QUICK_START_TEMPLATES.map((template) => {
                      const Icon = templateIcons[template.iconKey];
                      return (
                        <button
                          key={template.name}
                          type="button"
                          onClick={() => {
                            if (onApplyTemplate) {
                              onApplyTemplate(template.name, template.config);
                            } else {
                              onUpdateConfig("projectName", template.name);
                            }
                          }}
                          className={cn(
                            "rounded-xl border p-3 text-left transition-all hover:border-brand/40 hover:bg-brand/5",
                            config.projectName === template.name &&
                              "border-brand bg-brand/10 ring-1 ring-brand/20"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <Icon className="h-4 w-4 text-brand shrink-0" />
                              <span className="text-sm font-semibold truncate">{template.title}</span>
                            </div>
                            <Badge variant="secondary" className="font-mono text-[10px] px-1.5 py-0 shrink-0">
                              {template.name}
                            </Badge>
                          </div>
                          <span className="block text-xs text-muted-foreground mt-1 leading-relaxed">
                            {template.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 max-w-3xl">
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

          <div className="flex items-center justify-between pt-6 mt-6 border-t border-border/60">
            <Button
              onClick={onBack}
              variant="ghost"
              size="default"
              disabled={isFirstStep}
              className="gap-2 text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              {!isLastStep && (
                <span className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground">
                  <CornerDownLeft className="h-3 w-3" />
                  Enter to continue
                </span>
              )}
              {isLastStep ? (
                <Button
                  onClick={onNext}
                  size="lg"
                  disabled={!canProceed()}
                  className="gap-2 px-6 bg-brand hover:bg-brand/90 text-brand-foreground shadow-lg shadow-brand/20"
                >
                  <Rocket className="h-4 w-4" />
                  Generate Project
                </Button>
              ) : (
                <Button
                  onClick={onNext}
                  size="lg"
                  disabled={!canProceed()}
                  className="gap-2 px-6 bg-brand hover:bg-brand/90 text-brand-foreground"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <StackPreviewPanel
          config={config}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
      </div>
    </div>
  );
}
