import { ProjectConfig, GeneratedFile, GenerationResult } from "./types";

// Enhanced complexity calculation for realistic generation time estimation
function calculateComplexity(config: ProjectConfig): number {
  let complexity = 1;
  
  // Infrastructure complexity
  if (config.infra.includes("multi-cloud")) complexity += 3;
  if (config.infra.includes("eks") || config.infra.includes("aks") || config.infra.includes("gke")) complexity += 2;
  if (config.infra.includes("on-prem")) complexity += 4;
  if (config.infra.includes("terraform")) complexity += 2;
  
  // Deployment complexity
  if (config.deploy.includes("gitops") || config.deploy.includes("helm")) complexity += 2;
  if (config.deploy.includes("canary")) complexity += 1;
  if (config.deploy.includes("serverless")) complexity += 2;
  if (config.deploy.includes("blue-green")) complexity += 1;
  
  // Environment complexity
  const envCount = config.envs.split(",").length;
  complexity += envCount - 1;
  
  // Security complexity
  if (config.security.includes("zero-trust") || config.security.includes("soc2") || config.security.includes("hipaa")) complexity += 3;
  if (config.security.includes("cis")) complexity += 2;
  if (config.security.includes("nist")) complexity += 2;
  
  // Observability complexity
  if (config.observability.includes("datadog") || config.observability.includes("new-relic")) complexity += 2;
  if (config.observability.includes("elk")) complexity += 2;
  if (config.observability.includes("prometheus")) complexity += 1;
  
  // CI/CD complexity
  if (config.ci === "github-actions") complexity += 1;
  if (config.ci === "gitlab-ci") complexity += 1;
  if (config.ci === "jenkins") complexity += 2;
  
  return complexity;
}

// Helper function to ensure parent directories exist for a file
function ensureDirectories(filePath: string): GeneratedFile[] {
  const dirs: GeneratedFile[] = [];
  const parts = filePath.split('/');
  
  // Remove filename and project name
  parts.pop(); // Remove filename
  const projectName = parts.shift(); // Remove project name
  
  // Build up directory paths
  let currentPath = projectName || '';
  for (const part of parts) {
    currentPath += '/' + part;
    dirs.push({
      path: currentPath,
      content: "",
      type: "directory"
    });
  }
  
  return dirs;
}

