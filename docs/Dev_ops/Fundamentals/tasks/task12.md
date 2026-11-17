Task 12 — Cron Automation


## Crontab

გავხსნათ
```bash
crontab -e
```

და ფაილის ბოლოში დასამატებელია ეს ხაზი:**
```
0 3 * * * /home/$USER/db_backup.sh >> /home/$USER/backups/cron.log 2>&1
```
## განმარტება

**3 ნიშნავს `0 3 * * *`:**
```
0 3 * * *
│ │ │ │ │
│ │ │ │ └── კვირის დღე (ნებისმიერი)
│ │ │ └──── თვე (ნებისმიერი)
│ │ └────── დღე (ნებისმიერი)
│ └──────── საათი → 3:00 AM
└────────── წუთი → 00

გაშვებისას რომელიმე ტექსტურ რედაქტორზე შეაჩერებ არჩევანს
k@devserver:~$ crontab -e
no crontab for k - using an empty one

Select an editor.  To change later, run 'select-editor'.
  1. /bin/nano        <---- easiest
  2. /usr/bin/vim.basic
  3. /usr/bin/vim.tiny
  4. /bin/ed

Choose 1-4 [1]: 1
crontab: installing new crontab
```
## შემოწმება

```bash
crontab -l
```
```console
# Edit this file to introduce tasks to be run by cron.
#
# Each task to run has to be defined through a single line
# indicating with different fields when the task will be run
# and what command to run for the task
#
# To define the time you can provide concrete values for
# minute (m), hour (h), day of month (dom), month (mon),
# and day of week (dow) or use '*' in these fields (for 'any').
#
# Notice that tasks will be started based on the cron's system
# daemon's notion of time and timezones.
#
# Output of the crontab jobs (including errors) is sent through
# email to the user the crontab file belongs to (unless redirected).
#
# For example, you can run a backup of all your user accounts
# at 5 a.m every week with:
# 0 5 * * 1 tar -zcf /var/backups/home.tgz /home/
#
# For more information see the manual pages of crontab(5) and cron(8)
#
# m h  dom mon dow   command

0 3 * * * /home/$USER/db_backup.sh >> /home/$USER/backups/cron.log 2>&1
```

## სტატუსის შემოწმება
```bash
sudo systemctl status cron
```

```console
[sudo] password for k:
● cron.service - Regular background program processing daemon
     Loaded: loaded (/usr/lib/systemd/system/cron.service; enabled; preset: enabled)
     Active: active (running) since Tue 2026-02-10 15:21:14 UTC; 2h 53min ago
       Docs: man:cron(8)
   Main PID: 965 (cron)
      Tasks: 1 (limit: 9436)
     Memory: 456.0K (peak: 2.2M)
        CPU: 712ms
     CGroup: /system.slice/cron.service
             └─965 /usr/sbin/cron -f -P

Feb 10 17:35:01 devserver CRON[42903]: pam_unix(cron:session): session closed for user root
Feb 10 17:45:01 devserver CRON[46291]: pam_unix(cron:session): session opened for user root(uid=0) by root(uid=0)
Feb 10 17:45:01 devserver CRON[46292]: (root) CMD (command -v debian-sa1 > /dev/null && debian-sa1 1 1)
Feb 10 17:45:01 devserver CRON[46291]: pam_unix(cron:session): session closed for user root
Feb 10 17:55:01 devserver CRON[49630]: pam_unix(cron:session): session opened for user root(uid=0) by root(uid=0)
Feb 10 17:55:01 devserver CRON[49631]: (root) CMD (command -v debian-sa1 > /dev/null && debian-sa1 1 1)
Feb 10 17:55:01 devserver CRON[49630]: pam_unix(cron:session): session closed for user root
Feb 10 18:05:01 devserver CRON[52978]: pam_unix(cron:session): session opened for user root(uid=0) by root(uid=0)
Feb 10 18:05:01 devserver CRON[52979]: (root) CMD (command -v debian-sa1 > /dev/null && debian-sa1 1 1)
Feb 10 18:05:01 devserver CRON[52978]: pam_unix(cron:session): session closed for user root
```


## ტესტირება

```Bash
~/db_backup.sh
cat ~/backups/cron.log
```

!!! quote "log ფაილი"
    cron.log მხოლოდ მაშინ შეიქმნება, როცა cron გაუშვებს სკრიპტს (3:00 AM-ზე). ხელით გაშვებისას ლოგი ტერმინალში გამოჩნდა პირდაპირ

---

## განახლებული ვერსია: `backup-db.sh` (Task 11-ის ახალი სკრიპტი)
Task 11-ში სკრიპტი `~/scripts/backup-db.sh`-ზე გადავიტანეთ, ამიტომ cron-ის ხაზიც მასზე უნდა მიუთითებდეს. <br>

