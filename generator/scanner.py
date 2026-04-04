#!/usr/bin/env python3
"""
Enhanced Project Dependencies Scanner with modular architecture
"""

import os
import json
import re
import logging
import subprocess
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple, Any
from dataclasses import dataclass, field
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed
import yaml

from .utils import PerformanceUtils, ProgressTracker

logger = logging.getLogger(__name__)


@dataclass
class Dependency:
    """Enhanced dependency representation with more metadata"""
    name: str
    version: Optional[str] = None
    source_file: str = ""
    dependency_type: str = "unknown"  # pip, npm, docker, etc.
    security_issues: List[Dict] = field(default_factory=list)
    latest_version: Optional[str] = None
    outdated: bool = False
    description: str = ""
    license: Optional[str] = None
    homepage: Optional[str] = None
    repository: Optional[str] = None
    size: Optional[int] = None  # Package size in bytes


@dataclass
class ScanResult:
    """Enhanced scan results with more metrics"""
    total_dependencies: int = 0
    outdated_packages: int = 0
    security_issues: int = 0
    dependencies: List[Dependency] = field(default_factory=list)
    scan_time: datetime = field(default_factory=datetime.now)
    recommendations: List[str] = field(default_factory=list)
    scan_duration: float = 0.0
    dependency_types: Dict[str, int] = field(default_factory=dict)
    vulnerability_summary: Dict[str, int] = field(default_factory=dict)


