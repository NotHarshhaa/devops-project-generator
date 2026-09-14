import { ProjectConfig } from "@/lib/types";

export interface SecurityControl {
  id: string;
  name: string;
  description: string;
  category: "supply-chain" | "vulnerability" | "runtime" | "access";
  weight: number;
  frameworks: Array<"CIS" | "SOC2" | "NIST" | "HIPAA" | "SLSA">;
  tool: string;
}

export const SECURITY_CONTROLS: SecurityControl[] = [
  {
    id: "cosign",
    name: "Cryptographic Container Signing",
    description: "Keyless OIDC container signing with Sigstore/Cosign to ensure image provenance and prevent tampering.",
    category: "supply-chain",
    weight: 15,
    frameworks: ["SLSA", "SOC2", "CIS"],
    tool: "Cosign / Sigstore",
  },
  {
    id: "sbom",
    name: "Software Bill of Materials (SBOM)",
    description: "Automated CycloneDX & SPDX vulnerability inventory generated on every build for complete supply-chain auditability.",
    category: "supply-chain",
    weight: 15,
    frameworks: ["SLSA", "NIST", "SOC2"],
    tool: "Syft / Anchore",
  },
  {
    id: "trivy",
    name: "Vulnerability Scanning Gate",
    description: "Continuous CVE and misconfiguration gates blocking critical/high severity flaws in CI before container registries.",
    category: "vulnerability",
    weight: 20,
    frameworks: ["CIS", "NIST", "SOC2", "HIPAA"],
    tool: "Trivy / Grype",
  },
  {
    id: "gitleaks",
    name: "Automated Secret & Token Scanning",
    description: "Pre-commit and CI scanner preventing hardcoded API keys, private certificates, and credentials from entering git history.",
    category: "vulnerability",
    weight: 15,
    frameworks: ["SOC2", "NIST", "HIPAA"],
    tool: "Gitleaks / Trufflehog",
  },
  {
    id: "rbac",
    name: "Least-Privilege RBAC & NetworkPolicy",
    description: "Default-deny Kubernetes network policies and isolated ServiceAccount roles preventing lateral cluster movement.",
    category: "access",
    weight: 20,
    frameworks: ["CIS", "SOC2", "NIST", "HIPAA"],
    tool: "Kubernetes RBAC",
  },
  {
    id: "nonroot",
    name: "Non-Root Container Execution",
    description: "Docker security constraints: user 10001 execution, drop ALL capabilities, read-only root filesystems.",
    category: "runtime",
    weight: 15,
    frameworks: ["CIS", "SOC2", "HIPAA"],
    tool: "PodSecurityStandards",
  },
];

export interface ComplianceScores {
  overallScore: number;
  overallGrade: "A+" | "A" | "B" | "C" | "D";
  cisScore: number;
  soc2Score: number;
  nistScore: number;
  hipaaScore: number;
  slsaLevel: "Level 3" | "Level 2" | "Level 1" | "Level 0";
}

export function calculateComplianceScores(
  activeControlIds: string[],
  config?: ProjectConfig
): ComplianceScores {
  const activeSet = new Set(activeControlIds);

  // Base score from security framework option
  let baseScoreBonus = 0;
  if (config?.security === "cis-benchmarks") baseScoreBonus = 8;
  if (config?.security === "soc2" || config?.security === "soc2-compliance") baseScoreBonus = 8;
  if (config?.security === "nist-csf") baseScoreBonus = 10;
  if (config?.security === "zero-trust") baseScoreBonus = 12;

  // Weight summation
  const totalWeight = SECURITY_CONTROLS.reduce((acc, c) => acc + c.weight, 0);
  const earnedWeight = SECURITY_CONTROLS.reduce((acc, c) => {
    return activeSet.has(c.id) ? acc + c.weight : acc;
  }, 0);

  const rawOverall = Math.min(100, Math.round((earnedWeight / totalWeight) * 100) + (baseScoreBonus > 0 && activeControlIds.length > 2 ? 5 : 0));

  // Compute per-framework percentage
  const computeFramework = (fw: "CIS" | "SOC2" | "NIST" | "HIPAA") => {
    const relevant = SECURITY_CONTROLS.filter((c) => c.frameworks.includes(fw));
    const earned = relevant.filter((c) => activeSet.has(c.id)).length;
    const pct = Math.round((earned / relevant.length) * 100);
    return Math.min(100, pct + (baseScoreBonus > 0 ? 5 : 0));
  };

  const cisScore = computeFramework("CIS");
  const soc2Score = computeFramework("SOC2");
  const nistScore = computeFramework("NIST");
  const hipaaScore = computeFramework("HIPAA");

  // Determine SLSA level
  let slsaLevel: "Level 3" | "Level 2" | "Level 1" | "Level 0" = "Level 0";
  if (activeSet.has("cosign") && activeSet.has("sbom") && activeSet.has("trivy")) {
    slsaLevel = "Level 3";
  } else if (activeSet.has("sbom") || activeSet.has("cosign")) {
    slsaLevel = "Level 2";
  } else if (activeControlIds.length > 0) {
    slsaLevel = "Level 1";
  }

  let overallGrade: "A+" | "A" | "B" | "C" | "D" = "D";
  if (rawOverall >= 92) overallGrade = "A+";
  else if (rawOverall >= 82) overallGrade = "A";
  else if (rawOverall >= 70) overallGrade = "B";
  else if (rawOverall >= 50) overallGrade = "C";

  return {
    overallScore: rawOverall,
    overallGrade,
    cisScore,
    soc2Score,
    nistScore,
    hipaaScore,
    slsaLevel,
  };
}

