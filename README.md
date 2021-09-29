# titanic
MC714's first test

- `infra/` : Terraform modules for infrastructure in GCP.
- `k8s/` : Kubernetes resources files.
- `frontend/` : web application of **titanic**.

## Authentication in GKE
`gcloud container clusters get-credentials $(terraform output -raw kubernetes_cluster_name) --region $(terraform output -raw region)`

## References
- [Provision a GKE Cluster (Google Cloud)](https://learn.hashicorp.com/tutorials/terraform/gke)
- [Deploying a containerized web application](https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app)