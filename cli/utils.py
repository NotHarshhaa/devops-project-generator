#!/usr/bin/env python3
"""
CLI utility functions for DevOps Project Generator
"""

import os
import sys
import json
import datetime
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple

import typer
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TextColumn

logger = logging.getLogger(__name__)


def create_console() -> Console:
    """Create a Rich console with UTF-8 support on Windows."""
    if sys.platform == "win32":
        try:
            sys.stdout.reconfigure(encoding="utf-8")
            sys.stderr.reconfigure(encoding="utf-8")
        except Exception:
            pass
    return Console(force_terminal=True, legacy_windows=False)


console = create_console()


def format_duration(seconds: float) -> str:
    """Format duration in human-readable format"""
    if seconds < 1:
        return f"{int(seconds * 1000)}ms"
    elif seconds < 60:
        return f"{seconds:.1f}s"
    else:
        minutes = int(seconds // 60)
        remaining_seconds = int(seconds % 60)
        return f"{minutes}m {remaining_seconds}s"


def format_file_size(bytes_size: int) -> str:
    """Format file size in human-readable format"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes_size < 1024.0:
            return f"{bytes_size:.1f} {unit}"
        bytes_size /= 1024.0
    return f"{bytes_size:.1f} TB"


def calculate_project_stats(project_path: Path) -> Dict[str, Any]:
    """Calculate comprehensive project statistics"""
    stats = {
        'files': 0,
        'directories': 0,
        'size': 0,
        'size_formatted': '0 B'
    }
    
    if not project_path.exists():
        return stats
    
    try:
        for item in project_path.rglob('*'):
            if item.is_file():
                stats['files'] += 1
                stats['size'] += item.stat().st_size
            elif item.is_dir():
                stats['directories'] += 1
        
        stats['size_formatted'] = format_file_size(stats['size'])
    except Exception as e:
        logger.warning(f"Error calculating project stats: {str(e)}")
    
    return stats


def show_success_message(title: str, message: str) -> None:
    """Display a success message with consistent formatting"""
    console.print(Panel.fit(
        f"[bold green]✅ {title}[/bold green]\n{message}",
        border_style="green"
    ))


def show_error_message(title: str, message: str) -> None:
    """Display an error message with consistent formatting"""
    console.print(Panel.fit(
        f"[bold red]❌ {title}[/bold red]\n{message}",
        border_style="red"
    ))


def show_warning_message(title: str, message: str) -> None:
    """Display a warning message with consistent formatting"""
    console.print(Panel.fit(
        f"[bold yellow]⚠️  {title}[/bold yellow]\n{message}",
        border_style="yellow"
    ))


def show_progress_spinner(description: str):
    """Show a progress spinner for long operations"""
    return Progress(
        SpinnerColumn(),
        TextColumn(description),
        console=console,
        transient=True,
    )


def safe_execute(func, *args, **kwargs):
    """Safely execute a function with consistent error handling"""
    try:
        return func(*args, **kwargs)
    except KeyboardInterrupt:
        console.print("\n[yellow]⚠️  Operation cancelled by user[/yellow]")
        logger.info("Operation cancelled by user")
        raise typer.Exit(130)
    except Exception as e:
        logger.error(f"Error in {func.__name__}: {str(e)}", exc_info=True)
        show_error_message("Operation Failed", str(e))
        raise typer.Exit(1)


def validate_project_name(name: str) -> str:
    """Validate and sanitize project name"""
    if not name:
        raise typer.BadParameter("Project name cannot be empty")
    
    # Basic validation
    if len(name) > 50:
        raise typer.BadParameter("Project name too long (max 50 characters)")
    
    # Check for invalid characters
    if not name.replace('-', '').replace('_', '').isalnum():
        raise typer.BadParameter("Project name can only contain letters, numbers, hyphens, and underscores")
    
    return name


def validate_output_path(path: str) -> Path:
    """Validate output path and permissions"""
    output_path = Path(path)
    
    if not output_path.exists():
        try:
            output_path.mkdir(parents=True, exist_ok=True)
        except PermissionError:
            raise typer.BadParameter(f"Permission denied creating directory: {output_path}")
    
    if not output_path.is_dir():
        raise typer.BadParameter(f"Output path is not a directory: {output_path}")
    
    # Check write permissions
    test_file = output_path / '.devops_generator_test'
    try:
        test_file.touch()
        test_file.unlink()
    except PermissionError:
        raise typer.BadParameter(f"No write permission in directory: {output_path}")
    
    return output_path


def create_backup_filename(project_name: str, compress: bool = True) -> str:
    """Generate backup filename with timestamp"""
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    extension = ".tar.gz" if compress else ".tar"
    return f"{project_name}_backup_{timestamp}{extension}"


def get_profiles_dir() -> Path:
    """Get profiles directory"""
    home = Path.home()
    profiles_dir = home / ".devops-project-generator" / "profiles"
    profiles_dir.mkdir(parents=True, exist_ok=True)
    return profiles_dir


def categorize_file(file_path: Path) -> Optional[str]:
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


def calculate_devops_score(components: Dict[str, Dict]) -> int:
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
        if comp.get("files"):
            # Give partial credit based on number of files
            file_count = len(comp["files"])
            category_score = min(weight, weight * (file_count / 3))  # Max score at 3+ files
            score += int(category_score)
    
    return min(score, max_score)


def generate_recommendations(stats: Dict[str, Any]) -> List[str]:
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


def safe_print(console_output: str, fallback: str = None) -> None:
    """Safely print console output with fallback for markup errors"""
    try:
        console.print(console_output)
    except Exception as e:
        if "markup" in str(e).lower() or "rich" in str(e).lower():
            if fallback:
                console.print(fallback)
            else:
                # Remove rich markup and print plain text
                import re
                plain_text = re.sub(r'\[/?[^\]]+\]', '', console_output)
                console.print(plain_text)
        else:
            raise
