# Usage Examples

Practical examples and workflows for the DevOps Project Generator.

## 📋 Table of Contents

- [Quick Start Examples](#quick-start-examples)
- [Project Types](#project-types)
- [New Features Examples](#new-features-examples)
- [Advanced Workflows](#advanced-workflows)
- [Integration Examples](#integration-examples)

---

## 🚀 Quick Start Examples

### Basic Web Application
Generate a simple web application with basic CI/CD.

```bash
devops-project-generator init \
  --name my-webapp \
  --ci github-actions \
  --deploy docker \
  --envs single \
  --observability logs \
  --security basic
```

**Generated Structure:**
```
my-webapp/
├── app/
├── ci/github-actions.yml
├── containers/Dockerfile
├── docker-compose.yml
├── monitoring/logs/
├── security/
├── scripts/
├── Makefile
└── README.md
```

### Enterprise Application
Full enterprise setup with all features.

```bash
devops-project-generator init \
  --name enterprise-app \
  --ci github-actions \
  --infra terraform \
  --deploy kubernetes \
  --envs dev,stage,prod \
  --observability full \
  --security strict
```

**Generated Structure:**
```
enterprise-app/
├── app/
├── ci/github-actions.yml
├── infra/terraform/
├── k8s/
├── monitoring/
├── security/
├── scripts/
├── Makefile
└── README.md
```

---

## 🏗️ Project Types

### 1. Microservices Application

```bash
# Generate microservice
devops-project-generator init \
  --name user-service \
  --ci gitlab-ci \
  --deploy kubernetes \
  --envs dev,stage,prod \
  --observability logs-metrics \
  --security standard

# Setup multi-environment configs
devops-project-generator multi-env user-service \
  --envs "dev,stage,prod" \
  --type kubernetes \
  --with-secrets
```

**Use Cases:**
- RESTful APIs
- Event-driven services
- Background workers

**Key Features:**
- Kubernetes deployment
- Service mesh ready
- Observability stack
- Security scanning

### 2. Data Processing Pipeline

```bash
devops-project-generator init \
  --name data-pipeline \
  --ci jenkins \
  --infra terraform \
  --deploy kubernetes \
  --envs dev,prod \
  --observability full \
  --security standard
```

**Use Cases:**
- ETL pipelines
- Stream processing
- Batch jobs
- Data analytics

**Key Features:**
- Jenkins pipelines
- Terraform infrastructure
- Full monitoring
- Data security

### 3. Static Website

```bash
devops-project-generator init \
  --name portfolio-site \
  --ci github-actions \
  --deploy docker \
  --envs single \
  --observability logs \
  --security basic
```

**Use Cases:**
- Portfolio sites
- Documentation sites
- Marketing websites
- Landing pages

**Key Features:**
- Simple deployment
- GitHub Pages ready
- Basic monitoring
- Minimal security

### 4. API Gateway Service

```bash
devops-project-generator init \
  --name api-gateway \
  --ci github-actions \
  --infra terraform \
  --deploy kubernetes \
  --envs dev,stage,prod \
  --observability full \
  --security strict
```

**Use Cases:**
- API gateways
- Load balancers
- Service proxies
- Edge services

**Key Features:**
- High availability
- Rate limiting
- Security policies
- Full observability

---

## 🌟 New Features Examples (v1.5.0)

### 🔍 Dependency Scanner Examples

#### Basic Security Scan
```bash
# Scan current directory
devops-project-generator scan

# Scan specific project
devops-project-generator scan my-project

# Detailed scan with recommendations
devops-project-generator scan my-project --detailed
```

**Output Example:**
```
🔍 Scanning dependencies for: my-project

📊 Scan Results:
┏━━━━━━━━━━━━━━━━━━━━┳━━━━━━━┓
┃ Metric             ┃ Count ┃
┡━━━━━━━━━━━━━━━━━━━━╇━━━━━━━┩
│ Total Dependencies │ 24    │
│ Outdated Packages  │ 3     │
│ Security Issues    │ 2     │
└────────────────────┴───────┘

💡 Recommendations:
  1. Update 3 outdated packages to latest versions
  2. Address 2 security issues in dependencies
  3. Pin versions for 5 packages to ensure reproducible builds
```

#### Export Security Report
```bash
# Export JSON report
devops-project-generator scan my-project \
  --export security-report.json \
  --format json

# Export YAML report
devops-project-generator scan my-project \
  --export security-report.yaml \
  --format yaml
```

**Report Structure:**
```json
{
  "scan_time": "2024-01-30T13:18:15.761Z",
  "total_dependencies": 24,
  "outdated_packages": 3,
  "security_issues": 2,
  "dependencies": [
    {
      "name": "flask",
      "version": "2.0.1",
      "source_file": "requirements.txt:1",
      "dependency_type": "pip",
      "outdated": false,
      "security_issues": []
    }
  ],
  "recommendations": [
    "Update 3 outdated packages to latest versions",
    "Address 2 security issues in dependencies"
  ]
}
```

#### CI/CD Integration
```bash
# Add to GitHub Actions workflow
- name: Security Scan
  run: |
    pip install devops-project-generator
    devops-project-generator scan . --export security-report.json
    # Upload security report as artifact
```

### 🌍 Multi-Environment Configuration Examples

#### Basic Multi-Environment Setup
```bash
devops-project-generator init \
  --name my-app \
  --ci github-actions \
  --deploy kubernetes \
  --envs dev,stage,prod \
  --observability logs-metrics \
  --security standard

# Generate multi-environment configs
devops-project-generator multi-env my-app \
  --envs "dev,stage,prod" \
  --type basic
```

**Generated Structure:**
```
my-app/
├── config/
│   ├── base-application.yaml
│   ├── .env.dev
│   ├── .env.stage
│   ├── .env.prod
│   └── secrets/
├── scripts/
│   └── deploy.sh
└── k8s/
```

#### Full Kubernetes Setup with Secrets
```bash
devops-project-generator multi-env my-app \
  --envs "dev,stage,prod" \
  --type kubernetes \
  --with-secrets
```

**Generated Kubernetes Structure:**
```
my-app/k8s/
├── base/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── configmap.yaml
└── overlays/
    ├── dev/
    │   ├── kustomization.yaml
    │   ├── configmap.yaml
    │   └── secrets.yaml
    ├── stage/
    │   ├── kustomization.yaml
    │   ├── configmap.yaml
    │   └── secrets.yaml
    └── prod/
        ├── kustomization.yaml
        ├── configmap.yaml
        └── secrets.yaml
```

#### Docker Compose Multi-Environment
```bash
devops-project-generator multi-env my-app \
  --envs "dev,stage,prod" \
  --type docker \
  --with-secrets
```

**Generated Docker Structure:**
```
my-app/docker/
├── docker-compose.yml
├── docker-compose.dev.yml
├── docker-compose.stage.yml
└── docker-compose.prod.yml
```

#### Environment-Specific Deployment
```bash
# Deploy to development
cd my-app
./scripts/deploy.sh dev

# Deploy to staging
./scripts/deploy.sh stage

# Deploy to production
./scripts/deploy.sh prod

# Or use kubectl directly
kubectl apply -k k8s/overlays/dev
kubectl apply -k k8s/overlays/stage
kubectl apply -k k8s/overlays/prod
```

#### Configuration Inheritance Example
```yaml
# config/base-application.yaml
app:
  name: my-app
  version: 1.0.0
  debug: false
database:
  host: localhost
  port: 5432
  pool_size: 10
logging:
  level: INFO
  format: json
```

```yaml
# config/dev/dev.yaml (inherits from base)
app:
  debug: true
database:
  host: localhost
  name: dev_db
logging:
  level: DEBUG
```

```yaml
# config/prod/prod.yaml (inherits from base)
app:
  debug: false
database:
  host: prod-db.example.com
  name: prod_db
logging:
  level: WARN
```

---

## 🔧 Advanced Workflows

### 1. Complete CI/CD Pipeline with Security

```bash
# Step 1: Generate project
devops-project-generator init \
  --name secure-api \
  --ci github-actions \
  --infra terraform \
  --deploy kubernetes \
  --envs dev,stage,prod \
  --observability full \
  --security strict

# Step 2: Setup multi-environment configs
devops-project-generator multi-env secure-api \
  --envs "dev,stage,prod" \
  --type full \
  --with-secrets

# Step 3: Scan for security issues
devops-project-generator scan secure-api \
  --detailed \
  --export security-report.json

# Step 4: Validate project
devops-project-generator validate secure-api --verbose

# Step 5: Run integration tests
devops-project-generator test secure-api --verbose
```

### 2. Template Customization Workflow

```bash
# Step 1: List existing templates
devops-project-generator template list --category ci

# Step 2: Create custom template
devops-project-generator template create \
  --category ci \
  --name custom-enterprise.yml

# Step 3: Customize template
devops-project-generator template customize \
  --category ci \
  --name github-actions.yml

# Step 4: Export templates for backup
devops-project-generator template export --output my-templates/

# Step 5: Test with custom template
devops-project-generator init \
  --name test-custom \
  --ci custom-enterprise
```

### 3. Profile-Based Development

```bash
# Step 1: Save common configuration as profile
devops-project-generator profile save --name webapp-profile \
  --ci github-actions \
  --deploy docker \
  --observability logs-metrics \
  --security standard

# Step 2: List saved profiles
devops-project-generator profile list

# Step 3: Create new project from profile
devops-project-generator profile load --name webapp-profile

# Step 4: Customize for specific project
devops-project-generator init \
  --name specific-webapp \
  --ci github-actions \
  --deploy docker \
  --envs dev,prod \
  --observability full \
  --security strict
```

### 4. Backup and Recovery Workflow

```bash
# Step 1: Create backup before major changes
devops-project-generator backup create my-project \
  --description "Before v2.0 migration"

# Step 2: Make changes to project
# ... make modifications ...

# Step 3: Test changes
devops-project-generator validate my-project
devops-project-generator test my-project

# Step 4: If needed, restore from backup
devops-project-generator backup restore my-project \
  --file backup-2024-01-30.tar.gz
```

---

## 🔗 Integration Examples

### 1. GitHub Actions Integration

#### Security Scan in CI/CD
```yaml
# .github/workflows/security.yml
name: Security Scan

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
        
    - name: Install DevOps Generator
      run: pip install devops-project-generator
      
    - name: Scan Dependencies
      run: |
        devops-project-generator scan . \
          --export security-report.json \
          --format json
          
    - name: Upload Security Report
      uses: actions/upload-artifact@v3
      with:
        name: security-report
        path: security-report.json
```

#### Multi-Environment Deployment
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  workflow_run:
    workflows: ["CI"]
    types:
      - completed

jobs:
  deploy-dev:
    runs-on: ubuntu-latest
    if: ${{ github.ref == 'refs/heads/develop' }}
    steps:
    - uses: actions/checkout@v3
    - name: Deploy to Development
      run: |
        ./scripts/deploy.sh dev
        
  deploy-prod:
    runs-on: ubuntu-latest
    if: ${{ github.ref == 'refs/heads/main' }}
    steps:
    - uses: actions/checkout@v3
    - name: Deploy to Production
      run: |
        ./scripts/deploy.sh prod
```

### 2. GitLab CI Integration

```yaml
# .gitlab-ci.yml
stages:
  - validate
  - test
  - security
  - deploy

variables:
  PROJECT_NAME: "my-app"

validate:
  stage: validate
  script:
    - pip install devops-project-generator
    - devops-project-generator validate . --verbose

test:
  stage: test
  script:
    - pip install devops-project-generator
    - devops-project-generator test . --verbose

security:
  stage: security
  script:
    - pip install devops-project-generator
    - devops-project-generator scan . --export security-report.json
  artifacts:
    reports:
      junit: security-report.json

deploy-dev:
  stage: deploy
  script:
    - ./scripts/deploy.sh dev
  only:
    - develop

deploy-prod:
  stage: deploy
  script:
    - ./scripts/deploy.sh prod
  only:
    - main
  when: manual
```

### 3. Jenkins Pipeline Integration

```groovy
// Jenkinsfile
pipeline {
    agent any
    
    environment {
        PROJECT_NAME = 'my-app'
    }
    
    stages {
        stage('Validate') {
            steps {
                sh 'pip install devops-project-generator'
                sh 'devops-project-generator validate . --verbose'
            }
        }
        
        stage('Test') {
            steps {
                sh 'devops-project-generator test . --verbose'
            }
        }
        
        stage('Security Scan') {
            steps {
                sh 'devops-project-generator scan . --export security-report.json'
                archiveArtifacts artifacts: 'security-report.json'
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh './scripts/deploy.sh prod'
            }
        }
    }
}
```

---

## 📊 Monitoring and Observability Examples

### 1. Full Observability Stack

```bash
# Generate project with full observability
devops-project-generator init \
  --name observable-app \
  --ci github-actions \
  --deploy kubernetes \
  --envs dev,prod \
  --observability full \
  --security standard

# Setup multi-environment monitoring
devops-project-generator multi-env observable-app \
  --envs "dev,prod" \
  --type kubernetes \
  --with-secrets
```

**Generated Monitoring Stack:**
- **Logs**: Fluentd + Elasticsearch + Kibana
- **Metrics**: Prometheus + Grafana
- **Alerts**: AlertManager + custom rules
- **Tracing**: Jaeger integration

### 2. Custom Monitoring Configuration

```yaml
# monitoring/prometheus/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: '{{ project_name }}'
    static_configs:
      - targets: ['{{ project_name }}:8080']
    metrics_path: /metrics
    scrape_interval: 5s

rule_files:
  - "alert_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
```

```yaml
# monitoring/grafana/dashboards/{{ project_name }}.json
{
  "dashboard": {
    "title": "{{ project_name }} Dashboard",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{ project_name }}"
          }
        ]
      }
    ]
  }
}
```

---

## 🛡️ Security Examples

### 1. Strict Security Setup

```bash
devops-project-generator init \
  --name secure-app \
  --ci github-actions \
  --infra terraform \
  --deploy kubernetes \
  --envs dev,stage,prod \
  --observability full \
  --security strict
```

**Security Features:**
- Network policies
- Pod security policies
- RBAC configuration
- Secrets management
- Security scanning
- Compliance checks

### 2. Security Scanning Workflow

```bash
# Regular security scanning
devops-project-generator scan . --detailed --export security-report.json

# Check for specific vulnerabilities
devops-project-generator scan . --export vulns.json --format json

# Integrate with CI/CD
echo "Security scan completed"
cat security-report.json | jq '.security_issues'
```

---

## 📚 Additional Resources

- [Commands Reference](COMMANDS.md)
- [Templates Guide](TEMPLATES.md)
- [User Guide](docs/user-guide.md)
- [Developer Guide](docs/developer-guide.md)
- [Troubleshooting](README.md#troubleshooting)
