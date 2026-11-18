
Task 11 — Automated Backup Script

## სკრიპტი

სკრიპტის შექმნა პირდაპირ სერვერზე.
შექმნი ფაილს სახელწოდებით db_backup და .sh გაფართოებით home დირექტორიაში
```bash
nano ~/db_backup.sh
```

```bash
#!/bin/bash
# ============================================
# PostgreSQL Automated Backup Script
# Database: kutaisi_db
# ============================================

# --- Configuration ---
DB_NAME="kutaisi_db"
DB_USER="kapo"
BACKUP_DIR="/home/$USER/backups"
RETENTION_DAYS=7
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="${DB_NAME}_${DATE}"
LOG_FILE="${BACKUP_DIR}/backup.log"

# --- Colors ---
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "$1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $2" >> "$LOG_FILE"
}
```

```bash
# --- Create backup directory ---
mkdir -p "$BACKUP_DIR"

echo "=========================================="
echo " PostgreSQL Backup - ${DB_NAME}"
echo " $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="

# --- Step 1: Dump database ---
log "${YELLOW}[1/3]${NC} Database dump იქმნება..." "START: Dumping ${DB_NAME}"

pg_dump -U "$DB_USER" -h localhost "$DB_NAME" > "${BACKUP_DIR}/${BACKUP_FILE}.sql" 2>> "$LOG_FILE"

if [ $? -ne 0 ]; then
    log "${RED}[ERROR]${NC} Database dump ვერ შეიქმნა!" "FAILED: pg_dump error"
    exit 1
fi

log "${GREEN}[OK]${NC}    SQL dump მზადაა" "SUCCESS: SQL dump created"

# --- Step 2: Compress to tar.gz ---
log "${YELLOW}[2/3]${NC} tar.gz არქივი იქმნება..." "START: Compressing"

tar -czf "${BACKUP_DIR}/${BACKUP_FILE}.tar.gz" -C "$BACKUP_DIR" "${BACKUP_FILE}.sql" 2>> "$LOG_FILE"

if [ $? -ne 0 ]; then
    log "${RED}[ERROR]${NC} არქივის შექმნა ვერ მოხერხდა!" "FAILED: tar compression error"
    exit 1
fi

# Remove raw .sql file, keep only tar.gz
rm -f "${BACKUP_DIR}/${BACKUP_FILE}.sql"

FILESIZE=$(du -h "${BACKUP_DIR}/${BACKUP_FILE}.tar.gz" | cut -f1)
log "${GREEN}[OK]${NC}    არქივი მზადაა (${FILESIZE})" "SUCCESS: ${BACKUP_FILE}.tar.gz (${FILESIZE})"

# --- Step 3: Delete old backups ---
log "${YELLOW}[3/3]${NC} ძველი backup-ების წაშლა (${RETENTION_DAYS}+ დღე)..." "START: Cleanup"

DELETED=$(find "$BACKUP_DIR" -name "${DB_NAME}_*.tar.gz" -mtime +${RETENTION_DAYS} -print -delete | wc -l)

log "${GREEN}[OK]${NC}    ${DELETED} ძველი ფაილი წაიშალა" "SUCCESS: Deleted ${DELETED} old backups"

# --- Summary ---
echo ""
echo "=========================================="
echo -e " ${GREEN}BACKUP COMPLETE${NC}"
echo " ფაილი: ${BACKUP_DIR}/${BACKUP_FILE}.tar.gz"
echo " ზომა:  ${FILESIZE}"
echo "=========================================="

log "" "DONE: Backup completed successfully"
```

გაშვებადი რომ იყოს სკრიპტი:
```bash
chmod +x ~/db_backup.sh
```

## უსაფრთხოება

pgpass ფაილი:

```bash
nano ~/.pgpass
```

იწერება ბაზის მომხმარებლის პაროლით ამ ფაილში:

localhost:5432:kutaisi_db:kapo:your_secure_password

ეს ფაილის უფლებებს (permissions) აყენებს — მხოლოდ შენ (owner) შეგიძლია წაკითხვა და ჩაწერა, სხვა არავის.
```bash
chmod 600 ~/.pgpass
```
!!! info 
    600 ნიშნავს:
    6 (owner) → წაკითხვა + ჩაწერა <br>
    0 (group) → არაფერი <br>
    0 (others) → არაფერი <br>


