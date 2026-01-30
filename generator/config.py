"""
Configuration management for DevOps Project Generator
"""

import re
import logging
import datetime
from typing import List, Optional, Dict, Any, Set
from dataclasses import dataclass, field
from pathlib import Path
from functools import lru_cache
from enum import Enum

logger = logging.getLogger(__name__)


class CIOption(Enum):
    """CI/CD platform options"""
    GITHUB_ACTIONS = "github-actions"
    GITLAB_CI = "gitlab-ci"
    JENKINS = "jenkins"
    NONE = "none"


class InfraOption(Enum):
    """Infrastructure tool options"""
    TERRAFORM = "terraform"
    CLOUDFORMATION = "cloudformation"
    NONE = "none"


class DeployOption(Enum):
    """Deployment method options"""
    VM = "vm"
    DOCKER = "docker"
    KUBERNETES = "kubernetes"


class ObservabilityOption(Enum):
    """Observability level options"""
    LOGS = "logs"
    LOGS_METRICS = "logs-metrics"
    FULL = "full"


class SecurityOption(Enum):
    """Security level options"""
    BASIC = "basic"
    STANDARD = "standard"
    STRICT = "strict"


@dataclass
class ProjectConfig:
    """Configuration for DevOps project generation"""
    
    ci: Optional[str] = None
    infra: Optional[str] = None
    deploy: Optional[str] = None
    envs: Optional[str] = None
    observability: Optional[str] = None
    security: Optional[str] = None
    project_name: str = "devops-project"
    
    # Valid options (using enums for better type safety)
    VALID_CI_OPTIONS = [option.value for option in CIOption]
    VALID_INFRA_OPTIONS = [option.value for option in InfraOption]
    VALID_DEPLOY_OPTIONS = [option.value for option in DeployOption]
    VALID_OBS_OPTIONS = [option.value for option in ObservabilityOption]
    VALID_SEC_OPTIONS = [option.value for option in SecurityOption]
    
    # Reserved system names (class-level constant)
    RESERVED_NAMES = {
        'con', 'prn', 'aux', 'nul', 'com1', 'com2', 'com3', 'com4', 'com5',
        'com6', 'com7', 'com8', 'com9', 'lpt1', 'lpt2', 'lpt3', 'lpt4',
        'lpt5', 'lpt6', 'lpt7', 'lpt8', 'lpt9'
    }
    
    # Cache for template context and computed values
    _template_context: Optional[Dict[str, Any]] = None
    _environments_cache: Optional[List[str]] = None
    
    def __post_init__(self):
        """Validate and sanitize configuration after initialization"""
        # Sanitize project name
        self.project_name = self._sanitize_project_name(self.project_name)
        
        # Validate and normalize other fields
        if self.ci:
            self.ci = self._normalize_option(self.ci, self.VALID_CI_OPTIONS, "CI/CD")
        if self.infra:
            self.infra = self._normalize_option(self.infra, self.VALID_INFRA_OPTIONS, "Infrastructure")
        if self.deploy:
            self.deploy = self._normalize_option(self.deploy, self.VALID_DEPLOY_OPTIONS, "Deployment")
        if self.observability:
            self.observability = self._normalize_option(self.observability, self.VALID_OBS_OPTIONS, "Observability")
        if self.security:
            self.security = self._normalize_option(self.security, self.VALID_SEC_OPTIONS, "Security")
        if self.envs:
            self.envs = self._sanitize_environments(self.envs)
    
    def _sanitize_project_name(self, name: str) -> str:
        """Sanitize and validate project name"""
        if not name:
            raise ValueError("Project name cannot be empty")
        
        # Remove invalid characters
        sanitized = re.sub(r'[^\w\-_.]', '', str(name).strip())
        
        if not sanitized:
            raise ValueError("Project name contains no valid characters")
        
        if len(sanitized) > 50:
            raise ValueError("Project name too long (max 50 characters)")
        
        if sanitized[0] in ('-', '.', '_'):
            sanitized = sanitized[1:]
        
        if not sanitized:
            raise ValueError("Invalid project name format")
        
        # Ensure it doesn't conflict with system names
        if sanitized.lower() in self.RESERVED_NAMES:
            raise ValueError(f"Project name '{sanitized}' is reserved")
        
        return sanitized
    
    def _normalize_option(self, value: str, valid_options: List[str], option_type: str) -> str:
        """Normalize and validate option value"""
        if not value:
            return value
        
        normalized = str(value).strip().lower()
        
        # Handle common variations
        if normalized in valid_options:
            return normalized
        
        # Handle common aliases
        aliases = {
            "github": "github-actions",
            "gitlab": "gitlab-ci",
            "tf": "terraform",
            "cf": "cloudformation",
            "k8s": "kubernetes",
            "kube": "kubernetes",
            "vm": "vm",
            "virtual-machine": "vm",
            "log": "logs",
            "metrics": "logs-metrics",
            "monitoring": "full",
            "basic": "basic",
            "standard": "standard",
            "strict": "strict",
        }
        
        if normalized in aliases:
            normalized = aliases[normalized]
        
        if normalized not in valid_options:
            raise ValueError(f"Invalid {option_type} option: {value}. Valid options: {', '.join(valid_options)}")
        
        return normalized
    
    def _sanitize_environments(self, envs: str) -> str:
        """Sanitize and validate environments string"""
        if not envs:
            return "single"
        
        envs = str(envs).strip().lower()
        
        # Handle special cases
        if envs == "single":
            return "single"
        
        # Parse comma-separated environments
        env_list = [env.strip() for env in envs.split(",") if env.strip()]
        
        if not env_list:
            return "single"
        
        # Validate each environment
        valid_envs = ["dev", "development", "stage", "staging", "prod", "production", "test", "qa"]
        normalized_envs = []
        
        for env in env_list:
            if env in valid_envs:
                # Normalize to standard names
                if env in ["development"]:
                    normalized_envs.append("dev")
                elif env in ["staging"]:
                    normalized_envs.append("stage")
                elif env in ["production"]:
                    normalized_envs.append("prod")
                else:
                    normalized_envs.append(env)
            else:
                # Allow custom environment names but validate format
                if not re.match(r'^[a-zA-Z][a-zA-Z0-9_-]*$', env):
                    raise ValueError(f"Invalid environment name: {env}")
                normalized_envs.append(env)
        
        # Remove duplicates while preserving order
        seen = set()
        unique_envs = []
        for env in normalized_envs:
            if env not in seen:
                seen.add(env)
                unique_envs.append(env)
        
        return ",".join(unique_envs)
    
    def validate(self) -> bool:
        """Validate configuration with detailed error reporting"""
        try:
            # Validate project name
            self._sanitize_project_name(self.project_name)
            
            # Validate each option
            validators = [
                (self.ci, self.VALID_CI_OPTIONS, "CI/CD platform"),
                (self.infra, self.VALID_INFRA_OPTIONS, "Infrastructure tool"),
                (self.deploy, self.VALID_DEPLOY_OPTIONS, "Deployment method"),
                (self.observability, self.VALID_OBS_OPTIONS, "Observability level"),
                (self.security, self.VALID_SEC_OPTIONS, "Security level"),
            ]
            
            for value, valid_options, option_name in validators:
                if value and value not in valid_options:
                    logger.error(f"Invalid {option_name}: {value}")
                    return False
            
            # Validate environments
            if self.envs:
                self._sanitize_environments(self.envs)
            
            return True
            
        except (ValueError, AttributeError, TypeError) as e:
            logger.error(f"Configuration validation failed: {str(e)}")
            return False
    
    def get_environments(self) -> List[str]:
        """Parse environments string into list with validation and caching"""
        if self._environments_cache is not None:
            return self._environments_cache
            
        if not self.envs or self.envs == "single":
            self._environments_cache = ["dev"]
            return self._environments_cache
        
        try:
            envs = self._sanitize_environments(self.envs)
            env_list = [env.strip() for env in envs.split(",") if env.strip()]
            if not env_list:
                logger.warning("No valid environments found, defaulting to 'dev'")
                env_list = ["dev"]
            self._environments_cache = env_list
            return env_list
        except (AttributeError, ValueError) as e:
            logger.warning(f"Error parsing environments: {str(e)}, defaulting to 'dev'")
            self._environments_cache = ["dev"]
            return self._environments_cache
    
    def get_template_context(self) -> Dict[str, Any]:
        """Get template context with caching and validation"""
        if self._template_context is None:
            environments = self.get_environments()
            self._template_context = {
                "project_name": self.project_name,
                "project_name_upper": self.project_name.upper(),
                "project_name_slug": self.project_name.lower().replace("_", "-"),
                "project_name_snake": self.project_name.lower().replace("-", "_"),
                "environments": environments,
                "ci": self.ci,
                "infra": self.infra,
                "deploy": self.deploy,
                "observability": self.observability,
                "security": self.security,
                "has_ci": self.ci and self.ci != "none",
                "has_infra": self.infra and self.infra != "none",
                "has_docker": self.deploy in ["docker", "kubernetes"],
                "has_kubernetes": self.deploy == "kubernetes",
                "env_count": len(environments),
                "is_multi_env": len(environments) > 1,
                "primary_env": environments[0] if environments else "dev",
                "generated_at": datetime.datetime.now().isoformat(),
                "generator_version": "1.4.0",
            }
        return self._template_context
    
    def has_ci(self) -> bool:
        """Check if CI/CD is configured"""
        return self.ci and self.ci != "none"
    
    def has_infra(self) -> bool:
        """Check if infrastructure is configured"""
        return self.infra and self.infra != "none"
    
    def has_docker(self) -> bool:
        """Check if Docker is configured"""
        return self.deploy in ["docker", "kubernetes"]
    
    def has_metrics(self) -> bool:
        """Check if metrics are enabled"""
        return self.observability in ["logs-metrics", "full"]
    
    def has_alerts(self) -> bool:
        """Check if alerts are enabled"""
        return self.observability == "full"
    
    def get_security_level(self) -> str:
        """Get security level with fallback"""
        return self.security or "basic"
    
    def get_primary_environment(self) -> str:
        """Get the primary environment"""
        environments = self.get_environments()
        return environments[0] if environments else "dev"
    
    def is_production_ready(self) -> bool:
        """Check if project is production-ready based on configuration"""
        return (
            self.has_ci() and
            self.has_infra() and
            self.deploy in ["docker", "kubernetes"] and
            self.observability in ["logs-metrics", "full"] and
            self.security in ["standard", "strict"]
        )


