"""
Core DevOps project generator
"""

import os
import shutil
import time
from pathlib import Path
from typing import Dict, Any, List, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed
from functools import lru_cache
from jinja2 import Environment, FileSystemLoader, select_autoescape
from rich.console import Console

from .config import ProjectConfig, TemplateConfig

console = Console()


class DevOpsProjectGenerator:
    """Main DevOps project generator class"""
    
    def __init__(self, config: ProjectConfig, output_dir: str = "."):
        self.config = config
        self.output_dir = Path(output_dir)
        self.template_config = TemplateConfig()
        self.project_path = self.output_dir / config.project_name
        self._start_time = time.time()
        
        # Setup optimized Jinja2 environment with caching
        template_path = Path(__file__).parent.parent / "templates"
        self.jinja_env = Environment(
            loader=FileSystemLoader(str(template_path)),
            autoescape=select_autoescape(["html", "xml"]),
            trim_blocks=True,
            lstrip_blocks=True,
            cache_size=100,  # Cache up to 100 templates
            auto_reload=False,  # Disable auto-reload for performance
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
            "scripts/deploy.sh.j2",
        ]
        
        for template_name in common_templates:
            try:
                self.jinja_env.get_template(template_name)
            except Exception:
                pass  # Template doesn't exist, that's ok
    
    def generate(self) -> None:
        """Generate the complete DevOps project"""
        console.print(f"🏗️  Creating project structure for '{self.config.project_name}'...")
        
        # Create project directory structure efficiently
        self._create_project_structure()
        
        # Prepare generation tasks
        generation_tasks = []
        
        # Add component generation tasks
        if self.config.has_ci():
            generation_tasks.append(("CI/CD", self._generate_ci_cd))
        
        if self.config.has_infra():
            generation_tasks.append(("Infrastructure", self._generate_infrastructure))
        
        generation_tasks.extend([
            ("Deployment", self._generate_deployment),
            ("Monitoring", self._generate_monitoring),
            ("Security", self._generate_security),
            ("Base Files", self._generate_base_files),
        ])
        
        # Execute tasks concurrently where possible
        self._execute_generation_tasks(generation_tasks)
        
        # Performance metrics
        elapsed_time = time.time() - self._start_time
        console.print(f"✅ Project generation completed in {elapsed_time:.2f}s!")
    
    def _execute_generation_tasks(self, tasks: List[tuple]) -> None:
        """Execute generation tasks with optimized scheduling"""
        # Separate I/O bound tasks for concurrent execution
        io_tasks = []
        cpu_tasks = []
        
        for task_name, task_func in tasks:
            if task_name in ["Monitoring", "Security", "Base Files"]:
                io_tasks.append((task_name, task_func))
            else:
                cpu_tasks.append((task_name, task_func))
        
        # Execute CPU-intensive tasks sequentially
        for task_name, task_func in cpu_tasks:
            console.print(f"🔄 Generating {task_name}...")
            task_func()
        
        # Execute I/O-bound tasks concurrently
        if io_tasks:
            with ThreadPoolExecutor(max_workers=3) as executor:
                future_to_task = {
                    executor.submit(task_func): task_name 
                    for task_name, task_func in io_tasks
                }
                
                for future in as_completed(future_to_task):
                    task_name = future_to_task[future]
                    try:
                        future.result()
                        console.print(f"✅ {task_name} generated")
                    except Exception as e:
                        console.print(f"[red]❌ Error in {task_name}: {str(e)}[/red]")
    
    def _create_project_structure(self) -> None:
        """Create base project directory structure efficiently"""
        # Create all directories in one batch operation
        directories = [
            "app/sample-app",
            "ci/pipelines", 
            "infra/environments",
            "containers",
            "k8s/base",
            "k8s/overlays",
            "monitoring/logs",
            "monitoring/metrics", 
            "monitoring/alerts",
            "security/secrets",
            "security/scanning",
            "scripts/automation",
        ]
        
        # Batch create directories for better performance
        for directory in directories:
            dir_path = self.project_path / directory
            dir_path.mkdir(parents=True, exist_ok=True)
    
    def _get_cached_template(self, template_path: str) -> Any:
        """Get template with caching for better performance"""
        try:
            return self.jinja_env.get_template(template_path)
        except Exception:
            return None
    
    def _generate_ci_cd(self) -> None:
        """Generate CI/CD pipeline files"""
        console.print("🔄 Generating CI/CD pipelines...")
        
        ci_templates = {
            "github-actions": "github-actions.yml.j2",
            "gitlab-ci": "gitlab-ci.yml.j2",
            "jenkins": "jenkinsfile.j2",
        }
        
        if self.config.ci in ci_templates:
            template_name = ci_templates[self.config.ci]
            self._render_template(
                f"ci/{template_name}",
                f"ci/pipelines/{self.config.ci}.yml",
            )
        
        # Generate CI README
        self._render_template("ci/README.md.j2", "ci/README.md")
    
    def _generate_infrastructure(self) -> None:
        """Generate infrastructure as code files"""
        console.print("🏗️  Generating infrastructure...")
        
        infra_templates = {
            "terraform": "terraform/main.tf.j2",
            "cloudformation": "cloudformation/template.yml.j2",
        }
        
        if self.config.infra in infra_templates:
            template_path = infra_templates[self.config.infra]
            output_path = f"infra/{self.config.infra}"
            
            if self.config.infra == "terraform":
                self._render_template(template_path, f"{output_path}/main.tf")
                self._render_template("terraform/variables.tf.j2", f"{output_path}/variables.tf")
                self._render_template("terraform/outputs.tf.j2", f"{output_path}/outputs.tf")
            elif self.config.infra == "cloudformation":
                self._render_template(template_path, f"{output_path}/template.yml")
        
        # Generate environment configs
        for env in self.config.get_environments():
            self._render_template(
                f"infra/environment-{self.config.infra}.j2",
                f"infra/environments/{env}.tf" if self.config.infra == "terraform" else f"infra/environments/{env}.yml",
                env=env,
            )
    
    def _generate_deployment(self) -> None:
        """Generate deployment files"""
        console.print("🚀 Generating deployment files...")
        
        if self.config.has_docker():
            self._render_template("deploy/Dockerfile.j2", "containers/Dockerfile")
            self._render_template("deploy/docker-compose.yml.j2", "containers/docker-compose.yml")
        
        if self.config.has_kubernetes():
            self._render_template("deploy/k8s-deployment.yml.j2", "k8s/base/deployment.yml")
            self._render_template("deploy/k8s-service.yml.j2", "k8s/base/service.yml")
            
            # Generate environment overlays
            for env in self.config.get_environments():
                env_dir = f"k8s/overlays/{env}"
                (self.project_path / env_dir).mkdir(exist_ok=True)
                self._render_template(
                    "deploy/k8s-overlay.yml.j2",
                    f"{env_dir}/kustomization.yml",
                    env=env,
                )
        
        if self.config.deploy == "vm":
            self._render_template("deploy/vm-deploy.sh.j2", "scripts/automation/vm-deploy.sh")
    
    def _generate_monitoring(self) -> None:
        """Generate monitoring and observability files"""
        console.print("📊 Generating monitoring...")
        
        # Always generate logs
        self._render_template("monitoring/logging.yml.j2", "monitoring/logs/logging.yml")
        
        if self.config.has_metrics():
            self._render_template("monitoring/metrics.yml.j2", "monitoring/metrics/metrics.yml")
        
        if self.config.has_alerts():
            self._render_template("monitoring/alerts.yml.j2", "monitoring/alerts/alerts.yml")
    
    def _generate_security(self) -> None:
        """Generate security files"""
        console.print("🔒 Generating security...")
        
        sec_level = self.config.get_security_level()
        
        # Base security files
        self._render_template(f"security/{sec_level}-secrets.yml.j2", "security/secrets/secrets.yml")
        self._render_template(f"security/{sec_level}-scan.yml.j2", "security/scanning/scan.yml")
        
        if sec_level in ["standard", "strict"]:
            self._render_template("security/security-policy.yml.j2", "security/security-policy.yml")
        
        if sec_level == "strict":
            self._render_template("security/compliance.yml.j2", "security/compliance.yml")
    
    def _generate_base_files(self) -> None:
        """Generate base project files with optimized file operations"""
        console.print("📄 Generating base files...")
        
        # Define all file generations in a batch for better organization
        file_generations = [
            # Sample application
            ("app/sample-app/main.py.j2", "app/sample-app/main.py"),
            ("app/sample-app/requirements.txt.j2", "app/sample-app/requirements.txt"),
            
            # Scripts
            ("scripts/setup.sh.j2", "scripts/setup.sh"),
            ("scripts/deploy.sh.j2", "scripts/deploy.sh"),
            
            # Project files
            ("Makefile.j2", "Makefile"),
            ("README.md.j2", "README.md"),
            ("gitignore.j2", ".gitignore"),
        ]
        
        # Generate all files in batch
        for template_path, output_path in file_generations:
            self._render_template(template_path, output_path)
        
        # Make scripts executable in batch
        script_files = [
            "scripts/setup.sh",
            "scripts/deploy.sh", 
            "scripts/automation/vm-deploy.sh",
        ]
        
        for script in script_files:
            script_path = self.project_path / script
            if script_path.exists():
                try:
                    os.chmod(script_path, 0o755)
                except OSError as e:
                    console.print(f"[yellow]⚠️  Could not make {script} executable: {str(e)}[/yellow]")
    
    def _render_template(self, template_path: str, output_path: str, **kwargs) -> None:
        """Render a template to an output file with optimized performance"""
        try:
            # Use cached template for better performance
            template = self._get_cached_template(template_path)
            if template is None:
                console.print(f"[yellow]⚠️  Template {template_path} not found, skipping {output_path}[/yellow]")
                return
            
            # Merge template context with additional kwargs
            context = self.config.get_template_context()
            context.update(kwargs)
            
            # Render template
            rendered_content = template.render(**context)
            
            # Ensure output directory exists
            output_file = self.project_path / output_path
            output_file.parent.mkdir(parents=True, exist_ok=True)
            
            # Write file efficiently
            with open(output_file, "w", encoding="utf-8", newline="\n") as f:
                f.write(rendered_content)
                
        except Exception as e:
            console.print(f"[red]❌ Error rendering template {template_path}: {str(e)}[/red]")
            console.print(f"[yellow]⚠️  Skipping {output_path} - template may have syntax errors[/yellow]")
            # Don't raise the exception, just log and continue
