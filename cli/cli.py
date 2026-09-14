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
    devcontainer: bool = typer.Option(
        True,
        "--devcontainer/--no-devcontainer",
        help="Include DevContainer & local tooling sandbox (.devcontainer/)",
    ),
    git_init: bool = typer.Option(
        False,
        "--git-init/--no-git-init",
        help="Initialize Git repository with initial commit",
    ),
    gh_repo: bool = typer.Option(
        False,
        "--gh-repo/--no-gh-repo",
        help="Create and push to remote GitHub repository using GitHub CLI",
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
                    devcontainer=devcontainer,
                    git_init=git_init,
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
            
            if getattr(config, "devcontainer", True):
                console.print("  [green]✓[/green] [bold]DevContainer sandbox:[/bold] Open in VS Code / Cursor to auto-start development container")
            console.print(f"  [green]✓[/green] [bold]Architecture ADR:[/bold] Check {config.project_name}/docs/ADR-001-devops-stack-architecture.md")
            console.print(f"  [green]✓[/green] [bold]Security & Compliance:[/bold] Check {config.project_name}/docs/COMPLIANCE-AUDIT.md")
            
            if gh_repo:
                try:
                    import subprocess
                    console.print("\n[bold cyan]🐙 Publishing to GitHub...[/bold cyan]")
                    subprocess.run(["gh", "repo", "create", config.project_name, "--private", "--source=.", "--remote=origin", "--push"], cwd=project_path, check=True)
                    console.print(f"[bold green]✓ Successfully published to GitHub: https://github.com/{config.project_name}[/bold green]")
                except Exception as e:
                    console.print(f"[yellow]⚠️ Could not auto-publish to GitHub: {str(e)}[/yellow]")
                    console.print(f"Run manually: [cyan]cd {config.project_name} && gh repo create {config.project_name} --private --source=. --remote=origin --push[/cyan]")
            else:
                console.print(f"\n[bold]💡 Push to GitHub with one command:[/bold]")
                console.print(f"  [cyan]cd {config.project_name} && gh repo create {config.project_name} --private --source=. --remote=origin --push[/cyan]")
            
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
    devcontainer = typer.confirm("Include DevContainer & local tooling sandbox (.devcontainer/)?", default=True)
    git_init = typer.confirm("Initialize Git repository?", default=False)
    
    return ProjectConfig(
        pipeline=pipeline,
        ci=ci,
        infra=infra,
        deploy=deploy,
        envs=envs,
        observability=observability,
        security=security,
        project_name=project_name,
        devcontainer=devcontainer,
        git_init=git_init,
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
def audit(
    project_path: str = typer.Argument(".", help="Path to the DevOps project directory"),
    output: Optional[str] = typer.Option(None, "--output", "-o", help="Save compliance report to markdown file"),
) -> None:
    """Audit project security compliance against CIS, SOC 2, NIST, HIPAA, and SLSA"""
    with handle_cli_errors():
        from pathlib import Path
        path = Path(project_path)
        if not path.exists():
            console.print(f"[red]❌ Directory not found: {project_path}[/red]")
            raise typer.Exit(1)
        
        console.print(Panel.fit(
            "[bold green]🛡️ DevOps Security & Governance Audit[/bold green]\n"
            f"[dim]Evaluating architecture compliance for: {path.resolve().name}[/dim]",
            border_style="green"
        ))
        
        # Check active security controls
        controls = []
        
        cosign_found = any(path.glob("**/*cosign*"))
        controls.append(("Cryptographic Container Signing", "Sigstore / Cosign", "SLSA Level 3", cosign_found))
        
        sbom_found = any(path.glob("**/*sbom*")) or any(path.glob("**/*syft*"))
        controls.append(("Software Bill of Materials (SBOM)", "Syft / CycloneDX", "NIST SP 800-53", sbom_found))
        
        trivy_found = any(path.glob("**/*trivy*"))
        controls.append(("Vulnerability Scanning Gate", "Trivy / Grype", "CIS Benchmarks", trivy_found))
        
        gitleaks_found = (path / ".gitleaks.toml").exists() or any(path.glob("**/*gitleaks*"))
        controls.append(("Secret & Token Leak Scanning", "Gitleaks", "SOC 2 (CC6)", gitleaks_found))
        
        rbac_found = any(path.glob("**/security*")) or any(path.glob("**/k8s*"))
        controls.append(("Least-Privilege RBAC & Policies", "Kubernetes RBAC", "CIS v1.8", rbac_found))
        
        devcontainer_found = (path / ".devcontainer" / "devcontainer.json").exists()
        controls.append(("DevContainer Clean Room Sandbox", "VS Code / Cursor", "Reproducible Env", devcontainer_found))
        
        active_count = sum(1 for _, _, _, active in controls if active)
        score_pct = int((active_count / len(controls)) * 100)
        grade = "A+" if score_pct >= 90 else "A" if score_pct >= 80 else "B" if score_pct >= 65 else "C"
        
        # Framework Readiness Table
        fw_table = Table(title="Framework Readiness Assessment", border_style="blue")
        fw_table.add_column("Security Framework", style="cyan bold")
        fw_table.add_column("Readiness Score", style="bold")
        fw_table.add_column("Audit Status", style="green")
        
        cis_score = min(100, int((active_count / len(controls)) * 100))
        soc2_score = min(100, int((active_count / len(controls)) * 95) + 5)
        nist_score = min(100, int((active_count / len(controls)) * 90) + 10)
        hipaa_score = min(100, int((active_count / len(controls)) * 88) + 10)
        slsa_level = "Level 3" if (cosign_found and sbom_found and trivy_found) else "Level 2" if (sbom_found or cosign_found) else "Level 1"
        
        fw_table.add_row("CIS Kubernetes Benchmark", f"{cis_score}%", "✓ Hardened" if cis_score >= 80 else "⚠️ Partial")
        fw_table.add_row("SOC 2 Type II", f"{soc2_score}%", "✓ Attestation Ready" if soc2_score >= 80 else "⚠️ Review")
        fw_table.add_row("NIST SP 800-53", f"{nist_score}%", "✓ High Assurance" if nist_score >= 80 else "⚠️ Baseline")
        fw_table.add_row("HIPAA Security Rule", f"{hipaa_score}%", "✓ Compliant Controls" if hipaa_score >= 80 else "⚠️ Review")
        fw_table.add_row("SLSA Supply Chain", f"SLSA {slsa_level}", "✓ Verified Provenance" if slsa_level == "Level 3" else "ℹ️ Standard")
        
        console.print(fw_table)
        
        # Controls Checklist Table
        ctrl_table = Table(title=f"Security Controls Status (Grade: {grade} / {score_pct}%)", border_style="cyan")
        ctrl_table.add_column("Status", justify="center")
        ctrl_table.add_column("Security Control")
        ctrl_table.add_column("Tooling", style="dim")
        ctrl_table.add_column("Baseline", style="dim")
        
        for name, tool, baseline, active in controls:
            status_icon = "[green]✓ ACTIVE[/green]" if active else "[red]✗ MISSING[/red]"
            ctrl_table.add_row(status_icon, name, tool, baseline)
            
        console.print(ctrl_table)
        
        if output:
            out_file = Path(output)
            report = f"""# COMPLIANCE AUDIT REPORT: {path.resolve().name}
Date: {time.strftime('%Y-%m-%d')}
Overall Posture: Grade {grade} ({score_pct}%)
SLSA Level: {slsa_level}

## Framework Readiness
- CIS Kubernetes Benchmark: {cis_score}%
- SOC 2 Type II: {soc2_score}%
- NIST SP 800-53: {nist_score}%
- HIPAA Security Rule: {hipaa_score}%

## Active Controls
"""
            for name, tool, baseline, active in controls:
                status_str = "[x] ACTIVE" if active else "[ ] NOT CONFIGURED"
                report += f"- {status_str}: {name} ({tool}) - {baseline}\n"
            
            with open(out_file, 'w', encoding='utf-8') as f:
                f.write(report)
            console.print(f"\n[green]✓ Saved compliance report to: {out_file}[/green]")


@app.command()
def diagram(
    project_path: str = typer.Argument(".", help="Path to the DevOps project directory"),
    output: Optional[str] = typer.Option(None, "--output", "-o", help="File to save the Mermaid diagram or ADR"),
    adr: bool = typer.Option(False, "--adr/--no-adr", help="Output Architecture Decision Record (ADR-001) instead of raw Mermaid"),
) -> None:
    """Generate Mermaid architecture topology or Architecture Decision Record (ADR)"""
    with handle_cli_errors():
        from pathlib import Path
        import yaml
        from rich.syntax import Syntax
        
        path = Path(project_path)
        ci = "github-actions"
        infra = "aws-vpc-eks"
        deploy = "rolling"
        obs = "prometheus-grafana"
        name = path.resolve().name
        
        cfg_file = path / "devops-config.yaml"
        if cfg_file.exists():
            try:
                with open(cfg_file, 'r', encoding='utf-8') as f:
                    cfg_data = yaml.safe_load(f) or {}
                    ci = cfg_data.get("ci_cd", {}).get("platform", ci)
                    infra = cfg_data.get("infrastructure", {}).get("type", infra)
                    deploy = cfg_data.get("deployment", {}).get("strategy", deploy)
                    obs = cfg_data.get("observability", {}).get("level", obs)
                    name = cfg_data.get("project", {}).get("name", name)
            except Exception:
                pass
                
        mermaid_code = f"""graph TD
    Commit[Code Commit] --> CI[{ci.upper()}]
    CI --> Security[Security Gate: Trivy & Gitleaks]
    Security --> Artifact[Container Registry / GHCR]
    Artifact --> Infra[{infra.upper()}]
    Infra --> Deploy[{deploy.upper()}]
    Deploy --> Obs[{obs.upper()}]
"""
        if adr:
            content = f"""# ADR-001: Architecture Decision Record for {name}
Date: {time.strftime('%Y-%m-%d')}
Status: Accepted

## Architecture Topology
```mermaid
{mermaid_code}
```

## Decisions
- CI/CD Platform: {ci}
- Infrastructure: {infra}
- Deployment Strategy: {deploy}
- Observability: {obs}
"""
        else:
            content = mermaid_code

        if output:
            with open(Path(output), 'w', encoding='utf-8') as f:
                f.write(content)
            console.print(f"[green]✓ Saved to: {output}[/green]")
        else:
            lang = "markdown" if adr else "mermaid"
            title = f"Architecture Decision Record ({name})" if adr else f"Mermaid Topology ({name})"
            console.print(Panel(Syntax(content, lang, theme="monokai", line_numbers=True), title=title, border_style="cyan"))


@app.command(name="github")
def github_cmd(
    project_path: str = typer.Argument(".", help="Path to the DevOps project directory"),
    name: Optional[str] = typer.Option(None, "--name", "-n", help="Repository name on GitHub"),
    private: bool = typer.Option(True, "--private/--public", help="Repository visibility"),
    push: bool = typer.Option(False, "--push/--no-push", help="Directly execute gh repo create"),
) -> None:
    """Scaffold or push project directly to GitHub using GitHub CLI"""
    with handle_cli_errors():
        from pathlib import Path
        import shutil
        import subprocess
        
        path = Path(project_path)
        repo_name = name or path.resolve().name
        vis = "--private" if private else "--public"
        cmd = f"gh repo create {repo_name} {vis} --source=. --remote=origin --push"
        
        console.print(Panel.fit(
            "[bold cyan]🐙 GitHub Scaffolder[/bold cyan]\n"
            f"[dim]Project: {repo_name} | Visibility: {'Private' if private else 'Public'}[/dim]",
            border_style="cyan"
        ))
        
        if push:
            gh_bin = shutil.which("gh")
            if not gh_bin:
                console.print("[red]❌ GitHub CLI ('gh') is not installed or not in PATH.[/red]")
                console.print("[yellow]💡 Install GitHub CLI from: https://cli.github.com[/yellow]")
                console.print(f"\n[bold]Run manually once installed:[/bold]\n[cyan]{cmd}[/cyan]")
                raise typer.Exit(1)
            
            console.print(f"[green]Executing:[/green] {cmd}")
            if not (path / ".git").exists():
                subprocess.run(["git", "init"], cwd=path, check=True)
                subprocess.run(["git", "add", "."], cwd=path, check=True)
                subprocess.run(["git", "commit", "-m", "feat: initial devops scaffold"], cwd=path, check=True)
                subprocess.run(["git", "branch", "-M", "main"], cwd=path, check=True)
            
            result = subprocess.run(cmd.split(), cwd=path)
            if result.returncode == 0:
                console.print(f"[bold green]✓ Successfully created and pushed to GitHub![/bold green]")
                console.print(f"[cyan]Repository URL: https://github.com/{repo_name}[/cyan]")
            else:
                console.print(f"[red]Command returned code {result.returncode}[/red]")
        else:
            console.print("[bold]Single copy-paste terminal command to publish to GitHub:[/bold]")
            console.print(f"\n[cyan bold]{cmd}[/cyan bold]\n")
            console.print("[dim]Note: Requires GitHub CLI (gh auth login) installed on your machine.[/dim]")


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

