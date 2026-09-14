import { ProjectConfig, GeneratedFile } from "@/lib/types";
import { normalizeProjectName } from "../file-utils";

export function generateRealisticSecurityAddonFiles(config: ProjectConfig): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const projectName = normalizeProjectName(config.projectName);
  const addons = new Set(config.securityAddons || ["cosign", "sbom", "trivy", "gitleaks", "rbac"]);

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

  return files;
}
