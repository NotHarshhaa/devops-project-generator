"""
Configuration management for DevOps Project Generator
"""

import re
import logging
import datetime
from typing import List, Optional, Dict, Any
from dataclasses import dataclass, field
from pathlib import Path
from functools import lru_cache

logger = logging.getLogger(__name__)


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
    
    # Valid options (class-level constants for better performance)
    VALID_CI_OPTIONS = ["github-actions", "gitlab-ci", "jenkins", "none"]
    VALID_INFRA_OPTIONS = ["terraform", "cloudformation", "none"]
    VALID_DEPLOY_OPTIONS = ["vm", "docker", "kubernetes"]
    VALID_OBS_OPTIONS = ["logs", "logs-metrics", "full"]
    VALID_SEC_OPTIONS = ["basic", "standard", "strict"]
    
    # Cache for template context
    _template_context: Optional[Dict[str, Any]] = None
    
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
        reserved_names = ['con', 'prn', 'aux', 'nul', 'com1', 'com2', 'com3', 'com4', 'com5', 
                         'com6', 'com7', 'com8', 'com9', 'lpt1', 'lpt2', 'lpt3', 'lpt4', 
                         'lpt5', 'lpt6', 'lpt7', 'lpt8', 'lpt9']
        
        if sanitized.lower() in reserved_names:
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
            
        except Exception as e:
            logger.error(f"Configuration validation failed: {str(e)}")
            return False
    
    def get_environments(self) -> List[str]:
        """Parse environments string into list with validation"""
        if not self.envs or self.envs == "single":
            return ["dev"]
        
        try:
            envs = self._sanitize_environments(self.envs)
            return [env.strip() for env in envs.split(",") if env.strip()]
        except Exception as e:
            logger.warning(f"Error parsing environments: {str(e)}")
            return ["dev"]
    
    def get_template_context(self) -> Dict[str, Any]:
        """Get template context with caching and validation"""
        if self._template_context is None:
            self._template_context = {
                "project_name": self.project_name,
                "project_name_upper": self.project_name.upper(),
                "project_name_slug": self.project_name.lower().replace("_", "-"),
                "environments": self.get_environments(),
                "ci": self.ci,
                "infra": self.infra,
                "deploy": self.deploy,
                "observability": self.observability,
                "security": self.security,
                "has_ci": self.ci and self.ci != "none",
                "has_infra": self.infra and self.infra != "none",
                "has_docker": self.deploy in ["docker", "kubernetes"],
                "has_kubernetes": self.deploy == "kubernetes",
                "env_count": len(self.get_environments()),
                "is_multi_env": len(self.get_environments()) > 1,
                "generated_at": datetime.datetime.now().isoformat(),
                "generator_version": "1.3.0",
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
    
    def has_kubernetes(self) -> bool:
        """Check if Kubernetes is configured"""
        return self.deploy == "kubernetes"


@dataclass
class TemplateConfig:
    """Template configuration management"""
    
    def __init__(self):
        self.template_path = Path(__file__).parent.parent / "templates"
        self._template_cache: Dict[str, List[str]] = {}
    
    def _get_templates_for_component(self, component: str, option: str) -> List[str]:
        """Get templates for a specific component and option"""
        cache_key = f"{component}_{option}"
        
        if cache_key in self._template_cache:
            return self._template_cache[cache_key]
        
        templates = []
        component_path = self.template_path / component
        
        if component_path.exists():
            # Look for templates specific to the option
            option_templates = list(component_path.glob(f"*{option}*.j2"))
            templates.extend([str(t.relative_to(self.template_path)) for t in option_templates])
            
            # Look for generic templates
            generic_templates = list(component_path.glob("*.j2"))
            for template in generic_templates:
                template_str = str(template.relative_to(self.template_path))
                if template_str not in templates:
                    templates.append(template_str)
        
        self._template_cache[cache_key] = templates
        return templates
    
    def get_ci_templates(self, ci_option: str) -> List[str]:
        """Get CI/CD templates"""
        return self._get_templates_for_component("ci", ci_option)
    
    def get_infra_templates(self, infra_option: str) -> List[str]:
        """Get infrastructure templates"""
        return self._get_templates_for_component("infra", infra_option)
    
    def get_deploy_templates(self, deploy_option: str) -> List[str]:
        """Get deployment templates"""
        return self._get_templates_for_component("deploy", deploy_option)
    
    def get_observability_templates(self, obs_option: str) -> List[str]:
        """Get observability templates"""
        return self._get_templates_for_component("monitoring", obs_option)
    
    def get_security_templates(self, sec_option: str) -> List[str]:
        """Get security templates"""
        return self._get_templates_for_component("security", sec_option)
    
    def get_base_templates(self) -> List[str]:
        """Get base templates (always included)"""
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
            if (self.template_path / template).exists():
                existing_templates.append(template)
        
        return existing_templates
