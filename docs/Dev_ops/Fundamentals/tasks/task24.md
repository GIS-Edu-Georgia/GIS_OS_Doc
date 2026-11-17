Task 24 — Disaster Recovery Test




Backup: მონაცემების დაარქივება (ძველ სერვერზე)ჩავთვალოთ, რომ გვაქვს სტანდარტული აპლიკაცია (მაგ. ვებ-საიტი), სადაც გვჭირდება ფაილები, კონფიგურაცია და მონაცემთა ბაზა.ა) კონფიგურაციების და ფაილების დაარქივებაგამოვიყენოთ tar ბრძანება, რომელიც შეკრავს /var/www/html (ფაილები) და /etc/nginx (კონფიგურაცია) ერთ არქივში:
```Bash
sudo tar -cvzf full_backup.tar.gz /var/www/html /etc/nginx /etc/systemd/system/myapp.service
```

ბ) მონაცემთა ბაზის ექსპორტი (MySQL/MariaDB)გამოვიყენოთ mysqldump, რათა ბაზა ერთ .sql ფაილში გადავიტანოთ:Bashsudo mysqldump -u root -p my_database_name > db_backup.sql
2. Transfer: მონაცემების გადატანა ახალ VM-ზეგამოვიყენოთ scp (Secure Copy), რათა ფაილები ძველი სერვერიდან ახალზე გადავგზავნოთ:Bashscp full_backup.tar.gz db_backup.sql username@NEW_SERVER_IP:/home/username/
3. Restore: აღდგენა (ახალ VM-ზე)ახლა გადავინაცვლოთ ახალ სერვერზე და დავიწყოთ "რეანიმაცია".ა) ფაილების აღდგენაგავშალოთ არქივი თავის ადგილებზე:Bashsudo tar -xvzf full_backup.tar.gz -C /
(შენიშვნა: -C / ნიშნავს, რომ ფაილები თავის ორიგინალ გზებზე (მაგ. /etc/nginx) დალაგდება).ბ) მონაცემთა ბაზის იმპორტიჯერ შევქმნათ ცარიელი ბაზა და შემდეგ ჩავასხათ მონაცემები:Bashmysql -u root -p -e "CREATE DATABASE my_database_name;"
mysql -u root -p my_database_name < db_backup.sql
გ) სერვისების გადატვირთვარადგან კონფიგურაციები შევცვალეთ, სისტემამ უნდა დაინახოს ისინი:Bashsudo systemctl daemon-reload
sudo systemctl restart nginx
sudo systemctl restart myapp.service

4. შემოწმება (Verification)აღდგენის შემდეგ უნდა დავრწმუნდეთ, რომ ყველაფერი მუშაობს:პორტები: ss -tunlp (ნახე, ჩაირთო თუ არა საჭირო პორტები).ლოგები: journalctl -u nginx (ნახე, ხომ არ აქვს შეცდომები).ვები: ბრაუზერში გახსენი ახალი VM-ის IP.შედეგის დოკუმენტირება:კომპონენტისტატუსიმეთოდიFiles✅ აღდგენილიაTar archiveConfigs✅ აღდგენილიაTar extraction to /etcDatabase✅ აღდგენილიაMySQL dump/importApp Status✅ RunningSystemctl check

```console
k@devserver:~$ sudo tar -cvzf full_backup.tar.gz /var/www/html /etc/nginx /etc/systemd/system/myapp.service
tar: Removing leading `/' from member names
/var/www/html/
/var/www/html/index.html
tar: Removing leading `/' from hard link targets
/var/www/html/index.nginx-debian.html
/etc/nginx/
/etc/nginx/modules-enabled/
/etc/nginx/uwsgi_params
/etc/nginx/mime.types
/etc/nginx/sites-enabled/
/etc/nginx/sites-enabled/docker-proxy
/etc/nginx/sites-available/
/etc/nginx/sites-available/default
/etc/nginx/sites-available/docker-proxy
/etc/nginx/snippets/
/etc/nginx/snippets/snakeoil.conf
/etc/nginx/snippets/fastcgi-php.conf
/etc/nginx/scgi_params
/etc/nginx/ssl/
/etc/nginx/ssl/server.crt
/etc/nginx/ssl/server.key
/etc/nginx/modules-available/
/etc/nginx/fastcgi_params
/etc/nginx/koi-utf
/etc/nginx/nginx.conf
/etc/nginx/koi-win
/etc/nginx/win-utf
/etc/nginx/fastcgi.conf
/etc/nginx/proxy_params
/etc/nginx/conf.d/
tar: /etc/systemd/system/myapp.service: Cannot stat: No such file or directory
tar: Exiting with failure status due to previous errors
```

