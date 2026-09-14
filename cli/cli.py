#!/usr/bin/env python3
"""
CLI interface for DevOps Project Generator
"""

import os
import sys
import shutil
import logging
import time
import traceback
from pathlib import Path
from typing import Optional, List, Dict, Any, Generator
from contextlib import contextmanager

import typer
from rich.panel import Panel
from rich.traceback import install
from rich.table import Table

from generator import ProjectConfig, DevOpsProjectGenerator
from .utils import (
    format_duration, format_file_size, calculate_project_stats,
    show_success_message, show_error_message, show_warning_message,
    show_progress_spinner, safe_execute, validate_project_name,
    validate_output_path, safe_print, console,
)
from .commands import (
    validate as validate_project,
    info as project_info,
    health as project_health,
    cleanup as cleanup_project,
    config as config_command,
    template as template_cmd,
    backup as backup_command,
    profile as profile_cmd,
    test as test_project,
    scan as scan_project,
    multi_env as multi_env_command,
)

# Install rich traceback for better error display
install(show_locals=True)

# Configure logging with better formatting
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('devops-generator.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)



# =============================================================================
# MAIN CLI APPLICATION
# =============================================================================

app = typer.Typer(
    name="devops-project-generator",
    help="🚀 DevOps Project Generator - Scaffold production-ready DevOps repositories",
    no_args_is_help=True,
    add_completion=False,
)

@contextmanager
def handle_cli_errors() -> Generator[None, None, None]:
    """Context manager for consistent CLI error handling"""
    try:
        yield
    except KeyboardInterrupt:
        console.print("\n[yellow]⚠️  Operation cancelled by user[/yellow]")
        logger.info("Operation cancelled by user")
        raise typer.Exit(130)
    except typer.Exit:
        raise
    except Exception as e:
        logger.error(f"CLI error: {str(e)}", exc_info=True)
        console.print(f"\n[red]❌ Error: {str(e)}[/red]")
        console.print("[yellow]💡 Check the log file for details: devops-generator.log[/yellow]")
        raise typer.Exit(1)


@app.command()
def init(
    pipeline: Optional[str] = typer.Option(
        None,
        "--pipeline",
        help="Pipeline framework: nodejs-typescript, python, java-maven, go, docker-multistage, terraform-module, kubernetes-operator, microservice",
        show_choices=True,
    ),
    ci: Optional[str] = typer.Option(
        None,
        "--ci",
        help="CI/CD platform: github-actions, gitlab-ci, jenkins, azure-pipelines, gitlab-runners, none",
        show_choices=True,
    ),
    infra: Optional[str] = typer.Option(
        None,
        "--infra",
        help="Infrastructure pattern: aws-vpc-eks, azure-vnet-aks, gcp-vpc-gke, multicloud-terraform, kubernetes-onprem, aws-ecs-fargate, ansible-automation",
        show_choices=True,
    ),
    deploy: Optional[str] = typer.Option(
        None,
        "--deploy",
        help="Deployment strategy: blue-green, canary, rolling, gitops-argocd, helm-charts, kustomize, serverless-lambda",
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
        help="Observability stack: prometheus-grafana, elk-stack, datadog, jaeger-prometheus, cloudwatch, new-relic",
        show_choices=True,
    ),
    security: Optional[str] = typer.Option(
        None,
        "--security",
        help="Security framework: nist-csf, cis-benchmarks, zero-trust, soc2, gdpr, hipaa",
        show_choices=True,
    ),
    project_name: str = typer.Option(
        "devops-project",
        "--name",
        help="Project name",
        callback=lambda ctx, param, value: validate_project_name(value) if value else value,
    ),
    output_dir: str = typer.Option(
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
            output_dir_str = output_dir or "."
            output_path = validate_output_path(output_dir_str)
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
                    pipeline=pipeline,
                    ci=ci,
                    infra=infra,
                    deploy=deploy,
                    envs=envs,
                    observability=observability,
                    security=security,
                    project_name=project_name or "devops-project",
                )
        except Exception as e:
            logger.error(f"Configuration error: {str(e)}")
            console.print(f"[red]❌ Configuration error: {str(e)}[/red]")
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
            project_stats = calculate_project_stats(project_path)
            
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
                except Exception:
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
                except Exception:
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
    
    # Pipeline framework selection
    pipeline_table = Table(title="Pipeline Frameworks")
    pipeline_table.add_column("Option", style="cyan")
    pipeline_table.add_column("Description")
    pipeline_table.add_row("nodejs-typescript", "Node.js + TypeScript pipelines")
    pipeline_table.add_row("python", "Python application pipelines")
    pipeline_table.add_row("java-maven", "Enterprise Java pipelines")
    pipeline_table.add_row("go", "Go application pipelines")
    pipeline_table.add_row("docker-multistage", "Containerized application pipelines")
    pipeline_table.add_row("terraform-module", "Infrastructure module pipelines")
    pipeline_table.add_row("kubernetes-operator", "Kubernetes operator pipelines")
    pipeline_table.add_row("microservice", "Microservice architecture pipelines")
    console.print(pipeline_table)
    
    while True:
        pipeline = typer.prompt("Choose pipeline framework", type=str).lower()
        if pipeline in ProjectConfig.VALID_PIPELINE_OPTIONS:
            break
        console.print(f"[red]Invalid option. Please choose from: {', '.join(ProjectConfig.VALID_PIPELINE_OPTIONS)}[/red]")
    
    # CI/CD selection
    ci_table = Table(title="CI/CD Platforms")
    ci_table.add_column("Option", style="cyan")
    ci_table.add_column("Description")
    ci_table.add_row("github-actions", "GitHub Actions workflows")
    ci_table.add_row("gitlab-ci", "GitLab CI/CD pipelines")
    ci_table.add_row("jenkins", "Jenkins pipeline files")
    ci_table.add_row("azure-pipelines", "Azure DevOps pipelines")
    ci_table.add_row("gitlab-runners", "GitLab Runners")
    ci_table.add_row("none", "No CI/CD")
    console.print(ci_table)
    
    while True:
        ci = typer.prompt("Choose CI/CD platform", type=str).lower()
        if ci in ProjectConfig.VALID_CI_OPTIONS:
            break
        console.print(f"[red]Invalid option. Please choose from: {', '.join(ProjectConfig.VALID_CI_OPTIONS)}[/red]")
    
    # Infrastructure selection
    infra_table = Table(title="Infrastructure Patterns")
    infra_table.add_column("Option", style="cyan")
    infra_table.add_column("Description")
    infra_table.add_row("aws-vpc-eks", "Amazon EKS with VPC networking")
    infra_table.add_row("azure-vnet-aks", "Azure AKS with virtual networking")
    infra_table.add_row("gcp-vpc-gke", "Google GKE with VPC networking")
    infra_table.add_row("multicloud-terraform", "Cross-cloud infrastructure")
    infra_table.add_row("kubernetes-onprem", "On-premises Kubernetes")
    infra_table.add_row("aws-ecs-fargate", "Serverless container orchestration")
    infra_table.add_row("ansible-automation", "Configuration management")
    console.print(infra_table)
    
    while True:
        infra = typer.prompt("Choose infrastructure pattern", type=str).lower()
        if infra in ProjectConfig.VALID_INFRA_OPTIONS:
            break
        console.print(f"[red]Invalid option. Please choose from: {', '.join(ProjectConfig.VALID_INFRA_OPTIONS)}[/red]")
    
    # Deployment selection
    deploy_table = Table(title="Deployment Strategies")
    deploy_table.add_column("Option", style="cyan")
    deploy_table.add_column("Description")
    deploy_table.add_row("blue-green", "Zero-downtime deployments")
    deploy_table.add_row("canary", "Gradual rollout deployments")
    deploy_table.add_row("rolling", "Incremental updates")
    deploy_table.add_row("gitops-argocd", "Git-based continuous deployment")
    deploy_table.add_row("helm-charts", "Kubernetes package management")
    deploy_table.add_row("kustomize", "Kubernetes configuration management")
    deploy_table.add_row("serverless-lambda", "AWS Lambda deployments")
    console.print(deploy_table)
    
    while True:
        deploy = typer.prompt("Choose deployment strategy", type=str).lower()
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
    obs_table = Table(title="Observability Stacks")
    obs_table.add_column("Option", style="cyan")
    obs_table.add_column("Description")
    obs_table.add_row("prometheus-grafana", "Metrics and visualization")
    obs_table.add_row("elk-stack", "Elasticsearch, Logstash, Kibana")
    obs_table.add_row("datadog", "Full-stack monitoring")
    obs_table.add_row("jaeger-prometheus", "Distributed tracing and metrics")
    obs_table.add_row("cloudwatch", "AWS native monitoring")
    obs_table.add_row("new-relic", "Application performance monitoring")
    console.print(obs_table)
    
    while True:
        observability = typer.prompt("Choose observability stack", type=str).lower()
        if observability in ProjectConfig.VALID_OBS_OPTIONS:
            break
        console.print(f"[red]Invalid option. Please choose from: {', '.join(ProjectConfig.VALID_OBS_OPTIONS)}[/red]")
    
    # Security
    sec_table = Table(title="Security Frameworks")
    sec_table.add_column("Option", style="cyan")
    sec_table.add_column("Description")
    sec_table.add_row("nist-csf", "NIST Cybersecurity Framework")
    sec_table.add_row("cis-benchmarks", "Center for Internet Security controls")
    sec_table.add_row("zero-trust", "Zero Trust Architecture")
    sec_table.add_row("soc2", "Service Organization Control 2")
    sec_table.add_row("gdpr", "General Data Protection Regulation")
    sec_table.add_row("hipaa", "Health Insurance Portability and Accountability Act")
    console.print(sec_table)
    
    while True:
        security = typer.prompt("Choose security framework", type=str).lower()
        if security in ProjectConfig.VALID_SEC_OPTIONS:
            break
        console.print(f"[red]Invalid option. Please choose from: {', '.join(ProjectConfig.VALID_SEC_OPTIONS)}[/red]")
    
    project_name = typer.prompt("Project name", default="devops-project")
    
    return ProjectConfig(
        pipeline=pipeline,
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
    
    # Pipeline Framework Options
    console.print("\n[bold]🔄 Pipeline Frameworks:[/bold]")
    pipeline_table = Table()
    pipeline_table.add_column("Option", style="cyan")
    pipeline_table.add_column("Description")
    pipeline_table.add_row("nodejs-typescript", "Node.js + TypeScript pipelines")
    pipeline_table.add_row("python", "Python application pipelines")
    pipeline_table.add_row("java-maven", "Enterprise Java pipelines")
    pipeline_table.add_row("go", "Go application pipelines")
    pipeline_table.add_row("docker-multistage", "Containerized application pipelines")
    pipeline_table.add_row("terraform-module", "Infrastructure module pipelines")
    pipeline_table.add_row("kubernetes-operator", "Kubernetes operator pipelines")
    pipeline_table.add_row("microservice", "Microservice architecture pipelines")
    console.print(pipeline_table)
    
    # CI/CD Options
    console.print("\n[bold]🔄 CI/CD Platforms:[/bold]")
    ci_table = Table()
    ci_table.add_column("Option", style="cyan")
    ci_table.add_column("Description")
    ci_table.add_row("github-actions", "GitHub Actions workflows")
    ci_table.add_row("gitlab-ci", "GitLab CI/CD pipelines")
    ci_table.add_row("jenkins", "Jenkins pipeline files")
    ci_table.add_row("azure-pipelines", "Azure DevOps pipelines")
    ci_table.add_row("gitlab-runners", "GitLab Runners")
    ci_table.add_row("none", "No CI/CD")
    console.print(ci_table)
    
    # Infrastructure Options
    console.print("\n[bold]☁️ Infrastructure Patterns:[/bold]")
    infra_table = Table()
    infra_table.add_column("Option", style="cyan")
    infra_table.add_column("Description")
    infra_table.add_row("aws-vpc-eks", "Amazon EKS with VPC networking")
    infra_table.add_row("azure-vnet-aks", "Azure AKS with virtual networking")
    infra_table.add_row("gcp-vpc-gke", "Google GKE with VPC networking")
    infra_table.add_row("multicloud-terraform", "Cross-cloud infrastructure")
    infra_table.add_row("kubernetes-onprem", "On-premises Kubernetes")
    infra_table.add_row("aws-ecs-fargate", "Serverless container orchestration")
    infra_table.add_row("ansible-automation", "Configuration management")
    console.print(infra_table)
    
    # Deployment Options
    console.print("\n[bold]🚀 Deployment Strategies:[/bold]")
    deploy_table = Table()
    deploy_table.add_column("Option", style="cyan")
    deploy_table.add_column("Description")
    deploy_table.add_row("blue-green", "Zero-downtime deployments")
    deploy_table.add_row("canary", "Gradual rollout deployments")
    deploy_table.add_row("rolling", "Incremental updates")
    deploy_table.add_row("gitops-argocd", "Git-based continuous deployment")
    deploy_table.add_row("helm-charts", "Kubernetes package management")
    deploy_table.add_row("kustomize", "Kubernetes configuration management")
    deploy_table.add_row("serverless-lambda", "AWS Lambda deployments")
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
    console.print("\n[bold]📊 Observability Stacks:[/bold]")
    obs_table = Table()
    obs_table.add_column("Option", style="cyan")
    obs_table.add_column("Description")
    obs_table.add_row("prometheus-grafana", "Metrics and visualization")
    obs_table.add_row("elk-stack", "Elasticsearch, Logstash, Kibana")
    obs_table.add_row("datadog", "Full-stack monitoring")
    obs_table.add_row("jaeger-prometheus", "Distributed tracing and metrics")
    obs_table.add_row("cloudwatch", "AWS native monitoring")
    obs_table.add_row("new-relic", "Application performance monitoring")
    console.print(obs_table)
    
    # Security Options
    console.print("\n[bold]🔒 Security Frameworks:[/bold]")
    sec_table = Table()
    sec_table.add_column("Option", style="cyan")
    sec_table.add_column("Description")
    sec_table.add_row("nist-csf", "NIST Cybersecurity Framework")
    sec_table.add_row("cis-benchmarks", "Center for Internet Security controls")
    sec_table.add_row("zero-trust", "Zero Trust Architecture")
    sec_table.add_row("soc2", "Service Organization Control 2")
    sec_table.add_row("gdpr", "General Data Protection Regulation")
    sec_table.add_row("hipaa", "Health Insurance Portability and Accountability Act")
    console.print(sec_table)




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
    with handle_cli_errors():
        validate_project(project_path, fix)


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
    with handle_cli_errors():
        project_info(project_path, detailed)


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
    with handle_cli_errors():
        project_health(project_path, detailed, fix)


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
    with handle_cli_errors():
        cleanup_project(project_path, force, keep_config)


@app.command()
def config(
    action: str = typer.Argument(
        "create",
        help="Action: create, show, or validate"
    ),
    config_file: str = typer.Option(
        "devops-config.yaml",
        "--file",
        help="Configuration file path"
    ),
) -> None:
    """Manage project configuration files"""
    with handle_cli_errors():
        config_command(action, config_file or "devops-config.yaml")


@app.command()
def test(
    project_path: str = typer.Argument(..., help="Path to project to test"),
    verbose: bool = typer.Option(False, "--verbose", help="Verbose output"),
) -> None:
    """Run integration tests on generated project"""
    with handle_cli_errors():
        test_project(project_path, verbose)


@app.command()
def scan(
    project_path: str = typer.Argument(
        ".",
        help="Path to project to scan for dependencies"
    ),
    export: Optional[str] = typer.Option(
        None,
        "--export",
        help="Export report to file (e.g., report.json, report.yaml)"
    ),
    format: str = typer.Option(
        "json",
        "--format",
        help="Export format: json or yaml"
    ),
    detailed: bool = typer.Option(
        False,
        "--detailed",
        help="Show detailed dependency information"
    )
) -> None:
    """Scan project dependencies and security vulnerabilities"""
    with handle_cli_errors():
        scan_project(project_path, export, format, detailed)


@app.command()
def multi_env(
    project_path: str = typer.Argument(
        ".",
        help="Path to project for multi-environment configuration"
    ),
    environments: str = typer.Option(
        "dev,stage,prod",
        "--envs",
        help="Comma-separated list of environments (e.g., dev,stage,prod)"
    ),
    config_type: str = typer.Option(
        "full",
        "--type",
        help="Configuration type: basic, kubernetes, docker, full"
    ),
    with_secrets: bool = typer.Option(
        False,
        "--with-secrets",
        help="Generate secrets templates"
    )
) -> None:
    """Generate multi-environment configurations with inheritance"""
    with handle_cli_errors():
        multi_env_command(project_path, environments, config_type, with_secrets)


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
    with handle_cli_errors():
        backup_command(action, project_path, backup_file, include_config, compress)


@app.command()
def profile(
    action: str = typer.Argument(..., help="Action: save, load, list, delete"),
    name: Optional[str] = typer.Option(None, "--name", help="Profile name"),
    file: Optional[str] = typer.Option(None, "--file", help="Profile file path"),
) -> None:
    """Manage project configuration profiles"""
    with handle_cli_errors():
        profile_cmd(action, name, file)


@app.command()
def template(
    action: str = typer.Argument(
        "list",
        help="Action: list, create, customize, or export"
    ),
    category: Optional[str] = typer.Option(
        None,
        "--category",
        help="Template category for create/customize actions"
    ),
    name: Optional[str] = typer.Option(
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
    with handle_cli_errors():
        template_cmd(action, category, name, output_dir)


@app.command()
def version() -> None:
    """Show version information"""
    try:
        from . import __version__
    except ImportError:
        __version__ = "2.0.0"
    console.print(f"[bold blue]DevOps Project Generator[/bold blue] v{__version__}")


if __name__ == "__main__":
    app()
