import { ProjectConfig, GeneratedFile } from '@/lib/types';
import { normalizeProjectName } from '../file-utils';

// Generate CI/CD pipeline files
export function generateRealisticCIFiles(config: ProjectConfig): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const projectName = normalizeProjectName(config.projectName);
  
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
