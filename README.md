# 🚀 DevOps Project Generator 🚀

A powerful CLI tool that scaffolds production-ready DevOps repositories with ease, allowing you to quickly bootstrap complete DevOps projects by selecting user-friendly options for CI/CD, infrastructure, deployment, environments, observability, and security.

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

- Fast project generation
- Interactive setup
- Configurable tech stack
- Best practices project structure
- Browse and create templates
- Save configurations as profiles
- Integration testing
- Project health analysis
- Backup and restore
- Advanced project management
- Dependency scanning
- Multi-environment config generator

## 🖥️ Usage

### Quick Start

```bash
# Install
pip install devops-project-generator

# Generate a project
devops-project-generator init --name my-app --ci github-actions --deploy docker

# Scan dependencies (NEW v1.5.0)
devops-project-generator scan my-app

# Setup multi-environment configs (NEW v1.5.0)
devops-project-generator multi-env my-app --envs "dev,stage,prod"
```

### Documentation

- 📖 **[Commands Reference](COMMANDS.md)** - Complete command documentation
- 🎯 **[Usage Examples](EXAMPLES.md)** - Practical examples and workflows
- 📋 **[Templates Guide](TEMPLATES.md)** - Template customization guide

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

## ⚙️ Supported Options (v1.5.0)

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

## 🏗️ Generated Project Structure

```
devops-project/
├── app/
├── ci/
├── infra/
├── k8s/
├── config/              # NEW: Multi-environment configs
├── docker/              # NEW: Docker Compose configs
├── monitoring/
├── security/
├── scripts/
├── Makefile
└── README.md
```

For detailed structure information, see the **[Templates Guide](TEMPLATES.md)**.

### Project Templates

The generator supports custom templates. See the **[Templates Guide](TEMPLATES.md)** for detailed information on creating and customizing templates.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/NotHarshhaa/devops-project-generator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/NotHarshhaa/devops-project-generator/discussions)
- **Documentation**: [Wiki](https://github.com/NotHarshhaa/devops-project-generator/wiki)

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
