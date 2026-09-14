"use client";

import { useState, useCallback, useEffect } from "react";
import { ProjectConfig, GenerationResult } from "@/lib/types";
import { steps } from "@/lib/options";
import { generateProject } from "@/lib/generator";
import { generateProjectViaApi } from "@/lib/api/client";
import { useConfig } from "@/lib/config-context";
import { trackProjectGeneration, trackUserSession, trackInteraction } from "@/lib/analytics";
import { canProceedToNextStep } from "@/lib/validation";
import { DEFAULT_CONFIG } from "../constants";
import { calculateComplexity } from "../utils";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const DRAFT_STORAGE_KEY = "devops_generator_draft_v2";

interface StoredDraft {
  config: ProjectConfig;
  currentStep: number;
  completedSteps: number[];
  timestamp: number;
}

export function useProjectGenerator() {
  const { updateConfig: updateGlobalConfig } = useConfig();
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<ProjectConfig>(DEFAULT_CONFIG);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);
  const [generationTime, setGenerationTime] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);

  // Hydrate draft state from localStorage on client mount
  useEffect(() => {
    trackUserSession();
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed: StoredDraft = JSON.parse(saved);
        if (parsed && parsed.config) {
          setConfig(parsed.config);
          updateGlobalConfig(parsed.config);
          if (
            typeof parsed.currentStep === "number" &&
            parsed.currentStep >= 0 &&
            parsed.currentStep < steps.length
          ) {
            setCurrentStep(parsed.currentStep);
          }
          if (Array.isArray(parsed.completedSteps)) {
            setCompletedSteps(new Set(parsed.completedSteps));
          }
          setDraftRestored(true);
        }
      }
    } catch (e) {
      console.warn("Failed to load draft from localStorage:", e);
    }
  }, [updateGlobalConfig]);

  // Persist draft whenever config or navigation state updates
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const draft: StoredDraft = {
        config,
        currentStep,
        completedSteps: Array.from(completedSteps),
        timestamp: Date.now(),
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch (e) {
      console.warn("Failed to save draft to localStorage:", e);
    }
  }, [config, currentStep, completedSteps]);

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

  const applyTemplate = useCallback(
    (templateName: string, templateConfig: Partial<ProjectConfig>) => {
      const newConfig = { ...config, ...templateConfig, projectName: templateName };
      setConfig(newConfig);
      updateGlobalConfig(newConfig);
      trackInteraction();
    },
    [config, updateGlobalConfig]
  );

  const canProceed = useCallback(() => {
    return canProceedToNextStep(config, currentStep);
  }, [currentStep, config]);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setGenerationError(null);
    const startTime = Date.now();

    try {
      // Small snappy animation delay for seamless UX
      await new Promise((r) => setTimeout(r, 400));

      let generationResult: GenerationResult;
      try {
        generationResult = await generateProjectViaApi(config);
      } catch (apiError) {
        console.warn("Backend API route error, using client-side generator fallback:", apiError);
        generationResult = generateProject(config);
      }

      setResult(generationResult);
      setCompletedSteps((prev) => new Set([...prev, steps.length - 1]));

      const actualTime = (Date.now() - startTime) / 1000;
      setGenerationTime(actualTime);
      trackProjectGeneration(config, actualTime, true);
    } catch (error) {
      console.error("Generation failed:", error);
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      setGenerationError(message);
      const actualTime = (Date.now() - startTime) / 1000;
      trackProjectGeneration(config, actualTime, false, message);
    } finally {
      setIsGenerating(false);
    }
  }, [config]);

  const handleNext = useCallback(() => {
    if (!canProceed()) return;
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    trackInteraction();
    if (isLastStep) {
      handleGenerate();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }, [canProceed, currentStep, isLastStep, handleGenerate]);

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

  const goToStep = useCallback(
    (step: number) => {
      if (step < 0 || step >= steps.length) return;
      if (step <= currentStep || completedSteps.has(step)) {
        setCurrentStep(step);
        trackInteraction();
      }
    },
    [currentStep, completedSteps]
  );

  const handleDownload = useCallback(async () => {
    if (!result) return;

    const zip = new JSZip();
    for (const file of result.files) {
      if (file.type === "file") {
        zip.file(file.path, file.content);
      }
    }

    zip.file(
      "project-metadata.json",
      JSON.stringify(
        {
          generated: new Date().toISOString(),
          projectName: result.projectName,
          config,
          summary: result.summary,
          generationTime,
        },
        null,
        2
      )
    );

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
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch (e) {
        console.warn("Failed to clear draft from localStorage:", e);
      }
    }
    setConfig(DEFAULT_CONFIG);
    updateGlobalConfig(DEFAULT_CONFIG);
    setCurrentStep(0);
    setResult(null);
    setCompletedSteps(new Set());
    setGenerationError(null);
    setGenerationTime(0);
    setDraftRestored(false);
    trackInteraction();
  }, [updateGlobalConfig]);

  return {
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
    draftRestored,
    updateConfig,
    applyTemplate,
    canProceed,
    handleNext,
    handleBack,
    goToStep,
    handleDownload,
    handleCopyCommand,
    handleReset,
  };
}
