Task 5 — System Update

## რეპოების განახლება
```bash
k@devserver:~$ sudo apt update
```
```console
[sudo] password for k:
Hit:1 http://ge.archive.ubuntu.com/ubuntu noble InRelease
Get:2 http://ge.archive.ubuntu.com/ubuntu noble-updates InRelease [126 kB]
Get:3 http://security.ubuntu.com/ubuntu noble-security InRelease [126 kB]
Get:4 http://ge.archive.ubuntu.com/ubuntu noble-backports InRelease [126 kB]
Get:5 http://security.ubuntu.com/ubuntu noble-security/main amd64 Components [21.5 kB]
Get:6 http://security.ubuntu.com/ubuntu noble-security/restricted amd64 Components [212 B]
Get:7 http://security.ubuntu.com/ubuntu noble-security/universe amd64 Components [74.2 kB]
Get:8 http://security.ubuntu.com/ubuntu noble-security/multiverse amd64 Components [208 B]
Get:9 http://ge.archive.ubuntu.com/ubuntu noble-updates/main amd64 Packages [1,740 kB]
Get:10 http://ge.archive.ubuntu.com/ubuntu noble-updates/main amd64 Components [175 kB]
Get:11 http://ge.archive.ubuntu.com/ubuntu noble-updates/restricted amd64 Components [212 B]
Get:12 http://ge.archive.ubuntu.com/ubuntu noble-updates/universe amd64 Components [386 kB]
Get:13 http://ge.archive.ubuntu.com/ubuntu noble-updates/multiverse amd64 Components [940 B]
Get:14 http://ge.archive.ubuntu.com/ubuntu noble-backports/main amd64 Components [7,300 B]
Get:15 http://ge.archive.ubuntu.com/ubuntu noble-backports/restricted amd64 Components [212 B]
Get:16 http://ge.archive.ubuntu.com/ubuntu noble-backports/universe amd64 Components [10.5 kB]
Get:17 http://ge.archive.ubuntu.com/ubuntu noble-backports/multiverse amd64 Components [212 B]
Fetched 2,795 kB in 4s (758 kB/s)
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
70 packages can be upgraded. Run 'apt list --upgradable' to see them.
k@devserver:~$
```

## სისტემის განახლება
```bash
sudo apt upgrade -y
```
თუ ფანჯარა სერვისის გადატვირთვას ითხოვს, დატოვე ნაგულისხმევი არჩევანი და დააჭირე Enter. <br>

## რეპოზიტორების განახლება: 

```bash
sudo apt update
```
## ინსტალაციები

ყველა პაკეტის ერთდროულად დაყენება ერთი ბრძანებით: <br>
```bash
sudo apt install -y git curl vim htop net-tools
```
ან თითოეული ცალ-ცალკე: <br>


git: კოდის ვერსიების მართვისთვის. <br>
curl: ფაილების გადმოსაწერად ან API-სთან დასაკავშირებლად ტერმინალიდან. <br>
vim: ტექსტური რედაქტორი (როცა nano აღარ გყოფნის). <br>
htop: რომ ნახო, რამდენ ოპერატიულ მეხსიერებას (RAM) და პროცესორს (CPU) იყენებს შენი VM. <br>
net-tools: ქსელური დიაგნოსტიკისთვის. <br>

```bash 
Git: sudo apt install -y git
```
```bash
Curl: sudo apt install -y curl
```
```bash
Vim: sudo apt install -y vim
```
```bash
Htop: sudo apt install -y htop
```
```bash
Net-tools: sudo apt install -y net-tools
```


```bash
k@devserver:~$ sudo apt install -y git
```
GIT უკვე დაყენებულია
```console
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
git is already the newest version (1:2.43.0-1ubuntu7.3).
git set to manually installed.
0 upgraded, 0 newly installed, 0 to remove and 2 not upgraded.
```

curl უკვე დაყენებულია
```console
k@devserver:~$ sudo apt install -y curl
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
curl is already the newest version (8.5.0-2ubuntu10.6).
curl set to manually installed.
0 upgraded, 0 newly installed, 0 to remove and 2 not upgraded.
```

vim უკვე დაყენებულია
```console
k@devserver:~$ sudo apt install -y vim
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
vim is already the newest version (2:9.1.0016-1ubuntu7.9).
vim set to manually installed.
0 upgraded, 0 newly installed, 0 to remove and 2 not upgraded.
```

htop უკვე დაყენებულია
```console
k@devserver:~$ sudo apt install -y htop
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
htop is already the newest version (3.3.0-4build1).
htop set to manually installed.
0 upgraded, 0 newly installed, 0 to remove and 2 not upgraded.
```

