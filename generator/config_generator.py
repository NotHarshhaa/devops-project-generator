"""
Multi-Environment Configuration Generator Module
Generates environment-specific configuration files with inheritance and validation
"""

import os
import json
import yaml
import logging
from pathlib import Path
from typing import Dict, List, Optional, Any, Union, Set
from dataclasses import dataclass, field
from datetime import datetime
from jinja2 import Environment, FileSystemLoader, Template
import secrets

logger = logging.getLogger(__name__)


@dataclass
class EnvironmentConfig:
    """Represents configuration for a specific environment"""
    name: str
    base_config: Dict[str, Any] = field(default_factory=dict)
    overrides: Dict[str, Any] = field(default_factory=dict)
    secrets: Dict[str, str] = field(default_factory=dict)
    variables: Dict[str, str] = field(default_factory=dict)
    description: str = ""
    
    def get_merged_config(self) -> Dict[str, Any]:
        """Get merged configuration with overrides applied"""
        merged = self.base_config.copy()
        merged.update(self.overrides)
        return merged


@dataclass
class ConfigTemplate:
    """Template for generating configuration files"""
    name: str
    template_path: str
    output_path: str
    environments: List[str] = field(default_factory=list)
    variables: Dict[str, Any] = field(default_factory=dict)
    description: str = ""


