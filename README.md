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

### v1.1
- [ ] Support for Azure DevOps
- [ ] Additional cloud providers (GCP, Azure)
- [ ] More deployment targets (AWS ECS, Fargate)
- [ ] Advanced monitoring templates

### v1.2
- [ ] Template marketplace
- [ ] Plugin system
- [ ] GUI interface
- [ ] Integration with popular tools

### v2.0
- [ ] Multi-language support
- [ ] Advanced project customization
- [ ] AI-powered recommendations
- [ ] Enterprise features

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
