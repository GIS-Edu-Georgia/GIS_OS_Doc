Task 10 — Database Installation


## PostgreSQL
მე არჩევანი გავაკეთე PostgreSQL - ზე

ინსტალაციამდე რეპოზიტორების განახლება სასურველია
```bash
sudo apt update
```
```bash
sudo apt install postgresql postgresql-contrib -y
```

```console
k@devserver:~$ sudo apt install postgresql postgresql-contrib -y
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following additional packages will be installed:
  libcommon-sense-perl libjson-perl libjson-xs-perl libllvm17t64 libpq5 libtypes-serialiser-perl postgresql-16 postgresql-client-16 postgresql-client-common postgresql-common ssl-cert
Suggested packages:
  postgresql-doc postgresql-doc-16
The following NEW packages will be installed:
  libcommon-sense-perl libjson-perl libjson-xs-perl libllvm17t64 libpq5 libtypes-serialiser-perl postgresql postgresql-16 postgresql-client-16 postgresql-client-common postgresql-common
  postgresql-contrib ssl-cert
0 upgraded, 13 newly installed, 0 to remove and 2 not upgraded.
Need to get 43.6 MB of archives.
After this operation, 175 MB of additional disk space will be used.
Get:1 http://ge.archive.ubuntu.com/ubuntu noble/main amd64 libjson-perl all 4.10000-1 [81.9 kB]
Get:2 http://ge.archive.ubuntu.com/ubuntu noble-updates/main amd64 postgresql-client-common all 257build1.1 [36.4 kB]
Get:3 http://ge.archive.ubuntu.com/ubuntu noble/main amd64 ssl-cert all 1.1.2ubuntu1 [17.8 kB]
Get:4 http://ge.archive.ubuntu.com/ubuntu noble-updates/main amd64 postgresql-common all 257build1.1 [161 kB]
Get:5 http://ge.archive.ubuntu.com/ubuntu noble/main amd64 libcommon-sense-perl amd64 3.75-3build3 [20.4 kB]
Get:6 http://ge.archive.ubuntu.com/ubuntu noble/main amd64 libtypes-serialiser-perl all 1.01-1 [11.6 kB]
Get:7 http://ge.archive.ubuntu.com/ubuntu noble-updates/main amd64 libjson-xs-perl amd64 4.040-0ubuntu0.24.04.1 [83.7 kB]
Get:8 http://ge.archive.ubuntu.com/ubuntu noble/main amd64 libllvm17t64 amd64 1:17.0.6-9ubuntu1 [26.2 MB]
Get:9 http://ge.archive.ubuntu.com/ubuntu noble-updates/main amd64 libpq5 amd64 16.11-0ubuntu0.24.04.1 [145 kB]
Get:10 http://ge.archive.ubuntu.com/ubuntu noble-updates/main amd64 postgresql-client-16 amd64 16.11-0ubuntu0.24.04.1 [1,297 kB]
Get:11 http://ge.archive.ubuntu.com/ubuntu noble-updates/main amd64 postgresql-16 amd64 16.11-0ubuntu0.24.04.1 [15.6 MB]
Get:12 http://ge.archive.ubuntu.com/ubuntu noble-updates/main amd64 postgresql all 16+257build1.1 [11.6 kB]
Get:13 http://ge.archive.ubuntu.com/ubuntu noble-updates/main amd64 postgresql-contrib all 16+257build1.1 [11.6 kB]
Fetched 43.6 MB in 7s (6,701 kB/s)
Preconfiguring packages ...
Selecting previously unselected package libjson-perl.
(Reading database ... 87605 files and directories currently installed.)
Preparing to unpack .../00-libjson-perl_4.10000-1_all.deb ...
Unpacking libjson-perl (4.10000-1) ...
Selecting previously unselected package postgresql-client-common.
Preparing to unpack .../01-postgresql-client-common_257build1.1_all.deb ...
Unpacking postgresql-client-common (257build1.1) ...
Selecting previously unselected package ssl-cert.
Preparing to unpack .../02-ssl-cert_1.1.2ubuntu1_all.deb ...
Unpacking ssl-cert (1.1.2ubuntu1) ...
Selecting previously unselected package postgresql-common.
Preparing to unpack .../03-postgresql-common_257build1.1_all.deb ...
Adding 'diversion of /usr/bin/pg_config to /usr/bin/pg_config.libpq-dev by postgresql-common'
Unpacking postgresql-common (257build1.1) ...
Selecting previously unselected package libcommon-sense-perl:amd64.
Preparing to unpack .../04-libcommon-sense-perl_3.75-3build3_amd64.deb ...
Unpacking libcommon-sense-perl:amd64 (3.75-3build3) ...
Selecting previously unselected package libtypes-serialiser-perl.
Preparing to unpack .../05-libtypes-serialiser-perl_1.01-1_all.deb ...
Unpacking libtypes-serialiser-perl (1.01-1) ...
Selecting previously unselected package libjson-xs-perl.
Preparing to unpack .../06-libjson-xs-perl_4.040-0ubuntu0.24.04.1_amd64.deb ...
Unpacking libjson-xs-perl (4.040-0ubuntu0.24.04.1) ...
Selecting previously unselected package libllvm17t64:amd64.
Preparing to unpack .../07-libllvm17t64_1%3a17.0.6-9ubuntu1_amd64.deb ...
Unpacking libllvm17t64:amd64 (1:17.0.6-9ubuntu1) ...
Selecting previously unselected package libpq5:amd64.
Preparing to unpack .../08-libpq5_16.11-0ubuntu0.24.04.1_amd64.deb ...
Unpacking libpq5:amd64 (16.11-0ubuntu0.24.04.1) ...
Selecting previously unselected package postgresql-client-16.
Preparing to unpack .../09-postgresql-client-16_16.11-0ubuntu0.24.04.1_amd64.deb ...
Unpacking postgresql-client-16 (16.11-0ubuntu0.24.04.1) ...
Selecting previously unselected package postgresql-16.
Preparing to unpack .../10-postgresql-16_16.11-0ubuntu0.24.04.1_amd64.deb ...
Unpacking postgresql-16 (16.11-0ubuntu0.24.04.1) ...
Selecting previously unselected package postgresql.
Preparing to unpack .../11-postgresql_16+257build1.1_all.deb ...
Unpacking postgresql (16+257build1.1) ...
Selecting previously unselected package postgresql-contrib.
Preparing to unpack .../12-postgresql-contrib_16+257build1.1_all.deb ...
Unpacking postgresql-contrib (16+257build1.1) ...
Setting up postgresql-client-common (257build1.1) ...
Setting up libpq5:amd64 (16.11-0ubuntu0.24.04.1) ...
Setting up libcommon-sense-perl:amd64 (3.75-3build3) ...
Setting up libllvm17t64:amd64 (1:17.0.6-9ubuntu1) ...
Setting up ssl-cert (1.1.2ubuntu1) ...
Created symlink /etc/systemd/system/multi-user.target.wants/ssl-cert.service → /usr/lib/systemd/system/ssl-cert.service.
Setting up libtypes-serialiser-perl (1.01-1) ...
Setting up libjson-perl (4.10000-1) ...
Setting up libjson-xs-perl (4.040-0ubuntu0.24.04.1) ...
Setting up postgresql-client-16 (16.11-0ubuntu0.24.04.1) ...
update-alternatives: using /usr/share/postgresql/16/man/man1/psql.1.gz to provide /usr/share/man/man1/psql.1.gz (psql.1.gz) in auto mode
Setting up postgresql-common (257build1.1) ...

Creating config file /etc/postgresql-common/createcluster.conf with new version
Building PostgreSQL dictionaries from installed myspell/hunspell packages...
Removing obsolete dictionary files:
Created symlink /etc/systemd/system/multi-user.target.wants/postgresql.service → /usr/lib/systemd/system/postgresql.service.
Setting up postgresql-16 (16.11-0ubuntu0.24.04.1) ...
Creating new PostgreSQL cluster 16/main ...
/usr/lib/postgresql/16/bin/initdb -D /var/lib/postgresql/16/main --auth-local peer --auth-host scram-sha-256 --no-instructions
The files belonging to this database system will be owned by user "postgres".
This user must also own the server process.

The database cluster will be initialized with locale "en_US.UTF-8".
The default database encoding has accordingly been set to "UTF8".
The default text search configuration will be set to "english".

Data page checksums are disabled.

fixing permissions on existing directory /var/lib/postgresql/16/main ... ok
creating subdirectories ... ok
selecting dynamic shared memory implementation ... posix
selecting default max_connections ... 100
selecting default shared_buffers ... 128MB
selecting default time zone ... Etc/UTC
creating configuration files ... ok
running bootstrap script ... ok
performing post-bootstrap initialization ... ok
syncing data to disk ... ok
Setting up postgresql-contrib (16+257build1.1) ...
Setting up postgresql (16+257build1.1) ...
Processing triggers for man-db (2.12.0-4build2) ...
Processing triggers for libc-bin (2.39-0ubuntu8.7) ...
Scanning processes...
Scanning candidates...
Scanning linux images...

Running kernel seems to be up-to-date.

Restarting services...

Service restarts being deferred:
 /etc/needrestart/restart.d/dbus.service
 systemctl restart getty@tty1.service
 systemctl restart systemd-logind.service
 systemctl restart unattended-upgrades.service

No containers need to be restarted.

User sessions running outdated binaries:
 k @ session #4: sshd[1039]
 k @ user manager service: systemd[1006]

No VM guests are running outdated hypervisor (qemu) binaries on this host.
```

