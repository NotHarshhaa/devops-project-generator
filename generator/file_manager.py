#!/usr/bin/env python3
"""
File management and project structure operations
"""

import os
import shutil
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional, Set, Tuple
from dataclasses import dataclass
from concurrent.futures import ThreadPoolExecutor, as_completed

from .utils import FileOperations, PathUtils, ValidationUtils, ProgressTracker

logger = logging.getLogger(__name__)


@dataclass
class FileOperation:
    """Represents a file operation to be performed"""
    operation_type: str
    destination: Path
    source: Optional[Path] = None
    content: Optional[str] = None
    metadata: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}


class ProjectStructureManager:
    """Manages project structure creation and file operations"""
    
    def __init__(self, project_path: Path, max_workers: int = 4):
        self.project_path = PathUtils.normalize_path(project_path)
        self.max_workers = max_workers
        self.operations: List[FileOperation] = []
        self.completed_operations: Set[str] = set()
        self.failed_operations: Dict[str, str] = {}
    
    def add_directory(self, dir_path: str, clean: bool = False) -> None:
        """Add directory creation operation"""
        full_path = self.project_path / dir_path
        
        operation = FileOperation(
            operation_type='create',
            destination=full_path,
            metadata={'clean': clean, 'is_directory': True}
        )
        self.operations.append(operation)
    
    def add_file_creation(self, file_path: str, content: str) -> None:
        """Add file creation operation"""
        full_path = self.project_path / file_path
        
        operation = FileOperation(
            operation_type='create',
            destination=full_path,
            content=content,
            metadata={'is_directory': False}
        )
        self.operations.append(operation)
    
    def add_file_copy(self, source: str, destination: str) -> None:
        """Add file copy operation"""
        source_path = Path(source)
        dest_path = self.project_path / destination
        
        operation = FileOperation(
            operation_type='copy',
            source=source_path,
            destination=dest_path,
            metadata={'is_directory': False}
        )
        self.operations.append(operation)
    
    def add_template_file(self, template_path: str, output_path: str, 
                          variables: Dict[str, Any]) -> None:
        """Add template file creation operation"""
        full_output_path = self.project_path / output_path
        
        operation = FileOperation(
            operation_type='template',
            destination=full_output_path,
            content=template_path,
            metadata={'variables': variables, 'is_directory': False}
        )
        self.operations.append(operation)
    
    def execute_single_operation(self, operation: FileOperation) -> Tuple[bool, str]:
        """Execute a single file operation"""
        try:
            if operation.operation_type == 'create':
                return self._execute_create(operation)
            elif operation.operation_type == 'copy':
                return self._execute_copy(operation)
            elif operation.operation_type == 'template':
                return self._execute_template(operation)
            else:
                return False, f"Unknown operation type: {operation.operation_type}"
                
        except Exception as e:
            logger.error(f"Operation failed: {str(e)}")
            return False, str(e)
    
    def _execute_create(self, operation: FileOperation) -> Tuple[bool, str]:
        """Execute file/directory creation"""
        if operation.metadata.get('is_directory'):
            # Create directory
            clean = operation.metadata.get('clean', False)
            success = PathUtils.ensure_directory(operation.destination, clean)
            return success, "Directory created" if success else "Failed to create directory"
        else:
            # Create file
            if operation.content is None:
                return False, "No content provided for file creation"
            
            success = FileOperations.safe_write_file(operation.destination, operation.content)
            return success, "File created" if success else "Failed to create file"
    
    def _execute_copy(self, operation: FileOperation) -> Tuple[bool, str]:
        """Execute file copy"""
        if not operation.source or not operation.source.exists():
            return False, f"Source file does not exist: {operation.source}"
        
        success = FileOperations.safe_copy_file(operation.source, operation.destination)
        return success, "File copied" if success else "Failed to copy file"
    
    def _execute_template(self, operation: FileOperation) -> Tuple[bool, str]:
        """Execute template rendering (placeholder for now)"""
        # This would integrate with the template engine
        # For now, just create the file with basic content
        template_content = f"# Template: {operation.content}\n# Variables: {operation.metadata.get('variables', {})}"
        success = FileOperations.safe_write_file(operation.destination, template_content)
        return success, "Template file created" if success else "Failed to create template file"
    
    def execute_all(self, parallel: bool = True) -> Dict[str, Any]:
        """Execute all queued operations"""
        if not self.operations:
            return {"success": True, "message": "No operations to execute"}
        
        results = {
            "total": len(self.operations),
            "successful": 0,
            "failed": 0,
            "details": {}
        }
        
        if parallel and len(self.operations) > 1:
            results = self._execute_parallel(results)
        else:
            results = self._execute_sequential(results)
        
        return results
    
    def _execute_parallel(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """Execute operations in parallel"""
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            # Submit all operations
            future_to_op = {
                executor.submit(self.execute_single_operation, op): i
                for i, op in enumerate(self.operations)
            }
            
            # Collect results
            for future in as_completed(future_to_op):
                op_index = future_to_op[future]
                operation = self.operations[op_index]
                
                try:
                    success, message = future.result()
                    op_key = str(operation.destination)
                    
                    if success:
                        results["successful"] += 1
                        self.completed_operations.add(op_key)
                        results["details"][op_key] = {"status": "success", "message": message}
                    else:
                        results["failed"] += 1
                        self.failed_operations[op_key] = message
                        results["details"][op_key] = {"status": "failed", "message": message}
                        
                except Exception as e:
                    op_key = str(operation.destination)
                    results["failed"] += 1
                    error_msg = str(e)
                    self.failed_operations[op_key] = error_msg
                    results["details"][op_key] = {"status": "failed", "message": error_msg}
        
        return results
    
    def _execute_sequential(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """Execute operations sequentially"""
        for operation in self.operations:
            op_key = str(operation.destination)
            success, message = self.execute_single_operation(operation)
            
            if success:
                results["successful"] += 1
                self.completed_operations.add(op_key)
                results["details"][op_key] = {"status": "success", "message": message}
            else:
                results["failed"] += 1
                self.failed_operations[op_key] = message
                results["details"][op_key] = {"status": "failed", "message": message}
        
        return results
    
    def clear_operations(self) -> None:
        """Clear all queued operations"""
        self.operations.clear()
        self.completed_operations.clear()
        self.failed_operations.clear()
    
    def get_operation_summary(self) -> Dict[str, Any]:
        """Get summary of queued and completed operations"""
        return {
            "queued": len(self.operations),
            "completed": len(self.completed_operations),
            "failed": len(self.failed_operations),
            "operations": [
                {
                    "type": op.operation_type,
                    "destination": str(op.destination),
                    "status": "completed" if str(op.destination) in self.completed_operations else 
                            "failed" if str(op.destination) in self.failed_operations else "pending"
                }
                for op in self.operations
            ]
        }


class ProjectValidator:
    """Validates project structure and configuration"""
    
    def __init__(self, project_path: Path):
        self.project_path = PathUtils.normalize_path(project_path)
        self.validation_rules = self._setup_validation_rules()
    
    def _setup_validation_rules(self) -> Dict[str, Any]:
        """Setup validation rules for project structure"""
        return {
            "required_directories": [
                "app", "ci", "infra", "deploy", "monitoring", "security"
            ],
            "required_files": [
                "README.md", "Makefile", ".gitignore"
            ],
            "recommended_directories": [
                "scripts", "docs", "tests"
            ],
            "recommended_files": [
                "Dockerfile", "docker-compose.yml"
            ]
        }
    
    def validate_structure(self) -> Dict[str, Any]:
        """Validate complete project structure"""
        results = {
            "valid": True,
            "errors": [],
            "warnings": [],
            "missing_directories": [],
            "missing_files": [],
            "recommendations": []
        }
        
        # Check required directories
        for dir_name in self.validation_rules["required_directories"]:
            dir_path = self.project_path / dir_name
            if not dir_path.exists():
                results["missing_directories"].append(dir_name)
                results["errors"].append(f"Missing required directory: {dir_name}")
                results["valid"] = False
        
        # Check required files
        for file_name in self.validation_rules["required_files"]:
            file_path = self.project_path / file_name
            if not file_path.exists():
                results["missing_files"].append(file_name)
                results["errors"].append(f"Missing required file: {file_name}")
                results["valid"] = False
        
        # Check recommended items
        for dir_name in self.validation_rules["recommended_directories"]:
            dir_path = self.project_path / dir_name
            if not dir_path.exists():
                results["recommendations"].append(f"Consider adding directory: {dir_name}")
        
        for file_name in self.validation_rules["recommended_files"]:
            file_path = self.project_path / file_name
            if not file_path.exists():
                results["recommendations"].append(f"Consider adding file: {file_name}")
        
        return results
    
    def validate_file_content(self, file_path: Path) -> Dict[str, Any]:
        """Validate specific file content"""
        results = {
            "valid": True,
            "errors": [],
            "warnings": []
        }
        
        if not file_path.exists():
            results["valid"] = False
            results["errors"].append("File does not exist")
            return results
        
        try:
            content = file_path.read_text(encoding='utf-8')
            
            # Basic content validation
            if len(content.strip()) == 0:
                results["warnings"].append("File is empty")
            
            # File-specific validation
            if file_path.name == "README.md":
                if len(content) < 100:
                    results["warnings"].append("README.md is too short")
                if "# " not in content:
                    results["warnings"].append("README.md lacks proper headings")
            
            elif file_path.name == "Makefile":
                if "all:" not in content and "help:" not in content:
                    results["warnings"].append("Makefile lacks standard targets")
            
            elif file_path.name == ".gitignore":
                common_patterns = [".env", "__pycache__", "node_modules", "*.log"]
                missing_patterns = [p for p in common_patterns if p not in content]
                if missing_patterns:
                    results["warnings"].append(f"Consider ignoring: {', '.join(missing_patterns)}")
            
        except Exception as e:
            results["valid"] = False
            results["errors"].append(f"Failed to read file: {str(e)}")
        
        return results
    
    def generate_report(self) -> str:
        """Generate comprehensive validation report"""
        structure_results = self.validate_structure()
        
        report_lines = [
            "# Project Validation Report",
            f"Project: {self.project_path.name}",
            f"Status: {'✅ Valid' if structure_results['valid'] else '❌ Invalid'}",
            "",
            "## Summary",
            f"- Errors: {len(structure_results['errors'])}",
            f"- Warnings: {len(structure_results['warnings'])}",
            f"- Recommendations: {len(structure_results['recommendations'])}",
            ""
        ]
        
        if structure_results['errors']:
            report_lines.extend([
                "## ❌ Errors",
                *[f"- {error}" for error in structure_results['errors']],
                ""
            ])
        
        if structure_results['warnings']:
            report_lines.extend([
                "## ⚠️ Warnings", 
                *[f"- {warning}" for warning in structure_results['warnings']],
                ""
            ])
        
        if structure_results['recommendations']:
            report_lines.extend([
                "## 💡 Recommendations",
                *[f"- {rec}" for rec in structure_results['recommendations']],
                ""
            ])
        
        return "\n".join(report_lines)


class BackupManager:
    """Manages project backups and restoration"""
    
    def __init__(self, project_path: Path):
        self.project_path = PathUtils.normalize_path(project_path)
        self.backup_dir = self.project_path.parent / f"{self.project_path.name}_backups"
        self.backup_dir.mkdir(exist_ok=True)
    
    def create_backup(self, include_config: bool = True, compress: bool = True) -> Tuple[bool, str]:
        """Create project backup"""
        import datetime
        import tarfile
        
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_name = f"{self.project_path.name}_backup_{timestamp}"
        
        if compress:
            backup_file = self.backup_dir / f"{backup_name}.tar.gz"
        else:
            backup_file = self.backup_dir / f"{backup_name}.tar"
        
        try:
            with tarfile.open(backup_file, "w:gz" if compress else "w") as tar:
                for item in self.project_path.rglob("*"):
                    if item.is_file():
                        # Skip certain files if not including config
                        if not include_config and any(pattern in item.name for pattern in [".env", "secret", "key"]):
                            continue
                        
                        arcname = str(item.relative_to(self.project_path.parent))
                        tar.add(item, arcname=arcname)
            
            size_mb = backup_file.stat().st_size / (1024 * 1024)
            message = f"Backup created: {backup_file.name} ({size_mb:.2f} MB)"
            return True, message
            
        except Exception as e:
            return False, f"Backup failed: {str(e)}"
    
    def list_backups(self) -> List[Dict[str, Any]]:
        """List available backups"""
        backups = []
        
        for backup_file in self.backup_dir.glob("*.tar*"):
            if backup_file.is_file():
                backup_info = {
                    "name": backup_file.name,
                    "path": str(backup_file),
                    "size": backup_file.stat().st_size,
                    "created": backup_file.stat().st_mtime
                }
                backups.append(backup_info)
        
        return sorted(backups, key=lambda x: x["created"], reverse=True)
    
    def restore_backup(self, backup_name: str) -> Tuple[bool, str]:
        """Restore from backup"""
        import tarfile
        
        backup_file = self.backup_dir / backup_name
        
        if not backup_file.exists():
            return False, f"Backup file not found: {backup_name}"
        
        try:
            # Check if project directory exists
            if self.project_path.exists():
                return False, f"Project directory already exists: {self.project_path}"
            
            with tarfile.open(backup_file, "r:*") as tar:
                tar.extractall(self.project_path.parent)
            
            return True, f"Project restored from {backup_name}"
            
        except Exception as e:
            return False, f"Restore failed: {str(e)}"
