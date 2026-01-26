#!/usr/bin/env python3
"""
CLI interface for DevOps Project Generator
"""

import os
import sys
import shutil
import json
import yaml
import datetime
import re
import logging
import time
from pathlib import Path
from typing import Optional, List, Dict, Any
import typer
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TaskProgressColumn
from rich.traceback import install
from rich.live import Live
from rich.text import Text

from generator import ProjectConfig, DevOpsProjectGenerator

# Install rich traceback for better error display
install(show_locals=True)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('devops-generator.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = typer.Typer(
    name="devops-project-generator",
    help="🚀 DevOps Project Generator - Scaffold production-ready DevOps repositories",
    no_args_is_help=True,
    add_completion=False,
)

console = Console()


def validate_project_name(name: str) -> str:
    """Validate and sanitize project name"""
    if not name:
        raise typer.BadParameter("Project name cannot be empty")
    
    # Remove invalid characters and sanitize
    sanitized = re.sub(r'[^\w\-_.]', '', name.strip())
    
    if not sanitized:
        raise typer.BadParameter("Project name contains no valid characters")
    
    if len(sanitized) > 50:
        raise typer.BadParameter("Project name too long (max 50 characters)")
    
    if sanitized[0] in ('-', '.', '_'):
        raise typer.BadParameter("Project name cannot start with '-', '.', or '_'")
    
    return sanitized


def validate_output_path(path: str) -> Path:
    """Validate and normalize output path"""
    try:
        output_path = Path(path).resolve()
        
        # Check if parent directory exists and is writable
        if not output_path.parent.exists():
            try:
                output_path.parent.mkdir(parents=True, exist_ok=True)
            except PermissionError:
                raise typer.BadParameter(f"Cannot create directory: {output_path.parent}")
        
        if not os.access(output_path.parent, os.W_OK):
            raise typer.BadParameter(f"Directory not writable: {output_path.parent}")
        
        return output_path
    except Exception as e:
        raise typer.BadParameter(f"Invalid output path: {str(e)}")


def handle_keyboard_interrupt(func):
    """Decorator to handle keyboard interrupts gracefully"""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except KeyboardInterrupt:
            console.print("\n[yellow]⚠️  Operation cancelled by user[/yellow]")
            logger.info("Operation cancelled by user")
            raise typer.Exit(130)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}", exc_info=True)
            console.print(f"\n[red]❌ Unexpected error: {str(e)}[/red]")
            console.print("[yellow]💡 Check the log file for details: devops-generator.log[/yellow]")
            raise typer.Exit(1)
    return wrapper


def show_progress_spinner(description: str):
    """Show a progress spinner for long operations"""
    return Progress(
        SpinnerColumn(),
        TextColumn(description),
        console=console,
        transient=True,
    )


def show_success_message(title: str, message: str) -> None:
    """Display a styled success message"""
    console.print(Panel.fit(
        f"[bold green]✅ {title}[/bold green]\n"
        f"[dim]{message}[/dim]",
        border_style="green",
        padding=(1, 2)
    ))


def show_error_message(title: str, message: str) -> None:
    """Display a styled error message"""
    console.print(Panel.fit(
        f"[bold red]❌ {title}[/bold red]\n"
        f"[dim]{message}[/dim]",
        border_style="red",
        padding=(1, 2)
    ))


def show_warning_message(title: str, message: str) -> None:
    """Display a styled warning message"""
    console.print(Panel.fit(
        f"[bold yellow]⚠️  {title}[/bold yellow]\n"
        f"[dim]{message}[/dim]",
        border_style="yellow",
        padding=(1, 2)
    ))


def format_file_size(size_bytes: int) -> str:
    """Format file size in human readable format"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.1f} TB"


def format_duration(seconds: float) -> str:
    """Format duration in human readable format"""
    if seconds < 1:
        return f"{int(seconds * 1000)}ms"
    elif seconds < 60:
        return f"{seconds:.2f}s"
    elif seconds < 3600:
        minutes = int(seconds // 60)
        secs = seconds % 60
        return f"{minutes}m {secs:.0f}s"
    else:
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        return f"{hours}h {minutes}m"


def _calculate_project_stats(project_path: Path) -> Dict[str, Any]:
    """Calculate project statistics"""
    stats = {
        "files": 0,
        "directories": 0,
        "size_bytes": 0,
        "size_formatted": "0 B"
    }
    
    if not project_path.exists():
        return stats
    
    try:
        for item in project_path.rglob("*"):
            if item.is_file():
                stats["files"] += 1
                stats["size_bytes"] += item.stat().st_size
            elif item.is_dir():
                stats["directories"] += 1
        
        stats["size_formatted"] = format_file_size(stats["size_bytes"])
    except Exception as e:
        logger.warning(f"Error calculating project stats: {str(e)}")
    
    return stats


@app.command()
def init(
    ci: Optional[str] = typer.Option(
        None,
        "--ci",
        help="CI/CD platform: github-actions, gitlab-ci, jenkins, none",
        show_choices=True,
    ),
    infra: Optional[str] = typer.Option(
        None,
        "--infra",
        help="Infrastructure tool: terraform, cloudformation, none",
        show_choices=True,
    ),
    deploy: Optional[str] = typer.Option(
        None,
        "--deploy",
        help="Deployment method: vm, docker, kubernetes",
        show_choices=True,
    ),
    envs: Optional[str] = typer.Option(
        None,
        "--envs",
        help="Environments: single, dev,stage,prod",
    ),
    observability: Optional[str] = typer.Option(
        None,
        "--observability",
        help="Observability level: logs, logs-metrics, full",
        show_choices=True,
    ),
    security: Optional[str] = typer.Option(
        None,
        "--security",
        help="Security level: basic, standard, strict",
        show_choices=True,
    ),
    project_name: Optional[str] = typer.Option(
        "devops-project",
        "--name",
        help="Project name",
        callback=lambda ctx, param, value: validate_project_name(value) if value else value,
    ),
    output_dir: Optional[str] = typer.Option(
        ".",
        "--output",
        help="Output directory",
    ),
    interactive: bool = typer.Option(
        False,
        "--interactive/--no-interactive",
        help="Interactive mode",
    ),
) -> None:
    """Initialize a new DevOps project"""
    try:
        # Validate output path
        try:
            output_path = validate_output_path(output_dir)
        except typer.BadParameter as e:
            console.print(f"[red]❌ {str(e)}[/red]")
            raise typer.Exit(1)
        
        # Display welcome message
        console.print(Panel.fit(
            "[bold blue]🚀 DevOps Project Generator[/bold blue]\n"
            "[dim]Scaffold production-ready DevOps repositories[/dim]",
            border_style="blue"
        ))
        
        logger.info(f"Starting project generation: {project_name}")
        
        # Get configuration
        try:
            if interactive:
                config = _interactive_mode()
            else:
                config = ProjectConfig(
                    ci=ci,
                    infra=infra,
                    deploy=deploy,
                    envs=envs,
                    observability=observability,
                    security=security,
                    project_name=project_name,
                )
        except Exception as e:
            logger.error(f"Configuration error: {str(e)}")
            console.print(f"[red]❌ Configuration error: {str(e)}[/red]")
            raise typer.Exit(1)
        
        # Validate configuration
        if not config.validate():
            console.print("[red]❌ Invalid configuration. Please check your options.[/red]")
            console.print("[yellow]💡 Use 'devops-project-generator list-options' to see valid choices[/yellow]")
            logger.error("Invalid configuration provided")
            raise typer.Exit(1)
        
        # Check if project directory already exists
        project_path = output_path / config.project_name
        if project_path.exists():
            console.print(f"[yellow]⚠️  Directory '{config.project_name}' already exists.[/yellow]")
            if not typer.confirm("Continue and overwrite?"):
                console.print("[dim]Operation cancelled.[/dim]")
                logger.info("Operation cancelled by user due to existing directory")
                raise typer.Exit(0)
            
            try:
                shutil.rmtree(project_path)
                logger.info(f"Removed existing directory: {project_path}")
            except PermissionError:
                console.print(f"[red]❌ Permission denied when removing existing directory[/red]")
                console.print(f"[yellow]💡 Try removing {project_path} manually[/yellow]")
                raise typer.Exit(1)
            except Exception as e:
                console.print(f"[red]❌ Error removing existing directory: {str(e)}[/red]")
                logger.error(f"Error removing directory: {str(e)}")
                raise typer.Exit(1)
        
        # Generate project
        try:
            start_time = time.time()
            with show_progress_spinner("Generating DevOps project...") as progress:
                task = progress.add_task("Initializing...", total=None)
                
                generator = DevOpsProjectGenerator(config, str(output_path))
                generator.generate()
            
            generation_time = time.time() - start_time
            
            # Calculate project statistics
            project_stats = _calculate_project_stats(project_path)
            
            # Display success message with statistics
            success_msg = (
                f"Generated {project_stats['files']} files across {project_stats['directories']} directories\n"
                f"Project size: {project_stats['size_formatted']}\n"
                f"Generation time: {format_duration(generation_time)}"
            )
            show_success_message("Project Generated Successfully!", success_msg)
            
            console.print(f"\n[bold]📍 Project location:[/bold] {project_path}")
            console.print("\n[bold]🚀 Next steps:[/bold]")
            console.print(f"  cd {config.project_name}")
            console.print("  make help")
            
            logger.info(f"Project generated successfully: {project_path}")
            
        except KeyboardInterrupt:
            show_warning_message("Generation Cancelled", "Project generation was cancelled by user")
            logger.info("Generation cancelled by user")
            # Clean up partial project if it exists
            if project_path.exists():
                try:
                    shutil.rmtree(project_path)
                    logger.info("Cleaned up partial project")
                except:
                    pass
            raise typer.Exit(130)
        except Exception as e:
            logger.error(f"Error generating project: {str(e)}", exc_info=True)
            show_error_message("Generation Failed", f"Failed to generate project: {str(e)}")
            console.print("[yellow]💡 Check the log file for details: devops-generator.log[/yellow]")
            
            # Clean up partial project if it exists
            if project_path.exists():
                try:
                    shutil.rmtree(project_path)
                    logger.info("Cleaned up partial project due to error")
                except:
                    pass
            raise typer.Exit(1)
    
    except KeyboardInterrupt:
        console.print("\n[yellow]⚠️  Operation cancelled by user[/yellow]")
        logger.info("Operation cancelled by user")
        raise typer.Exit(130)
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        console.print(f"\n[red]❌ Unexpected error: {str(e)}[/red]")
        console.print("[yellow]💡 Check the log file for details: devops-generator.log[/yellow]")
        raise typer.Exit(1)


def _interactive_mode() -> ProjectConfig:
    """Interactive configuration mode"""
    console.print("\n[bold]🔧 Interactive Configuration[/bold]\n")
    
    # CI/CD selection
    ci_table = Table(title="CI/CD Platforms")
    ci_table.add_column("Option", style="cyan")
    ci_table.add_column("Description")
    ci_table.add_row("github-actions", "GitHub Actions workflows")
    ci_table.add_row("gitlab-ci", "GitLab CI/CD pipelines")
    ci_table.add_row("jenkins", "Jenkins pipeline files")
    ci_table.add_row("none", "No CI/CD")
    console.print(ci_table)
    
    while True:
        ci = typer.prompt("Choose CI/CD platform", type=str).lower()
        if ci in ProjectConfig.VALID_CI_OPTIONS:
            break
        console.print(f"[red]Invalid option. Please choose from: {', '.join(ProjectConfig.VALID_CI_OPTIONS)}[/red]")
    
    # Infrastructure selection
    infra_table = Table(title="Infrastructure Tools")
    infra_table.add_column("Option", style="cyan")
    infra_table.add_column("Description")
    infra_table.add_row("terraform", "Terraform IaC")
    infra_table.add_row("cloudformation", "AWS CloudFormation")
    infra_table.add_row("none", "No IaC")
    console.print(infra_table)
    
    while True:
        infra = typer.prompt("Choose infrastructure tool", type=str).lower()
        if infra in ProjectConfig.VALID_INFRA_OPTIONS:
            break
        console.print(f"[red]Invalid option. Please choose from: {', '.join(ProjectConfig.VALID_INFRA_OPTIONS)}[/red]")
    
    # Deployment selection
    deploy_table = Table(title="Deployment Methods")
    deploy_table.add_column("Option", style="cyan")
    deploy_table.add_column("Description")
    deploy_table.add_row("vm", "Virtual Machine deployment")
    deploy_table.add_row("docker", "Docker container deployment")
    deploy_table.add_row("kubernetes", "Kubernetes deployment")
    console.print(deploy_table)
    
    while True:
        deploy = typer.prompt("Choose deployment method", type=str).lower()
        if deploy in ProjectConfig.VALID_DEPLOY_OPTIONS:
            break
        console.print(f"[red]Invalid option. Please choose from: {', '.join(ProjectConfig.VALID_DEPLOY_OPTIONS)}[/red]")
    
    # Environments
    while True:
        envs = typer.prompt("Choose environments (single, dev,stage,prod)", type=str).lower()
        if envs in ["single", "dev", "stage", "prod"] or "," in envs:
            break
        console.print("[red]Invalid environment format. Use 'single' or comma-separated values like 'dev,stage,prod'[/red]")
    
    # Observability
    obs_table = Table(title="Observability Levels")
    obs_table.add_column("Option", style="cyan")
    obs_table.add_column("Description")
    obs_table.add_row("logs", "Logs only")
    obs_table.add_row("logs-metrics", "Logs + Metrics")
    obs_table.add_row("full", "Logs + Metrics + Alerts")
    console.print(obs_table)
    
    while True:
        observability = typer.prompt("Choose observability level", type=str).lower()
        if observability in ProjectConfig.VALID_OBS_OPTIONS:
            break
        console.print(f"[red]Invalid option. Please choose from: {', '.join(ProjectConfig.VALID_OBS_OPTIONS)}[/red]")
    
    # Security
    sec_table = Table(title="Security Levels")
    sec_table.add_column("Option", style="cyan")
    sec_table.add_column("Description")
    sec_table.add_row("basic", "Basic security practices")
    sec_table.add_row("standard", "Standard security measures")
    sec_table.add_row("strict", "Strict security controls")
    console.print(sec_table)
    
    while True:
        security = typer.prompt("Choose security level", type=str).lower()
        if security in ProjectConfig.VALID_SEC_OPTIONS:
            break
        console.print(f"[red]Invalid option. Please choose from: {', '.join(ProjectConfig.VALID_SEC_OPTIONS)}[/red]")
    
    project_name = typer.prompt("Project name", default="devops-project")
    
    return ProjectConfig(
        ci=ci,
        infra=infra,
        deploy=deploy,
        envs=envs,
        observability=observability,
        security=security,
        project_name=project_name,
    )


@app.command()
def list_options() -> None:
    """List all available options"""
    console.print(Panel.fit(
        "[bold blue]📋 Available Options[/bold blue]",
        border_style="blue"
    ))
    
    # CI/CD Options
    console.print("\n[bold]🔄 CI/CD Platforms:[/bold]")
    ci_table = Table()
    ci_table.add_column("Option", style="cyan")
    ci_table.add_column("Description")
    ci_table.add_row("github-actions", "GitHub Actions workflows")
    ci_table.add_row("gitlab-ci", "GitLab CI/CD pipelines")
    ci_table.add_row("jenkins", "Jenkins pipeline files")
    ci_table.add_row("none", "No CI/CD")
    console.print(ci_table)
    
    # Infrastructure Options
    console.print("\n[bold]🏗️ Infrastructure Tools:[/bold]")
    infra_table = Table()
    infra_table.add_column("Option", style="cyan")
    infra_table.add_column("Description")
    infra_table.add_row("terraform", "Terraform IaC")
    infra_table.add_row("cloudformation", "AWS CloudFormation")
    infra_table.add_row("none", "No IaC")
    console.print(infra_table)
    
    # Deployment Options
    console.print("\n[bold]🚀 Deployment Methods:[/bold]")
    deploy_table = Table()
    deploy_table.add_column("Option", style="cyan")
    deploy_table.add_column("Description")
    deploy_table.add_row("vm", "Virtual Machine deployment")
    deploy_table.add_row("docker", "Docker container deployment")
    deploy_table.add_row("kubernetes", "Kubernetes deployment")
    console.print(deploy_table)
    
    # Environment Options
    console.print("\n[bold]🌍 Environment Options:[/bold]")
    env_table = Table()
    env_table.add_column("Option", style="cyan")
    env_table.add_column("Description")
    env_table.add_row("single", "Single environment")
    env_table.add_row("dev", "Development environment")
    env_table.add_row("dev,stage,prod", "Multi-environment setup")
    console.print(env_table)
    
    # Observability Options
    console.print("\n[bold]📊 Observability Levels:[/bold]")
    obs_table = Table()
    obs_table.add_column("Option", style="cyan")
    obs_table.add_column("Description")
    obs_table.add_row("logs", "Logs only")
    obs_table.add_row("logs-metrics", "Logs + Metrics")
    obs_table.add_row("full", "Logs + Metrics + Alerts")
    console.print(obs_table)
    
    # Security Options
    console.print("\n[bold]🔒 Security Levels:[/bold]")
    sec_table = Table()
    sec_table.add_column("Option", style="cyan")
    sec_table.add_column("Description")
    sec_table.add_row("basic", "Basic security practices")
    sec_table.add_row("standard", "Standard security measures")
    sec_table.add_row("strict", "Strict security controls")
    console.print(sec_table)


@app.command()
def config(
    action: str = typer.Argument(
        "create",
        help="Action: create, show, or validate"
    ),
    config_file: Optional[str] = typer.Option(
        "devops-config.yaml",
        "--file",
        help="Configuration file path"
    ),
) -> None:
    """Manage project configuration files"""
    config_path = Path(config_file)
    
    if action == "create":
        _create_config_file(config_path)
    elif action == "show":
        _show_config_file(config_path)
    elif action == "validate":
        _validate_config_file(config_path)
    else:
        console.print(f"[red]❌ Unknown action: {action}[/red]")
        console.print("[yellow]Available actions: create, show, validate[/yellow]")
        raise typer.Exit(1)


def _create_config_file(config_path: Path) -> None:
    """Create a sample configuration file"""
    console.print(f"[blue]📝 Creating configuration file: {config_path}[/blue]")
    
    sample_config = """# DevOps Project Generator Configuration