### დიაგრამა: ვინ რას აკეთებს
```mermaid
flowchart TD
    TZ["🕐 დროის სარტყელი<br/>UTC → Asia/Tbilisi"] -.->|"განსაზღვრავს,<br/>რომელი 03:00"| CR
    CR["⏰ cron daemon"] -->|"0 3 * * *"| SC["📜 backup-db.sh"]
    SC --> BK["📦 ~/backups/<br/>app_db_...tar.gz"]
    SC -->|">> cron.log 2>&1"| LG["📝 cron.log<br/>გამოტანა და შეცდომები"]
```
**როგორ წავიკითხოთ:** cron უბრალოდ „საათია“: ის დროს ადარებს crontab-ის ხაზს და როცა `0 3 * * *` დაემთხვევა, სკრიპტს უშვებს. მთავარი სამუშაო სკრიპტს აკეთებს (Task 11) და cron მას მხოლოდ დროზე იძახებს. `>> cron.log 2>&1` სკრიპტის გამოტანასაც და შეცდომებსაც ფაილში წერს, რადგან cron-ში ეკრანი არ არსებობს და სხვაგვარად შეცდომა უჩინარი დარჩებოდა. წყვეტილი ისარი სარტყელს აჩვენებს: ის ცვლის, **რომელი** 03:00 იქნება. UTC-ში ეს თბილისის 07:00-ია, `Asia/Tbilisi`-ზე კი ნამდვილი 03:00. <br>

### 1. დროის სარტყელი
cron სერვერის დროით მუშაობს. VM-ში ნაგულისხმევი `UTC`-ია, თბილისში კი +4 საათია, ამიტომ `0 3 * * *` UTC-ში თბილისის 07:00 იქნებოდა. სარტყლის შეცვლა: <br>
```bash
timedatectl | grep "Time zone"
```
```console
                Time zone: Etc/UTC (UTC, +0000)
```
```bash
sudo timedatectl set-timezone Asia/Tbilisi
```
```bash
sudo systemctl restart cron
```
ახლა `0 3 * * *` თბილისის დროით 03:00-ია. <br>

### 2. cron-ის შემოწმება
```bash
systemctl is-active cron
```
```console
active
```

### 3. Job-ის დამატება
```bash
crontab -e
```
ფაილის ბოლოს (თითო ხაზი, სხვა ტექსტის გარეშე): <br>
```text
0 3 * * * /home/k/scripts/backup-db.sh >> /home/k/backups/cron.log 2>&1
```
- `/home/k/...` სრული გზაა. `~` და `$HOME` cron-ის ხაზში არ გამოვიყენეთ, რადგან გარემო მცირეა და სრული გზა უსაფრთხოა
- `>> cron.log 2>&1` ჩაწერს სკრიპტის გამოტანასაც და შეცდომებსაც ფაილში

### 4. შედეგი
```bash
crontab -l | cat -n
```
```console
    22  # m h  dom mon dow   command
    23  0 3 * * * /home/k/scripts/backup-db.sh >> /home/k/backups/cron.log 2>&1
```
ხაზი `crontab -l`-ში ჩანს, ანუ job დაინსტალირებულია და backup ავტომატურად შეიქმნება ყოველ დღე 03:00-ზე. <br>

### შეცდომა: `bad minute`
```console
"/tmp/crontab.q1zShK/crontab":23: bad minute
errors in crontab file, can't install.
Do you want to retry the same edit? (y/n)
```
ეს ნიშნავს, რომ მითითებული ხაზი (აქ 23-ე) cron-ს არ ესმის. ჩვეულებრივი მიზეზები: <br>
- ხაზში ზედმეტი ტექსტი მოხვდა კოპირებისას (მაგალითად \`\`\`, სიტყვა `text`, ახსნა)
- ხაზის დასაწყისში ზედმეტი სიმბოლო ან ინტერვალებია
- ხაზი გადატეხილია რამდენიმე ხაზად

გამოსწორება: ჩაწერე `y`, წაშალე პრობლემური ხაზი, ჩაწერე სუფთა ერთი ხაზი `0 3 * * * ...` ფორმატით და შეინახე. წარმატებისას `crontab -l` ხაზს აჩვენებს. <br>

!!! info "ტესტი"
    cron.log და ახალი backup მხოლოდ მაშინ გაჩნდება, როცა cron პირველად გაუშვებს სკრიპტს (03:00-ზე). სკრიპტი ხელითაც გამართულად მუშაობს (Task 11), ხოლო `crontab -l`-ში ხაზის არსებობა ამტკიცებს, რომ დაგეგმარება გააქტიურებულია.