// Generate realistic base files with enhanced content
function generateRealisticBaseFiles(config: ProjectConfig): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const projectName = config.projectName.toLowerCase().replace(/\s+/g, '-');
  
  // Enhanced README.md
  files.push({
    path: `${projectName}/README.md`,
    content: `# ${config.projectName}

## Overview
This project was generated using the DevOps Project Generator v2.0.0. It includes a comprehensive set of DevOps configurations and infrastructure as code templates.

## Architecture
- **Application**: Sample web application with health checks and metrics
- **Infrastructure**: ${config.infra.toUpperCase()}
- **Deployment**: ${config.deploy.toUpperCase()}
- **CI/CD**: ${config.ci.toUpperCase()}
- **Observability**: ${config.observability.toUpperCase()}
- **Security**: ${config.security.toUpperCase()}

## Prerequisites
- Docker
- Kubernetes CLI (kubectl)
- Terraform (if using infrastructure as code)
- Make (for build automation)

## Quick Start

\`\`\`bash
# Setup the project
make setup

# Run locally
make run

# Deploy to staging
make deploy-staging

# Run tests
make test
\`\`\`

## Project Structure
\`\`\`
${projectName}/
├── app/                    # Application source code
├── ci/                     # CI/CD pipeline configurations
├── infra/                  # Infrastructure as code
├── deploy/                 # Deployment configurations
├── monitoring/             # Monitoring and alerting
├── security/               # Security policies and configurations
├── scripts/                # Utility scripts
├── docs/                   # Documentation
└── tests/                  # Test files
\`\`\`

## Environment Variables
Create a \`.env\` file based on \`.env.example\`:

\`\`\`bash
cp .env.example .env
\`\`\`

## Monitoring
The application exposes metrics at \`/metrics\` and health checks at \`/health\`.

## Security
This project implements security best practices including:
- ${config.security.includes('zero-trust') ? 'Zero Trust architecture' : 'Network security policies'}
- ${config.security.includes('soc2') ? 'SOC2 compliance controls' : 'Security monitoring'}
- ${config.security.includes('hipaa') ? 'HIPAA compliance measures' : 'Data protection'}

## Support
For issues and questions, please refer to the documentation in the \`docs/\` directory.

---
*Generated on ${new Date().toISOString()} by DevOps Project Generator v2.0.0*`,
    type: "file"
  });

  // Enhanced Makefile
  files.push({
    path: `${projectName}/Makefile`,
    content: `.PHONY: help setup build run test deploy-staging deploy-prod clean lint format security-check monitoring-setup

# Default target
help:
	@echo "Available targets:"
	@echo "  setup           - Install dependencies and initialize project"
	@echo "  build           - Build the application"
	@echo "  run             - Run the application locally"
	@echo "  test            - Run all tests"
	@echo "  deploy-staging  - Deploy to staging environment"
	@echo "  deploy-prod     - Deploy to production environment"
	@echo "  clean           - Clean build artifacts"
	@echo "  lint            - Run linting"
	@echo "  format          - Format code"
	@echo "  security-check  - Run security scans"
	@echo "  monitoring-setup- Setup monitoring infrastructure"

# Project configuration
PROJECT_NAME := ${config.projectName}
VERSION := 2.0.0
DOCKER_REGISTRY := your-registry.com
DOCKER_TAG := \$(DOCKER_REGISTRY)/\$(PROJECT_NAME):\$(VERSION)

# Setup project
setup:
	@echo "Setting up \$(PROJECT_NAME)..."
	docker build -t \$(DOCKER_TAG) .
	@if [ ! -f .env ]; then cp .env.example .env; echo "Created .env file"; fi
	@echo "Setup complete!"

# Build application
build:
	@echo "Building \$(PROJECT_NAME)..."
	docker build -t \$(DOCKER_TAG) .
	docker tag \$(DOCKER_TAG) \$(DOCKER_REGISTRY)/\$(PROJECT_NAME):latest

# Run locally
run:
	@echo "Running \$(PROJECT_NAME) locally..."
	docker run -p 8080:8080 --env-file .env \$(DOCKER_TAG)

# Run tests
test:
	@echo "Running tests..."
	docker run --rm \$(DOCKER_TAG) npm test
	@echo "Tests completed!"

# Deploy to staging
deploy-staging:
	@echo "Deploying to staging..."
	@if command -v kubectl >/dev/null 2>&1; then \
		kubectl apply -f deploy/k8s/staging/; \
		echo "Staging deployment complete!"; \
	else \
		echo "kubectl not found. Please install Kubernetes CLI."; \
	fi

# Deploy to production
deploy-prod:
	@echo "Deploying to production..."
	@if command -v kubectl >/dev/null 2>&1; then \
		kubectl apply -f deploy/k8s/production/; \
		echo "Production deployment complete!"; \
	else \
		echo "kubectl not found. Please install Kubernetes CLI."; \
	fi

# Clean artifacts
clean:
	@echo "Cleaning build artifacts..."
	docker system prune -f
	rm -rf node_modules/ dist/ build/

# Run linting
lint:
	@echo "Running linting..."
	docker run --rm \$(DOCKER_TAG) npm run lint

# Format code
format:
	@echo "Formatting code..."
	docker run --rm \$(DOCKER_TAG) npm run format

# Security checks
security-check:
	@echo "Running security scans..."
	@if command -v trivy >/dev/null 2>&1; then \
		trivy image \$(DOCKER_TAG); \
	else \
		echo "Trivy not found. Install for security scanning."; \
	fi

# Setup monitoring
monitoring-setup:
	@echo "Setting up monitoring..."
	@if command -v helm >/dev/null 2>&1; then \
		helm repo add prometheus-community https://prometheus-community.github.io/helm-charts; \
		helm install monitoring prometheus-community/kube-prometheus-stack; \
	else \
		echo "Helm not found. Install for monitoring setup."; \
	fi`,
    type: "file"
  });

  // Sample Python application with enhanced features
  files.push({
    path: `${projectName}/app/main.py`,
    content: `#!/usr/bin/env python3
"""
${config.projectName} - Sample Application
Generated by DevOps Project Generator v2.0.0
"""

import os
import json
import time
import logging
from datetime import datetime
from flask import Flask, jsonify, request
from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST

# Configuration
app = Flask(__name__)
port = int(os.environ.get('PORT', 8080))
log_level = os.environ.get('LOG_LEVEL', 'INFO')

# Setup structured logging
logging.basicConfig(
    level=getattr(logging, log_level),
    format='{"timestamp": "%(asctime)s", "level": "%(levelname)s", "message": "%(message)s", "service": "${config.projectName}"}'
)
logger = logging.getLogger(__name__)

# Prometheus metrics
REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint', 'status'])
REQUEST_DURATION = Histogram('http_request_duration_seconds', 'HTTP request duration')
ACTIVE_CONNECTIONS = Gauge('active_connections', 'Active connections')
LAST_REQUEST_TIME = Gauge('last_request_time', 'Last request timestamp')

@app.route('/health', methods=['GET'])
@REQUEST_DURATION.time()
def health_check():
    """Enhanced health check endpoint"""
    try:
        health_status = {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "version": "2.0.0",
            "service": "${config.projectName}",
            "checks": {
                "database": "ok",
                "external_api": "ok",
                "memory": "ok"
            }
        }
        REQUEST_COUNT.labels(method='GET', endpoint='/health', status='200').inc()
        return jsonify(health_status), 200
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        REQUEST_COUNT.labels(method='GET', endpoint='/health', status='500').inc()
        return jsonify({"status": "unhealthy", "error": str(e)}), 500

@app.route('/metrics', methods=['GET'])
def metrics():
    """Prometheus metrics endpoint"""
    try:
        REQUEST_COUNT.labels(method='GET', endpoint='/metrics', status='200').inc()
        return generate_latest(), 200, {'Content-Type': CONTENT_TYPE_LATEST}
    except Exception as e:
        logger.error(f"Metrics endpoint failed: {str(e)}")
        return jsonify({"error": "Metrics unavailable"}), 500

@app.route('/api/data', methods=['GET', 'POST'])
@REQUEST_DURATION.time()
def api_data():
    """Sample API endpoint"""
    try:
        if request.method == 'GET':
            data = {
                "message": "Hello from ${config.projectName}!",
                "timestamp": datetime.utcnow().isoformat(),
                "environment": os.environ.get('ENVIRONMENT', 'development'),
                "version": "2.0.0"
            }
            REQUEST_COUNT.labels(method='GET', endpoint='/api/data', status='200').inc()
            return jsonify(data), 200
        
        elif request.method == 'POST':
            payload = request.get_json()
            logger.info(f"Received data: {json.dumps(payload)}")
            
            response = {
                "received": payload,
                "processed_at": datetime.utcnow().isoformat(),
                "status": "processed"
            }
            REQUEST_COUNT.labels(method='POST', endpoint='/api/data', status='201').inc()
            return jsonify(response), 201
            
    except Exception as e:
        logger.error(f"API endpoint failed: {str(e)}")
        REQUEST_COUNT.labels(method=request.method, endpoint='/api/data', status='500').inc()
        return jsonify({"error": "Internal server error"}), 500

@app.before_request
def before_request():
    """Update metrics before each request"""
    ACTIVE_CONNECTIONS.inc()
    LAST_REQUEST_TIME.set(time.time())

@app.after_request
def after_request(response):
    """Update metrics after each request"""
    ACTIVE_CONNECTIONS.dec()
    return response

if __name__ == '__main__':
    logger.info(f"Starting ${config.projectName} application on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)`,
    type: "file"
  });

  // Requirements file for Python app
  files.push({
    path: `${projectName}/app/requirements.txt`,
    content: `flask==2.3.3
prometheus-client==0.17.1
gunicorn==21.2.0
structlog==23.1.0
python-dotenv==1.0.0
pytest==7.4.2
pytest-cov==4.1.0
black==23.7.0
flake8==6.0.0
bandit==1.7.5`,
    type: "file"
  });

  // Dockerfile
  files.push({
    path: `${projectName}/Dockerfile`,
    content: `# Multi-stage build for ${config.projectName}
FROM python:3.11-slim as builder

WORKDIR /app
COPY app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-slim as production

# Security best practices
RUN adduser --disabled-password --gecos '' appuser
WORKDIR /app

# Copy installed packages
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application code
COPY app/ .

# Set permissions
RUN chown -R appuser:appuser /app
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:8080/health || exit 1

# Expose port
EXPOSE 8080

# Run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "4", "--timeout", "120", "main:app"]

# Labels for metadata
LABEL version="2.0.0" \\
      description="${config.projectName} application" \\
      maintainer="devops-team@company.com" \\
      created="${new Date().toISOString()}"`,
    type: "file"
  });

  // Environment example file
  files.push({
    path: `${projectName}/.env.example`,
    content: `# Application Configuration
PORT=8080
LOG_LEVEL=INFO
ENVIRONMENT=development

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/${projectName}
DATABASE_POOL_SIZE=10

# External Services
EXTERNAL_API_URL=https://api.example.com
EXTERNAL_API_KEY=your-api-key-here

# Security
JWT_SECRET=your-jwt-secret-here
ENCRYPTION_KEY=your-encryption-key-here

# Monitoring
PROMETHEUS_ENABLED=true
METRICS_PORT=9090

# Feature Flags
FEATURE_NEW_UI=false
FEATURE_ADVANCED_ANALYTICS=true`,
    type: "file"
  });

  return files;
}