PostgreSQL ბაზის Backup (ძველ სერვერზე)
Postgres-ში ვიყენებთ pg_dump ბრძანებას. ის ქმნის SQL ფაილს, რომელიც შეიცავს ბაზის აღდგენის ყველა ინსტრუქციას.

Bash
sudo -u postgres pg_dump database_name > db_backup.sql
-u postgres: ბრძანებას ვუშვებთ postgres მომხმარებლის სახელით.

database_name: ჩაწერე შენი ბაზის რეალური სახელი.

თუ გსურს ყველა ბაზის, როლების და კონფიგურაციის ერთდროულად დაარქივება:

```Bash
sudo -u postgres pg_dumpall > full_postgres_backup.sql
```
```console
k@devserver:~$ sudo -u postgres pg_dump kutaisi_db > db_backup.sql
```

```bash
sudo -u postgres pg_dumpall > full_postgres_backup.sql
```

1 VM იდან მეორეში გადატანა ბაზის და აღდგენა


scp ./db_backup.sql k@192.168.56.102:/home/k/


```console
k@devserver:~$ scp /home/ubuntu/db_backup.sql k@192.168.56.102:/home/k/
scp: stat local "/home/ubuntu/db_backup.sql": No such file or directory
k@devserver:~$ ^C
k@devserver:~$ find ~ -name "db_backup.sql" 2>/dev/null
/home/k/db_backup.sql
k@devserver:~$ scp ./db_backup.sql k@192.168.56.102:/home/k/
The authenticity of host '192.168.56.102 (192.168.56.102)' can't be established.
ED25519 key fingerprint is SHA256:eBJS0fVtN6LSkHIAMom2t3hxQ+SNE7Jqp8s3mGr44ds.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? Y
Please type 'yes', 'no' or the fingerprint: yes
Warning: Permanently added '192.168.56.102' (ED25519) to the list of known hosts.
k@192.168.56.102's password:
db_backup.sql  
```

ვნახოთ დირექტორია

k@devopsrecovery:~$ ls
db_backup.sql
k@devopsrecovery:~$ ls -lh /home/k/db_backup.sql
-rw-rw-r-- 1 k k 2.3K Feb 11 08:22 /home/k/db_backup.sql
k@devopsrecovery:~$ sudo -u postgres psql database_name < /home/k/db_backup.sql
SET
SET
SET
SET
SET
 set_config
------------

(1 row)

SET
SET
SET
SET
SET
SET
CREATE TABLE
ERROR:  role "kapo" does not exist
CREATE SEQUENCE
ERROR:  role "kapo" does not exist
ALTER SEQUENCE
ALTER TABLE
COPY 2
 setval
--------
      2
(1 row)

ALTER TABLE


შევქმნათ როლი
```bash
sudo -u postgres psql -c "CREATE ROLE kapo WITH LOGIN SUPERUSER PASSWORD 'შენი_პაროლი';"
```

შევამოწმოთ ცხრილები 
```bash
sudo -u postgres psql -d database_name -c "SELECT * FROM students;"
```

ახლა სერვერის
```bash
sudo tar -cvzf ~/app_files.tar.gz /var/www/html /etc/nginx
```

გადავუგზავნოთ 
scp ~/app_files.tar.gz k@192.168.56.102:/home/k/

```console
k@devserver:~$ sudo tar -cvzf ~/app_files.tar.gz /var/www/html /etc/nginx
[sudo] password for k:
tar: Removing leading `/' from member names
/var/www/html/
/var/www/html/index.html
tar: Removing leading `/' from hard link targets
/var/www/html/index.nginx-debian.html
/etc/nginx/
/etc/nginx/modules-enabled/
/etc/nginx/uwsgi_params
/etc/nginx/mime.types
/etc/nginx/sites-enabled/
/etc/nginx/sites-enabled/docker-proxy
/etc/nginx/sites-available/
/etc/nginx/sites-available/default
/etc/nginx/sites-available/docker-proxy
/etc/nginx/snippets/
/etc/nginx/snippets/snakeoil.conf
/etc/nginx/snippets/fastcgi-php.conf
/etc/nginx/scgi_params
/etc/nginx/ssl/
/etc/nginx/ssl/server.crt
/etc/nginx/ssl/server.key
/etc/nginx/modules-available/
/etc/nginx/fastcgi_params
/etc/nginx/koi-utf
/etc/nginx/nginx.conf
/etc/nginx/koi-win
/etc/nginx/win-utf
/etc/nginx/fastcgi.conf
/etc/nginx/proxy_params
/etc/nginx/conf.d/
k@devserver:~$ scp ~/app_files.tar.gz k@192.168.56.102:/home/k/
k@192.168.56.102's password:
app_files.tar.gz 
```

# nginx
```bash
sudo apt install nginx
```
```bash
sudo systemctl restart nginx
```