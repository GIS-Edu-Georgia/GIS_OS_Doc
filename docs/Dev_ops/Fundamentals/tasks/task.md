# 🖥️ Linux Server Administration — Task Tracker

> **პროექტი:** Ubuntu Server Setup & Administration  
> **დაწყების თარიღი:** 02.10.26  
> **ბოლო განახლება:** 

---

## სტატუსის ლეგენდა

| სიმბოლო | სტატუსი |
|---------|---------|
| ✅ | შესრულებულია |
| 🔄 | მიმდინარეობს |
| ⏳ | დაგეგმილია |
| ⚠️ | პრობლემაა |

---
## დიაგრამა

```mermaid
flowchart TB

subgraph SETUP["🛠 Setup & Basics"]
  T1["Task 1<br/>Virtual Machine"]
  T2["Task 2<br/>Network Setup"]
  T3["Task 3<br/>Static IP"]
  T4["Task 4<br/>SSH Config"]
  T5["Task 5<br/>System Update"]
end

subgraph SECURITY["🔐 Security"]
  T6["Task 6<br/>Users & Permissions"]
  T7["Task 7<br/>Firewall"]
  T13["Task 13<br/>Log Monitoring"]
  T23["Task 23<br/>Security Audit"]
end

subgraph DEVOPS["⚙️ DevOps & Automation"]
  T11["Task 11<br/>Backup Script"]
  T12["Task 12<br/>Cron Jobs"]
  T14["Task 14<br/>Docker"]
  T15["Task 15<br/>Containers"]
  T19["Task 19<br/>Deploy Script"]
end

subgraph PRODUCTION["🚀 Production & Services"]
  T8["Task 8<br/>Nginx"]
  T9["Task 9<br/>Website"]
  T10["Task 10<br/>Database"]
  T16["Task 16<br/>Reverse Proxy"]
  T17["Task 17<br/>SSL"]
end

subgraph OPS["📊 Operations & Monitoring"]
  T20["Task 20<br/>Monitoring"]
  T21["Task 21<br/>Disk Cleanup"]
  T22["Task 22<br/>Diagnostics"]
  T24["Task 24<br/>Recovery"]
  T25["Task 25<br/>Optimization"]
end

subgraph DOCS["📚 Documentation"]
  T18["Task 18<br/>Git Repo"]
  T26["Task 26<br/>Docs"]
  T27["Task 27<br/>Presentation"]
end


T1 --> T2 --> T3 --> T4 --> T5

T5 --> T6
T6 --> T7
T7 --> T13
T13 --> T23

T5 --> T8
T8 --> T9
T9 --> T10
T10 --> T16
T16 --> T17

T17 --> T11
T11 --> T12
T12 --> T14
T14 --> T15
T15 --> T19

T19 --> T20
T20 --> T21
T21 --> T22
T22 --> T24
T24 --> T25

T25 --> T18
T18 --> T26
T26 --> T27
```


## 📋 ამოცანები

### ბლოკი 1 — საბაზისო Setup (Tasks 1–9)

| # | ამოცანა | სტატუსი | შენიშვნა |
|---|---------|---------|----------|
| 1 | **Virtual Machine** — Ubuntu Server VirtualBox-ში | ✅ | |
| 2 | **Network Setup** — NAT + Host-Only adapters | ✅ | |
| 3 | **Static IP Configuration** — Host-Only static IP | ✅ | |
| 4 | **SSH Configuration** — SSH key authentication | ✅ | |
| 5 | **System Update** — git, curl, vim, htop, net-tools | ✅ | |
| 6 | **User & Permission Management** — developer + deploy users | ✅ | |
| 7 | **Firewall Setup** — ufw: SSH, HTTP, HTTPS | ✅ | |
| 8 | **Web Server Installation** — Nginx | ✅ | |
| 9 | **Custom Website Deploy** — HTML site on Nginx | ✅ | |

### ბლოკი 2 — Database & Automation (Tasks 10–13)

| # | ამოცანა | სტატუსი | შენიშვნა |
|---|---------|---------|----------|
| 10 | **Database Installation** — MySQL/PostgreSQL + user | ✅ | |
| 11 | **Automated Backup Script** — bash script, tar.gz | ✅ | |
| 12 | **Cron Automation** — daily backup 3:00 AM | ✅ | |
| 13 | **Log Monitoring** — failed logins + sudo commands | ✅ | |

### ბლოკი 3 — Docker & Deployment (Tasks 14–19)

| # | ამოცანა | სტატუსი | შენიშვნა |
|---|---------|---------|----------|
| 14 | **Docker Installation** — Docker + Docker Compose | ✅ | |
| 15 | **Containerized Application** — nginx + db compose | ✅ | |
| 16 | **Reverse Proxy Configuration** — Nginx → Docker | ✅ | |
| 17 | **SSL Certificate** — self-signed, HTTPS | ✅ | |
| 18 | **Git Repository Setup** — initial commit | ✅ | |
| 19 | **Deployment Script** — git pull → rebuild → restart | ✅ | |

### ბლოკი 4 — Monitoring & Optimization (Tasks 20–25)

| # | ამოცანა | სტატუსი | შენიშვნა |
|---|---------|---------|----------|
| 20 | **System Resource Monitoring** — htop/glances/netdata | ✅ | |
| 21 | **Disk Space Management** — cleanup 30+ day files | ✅ | |
| 22 | **Network Diagnostics** — ports, connections | ✅ | |
| 23 | **Security Audit** — users, sudo, fail2ban | ✅ | |
| 24 | **Disaster Recovery Test** — full backup → restore | ✅ | |
| 25 | **Performance Optimization** — disable services, tune configs | ✅ | |

### ბლოკი 5 — Documentation (Task 26)

| # | ამოცანა | სტატუსი | შენიშვნა |
|---|---------|---------|----------|
| 26 | **Documentation** — სრული setup/backup/restore guide | 🔄 | |

---

## 📊 პროგრესი

- **შესრულებული:** 25 / 26
- **მიმდინარე:** 1 / 26
- **დარჩენილი:** 1 / 26

---

## 📝 შენიშვნები და სამახსოვრო

> აქ ჩაწერე ყველაფერი რაც გინდა დაიმახსოვრო — ბრძანებები, IP მისამართები, პაროლები (ადგილობრივად), კონფიგურაციის დეტალები და ა.შ.

### 🔑 მნიშვნელოვანი ინფორმაცია

| პარამეტრი | მნიშვნელობა |
|-----------|-------------|
| VM IP (Host-Only) | |
| VM IP (NAT) | |
| SSH Port | 22 |
| DB Type | PostgreSQL / MySQL |
| DB Name | |
| DB User | |
| Nginx Config Path | |
| Backup Script Path | |
| Docker Compose Path | |
| SSL Cert Path | |
| Git Repo Path | |

### 🗒️ ზოგადი შენიშვნები

-  

### ⚠️ ცნობილი პრობლემები / გასაკეთებელი

-  

### 💡 სასარგებლო ბრძანებები

```bash
# სწრაფი ჩანაწერებისთვის
```

---

*ბოლოს განახლდა: ____-__-__*