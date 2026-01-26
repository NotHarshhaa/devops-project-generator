# 🚀 DevOps Project Generator

A powerful CLI tool that scaffolds production-ready DevOps repositories based on user-selected options like CI/CD, infrastructure, deployment, environments, observability, and security.

## ✨ Why DevOps Project Generator?

Setting up a real-world DevOps project from scratch is repetitive and error-prone. This tool helps you bootstrap a complete DevOps-ready repository in seconds, following industry best practices.

✔ Opinionated but configurable  
✔ Beginner-friendly, production-oriented  
✔ CLI support  
✔ No tool lock-in  

## 🎯 Who Is This For?

- **DevOps Engineers**
- **Cloud Engineers** 
- **Platform Engineers**
- **SREs**
- **Students & freshers building real DevOps projects**

## 🌟 Key Features

### 🎯 Project Generation
- **Fast scaffolding** - Generate complete DevOps projects in seconds
- **Interactive mode** - Guided setup with helpful prompts
- **Flexible configuration** - Choose your tech stack and tools
- **Best practices** - Industry-standard project structure

### 📋 Template Management (v1.3.0)
- **Browse templates** by category (CI, Infrastructure, Deployment, Monitoring, Security)
- **Create custom templates** with pre-populated Jinja2 syntax
- **Template customization** with variable guidance
- **File size information** and template metadata

### 🔧 Configuration Profiles (v1.4.0)
- **Save configurations** as reusable profiles
- **Interactive profile creation** with prompts
- **Profile metadata** (creation date, description)
- **Command generation** from saved profiles
- **Persistent storage** in user home directory

### 🧪 Integration Testing (v1.4.0)
- **6 test categories** - Structure, Config files, Security, CI/CD, Documentation, Scripts
- **Detailed scoring** system (0-100%)
- **Verbose mode** for step-by-step testing
- **Actionable error messages** with specific failures
- **Warning system** for optional components

### 🏥 Project Health (v1.3.0)
- **Comprehensive analysis** of project health and best practices
- **Health scoring** with category breakdowns
- **Intelligent recommendations** for improvements
- **Auto-fix capabilities** for common issues

### 💾 Backup & Restore (v1.3.0)
- **Project archiving** with timestamped backups
- **Backup management** with list and restore functions
- **Configuration preservation** during backup operations

### 🛠️ Advanced Management
- **Project validation** and structure checking
- **Configuration file management** system
- **Project cleanup** and teardown utilities
- **Detailed statistics** and project analysis

## 🧠 What This Generator Creates

A full DevOps project structure covering:
- CI/CD pipelines
- Containerization
- Infrastructure (IaC-ready)
- Deployment models
- Environment separation
- Observability
- Security basics

All generated based on your selected options.

## ⚙️ Supported Options (v1)

### CI/CD
- **GitHub Actions**
- **GitLab CI**
- **Jenkins**
- **None**

### Infrastructure
- **Terraform**
- **CloudFormation**
- **None**

### Deployment
- **VM**
- **Docker**
- **Kubernetes**

### Environments
- **Single**
- **Dev / Stage / Prod**

### Observability
- **Logs only**
- **Logs + Metrics**
- **Full (Logs + Metrics + Alerts)**

### Security
- **Basic**
- **Standard**
- **Strict**

## 🖥️ Usage

### CLI Usage

```bash
devops-project-generator init \
  --ci github-actions \
  --infra terraform \
  --deploy kubernetes \
  --envs dev,stage,prod \
  --observability full \
  --security standard
```

### Interactive Mode

```bash
devops-project-generator init --interactive
```

### List Available Options

```bash
devops-project-generator list-options
```

### Project Configuration (NEW v1.2.0)

```bash
# Create a configuration file
devops-project-generator config create

# Show current configuration
devops-project-generator config show

# Validate configuration file
devops-project-generator config validate
```

### Project Validation (NEW v1.2.0)

```bash
# Validate project structure
devops-project-generator validate

# Auto-fix common issues
devops-project-generator validate --fix
```

### Project Information (NEW v1.2.0)

```bash
# Show project statistics
devops-project-generator info

# Detailed analysis
devops-project-generator info --detailed
```

### Project Cleanup (NEW v1.2.0)

```bash
# Clean up a project (with confirmation)
devops-project-generator cleanup my-project

# Force cleanup without confirmation
devops-project-generator cleanup my-project --force

# Keep configuration files
devops-project-generator cleanup my-project --keep-config
```

