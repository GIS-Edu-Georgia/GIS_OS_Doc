Task 8 — Web Server Installation


## nginx ინსტალაცია

```bash
sudo apt install nginx -y
```

```console
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following additional packages will be installed:
  nginx-common
Suggested packages:
  fcgiwrap nginx-doc ssl-cert
The following NEW packages will be installed:
  nginx nginx-common
0 upgraded, 2 newly installed, 0 to remove and 2 not upgraded.
Need to get 564 kB of archives.
After this operation, 1,596 kB of additional disk space will be used.
Get:1 http://ge.archive.ubuntu.com/ubuntu noble-updates/main amd64 nginx-common all 1.24.0-2ubuntu7.5 [43.4 kB]
Get:2 http://ge.archive.ubuntu.com/ubuntu noble-updates/main amd64 nginx amd64 1.24.0-2ubuntu7.5 [520 kB]
Fetched 564 kB in 1s (626 kB/s)
Preconfiguring packages ...
Selecting previously unselected package nginx-common.
(Reading database ... 87557 files and directories currently installed.)
Preparing to unpack .../nginx-common_1.24.0-2ubuntu7.5_all.deb ...
Unpacking nginx-common (1.24.0-2ubuntu7.5) ...
Selecting previously unselected package nginx.
Preparing to unpack .../nginx_1.24.0-2ubuntu7.5_amd64.deb ...
Unpacking nginx (1.24.0-2ubuntu7.5) ...
Setting up nginx-common (1.24.0-2ubuntu7.5) ...
Created symlink /etc/systemd/system/multi-user.target.wants/nginx.service → /usr/lib/systemd/system/nginx.service.
Setting up nginx (1.24.0-2ubuntu7.5) ...
 * Upgrading binary nginx                                                                                                                                                                              [ OK ]
Processing triggers for man-db (2.12.0-4build2) ...
Processing triggers for ufw (0.36.2-6) ...
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


## სერვისის გაშვება, ავტოსტარტი და გადამოწმება
ერთი ბრძანებით ჩაირთვება ახლავე და ავტომატურად ჩაირთვება VM-ის ყოველ ჩატვირთვაზე: <br>
```bash
sudo systemctl enable --now nginx
```
```console
Synchronizing state of nginx.service with SysV service script with /usr/lib/systemd/systemd-sysv-install.
Executing: /usr/lib/systemd/systemd-sysv-install enable nginx
```

```bash
systemctl status nginx
```

```console
● nginx.service - A high performance web server and a reverse proxy server
     Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled; preset: enabled)
     Active: active (running) since Tue 2026-11-10 07:39:24 UTC; 1min 5s ago
 Invocation: 8a404a0c8aae4936b5d561e171e1ec91
       Docs: man:nginx(8)
   Main PID: 3193 (nginx)
      Tasks: 5 (limit: 6061)
     Memory: 4.5M (peak: 10.8M)
        CPU: 73ms
     CGroup: /system.slice/nginx.service
             ├─3193 "nginx: master process /usr/sbin/nginx -g daemon on; master_process on;"
             ├─3195 "nginx: worker process"
             ├─3196 "nginx: worker process"
             ├─3197 "nginx: worker process"
             └─3198 "nginx: worker process"
```
`Loaded: ... enabled` ნიშნავს, რომ ავტოსტარტი ჩართულია, `Active: active (running)` კი — რომ ახლა მუშაობს. გასასვლელად დააჭირე `q`. <br>

## Firewall

Task 7-ში 80/tcp და 443/tcp უკვე დაშვებულია, ამიტომ Nginx-ისთვის დამატებითი წესი არ გჭირდება. შეამოწმე: <br>
```bash
sudo ufw status
```
სიაში უნდა იყოს `80/tcp ALLOW IN Anywhere`. <br>

!!! tip
    თუ Task 7-ში 80-ე პორტი არ გიდევს დაშვებული, გამოიყენე `sudo ufw allow 'Nginx HTTP'` (ან `sudo ufw allow 80/tcp`).

## ლოკალური ტესტი სერვერზე:
მხოლოდ სათაურებით (სწრაფი შემოწმება): <br>
```bash
curl -I http://localhost
```
```console
HTTP/1.1 200 OK
Server: nginx/1.28.3 (Ubuntu)
Date: Tue, 10 Nov 2026 07:41:44 GMT
Content-Type: text/html
Content-Length: 615
Last-Modified: Tue, 10 Nov 2026 07:39:21 GMT
Connection: keep-alive
ETag: "6af2ca29-267"
Accept-Ranges: bytes
```
`HTTP/1.1 200 OK` ნიშნავს, რომ Nginx პასუხობს. სრული გვერდისთვის: <br>
```bash
curl http://localhost
```
თუ ამ html ფაილს დაინახავ ესეიგი ყველაფერი კარგად არის და სერვერი მუშაობს!
```html
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

## IP მისამართზე ვებ სერვერი

Nginx სტანდარტულად 80 პორტზე მუშაობს. VM-ის Host-Only მისამართია `192.168.56.10` (სტატიკური, Task 3). <br>
თუ გვინდა რომ სხვა კომპიუტერიდან(იმავე ქსელის შიდა როუტერით) მივწვდეთ სერვერს უნდა <br> გამოვიყენოთ ნებისმიერ ინტერნეტ ბრაუზერში მისი IP.

```console
http://192.168.56.10/
```
უნდა ხედავდე ამ შეტყობინებას იგივენაირად
```html
Welcome to nginx!
If you see this page, the nginx web server is successfully installed and working. Further configuration is required.

For online documentation and support please refer to nginx.org.
Commercial support is available at nginx.com.

Thank you for using nginx.
```

host-იდან ტერმინალითაც შეგიძლია შეამოწმო: <br>
```bash
curl -I http://192.168.56.10
```
`HTTP/1.1 200 OK` ნიშნავს, რომ Task-ის შედეგი შესრულებულია: Nginx welcome page ჩანს VM-ის IP-ზე.

## თუ არ იხსნება

- `sudo ufw status` — 80/tcp უნდა იყოს `ALLOW`
- `sudo nginx -t` — კონფიგურაციის სინტაქსი უნდა იყოს `ok`
- `sudo ss -tlnp | grep :80` — nginx-მა 80-ე პორტზე უნდა მოუსმინოს
- `sudo journalctl -u nginx --no-pager | tail` — ერორის ლოგი

