# 🛡️ NetShield AI — Network Anomaly Detection & Threat Monitoring System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Containerized-cyan.svg)](docker-compose.yml)
[![Node.js](https://img.shields.io/badge/Node.js-v20.x-green.svg)](backend/)
[![React](https://img.shields.io/badge/React-v18.x-61dafb.svg)](frontend/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v7.0-47A248.svg)](docker-compose.yml)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-Scikit--Learn-orange.svg)](backend/ai/)

**NetShield AI** is an enterprise-grade, AI-powered **Security Operations Center (SOC)** platform designed for real-time network traffic anomaly detection, automated alert correlation, security incident lifecycle management, threat intelligence enrichment, and executive analytics.

---

## 🌟 Key Features

### 🤖 1. AI-Powered Anomaly Detection Engine
- **Random Forest Machine Learning Inference:** Performs real-time multi-class intrusion classification (*DoS Hulk*, *DDoS*, *PortScan*, *Botnet*, *SSH-Patator*, *Web Attack*, *BENIGN*) with **96.2% accuracy** and **< 2ms latency**.
- **0–100 Real-Time Risk Scoring:** Categorizes threats into `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, and `INFO`.
- **Live Packet Simulator & Batch CSV Analysis:** Stage simulated packet features or upload raw **CICIDS2017** CSV files for bulk offline traffic scoring.

### 🚨 2. Alert Generation & 5-Minute Correlation Deduplication
- **Rules-Based Severity Classification:** Maps risk scores and attack vectors into prioritized severity tiers.
- **5-Minute Correlation Window:** Automatically collapses duplicate attack packets from identical source/destination IPs within 5 minutes into a single alert record, incrementing an `Occurrences` counter (`1×`, `2×`, `3×`).
- **Defensive Mitigation Recommendations:** Generates actionable remediation guidance (e.g., BGP flowspec rate-limiting, WAF connection throttling, Fail2ban rules).

### 🛡️ 3. Security Incident Management & Lifecycle State Machine
- **Formal Escalation:** Declare critical alerts into tracked Security Incidents with custom INC-IDs (`INC-2001`).
- **6-Stage Lifecycle State Machine:**
  $$\text{OPEN} \longrightarrow \text{ACKNOWLEDGED} \longrightarrow \text{INVESTIGATING} \longrightarrow \text{CONTAINED} \longrightarrow \text{RESOLVED} \longrightarrow \text{CLOSED}$$
- **Analyst Dispatching & Timeline:** Assign incidents to specific SOC analysts, record timestamped investigation notes, and maintain forensic audit logs.

### 🌐 4. Threat Intelligence Subsystem
- **Observed Telemetry vs. External Intelligence:** Tracks high-frequency attacking IPs, accumulated occurrence counts, and max risk scores.
- **Provider Enrichment Abstraction:** `ThreatIntelProvider` module simulating API integrations with AbuseIPDB, VirusTotal, and AlienVault OTX.

### 📊 5. Security Analytics & Executive Benchmarks
- **Server-Side MongoDB Aggregations:** `$match`, `$group`, and `$sort` pipelines computing attack distribution breakdowns, risk histograms, and top malicious source IPs.
- **Interactive Volume Timeline:** Stacked visualization separating total alert volume (cyan) from critical attack spikes (rose/red).
- **SOC Operational Metrics:** Computes **MTTA** (*Mean Time to Acknowledge*) and **MTTR** (*Mean Time to Resolve*).

### 🔔 6. Notifications, Reporting & Health Monitoring
- **Live In-App Notification Bell:** Header drawer with unread counter, polling every 30 seconds for `CRITICAL` & `HIGH` alerts.
- **Multi-Format Export Engine:** Download compliance audit reports in **JSON**, **CSV**, or **PDF** format.
- **System Service Health Check:** Live monitoring endpoint for API server, database, AI engine, alert engine, and notification service.

---

## 🏗️ System Architecture

```text
[ Network Traffic / CSV ]
           │
           ▼
[ React 18 / Vite Frontend ] (Port 80)
           │ REST API (JWT)
           ▼
[ Node.js / Express Backend ] (Port 5001)
           │
     ┌─────┴────────────────────────────┐
     ▼                                  ▼
[ Python ML Engine ]          [ MongoDB 7.0 ]
(Random Forest Model)         (Alerts, Incidents, Logs)
     │                                  │
     └────────────► [ Alert Engine ] ◄──┘
                         │
                         ▼
             [ SOC Dashboard & Analytics ]
```

---

## 💻 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Heroicons, Chart.js, Axios |
| **Backend** | Node.js, Express.js, Mongoose, JWT, Bcrypt.js, Multer |
| **Database** | MongoDB 7.0 (Indexing & Aggregation Pipelines) |
| **AI / ML** | Python 3, Scikit-Learn (Random Forest), Pandas, NumPy |
| **DevOps / Deployment** | Docker, Docker Compose, Nginx |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (recommended) **OR** Node.js v20+ & MongoDB v7.0

---

### Option A: Docker Deployment (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/banavathuramkumar/NetShield-AI.git
   cd NetShield-AI
   ```

2. **Start all services with Docker Compose:**
   ```bash
   docker-compose up -d --build
   ```

3. **Access the application:**
   - 🌐 **Frontend Web App:** [http://localhost](http://localhost)
   - ⚙️ **Backend REST API:** [http://localhost:5001](http://localhost:5001)
   - 🗄️ **MongoDB Database:** `localhost:27018`

---

### Option B: Local Manual Setup (Development Mode)

#### 1. Backend Setup:
```bash
cd backend
npm install
npm run seed:milestone3   # Seeds demo alerts, incidents & threat intel
npm run dev
```

#### 2. Frontend Setup:
```bash
cd frontend
npm install
npm run dev
```
Access frontend at `http://localhost:5173`.

---

## 🔑 Default Demo Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Security Administrator** | `admin@netshield.ai` | `password123` | Full Admin + System Monitoring & Dataset Management |
| **Senior SOC Analyst** | `analyst@netshield.ai` | `password123` | Analyst Dashboard, Alerts, Incidents & Threat Intel |

---

## 🧪 Running Automated Tests

Run the full end-to-end integration test suite (24/24 passing tests):

```bash
# Inside Docker container:
docker exec netshield-backend node src/tests/e2eTest.js

# Or locally:
cd backend
node src/tests/e2eTest.js
```

---

## 🌐 API Endpoint Reference

```text
Authentication:       POST  /api/auth/register
                      POST  /api/auth/login
                      GET   /api/auth/me

AI Engine:            POST  /api/ai/predict
                      POST  /api/ai/upload (Batch CSV)

Alert Management:     GET   /api/alerts
                      GET   /api/alerts/:id
                      PATCH /api/alerts/:id/status
                      PATCH /api/alerts/:id/assign

Incident Center:      GET   /api/incidents
                      POST  /api/incidents
                      PATCH /api/incidents/:id/status
                      POST  /api/incidents/:id/notes

Threat Intelligence: GET   /api/threat-intelligence/overview
                      POST  /api/threat-intelligence/:id/enrich

Security Analytics:   GET   /api/analytics/overview
                      GET   /api/analytics/attacks
                      GET   /api/analytics/timeline
                      GET   /api/analytics/metrics (MTTA/MTTR)

Reporting & Health:   POST  /api/reports/generate
                      GET   /api/reports/:filename/download
                      GET   /api/reports/health/services
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Ramkumar Banavathu**  
- GitHub: [@banavathuramkumar](https://github.com/banavathuramkumar)  
- Repository: [NetShield-AI](https://github.com/banavathuramkumar/NetShield-AI)