net-tools - ის ინსტალაცია
```console
k@devserver:~$ sudo apt install -y net-tools
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following NEW packages will be installed:
  net-tools
0 upgraded, 1 newly installed, 0 to remove and 2 not upgraded.
Need to get 204 kB of archives.
After this operation, 811 kB of additional disk space will be used.
Get:1 http://ge.archive.ubuntu.com/ubuntu noble-updates/main amd64 net-tools amd64 2.10-0.1ubuntu4.4 [204 kB]
Fetched 204 kB in 1s (192 kB/s)
Selecting previously unselected package net-tools.
(Reading database ... 87509 files and directories currently installed.)
Preparing to unpack .../net-tools_2.10-0.1ubuntu4.4_amd64.deb ...
Unpacking net-tools (2.10-0.1ubuntu4.4) ...
Setting up net-tools (2.10-0.1ubuntu4.4) ...
Processing triggers for man-db (2.12.0-4build2) ...
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
 k @ session #10: sshd[6338]
 k @ session #11: sshd[6340]
 k @ session #4: sshd[1039]
 k @ user manager service: systemd[1006]

No VM guests are running outdated hypervisor (qemu) binaries on this host.
```

ყველას გადამოწმება
```bash
git --version && curl --version && vim --version | head -n 1 && htop --version && ifconfig --version
```

```console
git version 2.43.0
curl 8.5.0 (x86_64-pc-linux-gnu) libcurl/8.5.0 OpenSSL/3.0.13 zlib/1.3 brotli/1.1.0 zstd/1.5.5 libidn2/2.3.7 libpsl/0.21.2 (+libidn2/2.3.7) libssh/0.10.6/openssl/zlib nghttp2/1.59.0 librtmp/2.3 OpenLDAP/2.6.10
Release-Date: 2023-12-06, security patched: 8.5.0-2ubuntu10.6
Protocols: dict file ftp ftps gopher gophers http https imap imaps ldap ldaps mqtt pop3 pop3s rtmp rtsp scp sftp smb smbs smtp smtps telnet tftp
Features: alt-svc AsynchDNS brotli GSS-API HSTS HTTP2 HTTPS-proxy IDN IPv6 Kerberos Largefile libz NTLM PSL SPNEGO SSL threadsafe TLS-SRP UnixSockets zstd
VIM - Vi IMproved 9.1 (2024 Jan 02, compiled Sep 05 2025 19:44:46)
htop 3.3.0
net-tools 2.10
```

## დამატებითი პაკეტი: wtmpdb (`last` ბრძანებისთვის)
ახალ Ubuntu-ზე `last` (შესვლების ისტორია) ნაგულისხმევად არ არის დაყენებული: <br>
```console
k@myubuntuserver:~$ last -n 10
Command 'last' not found, but can be installed with:
sudo apt install wtmpdb
```
`last` ბრძანებას ახლა `wtmpdb` პაკეტი იძლევა. ის Task 13-ში (Log Monitoring) გვჭირდება: <br>
```bash
sudo apt install -y wtmpdb
```
```bash
last -n 10
```
```console
k        pts/0        192.168.56.1     Tue Nov 10 10:43 - still logged in
k        pts/0        192.168.56.1     Mon Nov  9 23:15 - still logged in
k        pts/0        192.168.56.1     Mon Nov  9 23:08 - still logged in
k        pts/0        192.168.56.1     Mon Nov  9 23:06 - still logged in
k        pts/0        192.168.56.1     Mon Nov  9 23:05 - still logged in
k        pts/0        192.168.56.1     Mon Nov  9 23:00 - still logged in
k        pts/0        192.168.56.1     Mon Nov  9 22:53 - still logged in
k        pts/1        192.168.56.1     Mon Nov  9 22:48 - still logged in
k        pts/0        192.168.56.1     Mon Nov  9 22:44 - still logged in

wtmpdb begins Mon Nov  9 22:44:22 2026
```
`192.168.56.1` host-ის Host-Only მისამართია, საიდანაც SSH-ით შევდივარ. ბოლო ხაზი გვეუბნება, რომ `wtmpdb`-ის ბაზა 9 ნოემბრიდან იწყება, ამ თარიღამდე შესვლები ჩანაწერში არ არის. <br>

## სწრაფი შემოწმება
ხუთივე პაკეტი დაყენებულია, თუ თითოეულს `ii` სტატუსი აქვს: <br>
```bash
dpkg -l git curl vim htop net-tools | grep ^ii
```

## გადატვირთვა ჭირდება თუ არა
ბირთვის განახლების შემდეგ სისტემა შეიძლება გადატვირთვას ითხოვდეს: <br>
```bash
[ -f /var/run/reboot-required ] && echo "reboot needed"
```
თუ დაიწერა `reboot needed`: <br>
```bash
sudo reboot
```
გადატვირთვის შემდეგ SSH-ით ისევ შეგიძლია შესვლა, რადგან IP სტატიკურია (Task 3).
