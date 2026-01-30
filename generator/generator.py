"""
Core DevOps project generator
"""

import os
import shutil
import time
import gc
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional, Set, Tuple
from concurrent.futures import ThreadPoolExecutor, as_completed, Future
from functools import lru_cache
from contextlib import contextmanager
from jinja2 import Environment, FileSystemLoader, select_autoescape, TemplateNotFound, TemplateSyntaxError
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
            "app/sample-app/requirements.txt.j2",
            "scripts/setup.sh.j2",
            "scripts/deploy.sh.j2"
        ]
        
        # Only preload templates that actually exist
        preloaded_count = 0
        for template_name in common_templates:
            try:
                template_path = Path(__file__).parent.parent / "templates" / template_name
                if template_path.exists() and template_path.is_file():
                    self.jinja_env.get_template(template_name)
                    preloaded_count += 1
                    logger.debug(f"Preloaded template: {template_name}")
                else:
                    logger.debug(f"Template not found for preloading: {template_name}")
            except TemplateNotFound:
                logger.debug(f"Template not found for preloading: {template_name}")
            except Exception as e:
                logger.warning(f"Error preloading template {template_name}: {str(e)}")
        
        logger.info(f"Preloaded {preloaded_count} templates")
    
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
            
            # Validate rendered content
            if not rendered.strip():
                logger.warning(f"Template rendered empty content: {template_path}")
            
            # Cache the result
            self._template_cache[template_path] = rendered
            logger.debug(f"Rendered and cached template: {template_path}")
            
            return rendered
        except TemplateNotFound as e:
            logger.error(f"Template not found: {template_path} - {str(e)}")
            raise
        except TemplateSyntaxError as e:
            logger.error(f"Template syntax error in {template_path}: {str(e)}")
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
        
        # Batch create directories with better error handling
        created_dirs = []
        failed_dirs = []
        
        try:
            for dir_path in directories:
                full_path = self.project_path / dir_path
                try:
                    if not full_path.exists():
                        full_path.mkdir(parents=True, exist_ok=True)
                        created_dirs.append(full_path)
                        logger.debug(f"Created directory: {full_path}")
                except Exception as e:
                    logger.error(f"Failed to create directory {dir_path}: {str(e)}")
                    failed_dirs.append(dir_path)
            
            if failed_dirs:
                logger.warning(f"Failed to create {len(failed_dirs)} directories: {failed_dirs}")
            
            logger.info(f"Successfully created {len(created_dirs)} directories")
            console.print(f"🏗️  Created {len(created_dirs)} directories")
            
        except Exception as e:
            logger.error(f"Critical error creating directories: {str(e)}")
            # Clean up created directories on error
            for dir_path in created_dirs:
                try:
                    if dir_path.exists():
                        shutil.rmtree(dir_path)
                        logger.debug(f"Cleaned up directory: {dir_path}")
                except Exception as cleanup_error:
                    logger.warning(f"Failed to cleanup directory {dir_path}: {str(cleanup_error)}")
            raise
    
    def _generate_component_files(self, component: str, templates: List[str]) -> Tuple[List[Path], List[str]]:
        """Generate files for a specific component with better error handling"""
        generated_files = []
        failed_files = []
        
        for template_path in templates:
            try:
                # Convert template path to output path
                output_path = self.project_path / template_path.replace('.j2', '')
                
                # Create parent directory if needed
                output_path.parent.mkdir(parents=True, exist_ok=True)
                
                # Render template
                content = self._render_template(template_path)
                
                # Validate content before writing
                if not content.strip():
                    logger.warning(f"Skipping empty content for {template_path}")
                    failed_files.append(f"{template_path}: Empty content")
                    continue
                
                # Write file with atomic operation
                temp_file = output_path.with_suffix('.tmp')
                try:
                    with open(temp_file, 'w', encoding='utf-8') as f:
                        f.write(content)
                    
                    # Atomic rename
                    temp_file.replace(output_path)
                    
                    generated_files.append(output_path)
                    self._rendered_files.add(output_path)
                    logger.debug(f"Generated file: {output_path}")
                    
                except (OSError, IOError) as write_error:
                    # Clean up temp file if it exists
                    if temp_file.exists():
                        try:
                            temp_file.unlink()
                        except Exception:
                            pass  # Best effort cleanup
                    raise write_error
                
            except TemplateNotFound as e:
                logger.error(f"Template not found: {template_path}")
                failed_files.append(f"{template_path}: Template not found")
                console.print(f"[yellow]⚠️  Skipped {template_path}: Template not found[/yellow]")
                continue
            except TemplateSyntaxError as e:
                logger.error(f"Template syntax error in {template_path}: {str(e)}")
                failed_files.append(f"{template_path}: Template syntax error")
                console.print(f"[yellow]⚠️  Skipped {template_path}: Template syntax error[/yellow]")
                continue
            except Exception as e:
                logger.error(f"Error generating {component} file {template_path}: {str(e)}")
                failed_files.append(f"{template_path}: {str(e)}")
                console.print(f"[yellow]⚠️  Skipped {template_path}: {str(e)}[/yellow]")
                continue
        
        return generated_files, failed_files
    
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
    
    @contextmanager
    def _generation_context(self):
        """Context manager for project generation with cleanup"""
        try:
            yield
        except Exception as e:
            logger.error(f"Project generation failed: {str(e)}")
            # Clean up on failure
            if self.project_path.exists():
                try:
                    shutil.rmtree(self.project_path)
                    logger.info("Cleaned up failed project generation")
                except Exception as cleanup_error:
                    logger.error(f"Failed to cleanup project: {str(cleanup_error)}")
            raise
    
    def generate(self) -> None:
        """Generate the complete DevOps project with optimized performance"""
        logger.info(f"Starting project generation for {self.config.project_name}")
        
        with self._generation_context():
            # Create project structure
            self._create_project_structure()
            
            # Generate components concurrently with better error handling
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
                total_files = 0
                total_failures = 0
                completed_components = []
                
                for component, future in futures.items():
                    try:
                        files, failures = future.result(timeout=30)  # 30 second timeout per component
                        completed_components.append((component, files, failures))
                        total_files += len(files)
                        total_failures += len(failures)
                        
                        # Report component status
                        if failures:
                            console.print(f"✅ {component.title()} generated ({len(files)} files, {len(failures)} skipped)")
                        else:
                            console.print(f"✅ {component.title()} generated ({len(files)} files)")
                            
                    except Exception as e:
                        logger.error(f"Error in {component} generation: {str(e)}")
                        console.print(f"[red]❌ {component.title()} failed: {str(e)}[/red]")
                        total_failures += 1
            
            # Set file permissions
            self._set_file_permissions()
            
            # Performance cleanup
            gc.collect()  # Force garbage collection
            
            # Report completion with detailed statistics
            elapsed_time = time.time() - self._start_time
            logger.info(f"Project generation completed in {elapsed_time:.2f}s")
            
            # Provide detailed summary
            if total_failures > 0:
                console.print(f"⚠️  Project generated with {total_failures} warnings in {elapsed_time:.2f}s")
                console.print(f"   Total files: {total_files}")
            else:
                console.print(f"✅ Project generation completed in {elapsed_time:.2f}s!")
                console.print(f"   Total files: {total_files}")
