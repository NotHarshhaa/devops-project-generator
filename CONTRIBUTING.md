# Contributing Guide

Thank you for your interest in contributing to the DevOps Project Generator! This guide will help you get started with contributing to the project.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contribution Guidelines](#contribution-guidelines)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Submitting Changes](#submitting-changes)
- [Review Process](#review-process)
- [Community](#community)

---

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- Git
- Basic knowledge of DevOps concepts
- Familiarity with CI/CD, Docker, Kubernetes

### Quick Start

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/devops-project-generator.git
   cd devops-project-generator
   ```

2. **Set up development environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -e ".[dev]"
   ```

3. **Verify installation**
   ```bash
   devops-project-generator --version
   ```

---

## 🛠️ Development Setup

### Environment Setup

```bash
# Clone the repository
git clone https://github.com/NotHarshhaa/devops-project-generator.git
cd devops-project-generator

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install in development mode
pip install -e ".[dev]"

# Install pre-commit hooks
pre-commit install
```

### Development Dependencies

The `[dev]` extra includes:
- `pytest` - Testing framework
- `black` - Code formatting
- `flake8` - Linting
- `mypy` - Type checking
- `pre-commit` - Git hooks
- `coverage` - Test coverage

### IDE Configuration

#### VS Code

Create `.vscode/settings.json`:
```json
{
  "python.defaultInterpreterPath": "./venv/bin/python",
  "python.linting.enabled": true,
  "python.linting.flake8Enabled": true,
  "python.formatting.provider": "black",
  "python.testing.pytestEnabled": true,
  "python.testing.pytestArgs": ["tests/"]
}
```

#### PyCharm

1. Configure Python interpreter to use venv
2. Enable pytest as test runner
3. Configure code style to match project standards

---

## 📁 Project Structure

```
devops-project-generator/
├── cli/                    # CLI interface
│   ├── __init__.py
│   └── cli.py             # Main CLI commands
├── generator/              # Core generator logic
│   ├── __init__.py
│   ├── generator.py       # Main generator class
│   ├── config.py          # Configuration management
│   ├── scanner.py         # NEW: Dependency scanner
│   └── config_generator.py # NEW: Multi-env configs
├── templates/              # Project templates
│   ├── ci/                # CI/CD templates
│   ├── infra/             # Infrastructure templates
│   ├── deploy/            # Deployment templates
│   ├── monitoring/        # Monitoring templates
│   └── security/          # Security templates
├── tests/                  # Test suite
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── docs/                   # Documentation
├── scripts/                # Utility scripts
├── pyproject.toml         # Project configuration
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── LICENSE
```

---

## 📝 Contribution Guidelines

### Types of Contributions

We welcome the following types of contributions:

#### 🆕 New Features
- New CI/CD platform support
- Additional infrastructure tools
- New deployment methods
- Enhanced monitoring capabilities
- Security improvements

#### 🐛 Bug Fixes
- Fix template rendering issues
- Resolve CLI command problems
- Address platform-specific bugs
- Fix documentation errors

#### 📚 Documentation
- Improve README and guides
- Add examples and tutorials
- Update API documentation
- Translate documentation

#### 🧪 Testing
- Add unit tests
- Improve test coverage
- Add integration tests
- Performance testing

### Before You Start

1. **Check existing issues** - Look for related issues or PRs
2. **Create an issue** - Discuss major changes before implementing
3. **Follow the code style** - Use the established conventions
4. **Write tests** - Ensure your changes are well-tested

---

## 🎯 Code Standards

### Python Code Style

We use the following tools and standards:

```bash
# Format code
black devops_project_generator/ tests/

# Lint code
flake8 devops_project_generator/ tests/

# Type checking
mypy devops_project_generator/

# Run all checks
pre-commit run --all-files
```

#### Code Formatting

- Use **Black** for code formatting
- Maximum line length: 88 characters
- Use double quotes for strings
- Use f-strings for string formatting

#### Naming Conventions

```python
# Classes: PascalCase
class DevOpsProjectGenerator:
    pass

# Functions and variables: snake_case
def generate_project():
    project_name = "my-project"

# Constants: UPPER_SNAKE_CASE
DEFAULT_CI_PLATFORM = "github-actions"

# Private methods: underscore prefix
def _internal_method():
    pass
```

#### Documentation

```python
def generate_project(
    name: str,
    ci: str = "github-actions",
    deploy: str = "docker"
) -> bool:
    """Generate a new DevOps project.
    
    Args:
        name: Project name
        ci: CI/CD platform to use
        deploy: Deployment method
        
    Returns:
        True if project generated successfully
        
    Raises:
        ValueError: If project name is invalid
        TemplateError: If template rendering fails
    """
    pass
```

### Template Standards

#### Jinja2 Templates

```jinja2
{# Template: GitHub Actions Workflow #}
{# Category: ci #}
{# Description: Basic CI/CD pipeline for GitHub Actions #}

name: {{ project_name }} CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
        
    {% if has_docker %}
    - name: Build Docker image
      run: docker build -t {{ project_name }} .
    {% endif %}
```

#### Template Organization

```
templates/
├── category/
│   ├── template-name.yml.j2
│   ├── template-name.yaml.j2
│   └── README.md           # Category documentation
```

---

## 🧪 Testing

### Test Structure

```
tests/
├── unit/                   # Unit tests
│   ├── test_generator.py
│   ├── test_scanner.py
│   └── test_config.py
├── integration/            # Integration tests
│   ├── test_cli.py
│   └── test_templates.py
├── fixtures/               # Test data
│   ├── projects/
│   └── templates/
└── conftest.py             # Pytest configuration
```

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=devops_project_generator --cov-report=html

# Run specific test file
pytest tests/unit/test_generator.py

# Run with verbose output
pytest -v

# Run only fast tests
pytest -m "not slow"
```

### Writing Tests

#### Unit Tests

```python
import pytest
from generator.generator import DevOpsProjectGenerator

class TestDevOpsProjectGenerator:
    def test_init_with_valid_params(self):
        """Test generator initialization with valid parameters."""
        generator = DevOpsProjectGenerator(
            name="test-project",
            ci="github-actions",
            deploy="docker"
        )
        assert generator.name == "test-project"
        assert generator.ci == "github-actions"
        assert generator.deploy == "docker"
    
    def test_init_with_invalid_name(self):
        """Test generator initialization with invalid project name."""
        with pytest.raises(ValueError):
            DevOpsProjectGenerator(name="")
```

#### Integration Tests

```python
import pytest
from click.testing import CliRunner
from cli.cli import cli

class TestCLI:
    def test_init_command(self, tmp_path):
        """Test CLI init command."""
        runner = CliRunner()
        with runner.isolated_filesystem(temp_dir=tmp_path):
            result = runner.invoke(cli, [
                "init",
                "--name", "test-project",
                "--ci", "github-actions",
                "--deploy", "docker"
            ])
            assert result.exit_code == 0
            assert "Project generated successfully" in result.output
```

### Test Coverage

- Aim for >90% code coverage
- Test all public methods
- Test error conditions
- Test template rendering

---

## 📚 Documentation

### Types of Documentation

1. **Code Documentation**
   - Docstrings for all public functions/classes
   - Type hints for all function parameters
   - Inline comments for complex logic

2. **User Documentation**
   - README.md - Project overview and quick start
   - COMMANDS.md - Complete command reference
   - EXAMPLES.md - Usage examples
   - TEMPLATES.md - Template guide

3. **Developer Documentation**
   - CONTRIBUTING.md - This guide
   - API documentation
   - Architecture documentation

### Documentation Standards

#### Markdown Style

```markdown
# Heading 1
## Heading 2
### Heading 3

- Use bullet points for lists
- Use `code` for inline code
- Use ```language for code blocks

**Bold text** for emphasis
*Italic text* for emphasis

> Use blockquotes for notes

[Link text](url)
![Alt text](image-url)
```

#### Code Examples

```bash
# Always include the command
pip install devops-project-generator

# Show expected output
DevOps Project Generator v1.5.0
```

---

## 🔄 Submitting Changes

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

#### Examples

```
feat(scanner): add dependency vulnerability detection

Add security scanning functionality to detect known vulnerabilities
in project dependencies. Supports Python packages, Node.js modules,
and Docker images.

Closes #123
```

```
fix(cli): resolve template path issue on Windows

Fix path separator issues when loading templates on Windows systems
by converting backslashes to forward slashes for Jinja2 compatibility.
```

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/new-feature-name
   ```

2. **Make your changes**
   - Write code following the standards
   - Add tests for new functionality
   - Update documentation

3. **Run tests and checks**
   ```bash
   # Run all tests
   pytest
   
   # Run linting and formatting
   pre-commit run --all-files
   
   # Test the CLI
   devops-project-generator --help
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/new-feature-name
   # Create PR on GitHub
   ```

### Pull Request Template

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Added new tests

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] CHANGELOG.md updated (if applicable)
```

---

## 👀 Review Process

### Code Review Guidelines

#### For Reviewers

1. **Check functionality**
   - Does the code work as intended?
   - Are there edge cases not handled?
   - Is the implementation efficient?

2. **Check code quality**
   - Follows coding standards?
   - Clear and readable?
   - Proper error handling?

3. **Check tests**
   - Adequate test coverage?
   - Tests are meaningful?
   - Edge cases tested?

4. **Check documentation**
   - Updated appropriately?
   - Clear and accurate?

#### For Contributors

1. **Respond to feedback promptly**
2. **Address all review comments**
3. **Update tests and documentation**
4. **Keep PR size manageable**

### Merge Requirements

- All tests must pass
- Code coverage must not decrease
- At least one approval from maintainers
- CI/CD pipeline must pass
- Documentation must be updated

---

## 🌍 Community

### Getting Help

- **GitHub Issues**: Report bugs and request features
- **GitHub Discussions**: Ask questions and share ideas
- **Telegram Community**: [Join Here](https://t.me/prodevopsguy)
- **Email**: harshhaa@example.com

### Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please:

- Be respectful and constructive
- Welcome newcomers and help them learn
- Focus on what is best for the community
- Show empathy towards other community members

### Recognition

Contributors are recognized in several ways:

- **Contributors section** in README
- **Release notes** for significant contributions
- **Community highlights** in discussions
- **Special badges** for long-term contributors

---

## 🏆 Contribution Recognition

### Types of Contributions

#### 🥇 Major Contributions
- New features or significant enhancements
- Major architectural improvements
- Extensive documentation improvements

#### 🥈 Significant Contributions
- Bug fixes for complex issues
- New template additions
- Performance improvements
- Test coverage improvements

#### 🥄 Regular Contributions
- Bug fixes for simple issues
- Documentation updates
- Test improvements
- Code refactoring

### Hall of Fame

Top contributors are featured in:
- README.md contributors section
- Release notes
- Annual community report

---

## 📞 Contact

### Project Maintainer

**Harshhaa Vardhan Reddy**
- GitHub: [@NotHarshhaa](https://github.com/NotHarshhaa)
- LinkedIn: [Harshhaa Vardhan Reddy](https://www.linkedin.com/in/NotHarshhaa/)
- Portfolio: [notharshhaa.site](https://notharshhaa.site)
- Telegram: [Community](https://t.me/prodevopsguy)

### Communication Channels

- **Issues**: For bug reports and feature requests
- **Discussions**: For general questions and ideas
- **Email**: For private or sensitive matters

---

## 📜 License

By contributing to this project, you agree that your contributions will be licensed under the same [MIT License](LICENSE) as the project.

---

## 🙏 Thank You

Thank you for considering contributing to the DevOps Project Generator! Your contributions help make DevOps more accessible to everyone.

Whether you're:
- Reporting a bug 🐛
- Suggesting a feature 💡
- Writing code 💻
- Improving documentation 📚
- Helping others 🤝

**Every contribution matters and is greatly appreciated!**

---

**Happy Contributing! 🚀**