@dataclass
class TemplateConfig:
    """Template configuration management with improved caching and error handling"""
    
    def __init__(self):
        self.template_path = Path(__file__).parent.parent / "templates"
        self._template_cache: Dict[str, List[str]] = {}
        self._validated_paths: Set[Path] = set()
        
        # Validate template directory exists
        if not self.template_path.exists():
            logger.warning(f"Template directory not found: {self.template_path}")
            self.template_path.mkdir(parents=True, exist_ok=True)
            logger.info(f"Created template directory: {self.template_path}")
    
    def _validate_template_path(self, component_path: Path) -> bool:
        """Validate template directory exists and is accessible"""
        if component_path in self._validated_paths:
            return True
            
        if not component_path.exists():
            logger.debug(f"Template component directory not found: {component_path}")
            return False
            
        if not component_path.is_dir():
            logger.warning(f"Template path is not a directory: {component_path}")
            return False
            
        self._validated_paths.add(component_path)
        return True
    
    def _get_templates_for_component(self, component: str, option: str) -> List[str]:
        """Get templates for a specific component and option with improved caching"""
        cache_key = f"{component}_{option}"
        
        if cache_key in self._template_cache:
            return self._template_cache[cache_key]
        
        templates = []
        component_path = self.template_path / component
        
        if not self._validate_template_path(component_path):
            logger.debug(f"No templates found for component: {component}")
            self._template_cache[cache_key] = templates
            return templates
        
        try:
            # Look for templates specific to the option
            option_templates = list(component_path.glob(f"*{option}*.j2"))
            for template in option_templates:
                template_str = str(template.relative_to(self.template_path)).replace('\\', '/')
                templates.append(template_str)
                logger.debug(f"Found option-specific template: {template_str}")
            
            # Look for generic templates (avoid duplicates)
            generic_templates = list(component_path.glob("*.j2"))
            for template in generic_templates:
                template_str = str(template.relative_to(self.template_path)).replace('\\', '/')
                if template_str not in templates:
                    templates.append(template_str)
                    logger.debug(f"Found generic template: {template_str}")
            
            # Sort templates for consistent ordering
            templates.sort()
            
        except Exception as e:
            logger.error(f"Error scanning templates for {component}/{option}: {str(e)}")
        
        self._template_cache[cache_key] = templates
        logger.debug(f"Cached {len(templates)} templates for {component}/{option}")
        return templates
    
    def get_ci_templates(self, ci_option: str) -> List[str]:
        """Get CI/CD templates with validation"""
        if not ci_option:
            return []
        return self._get_templates_for_component("ci", ci_option)
    
    def get_infra_templates(self, infra_option: str) -> List[str]:
        """Get infrastructure templates with validation"""
        if not infra_option:
            return []
        return self._get_templates_for_component("infra", infra_option)
    
    def get_deploy_templates(self, deploy_option: str) -> List[str]:
        """Get deployment templates with validation"""
        if not deploy_option:
            return []
        return self._get_templates_for_component("deploy", deploy_option)
    
    def get_observability_templates(self, obs_option: str) -> List[str]:
        """Get observability templates with validation"""
        if not obs_option:
            return []
        return self._get_templates_for_component("monitoring", obs_option)
    
    def get_security_templates(self, sec_option: str) -> List[str]:
        """Get security templates with validation"""
        if not sec_option:
            return []
        return self._get_templates_for_component("security", sec_option)
    
    def get_base_templates(self) -> List[str]:
        """Get base templates (always included) with validation"""
        base_templates = [
            "README.md.j2",
            "Makefile.j2",
            "gitignore.j2",
            "app/sample-app/main.py.j2",
            "app/sample-app/requirements.txt.j2",
            "scripts/setup.sh.j2",
            "scripts/deploy.sh.j2",
        ]
        
        # Filter to only existing templates
        existing_templates = []
        for template in base_templates:
            template_path = self.template_path / template
            if template_path.exists() and template_path.is_file():
                existing_templates.append(template)
                logger.debug(f"Found base template: {template}")
            else:
                logger.debug(f"Base template not found: {template}")
        
        logger.info(f"Found {len(existing_templates)} base templates out of {len(base_templates)} requested")
        return existing_templates
    
    def clear_cache(self) -> None:
        """Clear template cache (useful for development)"""
        self._template_cache.clear()
        self._validated_paths.clear()
        logger.info("Template cache cleared")
    
    def get_template_stats(self) -> Dict[str, Any]:
        """Get statistics about available templates"""
        stats = {
            "total_templates": 0,
            "components": {},
            "base_templates": len(self.get_base_templates())
        }
        
        components = ["ci", "infra", "deploy", "monitoring", "security"]
        for component in components:
            component_path = self.template_path / component
            if component_path.exists():
                templates = list(component_path.glob("*.j2"))
                stats["components"][component] = len(templates)
                stats["total_templates"] += len(templates)
        
        return stats