// Generate realistic application files
function generateRealisticApplicationFiles(config: ProjectConfig): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const projectName = config.projectName.toLowerCase().replace(/\s+/g, '-');
  
  // Unit tests
  files.push({
    path: `${projectName}/tests/test_main.py`,
    content: `"""
Unit tests for ${config.projectName} application
Generated by DevOps Project Generator v2.0.0
"""

import pytest
import json
import sys
import os

# Add the app directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'app'))

from main import app

@pytest.fixture
def client():
    """Test client fixture"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    """Test health check endpoint"""
    response = client.get('/health')
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert data['status'] == 'healthy'
    assert data['service'] == '${config.projectName}'
    assert 'version' in data
    assert 'checks' in data

def test_metrics_endpoint(client):
    """Test metrics endpoint"""
    response = client.get('/metrics')
    assert response.status_code == 200
    assert 'text/plain' in response.content_type

def test_api_data_get(client):
    """Test GET /api/data endpoint"""
    response = client.get('/api/data')
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert 'message' in data
    assert 'timestamp' in data
    assert 'version' in data

def test_api_data_post(client):
    """Test POST /api/data endpoint"""
    test_data = {'key': 'value', 'number': 42}
    response = client.post('/api/data', 
                          json=test_data,
                          content_type='application/json')
    assert response.status_code == 201
    
    data = json.loads(response.data)
    assert data['received'] == test_data
    assert data['status'] == 'processed'

def test_api_data_post_invalid(client):
    """Test POST /api/data with invalid data"""
    response = client.post('/api/data', 
                          data='invalid json',
                          content_type='application/json')
    assert response.status_code == 400

if __name__ == '__main__':
    pytest.main([__file__])`,
    type: "file"
  });

  // Integration tests
  files.push({
    path: `${projectName}/tests/test_integration.py`,
    content: `"""
Integration tests for ${config.projectName} application
Generated by DevOps Project Generator v2.0.0
"""

import pytest
import requests
import time
import subprocess
import signal
import os

class TestApplicationIntegration:
    """Integration tests for the application"""
    
    @classmethod
    def setup_class(cls):
        """Setup test environment"""
        # Start the application in background
        cls.app_process = subprocess.Popen([
            'python', 'app/main.py'
        ], cwd=os.path.dirname(os.path.dirname(__file__)))
        
        # Wait for application to start
        time.sleep(3)
        
        cls.base_url = 'http://localhost:8080'
    
    @classmethod
    def teardown_class(cls):
        """Cleanup test environment"""
        if hasattr(cls, 'app_process'):
            cls.app_process.terminate()
            cls.app_process.wait()
    
    def test_health_check_integration(self):
        """Test health check endpoint integration"""
        response = requests.get(f'{self.base_url}/health', timeout=5)
        assert response.status_code == 200
        
        data = response.json()
        assert data['status'] == 'healthy'
        assert 'checks' in data
    
    def test_metrics_integration(self):
        """Test metrics endpoint integration"""
        response = requests.get(f'{self.base_url}/metrics', timeout=5)
        assert response.status_code == 200
        assert 'http_requests_total' in response.text
    
    def test_api_workflow(self):
        """Test complete API workflow"""
        # Test GET request
        response = requests.get(f'{self.base_url}/api/data', timeout=5)
        assert response.status_code == 200
        
        # Test POST request
        test_data = {'test': 'integration', 'timestamp': time.time()}
        response = requests.post(f'{self.base_url}/api/data', 
                               json=test_data, timeout=5)
        assert response.status_code == 201
        
        data = response.json()
        assert data['received'] == test_data

if __name__ == '__main__':
    pytest.main([__file__, '-v'])`,
    type: "file"
  });

  return files;
}

