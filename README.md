# DevOps Lab: AWS EKS + Terraform + GitHub Actions

![Terraform](https://img.shields.io/badge/Terraform-1.9+-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-1.30+-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-EKS%20%7C%20RDS%20%7C%20ECR-orange?style=for-the-badge&logo=amazonaws&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI/CD-GitHub%20Actions-blue?style=for-the-badge&logo=githubactions&logoColor=white)
![Helm](https://img.shields.io/badge/Helm-Charts-0F1689?style=for-the-badge&logo=helm&logoColor=white)

Учебно-боевой проект, в котором на практике разворачивается почти продовая инфраструктура AWS.  
Стек: **Terraform, EKS, ALB Ingress, GitHub Actions, ECR, RDS, Helm, Loki, Grafana**.

---

## 🏗 Архитектура

```txt
                        ┌─────────────────────────┐
                        │        GitHub            │
                        │  Actions CI/CD Pipeline  │
                        └─────────────┬───────────┘
                                      │
                                      ▼
                          Build & Push Docker Image
                                      │
                                      ▼
                        ┌─────────────────────────┐
                        │          ECR             │
                        └─────────────┬───────────┘
                                      │ Image Pull
                                      ▼
        ┌──────────────────────────────────────────────────────────────┐
        │                          EKS Cluster                         │
        │                                                              │
        │  ┌─────────────────┐    ┌──────────────────┐                 │
        │  │ demo-app Pods   │<──>│ Service (ClusterIP)│               │
        │  └─────────────────┘    └──────────────────┘                 │
        │            ▲                       │                         │
        │            │                       ▼                         │
        │  ┌─────────────────┐      ┌──────────────────────┐           │
        │  │ HPA             │◀────▶│ Metrics / Autoscaler │           │
        │  └─────────────────┘      └──────────────────────┘           │
        │                                                              │
        └──────────────────────────────────────────────────────────────┘
                                      ▲
                                      │
                               Traffic via ALB
                                      │
                                      ▼
                        ┌─────────────────────────┐
                        │  AWS ALB Ingress        │
                        └─────────────┬───────────┘
                                      │ HTTPS (443)
                                      ▼
                           https://app.<domain>
```
📦 Модули Terraform
```terraform/
 ├── vpc/                    # Сеть, сабнеты, NAT
 ├── eks/                    # Кластер, node groups
 ├── rds/                    # PostgreSQL
 ├── iam/                    # IAM роли, включая IRSA
 ├── alb-controller/         # AWS Load Balancer Controller
 ├── monitoring/             # Loki, Promtail, Grafana
 └── outputs.tf              # Важные выводы
```

⚙ CI/CD Pipeline
```Push to main
   │
   ├── Build Docker Image
   ├── Push to ECR
   ├── helm upgrade --install demo-app ./demo-app
   │       ├── Deployment update
   │       ├── Service
   │       ├── Ingress (ALB)
   │       └── Autoscaling configs
   │
   └── App becomes available at:
       https://app.<domain>```
🔐 Secrets

Используются:
AWS Secrets Manager
IRSA (IAM Roles for Service Accounts)
Secrets Store CSI Driver
```Git — не храним секреты
Terraform — управляет ими
Kubernetes — получает динамически```

📊 Логи и Мониторинг
```Loki       — база логов
Promtail   — сбор логов с pod/нод
Grafana    — дашборды и алерты
metrics-server — CPU/RAM подов
Cluster Autoscaler — масштабирует ноды
HPA — масштабирует поды```

🧩 Demo-app

Node.js + Express + pg
Подключение к RDS через secret.
Обновляется через Helm.

```.
├── app/                     # Node.js приложение
├── demo-app/                # Helm chart
├── terraform/               # Инфраструктура
├── .github/workflows/       # GitHub Actions (CI/CD)
└── README.md```

🛠 Как запустить проект

```# Инициализация Terraform
terraform init
terraform apply

# Проверка кластера
kubectl get nodes
kubectl get pods -A

# Деплой приложения
helm upgrade --install demo-app ./demo-app```

🧹 Git Cleanliness
```.gitignore включает:
  terraform.tfvars
  *.pem
  *secret*
  *.yaml с приватными конфигами

Если утекло в историю:
  git filter-repo --path ...```

📄 Лицензия

Свободное использование для обучения и тренировок.
В проде всё равно будете переписывать половину, но это нормально.

