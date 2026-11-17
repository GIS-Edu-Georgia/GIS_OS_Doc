# CI/CD

!!! warning "შენიშვნა"
    ლაბორატორიის აღწერა. იხ. [მთავარი](index.md).

| პრაქტიკა | სტატუსი | წყარო |
|---|---|---|
| Git რეპოზიტორია, deploy key | 🧪 Lab (Task 18) | [Task 18](../tasks/task18.md) |
| `deploy.sh` (flock, ff-only pull, health check) | 🧪 Lab (Task 19) | [Task 19](../tasks/task19.md) |
| GitHub Actions workflow | 📘 Documented example | [Task 27](../tasks/task27.md) |

```mermaid
flowchart LR
    G["git push"] --> D["deploy.sh"] --> P["git pull --ff-only"] --> U["compose up -d"] --> H["health check"]
```

**რატომ `flock` და `ff-only`:** `flock` ერთდროულ deploy-ს ბლოკავს; `--ff-only` არ ქმნის მოულოდნელ merge-ს სერვერზე.
