#!/usr/bin/env python3
"""
Multi-environment configuration generator with modular architecture
"""

import logging
import secrets as secrets_module
from pathlib import Path
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field
from datetime import datetime

from .utils import FileOperations, PathUtils, ValidationUtils
from .template_engine import TemplateRenderer, RenderContext

logger = logging.getLogger(__name__)


@dataclass
class EnvironmentConfig:
    """Environment-specific configuration"""
    
    name: str
    variables: Dict[str, Any] = field(default_factory=dict)
    overrides: Dict[str, Any] = field(default_factory=dict)
    secrets: Dict[str, str] = field(default_factory=dict)
    
    def get_merged_config(self) -> Dict[str, Any]:
        """Get merged configuration with overrides applied"""
        merged = self.variables.copy()
        merged.update(self.overrides)
        return merged
    
    def add_variable(self, key: str, value: Any) -> None:
        """Add configuration variable"""
        self.variables[key] = value
    
    def add_override(self, key: str, value: Any) -> None:
        """Add configuration override"""
        self.overrides[key] = value
    
    def add_secret(self, key: str, value: str) -> None:
        """Add secret"""
        self.secrets[key] = value


@dataclass
class ConfigTemplate:
    """Configuration template metadata"""
    
    name: str
    category: str
    description: str
    variables: Dict[str, Any] = field(default_factory=dict)
    template_path: Optional[str] = None


