# Production არქიტექტურა (სასწავლო ლაბორატორია)

!!! warning "მნიშვნელოვანი შენიშვნა"
    ეს განყოფილება არის **სასწავლო ლაბორატორია და ცნობარი**. ის **არ ნიშნავს**, რომ რეალური საჯარო production სისტემა არის განთავსებული. ყველა მისამართი არის placeholder (`192.0.2.x`, `example.com`); ამ გვერდებზე არ არის საიდუმლო მონაცემები, გასაღებები ან ადმინისტრაციული ბმულები.

## სტატუსის აღნიშვნები

| ნიშანი | მნიშვნელობა |
|---|---|
| 🧪 **Lab (Task N)** | გაკეთდა ავტორის ლაბორატორიულ VM-ზე შესაბამისი Task-ის გვერდის მიხედვით. აქ ეწერია „Task N-ის მიხედვით“: ეს გვერდი VM-ს თავად არ ამოწმებს |
| 📘 **Documented example** | სახელმძღვანელო კონფიგურაცია, **არ არის განთავსებული** |
| 🗓️ **Planned** | დაგეგმილია, ჯერ არ გაკეთებულა |

## ზოგადი სქემა

```mermaid
flowchart TB
    U["მომხმარებელი"] --> FW["🧪 ufw: 22/80/443<br>(Task 7)"]
    FW --> NG["🧪 Nginx reverse proxy + self-signed TLS<br>(Task 16, 17)"]
    NG --> APP["🧪 Docker app<br>(Task 14, 15)"]
    APP --> DB["🧪 PostgreSQL<br>(Task 10)"]
    DEV["დეველოპერი"] -->|git| GIT["🧪 Git + deploy.sh<br>(Task 18, 19)"]
    GIT --> APP
    DB --> BK["🧪 pg_dump + tar.gz, cron<br>(Task 11, 12)"]
    BK --> DR["🧪 აღდგენის ტესტი<br>(Task 24)"]
    MON["🧪 htop/glances/Netdata (Task 20)<br>🗓️ Prometheus + Grafana"] -.-> APP
```

## გვერდები

| გვერდი | თემა |
|---|---|
| [არქიტექტურა](architecture.md) | კომპონენტები და ნაკადები |
| [Linux სერვერი](linux-server.md) | ბაზა, მომხმარებლები, განახლებები |
| [ქსელი](networking.md) | მისამართები, firewall |
| [უსაფრთხოება](security.md) | SSH, fail2ban, აუდიტი |
| [Docker ინფრასტრუქტურა](docker-infrastructure.md) | კონტეინერები |
| [Nginx](nginx.md) | web server, reverse proxy, TLS |
| [CI/CD](cicd.md) | deploy სკრიპტი, pipeline |
| [მონიტორინგი](monitoring.md) | რესურსები |
| [ლოგირება](logging.md) | ლოგები |
| [Backup და აღდგენა](backup-recovery.md) | ბექაპი |
| [Disaster Recovery](disaster-recovery.md) | ავარიის ტესტი |