# This file defines the default settings for project generation

project:
  name: "my-devops-project"
  description: "A production-ready DevOps project"
  author: "Your Name"
  email: "your.email@example.com"

# CI/CD Configuration
ci:
  platform: "github-actions"  # github-actions, gitlab-ci, jenkins, none
  docker_registry: "docker.io"
  cache_dependencies: true

# Infrastructure Configuration  
infra:
  tool: "terraform"  # terraform, cloudformation, none
  cloud_provider: "aws"  # aws, gcp, azure
  region: "us-west-2"

# Deployment Configuration
deploy:
  method: "kubernetes"  # vm, docker, kubernetes
  environments: "dev,stage,prod"
  auto_scaling: true
  health_checks: true

# Observability Configuration
observability:
  level: "full"  # logs, logs-metrics, full
  metrics_retention: "30d"
  log_retention: "7d"
  alerting: true

# Security Configuration
security:
  level: "standard"  # basic, standard, strict
  ssl_certificates: true
  secrets_management: "vault"
  vulnerability_scanning: true

# Custom Templates (optional)
templates:
  custom_dir: "~/.devops-generator/templates"
  overwrite_defaults: false

# Advanced Options
advanced:
  multi_region: false
  blue_green_deployments: false
  canary_deployments: false
  disaster_recovery: false
