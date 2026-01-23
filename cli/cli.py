#!/usr/bin/env python3
"""
CLI interface for DevOps Project Generator
"""

import os
import sys
import shutil
from pathlib import Path
from typing import Optional, List
import typer
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TextColumn

from generator import ProjectConfig, DevOpsProjectGenerator

app = typer.Typer(
    name="devops-project-generator",
    help="🚀 DevOps Project Generator - Scaffold production-ready DevOps repositories",
    no_args_is_help=True,
)

console = Console()


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
    
    # Display welcome message
    console.print(Panel.fit(
        "[bold blue]🚀 DevOps Project Generator[/bold blue]\n"
        "[dim]Scaffold production-ready DevOps repositories[/dim]",
        border_style="blue"
    ))
    
    # Get configuration
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
    
    # Validate configuration
    if not config.validate():
        console.print("[red]❌ Invalid configuration. Please check your options.[/red]")
        console.print("[yellow]💡 Use 'devops-project-generator list-options' to see valid choices[/yellow]")
        raise typer.Exit(1)
    
    # Check if project directory already exists
    project_path = Path(output_dir) / config.project_name
    if project_path.exists():
        if not typer.confirm(f"[yellow]⚠️  Directory '{config.project_name}' already exists. Continue and overwrite?[/yellow]"):
            console.print("[dim]Operation cancelled.[/dim]")
            raise typer.Exit(0)
        shutil.rmtree(project_path)
    
    # Generate project
    generator = DevOpsProjectGenerator(config, output_dir)
    
    try:
        generator.generate()
        
        console.print(f"\n[green]✅ DevOps project generated successfully![/green]")
        console.print(f"\n[bold]Project location:[/bold] {project_path}")
        console.print("\n[bold]🚀 Next steps:[/bold]")
        console.print(f"  cd {config.project_name}")
        console.print("  make help")
        
    except KeyboardInterrupt:
        console.print("\n[yellow]⚠️  Generation cancelled by user[/yellow]")
        raise typer.Exit(1)
    except Exception as e:
        console.print(f"\n[red]❌ Error generating project: {str(e)}[/red]")
        console.print("[yellow]💡 Please check your configuration and try again[/yellow]")
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
def version() -> None:
    """Show version information"""
    try:
        from . import __version__
    except ImportError:
        __version__ = "1.2.0"
    console.print(f"[bold blue]DevOps Project Generator[/bold blue] v{__version__}")


if __name__ == "__main__":
    app()
