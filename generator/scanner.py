"""
Project Dependencies Scanner Module
Scans projects for dependencies, vulnerabilities, and provides recommendations
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
import yaml

logger = logging.getLogger(__name__)


@dataclass
class Dependency:
    """Represents a project dependency with metadata"""
    name: str
    version: Optional[str] = None
    source_file: str = ""
    dependency_type: str = "unknown"  # pip, npm, docker, etc.
    security_issues: List[Dict] = field(default_factory=list)
    latest_version: Optional[str] = None
    outdated: bool = False
    description: str = ""


@dataclass
class ScanResult:
    """Results of dependency scanning"""
    total_dependencies: int = 0
    outdated_packages: int = 0
    security_issues: int = 0
    dependencies: List[Dependency] = field(default_factory=list)
    scan_time: datetime = field(default_factory=datetime.now)
    recommendations: List[str] = field(default_factory=list)


class DependencyScanner:
    """Scans project dependencies and provides security analysis"""
    
    def __init__(self, project_path: str):
        self.project_path = Path(project_path)
        self.dependencies: List[Dependency] = []
        self.scan_result = ScanResult()
        
    def scan_project(self) -> ScanResult:
        """Perform comprehensive dependency scan"""
        logger.info(f"Starting dependency scan for {self.project_path}")
        
        # Scan different dependency files
        self._scan_python_dependencies()
        self._scan_npm_dependencies()
        self._scan_docker_dependencies()
        self._scan_kubernetes_dependencies()
        self._scan_yaml_dependencies()
        
        # Analyze results
        self._analyze_dependencies()
        self._generate_recommendations()
        
        # Update scan result
        self.scan_result.dependencies = self.dependencies
        self.scan_result.total_dependencies = len(self.dependencies)
        self.scan_result.outdated_packages = sum(1 for dep in self.dependencies if dep.outdated)
        self.scan_result.security_issues = sum(len(dep.security_issues) for dep in self.dependencies)
        
        logger.info(f"Scan completed: {self.scan_result.total_dependencies} dependencies found")
        return self.scan_result
    
    def _scan_python_dependencies(self) -> None:
        """Scan Python dependency files"""
        python_files = [
            "requirements.txt",
            "requirements-dev.txt",
            "pyproject.toml",
            "Pipfile",
            "setup.py",
            "poetry.lock"
        ]
        
        for file_name in python_files:
            file_path = self.project_path / file_name
            if file_path.exists():
                self._parse_python_file(file_path)
    
    def _parse_python_file(self, file_path: Path) -> None:
        """Parse Python dependency file"""
        try:
            if file_path.name == "requirements.txt":
                self._parse_requirements_txt(file_path)
            elif file_path.name == "pyproject.toml":
                self._parse_pyproject_toml(file_path)
            elif file_path.name == "Pipfile":
                self._parse_pipfile(file_path)
            elif file_path.name == "poetry.lock":
                self._parse_poetry_lock(file_path)
        except Exception as e:
            logger.warning(f"Error parsing {file_path}: {str(e)}")
    
    def _parse_requirements_txt(self, file_path: Path) -> None:
        """Parse requirements.txt file"""
        with open(file_path, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                line = line.strip()
                if line and not line.startswith('#'):
                    # Parse package and version
                    match = re.match(r'^([a-zA-Z0-9\-_.]+)([><=!]+)(.+)$', line)
                    if match:
                        name, operator, version = match.groups()
                        dep = Dependency(
                            name=name.strip(),
                            version=version.strip(),
                            source_file=f"{file_path.name}:{line_num}",
                            dependency_type="pip"
                        )
                    else:
                        # Package without version
                        dep = Dependency(
                            name=line,
                            source_file=f"{file_path.name}:{line_num}",
                            dependency_type="pip"
                        )
                    self.dependencies.append(dep)
    
    def _parse_pyproject_toml(self, file_path: Path) -> None:
        """Parse pyproject.toml file"""
        try:
            import tomllib
        except ImportError:
            try:
                import tomli as tomllib
            except ImportError:
                logger.warning("tomllib/tomli not available, skipping pyproject.toml parsing")
                return
        
        with open(file_path, 'rb') as f:
            data = tomllib.load(f)
            
        # Parse dependencies
        deps = data.get('project', {}).get('dependencies', [])
        for dep_str in deps:
            match = re.match(r'^([a-zA-Z0-9\-_.]+)(?:\s*([><=!]+)\s*(.+))?$', dep_str)
            if match:
                name, operator, version = match.groups()
                dep = Dependency(
                    name=name.strip(),
                    version=version.strip() if version else None,
                    source_file=file_path.name,
                    dependency_type="pip"
                )
                self.dependencies.append(dep)
    
    def _parse_pipfile(self, file_path: Path) -> None:
        """Parse Pipfile"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = yaml.safe_load(f)
            
            packages = data.get('packages', {})
            dev_packages = data.get('dev-packages', {})
            
            for name, version in packages.items():
                dep = Dependency(
                    name=name,
                    version=str(version) if version != "*" else None,
                    source_file=f"{file_path.name}:packages",
                    dependency_type="pip"
                )
                self.dependencies.append(dep)
            
            for name, version in dev_packages.items():
                dep = Dependency(
                    name=name,
                    version=str(version) if version != "*" else None,
                    source_file=f"{file_path.name}:dev-packages",
                    dependency_type="pip-dev"
                )
                self.dependencies.append(dep)
        except Exception as e:
            logger.warning(f"Error parsing Pipfile: {str(e)}")
    
    def _parse_poetry_lock(self, file_path: Path) -> None:
        """Parse poetry.lock file for exact versions"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            packages = data.get('package', [])
            for package in packages:
                dep = Dependency(
                    name=package.get('name', ''),
                    version=package.get('version', ''),
                    source_file=file_path.name,
                    dependency_type="poetry"
                )
                self.dependencies.append(dep)
        except Exception as e:
            logger.warning(f"Error parsing poetry.lock: {str(e)}")
    
    def _scan_npm_dependencies(self) -> None:
        """Scan Node.js dependency files"""
        npm_files = ["package.json", "package-lock.json", "yarn.lock"]
        
        for file_name in npm_files:
            file_path = self.project_path / file_name
            if file_path.exists():
                self._parse_npm_file(file_path)
    
    def _parse_npm_file(self, file_path: Path) -> None:
        """Parse npm dependency file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                if file_path.name == "package.json":
                    data = json.load(f)
                    
                    # Production dependencies
                    deps = data.get('dependencies', {})
                    for name, version in deps.items():
                        dep = Dependency(
                            name=name,
                            version=version,
                            source_file=f"{file_path.name}:dependencies",
                            dependency_type="npm"
                        )
                        self.dependencies.append(dep)
                    
                    # Dev dependencies
                    dev_deps = data.get('devDependencies', {})
                    for name, version in dev_deps.items():
                        dep = Dependency(
                            name=name,
                            version=version,
                            source_file=f"{file_path.name}:devDependencies",
                            dependency_type="npm-dev"
                        )
                        self.dependencies.append(dep)
                        
        except Exception as e:
            logger.warning(f"Error parsing {file_path}: {str(e)}")
    
    def _scan_docker_dependencies(self) -> None:
        """Scan Dockerfile for base images and dependencies"""
        dockerfile = self.project_path / "Dockerfile"
        if dockerfile.exists():
            self._parse_dockerfile(dockerfile)
    
    def _parse_dockerfile(self, dockerfile: Path) -> None:
        """Parse Dockerfile for base images"""
        try:
            with open(dockerfile, 'r', encoding='utf-8') as f:
                for line_num, line in enumerate(f, 1):
                    line = line.strip()
                    if line.startswith('FROM '):
                        image = line[5:].strip()
                        # Split tag if present
                        if ':' in image:
                            name, tag = image.split(':', 1)
                        else:
                            name, tag = image, 'latest'
                        
                        dep = Dependency(
                            name=name,
                            version=tag,
                            source_file=f"Dockerfile:{line_num}",
                            dependency_type="docker"
                        )
                        self.dependencies.append(dep)
        except Exception as e:
            logger.warning(f"Error parsing Dockerfile: {str(e)}")
    
    def _scan_kubernetes_dependencies(self) -> None:
        """Scan Kubernetes manifests for image dependencies"""
        k8s_dirs = ["k8s", "kubernetes", "manifests"]
        
        for k8s_dir in k8s_dirs:
            k8s_path = self.project_path / k8s_dir
            if k8s_path.exists():
                self._scan_k8s_directory(k8s_path)
    
    def _scan_k8s_directory(self, k8s_path: Path) -> None:
        """Scan Kubernetes directory for YAML files"""
        for yaml_file in k8s_path.glob("**/*.yaml"):
            self._parse_k8s_yaml(yaml_file)
        for yaml_file in k8s_path.glob("**/*.yml"):
            self._parse_k8s_yaml(yaml_file)
    
    def _parse_k8s_yaml(self, yaml_file: Path) -> None:
        """Parse Kubernetes YAML file for image references"""
        try:
            with open(yaml_file, 'r', encoding='utf-8') as f:
                data = yaml.safe_load(f)
            
            if isinstance(data, list):
                for item in data:
                    self._extract_images_from_k8s_resource(item, yaml_file)
            elif isinstance(data, dict):
                self._extract_images_from_k8s_resource(data, yaml_file)
        except Exception as e:
            logger.warning(f"Error parsing {yaml_file}: {str(e)}")
    
    def _extract_images_from_k8s_resource(self, resource: Dict, file_path: Path) -> None:
        """Extract container images from Kubernetes resource"""
        if not isinstance(resource, dict):
            return
        
        # Check for containers in various Kubernetes resources
        containers = []
        
        # Pod spec
        spec = resource.get('spec', {})
        if 'containers' in spec:
            containers.extend(spec['containers'])
        
        # Deployment/DaemonSet/StatefulSet
        if 'template' in spec:
            template_spec = spec['template'].get('spec', {})
            if 'containers' in template_spec:
                containers.extend(template_spec['containers'])
        
        # CronJob
        if 'jobTemplate' in spec:
            job_spec = spec['jobTemplate'].get('spec', {}).get('template', {}).get('spec', {})
            if 'containers' in job_spec:
                containers.extend(job_spec['containers'])
        
        for container in containers:
            image = container.get('image', '')
            if image:
                # Parse image name and tag
                if ':' in image:
                    name, tag = image.rsplit(':', 1)
                else:
                    name, tag = image, 'latest'
                
                dep = Dependency(
                    name=name,
                    version=tag,
                    source_file=file_path.name,
                    dependency_type="k8s"
                )
                self.dependencies.append(dep)
    
    def _scan_yaml_dependencies(self) -> None:
        """Scan other YAML files for tool dependencies"""
        yaml_patterns = [
            "*.yaml", "*.yml"
        ]
        
        for pattern in yaml_patterns:
            for yaml_file in self.project_path.glob(pattern):
                if yaml_file.name not in ["docker-compose.yml", "docker-compose.yaml"]:
                    self._parse_generic_yaml(yaml_file)
    
    def _parse_generic_yaml(self, yaml_file: Path) -> None:
        """Parse generic YAML file for tool references"""
        try:
            with open(yaml_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Look for common tool references
            tool_patterns = [
                (r'terraform:\s*([0-9.]+)', 'terraform'),
                (r'aws-cli:\s*([0-9.]+)', 'aws-cli'),
                (r'kubectl:\s*([0-9.]+)', 'kubectl'),
                (r'helm:\s*([0-9.]+)', 'helm'),
            ]
            
            for pattern, tool_name in tool_patterns:
                matches = re.finditer(pattern, content, re.IGNORECASE)
                for match in matches:
                    version = match.group(1)
                    dep = Dependency(
                        name=tool_name,
                        version=version,
                        source_file=yaml_file.name,
                        dependency_type="tool"
                    )
                    self.dependencies.append(dep)
                    
        except Exception as e:
            logger.warning(f"Error parsing {yaml_file}: {str(e)}")
    
    def _analyze_dependencies(self) -> None:
        """Analyze dependencies for security issues and outdated versions"""
        # Simulate security analysis (in real implementation, this would call security APIs)
        high_risk_packages = [
            'urllib3', 'requests', 'pillow', 'jinja2', 'setuptools'
        ]
        
        for dep in self.dependencies:
            # Simulate security issue detection
            if dep.name.lower() in high_risk_packages:
                dep.security_issues.append({
                    'severity': 'medium',
                    'title': f'Potential security issue in {dep.name}',
                    'description': 'This package has had security vulnerabilities in the past'
                })
            
            # Simulate version check (in real implementation, this would check package registries)
            if dep.version and 'latest' not in dep.version.lower():
                # Simple heuristic: packages without specific versions might be outdated
                if dep.version.startswith('0.') or (dep.version.count('.') >= 2 and int(dep.version.split('.')[0]) < 2):
                    dep.outdated = True
                    dep.latest_version = "2.0.0"  # Simulated latest version
    
    def _generate_recommendations(self) -> None:
        """Generate recommendations based on scan results"""
        recommendations = []
        
        # Check for outdated packages
        outdated_count = sum(1 for dep in self.dependencies if dep.outdated)
        if outdated_count > 0:
            recommendations.append(f"Update {outdated_count} outdated packages to latest versions")
        
        # Check for security issues
        security_count = sum(len(dep.security_issues) for dep in self.dependencies)
        if security_count > 0:
            recommendations.append(f"Address {security_count} security issues in dependencies")
        
        # Check for unpinned versions
        unpinned_count = sum(1 for dep in self.dependencies if not dep.version or dep.version == 'latest')
        if unpinned_count > 0:
            recommendations.append(f"Pin versions for {unpinned_count} packages to ensure reproducible builds")
        
        # Check for Docker latest tags
        docker_latest_count = sum(1 for dep in self.dependencies 
                                if dep.dependency_type == "docker" and dep.version == "latest")
        if docker_latest_count > 0:
            recommendations.append(f"Avoid 'latest' tag for {docker_latest_count} Docker images")
        
        # Check for missing lock files
        has_package_json = (self.project_path / "package.json").exists()
        has_package_lock = (self.project_path / "package-lock.json").exists()
        if has_package_json and not has_package_lock:
            recommendations.append("Generate package-lock.json for reproducible Node.js builds")
        
        self.scan_result.recommendations = recommendations
    
    def export_report(self, output_path: str, format: str = "json") -> None:
        """Export scan report to file"""
        report_data = {
            'scan_time': self.scan_result.scan_time.isoformat(),
            'summary': {
                'total_dependencies': self.scan_result.total_dependencies,
                'outdated_packages': self.scan_result.outdated_packages,
                'security_issues': self.scan_result.security_issues,
                'recommendations': self.scan_result.recommendations
            },
            'dependencies': []
        }
        
        for dep in self.dependencies:
            dep_data = {
                'name': dep.name,
                'version': dep.version,
                'source_file': dep.source_file,
                'type': dep.dependency_type,
                'latest_version': dep.latest_version,
                'outdated': dep.outdated,
                'security_issues': dep.security_issues
            }
            report_data['dependencies'].append(dep_data)
        
        output_file = Path(output_path)
        if format.lower() == "json":
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(report_data, f, indent=2)
        elif format.lower() == "yaml":
            with open(output_file, 'w', encoding='utf-8') as f:
                yaml.dump(report_data, f, default_flow_style=False, indent=2)
        
        logger.info(f"Report exported to {output_file}")
