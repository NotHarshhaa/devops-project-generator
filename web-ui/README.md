# DevOps Project Generator — Web UI Studio

An interactive, editorial web studio for the [DevOps Project Generator](https://github.com/NotHarshhaa/devops-project-generator). Scaffold production-grade DevOps repositories, explore generated manifests before downloading, inspect dependency graphs, optimize cloud costs, and export live architecture diagrams and ADR documentation — all from the browser.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI & Components**: [React 19](https://react.dev/), [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Design System**: Minimalist Monochrome (0px border-radius, high-contrast black/white palette, `Playfair Display`, `Source Serif 4`, and `JetBrains Mono` typography)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Archive & Export**: [JSZip](https://stuk.github.io/jszip/) + [FileSaver](https://github.com/eligrey/FileSaver.js) for client-side bundle generation

---

## 🌟 Workspace Suite & Capabilities

### 1. 🚀 01. Project Generator
- 8-step guided workflow (Project Name, CI/CD, Infrastructure, Deployment, Environments, Observability, Security, DevContainer Sandbox).
- Instant project compilation into a downloadable `.zip` archive.
- Direct **Push to GitHub** integration via browser GitHub API and instant terminal CLI scripts.
- One-click copy for equivalent CLI initialization commands.

### 2. 🔧 02. Advanced Config Builder
- Component dependency graph visualization.
- Real-time compatibility checks and conflict detection.
- Architectural complexity scoring (0–100) with intelligent recommendations.

### 3. 💰 03. Cost Optimization Advisor
- Categorized monthly cloud spend estimation (Infrastructure, Observability, CI/CD, Security).
- Actionable cost-reduction levers saving up to 70% on infrastructure.
- Difficulty and impact ratings for each recommendation.

### 4. 📊 04. Project Analytics Dashboard
- Real-time tracking of generated stacks and popular runtime configurations.
- Technology distribution breakdowns.
- 100% privacy-first: all statistics are persisted locally in browser storage.

### 5. 🗺️ 05. Live Architecture Diagram & ADR Exporter
- **Visual Topology Mode**: Vector SVG canvas mapping CI/CD pipelines, container registries, security gates, cloud platforms, and observability.
- **Mermaid.js Mode**: Copyable `graph TD` flowchart syntax ready for GitHub/GitLab READMEs.
- **Decision Record (ADR) Mode**: Formatted Michael Nygard MADR `ADR-001` documentation with one-click markdown download.
- Zero heavy runtime graph libraries for lightning-fast rendering and zero hydration mismatches.

### 6. 🛡️ 06. Compliance & Security Scorecard
- **Real-Time Governance Gauge**: Assesses stack against CIS Kubernetes Benchmark, SOC 2 Type II, NIST 800-53, HIPAA, and SLSA Level 3.
- **Interactive Security Controls**: Toggle Cosign cryptographic image signing, Syft SBOM generation, Trivy vulnerability gates, Gitleaks secret scanning, and Kubernetes RBAC.
- **Audit Documentation**: One-click download of formal `COMPLIANCE-AUDIT.md`.

### 7. 📦 DevContainer & Local Sandbox Generator
- Pre-configured `.devcontainer/devcontainer.json` and multi-tool `Dockerfile`.
- Injects language runtimes, matching DevOps CLIs (Terraform, Kubectl, Helm, AWS/GCP/Azure, Trivy), and VS Code / Cursor extensions.

### 8. 📄 In-Browser Code & Manifest Explorer
- Interactive split-pane file browser with category filter chips (`All`, `CI/CD`, `Terraform`, `Deploy & K8s`, `Monitoring`, `DevContainer`).
- Syntax-realistic manifest viewer with line-number gutters, one-click copy, and individual file downloads before full project generation.


---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ or later
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/NotHarshhaa/devops-project-generator.git
cd devops-project-generator/web-ui

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to open the studio.

### Production Build

```bash
# Build optimized production bundle
npm run build

# Run production server
npm run start
```

---

## 📁 Project Structure

```
web-ui/
├── src/
│   ├── app/
│   │   ├── api/generate/           # API route for server-side generation
│   │   ├── api/health/             # Health check endpoint
│   │   ├── globals.css             # Monochrome design system & tokens
│   │   ├── layout.tsx              # Root layout & Google font configurations
│   │   └── page.tsx                # Home page view
│   ├── components/
│   │   ├── architecture-diagram/   # Vector SVG topology, Mermaid, & ADR views
│   │   ├── common/                 # Reusable components (CodeViewer, etc.)
│   │   ├── config-builder/         # Graph, conflicts, and complexity tools
│   │   ├── cost-optimizer/         # Cost estimation and savings calculators
│   │   ├── generator/              # 7-step project generator wizard
│   │   ├── landing/                # Editorial sections, header, colophon
│   │   ├── project-analytics/      # Analytics charts and storage hooks
│   │   ├── theme/                  # Theme provider and toggle
│   │   └── ui/                     # shadcn/ui primitives (Button, Card, Tabs, etc.)
│   └── lib/
│       ├── config-context.tsx      # Global project configuration state
│       ├── diagram/                # Mermaid.js & ADR generator logic
│       ├── generator/              # Client-side file generation & previews
│       ├── options.ts              # DevOps option metadata & definitions
│       └── types.ts                # TypeScript interfaces
```

---

## 📄 License

MIT — Part of the [DevOps Project Generator](https://github.com/NotHarshhaa/devops-project-generator) project by [@NotHarshhaa](https://github.com/NotHarshhaa).