class DependencyScanner:
    """Enhanced dependency scanner with parallel processing and better detection"""
    
    def __init__(self, project_path: str, max_workers: int = 4):
        self.project_path = Path(project_path)
        self.max_workers = max_workers
        self.dependencies: List[Dependency] = []
        self.scan_result = ScanResult()
        self.performance = PerformanceUtils()
        
        # Dependency file patterns for different package managers
        self.dependency_files = {
            'python': [
                "requirements.txt", "requirements-dev.txt", "pyproject.toml",
                "Pipfile", "setup.py", "poetry.lock", "pipfile.lock"
            ],
            'npm': [
                "package.json", "package-lock.json", "yarn.lock", "npm-shrinkwrap.json"
            ],
            'docker': [
                "Dockerfile", "docker-compose.yml", "docker-compose.yaml"
            ],
            'kubernetes': [
                "*.yaml", "*.yml", "deployment.yaml", "service.yaml"
            ],
            'maven': [
                "pom.xml", "build.gradle", "build.gradle.kts"
            ],
            'go': [
                "go.mod", "go.sum", "Gopkg.toml"
            ],
            'ruby': [
                "Gemfile", "Gemfile.lock"
            ],
            'php': [
                "composer.json", "composer.lock"
            ]
        }
    
    def scan_project(self) -> ScanResult:
        """Perform comprehensive dependency scan with parallel processing"""
        self.performance.start_timer("total_scan")
        logger.info(f"Starting enhanced dependency scan for {self.project_path}")
        
        # Find all dependency files
        dependency_files = self._find_dependency_files()
        
        # Scan files in parallel
        self._scan_files_parallel(dependency_files)
        
        # Analyze results
        self._analyze_dependencies()
        self._generate_recommendations()
        
        # Update scan result
        self._update_scan_result()
        
        self.scan_result.scan_duration = self.performance.end_timer("total_scan")
        logger.info(f"Enhanced scan completed in {self.scan_result.scan_duration:.2f}s")
        
        return self.scan_result
    
    def _find_dependency_files(self) -> List[Tuple[str, Path]]:
        """Find all dependency files in the project"""
        found_files = []
        
        for dep_type, file_patterns in self.dependency_files.items():
            for pattern in file_patterns:
                # Handle glob patterns
                if '*' in pattern:
                    files = list(self.project_path.rglob(pattern))
                else:
                    file_path = self.project_path / pattern
                    files = [file_path] if file_path.exists() else []
                
                for file_path in files:
                    if file_path.is_file():
                        found_files.append((dep_type, file_path))
        
        return found_files
    
    def _scan_files_parallel(self, dependency_files: List[Tuple[str, Path]]) -> None:
        """Scan dependency files in parallel"""
        if not dependency_files:
            logger.warning("No dependency files found")
            return
        
        logger.info(f"Scanning {len(dependency_files)} dependency files with {self.max_workers} workers")
        
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            # Submit scanning tasks
            future_to_file = {
                executor.submit(self._scan_single_file, dep_type, file_path): (dep_type, file_path)
                for dep_type, file_path in dependency_files
            }
            
            # Collect results
            for future in as_completed(future_to_file):
                dep_type, file_path = future_to_file[future]
                try:
                    file_dependencies = future.result()
                    self.dependencies.extend(file_dependencies)
                except Exception as e:
                    logger.error(f"Failed to scan {file_path}: {str(e)}")
    
    def _scan_single_file(self, dep_type: str, file_path: Path) -> List[Dependency]:
        """Scan a single dependency file"""
        self.performance.start_timer(f"scan_{dep_type}_{file_path.name}")
        
        try:
            if dep_type == 'python':
                return self._scan_python_file(file_path)
            elif dep_type == 'npm':
                return self._scan_npm_file(file_path)
            elif dep_type == 'docker':
                return self._scan_docker_file(file_path)
            elif dep_type == 'kubernetes':
                return self._scan_kubernetes_file(file_path)
            elif dep_type == 'maven':
                return self._scan_maven_file(file_path)
            elif dep_type == 'go':
                return self._scan_go_file(file_path)
            elif dep_type == 'ruby':
                return self._scan_ruby_file(file_path)
            elif dep_type == 'php':
                return self._scan_php_file(file_path)
            else:
                logger.warning(f"Unsupported dependency type: {dep_type}")
                return []
        finally:
            self.performance.end_timer(f"scan_{dep_type}_{file_path.name}")
    
    def _scan_python_file(self, file_path: Path) -> List[Dependency]:
        """Scan Python dependency file"""
        dependencies = []
        
        try:
            if file_path.name == "requirements.txt":
                dependencies.extend(self._parse_requirements_txt(file_path))
            elif file_path.name == "pyproject.toml":
                dependencies.extend(self._parse_pyproject_toml(file_path))
            elif file_path.name == "Pipfile":
                dependencies.extend(self._parse_pipfile(file_path))
            elif file_path.name == "setup.py":
                dependencies.extend(self._parse_setup_py(file_path))
            elif file_path.name in ["poetry.lock", "pipfile.lock"]:
                dependencies.extend(self._parse_lock_file(file_path, 'python'))
        except Exception as e:
            logger.error(f"Error scanning Python file {file_path}: {str(e)}")
        
        return dependencies
    
    def _scan_npm_file(self, file_path: Path) -> List[Dependency]:
        """Scan npm dependency file"""
        dependencies = []
        
        try:
            if file_path.name == "package.json":
                dependencies.extend(self._parse_package_json(file_path))
            elif file_path.name in ["package-lock.json", "yarn.lock", "npm-shrinkwrap.json"]:
                dependencies.extend(self._parse_lock_file(file_path, 'npm'))
        except Exception as e:
            logger.error(f"Error scanning npm file {file_path}: {str(e)}")
        
        return dependencies
    
    def _scan_docker_file(self, file_path: Path) -> List[Dependency]:
        """Scan Docker dependency file"""
        dependencies = []
        
        try:
            if file_path.name == "Dockerfile":
                dependencies.extend(self._parse_dockerfile(file_path))
            elif file_path.name in ["docker-compose.yml", "docker-compose.yaml"]:
                dependencies.extend(self._parse_docker_compose(file_path))
        except Exception as e:
            logger.error(f"Error scanning Docker file {file_path}: {str(e)}")
        
        return dependencies
    
    def _scan_kubernetes_file(self, file_path: Path) -> List[Dependency]:
        """Scan Kubernetes YAML files"""
        dependencies = []
        
        try:
            dependencies.extend(self._parse_kubernetes_yaml(file_path))
        except Exception as e:
            logger.error(f"Error scanning Kubernetes file {file_path}: {str(e)}")
        
        return dependencies
    
    def _scan_maven_file(self, file_path: Path) -> List[Dependency]:
        """Scan Maven dependency file"""
        dependencies = []
        
        try:
            if file_path.name == "pom.xml":
                dependencies.extend(self._parse_pom_xml(file_path))
            elif file_path.name.startswith("build.gradle"):
                dependencies.extend(self._parse_gradle_file(file_path))
        except Exception as e:
            logger.error(f"Error scanning Maven file {file_path}: {str(e)}")
        
        return dependencies
    
    def _scan_go_file(self, file_path: Path) -> List[Dependency]:
        """Scan Go dependency file"""
        dependencies = []
        
        try:
            if file_path.name == "go.mod":
                dependencies.extend(self._parse_go_mod(file_path))
            elif file_path.name == "Gopkg.toml":
                dependencies.extend(self._parse_gopkg_toml(file_path))
        except Exception as e:
            logger.error(f"Error scanning Go file {file_path}: {str(e)}")
        
        return dependencies
    
    def _scan_ruby_file(self, file_path: Path) -> List[Dependency]:
        """Scan Ruby dependency file"""
        dependencies = []
        
        try:
            if file_path.name == "Gemfile":
                dependencies.extend(self._parse_gemfile(file_path))
            elif file_path.name == "Gemfile.lock":
                dependencies.extend(self._parse_lock_file(file_path, 'ruby'))
        except Exception as e:
            logger.error(f"Error scanning Ruby file {file_path}: {str(e)}")
        
        return dependencies
    
    def _scan_php_file(self, file_path: Path) -> List[Dependency]:
        """Scan PHP dependency file"""
        dependencies = []
        
        try:
            if file_path.name == "composer.json":
                dependencies.extend(self._parse_composer_json(file_path))
            elif file_path.name == "composer.lock":
                dependencies.extend(self._parse_lock_file(file_path, 'php'))
        except Exception as e:
            logger.error(f"Error scanning PHP file {file_path}: {str(e)}")
        
        return dependencies
    
    # Parser methods (implementations would go here)
    def _parse_requirements_txt(self, file_path: Path) -> List[Dependency]:
        """Parse requirements.txt file"""
        dependencies = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#'):
                        # Parse requirement line
                        parts = line.split('==', 1)
                        name = parts[0].strip()
                        version = parts[1].strip() if len(parts) > 1 else None
                        
                        dependencies.append(Dependency(
                            name=name,
                            version=version,
                            source_file=str(file_path.relative_to(self.project_path)),
                            dependency_type='python'
                        ))
        except Exception as e:
            logger.error(f"Error parsing requirements.txt: {str(e)}")
        
        return dependencies
    
    def _parse_package_json(self, file_path: Path) -> List[Dependency]:
        """Parse package.json file"""
        dependencies = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Parse dependencies
            deps = data.get('dependencies', {})
            for name, version in deps.items():
                dependencies.append(Dependency(
                    name=name,
                    version=version,
                    source_file=str(file_path.relative_to(self.project_path)),
                    dependency_type='npm'
                ))
        except Exception as e:
            logger.error(f"Error parsing package.json: {str(e)}")
        
        return dependencies
    
    def _parse_dockerfile(self, file_path: Path) -> List[Dependency]:
        """Parse Dockerfile for base images"""
        dependencies = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Find FROM statements
            from_pattern = r'FROM\s+([^\s\n]+)'
            matches = re.findall(from_pattern, content)
            
            for image in matches:
                dependencies.append(Dependency(
                    name=image,
                    version=None,
                    source_file=str(file_path.relative_to(self.project_path)),
                    dependency_type='docker',
                    description=f"Docker base image: {image}"
                ))
        except Exception as e:
            logger.error(f"Error parsing Dockerfile: {str(e)}")
        
        return dependencies
    
    def _parse_kubernetes_yaml(self, file_path: Path) -> List[Dependency]:
        """Parse Kubernetes YAML for container images"""
        dependencies = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Find image references
            image_pattern = r'image:\s*([^\s\n]+)'
            matches = re.findall(image_pattern, content)
            
            for image in set(matches):  # Remove duplicates
                dependencies.append(Dependency(
                    name=image,
                    version=None,
                    source_file=str(file_path.relative_to(self.project_path)),
                    dependency_type='kubernetes',
                    description=f"Kubernetes container image: {image}"
                ))
        except Exception as e:
            logger.error(f"Error parsing Kubernetes YAML: {str(e)}")
        
        return dependencies
    
    # Placeholder methods for other parsers
    def _parse_pyproject_toml(self, file_path: Path) -> List[Dependency]:
        """Parse pyproject.toml file"""
        # Implementation would go here
        return []
    
    def _parse_pipfile(self, file_path: Path) -> List[Dependency]:
        """Parse Pipfile"""
        # Implementation would go here
        return []
    
    def _parse_setup_py(self, file_path: Path) -> List[Dependency]:
        """Parse setup.py"""
        # Implementation would go here
        return []
    
    def _parse_lock_file(self, file_path: Path, dep_type: str) -> List[Dependency]:
        """Parse lock file"""
        # Implementation would go here
        return []
    
    def _parse_docker_compose(self, file_path: Path) -> List[Dependency]:
        """Parse docker-compose file"""
        # Implementation would go here
        return []
    
    def _parse_pom_xml(self, file_path: Path) -> List[Dependency]:
        """Parse pom.xml"""
        # Implementation would go here
        return []
    
    def _parse_gradle_file(self, file_path: Path) -> List[Dependency]:
        """Parse Gradle build file"""
        # Implementation would go here
        return []
    
    def _parse_go_mod(self, file_path: Path) -> List[Dependency]:
        """Parse go.mod"""
        # Implementation would go here
        return []
    
    def _parse_gopkg_toml(self, file_path: Path) -> List[Dependency]:
        """Parse Gopkg.toml"""
        # Implementation would go here
        return []
    
    def _parse_gemfile(self, file_path: Path) -> List[Dependency]:
        """Parse Gemfile"""
        # Implementation would go here
        return []
    
    def _parse_composer_json(self, file_path: Path) -> List[Dependency]:
        """Parse composer.json"""
        # Implementation would go here
        return []
    
    def _analyze_dependencies(self) -> None:
        """Analyze dependencies for security issues and outdated versions"""
        # This would integrate with external security databases
        # For now, just mark some as outdated for demonstration
        for dep in self.dependencies:
            # Simple heuristic: unpinned dependencies are potentially outdated
            if dep.version is None:
                dep.outdated = True
                dep.security_issues.append({
                    "severity": "medium",
                    "description": "Unpinned dependency version",
                    "recommendation": "Pin to specific version"
                })
    
    def _generate_recommendations(self) -> None:
        """Generate security and maintenance recommendations"""
        recommendations = []
        
        # Security recommendations
        if self.scan_result.security_issues > 0:
            recommendations.append(f"🔒 Address {self.scan_result.security_issues} security issues immediately")
        
        # Maintenance recommendations
        if self.scan_result.outdated_packages > 0:
            recommendations.append(f"📦 Update {self.scan_result.outdated_packages} outdated packages")
        
        # Dependency management recommendations
        dep_types = set(dep.dependency_type for dep in self.dependencies)
        if len(dep_types) > 3:
            recommendations.append("🔧 Consider consolidating dependency management tools")
        
        # Size recommendations
        if len(self.dependencies) > 100:
            recommendations.append("📊 Consider reducing dependency count for better maintainability")
        
        self.scan_result.recommendations = recommendations
    
    def _update_scan_result(self) -> None:
        """Update scan result with current data"""
        self.scan_result.dependencies = self.dependencies
        self.scan_result.total_dependencies = len(self.dependencies)
        self.scan_result.outdated_packages = sum(1 for dep in self.dependencies if dep.outdated)
        self.scan_result.security_issues = sum(len(dep.security_issues) for dep in self.dependencies)
        
        # Calculate dependency types distribution
        self.scan_result.dependency_types = {}
        for dep in self.dependencies:
            self.scan_result.dependency_types[dep.dependency_type] = \
                self.scan_result.dependency_types.get(dep.dependency_type, 0) + 1
        
        # Calculate vulnerability summary
        self.scan_result.vulnerability_summary = {
            "critical": sum(1 for dep in self.dependencies 
                          for issue in dep.security_issues 
                          if issue.get("severity") == "critical"),
            "high": sum(1 for dep in self.dependencies 
                       for issue in dep.security_issues 
                       if issue.get("severity") == "high"),
            "medium": sum(1 for dep in self.dependencies 
                         for issue in dep.security_issues 
                         if issue.get("severity") == "medium"),
            "low": sum(1 for dep in self.dependencies 
                      for issue in dep.security_issues 
                      if issue.get("severity") == "low")
        }
    
    def export_report(self, output_file: str, format: str = "json") -> bool:
        """Export scan report to file"""
        try:
            report_data = {
                "scan_metadata": {
                    "project_path": str(self.project_path),
                    "scan_time": self.scan_result.scan_time.isoformat(),
                    "scan_duration": self.scan_result.scan_duration,
                    "total_dependencies": self.scan_result.total_dependencies
                },
                "summary": {
                    "outdated_packages": self.scan_result.outdated_packages,
                    "security_issues": self.scan_result.security_issues,
                    "dependency_types": self.scan_result.dependency_types,
                    "vulnerability_summary": self.scan_result.vulnerability_summary
                },
                "dependencies": [
                    {
                        "name": dep.name,
                        "version": dep.version,
                        "type": dep.dependency_type,
                        "source_file": dep.source_file,
                        "outdated": dep.outdated,
                        "security_issues": dep.security_issues,
                        "description": dep.description
                    }
                    for dep in self.dependencies
                ],
                "recommendations": self.scan_result.recommendations
            }
            
            if format.lower() == "json":
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(report_data, f, indent=2, ensure_ascii=False)
            elif format.lower() == "yaml":
                with open(output_file, 'w', encoding='utf-8') as f:
                    yaml.dump(report_data, f, default_flow_style=False, indent=2)
            else:
                raise ValueError(f"Unsupported format: {format}")
            
            logger.info(f"Report exported to {output_file}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to export report: {str(e)}")
            return False