"""
    
    try:
        config_path.parent.mkdir(parents=True, exist_ok=True)
        with open(config_path, "w", encoding="utf-8") as f:
            f.write(sample_config)
        console.print(f"[green]✅ Configuration file created: {config_path}[/green]")
        console.print("[yellow]💡 Edit this file to customize your project defaults[/yellow]")
    except Exception as e:
        console.print(f"[red]❌ Error creating config file: {str(e)}[/red]")
        raise typer.Exit(1)


def _show_config_file(config_path: Path) -> None:
    """Display the current configuration file"""
    if not config_path.exists():
        console.print(f"[red]❌ Configuration file not found: {config_path}[/red]")
        console.print("[yellow]💡 Use 'devops-project-generator config create' to create one[/yellow]")
        raise typer.Exit(1)
    
    console.print(f"[blue]📋 Configuration file: {config_path}[/blue]")
    console.print()
    
    try:
        with open(config_path, "r", encoding="utf-8") as f:
            content = f.read()
            console.print(content)
    except Exception as e:
        console.print(f"[red]❌ Error reading config file: {str(e)}[/red]")
        raise typer.Exit(1)


def _validate_config_file(config_path: Path) -> None:
    """Validate the configuration file syntax and values"""
    if not config_path.exists():
        console.print(f"[red]❌ Configuration file not found: {config_path}[/red]")
        raise typer.Exit(1)
    
    console.print(f"[blue]🔍 Validating configuration file: {config_path}[/blue]")
    
    try:
        import yaml
        with open(config_path, "r", encoding="utf-8") as f:
            config_data = yaml.safe_load(f)
        
        # Validate structure
        required_sections = ["project", "ci", "deploy", "observability", "security"]
        missing_sections = []
        
        for section in required_sections:
            if section not in config_data:
                missing_sections.append(section)
        
        if missing_sections:
            console.print(f"[yellow]⚠️  Missing sections: {', '.join(missing_sections)}[/yellow]")
        
        # Validate values
        validation_errors = []
        
        if "ci" in config_data:
            ci_platform = config_data["ci"].get("platform", "")
            if ci_platform not in ["github-actions", "gitlab-ci", "jenkins", "none"]:
                validation_errors.append(f"Invalid CI platform: {ci_platform}")
        
        if "deploy" in config_data:
            deploy_method = config_data["deploy"].get("method", "")
            if deploy_method not in ["vm", "docker", "kubernetes"]:
                validation_errors.append(f"Invalid deployment method: {deploy_method}")
        
        if validation_errors:
            console.print("[red]❌ Validation errors found:[/red]")
            for error in validation_errors:
                console.print(f"  • {error}")
        else:
            console.print("[green]✅ Configuration file is valid![/green]")
    
    except ImportError:
        console.print("[yellow]⚠️  PyYAML not installed, cannot validate YAML syntax[/yellow]")
        console.print("[dim]Install with: pip install PyYAML[/dim]")
    except yaml.YAMLError as e:
        console.print(f"[red]❌ YAML syntax error: {str(e)}[/red]")
        raise typer.Exit(1)
    except Exception as e:
        console.print(f"[red]❌ Error validating config: {str(e)}[/red]")
        raise typer.Exit(1)


@app.command()
def validate(
    project_path: str = typer.Argument(
        ".",
        help="Path to the DevOps project to validate"
    ),
    fix: bool = typer.Option(
        False,
        "--fix",
        help="Automatically fix common issues"
    ),
) -> None:
    """Validate a DevOps project structure and configuration"""
    project_path = Path(project_path)
    
    if not project_path.exists():
        console.print(f"[red]❌ Project path '{project_path}' does not exist[/red]")
        raise typer.Exit(1)
    
    console.print(Panel.fit(
        "[bold blue]🔍 Project Validation[/bold blue]\n"
        "[dim]Checking DevOps project structure and configuration[/dim]",
        border_style="blue"
    ))
    
    validation_results = _validate_project_structure(project_path)
    
    # Display results
    _display_validation_results(validation_results)
    
    # Auto-fix if requested
    if fix and validation_results["issues"]:
        console.print("\n[yellow]🔧 Attempting to fix issues...[/yellow]")
        _fix_project_issues(project_path, validation_results["issues"])
    
    # Exit with appropriate code
    if validation_results["critical_issues"]:
        console.print(f"\n[red]❌ Validation failed with {len(validation_results['critical_issues'])} critical issues[/red]")
        raise typer.Exit(1)
    elif validation_results["issues"]:
        console.print(f"\n[yellow]⚠️  Validation passed with {len(validation_results['issues'])} warnings[/yellow]")
    else:
        console.print("\n[green]✅ Project validation passed successfully![/green]")


def _validate_project_structure(project_path: Path) -> dict:
    """Validate the project structure and return results"""
    results = {
        "critical_issues": [],
        "issues": [],
        "warnings": [],
        "passed_checks": []
    }
    
    # Check required directories
    required_dirs = [
        "app", "ci", "infra", "containers", "k8s", 
        "monitoring", "security", "scripts"
    ]
    
    for dir_name in required_dirs:
        dir_path = project_path / dir_name
        if dir_path.exists() and dir_path.is_dir():
            results["passed_checks"].append(f"✅ {dir_name}/ directory exists")
        else:
            results["issues"].append(f"❌ Missing {dir_name}/ directory")
    
    # Check required files
    required_files = [
        "README.md", "Makefile", ".gitignore"
    ]
    
    for file_name in required_files:
        file_path = project_path / file_name
        if file_path.exists() and file_path.is_file():
            results["passed_checks"].append(f"✅ {file_name} exists")
        else:
            results["critical_issues"].append(f"❌ Missing {file_name}")
    
    # Check script permissions
    script_files = [
        "scripts/setup.sh", "scripts/deploy.sh"
    ]
    
    for script in script_files:
        script_path = project_path / script
        if script_path.exists():
            if os.access(script_path, os.X_OK):
                results["passed_checks"].append(f"✅ {script} is executable")
            else:
                results["issues"].append(f"⚠️  {script} is not executable")
    
    # Check for configuration files
    config_files = [
        "ci/pipelines", "infra/environments", "k8s/base"
    ]
    
    for config_dir in config_files:
        config_path = project_path / config_dir
        if config_path.exists():
            files = list(config_path.glob("*"))
            if files:
                results["passed_checks"].append(f"✅ {config_dir}/ contains {len(files)} files")
            else:
                results["warnings"].append(f"⚠️  {config_dir}/ is empty")
    
    return results


def _display_validation_results(results: dict) -> None:
    """Display validation results in a formatted way"""
    if results["passed_checks"]:
        console.print("\n[bold green]✅ Passed Checks:[/bold green]")
        for check in results["passed_checks"]:
            console.print(f"  {check}")
    
    if results["warnings"]:
        console.print("\n[bold yellow]⚠️  Warnings:[/bold yellow]")
        for warning in results["warnings"]:
            console.print(f"  {warning}")
    
    if results["issues"]:
        console.print("\n[bold red]❌ Issues:[/bold red]")
        for issue in results["issues"]:
            console.print(f"  {issue}")
    
    if results["critical_issues"]:
        console.print("\n[bold red]🚨 Critical Issues:[/bold red]")
        for issue in results["critical_issues"]:
            console.print(f"  {issue}")


def _fix_project_issues(project_path: Path, issues: list) -> None:
    """Attempt to automatically fix common issues"""
    for issue in issues:
        if "is not executable" in issue:
            script_file = issue.split("⚠️  ")[1].split(" is not executable")[0]
            script_path = project_path / script_file
            try:
                os.chmod(script_path, 0o755)
                console.print(f"[green]✅ Fixed: Made {script_file} executable[/green]")
            except Exception as e:
                console.print(f"[red]❌ Could not fix {script_file}: {str(e)}[/red]")
        
        elif "Missing" in issue and "directory" in issue:
            dir_name = issue.split("Missing ")[1].split("/ directory")[0]
            dir_path = project_path / dir_name
            try:
                dir_path.mkdir(parents=True, exist_ok=True)
                console.print(f"[green]✅ Fixed: Created {dir_name}/ directory[/green]")
            except Exception as e:
                console.print(f"[red]❌ Could not create {dir_name}/: {str(e)}[/red]")


@app.command()
def cleanup(
    project_path: str = typer.Argument(
        ".",
        help="Path to the DevOps project to cleanup"
    ),
    force: bool = typer.Option(
        False,
        "--force",
        help="Skip confirmation prompts"
    ),
    keep_config: bool = typer.Option(
        False,
        "--keep-config",
        help="Keep configuration files"
    ),
) -> None:
    """Clean up a DevOps project and remove generated resources"""
    project_path = Path(project_path).resolve()
    
    if not project_path.exists():
        console.print(f"[red]❌ Project path '{project_path}' does not exist[/red]")
        raise typer.Exit(1)
    
    console.print(Panel.fit(
        "[bold red]🧹 Project Cleanup[/bold red]\n"
        "[dim]Remove generated DevOps project and resources[/dim]",
        border_style="red"
    ))
    
    # Show project info before cleanup
    project_info = _get_project_info(project_path)
    _display_project_summary(project_info)
    
    # Confirmation prompt
    if not force:
        console.print(f"\n[red]⚠️  This will permanently delete the project at:[/red]")
        console.print(f"[bold]{project_path}[/bold]")
        
        if not typer.confirm("\n[yellow]Are you sure you want to continue?[/yellow]"):
            console.print("[dim]Operation cancelled.[/dim]")
            raise typer.Exit(0)
    
    # Perform cleanup
    cleanup_results = _cleanup_project(project_path, keep_config)
    
    # Display results
    _display_cleanup_results(cleanup_results)


def _get_project_info(project_path: Path) -> dict:
    """Gather information about the project"""
    info = {
        "name": project_path.name,
        "path": project_path,
        "size_bytes": 0,
        "file_count": 0,
        "dir_count": 0,
        "devops_files": [],
        "config_files": []
    }
    
    try:
        for item in project_path.rglob("*"):
            if item.is_file():
                info["file_count"] += 1
                info["size_bytes"] += item.stat().st_size
                
                # Check for DevOps-specific files
                if any(pattern in str(item) for pattern in ["Dockerfile", "Makefile", ".yml", ".yaml", ".tf", "k8s"]):
                    info["devops_files"].append(item.relative_to(project_path))
                
                # Check for config files
                if item.name.endswith((".yaml", ".yml", ".json", ".toml", ".ini")):
                    info["config_files"].append(item.relative_to(project_path))
            
            elif item.is_dir() and item != project_path:
                info["dir_count"] += 1
    
    except Exception as e:
        console.print(f"[yellow]⚠️  Could not analyze project: {str(e)}[/yellow]")
    
    return info


def _display_project_summary(info: dict) -> None:
    """Display a summary of the project to be cleaned up"""
    size_mb = info["size_bytes"] / (1024 * 1024)
    
    console.print(f"\n[bold]📊 Project Summary:[/bold]")
    console.print(f"  Name: {info['name']}")
    console.print(f"  Path: {info['path']}")
    console.print(f"  Size: {size_mb:.2f} MB")
    console.print(f"  Files: {info['file_count']}")
    console.print(f"  Directories: {info['dir_count']}")
    console.print(f"  DevOps files: {len(info['devops_files'])}")
    console.print(f"  Config files: {len(info['config_files'])}")
    
    if info["devops_files"]:
        console.print(f"\n[dim]DevOps files found:[/dim]")
        for file in info["devops_files"][:10]:  # Show first 10
            console.print(f"  • {file}")
        if len(info["devops_files"]) > 10:
            console.print(f"  ... and {len(info['devops_files']) - 10} more")


def _cleanup_project(project_path: Path, keep_config: bool) -> dict:
    """Perform the actual cleanup operation"""
    results = {
        "deleted_files": 0,
        "deleted_dirs": 0,
        "kept_files": [],
        "errors": []
    }
    
    try:
        if keep_config:
            # Preserve config files
            config_files = []
            for item in project_path.rglob("*"):
                if item.is_file() and item.name.endswith((".yaml", ".yml", ".json", ".toml", ".ini")):
                    config_files.append(item)
            
            # Move config files to temporary location
            temp_dir = project_path.parent / f"{project_path.name}_config_backup"
            temp_dir.mkdir(exist_ok=True)
            
            for config_file in config_files:
                try:
                    relative_path = config_file.relative_to(project_path)
                    backup_path = temp_dir / relative_path
                    backup_path.parent.mkdir(parents=True, exist_ok=True)
                    shutil.move(str(config_file), str(backup_path))
                    results["kept_files"].append(str(relative_path))
                except Exception as e:
                    results["errors"].append(f"Could not backup {config_file}: {str(e)}")
        
        # Remove the project directory
        shutil.rmtree(project_path)
        results["deleted_dirs"] = 1  # The main project directory
        
        # Restore config files if they were kept
        if keep_config and results["kept_files"]:
            console.print(f"[yellow]📁 Configuration files backed up to: {temp_dir}[/yellow]")
    
    except Exception as e:
        results["errors"].append(f"Cleanup error: {str(e)}")
    
    return results


def _display_cleanup_results(results: dict) -> None:
    """Display the results of the cleanup operation"""
    if results["errors"]:
        console.print("\n[red]❌ Cleanup completed with errors:[/red]")
        for error in results["errors"]:
            console.print(f"  • {error}")
    else:
        console.print("\n[green]✅ Cleanup completed successfully![/green]")
        console.print(f"  Deleted directories: {results['deleted_dirs']}")
        
        if results["kept_files"]:
            console.print(f"  Preserved config files: {len(results['kept_files'])}")
            for file in results["kept_files"]:
                console.print(f"    • {file}")


@app.command()
def info(
    project_path: str = typer.Argument(
        ".",
        help="Path to the DevOps project to analyze"
    ),
    detailed: bool = typer.Option(
        False,
        "--detailed",
        help="Show detailed file-by-file analysis"
    ),
) -> None:
    """Show detailed information and statistics about a DevOps project"""
    project_path = Path(project_path).resolve()
    
    if not project_path.exists():
        console.print(f"[red]❌ Project path '{project_path}' does not exist[/red]")
        raise typer.Exit(1)
    
    console.print(Panel.fit(
        "[bold blue]📊 Project Information[/bold blue]\n"
        "[dim]Detailed analysis of DevOps project structure and components[/dim]",
        border_style="blue"
    ))
    
    # Gather project information
    project_stats = _analyze_project(project_path, detailed)
    
    # Display results
    _display_project_info(project_stats, detailed)


def _analyze_project(project_path: Path, detailed: bool) -> dict:
    """Analyze the project and return comprehensive statistics"""
    stats = {
        "project_name": project_path.name,
        "project_path": project_path,
        "total_size": 0,
        "file_count": 0,
        "directory_count": 0,
        "components": {
            "ci_cd": {"files": [], "size": 0, "platforms": []},
            "infrastructure": {"files": [], "size": 0, "tools": []},
            "deployment": {"files": [], "size": 0, "methods": []},
            "monitoring": {"files": [], "size": 0, "types": []},
            "security": {"files": [], "size": 0, "levels": []},
            "containers": {"files": [], "size": 0},
            "kubernetes": {"files": [], "size": 0},
            "scripts": {"files": [], "size": 0},
        },
        "languages": {},
        "file_types": {},
        "largest_files": [],
        "recent_files": [],
        "devops_score": 0,
        "recommendations": []
    }
    
    try:
        # Analyze all files and directories
        for item in project_path.rglob("*"):
            if item.is_file():
                file_size = item.stat().st_size
                relative_path = item.relative_to(project_path)
                file_ext = item.suffix.lower()
                
                stats["file_count"] += 1
                stats["total_size"] += file_size
                
                # Track file types
                if file_ext:
                    stats["file_types"][file_ext] = stats["file_types"].get(file_ext, 0) + 1
                
                # Track programming languages
                if file_ext in [".py", ".js", ".ts", ".go", ".java", ".rs", ".rb", ".php"]:
                    stats["languages"][file_ext] = stats["languages"].get(file_ext, 0) + 1
                
                # Categorize DevOps components
                category = _categorize_file(relative_path)
                if category:
                    comp = stats["components"][category]
                    comp["files"].append(relative_path)
                    comp["size"] += file_size
                    
                    # Extract specific tool/platform info
                    if category == "ci_cd":
                        if "github" in str(relative_path).lower():
                            comp["platforms"].append("GitHub Actions")
                        elif "gitlab" in str(relative_path).lower():
                            comp["platforms"].append("GitLab CI")
                        elif "jenkins" in str(relative_path).lower():
                            comp["platforms"].append("Jenkins")
                    
                    elif category == "infrastructure":
                        if "terraform" in str(relative_path).lower():
                            comp["tools"].append("Terraform")
                        elif "cloudformation" in str(relative_path).lower():
                            comp["tools"].append("CloudFormation")
                    
                    elif category == "deployment":
                        if "docker" in str(relative_path).lower():
                            comp["methods"].append("Docker")
                        elif "k8s" in str(relative_path).lower() or "kubernetes" in str(relative_path).lower():
                            comp["methods"].append("Kubernetes")
                
                # Track largest files
                if len(stats["largest_files"]) < 10:
                    stats["largest_files"].append((relative_path, file_size))
                else:
                    stats["largest_files"].sort(key=lambda x: x[1], reverse=True)
                    if file_size > stats["largest_files"][-1][1]:
                        stats["largest_files"][-1] = (relative_path, file_size)
                
                # Track recent files (by modification time)
                if len(stats["recent_files"]) < 10:
                    stats["recent_files"].append((relative_path, item.stat().st_mtime))
                else:
                    stats["recent_files"].sort(key=lambda x: x[1], reverse=True)
                    if item.stat().st_mtime > stats["recent_files"][-1][1]:
                        stats["recent_files"][-1] = (relative_path, item.stat().st_mtime)
            
            elif item.is_dir() and item != project_path:
                stats["directory_count"] += 1
        
        # Calculate DevOps maturity score
        stats["devops_score"] = _calculate_devops_score(stats["components"])
        
        # Generate recommendations
        stats["recommendations"] = _generate_recommendations(stats)
        
        # Sort lists for display
        stats["largest_files"].sort(key=lambda x: x[1], reverse=True)
        stats["recent_files"].sort(key=lambda x: x[1], reverse=True)
    
    except Exception as e:
        console.print(f"[yellow]⚠️  Error analyzing project: {str(e)}[/yellow]")
    
    return stats


def _categorize_file(file_path: Path) -> Optional[str]:
    """Categorize a file into DevOps components"""
    path_str = str(file_path).lower()
    
    if "ci" in path_str or any(x in path_str for x in ["github", "gitlab", "jenkins"]):
        return "ci_cd"
    elif "infra" in path_str or any(x in path_str for x in ["terraform", "cloudformation"]):
        return "infrastructure"
    elif "deploy" in path_str or any(x in path_str for x in ["dockerfile", "docker-compose", "k8s", "kubernetes"]):
        return "deployment"
    elif "monitoring" in path_str or any(x in path_str for x in ["prometheus", "grafana", "alert", "metric", "log"]):
        return "monitoring"
    elif "security" in path_str or any(x in path_str for x in ["vault", "secret", "scan", "policy"]):
        return "security"
    elif "container" in path_str or "dockerfile" in path_str:
        return "containers"
    elif "k8s" in path_str or "kubernetes" in path_str:
        return "kubernetes"
    elif "script" in path_str or file_path.suffix in [".sh", ".py", ".bat"]:
        return "scripts"
    
    return None


def _calculate_devops_score(components: dict) -> int:
    """Calculate a DevOps maturity score based on components present"""
    score = 0
    max_score = 100
    
    # Base scores for each component category
    category_scores = {
        "ci_cd": 20,
        "infrastructure": 15,
        "deployment": 20,
        "monitoring": 15,
        "security": 15,
        "containers": 10,
        "kubernetes": 5,
    }
    
    for category, weight in category_scores.items():
        comp = components.get(category, {})
        if comp["files"]:
            # Give partial credit based on number of files
            file_count = len(comp["files"])
            category_score = min(weight, weight * (file_count / 3))  # Max score at 3+ files
            score += int(category_score)
    
    return min(score, max_score)


def _generate_recommendations(stats: dict) -> list:
    """Generate recommendations based on project analysis"""
    recommendations = []
    
    # Check for missing components
    components = stats["components"]
    
    if not components["ci_cd"]["files"]:
        recommendations.append("🔄 Add CI/CD pipelines for automated testing and deployment")
    
    if not components["infrastructure"]["files"]:
        recommendations.append("🏗️  Add Infrastructure as Code (Terraform/CloudFormation)")
    
    if not components["monitoring"]["files"]:
        recommendations.append("📊 Add monitoring and observability (logs, metrics, alerts)")
    
    if not components["security"]["files"]:
        recommendations.append("🔒 Add security scanning and policies")
    
    if not components["containers"]["files"] and not components["kubernetes"]["files"]:
        recommendations.append("🐳 Consider containerization with Docker")
    
    # Check for optimization opportunities
    if stats["total_size"] > 50 * 1024 * 1024:  # > 50MB
        recommendations.append("📦 Consider optimizing large files or using .gitignore")
    
    if len(stats["languages"]) > 5:
        recommendations.append("🔧 Consider standardizing on fewer programming languages")
    
    # DevOps score based recommendations
    if stats["devops_score"] < 40:
        recommendations.append("🚀 Your project is in early DevOps adoption - consider adding more automation")
    elif stats["devops_score"] < 70:
        recommendations.append("⚡ Good DevOps foundation - consider advanced monitoring and security")
    else:
        recommendations.append("🎉 Excellent DevOps maturity! Consider sharing your practices")
    
    return recommendations


def _display_project_info(stats: dict, detailed: bool) -> None:
    """Display comprehensive project information"""
    # Basic stats
    console.print(f"\n[bold]📋 Project Overview:[/bold]")
    console.print(f"  Name: {stats['project_name']}")
    console.print(f"  Path: {stats['project_path']}")
    console.print(f"  Size: {stats['total_size'] / (1024*1024):.2f} MB")
    console.print(f"  Files: {stats['file_count']}")
    console.print(f"  Directories: {stats['directory_count']}")
    console.print(f"  DevOps Maturity Score: {stats['devops_score']}/100")
    
    # DevOps components
    console.print(f"\n[bold]🔧 DevOps Components:[/bold]")
    for comp_name, comp_data in stats["components"].items():
        if comp_data["files"]:
            comp_display = comp_name.replace("_", "-").title()
            console.print(f"  {comp_display}: {len(comp_data['files'])} files ({comp_data['size'] / 1024:.1f} KB)")
            
            # Show specific tools/platforms
            if comp_name == "ci_cd" and comp_data["platforms"]:
                platforms = list(set(comp_data["platforms"]))
                console.print(f"    Platforms: {', '.join(platforms)}")
            elif comp_name == "infrastructure" and comp_data["tools"]:
                tools = list(set(comp_data["tools"]))
                console.print(f"    Tools: {', '.join(tools)}")
            elif comp_name == "deployment" and comp_data["methods"]:
                methods = list(set(comp_data["methods"]))
                console.print(f"    Methods: {', '.join(methods)}")
    
    # Languages and file types
    if stats["languages"]:
        console.print(f"\n[bold]💻 Programming Languages:[/bold]")
        for lang, count in sorted(stats["languages"].items(), key=lambda x: x[1], reverse=True):
            lang_name = lang[1:].upper()  # Remove dot and capitalize
            console.print(f"  {lang_name}: {count} files")
    
    if stats["file_types"]:
        console.print(f"\n[bold]📄 File Types:[/bold]")
        for ftype, count in sorted(stats["file_types"].items(), key=lambda x: x[1], reverse=True)[:10]:
            console.print(f"  {ftype or 'no extension'}: {count} files")
    
    # Recommendations
    if stats["recommendations"]:
        console.print(f"\n[bold]💡 Recommendations:[/bold]")
        for rec in stats["recommendations"]:
            console.print(f"  {rec}")
    
    # Detailed analysis
    if detailed:
        console.print(f"\n[bold]🔍 Detailed Analysis:[/bold]")
        
        if stats["largest_files"]:
            console.print(f"\n[dim]Largest files:[/dim]")
            for file_path, size in stats["largest_files"][:5]:
                console.print(f"  {file_path} ({size / 1024:.1f} KB)")
        
        if stats["recent_files"]:
            console.print(f"\n[dim]Recently modified files:[/dim]")
            for file_path, mtime in stats["recent_files"][:5]:
                import datetime
                mod_time = datetime.datetime.fromtimestamp(mtime)
                console.print(f"  {file_path} ({mod_time.strftime('%Y-%m-%d %H:%M')})")


@app.command()
def template(
    action: str = typer.Argument(
        "list",
        help="Action: list, create, customize, or export"
    ),
    template_name: Optional[str] = typer.Option(
        None,
        "--name",
        help="Template name for create/customize actions"
    ),
    output_dir: Optional[str] = typer.Option(
        None,
        "--output",
        help="Output directory for exported templates"
    ),
) -> None:
    """Manage and customize project templates"""
    if action == "list":
        _list_available_templates()
    elif action == "create":
        if not template_name:
            console.print("[red]❌ Template name required for create action[/red]")
            console.print("[yellow]Usage: devops-project-generator template create --name <template-name>[/yellow]")
            raise typer.Exit(1)
        _create_custom_template(template_name)
    elif action == "customize":
        if not template_name:
            console.print("[red]❌ Template name required for customize action[/red]")
            console.print("[yellow]Usage: devops-project-generator template customize --name <template-name>[/yellow]")
            raise typer.Exit(1)
        _customize_template(template_name)
    elif action == "export":
        if not output_dir:
            console.print("[red]❌ Output directory required for export action[/red]")
            console.print("[yellow]Usage: devops-project-generator template export --output <directory>[/yellow]")
            raise typer.Exit(1)
        _export_templates(output_dir)
    else:
        console.print(f"[red]❌ Unknown action: {action}[/red]")
        console.print("[yellow]Available actions: list, create, customize, export[/yellow]")
        raise typer.Exit(1)


def _list_available_templates() -> None:
    """List all available templates"""
    console.print(Panel.fit(
        "[bold blue]📋 Available Templates[/bold blue]\n"
        "[dim]Built-in templates for different DevOps configurations[/dim]",
        border_style="blue"
    ))
    
    template_categories = {
        "CI/CD": {
            "github-actions": "GitHub Actions workflows with multi-stage pipelines",
            "gitlab-ci": "GitLab CI/CD with auto-deployment",
            "jenkins": "Jenkins pipelines with Docker integration",
            "azure-pipelines": "Azure DevOps pipelines with YAML"
        },
        "Infrastructure": {
            "terraform": "Terraform modules for multi-cloud deployment",
            "cloudformation": "AWS CloudFormation templates",
            " pulumi": "Pulumi infrastructure as code",
            "ansible": "Ansible playbooks for configuration management"
        },
        "Deployment": {
            "kubernetes": "K8s manifests with Helm charts",
            "docker": "Docker containers with compose files",
            "serverless": "AWS Lambda and serverless functions",
            "static": "Static site deployment with CDN"
        },
        "Monitoring": {
            "prometheus": "Prometheus + Grafana monitoring stack",
            "datadog": "Datadog APM and monitoring",
            "elasticsearch": "ELK stack for logging and analytics",
            "cloudwatch": "AWS CloudWatch monitoring"
        },
        "Security": {
            "owasp": "OWASP security scanning and policies",
            "vault": "HashiCorp Vault secrets management",
            "cert-manager": "SSL certificate automation",
            "istio": "Service mesh security policies"
        }
    }
    
    for category, templates in template_categories.items():
        console.print(f"\n[bold]{category}:[/bold]")
        table = Table()
        table.add_column("Template", style="cyan")
        table.add_column("Description")
        
        for name, description in templates.items():
            table.add_row(name, description)
        
        console.print(table)


def _create_custom_template(template_name: str) -> None:
    """Create a new custom template"""
    console.print(f"[blue]📝 Creating custom template: {template_name}[/blue]")
    
    template_dir = Path.home() / ".devops-generator" / "templates" / template_name
    template_dir.mkdir(parents=True, exist_ok=True)
    
    # Create template structure
    subdirs = ["ci", "infra", "deploy", "monitoring", "security", "app"]
    for subdir in subdirs:
        (template_dir / subdir).mkdir(exist_ok=True)
    
    # Create template metadata
    metadata = {
        "name": template_name,
        "version": "1.0.0",
        "description": f"Custom template: {template_name}",
        "author": "Custom User",
        "created": datetime.datetime.now().isoformat(),
        "components": {
            "ci": ["github-actions"],
            "infra": ["terraform"],
            "deploy": ["kubernetes"],
            "monitoring": ["prometheus"],
            "security": ["owasp"]
        },
        "variables": {
            "project_name": "string",
            "environment": "string",
            "cloud_provider": "string",
            "docker_registry": "string"
        }
    }
    
    metadata_file = template_dir / "template.yaml"
    with open(metadata_file, "w", encoding="utf-8") as f:
        yaml.dump(metadata, f, default_flow_style=False)
    
    # Create sample files
    sample_files = {
        "ci/github-actions.yml.j2": """# GitHub Actions Workflow for {{ project_name }}