class MultiEnvConfigGenerator:
    """Generates multi-environment configurations with inheritance"""
    
    def __init__(self, project_path: str):
        self.project_path = Path(project_path)
        self.environments: Dict[str, EnvironmentConfig] = {}
        self.templates: List[ConfigTemplate] = []
        self.config_dir = self.project_path / "config"
        self.secrets_dir = self.config_dir / "secrets"
        
    def setup_environment_structure(self, environments: List[str]) -> None:
        """Setup directory structure for multi-environment configs"""
        logger.info(f"Setting up environment structure for: {environments}")
        
        # Create directories
        self.config_dir.mkdir(exist_ok=True)
        self.secrets_dir.mkdir(exist_ok=True)
        
        # Create environment-specific directories
        for env in environments:
            env_dir = self.config_dir / env
            env_dir.mkdir(exist_ok=True)
            
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
        
        with open(base_config_path, 'w', encoding='utf-8') as f:
            yaml.dump(config, f, default_flow_style=False, indent=2)
        
        # Update all environments with base config
        for env_config in self.environments.values():
            env_config.base_config.update(config)
        
        logger.info(f"Added base {config_type} configuration")
    
    def add_environment_override(self, environment: str, overrides: Dict[str, Any]) -> None:
        """Add environment-specific overrides"""
        if environment not in self.environments:
            raise ValueError(f"Environment {environment} not found")
        
        env_config = self.environments[environment]
        env_config.overrides.update(overrides)
        
        # Save environment-specific config
        env_config_path = self.config_dir / environment / f"{environment}.yaml"
        with open(env_config_path, 'w', encoding='utf-8') as f:
            yaml.dump(env_config.get_merged_config(), f, default_flow_style=False, indent=2)
        
        logger.info(f"Added overrides for {environment} environment")
    
    def add_secrets(self, environment: str, secrets: Dict[str, str]) -> None:
        """Add environment-specific secrets"""
        if environment not in self.environments:
            raise ValueError(f"Environment {environment} not found")
        
        env_config = self.environments[environment]
        env_config.secrets.update(secrets)
        
        # Save secrets (in real implementation, these would be encrypted)
        secrets_path = self.secrets_dir / f"{environment}-secrets.yaml"
        secrets_data = {
            'environment': environment,
            'secrets': {k: f"{{{{ secret '{k}' }}}}" for k in secrets.keys()},
            'generated_at': datetime.now().isoformat()
        }
        
        with open(secrets_path, 'w', encoding='utf-8') as f:
            yaml.dump(secrets_data, f, default_flow_style=False, indent=2)
        
        logger.info(f"Added secrets for {environment} environment")
    
    def generate_kubernetes_configs(self, environments: List[str]) -> None:
        """Generate Kubernetes configurations for all environments"""
        k8s_dir = self.project_path / "k8s"
        k8s_dir.mkdir(exist_ok=True)
        
        # Create base and overlays structure
        base_dir = k8s_dir / "base"
        base_dir.mkdir(exist_ok=True)
        
        overlays_dir = k8s_dir / "overlays"
        overlays_dir.mkdir(exist_ok=True)
        
        for env in environments:
            env_overlay_dir = overlays_dir / env
            env_overlay_dir.mkdir(exist_ok=True)
            
            # Generate kustomization.yaml for overlay
            kustomization = {
                'apiVersion': 'kustomize.config.k8s.io/v1beta1',
                'kind': 'Kustomization',
                'bases': ['../../base'],
                'patchesStrategicMerge': [],
                'commonLabels': {
                    'environment': env,
                    'app': '{{ project_name }}'
                },
                'images': [
                    {
                        'name': '{{ project_name }}',
                        'newTag': f'{env}-latest'
                    }
                ]
            }
            
            kustomization_path = env_overlay_dir / "kustomization.yaml"
            with open(kustomization_path, 'w', encoding='utf-8') as f:
                yaml.dump(kustomization, f, default_flow_style=False, indent=2)
        
        logger.info("Generated Kubernetes configurations")
    
    def generate_docker_compose_configs(self, environments: List[str]) -> None:
        """Generate Docker Compose configurations for different environments"""
        compose_dir = self.project_path / "docker"
        compose_dir.mkdir(exist_ok=True)
        
        # Base docker-compose.yml
        base_compose = {
            'version': '3.8',
            'services': {
                'app': {
                    'build': '.',
                    'environment': [
                        'NODE_ENV=${NODE_ENV:-development}',
                        'PORT=${PORT:-3000}',
                        'DATABASE_URL=${DATABASE_URL:-localhost}'
                    ],
                    'ports': ['${PORT:-3000}:3000'],
                    'volumes': ['.:/app']
                }
            }
        }
        
        base_compose_path = compose_dir / "docker-compose.yml"
        with open(base_compose_path, 'w', encoding='utf-8') as f:
            yaml.dump(base_compose, f, default_flow_style=False, indent=2)
        
        # Environment-specific overrides
        for env in environments:
            env_compose = {
                'version': '3.8',
                'services': {
                    'app': {
                        'environment': [
                            f'NODE_ENV={env}',
                            'PORT=${PORT:-3000}',
                            'DATABASE_URL=${DATABASE_URL:-localhost}'
                        ]
                    }
                }
            }
            
            if env == 'production':
                env_compose['services']['app'].update({
                    'restart': 'always',
                    'deploy': {
                        'replicas': 3,
                        'resources': {
                            'limits': {
                                'memory': '512M',
                                'cpus': '0.5'
                            }
                        }
                    }
                })
            elif env == 'development':
                env_compose['services']['app'].update({
                    'volumes': ['.:/app', '/app/node_modules'],
                    'command': 'npm run dev'
                })
            
            env_compose_path = compose_dir / f"docker-compose.{env}.yml"
            with open(env_compose_path, 'w', encoding='utf-8') as f:
                yaml.dump(env_compose, f, default_flow_style=False, indent=2)
        
        logger.info("Generated Docker Compose configurations")
    
    def generate_env_files(self, environments: List[str]) -> None:
        """Generate .env files for different environments"""
        config_dir = self.project_path / "config"
        
        for env in environments:
            env_config = self.environments.get(env)
            if not env_config:
                continue
            
            # Generate .env file
            env_file_path = config_dir / f".env.{env}"
            env_content = []
            
            # Add environment variables
            env_content.append(f"# Environment: {env}")
            env_content.append(f"NODE_ENV={env}")
            env_content.append(f"ENVIRONMENT={env.upper()}")
            
            # Add configuration variables
            for key, value in env_config.variables.items():
                env_content.append(f"{key}={value}")
            
            # Add secret placeholders
            for secret_key in env_config.secrets.keys():
                env_content.append(f"{secret_key.upper()}=YOUR_{secret_key.upper()}_HERE")
            
            with open(env_file_path, 'w', encoding='utf-8') as f:
                f.write('\n'.join(env_content))
        
        logger.info("Generated environment files")
    
    def generate_config_maps(self, environments: List[str]) -> None:
        """Generate Kubernetes ConfigMaps for environment configurations"""
        k8s_overlays_dir = self.project_path / "k8s" / "overlays"
        
        for env in environments:
            env_config = self.environments.get(env)
            if not env_config:
                continue
            
            overlay_dir = k8s_overlays_dir / env
            
            # Generate ConfigMap
            config_map = {
                'apiVersion': 'v1',
                'kind': 'ConfigMap',
                'metadata': {
                    'name': f'{{{{ project_name }}}}-{env}-config',
                    'labels': {
                        'app': '{{ project_name }}',
                        'environment': env
                    }
                },
                'data': {}
            }
            
            # Add configuration data
            merged_config = env_config.get_merged_config()
            for key, value in merged_config.items():
                if isinstance(value, (str, int, float, bool)):
                    config_map['data'][key] = str(value)
                else:
                    config_map['data'][key] = yaml.dump(value).strip()
            
            config_map_path = overlay_dir / "configmap.yaml"
            with open(config_map_path, 'w', encoding='utf-8') as f:
                yaml.dump(config_map, f, default_flow_style=False, indent=2)
        
        logger.info("Generated Kubernetes ConfigMaps")
    
    def generate_secrets_templates(self, environments: List[str]) -> None:
        """Generate secrets templates for Kubernetes"""
        k8s_overlays_dir = self.project_path / "k8s" / "overlays"
        
        for env in environments:
            env_config = self.environments.get(env)
            if not env_config or not env_config.secrets:
                continue
            
            overlay_dir = k8s_overlays_dir / env
            
            # Generate Secret template
            secret = {
                'apiVersion': 'v1',
                'kind': 'Secret',
                'metadata': {
                    'name': f'{{{{ project_name }}}}-{env}-secrets',
                    'labels': {
                        'app': '{{ project_name }}',
                        'environment': env
                    }
                },
                'type': 'Opaque',
                'data': {}
            }
            
            # Add secret data (base64 encoded placeholders)
            for secret_key in env_config.secrets.keys():
                placeholder = f"REPLACE_WITH_{secret_key.upper()}_BASE64"
                secret['data'][secret_key] = placeholder
            
            secret_path = overlay_dir / "secrets.yaml"
            with open(secret_path, 'w', encoding='utf-8') as f:
                yaml.dump(secret, f, default_flow_style=False, indent=2)
        
        logger.info("Generated Kubernetes Secrets templates")
    
    def validate_configurations(self) -> Dict[str, List[str]]:
        """Validate all environment configurations"""
        validation_results = {}
        
        for env_name, env_config in self.environments.items():
            errors = []
            
            # Check for required fields
            if not env_config.name:
                errors.append("Environment name is required")
            
            # Check for missing secrets in production
            if env_name == 'production' and not env_config.secrets:
                errors.append("Production environment should have secrets defined")
            
            # Check configuration consistency
            merged_config = env_config.get_merged_config()
            if 'database' in merged_config:
                db_config = merged_config['database']
                if 'host' not in db_config:
                    errors.append("Database configuration missing host")
                if 'name' not in db_config:
                    errors.append("Database configuration missing name")
            
            validation_results[env_name] = errors
        
        return validation_results
    
    def generate_config_diff(self, env1: str, env2: str) -> Dict[str, Any]:
        """Generate configuration difference between two environments"""
        if env1 not in self.environments or env2 not in self.environments:
            raise ValueError("Both environments must exist")
        
        config1 = self.environments[env1].get_merged_config()
        config2 = self.environments[env2].get_merged_config()
        
        diff = {
            'added': {},
            'removed': {},
            'modified': {},
            'unchanged': {}
        }
        
        # Find all keys
        all_keys = set(config1.keys()) | set(config2.keys())
        
        for key in all_keys:
            val1 = config1.get(key)
            val2 = config2.get(key)
            
            if key in config1 and key not in config2:
                diff['removed'][key] = val1
            elif key not in config1 and key in config2:
                diff['added'][key] = val2
            elif val1 != val2:
                diff['modified'][key] = {'from': val1, 'to': val2}
            else:
                diff['unchanged'][key] = val1
        
        return diff
    
    def export_configurations(self, output_dir: str) -> None:
        """Export all configurations to a specified directory"""
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        # Export environment configurations
        for env_name, env_config in self.environments.items():
            env_dir = output_path / env_name
            env_dir.mkdir(exist_ok=True)
            
            # Export merged config
            merged_config_path = env_dir / "config.yaml"
            with open(merged_config_path, 'w', encoding='utf-8') as f:
                yaml.dump(env_config.get_merged_config(), f, default_flow_style=False, indent=2)
            
            # Export secrets template
            if env_config.secrets:
                secrets_template_path = env_dir / "secrets-template.yaml"
                secrets_data = {
                    'environment': env_name,
                    'required_secrets': list(env_config.secrets.keys()),
                    'instructions': f"Replace the placeholder values with actual secrets for {env_name}"
                }
                with open(secrets_template_path, 'w', encoding='utf-8') as f:
                    yaml.dump(secrets_data, f, default_flow_style=False, indent=2)
        
        logger.info(f"Configurations exported to {output_dir}")
    
    def generate_deployment_script(self, environments: List[str]) -> None:
        """Generate deployment script for different environments"""
        scripts_dir = self.project_path / "scripts"
        scripts_dir.mkdir(exist_ok=True)
        
        script_content = f'''#!/bin/bash
# Multi-environment deployment script

set -e

ENVIRONMENT=$1
PROJECT_NAME="{{{{ project_name }}}}"

if [ -z "$ENVIRONMENT" ]; then
    echo "Usage: $0 <environment>"
    echo "Available environments: {', '.join(environments)}"
    exit 1
fi

case $ENVIRONMENT in
'''
        
        for env in environments:
            script_content += f'''    {env})
        echo "Deploying to {env} environment..."
        # Load environment-specific variables
        source config/.env.{env}
        
        # Deploy using kubectl
        if command -v kubectl &> /dev/null; then
            echo "Applying Kubernetes manifests for {env}..."
            kubectl apply -k k8s/overlays/{env}
        else
            echo "kubectl not found, using Docker Compose..."
            docker-compose -f docker/docker-compose.yml -f docker/docker-compose.{env}.yml up -d
        fi
        ;;
'''
        
        script_content += '''    *)
        echo "Unknown environment: $ENVIRONMENT"
        echo "Available environments: ''' + ', '.join(environments) + '''"
        exit 1
        ;;
esac

echo "Deployment to $ENVIRONMENT completed successfully!"
'''
        
        script_path = scripts_dir / "deploy.sh"
        with open(script_path, 'w', encoding='utf-8') as f:
            f.write(script_content)
        
        # Make script executable
        os.chmod(script_path, 0o755)
        
        logger.info("Generated deployment script")
