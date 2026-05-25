"use client";

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
    updateConfig,
    canProceed,
    handleNext,
    handleBack,
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
    <StepFormView
      config={config}
      currentStep={currentStep}
      completedSteps={completedSteps}
      isFirstStep={isFirstStep}
      isLastStep={isLastStep}
      canProceed={canProceed}
      onUpdateConfig={updateConfig}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}