## სერვისის შემოწმება

```bash
sudo systemctl status postgresql
```
```console
k@devserver:~$ sudo systemctl status postgresql
● postgresql.service - PostgreSQL RDBMS
     Loaded: loaded (/usr/lib/systemd/system/postgresql.service; enabled; preset: enabled)
     Active: active (exited) since Tue 2026-02-10 17:32:12 UTC; 1min 38s ago
   Main PID: 41008 (code=exited, status=0/SUCCESS)
        CPU: 14ms

Feb 10 17:32:12 devserver systemd[1]: Starting postgresql.service - PostgreSQL RDBMS...
Feb 10 17:32:12 devserver systemd[1]: Finished postgresql.service - PostgreSQL RDBMS.
```


## Database-ისა და User-ის შექმნა

```bash
sudo -u postgres psql
```

```console
psql (16.11 (Ubuntu 16.11-0ubuntu0.24.04.1))
Type "help" for help.
```

## ბაზის და მომხმარებლის შექმნა
ბაზის სახელი, მომხმარებელი და პაროლი არის შაბლონური, 
შეცვლა შესაძლებელია.
```sql
postgres=# CREATE USER kapo WITH PASSWORD 'შენი_პაროლი'; CREATE DATABASE kutaisi_db OWNER kapo; GRANT ALL PRIVILEGES ON DATABASE kutaisi_db TO kapo; \q
CREATE ROLE
CREATE DATABASE
GRANT
```

