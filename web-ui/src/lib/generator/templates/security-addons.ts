import { ProjectConfig, GeneratedFile } from "@/lib/types";
import { normalizeProjectName } from "../file-utils";

export function generateRealisticSecurityAddonFiles(config: ProjectConfig): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const projectName = normalizeProjectName(config.projectName);
  const addons = new Set(
    config.securityAddons || ["cosign", "sbom", "trivy", "gitleaks", "rbac", "infracost", "precommit", "dependabot"]
  );

  // 1. Gitleaks Secret Scanner
  if (addons.has("gitleaks")) {
    files.push({
      path: `${projectName}/.gitleaks.toml`,
      content: `# Gitleaks Configuration: Pre-commit & CI Secret Prevention
title = "DevOps Project Generator Gitleaks Baseline"

[extend]
useDefault = true

[allowlist]
description = "Global allowlist for mock/example secrets"
paths = [
  '''tests/.*''',
  '''fixtures/.*''',
  '''\\.devcontainer/.*'''
]
regexes = [
  '''example-api-key''',
  '''YOUR_KEY_HERE'''
]
`,
      type: "file",
    });
  }

  // 2. Cosign Container Image Signing Workflow
  if (addons.has("cosign")) {
    files.push({
      path: `${projectName}/.github/workflows/cosign-sign.yml`,
      content: `name: "Artifact Integrity & Container Signing (Cosign)"

on:
  push:
    tags:
      - 'v*.*.*'
  workflow_dispatch:

permissions:
  contents: read
  packages: write
  id-token: write # Required for Sigstore keyless OIDC signing

jobs:
  sign:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Install Cosign
        uses: sigstore/cosign-installer@v3.5.0

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Sign container image
        run: |
          IMAGE_URI="ghcr.io/\${{ github.repository }}:\${{ github.ref_name }}"
          echo "Signing $IMAGE_URI with Sigstore OIDC..."
          cosign sign --yes "$IMAGE_URI"
`,
      type: "file",
    });
  }

  // 3. Syft SBOM Generation Workflow
  if (addons.has("sbom")) {
    files.push({
      path: `${projectName}/.github/workflows/syft-sbom.yml`,
      content: `name: "Supply Chain Security: SBOM Generation (Syft)"

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

permissions:
  contents: read
  id-token: write

jobs:
  sbom:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Generate CycloneDX & SPDX SBOM
        uses: anchore/sbom-action@v0
        with:
          image: ghcr.io/\${{ github.repository }}:latest
          format: cyclonedx-json
          output-file: cyclonedx-sbom.json

      - name: Upload SBOM Artifact
        uses: actions/upload-artifact@v4
        with:
          name: sbom-cyclonedx
          path: cyclonedx-sbom.json
`,
      type: "file",
    });
  }

  // 4. CIS Kubernetes Security Policies & RBAC
  if (addons.has("rbac")) {
    files.push({
      path: `${projectName}/k8s/security-policies.yaml`,
      content: `apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: ${projectName}-pdb
  namespace: production
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app: ${projectName}
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: ${projectName}-default-deny
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: ${projectName}-allow-ingress
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: ${projectName}
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          kubernetes.io/metadata.name: ingress-nginx
    ports:
    - protocol: TCP
      port: 8080
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: production
  name: ${projectName}-service-role
rules:
- apiGroups: [""]
  resources: ["configmaps", "secrets"]
  verbs: ["get", "watch", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: ${projectName}-binding
  namespace: production
subjects:
- kind: ServiceAccount
  name: ${projectName}-sa
  namespace: production
roleRef:
  kind: Role
  name: ${projectName}-service-role
  apiGroup: rbac.authorization.k8s.io
`,
      type: "file",
    });
  }

  // 5. Infracost FinOps Cloud Cost Estimation
  if (addons.has("infracost")) {
    files.push({
      path: `${projectName}/infracost.yml`,
      content: `version: 0.1

projects:
  - path: infra/terraform
    name: terraform-production
    terraform_var_files:
      - terraform.tfvars
`,
      type: "file",
    });

    files.push({
      path: `${projectName}/.github/workflows/infracost.yml`,
      content: `name: "FinOps: Infrastructure Cost Estimation"

on:
  pull_request:
    paths:
      - 'infra/**'
      - 'terraform/**'

permissions:
  contents: read
  pull-requests: write # Required to comment cost diff on PR

jobs:
  infracost:
    name: Infracost Diff & Guardrail
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Infracost
        uses: infracost/actions/setup@v3
        with:
          api-key: \${{ secrets.INFRACOST_API_KEY }}

      - name: Generate Infracost Cost Diff
        run: |
          infracost breakdown --path=infra --format=json --out-file=/tmp/infracost.json
          infracost comment github --path=/tmp/infracost.json \\
            --repo=\${{ github.repository }} \\
            --pull-request=\${{ github.event.pull_request.number }} \\
            --token=\${{ secrets.GITHUB_TOKEN }} \\
            --behavior=update
`,
      type: "file",
    });
  }

  // 6. Pre-Commit Hooks
  if (addons.has("precommit")) {
    files.push({
      path: `${projectName}/.pre-commit-config.yaml`,
      content: `# Production Pre-Commit Hooks
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.6.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
        args: ['--unsafe']
      - id: check-added-large-files
        args: ['--maxkb=1000']

  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.2
    hooks:
      - id: gitleaks

  - repo: https://github.com/antonbabenko/pre-commit-terraform
    rev: v1.89.1
    hooks:
      - id: terraform_fmt
      - id: terraform_docs
`,
      type: "file",
    });
  }

  // 7. Dependabot Automated Dependency Security
  if (addons.has("dependabot")) {
    files.push({
      path: `${projectName}/.github/dependabot.yml`,
      content: `version: 2
updates:
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    commit-message:
      prefix: "chore(deps-ci)"

  - package-ecosystem: "docker"
    directory: "/deploy/docker"
    schedule:
      interval: "weekly"
    commit-message:
      prefix: "chore(deps-docker)"

  - package-ecosystem: "terraform"
    directory: "/infra/terraform"
    schedule:
      interval: "weekly"
    commit-message:
      prefix: "chore(deps-infra)"
`,
      type: "file",
    });
  }

  // 8. OpenSSF Scorecard Supply Chain Security
  if (addons.has("scorecard")) {
    files.push({
      path: `${projectName}/.github/workflows/scorecard.yml`,
      content: `name: "OpenSSF Scorecard Supply Chain Security"

on:
  branch_protection_rule:
  schedule:
    - cron: '30 1 * * 1'
  push:
    branches: [ main ]

permissions: read-all

jobs:
  analysis:
    name: Scorecard Analysis
    runs-on: ubuntu-latest
    permissions:
      security-events: write
      id-token: write

    steps:
      - name: "Checkout code"
        uses: actions/checkout@v4
        with:
          persist-credentials: false

      - name: "Run analysis"
        uses: ossf/scorecard-action@v2.3.1
        with:
          results_file: results.sarif
          results_format: sarif
          publish_results: true

      - name: "Upload SARIF results"
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: results.sarif
`,
      type: "file",
    });
  }

  // 9. KEDA Event-Driven Autoscaling (if applicable)
  files.push({
    path: `${projectName}/deploy/k8s/keda-scaledobject.yaml`,
    content: `apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: ${projectName}-keda-autoscaler
  namespace: production
spec:
  scaleTargetRef:
    name: ${projectName}
  pollingInterval: 15
  cooldownPeriod: 300
  minReplicaCount: 2
  maxReplicaCount: 20
  triggers:
  - type: prometheus
    metadata:
      serverAddress: http://prometheus-server.monitoring.svc.cluster.local:9090
      metricName: http_requests_per_second
      query: sum(rate(http_requests_total{app="${projectName}"}[2m]))
      threshold: '100'
`,
    type: "file",
  });

  return files;
}
