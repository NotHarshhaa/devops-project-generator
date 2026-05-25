import { ProjectConfig, GeneratedFile } from '@/lib/types';
import { normalizeProjectName } from '../file-utils';

// Generate realistic base files with enhanced content
export function generateRealisticBaseFiles(config: ProjectConfig): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const projectName = normalizeProjectName(config.projectName);
  
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