```bash
psql -U kapo -d kutaisi_db -h localhost
```

```console
Password for user kapo:
psql (16.11 (Ubuntu 16.11-0ubuntu0.24.04.1))
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off)
Type "help" for help.
```
```sql
kutaisi_db=>
```

## კონფიგურაცია
კონფიგურაციის შეცვლის სურვილი თუ გექნება, წვდომის და უსაფრთხოების გამო
```bash
sudo nano /etc/postgresql/$(ls /etc/postgresql/)/main/pg_hba.conf
```

!!! tip
    ++ctrl+x++ დაგეხმარება გახსნილი ფაილის დახურვაში <br>
    ++ctrl+y++ დაგეხმარება დასტურში ფაილის სახელზე <br>
    ++enter++ უბრალოდ თანხმობა და ფაილი დაიხურება <br>

!!! hint "შეიძლება გამოგადგეს"
    \dt — ცხრილების სიის ნახვა, \q — გასასვლელად.

```bash
sudo systemctl restart postgresql
```

თავიდან დაკავშირება ბაზაზე:
```sql
psql -U kapo -d kutaisi_db -h localhost
```
```sql
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO students (name, email) VALUES 
('ნიკა გელაშვილი', 'nika@example.com'),
('მარიამ ჩხეიძე', 'mariam@example.com');

SELECT * FROM students;
```