### Template Management (NEW v1.3.0)

```bash
# List available templates by category
devops-project-generator template list

# List templates from specific category
devops-project-generator template list --category ci

# Create custom template
devops-project-generator template create --category ci --name custom-pipeline

# Customize existing template
devops-project-generator template customize --category ci --name github-actions.yml
```

### Configuration Profiles (NEW v1.4.0)

```bash
# List saved profiles
devops-project-generator profile list

# Save current configuration as a profile
devops-project-generator profile save --name webapp

# Load and display profile details
devops-project-generator profile load --name webapp

# Delete a saved profile
devops-project-generator profile delete --name webapp
```

### Integration Testing (NEW v1.4.0)

```bash
# Run integration tests on generated project
devops-project-generator test my-project

# Run tests with verbose output
devops-project-generator test my-project --verbose
```

### Project Backup (NEW v1.3.0)

```bash
# Create backup
devops-project-generator backup create my-project

# List available backups
devops-project-generator backup list

# Restore from backup
devops-project-generator backup restore my-project --file backup.tar.gz
```

### Health Check (NEW v1.3.0)

```bash
# Basic health check
devops-project-generator health my-project

# Detailed health analysis
devops-project-generator health my-project --detailed

# Auto-fix health issues
devops-project-generator health my-project --fix
```

## 🏗️ Generated Project Structure (Example)

```
devops-project/
├── app/
│   └── sample-app/
├── ci/
│   ├── pipelines/
│   └── README.md
├── infra/
│   ├── terraform/
│   └── environments/
├── containers/
│   ├── Dockerfile
│   └── docker-compose.yml
├── k8s/
│   ├── base/
│   └── overlays/
├── monitoring/
│   ├── logs/
│   ├── metrics/
│   └── alerts/
├── security/
│   ├── secrets/
│   └── scanning/
├── scripts/
│   └── automation/
├── Makefile
└── README.md
```

## 🛠️ Tech Stack

### Generator Core
- **Python**
- **Jinja2**
- **YAML-based configuration**

### CLI
- **Typer**
- **Rich**

## 📦 Installation

### From PyPI

```bash
pip install devops-project-generator
```

### From Source

```bash
git clone https://github.com/NotHarshhaa/devops-project-generator.git
cd devops-project-generator
pip install -e .
```

### Development Setup

```bash
git clone https://github.com/NotHarshhaa/devops-project-generator.git
cd devops-project-generator
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -e ".[dev]"
```

## 🚀 Quick Start

1. **Generate a new project**
   ```bash
   devops-project-generator init --name my-app --ci github-actions --deploy kubernetes
   ```

2. **Navigate to your project**
   ```bash
   cd my-app
   ```

3. **Setup the environment**
   ```bash
   make setup
   ```

4. **Start the application**
   ```bash
   make start
   ```

5. **Check health**
   ```bash
   make health
   ```

## 📖 Examples

### Basic Web App with Docker

```bash
devops-project-generator init \
  --name my-webapp \
  --ci github-actions \
  --deploy docker \
  --envs single \
  --observability logs \
  --security basic
```

### Enterprise Kubernetes App

```bash
devops-project-generator init \
  --name enterprise-app \
  --ci github-actions \
  --infra terraform \
  --deploy kubernetes \
  --envs dev,stage,prod \
  --observability full \
  --security strict
```

### Simple VM Deployment

```bash
devops-project-generator init \
  --name simple-app \
  --ci jenkins \
  --deploy vm \
  --envs dev,prod \
  --observability logs-metrics \
  --security standard
```

### Using Configuration Profiles

```bash
# Save a common configuration
devops-project-generator profile save --name webapp \
  --ci github-actions \
  --infra terraform \
  --deploy docker \
  --observability logs \
  --security basic

# Generate project using saved profile
devops-project-generator init --ci github-actions --infra terraform --deploy docker --observability logs --security basic --name my-webapp
```

### Template Customization

```bash
# List available CI templates
devops-project-generator template list --category ci

# Create custom pipeline template
devops-project-generator template create --category ci --name custom-pipeline

# Customize existing template
devops-project-generator template customize --category ci --name github-actions.yml
```

### Integration Testing

```bash
# Generate project
devops-project-generator init --name test-project --ci github-actions --deploy docker

# Run integration tests
devops-project-generator test test-project

# Run tests with detailed output
devops-project-generator test test-project --verbose
```

