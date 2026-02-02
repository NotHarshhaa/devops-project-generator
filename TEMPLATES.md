# Templates Guide

Complete guide to using and customizing project templates.

## 📋 Table of Contents

- [Template Categories](#template-categories)
- [Built-in Templates](#built-in-templates)
- [Creating Custom Templates](#creating-custom-templates)
- [Template Variables](#template-variables)
- [Template Customization](#template-customization)
- [Exporting Templates](#exporting-templates)

---

## 🗂️ Template Categories

Templates are organized into the following categories:

### 🔄 CI/CD Templates
- **GitHub Actions**: Workflow files for GitHub Actions
- **GitLab CI**: Pipeline configurations for GitLab CI/CD
- **Jenkins**: Pipeline files for Jenkins

### 🏗️ Infrastructure Templates
- **Terraform**: Infrastructure as Code templates
- **CloudFormation**: AWS CloudFormation templates

### 🚀 Deployment Templates
- **VM**: Virtual Machine deployment scripts
- **Docker**: Container deployment configurations
- **Kubernetes**: Kubernetes manifests and configurations

### 📊 Monitoring Templates
- **Logs**: Logging configuration templates
- **Metrics**: Metrics collection setup
- **Alerts**: Alerting rule configurations

### 🔒 Security Templates
- **Basic**: Essential security configurations
- **Standard**: Comprehensive security setup
- **Strict**: Enterprise-grade security controls

---

## 📁 Built-in Templates

### CI/CD Templates

#### GitHub Actions
- `github-actions.yml`: Main CI/CD workflow
- `github-actions-docker.yml`: Docker build and push workflow
- `github-actions-k8s.yml`: Kubernetes deployment workflow

#### GitLab CI
- `gitlab-ci.yml`: Basic GitLab CI pipeline
- `gitlab-ci-docker.yml`: Docker pipeline
- `gitlab-ci-k8s.yml`: Kubernetes deployment

#### Jenkins
- `jenkinsfile`: Declarative Jenkins pipeline
- `jenkinsfile-docker`: Docker pipeline
- `jenkinsfile-k8s`: Kubernetes deployment

### Infrastructure Templates

#### Terraform
- `main.tf`: Main Terraform configuration
- `variables.tf`: Input variables
- `outputs.tf`: Output values
- `provider.tf`: Cloud provider configuration

#### CloudFormation
- `template.yaml`: Main CloudFormation template
- `parameters.yaml`: Template parameters
- `mappings.yaml`: Resource mappings

### Deployment Templates

#### Docker
- `Dockerfile`: Container definition
- `docker-compose.yml`: Multi-container setup
- `docker-compose.prod.yml`: Production configuration

#### Kubernetes
- `deployment.yaml`: Application deployment
- `service.yaml`: Service configuration
- `ingress.yaml`: Ingress rules
- `configmap.yaml`: Configuration data
- `secret.yaml`: Secret management

---

## ✏️ Creating Custom Templates

### Template Structure
Templates use Jinja2 templating engine with the following structure:

```jinja2
# Template header
{# Template: Custom CI/CD Pipeline #}
{# Category: ci #}
{# Description: Custom workflow for specific needs #}

# Template content
name: {{ project_name }} CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
        
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        
    - name: Run tests
      run: |
        pytest tests/
        
    - name: Build application
      run: |
        # Build commands here
        echo "Building {{ project_name }}"
```

### Available Variables

#### Project Variables
- `{{ project_name }}`: Project name
- `{{ project_slug }}`: URL-safe project name
- `{{ project_description }}`: Project description
- `{{ author_name }}`: Author name
- `{{ author_email }}`: Author email

#### Configuration Variables
- `{{ ci }}`: CI/CD platform
- `{{ infra }}`: Infrastructure tool
- `{{ deploy }}`: Deployment method
- `{{ envs }}`: Environment list
- `{{ observability }}`: Observability level
- `{{ security }}`: Security level

#### Environment Variables
- `{{ environments }}`: List of environments
- `{{ primary_env }}`: Primary environment
- `{{ env_count }}`: Number of environments

#### Feature Flags
- `{{ has_ci }}`: Boolean for CI/CD enabled
- `{{ has_infra }}`: Boolean for infrastructure enabled
- `{{ has_docker }}`: Boolean for Docker enabled
- `{{ has_kubernetes }}`: Boolean for Kubernetes enabled
- `{{ is_multi_env }}`: Boolean for multi-environment

#### Metadata
- `{{ generated_at }}`: Generation timestamp
- `{{ generator_version }}`: Tool version

### Creating a New Template

1. **List existing templates:**
   ```bash
   devops-project-generator template list --category ci
   ```

2. **Create new template:**
   ```bash
   devops-project-generator template create \
     --category ci \
     --name my-custom-workflow.yml
   ```

3. **Edit the template file** with your custom content

4. **Test the template:**
   ```bash
   devops-project-generator init --name test-project --ci my-custom-workflow
   ```

---

## 🔧 Template Customization

### Customizing Existing Templates

1. **View available templates:**
   ```bash
   devops-project-generator template list
   ```

2. **Customize a template:**
   ```bash
   devops-project-generator template customize \
     --category ci \
     --name github-actions.yml
   ```

3. **Modify the template** according to your needs

4. **Save changes** and test with a new project

### Template Best Practices

#### File Naming
- Use descriptive names: `github-actions-docker.yml`
- Include platform: `gitlab-ci-k8s.yml`
- Use hyphens for separation: `jenkinsfile-prod.yml`

#### Content Structure
```jinja2
{# Template: Descriptive Name #}
{# Category: category-name #}
{# Description: What this template does #}

# Template content here
```

#### Variable Usage
- Always use variables for project-specific values
- Provide default values where appropriate
- Use conditional blocks for optional features

```jinja2
{% if has_docker %}
- name: Build Docker image
  run: docker build -t {{ project_name }}:latest .
{% endif %}

{% if has_kubernetes %}
- name: Deploy to Kubernetes
  run: kubectl apply -f k8s/
{% endif %}
```

---

## 📤 Exporting Templates

### Export All Templates
```bash
devops-project-generator template export --output my-templates/
```

### Export Specific Category
```bash
devops-project-generator template export \
  --category ci \
  --output ci-templates/
```

### Export Single Template
```bash
devops-project-generator template export \
  --category ci \
  --name github-actions.yml \
  --output custom-github.yml
```

### Export Structure
```
my-templates/
├── ci/
│   ├── github-actions.yml
│   ├── gitlab-ci.yml
│   └── jenkinsfile
├── infra/
│   ├── terraform/
│   └── cloudformation/
├── deploy/
│   ├── docker/
│   └── kubernetes/
├── monitoring/
│   ├── logs/
│   ├── metrics/
│   └── alerts/
└── security/
    ├── basic/
    ├── standard/
    └── strict/
```

---

## 🎯 Template Examples

### Example 1: Custom GitHub Actions Workflow

```yaml
{# Template: Custom Multi-Stage CI/CD #}
{# Category: ci #}
{# Description: Multi-stage pipeline with testing, building, and deployment #}

name: {{ project_name }} CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'
  PYTHON_VERSION: '3.11'

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: ${{ env.PYTHON_VERSION }}
        
    - name: Install dependencies
      run: |
        npm ci
        pip install -r requirements.txt
        
    - name: Run tests
      run: |
        npm test
        pytest tests/
        
    - name: Generate coverage report
      run: |
        npm run coverage
        pytest --cov=app tests/

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Build application
      run: |
        npm run build
        python setup.py sdist bdist_wheel
        
    - name: Build Docker image
      if: ${{ has_docker }}
      run: |
        docker build -t {{ project_name }}:${{ github.sha }} .
        docker tag {{ project_name }}:${{ github.sha }} {{ project_name }}:latest
        
    - name: Upload artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-artifacts
        path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
    - name: Deploy to production
      if: ${{ has_kubernetes }}
      run: |
        kubectl set image deployment/{{ project_name }} \
          {{ project_name }}={{ project_name }}:${{ github.sha }}
          
    - name: Deploy to staging
      if: ${{ deploy == 'docker' }}
      run: |
        docker-compose -f docker-compose.prod.yml up -d
```

### Example 2: Custom Terraform Configuration

```hcl
{# Template: Multi-Cloud Infrastructure #}
{# Category: infra #}
{# Description: Terraform configuration for multi-cloud deployment #}

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
  
  backend "s3" {
    bucket = "{{ project_name }}-terraform-state"
    key    = "terraform.tfstate"
    region = "us-west-2"
  }
}

provider "aws" {
  region = var.aws_region
}

provider "azurerm" {
  features {}
}

# Variables
variable "project_name" {
  description = "Project name"
  type        = string
  default     = "{{ project_name }}"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "azure_location" {
  description = "Azure region"
  type        = string
  default     = "East US"
}

# AWS Resources
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name        = "{{ project_name }}-vpc"
    Environment = "{{ primary_env }}"
    Project     = "{{ project_name }}"
  }
}

resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 1}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]
  
  map_public_ip_on_launch = true
  
  tags = {
    Name        = "{{ project_name }}-public-${count.index + 1}"
    Environment = "{{ primary_env }}"
    Project     = "{{ project_name }}"
  }
}

# Azure Resources
resource "azurerm_resource_group" "main" {
  name     = "{{ project_name }}-rg"
  location = var.azure_location
  
  tags = {
    Environment = "{{ primary_env }}"
    Project     = "{{ project_name }}"
  }
}

resource "azurerm_virtual_network" "main" {
  name                = "{{ project_name }}-vnet"
  address_space       = ["10.1.0.0/16"]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  
  tags = {
    Environment = "{{ primary_env }}"
    Project     = "{{ project_name }}"
  }
}

# Outputs
output "aws_vpc_id" {
  description = "AWS VPC ID"
  value       = aws_vpc.main.id
}

output "azure_resource_group_id" {
  description = "Azure Resource Group ID"
  value       = azurerm_resource_group.main.id
}
```

---

## 🔍 Template Validation

### Checking Template Syntax
```bash
# Validate Jinja2 syntax
python -c "
import jinja2
with open('template.yml.j2') as f:
    template = jinja2.Template(f.read())
    print('Template syntax is valid')
"
```

### Testing Template Variables
```bash
# Test template with sample data
devops-project-generator init \
  --name test-template \
  --ci custom-template \
  --deploy docker
```

---

## 📚 Additional Resources

- [Jinja2 Template Documentation](https://jinja.palletsprojects.com/)
- [Terraform Best Practices](https://www.terraform.io/docs/language/index.html)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