## **შედეგის გადამოწმება:**
```sql
 id |       name        |       email        |      enrolled_at
----+-------------------+--------------------+------------------------
  1 | ნიკა გელაშვილი     | nika@example.com   | 2026-02-10 ...
  2 | მარიამ ჩხეიძე      | mariam@example.com | 2026-02-10 ...
```

```sql
kutaisi_db-> \dt
         List of relations
 Schema |   Name   | Type  | Owner
--------+----------+-------+-------
 public | students | table | kapo
(1 row)
```

---

## განახლებული ვერსია: `appuser` და `app_db`
იგივე პროცესი ახალი სახელებით. ეს სახელები Task 15-ის docker-compose-შიც გამოიყენება (`POSTGRES_USER: appuser`, `POSTGRES_DB: app_db`), ამიტომ ორივე ამოცანა ერთმანეთს ემთხვევა. <br>

### 1. ბაზისა და იუზერის შექმნა
```bash
sudo -u postgres psql
```
```sql
CREATE USER appuser WITH PASSWORD 'შენი_პაროლი';
CREATE DATABASE app_db OWNER appuser;
GRANT ALL PRIVILEGES ON DATABASE app_db TO appuser;
\q
```

!!! warning
    პაროლად აირჩიე რთული და უნიკალური. მარტივი პაროლები (მაგალითად `0000`) მხოლოდ სასწავლო VM-ში გამოდგება და რეალურ სერვერზე არასოდეს.

### 2. კავშირი ახალი იუზერით
```bash
psql -h localhost -U appuser -d app_db
```

### 3. ცხრილის შექმნა და მონაცემები
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (name, email) VALUES
    ('Giorgi', 'giorgi@example.com'),
    ('Nino', 'nino@example.com');

SELECT * FROM users;
```
```console
app_db=> SELECT * FROM users;
 id |  name  |       email        |         created_at
----+--------+--------------------+----------------------------
  1 | Giorgi | giorgi@example.com | 2026-11-10 08:41:09.443436
  2 | Nino   | nino@example.com   | 2026-11-10 08:41:09.443436
(2 rows)
```
- `SERIAL PRIMARY KEY` — id ავტომატურად იზრდება და ჩანაწერს უნიკალურად განსაზღვრავს
- `UNIQUE NOT NULL` — ერთი email ორჯერ ვერ დაემატება
- `DEFAULT NOW()` — დრო ავტომატურად ჩაიწერება

### 4. იუზერების შემოწმება
```sql
\du
```
```console
app_db=> \du
                             List of roles
 Role name |                         Attributes
-----------+------------------------------------------------------------
 appuser   |
 postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS
```
`appuser`-ს ატრიბუტები არ აქვს, ანუ ჩვეულებრივი იუზერია და სუპერუზერის უფლებები არ გააჩნია. ეს სწორია უსაფრთხოების თვალსაზრისით. <br>

### უსაფრთხოება
- PostgreSQL ნაგულისხმევად მხოლოდ `localhost`-ზე უსმენს, ამიტომ firewall-ზე 5432-ს არ ვხსნით (Task 7). გარედან ბაზა მიუწვდომელია.
- აპლიკაციისთვის ცალკე იუზერი (`appuser`) გამოიყენე და არა `postgres` სუპერუზერი.

!!! hint "სასარგებლო ბრძანებები psql-ში"
    `\dt` — ცხრილები, `\l` — ბაზები, `\du` — იუზერები, `\q` — გასვლა.

