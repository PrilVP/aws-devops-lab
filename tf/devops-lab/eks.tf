module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "${var.project_name}-eks"
  cluster_version = "1.30"

  # Сетка
  vpc_id                   = aws_vpc.this.id
  subnet_ids               = [for s in aws_subnet.private : s.id]
  control_plane_subnet_ids = [for s in aws_subnet.private : s.id]

  # Доступ к API
  cluster_endpoint_public_access  = true
  cluster_endpoint_private_access = true

  # Дать тому, кто создаёт кластер (тебе) админ-права внутри k8s
  enable_cluster_creator_admin_permissions = true

  # Настройки нод по умолчанию
  eks_managed_node_group_defaults = {
    ami_type       = "AL2023_x86_64_STANDARD"
    disk_size      = 20
    instance_types = ["t3.small"]
  }

  # Один node group
  eks_managed_node_groups = {
    general = {
      min_size     = 1
      max_size     = 3
      desired_size = 2
    }
  }

  tags = {
    Environment = "dev"
    Project     = var.project_name
  }
}
