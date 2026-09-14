import { ProjectConfig } from "@/lib/types";

export function generateAdrDocument(config: ProjectConfig): string {
  const dateStr = new Date().toISOString().split("T")[0];
  const envsFormatted = config.envs === "single" ? "Single (Production)" : config.envs.split(",").map(e => e.trim()).join(", ");

  return `# ADR 001: Architectural Blueprint for ${config.projectName}

- **Status**: Accepted
- **Date**: ${dateStr}
- **Architectural Scope**: Cloud Infrastructure, CI/CD, Containerization, Observability, and Security

---

## 1. Context and Problem Statement

Modern software delivery demands high release velocity paired with rigorous reliability, zero-downtime deployments, and regulatory compliance. Manual provisioning or unstructured deployment pipelines introduce drift, human error, and deployment bottlenecks.

The goal of this architectural blueprint is to establish a standardized, deterministic DevOps stack for **${config.projectName}**.

---

## 2. Decision Summary

| Architectural Layer | Selected Technology / Pattern | Rationale |
| :--- | :--- | :--- |
| **Pipeline & Runtime** | \`${config.pipeline}\` | Modern containerized runtime with automated dependency management. |
| **CI Automation** | \`${config.ci}\` | Declarative, version-controlled pipeline triggered on branch commits. |
| **Infrastructure** | \`${config.infra}\` | Modular Infrastructure as Code with repeatable environments. |
| **Deployment Strategy** | \`${config.deploy}\` | Safe progressive delivery ensuring zero downtime during rollouts. |
| **Target Environments** | \`${envsFormatted}\` | Isolated network boundaries with consistent configuration parity. |
| **Observability** | \`${config.observability}\` | End-to-end metrics scraping, log aggregation, and real-time alerts. |
| **Security Governance** | \`${config.security}\` | Proactive vulnerability scanning, image signing, and compliance auditing. |

---

## 3. Layer Specifications

### 3.1 Continuous Integration & Verification (\`${config.ci}\`)
- Automated validation runs on all Pull Requests before merging to \`main\`.
- Steps executed: static linting, unit test execution, dependency vulnerability assessment, and OCI image builds.

### 3.2 Infrastructure as Code (\`${config.infra}\`)
- Declarative state management preventing configuration drift.
- Network topology adheres to least-privilege principles (VPC subnets, private cluster endpoints, and encrypted storage).

### 3.3 Progressive Delivery (\`${config.deploy}\`)
- Eliminates cutover disruption using \`${config.deploy}\`.
- Traffic shifting is validated against health-check probes prior to decommissioning previous replica sets.

### 3.4 Security & Governance (\`${config.security}\`)
- Enforces \`${config.security}\` policy baseline.
- Container images are verified cryptographically before admission to runtime clusters.

### 3.5 Monitoring & Telemetrics (\`${config.observability}\`)
- Real-time telemetry collection for latency, error rates, saturation, and system throughput (Four Golden Signals).

---

## 4. Consequences & Operational Runbook

### Positive Consequences
- **Repeatability**: New team members can spin up ephemeral or local environments within minutes.
- **Auditability**: All architectural changes are recorded in Git history.
- **Resilience**: Automated rollback triggers when health probes detect degradation.

### Operational Responsibilities
1. Configure repository secrets in \`${config.ci}\` for cloud authentication.
2. Initialize backend storage for Terraform remote state before running initial apply.
3. Review observability dashboards post-deployment to verify metrics ingestion.
`;
}
