import { ProjectConfig, GeneratedFile } from "@/lib/types";
import { normalizeProjectName } from "../file-utils";

export function generateRealisticDeployFiles(config: ProjectConfig): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const projectName = normalizeProjectName(config.projectName);
  const deploy = config.deploy;

  // Multi-container Docker Compose (Always provided)
  files.push({
    path: `${projectName}/deploy/docker/docker-compose.yml`,
    content: `version: '3.8'

services:
  app:
    build:
      context: ../../
      dockerfile: deploy/docker/Dockerfile
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=\${NODE_ENV:-development}
      - PORT=8080
      - DATABASE_URL=postgres://devops:secret@postgres:5432/\${PROJECT_NAME:-${config.projectName}}
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 15s
      timeout: 5s
      retries: 3
    networks:
      - app-network

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: devops
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: \${PROJECT_NAME:-${config.projectName}}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U devops"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - app-network

volumes:
  pgdata:

networks:
  app-network:
    driver: bridge
`,
    type: "file",
  });

  // Production Multi-stage Dockerfile
  files.push({
    path: `${projectName}/deploy/docker/Dockerfile`,
    content: `# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --if-present

# Production runtime stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY --from=builder /app ./
USER nodejs
EXPOSE 8080
ENV PORT=8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

CMD ["npm", "start"]
`,
    type: "file",
  });

  if (deploy === "blue-green") {
    files.push({
      path: `${projectName}/deploy/k8s/blue-deployment.yaml`,
      content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${config.projectName}-blue
  labels:
    app: ${config.projectName}
    version: blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ${config.projectName}
      version: blue
  template:
    metadata:
      labels:
        app: ${config.projectName}
        version: blue
    spec:
      containers:
      - name: web
        image: ${config.projectName}:1.0.0
        ports:
        - containerPort: 8080
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
          requests:
            cpu: "100m"
            memory: "128Mi"
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
`,
      type: "file",
    });

    files.push({
      path: `${projectName}/deploy/k8s/green-deployment.yaml`,
      content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${config.projectName}-green
  labels:
    app: ${config.projectName}
    version: green
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ${config.projectName}
      version: green
  template:
    metadata:
      labels:
        app: ${config.projectName}
        version: green
    spec:
      containers:
      - name: web
        image: ${config.projectName}:1.1.0
        ports:
        - containerPort: 8080
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
          requests:
            cpu: "100m"
            memory: "128Mi"
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
`,
      type: "file",
    });

    files.push({
      path: `${projectName}/deploy/k8s/service.yaml`,
      content: `apiVersion: v1
kind: Service
metadata:
  name: ${config.projectName}-service
spec:
  type: ClusterIP
  selector:
    app: ${config.projectName}
    version: blue # Change to 'green' to switch traffic instantly
  ports:
  - port: 80
    targetPort: 8080
`,
      type: "file",
    });

    files.push({
      path: `${projectName}/deploy/scripts/switch-traffic.sh`,
      content: `#!/usr/bin/env bash
set -euo pipefail

TARGET_COLOR="\${1:-green}"
echo "Switching traffic for ${config.projectName} to: $TARGET_COLOR"

kubectl patch service ${config.projectName}-service -p "{\\"spec\\":{\\"selector\\":{\\"version\\":\\"$TARGET_COLOR\\"}}}"
echo "Traffic successfully switched to $TARGET_COLOR!"
`,
      type: "file",
    });
  } else if (deploy === "canary") {
    files.push({
      path: `${projectName}/deploy/k8s/canary-rollout.yaml`,
      content: `apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: ${config.projectName}-rollout
spec:
  replicas: 5
  strategy:
    canary:
      steps:
      - setWeight: 10
      - pause: {duration: 10m}
      - setWeight: 30
      - pause: {duration: 10m}
      - setWeight: 60
      - pause: {duration: 10m}
  selector:
    matchLabels:
      app: ${config.projectName}
  template:
    metadata:
      labels:
        app: ${config.projectName}
    spec:
      containers:
      - name: web
        image: ${config.projectName}:latest
        ports:
        - containerPort: 8080
`,
      type: "file",
    });
  } else if (deploy === "gitops-argocd") {
    files.push({
      path: `${projectName}/deploy/argocd/application.yaml`,
      content: `apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: ${config.projectName}
  namespace: argocd
spec:
  project: default
  source:
    repoURL: 'https://github.com/example/${config.projectName}.git'
    targetRevision: HEAD
    path: deploy/k8s
  destination:
    server: 'https://kubernetes.default.svc'
    namespace: default
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
`,
      type: "file",
    });
  } else if (deploy === "helm-charts") {
    files.push({
      path: `${projectName}/deploy/helm/${config.projectName}/Chart.yaml`,
      content: `apiVersion: v2
name: ${config.projectName}
description: Production Helm chart for ${config.projectName}
type: application
version: 0.1.0
appVersion: "1.0.0"
`,
      type: "file",
    });

    files.push({
      path: `${projectName}/deploy/helm/${config.projectName}/values.yaml`,
      content: `replicaCount: 2

image:
  repository: ${config.projectName}
  pullPolicy: IfNotPresent
  tag: "latest"

service:
  type: ClusterIP
  port: 80
  targetPort: 8080

ingress:
  enabled: true
  className: "nginx"
  hosts:
    - host: ${config.projectName}.local
      paths:
        - path: /
          pathType: Prefix

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 100m
    memory: 128Mi
`,
      type: "file",
    });
  } else if (deploy === "serverless-lambda") {
    files.push({
      path: `${projectName}/deploy/serverless/serverless.yml`,
      content: `service: ${config.projectName}
frameworkVersion: '3'

provider:
  name: aws
  runtime: nodejs20.x
  stage: \${opt:stage, 'dev'}
  region: \${opt:region, 'us-east-1'}
  memorySize: 512
  timeout: 10

functions:
  api:
    handler: src/handler.handler
    events:
      - httpApi:
          path: /{proxy+}
          method: '*'
`,
      type: "file",
    });
  } else {
    // rolling deployment (default/standard)
    files.push({
      path: `${projectName}/deploy/k8s/deployment.yaml`,
      content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${config.projectName}
  labels:
    app: ${config.projectName}
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 0
  selector:
    matchLabels:
      app: ${config.projectName}
  template:
    metadata:
      labels:
        app: ${config.projectName}
    spec:
      containers:
      - name: app
        image: ${config.projectName}:latest
        ports:
        - containerPort: 8080
        resources:
          limits:
            cpu: 500m
            memory: 512Mi
          requests:
            cpu: 100m
            memory: 128Mi
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 15
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
`,
      type: "file",
    });

    files.push({
      path: `${projectName}/deploy/k8s/service.yaml`,
      content: `apiVersion: v1
kind: Service
metadata:
  name: ${config.projectName}
spec:
  type: ClusterIP
  selector:
    app: ${config.projectName}
  ports:
  - port: 80
    targetPort: 8080
`,
      type: "file",
    });
  }

  return files;
}
