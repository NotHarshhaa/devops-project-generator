import { ProjectConfig, GeneratedFile } from "@/lib/types";
import { normalizeProjectName } from "../file-utils";

export function generateRealisticDevContainerFiles(config: ProjectConfig): GeneratedFile[] {
  if (config.devcontainer === "none") {
    return [];
  }

  const files: GeneratedFile[] = [];
  const projectName = normalizeProjectName(config.projectName);
  const isMinimal = config.devcontainer === "minimal";

  // Determine base image and extensions by language runtime
  let baseImage = "mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye";
  const languageExtensions: string[] = [];

  switch (config.pipeline) {
    case "python":
      baseImage = "mcr.microsoft.com/devcontainers/python:1-3.11-bullseye";
      languageExtensions.push("ms-python.python", "ms-python.vscode-pylance", "charliermarsh.ruff");
      break;
    case "go":
      baseImage = "mcr.microsoft.com/devcontainers/go:1-1.22-bullseye";
      languageExtensions.push("golang.go");
      break;
    case "java-maven":
      baseImage = "mcr.microsoft.com/devcontainers/java:1-17-bullseye";
      languageExtensions.push("vscjava.vscode-java-pack");
      break;
    case "nodejs-typescript":
    default:
      baseImage = "mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye";
      languageExtensions.push("dbaeumer.vscode-eslint", "esbenp.prettier-vscode");
      break;
  }

  // Determine DevOps tools and extensions
  const devopsExtensions = [
    "redhat.vscode-yaml",
    "ms-azuretools.vscode-docker",
    "github.vscode-github-actions",
    "eamodio.gitlens",
  ];

  const features: Record<string, Record<string, string>> = {
    "ghcr.io/devcontainers/features/common-utils:2": {
      installZsh: "true",
      username: "vscode",
      upgradePackages: "true",
    },
    "ghcr.io/devcontainers/features/docker-in-docker:2": {
      version: "latest",
      enableDockerInstall: "true",
    },
  };

  if (!isMinimal) {
    // Add Infrastructure & Cloud Tooling
    if (config.infra.includes("terraform") || config.infra.includes("multicloud") || config.infra.includes("vpc") || config.infra.includes("vnet")) {
      features["ghcr.io/devcontainers/features/terraform:1"] = {
        version: "latest",
        tflint: "latest",
      };
      devopsExtensions.push("hashicorp.terraform");
    }

    if (config.deploy === "helm-charts" || config.deploy === "kustomize" || config.deploy === "gitops-argocd" || config.infra.includes("eks") || config.infra.includes("aks") || config.infra.includes("gke") || config.infra.includes("kubernetes")) {
      features["ghcr.io/devcontainers/features/kubectl-helm-minikube:1"] = {
        version: "latest",
        helm: "latest",
      };
      devopsExtensions.push("ms-kubernetes-tools.vscode-kubernetes-tools");
    }

    if (config.infra.includes("aws") || config.infra.includes("eks") || config.infra.includes("fargate")) {
      features["ghcr.io/devcontainers/features/aws-cli:1"] = {};
    } else if (config.infra.includes("azure") || config.infra.includes("aks")) {
      features["ghcr.io/devcontainers/features/azure-cli:1"] = {};
    } else if (config.infra.includes("gcp") || config.infra.includes("gke")) {
      features["ghcr.io/devcontainers/features/gcloud-cli:1"] = {};
    }
  }

  const allExtensions = Array.from(new Set([...languageExtensions, ...devopsExtensions]));

  const devcontainerJson = {
    name: `${projectName} Sandbox (DevOps Tooling)`,
    build: {
      dockerfile: "Dockerfile",
      args: {
        BASE_IMAGE: baseImage,
      },
    },
    features,
    customizations: {
      vscode: {
        settings: {
          "terminal.integrated.defaultProfile.linux": "zsh",
          "editor.formatOnSave": true,
          "editor.tabSize": 2,
          "files.trimTrailingWhitespace": true,
        },
        extensions: allExtensions,
      },
    },
    forwardPorts: [3000, 8080, 9090],
    postCreateCommand: "make setup || true",
    remoteUser: "vscode",
  };

  files.push({
    path: `${projectName}/.devcontainer/devcontainer.json`,
    content: JSON.stringify(devcontainerJson, null, 2) + "\n",
    type: "file",
  });

  files.push({
    path: `${projectName}/.devcontainer/Dockerfile`,
    content: `ARG BASE_IMAGE=${baseImage}
FROM \${BASE_IMAGE}

# Install essential CLI build utilities and security scanners
USER root
RUN apt-get update && apt-get install -y --no-install-recommends \\
    curl \\
    wget \\
    git \\
    make \\
    jq \\
    unzip \\
    ca-certificates \\
    gnupg \\
    lsb-release \\
    && rm -rf /var/lib/apt/lists/*

# Install Trivy security scanner
RUN curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin

# Switch back to non-root developer user
USER vscode
WORKDIR /workspace
`,
    type: "file",
  });

  return files;
}
