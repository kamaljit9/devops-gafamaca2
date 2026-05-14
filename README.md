# 🚀 AppForge Platform

[![CI Pipeline](https://img.shields.io/github/actions/workflow/status/username/appforge/ci.yml?branch=main&style=for-the-badge&logo=github)](https://github.com/username/appforge/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-containerized-blue.svg?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/node.js-v20-green.svg?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)

**AppForge Platform** is a production-grade, containerized multi-service platform for Task & User Management. Designed with high-availability, observability, and security in mind, it serves as a robust blueprint for modern DevOps architectures.

---

## 🏗 Architecture Overview

The platform consists of 6 core services orchestrated via Docker Compose:

- **API Backend**: Node.js (Express) with JWT (RS256) auth and Prometheus metrics.
- **Database**: PostgreSQL 16 for persistent storage.
- **Cache**: Redis 7 for high-performance task caching.
- **Proxy**: Nginx as a reverse proxy with rate limiting and security headers.
- **Metrics**: Prometheus for scraping service and system metrics.
- **Dashboard**: Grafana with pre-provisioned dashboards for real-time monitoring.

---

## 🛠 Features

- 🔐 **Secure Authentication**: RSA256 signed JWTs for stateless auth.
- ⚡ **Optimized Performance**: Redis caching with automatic invalidation.
- 📊 **Full Observability**: Structured JSON logging & Prometheus instrumentation.
- 🛡 **Security Hardened**: Non-root Docker users, read-only filesystems, and security headers.
- 🔄 **CI/CD Ready**: Automated linting, testing, vulnerability scanning, and SSH deployment.
- 📦 **Minimal Footprint**: Multi-stage Docker builds (< 80MB image).

---

## 🚦 Quick Start

### 1. Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)
- Make (optional, but recommended)

### 2. Setup Environment
```bash
cp .env.example .env
# Update .env with your secrets
```

### 3. Start the Platform
```bash
make up
```

### 4. Enable Monitoring
```bash
make monitor
# Visit http://localhost:3001 (Grafana) - Default: admin/admin
```

---

## 📖 API Documentation

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user | ❌ |
| `POST` | `/auth/login` | Login and receive JWT | ❌ |
| `GET` | `/tasks` | List tasks (paginated) | ✅ |
| `POST` | `/tasks` | Create a new task | ✅ |
| `GET` | `/health` | Check system health | ❌ |
| `GET` | `/metrics` | Prometheus metrics | ❌ (Internal) |

---

## 🧪 Testing & Quality

```bash
make test    # Run unit + integration tests
make scan    # Run Trivy security scan
```

---

## 📜 License
MIT License. Created by the AppForge Team.
