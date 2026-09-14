"use client";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useProjectGenerator } from "./hooks/use-project-generator";
import { GeneratingView } from "./components/generating-view";
import { ResultView } from "./components/result-view";
import { StepFormView } from "./components/step-form-view";

export function ProjectGenerator() {
  const {
    config,
    currentStep,
    completedSteps,
    result,
    isGenerating,
    isLastStep,
    isFirstStep,
    isResultView,
    copied,
    generationTime,
    generationError,
    updateConfig,
    applyTemplate,
    canProceed,
    handleNext,
    handleBack,
    goToStep,
    handleDownload,
    handleCopyCommand,
    handleReset,
  } = useProjectGenerator();

  if (isGenerating) {
    return <GeneratingView config={config} />;
  }

  if (isResultView && result) {
    return (
      <ResultView
        config={config}
        result={result}
        generationTime={generationTime}
        copied={copied}
        onDownload={handleDownload}
        onReset={handleReset}
        onCopyCommand={handleCopyCommand}
      />
    );
  }

  return (
    <div className="space-y-4">
      {generationError && (
        <Alert className="border-red-500/30 bg-red-500/10 flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
            <AlertDescription className="text-sm text-red-500 font-medium">
              Generation failed: {generationError}
            </AlertDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleNext}
            className="border-red-500/40 text-xs shrink-0"
          >
            Retry Generation
          </Button>
        </Alert>
      )}
      <StepFormView
        config={config}
        currentStep={currentStep}
        completedSteps={completedSteps}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        canProceed={canProceed}
        onUpdateConfig={updateConfig}
        onApplyTemplate={applyTemplate}
        onNext={handleNext}
        onBack={handleBack}
        onGoToStep={goToStep}
      />
    </div>
  );
}
