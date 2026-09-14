# Commands Reference

Complete reference for all DevOps Project Generator commands.

## 📋 Table of Contents

- [Core Commands](#core-commands)
- [Management Commands](#management-commands)
- [New Features (v2.0.0)](#new-features-v200)
- [Utility Commands](#utility-commands)

---

## 🚀 Core Commands

### `init`
Initialize a new DevOps project with specified configuration.

```bash
devops-project-generator init [OPTIONS]
```

**Options:**
- `--name TEXT`: Project name [required]
- `--ci TEXT`: CI/CD platform (github-actions, gitlab-ci, jenkins, none)
- `--infra TEXT`: Infrastructure tool (terraform, cloudformation, none)
- `--deploy TEXT`: Deployment method (vm, docker, kubernetes)
- `--envs TEXT`: Environments (single, dev,stage,prod)
- `--observability TEXT`: Observability level (logs, logs-metrics, full)
- `--security TEXT`: Security level (basic, standard, strict)
- `--devcontainer / --no-devcontainer`: Generate VS Code / Cursor `.devcontainer` sandbox (default: enabled)
- `--git-init / --no-git-init`: Initialize git repository and stage files automatically
- `--gh-repo / --no-gh-repo`: Print or trigger `gh repo create` GitHub scaffolding command

**Examples:**
```bash
# Basic web app with DevContainer sandbox
devops-project-generator init --name my-app --ci github-actions --deploy docker --devcontainer

# Enterprise setup with git initialization
devops-project-generator init \
  --name enterprise-app \
  --ci github-actions \
  --infra terraform \
  --deploy kubernetes \
  --envs dev,stage,prod \
  --observability full \
  --security strict \
  --git-init
```

### `audit`
Audit a DevOps project's security posture and compliance readiness against CIS Kubernetes, SOC 2 Type II, NIST SP 800-53, HIPAA Security Rule, and SLSA Level 3.

```bash
devops-project-generator audit [PROJECT_PATH] [OPTIONS]
```

**Options:**
- `--output / -o PATH`: Save compliance report to markdown file (default: `docs/COMPLIANCE-AUDIT.md`)

**Examples:**
```bash
# Audit project in current directory
devops-project-generator audit

# Audit specific project and export report
devops-project-generator audit ./my-project -o ./my-project/AUDIT.md
```

### `diagram`
Generate Mermaid.js architecture topology or Architecture Decision Record (ADR-001) for the project.

```bash
devops-project-generator diagram [PROJECT_PATH] [OPTIONS]
```

**Options:**
- `--adr`: Output complete Architecture Decision Record (ADR-001) markdown instead of raw Mermaid
- `--output / -o PATH`: Save output directly to file

**Examples:**
```bash
# View Mermaid pipeline & cloud topology
devops-project-generator diagram ./my-project

# View full Architecture Decision Record
devops-project-generator diagram ./my-project --adr
```

### `github`
Scaffold or push project directly to GitHub using GitHub CLI (`gh`).

```bash
devops-project-generator github [PROJECT_PATH] [OPTIONS]
```

**Options:**
- `--name / -n TEXT`: GitHub repository name (defaults to folder name)
- `--private / --public`: Repository visibility (default: private)
- `--push / --no-push`: Directly execute `gh repo create` (default: no-push, prints one-liner)

**Examples:**
```bash
# Print copy-paste GitHub CLI command
devops-project-generator github ./my-project

# Directly create and push to private GitHub repo
devops-project-generator github ./my-project --push
```

### `list-options`
List all available configuration options with descriptions.

```bash
devops-project-generator list-options
```

**Output:**
- CI/CD Platforms
- Infrastructure Tools
- Deployment Methods
- Environment Options
- Observability Levels
- Security Levels

---

## 🛠️ Management Commands

### `config`
Manage project configuration files.

```bash
devops-project-generator config [OPTIONS] ACTION
```

**Actions:**
- `create`: Create new configuration file
- `validate`: Validate existing configuration
- `update`: Update configuration values
- `show`: Display current configuration

**Examples:**
```bash
devops-project-generator config create
devops-project-generator config validate
devops-project-generator config show
```

### `validate`
Validate a DevOps project structure and configuration.

```bash
devops-project-generator validate [PROJECT_PATH]
```

**Options:**
- `--verbose`: Show detailed validation results
- `--fix`: Attempt to auto-fix issues

**Examples:**
```bash
devops-project-generator validate my-project
devops-project-generator validate my-project --verbose --fix
```

### `cleanup`
Clean up a DevOps project and remove generated resources.

```bash
devops-project-generator cleanup [PROJECT_PATH]
```

**Options:**
- `--force`: Skip confirmation prompts
- `--backup`: Create backup before cleanup

**Examples:**
```bash
devops-project-generator cleanup my-project
devops-project-generator cleanup my-project --force --backup
```

### `info`
Show detailed information and statistics about a DevOps project.

```bash
devops-project-generator info [PROJECT_PATH]
```

**Options:**
- `--detailed`: Show detailed project information
- `--json`: Output in JSON format

**Examples:**
```bash
devops-project-generator info my-project
devops-project-generator info my-project --detailed --json
```

---

## 🌟 New Features (v2.0.0)

### `scan` ⭐ NEW
Scan project dependencies and security vulnerabilities.

```bash
devops-project-generator scan [OPTIONS] [PROJECT_PATH]
```

**Options:**
- `--export TEXT`: Export report to file (e.g., report.json, report.yaml)
- `--format TEXT`: Export format: json or yaml [default: json]
- `--detailed`: Show detailed dependency information

**Examples:**
```bash
# Basic scan
devops-project-generator scan my-project

# Detailed scan with export
devops-project-generator scan my-project --detailed --export report.json

# Export as YAML
devops-project-generator scan my-project --export report.yaml --format yaml
```

**Features:**
- Multi-language dependency detection (Python, Node.js, Docker, Kubernetes)
- Security vulnerability analysis
- Version tracking and recommendations
- Comprehensive reporting (JSON/YAML export)

### `multi-env` ⭐ NEW
Generate multi-environment configurations with inheritance.

```bash
devops-project-generator multi-env [OPTIONS] [PROJECT_PATH]
```

**Options:**
- `--envs TEXT`: Comma-separated list of environments [default: dev,stage,prod]
- `--type TEXT`: Configuration type: basic, kubernetes, docker, full [default: full]
- `--with-secrets`: Generate secrets templates

**Examples:**
```bash
# Basic multi-environment setup
devops-project-generator multi-env my-project --envs "dev,stage,prod"

# Full setup with secrets
devops-project-generator multi-env my-project \
  --envs "dev,stage,prod" \
  --type full \
  --with-secrets

# Kubernetes only
devops-project-generator multi-env my-project --envs "dev,prod" --type kubernetes

# Docker only
devops-project-generator multi-env my-project --envs "dev,prod" --type docker
```

**Features:**
- Configuration inheritance system
- Multiple deployment formats (Kubernetes, Docker Compose, .env)
- Secrets management templates
- Deployment automation scripts
- Configuration validation

---

## 🔧 Template Management

### `template`
Manage and customize project templates.

```bash
devops-project-generator template [OPTIONS] ACTION
```

**Actions:**
- `list`: List available templates by category
- `create`: Create new custom template
- `customize`: Customize existing template
- `export`: Export templates to directory

**Options:**
- `--category TEXT`: Filter by template category
- `--name TEXT`: Template name

**Examples:**
```bash
# List all templates
devops-project-generator template list

# List CI templates
devops-project-generator template list --category ci

# Create custom template
devops-project-generator template create --category ci --name my-workflow.yml

# Customize template
devops-project-generator template customize --category ci --name github-actions.yml

# Export templates
devops-project-generator template export --output my-templates/
```

---

## 📊 Configuration Profiles

### `profile`
Manage project configuration profiles.

```bash
devops-project-generator profile [OPTIONS] ACTION
```

**Actions:**
- `save`: Save current configuration as profile
- `load`: Load configuration from profile
- `list`: List saved profiles
- `delete`: Delete saved profile

**Options:**
- `--name TEXT`: Profile name
- `--description TEXT`: Profile description

**Examples:**
```bash
# Save profile
devops-project-generator profile save --name webapp \
  --ci github-actions \
  --deploy docker \
  --observability logs

# List profiles
devops-project-generator profile list

# Load profile
devops-project-generator profile load --name webapp

# Delete profile
devops-project-generator profile delete --name webapp
```

---

## 🏥 Project Health

### `health`
Perform comprehensive health check on DevOps project.

```bash
devops-project-generator health [PROJECT_PATH]
```

**Options:**
- `--detailed`: Show detailed health analysis
- `--fix`: Auto-fix common issues
- `--score-only`: Show only health score

**Examples:**
```bash
devops-project-generator health my-project
devops-project-generator health my-project --detailed --fix
devops-project-generator health my-project --score-only
```

**Health Categories:**
- Project Structure
- Configuration Files
- Security Best Practices
- CI/CD Setup
- Documentation
- Scripts and Automation

---

## 💾 Backup & Restore

### `backup`
Create and restore project backups.

```bash
devops-project-generator backup [OPTIONS] ACTION
```

**Actions:**
- `create`: Create project backup
- `list`: List available backups
- `restore`: Restore from backup

**Options:**
- `--file TEXT`: Backup file path (for restore)
- `--description TEXT`: Backup description

**Examples:**
```bash
# Create backup
devops-project-generator backup create my-project --description "Before major changes"

# List backups
devops-project-generator backup list

# Restore backup
devops-project-generator backup restore my-project --file backup-2024-01-15.tar.gz
```

---

## 🧪 Testing

### `test`
Run integration tests on generated project.

```bash
devops-project-generator test [PROJECT_PATH]
```

**Options:**
- `--verbose`: Show detailed test output
- `--category TEXT`: Test specific category only

**Test Categories:**
- structure: Project structure validation
- config: Configuration file tests
- security: Security best practices
- cicd: CI/CD pipeline tests
- docs: Documentation tests
- scripts: Script validation

**Examples:**
```bash
devops-project-generator test my-project
devops-project-generator test my-project --verbose
devops-project-generator test my-project --category security
```

---

## ℹ️ Utility Commands

### `version`
Show version information.

```bash
devops-project-generator version
```

**Output:**
```
DevOps Project Generator v2.0.0
```

---

## 📚 Additional Resources

- [User Guide](docs/user-guide.md)
- [Developer Guide](docs/developer-guide.md)
- [Template Reference](docs/template-reference.md)
- [Troubleshooting](README.md#troubleshooting)
- [Changelog](CHANGELOG.md)