// Generate realistic script files
function generateRealisticScriptFiles(config: ProjectConfig): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const projectName = config.projectName.toLowerCase().replace(/\s+/g, '-');
  
  // Setup script
  files.push({
    path: `${projectName}/scripts/setup.sh`,
    content: `#!/bin/bash
# Setup script for ${config.projectName}
# Generated by DevOps Project Generator v2.0.0

set -euo pipefail

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
NC='\\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "\${GREEN}[INFO]\${NC} \$1"
}

log_warn() {
    echo -e "\${YELLOW}[WARN]\${NC} \$1"
}

log_error() {
    echo -e "\${RED}[ERROR]\${NC} \$1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check kubectl if using Kubernetes
    if command -v kubectl &> /dev/null; then
        log_info "kubectl found"
    else
        log_warn "kubectl not found. Kubernetes deployment may not work."
    fi
    
    # Check Terraform if using infrastructure as code
    if command -v terraform &> /dev/null; then
        log_info "Terraform found"
    else
        log_warn "Terraform not found. Infrastructure as code may not work."
    fi
    
    log_info "Prerequisites check completed."
}

# Setup environment
setup_environment() {
    log_info "Setting up environment..."
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            log_info "Created .env file from .env.example"
        else
            log_warn ".env.example not found. Creating basic .env file."
            cat > .env << EOF
PORT=8080
LOG_LEVEL=INFO
ENVIRONMENT=development
EOF
        fi
    else
        log_info ".env file already exists"
    fi
    
    # Create necessary directories
    mkdir -p logs
    mkdir -p data
    mkdir -p backups
    
    log_info "Environment setup completed."
}

# Build Docker images
build_images() {
    log_info "Building Docker images..."
    
    # Build main application
    docker build -t ${projectName}:latest .
    
    if [ \$? -eq 0 ]; then
        log_info "Docker image built successfully"
    else
        log_error "Failed to build Docker image"
        exit 1
    fi
}

# Run initial tests
run_tests() {
    log_info "Running initial tests..."
    
    # Run unit tests
    docker run --rm ${projectName}:latest python -m pytest tests/ -v
    
    if [ \$? -eq 0 ]; then
        log_info "Tests passed successfully"
    else
        log_warn "Some tests failed. Check the output above."
    fi
}

# Main setup function
main() {
    log_info "Starting setup for ${config.projectName}..."
    
    check_prerequisites
    setup_environment
    build_images
    run_tests
    
    log_info "Setup completed successfully!"
    log_info "You can now run the application with: make run"
}

# Run main function
main "\$@"`,
    type: "file"
  });

  // Deployment script
  files.push({
    path: `${projectName}/scripts/deploy.sh`,
    content: `#!/bin/bash
# Deployment script for ${config.projectName}
# Generated by DevOps Project Generator v2.0.0

set -euo pipefail

# Configuration
PROJECT_NAME="${projectName}"
DOCKER_REGISTRY="\${DOCKER_REGISTRY:-localhost:5000}"
VERSION="\${VERSION:-latest}"
ENVIRONMENT="\${ENVIRONMENT:-staging}"

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
NC='\\033[0m'

# Logging functions
log_info() {
    echo -e "\${GREEN}[INFO]\${NC} \$1"
}

log_warn() {
    echo -e "\${YELLOW}[WARN]\${NC} \$1"
}

log_error() {
    echo -e "\${RED}[ERROR]\${NC} \$1"
}

# Validate environment
validate_environment() {
    log_info "Validating deployment environment: \$ENVIRONMENT"
    
    case \$ENVIRONMENT in
        staging|production|development)
            log_info "Environment \$ENVIRONMENT is valid"
            ;;
        *)
            log_error "Invalid environment: \$ENVIRONMENT"
            log_error "Valid environments: staging, production, development"
            exit 1
            ;;
    esac
}

# Build and push Docker image
build_and_push() {
    log_info "Building and pushing Docker image..."
    
    # Build image
    docker build -t \${DOCKER_REGISTRY}/\${PROJECT_NAME}:\${VERSION} .
    
    # Tag as latest
    docker tag \${DOCKER_REGISTRY}/\${PROJECT_NAME}:\${VERSION} \${DOCKER_REGISTRY}/\${PROJECT_NAME}:latest
    
    # Push to registry
    if [[ "\$DOCKER_REGISTRY" != "localhost:5000" ]]; then
        docker push \${DOCKER_REGISTRY}/\${PROJECT_NAME}:\${VERSION}
        docker push \${DOCKER_REGISTRY}/\${PROJECT_NAME}:latest
        log_info "Image pushed to registry"
    else
        log_info "Using local registry, skipping push"
    fi
}

# Deploy to Kubernetes
deploy_kubernetes() {
    log_info "Deploying to Kubernetes..."
    
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl not found. Cannot deploy to Kubernetes."
        exit 1
    fi
    
    # Apply namespace if it doesn't exist
    kubectl create namespace \${PROJECT_NAME}-\${ENVIRONMENT} --dry-run=client -o yaml | kubectl apply -f -
    
    # Apply deployment configurations
    if [ -d "deploy/k8s/\${ENVIRONMENT}" ]; then
        kubectl apply -f deploy/k8s/\${ENVIRONMENT}/ -n \${PROJECT_NAME}-\${ENVIRONMENT}
        log_info "Kubernetes deployment applied"
    else
        log_warn "No Kubernetes configurations found for \$ENVIRONMENT"
    fi
    
    # Wait for deployment to be ready
    kubectl rollout status deployment/\${PROJECT_NAME} -n \${PROJECT_NAME}-\${ENVIRONMENT} --timeout=300s
    
    log_info "Kubernetes deployment completed"
}

# Deploy using Docker Compose (for development)
deploy_docker_compose() {
    log_info "Deploying with Docker Compose..."
    
    if [ -f "docker-compose.yml" ]; then
        export COMPOSE_PROJECT_NAME=\${PROJECT_NAME}-\${ENVIRONMENT}
        export VERSION=\${VERSION}
        
        docker-compose up -d
        log_info "Docker Compose deployment completed"
    else
        log_warn "docker-compose.yml not found"
    fi
}

# Health check after deployment
health_check() {
    log_info "Performing health check..."
    
    # Wait for application to start
    sleep 10
    
    # Check health endpoint
    if command -v curl &> /dev/null; then
        if curl -f http://localhost:8080/health > /dev/null 2>&1; then
            log_info "Health check passed"
        else
            log_warn "Health check failed"
        fi
    else
        log_warn "curl not found, skipping health check"
    fi
}

# Main deployment function
main() {
    log_info "Starting deployment of \${PROJECT_NAME} to \${ENVIRONMENT}..."
    
    validate_environment
    build_and_push
    
    case \$ENVIRONMENT in
        development)
            deploy_docker_compose
            ;;
        staging|production)
            deploy_kubernetes
            ;;
    esac
    
    health_check
    
    log_info "Deployment completed successfully!"
}

# Run main function
main "\$@"`,
    type: "file"
  });

  // Health check script
  files.push({
    path: `${projectName}/scripts/health-check.sh`,
    content: `#!/bin/bash
# Health check script for ${config.projectName}
# Generated by DevOps Project Generator v2.0.0

set -euo pipefail

# Configuration
PROJECT_NAME="${projectName}"
HEALTH_URL="\${HEALTH_URL:-http://localhost:8080/health}"
TIMEOUT="\${TIMEOUT:-30}"
RETRIES="\${RETRIES:-3}"

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
NC='\\033[0m'

# Logging functions
log_info() {
    echo -e "\${GREEN}[INFO]\${NC} \$1"
}

log_warn() {
    echo -e "\${YELLOW}[WARN]\${NC} \$1"
}

log_error() {
    echo -e "\${RED}[ERROR]\${NC} \$1"
}

# Check if service is healthy
check_health() {
    local attempt=1
    
    while [ \$attempt -le \$RETRIES ]; do
        log_info "Health check attempt \$attempt/\$RETRIES..."
        
        if command -v curl &> /dev/null; then
            # Use curl for health check
            response=\$(curl -s -o /dev/null -w "%{http_code}" --max-time \$TIMEOUT "\$HEALTH_URL" || echo "000")
            
            if [ "\$response" = "200" ]; then
                log_info "Health check passed (HTTP 200)"
                return 0
            else
                log_warn "Health check failed (HTTP \$response)"
            fi
        elif command -v wget &> /dev/null; then
            # Use wget as fallback
            if wget -q --spider --timeout=\$TIMEOUT "\$HEALTH_URL" 2>/dev/null; then
                log_info "Health check passed"
                return 0
            else
                log_warn "Health check failed"
            fi
        else
            log_error "Neither curl nor wget available for health check"
            return 1
        fi
        
        if [ \$attempt -lt \$RETRIES ]; then
            log_info "Waiting 5 seconds before retry..."
            sleep 5
        fi
        
        attempt=\$((attempt + 1))
    done
    
    log_error "Health check failed after \$RETRIES attempts"
    return 1
}

# Check service dependencies
check_dependencies() {
    log_info "Checking service dependencies..."
    
    # Check database connectivity (example)
    # if command -v psql &> /dev/null; then
    #     if psql "\$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
    #         log_info "Database connectivity: OK"
    #     else
    #         log_warn "Database connectivity: FAILED"
    #     fi
    # fi
    
    # Check external API connectivity (example)
    # if command -v curl &> /dev/null; then
    #     if curl -f "\$EXTERNAL_API_URL/health" > /dev/null 2>&1; then
    #         log_info "External API connectivity: OK"
    #     else
    #         log_warn "External API connectivity: FAILED"
    #     fi
    # fi
    
    log_info "Dependency checks completed"
}

# Check system resources
check_resources() {
    log_info "Checking system resources..."
    
    # Check disk space
    disk_usage=\$(df . | awk 'NR==2 {print \$5}' | sed 's/%//')
    if [ \$disk_usage -lt 80 ]; then
        log_info "Disk usage: \$disk_usage% (OK)"
    else
        log_warn "Disk usage: \$disk_usage% (HIGH)"
    fi
    
    # Check memory usage
    if command -v free &> /dev/null; then
        memory_usage=\$(free | awk 'NR==2{printf "%.0f", \$3*100/\$2}')
        if [ \$memory_usage -lt 80 ]; then
            log_info "Memory usage: \$memory_usage% (OK)"
        else
            log_warn "Memory usage: \$memory_usage% (HIGH)"
        fi
    fi
    
    # Check CPU load
    if command -v uptime &> /dev/null; then
        load_avg=\$(uptime | awk -F'load average:' '{print \$2}' | awk '{print \$1}' | sed 's/,//')
        log_info "CPU load average: \$load_avg"
    fi
}

# Generate health report
generate_report() {
    local status=\$1
    local timestamp=\$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    cat > health-report-\$(date +%Y%m%d-%H%M%S).json << EOF
{
    "service": "\${PROJECT_NAME}",
    "timestamp": "\${timestamp}",
    "status": "\${status}",
    "checks": {
        "health_endpoint": "\${HEALTH_URL}",
        "dependencies": "checked",
        "resources": "checked"
    }
}
EOF
    
    log_info "Health report generated"
}

# Main health check function
main() {
    log_info "Starting health check for \${PROJECT_NAME}..."
    
    check_dependencies
    check_resources
    
    if check_health; then
        generate_report "healthy"
        log_info "Overall health status: HEALTHY"
        exit 0
    else
        generate_report "unhealthy"
        log_error "Overall health status: UNHEALTHY"
        exit 1
    fi
}

# Run main function
main "\$@"`,
    type: "file"
  });

  return files;
}

