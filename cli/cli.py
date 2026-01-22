#!/usr/bin/env python3
"""
CLI interface for DevOps Project Generator
"""

import os
import sys
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
        True,
        "--interactive/--no-interactive",
        help="Interactive mode",
    ),
) -> None:
    """Initialize a new DevOps project"""
    
    console.print(Panel.fit(
        "[bold blue]🚀 DevOps Project Generator[/bold blue]\n"
        "[dim]Scaffold production-ready DevOps repositories[/dim]",
        border_style="blue"
    ))
    
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
        raise typer.Exit(1)
    
    # Generate project
    generator = DevOpsProjectGenerator(config, output_dir)
    
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console,
    ) as progress:
        task = progress.add_task("Generating DevOps project...", total=None)
        
        try:
            generator.generate()
            progress.update(task, description="✅ Project generated successfully!")
            
            console.print("\n[green]✅ DevOps project generated successfully![/green]")
            console.print(f"\n[bold]Project location:[/bold] {output_dir}/{config.project_name}")
            console.print("\n[bold]Next steps:[/bold]")
            console.print(f"  cd {config.project_name}")
            console.print("  make help")
            
        except Exception as e:
            progress.update(task, description="❌ Generation failed!")
            console.print(f"\n[red]❌ Error generating project: {str(e)}[/red]")
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
    
    ci = typer.prompt("Choose CI/CD platform", type=str)
    
    # Infrastructure selection
    infra_table = Table(title="Infrastructure Tools")
    infra_table.add_column("Option", style="cyan")
    infra_table.add_column("Description")
    infra_table.add_row("terraform", "Terraform IaC")
    infra_table.add_row("cloudformation", "AWS CloudFormation")
    infra_table.add_row("none", "No IaC")
    console.print(infra_table)
    
    infra = typer.prompt("Choose infrastructure tool", type=str)
    
    # Deployment selection
    deploy_table = Table(title="Deployment Methods")
    deploy_table.add_column("Option", style="cyan")
    deploy_table.add_column("Description")
    deploy_table.add_row("vm", "Virtual Machine deployment")
    deploy_table.add_row("docker", "Docker container deployment")
    deploy_table.add_row("kubernetes", "Kubernetes deployment")
    console.print(deploy_table)
    
    deploy = typer.prompt("Choose deployment method", type=str)
    
    # Environments
    envs = typer.prompt("Choose environments (single, dev,stage,prod)", type=str)
    
    # Observability
    obs_table = Table(title="Observability Levels")
    obs_table.add_column("Option", style="cyan")
    obs_table.add_column("Description")
    obs_table.add_row("logs", "Logs only")
    obs_table.add_row("logs-metrics", "Logs + Metrics")
    obs_table.add_row("full", "Logs + Metrics + Alerts")
    console.print(obs_table)
    
    observability = typer.prompt("Choose observability level", type=str)
    
    # Security
    sec_table = Table(title="Security Levels")
    sec_table.add_column("Option", style="cyan")
    sec_table.add_column("Description")
    sec_table.add_row("basic", "Basic security practices")
    sec_table.add_row("standard", "Standard security measures")
    sec_table.add_row("strict", "Strict security controls")
    console.print(sec_table)
    
    security = typer.prompt("Choose security level", type=str)
    
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
def version() -> None:
    """Show version information"""
    from . import __version__
    console.print(f"[bold blue]DevOps Project Generator[/bold blue] v{__version__}")


if __name__ == "__main__":
    app()