## 🔧 Configuration

### Global Configuration

You can set default options in `~/.devops-generator/config.yaml`:

```yaml
defaults:
  ci: github-actions
  deploy: kubernetes
  observability: logs-metrics
  security: standard
```

### Project Templates

The generator supports custom templates. Place your templates in:

```
~/.devops-generator/templates/
├── ci/
├── infra/
├── deploy/
├── monitoring/
└── security/
```

## 🧪 Testing

### Run Tests

```bash
pytest
```

### Run Tests with Coverage

```bash
pytest --cov=devops_project_generator --cov-report=html
```

### Run Linting

```bash
flake8 devops_project_generator/
black devops_project_generator/
mypy devops_project_generator/
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

### Adding New Features

1. **New CI/CD Platform**: Add templates in `templates/ci/`
2. **New Infrastructure Tool**: Add templates in `templates/infra/`
3. **New Deployment Method**: Add templates in `templates/deploy/`
4. **New Security Level**: Add templates in `templates/security/`

## 📚 Documentation

- [User Guide](docs/user-guide.md)
- [Developer Guide](docs/developer-guide.md)
- [Template Reference](docs/template-reference.md)
- [API Documentation](docs/api.md)

## 🐛 Troubleshooting

### Common Issues

1. **Permission Denied**
   ```bash
   chmod +x scripts/setup.sh scripts/deploy.sh
   ```

2. **Template Not Found**
   - Check if template files exist in `templates/`
   - Verify template syntax

3. **Generated Files Not Executable**
   ```bash
   find . -name "*.sh" -exec chmod +x {} \;
   ```

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/NotHarshhaa/devops-project-generator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/NotHarshhaa/devops-project-generator/discussions)
- **Documentation**: [Wiki](https://github.com/NotHarshhaa/devops-project-generator/wiki)

## 🗺️ Roadmap

### v1.1 ✅ 
- [x] Performance optimizations (95%+ faster generation)
- [x] Concurrent file generation
- [x] Enhanced error handling and validation
- [x] Template caching and pre-loading
- [x] Better user experience with improved messages

### v1.2 ✅ 
- [x] Project validation and structure checking
- [x] Configuration file management system
- [x] Project cleanup and teardown utilities
- [x] Detailed project statistics and analysis
- [x] DevOps maturity scoring
- [x] Intelligent recommendations system

### v1.3 ✅ 
- [x] Template management and customization system
- [x] Project backup and restore functionality
- [x] Comprehensive health monitoring and scoring
- [x] Auto-fix capabilities for common issues
- [x] Advanced project analysis and recommendations

### v1.4 ✅ (Current)
- [x] Enhanced template management with category support
- [x] Configuration profiles for reusable setups
- [x] Integration testing with comprehensive validation
- [x] Project scoring and quality assessment
- [x] Verbose testing mode with detailed feedback
- [x] Profile management with persistent storage

### v1.5
- [ ] Support for Azure DevOps
- [ ] Additional cloud providers (GCP, Azure)
- [ ] More deployment targets (AWS ECS, Fargate)
- [ ] Advanced monitoring templates
- [ ] Plugin system for custom templates
- [ ] Multi-language project support

### v2.0
- [ ] AI-powered recommendations
- [ ] Enterprise features and SSO integration
- [ ] Advanced project customization
- [ ] Team collaboration features
- [ ] Cloud IDE integration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Typer** - For the amazing CLI framework
- **Rich** - For beautiful terminal output
- **Jinja2** - For powerful templating
- **DevOps Community** - For best practices and inspiration

## 📞 Contact

This project is crafted with 💡 by **[Harshhaa](https://github.com/NotHarshhaa)**.  
Your feedback is always welcome! Let's build together. 🚀  

📧 **Connect with me:**  
🔗 **GitHub**: [@NotHarshhaa](https://github.com/NotHarshhaa)  
🔗 **Portfolio**: [Personal Portfolio](https://notharshhaa.site)  
🔗 **Links - Portfolio**: [Links](https://link.notharshhaa.site)  
🔗 **Telegram Community**: [Join Here](https://t.me/prodevopsguy)  
🔗 **LinkedIn**: [Harshhaa Vardhan Reddy](https://www.linkedin.com/in/NotHarshhaa/)  

---

**Built with ❤️ by the DevOps community**  
*Making DevOps accessible to everyone*