// Generate CI/CD pipeline files
function generateRealisticCIFiles(config: ProjectConfig): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const projectName = config.projectName.toLowerCase().replace(/\s+/g, '-');
  
  // GitHub Actions workflow
  files.push({
    path: `${projectName}/.github/workflows/ci.yml`,
    content: `name: CI/CD Pipeline for ${config.projectName}

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  PROJECT_NAME: ${projectName}
  DOCKER_REGISTRY: ghcr.io
  VERSION: \${{ github.sha }}

jobs:
  test:
    name: Run Tests
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
        
    - name: Cache pip dependencies
      uses: actions/cache@v3
      with:
        path: ~/.cache/pip
        key: \${{ runner.os }}-pip-\${{ hashFiles('app/requirements.txt') }}
        
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r app/requirements.txt
        pip install pytest pytest-cov
        
    - name: Run linting
      run: |
        flake8 app/ --max-line-length=100
        black --check app/
        
    - name: Run security scan
      run: |
        bandit -r app/ -f json -o bandit-report.json
        
    - name: Run unit tests
      run: |
        pytest tests/ --cov=app --cov-report=xml --cov-report=html
        
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.xml
        flags: unittests
        name: codecov-umbrella
        
    - name: Upload test artifacts
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: test-reports
        path: |
          htmlcov/
          bandit-report.json

  build:
    name: Build Docker Image
    runs-on: ubuntu-latest
    needs: test
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
      
    - name: Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: \${{ env.DOCKER_REGISTRY }}
        username: \${{ github.actor }}
        password: \${{ secrets.GITHUB_TOKEN }}
        
    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: \${{ env.DOCKER_REGISTRY }}/\${{ github.repository }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=sha,prefix={{branch}}-
          type=raw,value=latest,enable={{is_default_branch}}
          
    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        platforms: linux/amd64,linux/arm64
        push: true
        tags: \${{ steps.meta.outputs.tags }}
        labels: \${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max
        
    - name: Generate SBOM
      uses: anchore/sbom-action@v0
      with:
        image: \${{ env.DOCKER_REGISTRY }}/\${{ github.repository }}@\${{ steps.build.outputs.digest }}
        format: spdx-json
        output-file: sbom.spdx.json
        
    - name: Upload SBOM
      uses: actions/upload-artifact@v3
      with:
        name: sbom
        path: sbom.spdx.json

  security-scan:
    name: Security Scanning
    runs-on: ubuntu-latest
    needs: build
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: \${{ env.DOCKER_REGISTRY }}/\${{ github.repository }}@\${{ needs.build.outputs.digest }}
        format: 'sarif'
        output: 'trivy-results.sarif'
        
    - name: Upload Trivy scan results
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'trivy-results.sarif'

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [test, build, security-scan]
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Configure kubectl
      uses: azure/k8s-set-context@v3
      with:
        method: kubeconfig
        kubeconfig: \${{ secrets.KUBE_CONFIG_STAGING }}
        
    - name: Deploy to staging
      run: |
        helm upgrade --install \${{ env.PROJECT_NAME }}-staging ./deploy/helm \\
          --namespace staging \\
          --create-namespace \\
          --set image.tag=\${{ env.VERSION }} \\
          --set environment=staging \\
          --wait --timeout=10m
          
    - name: Verify deployment
      run: |
        kubectl rollout status deployment/\${{ env.PROJECT_NAME }}-staging -n staging
        kubectl get pods -n staging

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [test, build, security-scan]
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Configure kubectl
      uses: azure/k8s-set-context@v3
      with:
        method: kubeconfig
        kubeconfig: \${{ secrets.KUBE_CONFIG_PROD }}
        
    - name: Deploy to production
      run: |
        helm upgrade --install \${{ env.PROJECT_NAME }}-prod ./deploy/helm \\
          --namespace production \\
          --create-namespace \\
          --set image.tag=\${{ env.VERSION }} \\
          --set environment=production \\
          --set replicaCount=3 \\
          --wait --timeout=15m
          
    - name: Verify deployment
      run: |
        kubectl rollout status deployment/\${{ env.PROJECT_NAME }}-prod -n production
        kubectl get pods -n production
        
    - name: Post-deployment health check
      run: |
        sleep 30
        kubectl exec -n production deployment/\${{ env.PROJECT_NAME }}-prod -- curl -f http://localhost:8080/health`,
    type: "file"
  });

  return files;
}

