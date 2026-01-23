"""
Configuration management for DevOps Project Generator
"""

from typing import List, Optional, Dict, Any
from dataclasses import dataclass, field
from pathlib import Path
from functools import lru_cache


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
    
    def validate(self) -> bool:
        """Validate configuration options with improved error checking"""
        validators = [
            (self.ci, self.VALID_CI_OPTIONS, "CI/CD platform"),
            (self.infra, self.VALID_INFRA_OPTIONS, "Infrastructure tool"),
            (self.deploy, self.VALID_DEPLOY_OPTIONS, "Deployment method"),
            (self.observability, self.VALID_OBS_OPTIONS, "Observability level"),
            (self.security, self.VALID_SEC_OPTIONS, "Security level"),
        ]
        
        for value, valid_options, option_name in validators:
            if value and value not in valid_options:
                return False
        return True
    
    def get_environments(self) -> List[str]:
        """Parse environments string into list"""
        if not self.envs:
            return ["production"]
        
        envs = [env.strip() for env in self.envs.split(",")]
        if self.envs == "single":
            return ["production"]
        return envs
    
    def has_ci(self) -> bool:
        """Check if CI/CD is enabled"""
        return self.ci and self.ci != "none"
    
    def has_infra(self) -> bool:
        """Check if infrastructure is enabled"""
        return self.infra and self.infra != "none"
    
    def has_docker(self) -> bool:
        """Check if Docker is used"""
        return self.deploy in ["docker", "kubernetes"]
    
    def has_kubernetes(self) -> bool:
        """Check if Kubernetes is used"""
        return self.deploy == "kubernetes"
    
    def has_metrics(self) -> bool:
        """Check if metrics are enabled"""
        return self.observability in ["logs-metrics", "full"]
    
    def has_alerts(self) -> bool:
        """Check if alerts are enabled"""
        return self.observability == "full"
    
    def get_security_level(self) -> str:
        """Get security level"""
        return self.security or "basic"
    
    def get_template_context(self) -> Dict[str, Any]:
        """Get template context for Jinja2 with caching"""
        if self._template_context is None:
            self._template_context = {
                "project_name": self.project_name,
                "ci": self.ci,
                "infra": self.infra,
                "deploy": self.deploy,
                "environments": self.get_environments(),
                "observability": self.observability,
                "security": self.get_security_level(),
                "has_ci": self.has_ci(),
                "has_infra": self.has_infra(),
                "has_docker": self.has_docker(),
                "has_kubernetes": self.has_kubernetes(),
                "has_metrics": self.has_metrics(),
                "has_alerts": self.has_alerts(),
                "is_multi_env": len(self.get_environments()) > 1,
            }
        return self._template_context


@dataclass
class TemplateConfig:
    """Template configuration"""
    
    template_dir: Path = field(default_factory=lambda: Path(__file__).parent / "templates")
    
    def get_template_path(self, category: str, template_name: str) -> Path:
        """Get full template path"""
        return self.template_dir / category / template_name
    
    def list_templates(self, category: str) -> List[str]:
        """List available templates in a category"""
        category_path = self.template_dir / category
        if not category_path.exists():
            return []
        
        return [f.name for f in category_path.iterdir() if f.is_file()]
