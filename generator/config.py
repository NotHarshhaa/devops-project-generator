#!/usr/bin/env python3
"""
Configuration management for DevOps Project Generator - cleaned up with modular validation
"""

import logging
import datetime
from typing import List, Optional, Dict, Any, Set
from dataclasses import dataclass, field
from pathlib import Path
from functools import lru_cache
from enum import Enum

from .utils import ValidationUtils

logger = logging.getLogger(__name__)


class CIOption(Enum):
    """CI/CD platform options"""
    GITHUB_ACTIONS = "github-actions"
    GITLAB_CI = "gitlab-ci"
    JENKINS = "jenkins"
    AZURE_PIPELINES = "azure-pipelines"
    GITLAB_RUNNERS = "gitlab-runners"
    NONE = "none"


class PipelineOption(Enum):
    """Pipeline framework options"""
    NODEJS_TYPESCRIPT = "nodejs-typescript"
    PYTHON = "python"
    JAVA_MAVEN = "java-maven"
    GO = "go"
    DOCKER_MULTISTAGE = "docker-multistage"
    TERRAFORM_MODULE = "terraform-module"
    KUBERNETES_OPERATOR = "kubernetes-operator"
    MICROSERVICE = "microservice"


class InfraOption(Enum):
    """Infrastructure pattern options"""
    AWS_VPC_EKS = "aws-vpc-eks"
    AZURE_VNET_AKS = "azure-vnet-aks"
    GCP_VPC_GKE = "gcp-vpc-gke"
    MULTICLOUD_TERRAFORM = "multicloud-terraform"
    KUBERNETES_ONPREM = "kubernetes-onprem"
    AWS_ECS_FARGATE = "aws-ecs-fargate"
    ANSIBLE_AUTOMATION = "ansible-automation"


class DeployOption(Enum):
    """Deployment strategy options"""
    BLUE_GREEN = "blue-green"
    CANARY = "canary"
    ROLLING = "rolling"
    GITOPS_ARGOCD = "gitops-argocd"
    HELM_CHARTS = "helm-charts"
    KUSTOMIZE = "kustomize"
    SERVERLESS_LAMBDA = "serverless-lambda"


class ObservabilityOption(Enum):
    """Observability stack options"""
    PROMETHEUS_GRAFANA = "prometheus-grafana"
    ELK_STACK = "elk-stack"
    DATADOG = "datadog"
    JAEGER_PROMETHEUS = "jaeger-prometheus"
    CLOUDWATCH = "cloudwatch"
    NEW_RELIC = "new-relic"


class SecurityOption(Enum):
    """Security framework options"""
    NIST_CSF = "nist-csf"
    CIS_BENCHMARKS = "cis-benchmarks"
    ZERO_TRUST = "zero-trust"
    SOC2 = "soc2"
    GDPR = "gdpr"
    HIPAA = "hipaa"


