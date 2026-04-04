#!/usr/bin/env python3
"""
Template rendering engine with optimized caching and async support
"""

import logging
from pathlib import Path
from typing import Dict, Any, List, Optional, Union
from concurrent.futures import ThreadPoolExecutor, as_completed
from functools import lru_cache
from jinja2 import Environment, FileSystemLoader, select_autoescape, TemplateNotFound, TemplateSyntaxError
from dataclasses import dataclass

from .utils import TemplateCache, PerformanceUtils, PathUtils

logger = logging.getLogger(__name__)


@dataclass
class RenderContext:
    """Context for template rendering"""
    variables: Dict[str, Any]
    template_path: Path
    output_path: Path
    template_name: str = ""
    metadata: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}


class TemplateRenderer:
    """Optimized template rendering engine with caching and parallel processing"""
    
    def __init__(self, template_dir: Path, cache_size: int = 200, max_workers: int = 4):
        self.template_dir = PathUtils.normalize_path(template_dir)
        self.cache = TemplateCache(cache_size)
        self.performance = PerformanceUtils()
        self.max_workers = max_workers
        
        # Setup Jinja2 environment with optimizations
        self.jinja_env = Environment(
            loader=FileSystemLoader(str(self.template_dir)),
            autoescape=select_autoescape(["html", "xml"]),
            trim_blocks=True,
            lstrip_blocks=True,
            cache_size=cache_size,
            auto_reload=False,
            enable_async=False,
        )
        
        # Add custom filters
        self._setup_custom_filters()
        
        # Pre-load common templates
        self._preload_common_templates()
    
    def _setup_custom_filters(self) -> None:
        """Setup custom Jinja2 filters"""
        
        def env_filter(value: str) -> str:
            """Environment variable filter"""
            return os.environ.get(value, "")
        
        def slugify_filter(value: str) -> str:
            """Convert string to slug format"""
            import re
            value = re.sub(r'[^\w\s-]', '', value.lower())
            return re.sub(r'[-\s]+', '-', value).strip('-')
        
        def title_case_filter(value: str) -> str:
            """Title case filter"""
            return ' '.join(word.capitalize() for word in value.split())
        
        # Register filters
        self.jinja_env.filters['env'] = env_filter
        self.jinja_env.filters['slugify'] = slugify_filter
        self.jinja_env.filters['title_case'] = title_case_filter
    
    def _preload_common_templates(self) -> None:
        """Pre-load commonly used templates"""
        common_templates = [
            "README.md.j2",
            "Dockerfile.j2",
            "docker-compose.yml.j2",
            ".gitignore.j2",
            "Makefile.j2"
        ]
        
        for template_name in common_templates:
            try:
                template = self.jinja_env.get_template(template_name)
                self.cache.set(template_name, template)
                logger.debug(f"Preloaded template: {template_name}")
            except TemplateNotFound:
                logger.debug(f"Template not found for preloading: {template_name}")
    
    @lru_cache(maxsize=128)
    def get_template(self, template_name: str) -> Any:
        """Get template with caching"""
        # Check cache first
        cached_template = self.cache.get(template_name)
        if cached_template:
            return cached_template
        
        # Load from filesystem
        try:
            template = self.jinja_env.get_template(template_name)
            self.cache.set(template_name, template)
            return template
        except TemplateNotFound:
            logger.error(f"Template not found: {template_name}")
            raise
        except TemplateSyntaxError as e:
            logger.error(f"Template syntax error in {template_name}: {str(e)}")
            raise
    
    def render_single(self, context: RenderContext) -> bool:
        """Render a single template"""
        self.performance.start_timer(f"render_{context.template_name}")
        
        try:
            template = self.get_template(context.template_name)
            rendered_content = template.render(**context.variables)
            
            # Ensure output directory exists
            context.output_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Write rendered content
            with open(context.output_path, 'w', encoding='utf-8') as f:
                f.write(rendered_content)
            
            logger.debug(f"Rendered template: {context.template_name} -> {context.output_path}")
            
            # Cache rendered result for potential reuse
            cache_key = f"{context.template_name}_{hash(str(context.variables))}"
            self.cache.set(cache_key, rendered_content)
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to render template {context.template_name}: {str(e)}")
            return False
        finally:
            self.performance.end_timer(f"render_{context.template_name}")
    
    def render_parallel(self, contexts: List[RenderContext]) -> Dict[str, bool]:
        """Render multiple templates in parallel"""
        results = {}
        
        if not contexts:
            return results
        
        logger.info(f"Rendering {len(contexts)} templates with {self.max_workers} workers")
        
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            # Submit all rendering tasks
            future_to_context = {
                executor.submit(self.render_single, ctx): ctx.template_name 
                for ctx in contexts
            }
            
            # Collect results
            for future in as_completed(future_to_context):
                template_name = future_to_context[future]
                try:
                    success = future.result()
                    results[template_name] = success
                except Exception as e:
                    logger.error(f"Parallel rendering failed for {template_name}: {str(e)}")
                    results[template_name] = False
        
        successful_count = sum(1 for success in results.values() if success)
        logger.info(f"Completed rendering: {successful_count}/{len(contexts)} templates successful")
        
        return results
    
    def render_batch(self, template_configs: List[Dict[str, Any]], 
                    base_variables: Dict[str, Any]) -> Dict[str, bool]:
        """Render batch of templates with shared variables"""
        contexts = []
        
        for config in template_configs:
            context = RenderContext(
                variables={**base_variables, **config.get('variables', {})},
                template_path=self.template_dir / config['template'],
                output_path=Path(config['output']),
                template_name=config['template'],
                metadata=config.get('metadata', {})
            )
            contexts.append(context)
        
        return self.render_parallel(contexts)
    
    def validate_template(self, template_name: str) -> tuple[bool, List[str]]:
        """Validate template syntax"""
        errors = []
        
        try:
            template = self.get_template(template_name)
            
            # Try to render with empty context to check syntax
            try:
                template.render()
            except Exception as e:
                errors.append(f"Render error: {str(e)}")
            
        except TemplateNotFound:
            errors.append(f"Template not found: {template_name}")
        except TemplateSyntaxError as e:
            errors.append(f"Syntax error at line {e.lineno}: {str(e)}")
        except Exception as e:
            errors.append(f"Unexpected error: {str(e)}")
        
        return len(errors) == 0, errors
    
    def get_template_info(self, template_name: str) -> Dict[str, Any]:
        """Get information about a template"""
        template_path = self.template_dir / template_name
        
        if not template_path.exists():
            return {"exists": False}
        
        try:
            template = self.get_template(template_name)
            
            # Extract variables from template
            from jinja2 import meta
            with open(template_path, 'r', encoding='utf-8') as f:
                template_source = f.read()
            
            parsed_content = meta.parse(template_source)
            variables = meta.find_undeclared_variables(parsed_content)
            
            return {
                "exists": True,
                "path": str(template_path),
                "variables": list(variables),
                "size": template_path.stat().st_size,
                "modified": template_path.stat().st_mtime
            }
            
        except Exception as e:
            return {"exists": True, "error": str(e)}
    
    def clear_cache(self) -> None:
        """Clear all caches"""
        self.cache.clear()
        self.get_template.cache_clear()
        logger.info("Template cache cleared")
    
    def get_performance_metrics(self) -> Dict[str, float]:
        """Get rendering performance metrics"""
        return self.performance.get_metrics()