class MultiEnvConfigGenerator:
    """Enhanced multi-environment configuration generator with modular architecture"""
    
    def __init__(self, project_path: str):
        self.project_path = Path(project_path).resolve()
        self.environments: Dict[str, EnvironmentConfig] = {}
        self.templates: List[ConfigTemplate] = []
        self.config_dir = self.project_path / "config"
        self.secrets_dir = self.config_dir / "secrets"
        self.template_renderer = TemplateRenderer(
            Path(__file__).parent.parent / "templates"
        )
        
        # Validate project path
        if not self.project_path.exists():
            raise ValueError(f"Project path does not exist: {self.project_path}")
        
        logger.info(f"Initialized multi-env config generator for: {self.project_path}")
    
    def setup_environment_structure(self, environments: List[str]) -> None:
        """Setup directory structure for multi-environment configs"""
        logger.info(f"Setting up environment structure for: {environments}")
        
        # Create directories
        PathUtils.ensure_directory(self.config_dir)
        PathUtils.ensure_directory(self.secrets_dir)
        
        # Create environment-specific directories
        for env in environments:
            env_dir = self.config_dir / env
            PathUtils.ensure_directory(env_dir)
            
            # Initialize environment config
            if env not in self.environments:
                self.environments[env] = EnvironmentConfig(
                    name=env,
                    description=f"Configuration for {env} environment"
                )
        
        logger.info(f"Created environment directories: {environments}")
    
    def add_base_config(self, config: Dict[str, Any], config_type: str = "application") -> None:
        """Add base configuration that applies to all environments"""
        base_config_path = self.config_dir / f"base-{config_type}.yaml"
        
        import yaml
        with open(base_config_path, 'w', encoding='utf-8') as f:
            yaml.dump(config, f, default_flow_style=False, indent=2)
        
        # Update all environments with base config
        for env_config in self.environments.values():
            env_config.variables.update(config)
        
        logger.info(f"Added base {config_type} configuration to all environments")
    
    def add_environment_override(self, environment: str, overrides: Dict[str, Any]) -> None:
        """Add environment-specific overrides"""
        if environment not in self.environments:
            raise ValueError(f"Environment '{environment}' not found")
        
        env_config = self.environments[environment]
        for key, value in overrides.items():
            env_config.add_override(key, value)
        
        logger.info(f"Added overrides for environment: {environment}")
    
    def add_secrets(self, environment: str, secrets: Dict[str, str]) -> None:
        """Add secrets for specific environment"""
        if environment not in self.environments:
            raise ValueError(f"Environment '{environment}' not found")
        
        env_config = self.environments[environment]
        for key, value in secrets.items():
            env_config.add_secret(key, value)
        
        # Store secrets in secure format
        secrets_file = self.secrets_dir / f"{environment}-secrets.yaml"
        import yaml
        with open(secrets_file, 'w', encoding='utf-8') as f:
            yaml.dump(secrets, f, default_flow_style=False, indent=2)
        
        logger.info(f"Added secrets for environment: {environment}")
    
    def generate_kubernetes_configs(self, environments: List[str]) -> None:
        """Generate Kubernetes configurations for all environments"""
        k8s_dir = self.project_path / "k8s"
        k8s_base_dir = k8s_dir / "base"
        k8s_overlays_dir = k8s_dir / "overlays"
        
        # Create directories
        PathUtils.ensure_directory(k8s_base_dir)
        PathUtils.ensure_directory(k8s_overlays_dir)
        
        # Generate base Kustomize configuration
        base_kustomize = {
            "apiVersion": "kustomize.config.k8s.io/v1beta1",
            "kind": "Kustomization",
            "resources": [
                {"kind": "Namespace", "name": "{{ project_name }}"},
                {"kind": "ConfigMap", "name": "{{ project_name }}-config"},
                {"kind": "Secret", "name": "{{ project_name }}-secrets"}
            ]
        }
        
        import yaml
        base_kustomize_path = k8s_base_dir / "kustomization.yaml"
        with open(base_kustomize_path, 'w', encoding='utf-8') as f:
            yaml.dump(base_kustomize, f, default_flow_style=False, indent=2)
        
        # Generate environment-specific overlays
        for env in environments:
            if env in self.environments:
                env_dir = k8s_overlays_dir / env
                PathUtils.ensure_directory(env_dir)
                
                env_config = self.environments[env]
                overlay_config = {
                    "apiVersion": "kustomize.config.k8s.io/v1beta1",
                    "kind": "Kustomization",
                    "namespace": env,
                    "bases": ["../../base"],
                    "patchesStrategicMerge": [
                        {"kind": "ConfigMap", "name": "{{ project_name }}-config"},
                        {"kind": "Secret", "name": "{{ project_name }}-secrets"}
                    ]
                }
                
                overlay_path = env_dir / "kustomization.yaml"
                with open(overlay_path, 'w', encoding='utf-8') as f:
                    yaml.dump(overlay_config, f, default_flow_style=False, indent=2)
        
        logger.info(f"Generated Kubernetes configurations for environments: {environments}")
    
    def generate_config_maps(self, environments: List[str]) -> None:
        """Generate Kubernetes ConfigMaps"""
        for env in environments:
            if env in self.environments:
                env_config = self.environments[env]
                config_map_data = env_config.get_merged_config()
                
                # Convert to Kubernetes ConfigMap format
                config_map = {
                    "apiVersion": "v1",
                    "kind": "ConfigMap",
                    "metadata": {
                        "name": f"{self.project_path.name}-config",
                        "namespace": env
                    },
                    "data": {
                        key: str(value) if value is not None else ""
                        for key, value in config_map_data.items()
                        if isinstance(value, (str, int, float, bool))
                    }
                }
                
                config_map_dir = self.config_dir / env
                config_map_path = config_map_dir / f"{self.project_path.name}-configmap.yaml"
                import yaml
                with open(config_map_path, 'w', encoding='utf-8') as f:
                    yaml.dump(config_map, f, default_flow_style=False, indent=2)
        
        logger.info(f"Generated ConfigMaps for environments: {environments}")
    
    def generate_secrets_templates(self, environments: List[str]) -> None:
        """Generate Kubernetes Secrets templates"""
        for env in environments:
            if env in self.environments:
                env_config = self.environments[env]
                
                # Create secrets template
                secrets_template = {
                    "apiVersion": "v1",
                    "kind": "Secret",
                    "metadata": {
                        "name": f"{self.project_path.name}-secrets",
                        "namespace": env
                    },
                    "stringData": {
                        key: f"{{{{ {key} }}}}"
                        for key in env_config.secrets.keys()
                    }
                }
                
                secrets_template_dir = self.config_dir / env
                secrets_template_path = secrets_template_dir / f"{self.project_path.name}-secrets.yaml.template"
                import yaml
                with open(secrets_template_path, 'w', encoding='utf-8') as f:
                    yaml.dump(secrets_template, f, default_flow_style=False, indent=2)
        
        logger.info(f"Generated Secrets templates for environments: {environments}")
    
    def generate_docker_compose_configs(self, environments: List[str]) -> None:
        """Generate Docker Compose configurations"""
        docker_dir = self.project_path / "docker"
        PathUtils.ensure_directory(docker_dir)
        
        for env in environments:
            if env in self.environments:
                env_config = self.environments[env]
                
                docker_compose = {
                    "version": "3.8",
                    "services": {
                        "app": {
                            "build": ".",
                            "environment": env_config.get_merged_config(),
                            "ports": ["8080:8080"],
                            "volumes": ["./app:/app"],
                            "restart": "unless-stopped"
                        }
                    },
                    "volumes": {
                        "app_data": {}
                    }
                }
                
                compose_file = docker_dir / f"docker-compose.{env}.yml"
                import yaml
                with open(compose_file, 'w', encoding='utf-8') as f:
                    yaml.dump(docker_compose, f, default_flow_style=False, indent=2)
        
        logger.info(f"Generated Docker Compose configurations for environments: {environments}")
    
    def generate_env_files(self, environments: List[str]) -> None:
        """Generate environment files"""
        for env in environments:
            if env in self.environments:
                env_config = self.environments[env]
                
                # Create .env file
                env_file_content = []
                for key, value in env_config.get_merged_config().items():
                    if isinstance(value, (str, int, float)):
                        env_file_content.append(f"{key}={value}")
                
                env_file = self.config_dir / env / ".env"
                with open(env_file, 'w', encoding='utf-8') as f:
                    f.write('\n'.join(env_file_content))
        
        logger.info(f"Generated environment files for: {environments}")
    
    def generate_deployment_script(self, environments: List[str]) -> None:
        """Generate deployment script"""
        scripts_dir = self.project_path / "scripts"
        PathUtils.ensure_directory(scripts_dir)
        
        script_content = f"""#!/bin/bash
# Deployment script for multi-environment setup

set -e

ENVIRONMENT=${{1:-development}}
PROJECT_NAME="{self.project_path.name}"

echo "🚀 Deploying $PROJECT_NAME to $ENVIRONMENT environment"

# Validate environment
if ! [[ "$ENVIRONMENT" =~ ^(development|staging|production)$ ]]; then
    echo "❌ Invalid environment: $ENVIRONMENT"
    echo "Valid environments: development, staging, production"
    exit 1
fi

# Check if environment configuration exists
CONFIG_DIR="config/$ENVIRONMENT"
if [ ! -d "$CONFIG_DIR" ]; then
    echo "❌ Environment configuration not found: $CONFIG_DIR"
    exit 1
fi

echo "📋 Using configuration from: $CONFIG_DIR"

# Deploy based on available configurations
if [ -f "k8s/overlays/$ENVIRONMENT/kustomization.yaml" ]; then
    echo "☸️  Deploying with Kubernetes"
    kubectl apply -k k8s/overlays/$ENVIRONMENT
elif [ -f "docker/docker-compose.$ENVIRONMENT.yml" ]; then
    echo "🐳  Deploying with Docker Compose"
    cd docker
    docker-compose -f docker-compose.$ENVIRONMENT.yml up -d
    cd ..
else
    echo "🖥️  No deployment configuration found"
    echo "Available configurations:"
    ls -la config/$ENVIRONMENT/
    exit 1
fi

echo "✅ Deployment to $ENVIRONMENT completed successfully!"
"""
        
        script_file = scripts_dir / "deploy.sh"
        with open(script_file, 'w', encoding='utf-8') as f:
            f.write(script_content)
        
        # Make script executable
        script_file.chmod(0o755)
        
        logger.info("Generated deployment script")
    
    def validate_configurations(self) -> Dict[str, List[str]]:
        """Validate all environment configurations"""
        validation_results = {}
        
        for env_name, env_config in self.environments.items():
            errors = []
            
            # Check if environment has configuration
            if not env_config.variables and not env_config.overrides:
                errors.append("No configuration found")
            
            # Check required variables
            required_vars = ["project_name", "environment"]
            for var in required_vars:
                if var not in env_config.get_merged_config():
                    errors.append(f"Missing required variable: {var}")
            
            # Validate variable types
            for key, value in env_config.get_merged_config().items():
                if key == "port" and not isinstance(value, (int, str)):
                    try:
                        int(value)
                    except ValueError:
                        errors.append(f"Port must be numeric: {value}")
            
            validation_results[env_name] = errors
        
        return validation_results
    
    def get_environment(self, environment: str) -> Optional[EnvironmentConfig]:
        """Get specific environment configuration"""
        return self.environments.get(environment)
    
    def list_environments(self) -> List[str]:
        """List all configured environments"""
        return list(self.environments.keys())
    
    def export_configuration(self, output_dir: str) -> bool:
        """Export all configurations to directory"""
        try:
            export_path = Path(output_dir)
            PathUtils.ensure_directory(export_path)
            
            # Export environment configurations
            for env_name, env_config in self.environments.items():
                env_export_dir = export_path / env_name
                PathUtils.ensure_directory(env_export_dir)
                
                # Export variables
                variables_file = env_export_dir / "variables.yaml"
                import yaml
                with open(variables_file, 'w', encoding='utf-8') as f:
                    yaml.dump(env_config.variables, f, default_flow_style=False, indent=2)
                
                # Export overrides
                overrides_file = env_export_dir / "overrides.yaml"
                with open(overrides_file, 'w', encoding='utf-8') as f:
                    yaml.dump(env_config.overrides, f, default_flow_style=False, indent=2)
            
            # Export metadata
            metadata = {
                "project_name": self.project_path.name,
                "project_path": str(self.project_path),
                "environments": list(self.environments.keys()),
                "exported_at": datetime.datetime.now().isoformat(),
                "version": "1.6.0"
            }
            
            metadata_file = export_path / "metadata.yaml"
            with open(metadata_file, 'w', encoding='utf-8') as f:
                yaml.dump(metadata, f, default_flow_style=False, indent=2)
            
            logger.info(f"Exported configurations to: {export_path}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to export configurations: {str(e)}")
            return False