name: {{ environment }}-pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Run tests
      run: echo "Running tests for {{ project_name }}"
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - name: Deploy to {{ environment }}
      run: echo "Deploying to {{ environment }}"

""",
        "infra/main.tf.j2": """# Terraform configuration for {{ project_name }}
provider "{{ cloud_provider }}" {
  region = var.region
}

variable "project_name" {
  description = "Project name"
  default = "{{ project_name }}"
}

variable "environment" {
  description = "Environment"
  default = "{{ environment }}"
}

# Add your infrastructure resources here
""",
        "deploy/k8s-deployment.yaml.j2": """# Kubernetes deployment for {{ project_name }}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ project_name }}
  namespace: {{ environment }}
spec:
  replicas: 3
  selector:
    matchLabels:
      app: {{ project_name }}
  template:
    metadata:
      labels:
        app: {{ project_name }}
    spec:
      containers:
      - name: {{ project_name }}
        image: {{ docker_registry }}/{{ project_name }}:latest
        ports:
        - containerPort: 8080
"""
    }
    
    for file_path, content in sample_files.items():
        full_path = template_dir / file_path
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
    
    console.print(f"[green]✅ Custom template created: {template_dir}[/green]")
    console.print("[yellow]💡 Edit the template files to customize your project structure[/yellow]")


def _customize_template(template_name: str) -> None:
    """Customize an existing template"""
    template_dir = Path.home() / ".devops-generator" / "templates" / template_name
    
    if not template_dir.exists():
        console.print(f"[red]❌ Template '{template_name}' not found[/red]")
        console.print(f"[yellow]Available templates in: {template_dir.parent}[/yellow]")
        raise typer.Exit(1)
    
    console.print(f"[blue]🔧 Customizing template: {template_name}[/blue]")
    
    # Show template structure
    console.print(f"\n[dim]Template structure:[/dim]")
    for item in template_dir.rglob("*"):
        if item.is_file():
            relative_path = item.relative_to(template_dir)
            console.print(f"  📄 {relative_path}")
    
    console.print(f"\n[yellow]💡 Edit files in: {template_dir}[/yellow]")
    console.print("[dim]Use .j2 extension for Jinja2 templates[/dim]")


def _export_templates(output_dir: str) -> None:
    """Export built-in templates to a directory"""
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    console.print(f"[blue]📤 Exporting templates to: {output_path}[/blue]")
    
    # Get the built-in templates directory
    builtin_templates = Path(__file__).parent.parent / "templates"
    
    if builtin_templates.exists():
        import shutil
        export_dir = output_path / "builtin-templates"
        shutil.copytree(builtin_templates, export_dir, dirs_exist_ok=True)
        console.print(f"[green]✅ Built-in templates exported to: {export_dir}[/green]")
    else:
        console.print("[yellow]⚠️  Built-in templates directory not found[/yellow]")
    
    # Export custom templates if they exist
    custom_templates_dir = Path.home() / ".devops-generator" / "templates"
    if custom_templates_dir.exists():
        custom_export_dir = output_path / "custom-templates"
        shutil.copytree(custom_templates_dir, custom_export_dir, dirs_exist_ok=True)
        console.print(f"[green]✅ Custom templates exported to: {custom_export_dir}[/green]")


@app.command()
def backup(
    action: str = typer.Argument(
        "create",
        help="Action: create, restore, or list"
    ),
    project_path: str = typer.Argument(
        ".",
        help="Path to the DevOps project"
    ),
    backup_file: Optional[str] = typer.Option(
        None,
        "--file",
        help="Backup file path for restore action"
    ),
    include_config: bool = typer.Option(
        True,
        "--include-config/--no-config",
        help="Include configuration files in backup"
    ),
    compress: bool = typer.Option(
        True,
        "--compress/--no-compress",
        help="Compress backup file"
    ),
) -> None:
    """Create and restore project backups"""
    project_path = Path(project_path).resolve()
    
    if action == "create":
        _create_backup(project_path, include_config, compress)
    elif action == "restore":
        if not backup_file:
            console.print("[red]❌ Backup file required for restore action[/red]")
            console.print("[yellow]Usage: devops-project-generator backup restore --file <backup-file>[/yellow]")
            raise typer.Exit(1)
        _restore_backup(project_path, backup_file)
    elif action == "list":
        _list_backups()
    else:
        console.print(f"[red]❌ Unknown action: {action}[/red]")
        console.print("[yellow]Available actions: create, restore, list[/yellow]")
        raise typer.Exit(1)


def _create_backup(project_path: Path, include_config: bool, compress: bool) -> None:
    """Create a backup of the project"""
    if not project_path.exists():
        console.print(f"[red]❌ Project path '{project_path}' does not exist[/red]")
        raise typer.Exit(1)
    
    console.print(Panel.fit(
        "[bold blue]💾 Creating Project Backup[/bold blue]\n"
        "[dim]Archive project files and configuration[/dim]",
        border_style="blue"
    ))
    
    # Generate backup filename
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_name = f"{project_path.name}_backup_{timestamp}"
    
    if compress:
        backup_file = project_path.parent / f"{backup_name}.tar.gz"
    else:
        backup_file = project_path.parent / f"{backup_name}.tar"
    
    console.print(f"[blue]📦 Creating backup: {backup_file.name}[/blue]")
    
    try:
        import tarfile
        
        with tarfile.open(backup_file, "w:gz" if compress else "w") as tar:
            # Add project files
            for item in project_path.rglob("*"):
                if item.is_file():
                    # Skip certain files if not including config
                    if not include_config and any(pattern in item.name for pattern in [".env", "secret", "key"]):
                        continue
                    
                    arcname = str(item.relative_to(project_path.parent))
                    tar.add(item, arcname=arcname)
        
        # Create backup metadata
        backup_info = {
            "project_name": project_path.name,
            "created": datetime.datetime.now().isoformat(),
            "size_bytes": backup_file.stat().st_size,
            "include_config": include_config,
            "compressed": compress,
            "file_count": len(list(project_path.rglob("*"))),
            "version": "1.2.0"
        }
        
        metadata_file = backup_file.with_suffix(".json")
        with open(metadata_file, "w", encoding="utf-8") as f:
            json.dump(backup_info, f, indent=2)
        
        size_mb = backup_file.stat().st_size / (1024 * 1024)
        console.print(f"[green]✅ Backup created successfully![/green]")
        console.print(f"  File: {backup_file.name}")
        console.print(f"  Size: {size_mb:.2f} MB")
        console.print(f"  Files: {backup_info['file_count']}")
        
    except Exception as e:
        console.print(f"[red]❌ Backup failed: {str(e)}[/red]")
        raise typer.Exit(1)


def _restore_backup(project_path: Path, backup_file: str) -> None:
    """Restore a project from backup"""
    backup_path = Path(backup_file)
    
    if not backup_path.exists():
        console.print(f"[red]❌ Backup file '{backup_file}' does not exist[/red]")
        raise typer.Exit(1)
    
    # Check for metadata file
    metadata_file = backup_path.with_suffix(".json")
    if metadata_file.exists():
        with open(metadata_file, "r", encoding="utf-8") as f:
            backup_info = json.load(f)
        
        console.print(Panel.fit(
            f"[bold blue]🔄 Restoring Project Backup[/bold blue]\n"
            f"[dim]Project: {backup_info.get('project_name', 'Unknown')}[/dim]\n"
            f"[dim]Created: {backup_info.get('created', 'Unknown')}[/dim]",
            border_style="blue"
        ))
    else:
        console.print(Panel.fit(
            "[bold blue]🔄 Restoring Project Backup[/bold blue]\n"
            "[dim]Backup information not available[/dim]",
            border_style="blue"
        ))
    
    # Check if project directory already exists
    if project_path.exists():
        console.print(f"[yellow]⚠️  Project directory '{project_path.name}' already exists[/yellow]")
        if not typer.confirm("Continue and overwrite?"):
            console.print("[dim]Operation cancelled.[/dim]")
            raise typer.Exit(0)
        
        # Remove existing directory
        shutil.rmtree(project_path)
    
    console.print(f"[blue]📦 Restoring from: {backup_path.name}[/blue]")
    
    try:
        import tarfile
        
        with tarfile.open(backup_path, "r:*") as tar:
            tar.extractall(project_path.parent)
        
        console.print(f"[green]✅ Project restored successfully![/green]")
        console.print(f"  Location: {project_path}")
        console.print(f"[yellow]💡 Run 'devops-project-generator validate {project_path.name}' to check the project[/yellow]")
        
    except Exception as e:
        console.print(f"[red]❌ Restore failed: {str(e)}[/red]")
        raise typer.Exit(1)


def _list_backups() -> None:
    """List all available backups"""
    console.print(Panel.fit(
        "[bold blue]📋 Available Backups[/bold blue]\n"
        "[dim]Project backups in current directory[/dim]",
        border_style="blue"
    ))
    
    current_dir = Path.cwd()
    backup_files = []
    
    # Find backup files
    for item in current_dir.glob("*backup*.tar*"):
        if item.is_file():
            backup_files.append(item)
    
    if not backup_files:
        console.print("[yellow]No backup files found in current directory[/yellow]")
        return
    
    console.print()
    table = Table()
    table.add_column("Backup File", style="cyan")
    table.add_column("Size", style="green")
    table.add_column("Created", style="blue")
    table.add_column("Project", style="yellow")
    
    for backup_file in sorted(backup_files, key=lambda x: x.stat().st_mtime, reverse=True):
        size_mb = backup_file.stat().st_size / (1024 * 1024)
        mtime = datetime.datetime.fromtimestamp(backup_file.stat().st_mtime)
        
        # Try to get project name from filename
        project_name = backup_file.name.split("_backup_")[0] if "_backup_" in backup_file.name else "Unknown"
        
        # Check for metadata
        metadata_file = backup_file.with_suffix(".json")
        created = mtime.strftime("%Y-%m-%d %H:%M")
        
        if metadata_file.exists():
            try:
                with open(metadata_file, "r", encoding="utf-8") as f:
                    metadata = json.load(f)
                project_name = metadata.get("project_name", project_name)
                created = metadata.get("created", created)
                if isinstance(created, str):
                    created = created[:16]  # Just date and time
            except:
                pass
        
        table.add_row(
            backup_file.name,
            f"{size_mb:.1f} MB",
            created,
            project_name
        )
    
    console.print(table)


@app.command()
def health(
    project_path: str = typer.Argument(
        ".",
        help="Path to the DevOps project to check"
    ),
    detailed: bool = typer.Option(
        False,
        "--detailed",
        help="Show detailed health analysis"
    ),
    fix: bool = typer.Option(
        False,
        "--fix",
        help="Attempt to fix health issues automatically"
    ),
) -> None:
    """Perform comprehensive health check on DevOps project"""
    project_path = Path(project_path).resolve()
    
    if not project_path.exists():
        console.print(f"[red]❌ Project path '{project_path}' does not exist[/red]")
        raise typer.Exit(1)
    
    console.print(Panel.fit(
        "[bold blue]🏥 Project Health Check[/bold blue]\n"
        "[dim]Comprehensive analysis of project health and best practices[/dim]",
        border_style="blue"
    ))
    
    # Perform health check
    health_report = _perform_health_check(project_path, detailed)
    
    # Display results
    _display_health_report(health_report, detailed)
    
    # Auto-fix if requested
    if fix and health_report["fixable_issues"]:
        console.print("\n[yellow]🔧 Attempting to fix health issues...[/yellow]")
        _fix_health_issues(project_path, health_report["fixable_issues"])
    
    # Overall health score
    _display_health_score(health_report)


def _perform_health_check(project_path: Path, detailed: bool) -> dict:
    """Perform comprehensive health check"""
    report = {
        "overall_score": 0,
        "categories": {
            "structure": {"score": 0, "issues": [], "fixable_issues": [], "checks_passed": []},
            "security": {"score": 0, "issues": [], "fixable_issues": [], "checks_passed": []},
            "performance": {"score": 0, "issues": [], "fixable_issues": [], "checks_passed": []},
            "maintenance": {"score": 0, "issues": [], "fixable_issues": [], "checks_passed": []},
            "documentation": {"score": 0, "issues": [], "fixable_issues": [], "checks_passed": []}
        },
        "recommendations": [],
        "critical_issues": [],
        "fixable_issues": []
    }
    
    # Structure health
    _check_structure_health(project_path, report["categories"]["structure"])
    
    # Security health
    _check_security_health(project_path, report["categories"]["security"])
    
    # Performance health
    _check_performance_health(project_path, report["categories"]["performance"])
    
    # Maintenance health
    _check_maintenance_health(project_path, report["categories"]["maintenance"])
    
    # Documentation health
    _check_documentation_health(project_path, report["categories"]["documentation"])
    
    # Calculate overall score
    total_score = sum(cat["score"] for cat in report["categories"].values())
    report["overall_score"] = total_score // len(report["categories"])
    
    # Collect all issues
    for category in report["categories"].values():
        report["critical_issues"].extend([issue for issue in category["issues"] if "critical" in issue.lower()])
        report["fixable_issues"].extend(category["fixable_issues"])
    
    # Generate recommendations
    report["recommendations"] = _generate_health_recommendations(report)
    
    return report


def _check_structure_health(project_path: Path, structure: dict) -> None:
    """Check project structure health"""
    checks = {
        "required_dirs": ["app", "ci", "infra", "deploy", "monitoring", "security"],
        "required_files": ["README.md", "Makefile", ".gitignore"],
        "recommended_dirs": ["scripts", "docs", "tests"],
        "recommended_files": ["Dockerfile", "docker-compose.yml"]
    }
    
    score = 100
    
    # Check required directories
    for dir_name in checks["required_dirs"]:
        dir_path = project_path / dir_name
        if dir_path.exists():
            structure["checks_passed"].append(f"✅ {dir_name}/ directory exists")
        else:
            structure["issues"].append(f"❌ Missing required {dir_name}/ directory")
            structure["fixable_issues"].append(("create_dir", dir_name))
            score -= 15
    
    # Check required files
    for file_name in checks["required_files"]:
        file_path = project_path / file_name
        if file_path.exists():
            structure["checks_passed"].append(f"✅ {file_name} exists")
        else:
            structure["issues"].append(f"❌ Missing required {file_name}")
            if file_name == "README.md":
                structure["fixable_issues"].append(("create_readme", None))
            elif file_name == "Makefile":
                structure["fixable_issues"].append(("create_makefile", None))
            elif file_name == ".gitignore":
                structure["fixable_issues"].append(("create_gitignore", None))
            score -= 10
    
    # Check recommended items
    for dir_name in checks["recommended_dirs"]:
        dir_path = project_path / dir_name
        if dir_path.exists():
            structure["checks_passed"].append(f"✅ {dir_name}/ directory exists")
        else:
            structure["issues"].append(f"⚠️  Consider adding {dir_name}/ directory")
            score -= 5
    
    structure["score"] = max(0, score)


def _check_security_health(project_path: Path, security: dict) -> None:
    """Check security health"""
    score = 100
    
    # Check for secrets
    secret_patterns = [".env", "secret", "key", "password", "token"]
    for item in project_path.rglob("*"):
        if item.is_file() and any(pattern in item.name.lower() for pattern in secret_patterns):
            if item.suffix in [".txt", ".yml", ".yaml", ".json", ".env"]:
                security["issues"].append(f"🔒 Potential secret file: {item.relative_to(project_path)}")
                score -= 20
    
    # Check for security directories
    security_dir = project_path / "security"
    if security_dir.exists():
        security["checks_passed"].append("✅ Security directory exists")
        security_files = list(security_dir.rglob("*.yml")) + list(security_dir.rglob("*.yaml"))
        if security_files:
            security["checks_passed"].append(f"✅ Found {len(security_files)} security configuration files")
        else:
            security["issues"].append("⚠️  Security directory exists but no configuration files")
            score -= 10
    else:
        security["issues"].append("❌ No security configuration found")
        score -= 25
    
    # Check .gitignore for sensitive files
    gitignore_path = project_path / ".gitignore"
    if gitignore_path.exists():
        with open(gitignore_path, "r", encoding="utf-8") as f:
            gitignore_content = f.read().lower()
        
        ignored_patterns = [".env", "secret", "key", "*.pem", "*.p12"]
        ignored_count = sum(1 for pattern in ignored_patterns if pattern in gitignore_content)
        
        if ignored_count >= 3:
            security["checks_passed"].append("✅ .gitignore properly excludes sensitive files")
        else:
            security["issues"].append("⚠️  .gitignore may not exclude all sensitive files")
            security["fixable_issues"].append(("update_gitignore", None))
            score -= 15
    else:
        security["issues"].append("❌ No .gitignore file found")
        score -= 20
    
    security["score"] = max(0, score)


def _check_performance_health(project_path: Path, performance: dict) -> None:
    """Check performance-related health"""
    score = 100
    
    # Check for Docker files
    docker_files = ["Dockerfile", "docker-compose.yml", "docker-compose.yaml"]
    docker_found = any((project_path / f).exists() for f in docker_files)
    
    if docker_found:
        performance["checks_passed"].append("✅ Containerization files found")
    else:
        performance["issues"].append("⚠️  No containerization files found")
        performance["fixable_issues"].append(("create_dockerfile", None))
        score -= 15
    
    # Check for CI/CD optimization
    ci_dir = project_path / "ci"
    if ci_dir.exists():
        ci_files = list(ci_dir.rglob("*.yml")) + list(ci_dir.rglob("*.yaml"))
        if ci_files:
            performance["checks_passed"].append("✅ CI/CD configuration found")
            
            # Check for caching in CI files
            cache_found = False
            for ci_file in ci_files:
                try:
                    with open(ci_file, "r", encoding="utf-8") as f:
                        content = f.read().lower()
                        if "cache" in content:
                            cache_found = True
                            break
                except:
                    pass
            
            if cache_found:
                performance["checks_passed"].append("✅ CI/CD caching configured")
            else:
                performance["issues"].append("⚠️  Consider adding CI/CD caching for better performance")
                score -= 10
        else:
            performance["issues"].append("❌ CI/CD directory exists but no configuration files")
            score -= 20
    
    # Check project size
    total_size = sum(f.stat().st_size for f in project_path.rglob("*") if f.is_file())
    size_mb = total_size / (1024 * 1024)
    
    if size_mb > 100:
        performance["issues"].append(f"⚠️  Large project size: {size_mb:.1f} MB")
        performance["fixable_issues"].append(("optimize_size", None))
        score -= 10
    else:
        performance["checks_passed"].append(f"✅ Reasonable project size: {size_mb:.1f} MB")
    
    performance["score"] = max(0, score)


def _check_maintenance_health(project_path: Path, maintenance: dict) -> None:
    """Check maintenance-related health"""
    score = 100
    
    # Check for automation scripts
    scripts_dir = project_path / "scripts"
    if scripts_dir.exists():
        script_files = list(scripts_dir.rglob("*.sh")) + list(scripts_dir.rglob("*.py"))
        if script_files:
            maintenance["checks_passed"].append(f"✅ Found {len(script_files)} automation scripts")
        else:
            maintenance["issues"].append("⚠️  Scripts directory exists but no scripts found")
            score -= 10
    else:
        maintenance["issues"].append("⚠️  No automation scripts directory")
        maintenance["fixable_issues"].append(("create_scripts_dir", None))
        score -= 15
    
    # Check for Makefile targets
    makefile_path = project_path / "Makefile"
    if makefile_path.exists():
        try:
            with open(makefile_path, "r", encoding="utf-8") as f:
                makefile_content = f.read()
            
            common_targets = ["build", "deploy", "test", "clean"]
            found_targets = [target for target in common_targets if f"{target}:" in makefile_content]
            
            if len(found_targets) >= 3:
                maintenance["checks_passed"].append(f"✅ Makefile has {len(found_targets)} common targets")
            else:
                maintenance["issues"].append(f"⚠️  Makefile has only {len(found_targets)} common targets")
                score -= 10
        except:
            maintenance["issues"].append("❌ Error reading Makefile")
            score -= 5
    
    # Check for recent activity
    import time
    current_time = time.time()
    recent_files = []
    
    for item in project_path.rglob("*"):
        if item.is_file():
            file_age = current_time - item.stat().st_mtime
            if file_age < 7 * 24 * 60 * 60:  # Less than 7 days
                recent_files.append(item)
    
    if len(recent_files) >= 3:
        maintenance["checks_passed"].append(f"✅ Recent activity: {len(recent_files)} files modified in last 7 days")
    else:
        maintenance["issues"].append("⚠️  Low recent activity - project may need maintenance")
        score -= 10
    
    maintenance["score"] = max(0, score)


def _check_documentation_health(project_path: Path, documentation: dict) -> None:
    """Check documentation health"""
    score = 100
    
    # Check README quality
    readme_path = project_path / "README.md"
    if readme_path.exists():
        try:
            with open(readme_path, "r", encoding="utf-8") as f:
                readme_content = f.read()
            
            readme_size = len(readme_content)
            sections = ["#", "##", "###"]
            section_count = sum(readme_content.count(section) for section in sections)
            
            if readme_size > 1000 and section_count >= 5:
                documentation["checks_passed"].append("✅ Comprehensive README documentation")
            elif readme_size > 500:
                documentation["issues"].append("⚠️  README could be more detailed")
                score -= 10
            else:
                documentation["issues"].append("❌ README is too short")
                documentation["fixable_issues"].append(("enhance_readme", None))
                score -= 20
        except:
            documentation["issues"].append("❌ Error reading README")
            score -= 15
    else:
        documentation["issues"].append("❌ No README.md file found")
        score -= 30
    
    # Check for additional documentation
    docs_dir = project_path / "docs"
    if docs_dir.exists():
        doc_files = list(docs_dir.rglob("*.md")) + list(docs_dir.rglob("*.txt"))
        if doc_files:
            documentation["checks_passed"].append(f"✅ Found {len(doc_files)} additional documentation files")
        else:
            documentation["issues"].append("⚠️  docs directory exists but no documentation files")
            score -= 5
    else:
        documentation["issues"].append("⚠️  No docs directory found")
        score -= 10
    
    # Check for inline documentation
    code_files = []
    for ext in [".py", ".js", ".ts", ".go", ".java"]:
        code_files.extend(project_path.rglob(f"*{ext}"))
    
    documented_files = 0
    for code_file in code_files[:20]:  # Check first 20 files
        try:
            with open(code_file, "r", encoding="utf-8") as f:
                content = f.read()
                if any(marker in content for marker in ["#", "//", "/*", "*"]):
                    documented_files += 1
        except:
            pass
    
    if code_files and documented_files / len(code_files) > 0.7:
        documentation["checks_passed"].append("✅ Good inline documentation coverage")
    elif code_files:
        documentation["issues"].append("⚠️  Consider adding more inline documentation")
        score -= 10
    
    documentation["score"] = max(0, score)


def _generate_health_recommendations(report: dict) -> list:
    """Generate health improvement recommendations"""
    recommendations = []
    
    if report["overall_score"] < 60:
        recommendations.append("🚨 Project needs significant improvement - focus on critical issues first")
    elif report["overall_score"] < 80:
        recommendations.append("⚡ Good foundation - address the identified issues to reach excellence")
    else:
        recommendations.append("🎉 Excellent project health! Consider sharing your practices")
    
    # Category-specific recommendations
    for category_name, category_data in report["categories"].items():
        if category_data["score"] < 70:
            if category_name == "structure":
                recommendations.append("🏗️  Improve project structure with missing directories and files")
            elif category_name == "security":
                recommendations.append("🔒 Enhance security with proper secrets management and policies")
            elif category_name == "performance":
                recommendations.append("⚡ Optimize performance with caching and containerization")
            elif category_name == "maintenance":
                recommendations.append("🔧 Add automation scripts and improve maintainability")
            elif category_name == "documentation":
                recommendations.append("📚 Enhance documentation for better project understanding")
    
    return recommendations


def _display_health_report(report: dict, detailed: bool) -> None:
    """Display comprehensive health report"""
    console.print(f"\n[bold]🏥 Overall Health Score: {report['overall_score']}/100[/bold]")
    
    # Health score color coding
    if report["overall_score"] >= 80:
        console.print("[green]✅ Excellent project health[/green]")
    elif report["overall_score"] >= 60:
        console.print("[yellow]⚠️  Good project health with room for improvement[/yellow]")
    else:
        console.print("[red]❌ Project needs attention[/red]")
    
    # Category breakdown
    console.print(f"\n[bold]📊 Category Breakdown:[/bold]")
    for category_name, category_data in report["categories"].items():
        score = category_data["score"]
        icon = "🟢" if score >= 80 else "🟡" if score >= 60 else "🔴"
        console.print(f"  {icon} {category_name.title()}: {score}/100")
    
    # Critical issues
    if report["critical_issues"]:
        console.print(f"\n[bold red]🚨 Critical Issues:[/bold red]")
        for issue in report["critical_issues"]:
            console.print(f"  {issue}")
    
    # Category details if detailed
    if detailed:
        for category_name, category_data in report["categories"].items():
            console.print(f"\n[bold]{category_name.title()} Details:[/bold]")
            
            if category_data["checks_passed"]:
                console.print("[green]✅ Passed Checks:[/green]")
                for check in category_data["checks_passed"][:5]:
                    console.print(f"  {check}")
                if len(category_data["checks_passed"]) > 5:
                    console.print(f"  ... and {len(category_data['checks_passed']) - 5} more")
            
            if category_data["issues"]:
                console.print("[red]❌ Issues:[/red]")
                for issue in category_data["issues"]:
                    console.print(f"  {issue}")


def _fix_health_issues(project_path: Path, fixable_issues: list) -> None:
    """Attempt to fix health issues automatically"""
    for issue_type, issue_data in fixable_issues:
        try:
            if issue_type == "create_dir":
                (project_path / issue_data).mkdir(parents=True, exist_ok=True)
                console.print(f"[green]✅ Created directory: {issue_data}/[/green]")
            
            elif issue_type == "create_readme":
                readme_content = """# Project Name

