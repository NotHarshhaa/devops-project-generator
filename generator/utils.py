#!/usr/bin/env python3
"""
Generator utilities module for common helper functions
"""

import os
import shutil
import hashlib
from pathlib import Path
from typing import Dict, Any, List, Optional, Set
from functools import lru_cache
import logging

logger = logging.getLogger(__name__)


class TemplateCache:
    """Optimized template caching system"""
    
    def __init__(self, max_size: int = 200):
        self._cache: Dict[str, Any] = {}
        self._access_order: List[str] = []
        self.max_size = max_size
    
    def get(self, key: str) -> Optional[Any]:
        """Get cached template"""
        if key in self._cache:
            # Move to end (most recently used)
            self._access_order.remove(key)
            self._access_order.append(key)
            return self._cache[key]
        return None
    
    def set(self, key: str, value: Any) -> None:
        """Set cached template with LRU eviction"""
        if key in self._cache:
            self._access_order.remove(key)
        elif len(self._cache) >= self.max_size:
            # Remove least recently used
            oldest = self._access_order.pop(0)
            del self._cache[oldest]
        
        self._cache[key] = value
        self._access_order.append(key)
    
    def clear(self) -> None:
        """Clear all cached templates"""
        self._cache.clear()
        self._access_order.clear()


class FileOperations:
    """Optimized file operations with error handling"""
    
    @staticmethod
    def safe_write_file(file_path: Path, content: str, backup: bool = True) -> bool:
        """Safely write file with optional backup"""
        try:
            # Create backup if file exists and backup is enabled
            if backup and file_path.exists():
                backup_path = file_path.with_suffix(f"{file_path.suffix}.backup")
                shutil.copy2(file_path, backup_path)
            
            # Ensure parent directory exists
            file_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Write file atomically
            temp_path = file_path.with_suffix(f"{file_path.suffix}.tmp")
            with open(temp_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            # Atomic rename
            temp_path.replace(file_path)
            
            logger.debug(f"Successfully wrote file: {file_path}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to write file {file_path}: {str(e)}")
            return False
    
    @staticmethod
    def safe_copy_file(src: Path, dst: Path, preserve_metadata: bool = True) -> bool:
        """Safely copy file with metadata preservation"""
        try:
            dst.parent.mkdir(parents=True, exist_ok=True)
            
            if preserve_metadata:
                shutil.copy2(src, dst)
            else:
                shutil.copy(src, dst)
            
            logger.debug(f"Successfully copied file: {src} -> {dst}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to copy file {src} to {dst}: {str(e)}")
            return False
    
    @staticmethod
    def get_file_hash(file_path: Path) -> str:
        """Calculate SHA256 hash of file"""
        hash_sha256 = hashlib.sha256()
        try:
            with open(file_path, "rb") as f:
                for chunk in iter(lambda: f.read(4096), b""):
                    hash_sha256.update(chunk)
            return hash_sha256.hexdigest()
        except Exception as e:
            logger.error(f"Failed to calculate hash for {file_path}: {str(e)}")
            return ""


class PathUtils:
    """Path manipulation utilities"""
    
    @staticmethod
    @lru_cache(maxsize=128)
    def normalize_path(path: Path) -> Path:
        """Normalize and cache path resolution"""
        return path.resolve()
    
    @staticmethod
    def get_relative_path(base: Path, target: Path) -> Path:
        """Get relative path from base to target"""
        try:
            return target.relative_to(base)
        except ValueError:
            # If not relative, return absolute path
            return target.resolve()
    
    @staticmethod
    def ensure_directory(dir_path: Path, clean: bool = False) -> bool:
        """Ensure directory exists, optionally cleaning it"""
        try:
            if clean and dir_path.exists():
                shutil.rmtree(dir_path)
            
            dir_path.mkdir(parents=True, exist_ok=True)
            return True
            
        except Exception as e:
            logger.error(f"Failed to ensure directory {dir_path}: {str(e)}")
            return False


class ValidationUtils:
    """Validation utilities for generator components"""
    
    @staticmethod
    def validate_project_name(name: str) -> tuple[bool, List[str]]:
        """Validate project name with comprehensive checks"""
        errors = []
        
        if not name:
            errors.append("Project name cannot be empty")
            return False, errors
        
        if len(name) < 2:
            errors.append("Project name must be at least 2 characters long")
        
        if len(name) > 50:
            errors.append("Project name must not exceed 50 characters")
        
        # Check for valid characters
        import re
        if not re.match(r'^[a-zA-Z][a-zA-Z0-9_-]*$', name):
            errors.append("Project name must start with letter and contain only letters, numbers, hyphens, and underscores")
        
        # Check for reserved names
        reserved_names = {
            'con', 'prn', 'aux', 'nul', 'com1', 'com2', 'com3', 'com4', 'com5',
            'com6', 'com7', 'com8', 'com9', 'lpt1', 'lpt2', 'lpt3', 'lpt4', 'lpt5',
            'lpt6', 'lpt7', 'lpt8', 'lpt9'
        }
        if name.lower() in reserved_names:
            errors.append(f"'{name}' is a reserved name")
        
        return len(errors) == 0, errors
    
    @staticmethod
    def validate_output_path(path: Path) -> tuple[bool, List[str]]:
        """Validate output path for project generation"""
        errors = []
        
        if not path.parent.exists():
            errors.append(f"Parent directory does not exist: {path.parent}")
        
        if path.exists() and not path.is_dir():
            errors.append(f"Path exists but is not a directory: {path}")
        
        if path.exists():
            # Check if directory is empty
            if any(path.iterdir()):
                errors.append(f"Directory is not empty: {path}")
        
        # Check write permissions
        try:
            test_file = path / ".write_test"
            test_file.touch()
            test_file.unlink()
        except Exception:
            errors.append(f"No write permission for directory: {path}")
        
        return len(errors) == 0, errors


class PerformanceUtils:
    """Performance monitoring and optimization utilities"""
    
    def __init__(self):
        self._metrics: Dict[str, float] = {}
    
    def start_timer(self, operation: str) -> None:
        """Start timing an operation"""
        import time
        self._metrics[f"{operation}_start"] = time.time()
    
    def end_timer(self, operation: str) -> float:
        """End timing an operation and return duration"""
        import time
        start_key = f"{operation}_start"
        if start_key in self._metrics:
            duration = time.time() - self._metrics[start_key]
            self._metrics[f"{operation}_duration"] = duration
            del self._metrics[start_key]
            return duration
        return 0.0
    
    def get_metrics(self) -> Dict[str, float]:
        """Get all performance metrics"""
        return {k: v for k, v in self._metrics.items() if k.endswith('_duration')}
    
    def clear_metrics(self) -> None:
        """Clear all performance metrics"""
        self._metrics.clear()


class ProgressTracker:
    """Progress tracking for long-running operations"""
    
    def __init__(self, total_steps: int):
        self.total_steps = total_steps
        self.completed_steps = 0
        self.step_descriptions: Dict[int, str] = {}
    
    def add_step(self, step_number: int, description: str) -> None:
        """Add a step with description"""
        self.step_descriptions[step_number] = description
    
    def complete_step(self, step_number: int) -> None:
        """Mark a step as completed"""
        if step_number not in self.step_descriptions:
            self.step_descriptions[step_number] = f"Step {step_number}"
        self.completed_steps = max(self.completed_steps, step_number)
    
    def get_progress(self) -> float:
        """Get progress as percentage"""
        if self.total_steps == 0:
            return 0.0
        return (self.completed_steps / self.total_steps) * 100
    
    def get_status(self) -> str:
        """Get current status description"""
        if self.completed_steps >= self.total_steps:
            return "Completed"
        
        current_step = self.completed_steps + 1
        description = self.step_descriptions.get(current_step, f"Step {current_step}")
        return f"Working on: {description}"