PostgreSQL ამას მოითხოვს — თუ .pgpass ფაილს სხვებიც კითხულობენ, pg_dump უარს იტყვის მის გამოყენებაზე უსაფრთხოების მიზეზით. შემოწმება შეგიძლია:

```bash
ls -la ~/.pgpass
```

დაინახავ: -rw------- — ეს ნიშნავს რომ მხოლოდ owner-ს აქვს rw (read/write) უფლება.


## სკრიპტის გაშვება
```bash
~/db_backup.sh
```

```console
k@devserver:~$ nano ~/db_backup.sh
k@devserver:~$
k@devserver:~$ nano ~/db_backup.sh
k@devserver:~$ chmod +x ~/db_backup.sh
k@devserver:~$ nano ~/.pgpass
k@devserver:~$ chmod 600 ~/.pgpass
k@devserver:~$ ~/db_backup.sh
==========================================
 PostgreSQL Backup - kutaisi_db
 2026-02-10 17:57:56
==========================================
[1/3] Database dump იქმნება...
[OK]    SQL dump მზადაა
[2/3] tar.gz არქივი იქმნება...
[OK]    არქივი მზადაა (4.0K)
[3/3] ძველი backup-ების წაშლა (7+ დღე)...
[OK]    0 ძველი ფაილი წაიშალა

==========================================
 BACKUP COMPLETE
 ფაილი: /home/k/backups/kutaisi_db_2026-02-10_17-57-56.tar.gz
 ზომა:  4.0K
==========================================
```

---

## განახლებული ვერსია: მარტივი სკრიპტი `app_db`-ისთვის
Task 10-ის ახალ ბაზას (`app_db`, `appuser`) შესაბამისი უფრო მოკლე სკრიპტი. ზემოთ ბევრი ფერი და ლოგი იყო, აქ მხოლოდ საჭირო ნაწილია. <br>

### დიაგრამა: backup-ის გზა ბაზიდან არქივამდე
```mermaid
flowchart TD
    K["🔑 ~/.pgpass<br/>პაროლი (chmod 600)"] -.->|"ავტორიზაცია<br/>პაროლის მოთხოვნის გარეშე"| P
    P["🗄️ PostgreSQL<br/>app_db"] -->|"pg_dump -w"| Q["📄 app_db_TIMESTAMP.sql<br/>დროებითი ფაილი"]
    Q -->|"tar -czf"| T["📦 app_db_TIMESTAMP.tar.gz"]
    Q -->|"rm"| Z["🗑️ .sql იშლება"]
    T --> B["📁 ~/backups/<br/>chmod 700: მხოლოდ შენ"]
```
**როგორ წავიკითხოთ:** `pg_dump` ბაზას ტექსტურ SQL ფაილად გარდაქმნის, `tar` კი მას ჩაკუმშავს. `.sql` ფაილი მხოლოდ შუალედური ნაბიჯია, ამიტომ მას ვშლით და რჩება მხოლოდ `.tar.gz`. პაროლი სკრიპტში არ წერია: `pg_dump` მას `~/.pgpass`-იდან იღებს (წყვეტილი ისარი), ამიტომ სკრიპტი პაროლის თხოვნაზე არ გაჩერდება და cron-იდანაც იმუშავებს. `TIMESTAMP` ფაილის სახელში ახალ backup-ს ძველის გადაწერისგან იცავს. <br>

### 1. პაროლი `~/.pgpass`-ში
```bash
nano ~/.pgpass
```
ფორმატი `ჰოსტი:პორტი:ბაზა:იუზერი:პაროლი`, ერთი ხაზი, ინტერვალების გარეშე: <br>
```text
localhost:5432:app_db:appuser:შენი_პაროლი
```
```bash
chmod 600 ~/.pgpass
```