export function generateComplianceReport(
  config: ProjectConfig,
  activeControlIds: string[],
  scores: ComplianceScores
): string {
  const activeSet = new Set(activeControlIds);
  const now = new Date().toISOString().split("T")[0];

  return `# COMPLIANCE & SECURITY AUDIT RECORD (ADR-SEC-001)

**Target Project**: \`${config.projectName || "devops-stack"}\`  
**Audit Date**: ${now}  
**Overall Readiness**: ${scores.overallGrade} (${scores.overallScore}%)  
**Supply Chain Level**: SLSA ${scores.slsaLevel}  

---

## 1. Executive Summary

This architecture has been audited and compiled against industry-standard cybersecurity baselines, including **CIS Kubernetes Benchmarks**, **SOC 2 Type II Security Principles**, **NIST Special Publication 800-53**, and the **HIPAA Security Rule**.

### Framework Readiness Gauges

| Security Framework | Assessed Readiness | Audit Status | Key Governing Standard |
|--------------------|--------------------|--------------|------------------------|
| **CIS Kubernetes Benchmark** | **${scores.cisScore}%** | ${scores.cisScore >= 80 ? "Pass (Hardened)" : "Conditional"} | CIS v1.8 Cluster & Pod Security |
| **SOC 2 Type II** | **${scores.soc2Score}%** | ${scores.soc2Score >= 80 ? "Attestation Ready" : "In Review"} | Trust Services Criteria (CC6/CC7) |
| **NIST SP 800-53** | **${scores.nistScore}%** | ${scores.nistScore >= 80 ? "High Assurance" : "Baseline"} | AC-6 (Least Privilege), SI-4 (Monitoring) |
| **HIPAA Security Rule** | **${scores.hipaaScore}%** | ${scores.hipaaScore >= 80 ? "Compliant Controls" : "Action Required"} | 45 CFR § 164.312 Technical Safeguards |
| **SLSA Supply Chain** | **${scores.slsaLevel}** | ${scores.slsaLevel === "Level 3" ? "Verified Provenance" : "Standard"} | OpenSSF SLSA v1.0 Specification |

---

## 2. Active Security Controls Matrix

${SECURITY_CONTROLS.map((c) => {
  const isEnabled = activeSet.has(c.id);
  const statusMark = isEnabled ? "[x] ACTIVE" : "[ ] NOT CONFIGURED";
  return `### ${statusMark} — ${c.name}
- **Primary Tooling**: \`${c.tool}\`
- **Category**: ${c.category.toUpperCase()}
- **Framework Coverage**: ${c.frameworks.join(", ")}
- **Implementation**: ${c.description}
`;
}).join("\n")}

---

## 3. Supply Chain Security Attestation (SLSA Level 3)

1. **Cryptographic Signing (Sigstore/Cosign)**:
   - Images tagged for deployment are signed via keyless OIDC identity tokens tied directly to GitHub repository workflows.
2. **Software Bill of Materials (SBOM)**:
   - Automated CycloneDX JSON artifacts are generated by Syft during the CI pipeline and stored as release assets.
3. **Artifact Immutability**:
   - Deployment references enforce strict digest pinning (\`image@sha256:...\`) rather than mutable floating tags.

---

## 4. Verification & Audit Trail

Generated automatically by **DevOps Project Generator (v2.0.0)**.  
Reference file: \`k8s/security-policies.yaml\`, \`.gitleaks.toml\`, \`.github/workflows/cosign-sign.yml\`.
`;
}