## Description
Add your project description here.

## Installation
```bash
# Add installation instructions
```

## Usage
```bash
# Add usage instructions
```

## Contributing
Add contributing guidelines here.

## License
Add license information here.
"""
                with open(project_path / "README.md", "w", encoding="utf-8") as f:
                    f.write(readme_content)
                console.print("[green]✅ Created README.md[/green]")
            
            elif issue_type == "create_gitignore":
                gitignore_content = """# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Environment variables
.env
.env.local
.env.*.local

# Secrets
*.key
*.pem
*.p12
secrets/
*.secret

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
"""
                with open(project_path / ".gitignore", "w", encoding="utf-8") as f:
                    f.write(gitignore_content)
                console.print("[green]✅ Created .gitignore[/green]")
            
            elif issue_type == "create_scripts_dir":
                scripts_dir = project_path / "scripts"
                scripts_dir.mkdir(exist_ok=True)
                
                # Create sample script
                sample_script = """#!/bin/bash
# Sample automation script

echo "Running automation..."

# Add your automation commands here
"""
                with open(scripts_dir / "setup.sh", "w", encoding="utf-8") as f:
                    f.write(sample_script)
                os.chmod(scripts_dir / "setup.sh", 0o755)
                console.print("[green]✅ Created scripts directory with sample script[/green]")
        
        except Exception as e:
            console.print(f"[red]❌ Could not fix {issue_type}: {str(e)}[/red]")


def _display_health_score(report: dict) -> None:
    """Display final health score and recommendations"""
    console.print(f"\n[bold]🎯 Final Health Score: {report['overall_score']}/100[/bold]")
    
    if report["recommendations"]:
        console.print(f"\n[bold]💡 Recommendations:[/bold]")
        for rec in report["recommendations"]:
            console.print(f"  {rec}")


@app.command()
def template(
    action: str = typer.Argument(..., help="Action: list, create, customize"),
    category: Optional[str] = typer.Option(None, "--category", help="Template category"),
    name: Optional[str] = typer.Option(None, "--name", help="Template name"),
) -> None:
    """Manage and customize project templates"""
    try:
        if action == "list":
            _list_templates(category)
        elif action == "create":
            if not category or not name:
                console.print("[red]❌ --category and --name required for create action[/red]")
                raise typer.Exit(1)
            _create_template(category, name)
        elif action == "customize":
            if not category or not name:
                console.print("[red]❌ --category and --name required for customize action[/red]")
                raise typer.Exit(1)
            _customize_template(category, name)
        else:
            console.print(f"[red]❌ Unknown action: {action}[/red]")
            console.print("[yellow]Available actions: list, create, customize[/yellow]")
            raise typer.Exit(1)
    except Exception as e:
        logger.error(f"Template management error: {str(e)}")
        console.print(f"[red]❌ Error: {str(e)}[/red]")
        raise typer.Exit(1)


def _list_templates(category: Optional[str] = None) -> None:
    """List available templates"""
    from generator.config import TemplateConfig
    
    template_config = TemplateConfig()
    template_path = template_config.template_path
    
    console.print(Panel.fit(
        "[bold blue]📋 Available Templates[/bold blue]",
        border_style="blue"
    ))
    
    if category:
        categories = [category]
    else:
        categories = ["ci", "infra", "deploy", "monitoring", "security", "app", "scripts"]
    
    for cat in categories:
        cat_path = template_path / cat
        if cat_path.exists():
            templates = list(cat_path.glob("*.j2"))
            if templates:
                console.print(f"\n[bold cyan]{cat.title()} Templates:[/bold cyan]")
                for template in sorted(templates):
                    size = template.stat().st_size
                    console.print(f"  📄 {template.name} ({format_file_size(size)})")
        else:
            if category:
                console.print(f"[yellow]⚠️  Category '{category}' not found[/yellow]")


def _create_template(category: str, name: str) -> None:
    """Create a new template"""
    from generator.config import TemplateConfig
    
    template_config = TemplateConfig()
    template_path = template_config.template_path / category
    
    if not template_path.exists():
        template_path.mkdir(parents=True, exist_ok=True)
        console.print(f"[green]✅ Created category: {category}[/green]")
    
    template_file = template_path / f"{name}.j2"
    
    if template_file.exists():
        if not typer.confirm(f"Template '{name}.j2' already exists. Overwrite?"):
            console.print("[dim]Operation cancelled.[/dim]")
            return
    
    # Create a basic template
    template_content = f"""# Template: {category}/{name}
