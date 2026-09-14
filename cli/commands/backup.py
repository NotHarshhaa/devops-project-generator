#!/usr/bin/env python3
"""
Backup and restore commands for DevOps Project Generator
"""

import datetime
import json
import logging
import shutil
import tarfile
from pathlib import Path
from typing import Optional

import typer
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from ..utils import create_backup_filename

logger = logging.getLogger(__name__)
console = Console()


def backup(action: str, project_path: str = ".", backup_file: Optional[str] = None,
           include_config: bool = True, compress: bool = True) -> None:
    """Create and restore project backups"""
    resolved_path = Path(project_path).resolve()
    
    if action == "create":
        _create_backup(resolved_path, include_config, compress)
    elif action == "restore":
        if not backup_file:
            console.print("[red]❌ Backup file required for restore action[/red]")
            console.print("[yellow]Usage: devops-project-generator backup restore --file <backup-file>[/yellow]")
            raise typer.Exit(1)
        _restore_backup(resolved_path, backup_file)
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
    backup_name = create_backup_filename(project_path.name, compress)
    backup_file = project_path.parent / backup_name
    
    console.print(f"[blue]📦 Creating backup: {backup_file.name}[/blue]")
    
    try:
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
            "version": "2.0.0"
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
