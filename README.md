# titanic
Unicamp MC714-2021s2's first test. Presentation slides are available.

- `infra/` : Terraform modules for infrastructure in GCP.
- `k8s/` : Kubernetes resources files.
- `frontend/` : web application of **titanic**.

The frontend image is buit with **Github Actions** and use the Github container registry (check in Releases section).

## Requirements
- Have a Google Cloud Plataform account.
- Install `gloud` CLI, login and authorize its APIs.
- Install Terraform CLI.

## Usage
- Replace `infra/terraform.tfvars` with your own configs.
- Run terraform in `terraform/`: `terraform apply`.
- Deploy k8s resources in `infra/`: 

## References
- [Provision a GKE Cluster (Google Cloud)](https://learn.hashicorp.com/tutorials/terraform/gke)
- [Deploying a containerized web application](https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app)