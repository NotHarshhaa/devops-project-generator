import { StepConfig } from "../types";

export const steps: StepConfig[] = [
  {
    id: "project",
    title: "Project Name",
    description: "Give your DevOps project a name",
    field: "projectName",
  },
  {
    id: "pipeline",
    title: "Pipeline Framework",
    description: "Choose your CI/CD pipeline framework and language",
    field: "pipeline",
  },
  {
    id: "ci",
    title: "CI/CD Platform",
    description: "Choose your continuous integration and delivery platform",
    field: "ci",
  },
  {
    id: "infra",
    title: "Infrastructure Pattern",
    description: "Select your infrastructure pattern and cloud provider",
    field: "infra",
  },
  {
    id: "deploy",
    title: "Deployment Strategy",
    description: "Pick your deployment strategy and automation",
    field: "deploy",
  },
  {
    id: "envs",
    title: "Environments",
    description: "Configure your deployment environments",
    field: "envs",
  },
  {
    id: "observability",
    title: "Observability Stack",
    description: "Set up monitoring, logging, and alerting",
    field: "observability",
  },
  {
    id: "security",
    title: "Security Framework",
    description: "Define your security and compliance framework",
    field: "security",
  },
  {
    id: "devcontainer",
    title: "DevContainer Sandbox",
    description: "Configure VS Code & Cursor local development tooling sandbox",
    field: "devcontainer",
  },
];