class TemplateManager:
    """High-level template management with discovery and categorization"""
    
    def __init__(self, template_dir: Path):
        self.template_dir = PathUtils.normalize_path(template_dir)
        self.renderer = TemplateRenderer(template_dir)
        self._template_index = {}
        self._categories = {}
        self._build_template_index()
    
    def _build_template_index(self) -> None:
        """Build index of available templates"""
        self._template_index = {}
        self._categories = {}
        
        if not self.template_dir.exists():
            logger.warning(f"Template directory does not exist: {self.template_dir}")
            return
        
        for template_file in self.template_dir.rglob("*.j2"):
            relative_path = template_file.relative_to(self.template_dir)
            category = str(relative_path.parent) if relative_path.parent != Path('.') else 'root'
            
            template_info = {
                'path': template_file,
                'relative_path': relative_path,
                'category': category,
                'name': template_file.stem,
                'size': template_file.stat().st_size,
                'modified': template_file.stat().st_mtime
            }
            
            self._template_index[str(relative_path)] = template_info
            
            if category not in self._categories:
                self._categories[category] = []
            self._categories[category].append(template_info)
    
    def list_templates(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        """List available templates, optionally filtered by category"""
        if category:
            return self._categories.get(category, [])
        return list(self._template_index.values())
    
    def get_template_by_name(self, name: str) -> Optional[Dict[str, Any]]:
        """Get template info by name"""
        for template_info in self._template_index.values():
            if template_info['name'] == name:
                return template_info
        return None
    
    def get_categories(self) -> List[str]:
        """Get all template categories"""
        return list(self._categories.keys())
    
    def search_templates(self, query: str) -> List[Dict[str, Any]]:
        """Search templates by name or content"""
        query_lower = query.lower()
        results = []
        
        for template_info in self._template_index.values():
            if (query_lower in template_info['name'].lower() or 
                query_lower in template_info['category'].lower()):
                results.append(template_info)
        
        return results
    
    def refresh_index(self) -> None:
        """Refresh template index"""
        self._build_template_index()
        logger.info("Template index refreshed")