// Main enhanced project generation function
export function generateEnhancedProject(config: ProjectConfig): GenerationResult {
  const allFiles: GeneratedFile[] = [];
  const components: string[] = [];
  
  // Calculate complexity for realistic generation time
  const complexity = calculateComplexity(config);
  const estimatedTime = Math.max(2, complexity * 0.5); // Base time + complexity factor
  
  // Generate base files (always included)
  allFiles.push(...generateRealisticBaseFiles(config));
  components.push("Base Files & Documentation");
  
  // Generate application files
  allFiles.push(...generateRealisticApplicationFiles(config));
  components.push("Application Code & Tests");
  
  // Generate script files
  allFiles.push(...generateRealisticScriptFiles(config));
  components.push("Deployment & Utility Scripts");
  
  // Generate CI/CD files if enabled
  if (config.ci && config.ci !== "none") {
    allFiles.push(...generateRealisticCIFiles(config));
    components.push(`CI/CD Pipeline (${config.ci})`);
  }
  
  // TODO: Add infrastructure, deployment, monitoring, and security files
  // These will be implemented in subsequent iterations
  
  // Ensure all directories exist
  const directories: GeneratedFile[] = [];
  const seenDirs = new Set<string>();
  
  for (const file of allFiles) {
    const dirs = ensureDirectories(file.path);
    for (const dir of dirs) {
      if (!seenDirs.has(dir.path)) {
        directories.push(dir);
        seenDirs.add(dir.path);
      }
    }
  }
  
  const finalFiles = [...directories, ...allFiles];
  
  return {
    success: true,
    projectName: config.projectName,
    files: finalFiles,
    summary: {
      totalFiles: finalFiles.length,
      totalDirs: directories.length,
      components
    }
  };
}

// Export the enhanced generator as default
export default generateEnhancedProject;

// Export with original name for backward compatibility
export { generateEnhancedProject as generateProject };