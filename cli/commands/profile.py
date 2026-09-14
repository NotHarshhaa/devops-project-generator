#!/usr/bin/env python3
"""
Profile management commands for DevOps Project Generator
"""

import datetime
import json
import logging
from pathlib import Path
from typing import Optional

import typer
from rich.console import Console
from rich.panel import Panel

from ..utils import get_profiles_dir

logger = logging.getLogger(__name__)
console = Console()


def profile(action: str, name: Optional[str] = None, file: Optional[str] = None) -> None:
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


def _list_profiles() -> None:
    """List saved profiles"""
    profiles_dir = get_profiles_dir()
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
    profiles_dir = get_profiles_dir()
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
        "version": "2.0.0"
    }
    
    with open(profile_file, 'w', encoding='utf-8') as f:
        json.dump(profile_data, f, indent=2, ensure_ascii=False)
    
    console.print(f"[green]✅ Profile saved: {name}[/green]")
    console.print(f"[dim]Location: {profile_file}[/dim]")


def _load_profile(name: str) -> None:
    """Load and display a profile"""
    profiles_dir = get_profiles_dir()
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
    profiles_dir = get_profiles_dir()
    profile_file = profiles_dir / f"{name}.json"
    
    if not profile_file.exists():
        console.print(f"[red]❌ Profile not found: {name}[/red]")
        raise typer.Exit(1)
    
    if typer.confirm(f"Delete profile '{name}'?"):
        profile_file.unlink()
        console.print(f"[green]✅ Profile deleted: {name}[/green]")
    else:
        console.print("[dim]Operation cancelled.[/dim]")
