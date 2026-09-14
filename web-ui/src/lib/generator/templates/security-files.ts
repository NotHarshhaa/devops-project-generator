import { ProjectConfig, GeneratedFile } from "@/lib/types";
import { normalizeProjectName } from "../file-utils";

export function generateRealisticSecurityFiles(config: ProjectConfig): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const projectName = normalizeProjectName(config.projectName);
  const security = config.security;

  // Base security scanning configuration (Trivy)
  files.push({
    path: `${projectName}/security/trivy.yaml`,
    content: `timeout: 10m
severity:
  - CRITICAL
  - HIGH
exit-code: 1
ignore-unfixed: true
vuln-type:
  - os
  - library
scan:
  scanners:
    - vuln
    - config
    - secret
`,
    type: "file",
  });

  files.push({
    path: `${projectName}/security/.trivyignore`,
    content: `# Trivy ignore file for accepted risks
# Format: CVE-YYYY-XXXX
`,
    type: "file",
  });

  files.push({
    path: `${projectName}/security/policies/security-policy.yaml`,
    content: `# Enterprise Security & Encryption Policy
# Project: ${config.projectName}
# Framework: ${config.security}

policy:
  name: "${config.projectName}-security-policy"
  version: "2.0.0"

authentication:
  methods:
    - jwt
    - mTLS
    - oauth2
  jwt:
    algorithm: "ES384"
    token_expiry: "1h"
    refresh_token_expiry: "7d"

authorization:
  rbac:
    enabled: true
    default_role: "viewer"
    roles:
      - name: "admin"
        permissions: ["*"]
      - name: "operator"
        permissions: ["read", "write", "deploy"]
      - name: "viewer"
        permissions: ["read"]

encryption:
  at_rest:
    algorithm: "AES-256-GCM"
    key_rotation_days: 90
    kms_managed: true
  in_transit:
    tls_version: "1.3"
    cipher_suites:
      - "TLS_AES_256_GCM_SHA384"
      - "TLS_CHACHA20_POLY1305_SHA256"

audit:
  enabled: true
  log_all_access: true
  retention_days: 365
  export_target: "s3://${config.projectName}-security-audit"
`,
    type: "file",
  });

  if (security === "nist-csf") {
    files.push({
      path: `${projectName}/security/nist-csf/controls-matrix.md`,
      content: `# NIST Cybersecurity Framework Implementation Matrix

## Project: ${config.projectName}

| Function | Category | Implemented Controls | Status |
| :--- | :--- | :--- | :--- |
| **IDENTIFY (ID)** | Asset Management (ID.AM) | Automated inventory via Terraform and Kubernetes tags | ✅ Enforced |
| **PROTECT (PR)** | Access Control (PR.AC) | Least privilege RBAC, Non-root containers, NetworkPolicies | ✅ Enforced |
| **DETECT (DE)** | Anomalies and Events (DE.AE) | Prometheus & Audit logs threshold alerts | ✅ Active |
| **RESPOND (RS)** | Response Planning (RS.RP) | Automated pod restarts, circuit breaking | ✅ Verified |
| **RECOVER (RC)** | Recovery Planning (RC.RP) | Multi-AZ replication, persistent volume snapshots | ✅ Configured |
`,
      type: "file",
    });

    files.push({
      path: `${projectName}/security/nist-csf/audit-policy.yaml`,
      content: `apiVersion: audit.k8s.io/v1
kind: Policy
rules:
  - level: Metadata
    resources:
      - group: ""
        resources: ["secrets", "configmaps"]
  - level: RequestResponse
    resources:
      - group: ""
        resources: ["pods/exec", "pods/portforward"]
`,
      type: "file",
    });
  } else if (security === "cis-benchmarks") {
    files.push({
      path: `${projectName}/security/cis/pod-security-standards.yaml`,
      content: `apiVersion: v1
kind: Namespace
metadata:
  name: ${config.projectName}-prod
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/enforce-version: latest
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
`,
      type: "file",
    });

    files.push({
      path: `${projectName}/security/cis/sysctl-hardening.conf`,
      content: `# CIS Kubernetes & Linux Host Hardening
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0
fs.protected_hardlinks = 1
fs.protected_symlinks = 1
`,
      type: "file",
    });
  } else if (security === "zero-trust") {
    files.push({
      path: `${projectName}/security/zero-trust/network-policy-default-deny.yaml`,
      content: `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: default
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-app-ingress
  namespace: default
spec:
  podSelector:
    matchLabels:
      app: ${config.projectName}
  ingress:
  - from:
    - podSelector:
        matchLabels:
          role: ingress-controller
    ports:
    - protocol: TCP
      port: 8080
`,
      type: "file",
    });

    files.push({
      path: `${projectName}/security/zero-trust/mtls-peer-authentication.yaml`,
      content: `apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default-strict-mtls
  namespace: default
spec:
  mtls:
    mode: STRICT
`,
      type: "file",
    });
  } else if (security === "soc2" || security === "soc2-compliance") {
    files.push({
      path: `${projectName}/security/soc2/access-control-policy.md`,
      content: `# SOC2 Type II Access Control & Encryption Policy

## Confidentiality & Principle of Least Privilege
- **Access Control**: Production clusters are restricted to automated CI/CD runners using ephemeral tokens.
- **Encryption at Rest**: All databases and EBS/PVC storage must use KMS customer-managed keys (AES-256).
- **Encryption in Transit**: TLS 1.3 enforced for all internal and external communication.
- **Audit Trails**: CloudTrail and Kubernetes audit logs retained with object lock for 365 days.
`,
      type: "file",
    });

    files.push({
      path: `${projectName}/security/soc2/secret-store.yaml`,
      content: `apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: vault-backend
spec:
  provider:
    vault:
      server: "https://vault.internal:8200"
      path: "secret"
      version: "v2"
      auth:
        kubernetes:
          mountPath: "kubernetes"
          role: "${config.projectName}-reader"
`,
      type: "file",
    });
  } else if (security === "gdpr" || security === "gdpr-compliance") {
    files.push({
      path: `${projectName}/security/gdpr/data-protection-checklist.md`,
      content: `# GDPR Compliance Checklist (Article 32 & 33)

- [x] Personal data stored in dedicated encrypted databases
- [x] Automated data minimization & retention policies enabled
- [x] Data subject erasure (Right to be Forgotten) API endpoint implemented
- [x] Pseudonymization of user identifiers in application telemetry
- [x] Data transfer restricted to approved EU/UK jurisdictions
`,
      type: "file",
    });
  } else {
    // hipaa or fallback
    files.push({
      path: `${projectName}/security/hipaa/phi-protection-policy.md`,
      content: `# HIPAA Security Rule Safeguards

## Technical Safeguards (§ 164.312)
1. **Access Control**: Unique user identification and automatic logoff.
2. **Audit Controls**: All PHI read/write events logged with immutable timestamps.
3. **Integrity**: Cryptographic checksums on health records.
4. **Transmission Security**: Mandatory end-to-end TLS encryption with FIPS 140-2 validated modules.
`,
      type: "file",
    });
  }

  return files;
}