### 2. სკრიპტი
```bash
mkdir -p ~/scripts
```
```bash
nano ~/scripts/backup-db.sh
```
```bash
#!/usr/bin/env bash
# backup-db.sh — PostgreSQL ბაზის backup tar.gz ფორმატში, timestamp-ით
set -euo pipefail

DB_NAME="app_db"
DB_USER="appuser"
DB_HOST="localhost"
BACKUP_DIR="$HOME/backups"
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
DUMP_FILE="${DB_NAME}_${TIMESTAMP}.sql"
ARCHIVE="${DB_NAME}_${TIMESTAMP}.tar.gz"

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

# 1. ბაზის ექსპორტი SQL ფაილში (-w: პაროლს არ ითხოვს, იღებს ~/.pgpass-იდან)
pg_dump -w -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -f "$BACKUP_DIR/$DUMP_FILE"

# 2. ჩაკუმშვა tar.gz-ში
tar -czf "$BACKUP_DIR/$ARCHIVE" -C "$BACKUP_DIR" "$DUMP_FILE"

# 3. დროებითი .sql ფაილის წაშლა
rm "$BACKUP_DIR/$DUMP_FILE"

echo "Backup შეიქმნა: $BACKUP_DIR/$ARCHIVE"
```
```bash
chmod +x ~/scripts/backup-db.sh
```

| ნაწილი | რისთვის არის |
|--------|--------------|
| `set -euo pipefail` | სკრიპტი პირველივე ერორზე ჩერდება და არ გრძელდება ნახევრად გატეხილი მდგომარეობით |
| `pg_dump -w` | ბაზას SQL ფაილად ექსპორტს უკეთებს, პაროლს არ ითხოვს (cron-ში ვერავინ ჩაწერდა) |
| `tar -czf` | SQL ფაილს ჩაკუმშავს `.tar.gz`-ში |
| `rm` | დროებით `.sql` ფაილს შლის, რჩება მხოლოდ არქივი |
| `$TIMESTAMP` | ფაილის სახელში თარიღი და დრო, რომ ახალი backup ძველს არ გადააწეროს |
| `chmod 700` | backup-ებს მხოლოდ შენ კითხულობ |

### 3. გაშვება და შედეგი
```bash
~/scripts/backup-db.sh
```
```console
Backup შეიქმნა: /home/k/backups/app_db_2026-11-10_08-57-52.tar.gz
Backup შეიქმნა: /home/k/backups/app_db_2026-11-10_08-58-03.tar.gz
```
(ორჯერ გაშვების შედეგი. სახელები განსხვავებულია timestamp-ის გამო.) <br>
```bash
ls -lh ~/backups/
```
```console
total 8.0K
-rw-rw-r-- 1 k k 1.1K Nov 10 08:57 app_db_2026-11-10_08-57-52.tar.gz
-rw-rw-r-- 1 k k 1.1K Nov 10 08:58 app_db_2026-11-10_08-58-03.tar.gz
```

### 4. შიგთავსის შემოწმება
არქივის გახსნის გარეშე ვაჩვენებთ SQL-ში `users` ცხრილის აღწერას: <br>
```bash
tar -xzOf "$(ls -t ~/backups/*.tar.gz | head -1)" | grep -A6 "CREATE TABLE public.users"
```
```console
CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);
```
ცხრილის სტრუქტურა backup-შია, ანუ არქივი რეალურად შეიცავს ბაზას. <br>

### შეცდომა: `fe_sendauth: no password supplied`
```console
pg_dump: error: connection to server at "localhost" (127.0.0.1), port 5432 failed: fe_sendauth: no password supplied
```
ეს ნიშნავს, რომ `pg_dump`-მა `~/.pgpass`-იდან პაროლი ვერ აიღო. ჩვეულებრივი მიზეზებია: <br>
- ფაილი ცარიელია ან ხაზი არ ემთხვევა: ბაზის (`app_db`) და იუზერის (`appuser`) სახელები ზუსტად იგივე უნდა იყოს, რაც სკრიპტშია
- ფორმატში ზედმეტი ინტერვალი ან გადატანილი ხაზია
- ფაილს `chmod 600` არ აქვს

გამოსწორების შემდეგ (`nano ~/.pgpass`, `chmod 600 ~/.pgpass`) სკრიპტი ჩვეულებრივად გაეშვა.