@dataclass
class ProjectConfig:
    """Configuration for DevOps project generation with improved validation"""
    
    project_name: str = "devops-project"
    pipeline: Optional[str] = None
    ci: Optional[str] = None
    infra: Optional[str] = None
    deploy: Optional[str] = None
    envs: Optional[str] = None
    observability: Optional[str] = None
    security: Optional[str] = None
    
    # Valid options (using enums for better type safety)
    VALID_PIPELINE_OPTIONS = [option.value for option in PipelineOption]
    VALID_CI_OPTIONS = [option.value for option in CIOption]
    VALID_INFRA_OPTIONS = [option.value for option in InfraOption]
    VALID_DEPLOY_OPTIONS = [option.value for option in DeployOption]
    VALID_OBS_OPTIONS = [option.value for option in ObservabilityOption]
    VALID_SEC_OPTIONS = [option.value for option in SecurityOption]
    VALID_ENV_OPTIONS = ["single", "dev", "stage", "prod", "dev,stage,prod"]
    DEFAULT_PIPELINE = "python"
    DEFAULT_CI = "github-actions"
    DEFAULT_INFRA = "aws-vpc-eks"
    DEFAULT_DEPLOY = "rolling"
    DEFAULT_ENVS = "single"
    DEFAULT_OBSERVABILITY = "prometheus-grafana"
    DEFAULT_SECURITY = "nist-csf"
    
    def __post_init__(self) -> None:
        """Apply defaults and validate configuration after initialization"""
        self.apply_defaults()
        self.validate()
    
    def apply_defaults(self) -> None:
        """Fill unset options with sensible defaults"""
        if not self.pipeline:
            self.pipeline = self.DEFAULT_PIPELINE
        if not self.ci:
            self.ci = self.DEFAULT_CI
        if not self.infra:
            self.infra = self.DEFAULT_INFRA
        if not self.deploy:
            self.deploy = self.DEFAULT_DEPLOY
        if not self.envs:
            self.envs = self.DEFAULT_ENVS
        if not self.observability:
            self.observability = self.DEFAULT_OBSERVABILITY
        if not self.security:
            self.security = self.DEFAULT_SECURITY
    
    def validate(self) -> bool:
        """Validate configuration using modular validation utilities"""
        errors = []
        
        # Validate project name
        valid_name, name_errors = ValidationUtils.validate_project_name(self.project_name)
        if not valid_name:
            errors.extend([f"Project name: {error}" for error in name_errors])
        
        # Validate optional fields
        if self.pipeline and self.pipeline not in self.VALID_PIPELINE_OPTIONS:
            errors.append(f"Invalid pipeline option: {self.pipeline}")
        
        if self.ci and self.ci not in self.VALID_CI_OPTIONS:
            errors.append(f"Invalid CI option: {self.ci}")
        
        if self.infra and self.infra not in self.VALID_INFRA_OPTIONS:
            errors.append(f"Invalid infrastructure option: {self.infra}")
        
        if self.deploy and self.deploy not in self.VALID_DEPLOY_OPTIONS:
            errors.append(f"Invalid deployment option: {self.deploy}")
        
        if self.envs and not self._is_valid_envs(self.envs):
            errors.append(f"Invalid environment option: {self.envs}")
        
        if self.observability and self.observability not in self.VALID_OBS_OPTIONS:
            errors.append(f"Invalid observability option: {self.observability}")
        
        if self.security and self.security not in self.VALID_SEC_OPTIONS:
            errors.append(f"Invalid security option: {self.security}")
        
        if errors:
            raise ValueError(f"Configuration validation failed:\n" + "\n".join(f"  - {error}" for error in errors))
        
        return True
    
    @staticmethod
    def _is_valid_envs(envs: str) -> bool:
        """Validate environment configuration string"""
        if envs in ProjectConfig.VALID_ENV_OPTIONS:
            return True
        if "," in envs:
            parts = [part.strip() for part in envs.split(",")]
            return all(part in ("dev", "stage", "prod") for part in parts)
        return False
    
    @classmethod
    def from_dict(cls, config_dict: Dict[str, Any]) -> 'ProjectConfig':
        """Create ProjectConfig from dictionary with validation"""
        # Extract known fields
        known_fields = {
            'project_name', 'pipeline', 'ci', 'infra', 'deploy', 
            'envs', 'observability', 'security'
        }
        
        filtered_dict = {k: v for k, v in config_dict.items() if k in known_fields}
        
        return cls(**filtered_dict)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert ProjectConfig to dictionary"""
        return {
            'project_name': self.project_name,
            'pipeline': self.pipeline,
            'ci': self.ci,
            'infra': self.infra,
            'deploy': self.deploy,
            'envs': self.envs,
            'observability': self.observability,
            'security': self.security
        }
    
    def get_template_context(self) -> Dict[str, Any]:
        """Get template context with all configuration variables"""
        context: Dict[str, Any] = {
            'project_name': self.project_name,
            'pipeline': self.pipeline or self.DEFAULT_PIPELINE,
            'ci': self.ci or self.DEFAULT_CI,
            'infra': self.infra or self.DEFAULT_INFRA,
            'deploy': self.deploy or self.DEFAULT_DEPLOY,
            'envs': self.envs or self.DEFAULT_ENVS,
            'observability': self.observability or self.DEFAULT_OBSERVABILITY,
            'security': self.security or self.DEFAULT_SECURITY,
            'generated_at': datetime.datetime.now().isoformat(),
            'generator_version': '2.0.0'
        }
        
        # Add derived values
        context.update({
            'ci_enabled': self.ci != 'none',
            'infra_enabled': self.infra is not None,
            'multi_env': self.envs != 'single',
            'monitoring_enabled': bool(self.observability),
            'security_enabled': bool(self.security)
        })
        
        return context
    
    def get_cloud_provider(self) -> str:
        """Get cloud provider based on infrastructure choice"""
        infra_mapping = {
            'aws-vpc-eks': 'aws',
            'aws-ecs-fargate': 'aws',
            'azure-vnet-aks': 'azure',
            'gcp-vpc-gke': 'gcp',
            'multicloud-terraform': 'multi'
        }
        infra_name = self.infra or ''
        return infra_mapping.get(infra_name, 'aws')
    
    def get_ci_platform(self) -> str:
        """Get CI platform name"""
        return self.ci or 'github-actions'
    
    def get_deploy_strategy(self) -> str:
        """Get deployment strategy"""
        return self.deploy or self.DEFAULT_DEPLOY
    
    def has_monitoring(self) -> bool:
        """Check if monitoring is configured"""
        return bool(self.observability)
    
    def has_security_compliance(self) -> bool:
        """Check if security compliance is configured"""
        return bool(self.security)
    
    def is_multi_environment(self) -> bool:
        """Check if multi-environment setup"""
        return self.envs in ['dev,stage,prod']
    
    def get_environments(self) -> List[str]:
        """Get list of environments"""
        if self.envs == 'single':
            return ['development']
        elif self.envs == 'dev,stage,prod':
            return ['development', 'staging', 'production']
        else:
            return [self.envs] if self.envs else ['development']


@dataclass
class TemplateConfig:
    """Template configuration with improved caching"""
    
    template_dir: Optional[Path] = None
    custom_templates: Dict[str, str] = field(default_factory=dict)
    template_cache: Dict[str, Any] = field(default_factory=dict)
    
    def __post_init__(self) -> None:
        """Initialize template directory"""
        if self.template_dir is None:
            self.template_dir = Path(__file__).parent.parent / "templates"
    
    @property
    def dir(self) -> Path:
        """Get guaranteed Path for template directory"""
        if self.template_dir is None:
            self.template_dir = Path(__file__).parent.parent / "templates"
        return self.template_dir
    
    def get_template_path(self, template_name: str) -> Path:
        """Get full template path"""
        return self.dir / template_name
    
    def template_exists(self, template_name: str) -> bool:
        """Check if template exists"""
        return self.get_template_path(template_name).exists()
    
    def add_custom_template(self, name: str, content: str) -> None:
        """Add custom template"""
        self.custom_templates[name] = content
    
    def get_custom_template(self, name: str) -> Optional[str]:
        """Get custom template content"""
        return self.custom_templates.get(name)
    
    def list_available_templates(self) -> List[str]:
        """List all available templates"""
        templates = []
        
        template_dir = self.dir
        if template_dir.exists():
            templates.extend([
                f.name for f in template_dir.rglob("*.j2")
                if f.is_file()
            ])
        
        templates.extend(self.custom_templates.keys())
        return sorted(set(templates))
    
    def clear_cache(self) -> None:
        """Clear template cache"""
        self.template_cache.clear()


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


# Utility functions for configuration management
def validate_config_dict(config_dict: Dict[str, Any]) -> tuple[bool, List[str]]:
    """Validate configuration dictionary"""
    try:
        ProjectConfig.from_dict(config_dict)
        return True, []
    except ValueError as e:
        return False, [str(e)]


def get_default_config() -> ProjectConfig:
    """Get default project configuration"""
    return ProjectConfig(
        project_name="my-devops-project",
        pipeline=ProjectConfig.DEFAULT_PIPELINE,
        ci=ProjectConfig.DEFAULT_CI,
        infra=ProjectConfig.DEFAULT_INFRA,
        deploy=ProjectConfig.DEFAULT_DEPLOY,
        envs=ProjectConfig.DEFAULT_ENVS,
        observability=ProjectConfig.DEFAULT_OBSERVABILITY,
        security=ProjectConfig.DEFAULT_SECURITY,
    )


def create_config_from_options(
    project_name: str,
    ci: Optional[str] = None,
    infra: Optional[str] = None,
    deploy: Optional[str] = None,
    envs: Optional[str] = None,
    observability: Optional[str] = None,
    security: Optional[str] = None
) -> ProjectConfig:
    """Create configuration from individual options"""
    return ProjectConfig(
        project_name=project_name,
        ci=ci,
        infra=infra,
        deploy=deploy,
        envs=envs,
        observability=observability,
        security=security
    )