# Generated by DevOps Project Generator
# Created: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

{{%- if project_name -%}}
# Project: {{ project_name }}
{{%- endif -%}}

# Add your template content here
# Available variables:
# {{%- for var in ['project_name', 'project_name_upper', 'project_name_slug', 'environments', 'ci', 'infra', 'deploy', 'observability', 'security'] -%}}
# {{{{ var }}}}
# {{%- endfor -%}}

"""
    
    with open(template_file, 'w', encoding='utf-8') as f:
        f.write(template_content)
    
    console.print(f"[green]✅ Template created: {template_file}[/green]")
    console.print("[yellow]💡 Edit the file to customize your template[/yellow]")


def _customize_template(category: str, name: str) -> None:
    """Customize an existing template"""
    from generator.config import TemplateConfig
    
    template_config = TemplateConfig()
    template_file = template_config.template_path / category / f"{name}.j2"
    
    if not template_file.exists():
        console.print(f"[red]❌ Template not found: {category}/{name}.j2[/red]")
        raise typer.Exit(1)
    
    console.print(f"[blue]📝 Editing template: {category}/{name}.j2[/blue]")
    
    # Show current content
    with open(template_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    console.print(Panel.fit(
        content[:500] + "..." if len(content) > 500 else content,
        title=f"Current Template Content",
        border_style="cyan"
    ))
    
    console.print("\n[yellow]💡 To edit this template, open the file directly:[/yellow]")
    console.print(f"   {template_file}")
    
    # Show available variables
    console.print("\n[bold]Available template variables:[/bold]")
    variables = [
        "project_name", "project_name_upper", "project_name_slug",
        "environments", "ci", "infra", "deploy", "observability", "security",
        "has_ci", "has_infra", "has_docker", "has_kubernetes", "env_count", "is_multi_env"
    ]
    for var in variables:
        console.print(f"  • {{{{ {var} }}}}")


@app.command()
def profile(
    action: str = typer.Argument(..., help="Action: save, load, list, delete"),
    name: Optional[str] = typer.Option(None, "--name", help="Profile name"),
    file: Optional[str] = typer.Option(None, "--file", help="Profile file path"),
) -> None:
    """Manage project configuration profiles"""
    try:
        if action == "list":
            _list_profiles()
        elif action == "save":
            if not name:
                console.print("[red]❌ --name required for save action[/red]")
                raise typer.Exit(1)
            _save_profile(name)
        elif action == "load":
            if not name:
                console.print("[red]❌ --name required for load action[/red]")
                raise typer.Exit(1)
            _load_profile(name)
        elif action == "delete":
            if not name:
                console.print("[red]❌ --name required for delete action[/red]")
                raise typer.Exit(1)
            _delete_profile(name)
        else:
            console.print(f"[red]❌ Unknown action: {action}[/red]")
            console.print("[yellow]Available actions: list, save, load, delete[/yellow]")
            raise typer.Exit(1)
    except Exception as e:
        logger.error(f"Profile management error: {str(e)}")
        console.print(f"[red]❌ Error: {str(e)}[/red]")
        raise typer.Exit(1)


def _get_profiles_dir() -> Path:
    """Get profiles directory"""
    home = Path.home()
    profiles_dir = home / ".devops-project-generator" / "profiles"
    profiles_dir.mkdir(parents=True, exist_ok=True)
    return profiles_dir


def _list_profiles() -> None:
    """List saved profiles"""
    profiles_dir = _get_profiles_dir()
    profiles = list(profiles_dir.glob("*.json"))
    
    console.print(Panel.fit(
        "[bold blue]📋 Saved Configuration Profiles[/bold blue]",
        border_style="blue"
    ))
    
    if not profiles:
        console.print("[yellow]No saved profiles found.[/yellow]")
        console.print("[dim]Use 'devops-project-generator profile save --name <name>' to create a profile[/dim]")
        return
    
    for profile_file in sorted(profiles):
        try:
            with open(profile_file, 'r', encoding='utf-8') as f:
                profile_data = json.load(f)
            
            console.print(f"\n[bold cyan]{profile_file.stem}[/bold cyan]")
            console.print(f"  📅 Created: {profile_data.get('created_at', 'Unknown')}")
            console.print(f"  🏷️  Description: {profile_data.get('description', 'No description')}")
            
            config = profile_data.get('config', {})
            if config.get('ci'):
                console.print(f"  🔧 CI/CD: {config['ci']}")
            if config.get('infra'):
                console.print(f"  🏗️  Infrastructure: {config['infra']}")
            if config.get('deploy'):
                console.print(f"  🚀 Deployment: {config['deploy']}")
            if config.get('observability'):
                console.print(f"  📊 Observability: {config['observability']}")
            if config.get('security'):
                console.print(f"  🔒 Security: {config['security']}")
                
        except Exception as e:
            console.print(f"[red]❌ Error reading profile {profile_file.name}: {str(e)}[/red]")


def _save_profile(name: str) -> None:
    """Save current configuration as a profile"""
    profiles_dir = _get_profiles_dir()
    profile_file = profiles_dir / f"{name}.json"
    
    if profile_file.exists():
        if not typer.confirm(f"Profile '{name}' already exists. Overwrite?"):
            console.print("[dim]Operation cancelled.[/dim]")
            return
    
    # Get current configuration from interactive mode or defaults
    console.print("[bold]🔧 Creating configuration profile[/bold]")
    
    config = {
        "ci": typer.prompt("CI/CD platform", default="github-actions"),
        "infra": typer.prompt("Infrastructure tool", default="terraform"),
        "deploy": typer.prompt("Deployment method", default="docker"),
        "envs": typer.prompt("Environments", default="single"),
        "observability": typer.prompt("Observability level", default="logs"),
        "security": typer.prompt("Security level", default="basic"),
    }
    
    profile_data = {
        "name": name,
        "description": typer.prompt("Description (optional)", default=""),
        "created_at": datetime.datetime.now().isoformat(),
        "config": config,
        "version": "1.4.0"
    }
    
    with open(profile_file, 'w', encoding='utf-8') as f:
        json.dump(profile_data, f, indent=2, ensure_ascii=False)
    
    console.print(f"[green]✅ Profile saved: {name}[/green]")
    console.print(f"[dim]Location: {profile_file}[/dim]")


def _load_profile(name: str) -> None:
    """Load and display a profile"""
    profiles_dir = _get_profiles_dir()
    profile_file = profiles_dir / f"{name}.json"
    
    if not profile_file.exists():
        console.print(f"[red]❌ Profile not found: {name}[/red]")
        raise typer.Exit(1)
    
    try:
        with open(profile_file, 'r', encoding='utf-8') as f:
            profile_data = json.load(f)
        
        console.print(Panel.fit(
            f"[bold blue]📋 Profile: {name}[/bold blue]",
            border_style="blue"
        ))
        
        console.print(f"📅 Created: {profile_data.get('created_at', 'Unknown')}")
        console.print(f"🏷️  Description: {profile_data.get('description', 'No description')}")
        
        config = profile_data.get('config', {})
        console.print(f"\n[bold]Configuration:[/bold]")
        console.print(f"  🔧 CI/CD: {config.get('ci', 'none')}")
        console.print(f"  🏗️  Infrastructure: {config.get('infra', 'none')}")
        console.print(f"  🚀 Deployment: {config.get('deploy', 'vm')}")
        console.print(f"  🌍 Environments: {config.get('envs', 'single')}")
        console.print(f"  📊 Observability: {config.get('observability', 'logs')}")
        console.print(f"  🔒 Security: {config.get('security', 'basic')}")
        
        # Show command to use this profile
        cmd_parts = []
        for key, value in config.items():
            if value and value != "none":
                cmd_parts.append(f"--{key} {value}")
        
        console.print(f"\n[bold]Usage command:[/bold]")
        console.print(f"  devops-project-generator init {' '.join(cmd_parts)} --name <project-name>")
        
    except Exception as e:
        console.print(f"[red]❌ Error loading profile: {str(e)}[/red]")
        raise typer.Exit(1)


def _delete_profile(name: str) -> None:
    """Delete a saved profile"""
    profiles_dir = _get_profiles_dir()
    profile_file = profiles_dir / f"{name}.json"
    
    if not profile_file.exists():
        console.print(f"[red]❌ Profile not found: {name}[/red]")
        raise typer.Exit(1)
    
    if typer.confirm(f"Delete profile '{name}'?"):
        profile_file.unlink()
        console.print(f"[green]✅ Profile deleted: {name}[/green]")
    else:
        console.print("[dim]Operation cancelled.[/dim]")


@app.command()
def test(
    project_path: str = typer.Argument(..., help="Path to project to test"),
    verbose: bool = typer.Option(False, "--verbose", help="Verbose output"),
) -> None:
    """Run integration tests on generated project"""
    try:
        project_dir = Path(project_path)
        
        if not project_dir.exists():
            console.print(f"[red]❌ Project not found: {project_path}[/red]")
            raise typer.Exit(1)
        
        console.print(Panel.fit(
            "[bold blue]🧪 Running Integration Tests[/bold blue]",
            border_style="blue"
        ))
        
        test_results = _run_integration_tests(project_dir, verbose)
        
        # Display results
        console.print(f"\n[bold]📊 Test Results:[/bold]")
        console.print(f"  ✅ Passed: {test_results['passed']}")
        console.print(f"  ❌ Failed: {test_results['failed']}")
        console.print(f"  ⚠️  Warnings: {test_results['warnings']}")
        console.print(f"  📈 Score: {test_results['score']}/100")
        
        if test_results['failed'] > 0:
            console.print("\n[bold red]❌ Failed Tests:[/bold red]")
            for test in test_results['failed_tests']:
                console.print(f"  • {test}")
            raise typer.Exit(1)
        else:
            console.print("\n[green]✅ All tests passed![/green]")
            
    except Exception as e:
        logger.error(f"Test execution error: {str(e)}")
        console.print(f"[red]❌ Error: {str(e)}[/red]")
        raise typer.Exit(1)


def _run_integration_tests(project_dir: Path, verbose: bool) -> Dict[str, Any]:
    """Run comprehensive integration tests"""
    results = {
        'passed': 0,
        'failed': 0,
        'warnings': 0,
        'score': 0,
        'failed_tests': []
    }
    
    tests = [
        ("Project Structure", _test_project_structure),
        ("Configuration Files", _test_config_files),
        ("Security Files", _test_security_files),
        ("CI/CD Files", _test_cicd_files),
        ("Documentation", _test_documentation),
        ("Scripts", _test_scripts),
    ]
    
    for test_name, test_func in tests:
        try:
            if verbose:
                console.print(f"  🔍 Running {test_name}...")
            
            test_result = test_func(project_dir)
            
            if test_result['passed']:
                results['passed'] += 1
                if verbose:
                    console.print(f"    ✅ {test_name} passed")
            else:
                results['failed'] += 1
                results['failed_tests'].append(f"{test_name}: {test_result['message']}")
                if verbose:
                    console.print(f"    ❌ {test_name} failed: {test_result['message']}")
            
            if test_result.get('warning'):
                results['warnings'] += 1
                if verbose:
                    console.print(f"    ⚠️  {test_name}: {test_result['warning']}")
                    
        except Exception as e:
            results['failed'] += 1
            results['failed_tests'].append(f"{test_name}: {str(e)}")
            if verbose:
                console.print(f"    ❌ {test_name} error: {str(e)}")
    
    # Calculate score
    total_tests = len(tests)
    results['score'] = int((results['passed'] / total_tests) * 100)
    
    return results


def _test_project_structure(project_dir: Path) -> Dict[str, Any]:
    """Test basic project structure"""
    required_dirs = ['app', 'scripts', 'docs']
    missing_dirs = [d for d in required_dirs if not (project_dir / d).exists()]
    
    if missing_dirs:
        return {'passed': False, 'message': f"Missing directories: {', '.join(missing_dirs)}"}
    
    return {'passed': True}


def _test_config_files(project_dir: Path) -> Dict[str, Any]:
    """Test configuration files"""
    config_files = ['README.md', 'Makefile', '.gitignore']
    missing_files = [f for f in config_files if not (project_dir / f).exists()]
    
    if missing_files:
        return {'passed': False, 'message': f"Missing config files: {', '.join(missing_files)}"}
    
    # Check README content
    readme_file = project_dir / 'README.md'
    if readme_file.exists():
        content = readme_file.read_text(encoding='utf-8')
        if len(content) < 100:
            return {'passed': False, 'message': "README.md too short"}
    
    return {'passed': True}


def _test_security_files(project_dir: Path) -> Dict[str, Any]:
    """Test security configuration"""
    security_dir = project_dir / 'security'
    
    if security_dir.exists():
        security_files = list(security_dir.glob('*.yml')) + list(security_dir.glob('*.yaml'))
        if not security_files:
            return {'passed': False, 'message': "Security directory exists but no security files found"}
    
    return {'passed': True, 'warning': "No security files found (optional)"}


def _test_cicd_files(project_dir: Path) -> Dict[str, Any]:
    """Test CI/CD configuration"""
    ci_dir = project_dir / 'ci'
    
    if ci_dir.exists():
        ci_files = list(ci_dir.glob('*.yml')) + list(ci_dir.glob('*.yaml')) + list(ci_dir.glob('*jenkinsfile*'))
        if not ci_files:
            return {'passed': False, 'message': "CI directory exists but no CI files found"}
    
    return {'passed': True, 'warning': "No CI files found (optional)"}


def _test_documentation(project_dir: Path) -> Dict[str, Any]:
    """Test documentation"""
    docs_dir = project_dir / 'docs'
    readme_file = project_dir / 'README.md'
    
    if not docs_dir.exists():
        return {'passed': True, 'warning': "No docs directory found"}
    
    if not readme_file.exists():
        return {'passed': False, 'message': "No README.md found"}
    
    return {'passed': True}


def _test_scripts(project_dir: Path) -> Dict[str, Any]:
    """Test scripts"""
    scripts_dir = project_dir / 'scripts'
    
    if scripts_dir.exists():
        script_files = list(scripts_dir.glob('*.sh')) + list(scripts_dir.glob('*.py'))
        if not script_files:
            return {'passed': False, 'message': "Scripts directory exists but no scripts found"}
    
    return {'passed': True, 'warning': "No scripts found (optional)"}


@app.command()
def version() -> None:
    """Show version information"""
    try:
        from . import __version__
    except ImportError:
        __version__ = "1.4.0"
    console.print(f"[bold blue]DevOps Project Generator[/bold blue] v{__version__}")


if __name__ == "__main__":
    app()
