import { ProjectConfig, GeneratedFile } from "@/lib/types";
import { normalizeProjectName } from "../file-utils";

export function generateRealisticInfraFiles(config: ProjectConfig): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const projectName = normalizeProjectName(config.projectName);
  const infra = config.infra;

  if (infra === "aws-vpc-eks") {
    files.push({
      path: `${projectName}/infra/terraform/main.tf`,
      content: `terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "\${var.project_name}-\${var.environment}-vpc"
  cidr = var.vpc_cidr

  azs             = ["\${var.aws_region}a", "\${var.aws_region}b", "\${var.aws_region}c"]
  private_subnets = var.private_subnets
  public_subnets  = var.public_subnets

  enable_nat_gateway   = true
  single_nat_gateway   = var.environment != "prod"
  enable_dns_hostnames = true
  enable_dns_support   = true

  public_subnet_tags = {
    "kubernetes.io/role/elb" = 1
  }

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = 1
  }
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "\${var.project_name}-\${var.environment}"
  cluster_version = "1.30"

  cluster_endpoint_public_access = true

  vpc_id                   = module.vpc.vpc_id
  subnet_ids               = module.vpc.private_subnets
  control_plane_subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    primary = {
      name           = "node-group-1"
      instance_types = var.node_instance_types
      min_size       = var.min_nodes
      max_size       = var.max_nodes
      desired_size   = var.desired_nodes

      labels = {
        Environment = var.environment
      }
    }
  }
}
`,
      type: "file",
    });

    files.push({
      path: `${projectName}/infra/terraform/variables.tf`,
      content: `variable "project_name" {
  type        = string
  description = "Project identifier"
  default     = "${config.projectName}"
}

variable "environment" {
  type        = string
  description = "Deployment environment"
  default     = "dev"
}

variable "aws_region" {
  type        = string
  description = "AWS region"
  default     = "us-east-1"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for VPC"
  default     = "10.0.0.0/16"
}

variable "public_subnets" {
  type        = list(string)
  description = "Public subnet CIDRs"
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "private_subnets" {
  type        = list(string)
  description = "Private subnet CIDRs"
  default     = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"]
}

variable "node_instance_types" {
  type        = list(string)
  description = "EC2 instance types for EKS nodes"
  default     = ["t3.medium"]
}

variable "min_nodes" {
  type    = number
  default = 2
}

variable "max_nodes" {
  type    = number
  default = 5
}

variable "desired_nodes" {
  type    = number
  default = 2
}
`,
      type: "file",
    });

    files.push({
      path: `${projectName}/infra/terraform/outputs.tf`,
      content: `output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.vpc.vpc_id
}

output "eks_cluster_name" {
  description = "EKS cluster name"
  value       = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = module.eks.cluster_endpoint
}

output "eks_cluster_certificate_authority_data" {
  description = "Base64 encoded certificate data required to communicate with the cluster"
  value       = module.eks.cluster_certificate_authority_data
}
`,
      type: "file",
    });

    files.push({
      path: `${projectName}/infra/terraform/terraform.tfvars.example`,
      content: `project_name = "${config.projectName}"
environment  = "dev"
aws_region   = "us-east-1"
node_instance_types = ["t3.medium"]
min_nodes    = 2
max_nodes    = 5
desired_nodes = 2
`,
      type: "file",
    });
  } else if (infra === "azure-vnet-aks") {
    files.push({
      path: `${projectName}/infra/terraform/main.tf`,
      content: `terraform {
  required_version = ">= 1.5.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.100"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "\${var.project_name}-\${var.environment}-rg"
  location = var.azure_region
  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

resource "azurerm_virtual_network" "vnet" {
  name                = "\${var.project_name}-vnet"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  address_space       = ["10.1.0.0/16"]
}

resource "azurerm_subnet" "aks_subnet" {
  name                 = "aks-subnet"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.1.1.0/24"]
}

resource "azurerm_kubernetes_cluster" "aks" {
  name                = "\${var.project_name}-\${var.environment}-aks"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = "\${var.project_name}-aks"

  default_node_pool {
    name           = "default"
    node_count     = 2
    vm_size        = "Standard_DS2_v2"
    vnet_subnet_id = azurerm_subnet.aks_subnet.id
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin = "azure"
    network_policy = "azure"
  }
}
`,
      type: "file",
    });
  } else if (infra === "gcp-vpc-gke") {
    files.push({
      path: `${projectName}/infra/terraform/main.tf`,
      content: `terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

resource "google_compute_network" "vpc" {
  name                    = "\${var.project_name}-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "subnet" {
  name          = "\${var.project_name}-subnet"
  region        = var.gcp_region
  network       = google_compute_network.vpc.name
  ip_cidr_range = "10.10.0.0/20"
}

resource "google_container_cluster" "primary" {
  name     = "\${var.project_name}-gke"
  location = var.gcp_region

  remove_default_node_pool = true
  initial_node_count       = 1

  network    = google_compute_network.vpc.name
  subnetwork = google_compute_subnetwork.subnet.name
}

resource "google_container_node_pool" "primary_nodes" {
  name       = "primary-node-pool"
  location   = var.gcp_region
  cluster    = google_container_cluster.primary.name
  node_count = 2

  node_config {
    preemptible  = false
    machine_type = "e2-medium"
    oauth_scopes = ["https://www.googleapis.com/auth/cloud-platform"]
  }
}
`,
      type: "file",
    });
  } else if (infra === "aws-ecs-fargate" || infra === "ecs-fargate") {
    files.push({
      path: `${projectName}/infra/terraform/ecs.tf`,
      content: `resource "aws_ecs_cluster" "main" {
  name = "\${var.project_name}-\${var.environment}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ecs_task_definition" "app" {
  family                   = "\${var.project_name}-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "\${var.project_name}-app"
      image     = "\${aws_ecr_repository.app.repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/\${var.project_name}"
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "app" {
  name            = "\${var.project_name}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = module.vpc.private_subnets
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "\${var.project_name}-app"
    container_port   = 8080
  }
}
`,
      type: "file",
    });
  } else if (infra === "kubernetes-onprem" || infra === "kubernetes-on-prem") {
    files.push({
      path: `${projectName}/infra/k8s-cluster/cluster-config.yaml`,
      content: `apiVersion: kubeadm.k8s.io/v1beta3
kind: ClusterConfiguration
kubernetesVersion: v1.30.0
clusterName: ${config.projectName}-onprem
networking:
  podSubnet: "10.244.0.0/16"
  serviceSubnet: "10.96.0.0/12"
---
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
cgroupDriver: systemd
`,
      type: "file",
    });

    files.push({
      path: `${projectName}/infra/k8s-cluster/metallb-config.yaml`,
      content: `apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: onprem-pool
  namespace: metallb-system
spec:
  addresses:
  - 192.168.1.200-192.168.1.250
---
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: onprem-l2
  namespace: metallb-system
`,
      type: "file",
    });
  } else if (infra === "ansible-automation") {
    files.push({
      path: `${projectName}/infra/ansible/inventory.ini`,
      content: "[webservers]\nweb1.example.com ansible_host=192.168.10.11\nweb2.example.com ansible_host=192.168.10.12\n\n[all" + ":vars]\nansible_user=ubuntu\nansible_ssh_private_key_file=~/.ssh/id_rsa\n",
      type: "file",
    });

    files.push({
      path: `${projectName}/infra/ansible/site.yml`,
      content: `---
- name: Configure DevOps Servers
  hosts: webservers
  become: yes
  tasks:
    - name: Update apt packages
      apt:
        update_cache: yes
        cache_valid_time: 3600

    - name: Install Docker and dependencies
      apt:
        name:
          - docker.io
          - docker-compose
          - curl
          - git
        state: present

    - name: Enable and start Docker
      systemd:
        name: docker
        state: started
        enabled: yes
`,
      type: "file",
    });
  } else {
    // multicloud-terraform or fallback
    files.push({
      path: `${projectName}/infra/terraform/main.tf`,
      content: `terraform {
  required_version = ">= 1.5.0"
  backend "local" {
    path = "terraform.tfstate"
  }
}

// Multi-cloud abstraction module
module "infrastructure" {
  source = "./modules/environment"
  project_name = "${config.projectName}"
  environment  = "dev"
}
`,
      type: "file",
    });
  }

  return files;
}
