#!/usr/bin/env python3
"""
Core DevOps project generator with modular architecture
"""

import logging
import time
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple

from .config import ProjectConfig, TemplateConfig
from .template_engine import TemplateRenderer, TemplateManager, RenderContext
from .file_manager import ProjectStructureManager, ProjectValidator, BackupManager
from .utils import PerformanceUtils, ProgressTracker, ValidationUtils

logger = logging.getLogger(__name__)


class DevOpsProjectGenerator:
    """DevOps project generator with improved modular architecture"""
    
    def __init__(self, config: ProjectConfig, output_dir: str = ".", max_workers: int = 4):
        self.config = config
        self.output_dir = Path(output_dir)
        self.project_path = self.output_dir / config.project_name
        self.max_workers = max_workers
        self._start_time = time.time()
        
        # Initialize modular components
        self.performance = PerformanceUtils()
        self.progress = ProgressTracker(total_steps=0)
        self.template_manager = TemplateManager(
            Path(__file__).parent.parent / "templates"
        )
        self.structure_manager = ProjectStructureManager(self.project_path, max_workers)
        self.validator = ProjectValidator(self.project_path)
        self.backup_manager = BackupManager(self.project_path)
        
        # Maintain backward compatibility
        self.template_config = TemplateConfig()
        
        # Validate configuration
        self._validate_configuration()
        
        # Setup progress tracking
        self._setup_progress_tracking()
    
    def _validate_configuration(self) -> None:
        """Validate project configuration"""
        # Validate project name
        valid_name, name_errors = ValidationUtils.validate_project_name(self.config.project_name)
        if not valid_name:
            raise ValueError(f"Invalid project name: {', '.join(name_errors)}")
        
        # Validate output path
        valid_path, path_errors = ValidationUtils.validate_output_path(self.project_path)
        if not valid_path:
            raise ValueError(f"Invalid output path: {', '.join(path_errors)}")
    
    def _setup_progress_tracking(self) -> None:
        """Setup progress tracking for generation process"""
        steps = [
            (1, "Creating project structure"),
            (2, "Rendering templates"),
            (3, "Setting up configuration files"),
            (4, "Creating scripts and documentation"),
            (5, "Validating project structure"),
            (6, "Finalizing project")
        ]
        
        for step_num, description in steps:
            self.progress.add_step(step_num, description)
        
        self.progress.total_steps = len(steps)
    
    # Legacy method compatibility
    def generate(self) -> Dict[str, Any]:
        """Legacy generate method - delegates to new implementation"""
        return self.generate_project()
    
    def _get_template_context(self) -> Dict[str, Any]:
        """Legacy method - delegates to config"""
        return self.config.get_template_context()
    
    def _render_template(self, template_path: str) -> str:
        """Legacy method - now uses template engine"""
        template_renderer = TemplateRenderer(
            Path(__file__).parent.parent / "templates"
        )
        context = self._get_template_context()
        template = template_renderer.get_template(template_path)
        return template.render(**context)
    
    def create_project_structure(self) -> None:
        """Legacy method - delegates to structure manager"""
        self._create_project_structure()
    
    def setup_ci_cd(self) -> None:
        """Legacy method - integrated into template rendering"""
        logger.info("CI/CD setup now handled by modular template rendering")
    
    def setup_infrastructure(self) -> None:
        """Legacy method - integrated into template rendering"""
        logger.info("Infrastructure setup now handled by modular template rendering")
    
    def setup_deployment(self) -> None:
        """Legacy method - integrated into template rendering"""
        logger.info("Deployment setup now handled by modular template rendering")
    
    def setup_monitoring(self) -> None:
        """Legacy method - integrated into template rendering"""
        logger.info("Monitoring setup now handled by modular template rendering")
    
    def setup_security(self) -> None:
        """Legacy method - integrated into template rendering"""
        logger.info("Security setup now handled by modular template rendering")
    
    def create_documentation(self) -> None:
        """Legacy method - integrated into scripts/docs creation"""
        logger.info("Documentation creation now handled by modular file manager")
    
    def validate_project(self) -> Dict[str, Any]:
        """Legacy method - delegates to project validator"""
        return self.validator.validate_structure()
    
    def generate_project(self) -> Dict[str, Any]:
        """Generate complete DevOps project"""
        self.performance.start_timer("total_generation")
        
        try:
            logger.info(f"Starting project generation: {self.config.project_name}")
            
            # Step 1: Create project structure
            self._create_project_structure()
            self.progress.complete_step(1)
            
            # Step 2: Render templates
            self._render_templates()
            self.progress.complete_step(2)
            
            # Step 3: Setup configuration files
            self._setup_configuration_files()
            self.progress.complete_step(3)
            
            # Step 4: Create scripts and documentation
            self._create_scripts_and_docs()
            self.progress.complete_step(4)
            
            # Step 5: Validate project structure
            self._validate_generated_project()
            self.progress.complete_step(5)
            
            # Step 6: Finalize project
            self._finalize_project()
            self.progress.complete_step(6)
            
            # Generate results
            total_time = self.performance.end_timer("total_generation")
            results = self._generate_results(total_time)
            
            logger.info(f"Project generation completed successfully in {total_time:.2f}s")
            return results
            
        except Exception as e:
            logger.error(f"Project generation failed: {str(e)}")
            raise
    
    def _create_project_structure(self) -> None:
        """Create basic project directory structure"""
        self.performance.start_timer("structure_creation")
        
        # Define project structure based on configuration
        directories = [
            "app",
            "ci", 
            "infra",
            "deploy",
            "monitoring",
            "security",
            "scripts",
            "docs",
            "tests"
        ]
        
        # Add component-specific directories
        if self.config.ci != "none":
            directories.extend([f"ci/{self.config.ci}"])
        
        if self.config.infra != "none":
            directories.extend([f"infra/{self.config.infra}"])
        
        if self.config.deploy != "vm":
            directories.extend([f"deploy/{self.config.deploy}"])
        
        # Add directories to structure manager
        for directory in directories:
            self.structure_manager.add_directory(directory)
        
        # Execute structure creation
        results = self.structure_manager.execute_all(parallel=True)
        
        if results["failed"] > 0:
            logger.warning(f"Failed to create {results['failed']} directories")
        
        self.performance.end_timer("structure_creation")
    
    def _render_templates(self) -> None:
        """Render project templates"""
        self.performance.start_timer("template_rendering")
        
        # Get template configurations based on project config
        template_configs = self._get_template_configurations()
        
        # Get base template variables
        base_variables = self.config.get_template_context()
        
        # Render templates using template engine
        template_renderer = TemplateRenderer(
            Path(__file__).parent.parent / "templates",
            max_workers=self.max_workers
        )
        
        render_results = template_renderer.render_batch(template_configs, base_variables)
        
        successful_count = sum(1 for success in render_results.values() if success)
        logger.info(f"Rendered {successful_count}/{len(template_configs)} templates")
        
        self.performance.end_timer("template_rendering")
    
    def _get_template_configurations(self) -> List[Dict[str, Any]]:
        """Get template configurations based on project settings"""
        templates = []
        
        # Core templates
        templates.extend([
            {
                'template': 'README.md.j2',
                'output': 'README.md',
                'variables': {}
            },
            {
                'template': '.gitignore.j2',
                'output': '.gitignore',
                'variables': {}
            },
            {
                'template': 'Makefile.j2',
                'output': 'Makefile',
                'variables': {}
            }
        ])
        
        # CI/CD templates
        if self.config.ci != "none":
            templates.append({
                'template': f'ci/{self.config.ci}/pipeline.yml.j2',
                'output': f'ci/{self.config.ci}/pipeline.yml',
                'variables': {'ci_platform': self.config.ci}
            })
        
        # Infrastructure templates
        if self.config.infra != "none":
            templates.append({
                'template': f'infra/{self.config.infra}/main.tf.j2',
                'output': f'infra/{self.config.infra}/main.tf',
                'variables': {'infra_type': self.config.infra}
            })
        
        # Deployment templates
        if self.config.deploy != "vm":
            templates.append({
                'template': f'deploy/{self.config.deploy}/deployment.yml.j2',
                'output': f'deploy/{self.config.deploy}/deployment.yml',
                'variables': {'deploy_type': self.config.deploy}
            })
        
        # Application templates
        templates.extend([
            {
                'template': 'app/main.py.j2',
                'output': 'app/main.py',
                'variables': {}
            },
            {
                'template': 'app/requirements.txt.j2',
                'output': 'app/requirements.txt',
                'variables': {}
            }
        ])
        
        return templates
    
    def _setup_configuration_files(self) -> None:
        """Setup project configuration files"""
        self.performance.start_timer("config_setup")
        
        # Create configuration files
        config_files = [
            {
                'path': 'devops-config.yaml',
                'content': self._generate_config_yaml()
            },
            {
                'path': 'environment.yml',
                'content': self._generate_environment_config()
            }
        ]
        
        for config_file in config_files:
            self.structure_manager.add_file_creation(
                config_file['path'],
                config_file['content']
            )
        
        results = self.structure_manager.execute_all(parallel=False)
        
        if results["failed"] > 0:
            logger.warning(f"Failed to create {results['failed']} configuration files")
        
        self.performance.end_timer("config_setup")
    
    def _generate_config_yaml(self) -> str:
        """Generate main configuration YAML"""
        import yaml
        
        config_dict = {
            'project': {
                'name': self.config.project_name,
                'version': '1.0.0',
                'description': f'DevOps project: {self.config.project_name}'
            },
            'ci_cd': {
                'platform': self.config.ci,
                'enabled': self.config.ci != "none"
            },
            'infrastructure': {
                'type': self.config.infra,
                'provider': self._get_cloud_provider()
            },
            'deployment': {
                'strategy': self.config.deploy,
                'environments': self.config.envs
            },
            'observability': {
                'level': self.config.observability,
                'monitoring': self.config.observability in ["prometheus-grafana", "datadog", "elk-stack"]
            },
            'security': {
                'level': self.config.security,
                'compliance': self.config.security in ["nist-csf", "cis-benchmarks", "zero-trust"]
            }
        }
        
        return yaml.dump(config_dict, default_flow_style=False, indent=2)
    
    def _generate_environment_config(self) -> str:
        """Generate environment configuration"""
        import yaml
        
        environments = {}
        
        if self.config.envs == "single":
            environments["development"] = {
                'debug': True,
                'logging_level': 'DEBUG'
            }
        elif self.config.envs == "dev,stage,prod":
            environments.update({
                'development': {
                    'debug': True,
                    'logging_level': 'DEBUG'
                },
                'staging': {
                    'debug': False,
                    'logging_level': 'INFO'
                },
                'production': {
                    'debug': False,
                    'logging_level': 'WARN'
                }
            })
        
        return yaml.dump({'environments': environments}, default_flow_style=False, indent=2)
    
    def _get_cloud_provider(self) -> str:
        """Get cloud provider based on infrastructure type"""
        infra_mapping = {
            'aws-vpc-eks': 'aws',
            'aws-ecs-fargate': 'aws',
            'azure-vnet-aks': 'azure',
            'gcp-vpc-gke': 'gcp',
            'multicloud-terraform': 'multi'
        }
        return infra_mapping.get(self.config.infra, 'aws')
    
    def _create_scripts_and_docs(self) -> None:
        """Create automation scripts and documentation"""
        self.performance.start_timer("scripts_docs_creation")
        
        # Scripts
        scripts = [
            {
                'path': 'scripts/setup.sh',
                'content': self._generate_setup_script()
            },
            {
                'path': 'scripts/deploy.sh',
                'content': self._generate_deploy_script()
            },
            {
                'path': 'scripts/test.sh',
                'content': self._generate_test_script()
            }
        ]
        
        # Documentation
        docs = [
            {
                'path': 'docs/ARCHITECTURE.md',
                'content': self._generate_architecture_docs()
            },
            {
                'path': 'docs/DEPLOYMENT.md',
                'content': self._generate_deployment_docs()
            }
        ]
        
        for script in scripts:
            self.structure_manager.add_file_creation(script['path'], script['content'])
        
        for doc in docs:
            self.structure_manager.add_file_creation(doc['path'], doc['content'])
        
        results = self.structure_manager.execute_all(parallel=True)
        
        if results["failed"] > 0:
            logger.warning(f"Failed to create {results['failed']} scripts/docs")
        
        self.performance.end_timer("scripts_docs_creation")
    
    def _generate_setup_script(self) -> str:
        """Generate setup script"""
        return f"""#!/bin/bash
# Setup script for {self.config.project_name}

set -e

echo "🚀 Setting up {self.config.project_name}..."

# Install dependencies
if [ -f "app/requirements.txt" ]; then
    echo "📦 Installing Python dependencies..."
    pip install -r app/requirements.txt
fi

# Setup infrastructure
if [ -d "infra" ]; then
    echo "🏗️  Setting up infrastructure..."
    cd infra
    terraform init
    terraform plan
    cd ..
fi

echo "✅ Setup completed successfully!"
"""
    
    def _generate_deploy_script(self) -> str:
        """Generate deployment script"""
        return f"""#!/bin/bash
# Deployment script for {self.config.project_name}

set -e

ENVIRONMENT=${{1:-development}}

echo "🚀 Deploying {self.config.project_name} to $ENVIRONMENT..."

# Run tests
echo "🧪 Running tests..."
./scripts/test.sh

# Deploy based on strategy
case "{self.config.deploy}" in
    "kubernetes")
        echo "☸️  Deploying to Kubernetes..."
        kubectl apply -f deploy/
        ;;
    "docker")
        echo "🐳 Building and deploying Docker containers..."
        docker-compose -f docker/docker-compose.yml up -d
        ;;
    *)
        echo "🖥️  Deploying to VM..."
        ./scripts/setup.sh
        ;;
esac

echo "✅ Deployment completed!"
"""
    
    def _generate_test_script(self) -> str:
        """Generate test script"""
        return """#!/bin/bash
# Test script for the project

set -e

echo "🧪 Running tests..."

# Python tests
if [ -f "app/requirements.txt" ]; then
    echo "🐍 Running Python tests..."
    python -m pytest app/tests/ -v
fi

# Infrastructure tests
if [ -d "infra" ]; then
    echo "🏗️  Validating infrastructure..."
    cd infra
    terraform validate
    cd ..
fi

# Security tests
if [ -d "security" ]; then
    echo "🔒 Running security scans..."
    # Add security scanning commands here
fi

echo "✅ All tests passed!"
"""
    
    def _generate_architecture_docs(self) -> str:
        """Generate architecture documentation"""
        return f"""# Architecture Documentation

## Project Overview
{self.config.project_name} - A DevOps-enabled project with modern infrastructure and deployment practices.

## Components

### Application
- **Framework**: Python application
- **Structure**: Modular architecture in `app/` directory

### CI/CD
- **Platform**: {self.config.ci}
- **Pipeline**: Automated testing and deployment
- **Location**: `ci/{self.config.ci}/`

### Infrastructure
- **Type**: {self.config.infra}
- **Provider**: {self._get_cloud_provider()}
- **Location**: `infra/{self.config.infra}/`

### Deployment
- **Strategy**: {self.config.deploy}
- **Environments**: {self.config.envs}
- **Location**: `deploy/{self.config.deploy}/`

### Observability
- **Level**: {self.config.observability}
- **Monitoring**: {'Enabled' if self.config.observability != 'logs' else 'Basic logging'}

### Security
- **Framework**: {self.config.security}
- **Compliance**: {'Enabled' if self.config.security != 'basic' else 'Basic security'}

## Data Flow
1. Code commits trigger CI/CD pipeline
2. Automated tests validate changes
3. Infrastructure is provisioned/updated
4. Application is deployed to target environment
5. Monitoring and logging collect operational data

## Technology Stack
- **Language**: Python
- **Containerization**: Docker
- **Infrastructure as Code**: Terraform
- **CI/CD**: {self.config.ci}
- **Orchestration**: Kubernetes (if applicable)
"""
    
    def _generate_deployment_docs(self) -> str:
        """Generate deployment documentation"""
        return f"""# Deployment Guide

## Overview
This guide covers deploying {self.config.project_name} to different environments.

## Prerequisites
- Docker (if using container deployment)
- kubectl (if using Kubernetes)
- Terraform (if using infrastructure)
- Access to target cloud platform

## Environments
{self.config.envs}

## Deployment Methods

### 1. Automated Deployment
```bash
# Deploy to specific environment
./scripts/deploy.sh <environment>
```

### 2. Manual Deployment

#### Development
```bash
./scripts/setup.sh
```

#### Production
```bash
# 1. Validate infrastructure
cd infra && terraform plan && terraform apply

# 2. Deploy application
./scripts/deploy.sh production
```

## Configuration
Configuration is managed through:
- `devops-config.yaml` - Main project configuration
- `environment.yml` - Environment-specific settings
- CI/CD pipeline variables

## Monitoring
- Logs are collected and centralized
- Metrics are available through {self.config.observability}
- Health checks are configured for all services

## Troubleshooting
1. Check logs in the monitoring system
2. Validate infrastructure state
3. Run health checks: `./scripts/test.sh`
4. Review CI/CD pipeline logs
"""
    
    def _validate_generated_project(self) -> None:
        """Validate the generated project structure"""
        self.performance.start_timer("project_validation")
        
        validation_results = self.validator.validate_structure()
        
        if not validation_results["valid"]:
            logger.warning("Project validation found issues:")
            for error in validation_results["errors"]:
                logger.warning(f"  - {error}")
        
        if validation_results["warnings"]:
            logger.info("Project validation warnings:")
            for warning in validation_results["warnings"]:
                logger.info(f"  - {warning}")
        
        self.performance.end_timer("project_validation")
    
    def _finalize_project(self) -> None:
        """Finalize project generation"""
        self.performance.start_timer("project_finalization")
        
        # Create initial backup
        success, message = self.backup_manager.create_backup(include_config=False)
        if success:
            logger.info(f"Created initial backup: {message}")
        
        # Generate project report
        self._generate_project_report()
        
        self.performance.end_timer("project_finalization")
    
    def _generate_project_report(self) -> None:
        """Generate comprehensive project report"""
        report = self.validator.generate_report()
        
        report_path = self.project_path / "PROJECT_REPORT.md"
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report)
        
        logger.info(f"Generated project report: {report_path}")
    
    def _generate_results(self, total_time: float) -> Dict[str, Any]:
        """Generate generation results summary"""
        return {
            "success": True,
            "project_name": self.config.project_name,
            "project_path": str(self.project_path),
            "generation_time": total_time,
            "progress": self.progress.get_progress(),
            "performance_metrics": self.performance.get_metrics(),
            "validation_results": self.validator.validate_structure(),
            "configuration": {
                "ci": self.config.ci,
                "infra": self.config.infra,
                "deploy": self.config.deploy,
                "envs": self.config.envs,
                "observability": self.config.observability,
                "security": self.config.security
            }
        }
    
    def get_generation_status(self) -> Dict[str, Any]:
        """Get current generation status"""
        return {
            "progress": self.progress.get_progress(),
            "status": self.progress.get_status(),
            "performance_metrics": self.performance.get_metrics(),
            "operations_summary": self.structure_manager.get_operation_summary()
        }
    
    def create_backup(self, **kwargs) -> Tuple[bool, str]:
        """Create project backup"""
        return self.backup_manager.create_backup(**kwargs)
    
    def restore_backup(self, backup_name: str) -> Tuple[bool, str]:
        """Restore project from backup"""
        return self.backup_manager.restore_backup(backup_name)
    
    def list_backups(self) -> List[Dict[str, Any]]:
        """List available backups"""
        return self.backup_manager.list_backups()


# Factory function for backward compatibility
def create_generator(config: ProjectConfig, output_dir: str = ".", 
                   use_modular: bool = True) -> DevOpsProjectGenerator:
    """
    Factory function to create generator with specified architecture
    
    Args:
        config: Project configuration
        output_dir: Output directory
        use_modular: Whether to use new modular architecture (default: True)
    
    Returns:
        DevOpsProjectGenerator instance
    """
    return DevOpsProjectGenerator(config, output_dir)
