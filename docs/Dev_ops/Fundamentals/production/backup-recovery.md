# Backup და აღდგენა

!!! warning "შენიშვნა"
    ლაბორატორიის აღწერა. იხ. [მთავარი](index.md).

| პრაქტიკა | სტატუსი | წყარო |
|---|---|---|
| `pg_dump` backup სკრიპტი, 7 დღიანი retention, `tar.gz` | 🧪 Lab (Task 11) | [Task 11](../tasks/task11.md) |
| cron-ით ავტომატიზაცია | 🧪 Lab (Task 12) | [Task 12](../tasks/task12.md) |
| არქივის დაშიფვრა, გარე ასლი | 📘 Documented example | [Cheat Sheet](../linux/cheatsheet.md) |

```mermaid
flowchart LR
    C["cron"] --> S["backup.sh"] --> D["pg_dump"] --> T["tar.gz"] --> R["retention 7 დღე"]
```

**პრინციპი:** backup მხოლოდ მაშინ ითვლება სრულად, როცა აღდგენა გატესტილია (იხ. [Disaster Recovery](disaster-recovery.md)).
