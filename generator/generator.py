"""
Core DevOps project generator
"""

import os
import shutil
import time
import gc
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional, Set
from concurrent.futures import ThreadPoolExecutor, as_completed, Future
from functools import lru_cache
from jinja2 import Environment, FileSystemLoader, select_autoescape, TemplateNotFound
from rich.console import Console

from .config import ProjectConfig, TemplateConfig

logger = logging.getLogger(__name__)
console = Console()


class DevOpsProjectGenerator:
    """Main DevOps project generator class"""
    
    def __init__(self, config: ProjectConfig, output_dir: str = "."):
        self.config = config
        self.output_dir = Path(output_dir)
        self.template_config = TemplateConfig()
        self.project_path = self.output_dir / config.project_name
        self._start_time = time.time()
        
        # Performance tracking
        self._template_cache: Dict[str, Any] = {}
        self._rendered_files: Set[Path] = set()
        
        # Setup optimized Jinja2 environment with caching
        template_path = Path(__file__).parent.parent / "templates"
        self.jinja_env = Environment(
            loader=FileSystemLoader(str(template_path)),
            autoescape=select_autoescape(["html", "xml"]),
            trim_blocks=True,
            lstrip_blocks=True,
            cache_size=200,  # Increased cache size for better performance
            auto_reload=False,  # Disable auto-reload for performance
            enable_async=False,  # Disable async for simplicity
        )
        
        # Pre-load commonly used templates
        self._preload_templates()
    
    def _preload_templates(self) -> None:
        """Pre-load commonly used templates for better performance"""
        common_templates = [
            "README.md.j2",
            "Makefile.j2", 
            "gitignore.j2",
            "app/sample-app/main.py.j2",
            "ci/pipelines/github-actions.yml.j2",
            "ci/pipelines/gitlab-ci.yml.j2",
            "infra/terraform/main.tf.j2",
            "containers/Dockerfile.j2",
            "k8s/deployment.yaml.j2",
            "monitoring/prometheus.yml.j2",
            "security/scan.yml.j2"
        ]
        
        for template_name in common_templates:
            try:
                template_path = Path(__file__).parent.parent / "templates" / template_name
                if template_path.exists():
                    self.jinja_env.get_template(template_name)
                    logger.debug(f"Preloaded template: {template_name}")
            except TemplateNotFound:
                logger.debug(f"Template not found for preloading: {template_name}")
            except Exception as e:
                logger.warning(f"Error preloading template {template_name}: {str(e)}")
    
    def _get_template_context(self) -> Dict[str, Any]:
        """Get template context"""
        return self.config.get_template_context()
    
    def _render_template(self, template_path: str) -> str:
        """Render a template with caching and error handling"""
        # Check cache first
        if template_path in self._template_cache:
            cached_template = self._template_cache[template_path]
            logger.debug(f"Using cached template: {template_path}")
            return cached_template
        
        try:
            template = self.jinja_env.get_template(template_path)
            context = self._get_template_context()
            rendered = template.render(**context)
            
            # Cache the result
            self._template_cache[template_path] = rendered
            logger.debug(f"Rendered and cached template: {template_path}")
            
            return rendered
        except TemplateNotFound:
            logger.error(f"Template not found: {template_path}")
            raise
        except Exception as e:
            logger.error(f"Error rendering template {template_path}: {str(e)}")
            raise
    
    def _create_project_structure(self) -> None:
        """Create the basic project directory structure with batch operations"""
        logger.info("Creating project structure")
        
        # Define all directories to create
        directories = [
            "app",
            "app/sample-app",
            "ci",
            "ci/pipelines", 
            "infra",
            "infra/environments",
            "infra/modules",
            "deploy",
            "containers",
            "k8s",
            "k8s/base",
            "k8s/overlays",
            "monitoring",
            "monitoring/logs",
            "monitoring/metrics",
            "monitoring/alerts",
            "security",
            "security/policies",
            "security/scanning",
            "scripts",
            "docs",
            "tests"
        ]
        
        # Batch create directories
        created_dirs = []
        try:
            for dir_path in directories:
                full_path = self.project_path / dir_path
                if not full_path.exists():
                    full_path.mkdir(parents=True, exist_ok=True)
                    created_dirs.append(full_path)
            
            logger.info(f"Created {len(created_dirs)} directories")
            console.print(f"🏗️  Created {len(created_dirs)} directories")
            
        except Exception as e:
            logger.error(f"Error creating directories: {str(e)}")
            # Clean up created directories on error
            for dir_path in created_dirs:
                try:
                    if dir_path.exists():
                        shutil.rmtree(dir_path)
                except:
                    pass
            raise
    
    def _generate_component_files(self, component: str, templates: List[str]) -> List[Path]:
        """Generate files for a specific component"""
        generated_files = []
        
        for template_path in templates:
            try:
                # Convert template path to output path
                output_path = self.project_path / template_path.replace('.j2', '')
                
                # Create parent directory if needed
                output_path.parent.mkdir(parents=True, exist_ok=True)
                
                # Render template
                content = self._render_template(template_path)
                
                # Write file
                with open(output_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                generated_files.append(output_path)
                self._rendered_files.add(output_path)
                logger.debug(f"Generated file: {output_path}")
                
            except Exception as e:
                logger.error(f"Error generating {component} file {template_path}: {str(e)}")
                console.print(f"[yellow]⚠️  Skipped {template_path}: {str(e)}[/yellow]")
                continue
        
        return generated_files
    
    def _set_file_permissions(self) -> None:
        """Set appropriate file permissions for scripts and executables"""
        script_extensions = ['.sh', '.py', '.bat']
        
        for file_path in self._rendered_files:
            if file_path.suffix in script_extensions:
                try:
                    # Make script executable
                    current_permissions = file_path.stat().st_mode
                    file_path.chmod(current_permissions | 0o755)
                    logger.debug(f"Set executable permissions for: {file_path}")
                except Exception as e:
                    logger.warning(f"Could not set permissions for {file_path}: {str(e)}")
    
    def generate(self) -> None:
        """Generate the complete DevOps project with optimized performance"""
        logger.info(f"Starting project generation for {self.config.project_name}")
        
        try:
            # Create project structure
            self._create_project_structure()
            
            # Generate components concurrently
            with ThreadPoolExecutor(max_workers=4) as executor:
                # Submit component generation tasks
                futures = {}
                
                # CI/CD component
                if self.config.ci and self.config.ci != "none":
                    ci_templates = self.template_config.get_ci_templates(self.config.ci)
                    futures["ci"] = executor.submit(self._generate_component_files, "CI/CD", ci_templates)
                
                # Infrastructure component
                if self.config.infra and self.config.infra != "none":
                    infra_templates = self.template_config.get_infra_templates(self.config.infra)
                    futures["infra"] = executor.submit(self._generate_component_files, "Infrastructure", infra_templates)
                
                # Deployment component
                deploy_templates = self.template_config.get_deploy_templates(self.config.deploy)
                futures["deploy"] = executor.submit(self._generate_component_files, "Deployment", deploy_templates)
                
                # Monitoring component
                obs_templates = self.template_config.get_observability_templates(self.config.observability)
                futures["monitoring"] = executor.submit(self._generate_component_files, "Monitoring", obs_templates)
                
                # Security component
                sec_templates = self.template_config.get_security_templates(self.config.security)
                futures["security"] = executor.submit(self._generate_component_files, "Security", sec_templates)
                
                # Base files (always generated)
                base_templates = self.template_config.get_base_templates()
                futures["base"] = executor.submit(self._generate_component_files, "Base", base_templates)
                
                # Collect results with progress indication
                completed_components = []
                for component, future in futures.items():
                    try:
                        files = future.result(timeout=30)  # 30 second timeout per component
                        completed_components.append((component, files))
                        console.print(f"✅ {component.title()} generated ({len(files)} files)")
                    except Exception as e:
                        logger.error(f"Error in {component} generation: {str(e)}")
                        console.print(f"[red]❌ {component.title()} failed: {str(e)}[/red]")
            
            # Set file permissions
            self._set_file_permissions()
            
            # Performance cleanup
            gc.collect()  # Force garbage collection
            
            # Report completion
            elapsed_time = time.time() - self._start_time
            logger.info(f"Project generation completed in {elapsed_time:.2f}s")
            console.print(f"✅ Project generation completed in {elapsed_time:.2f}s!")
            
        except Exception as e:
            logger.error(f"Project generation failed: {str(e)}", exc_info=True)
            
            # Clean up on failure
            if self.project_path.exists():
                try:
                    shutil.rmtree(self.project_path)
                    logger.info("Cleaned up failed project generation")
                except:
                    pass
            
            raise
