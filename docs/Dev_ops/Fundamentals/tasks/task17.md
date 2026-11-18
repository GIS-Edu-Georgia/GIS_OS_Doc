Task 17 — SSL Certificate

## არქიტექტურა

```mermaid
flowchart LR
    subgraph BROWSER["🌐 Browser"]
        U["User"]
    end

    subgraph HOST["🖥️ Host — devserver"]
        HTTP[":80\nHTTP"]
        HTTPS[":443\nHTTPS + SSL"]
    end

    subgraph DOCKER["🐳 Docker Containers"]
        NW["Nginx\n:8080"]
        AD["Adminer\n:8081"]
    end

    U -->|"http://..."| HTTP
    HTTP -->|"301 Redirect"| HTTPS
    U -->|"https://..."| HTTPS
    HTTPS -->|"/ → :8080"| NW
    HTTPS -->|"/adminer/ → :8081"| AD
```

SSL სერტიფიკატის გენერაცია:
```bash
sudo mkdir -p /etc/nginx/ssl
```
```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/server.key \
  -out /etc/nginx/ssl/server.crt \
  -subj "/C=GE/ST=Imereti/L=Kutaisi/O=DevServer/CN=devserver"
```

```console
k@devserver:~/docker-app$ sudo mkdir -p /etc/nginx/ssl
k@devserver:~/docker-app$ sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/server.key \
  -out /etc/nginx/ssl/server.crt \
  -subj "/C=GE/ST=Imereti/L=Kutaisi/O=DevServer/CN=devserver"
...+...+.....+......+.+......+..+.
-----
k@devserver:~/docker-app$
```


### ბრძანების პარამეტრები

| პარამეტრი | დანიშნულება |
|-----------|-------------|
| `req -x509` | Self-signed სერტიფიკატის გენერაცია (არა CSR) |
| `-nodes` | Private key არ დაიშიფრდება პაროლით (No DES) |
| `-days 365` | სერტიფიკატი მოქმედებს 1 წელი |
| `-newkey rsa:2048` | ახალი 2048-bit RSA გასაღების გენერაცია |
| `-keyout` | Private key-ის შენახვის გზა |
| `-out` | სერტიფიკატის შენახვის გზა |
| `-subj` | სერტიფიკატის მეტამონაცემები (ქვეყანა, ქალაქი, ორგანიზაცია, hostname) |

შედეგად ორი ფაილი შეიქმნება:

| ფაილი | რა არის |
|-------|---------|
| `server.key` | Private key — საიდუმლო, არავის არ უნდა გაუზიაროთ |
| `server.crt` | სერტიფიკატი — საჯარო, კლიენტს გადაეცემა TLS handshake-ის დროს |

> 💡 **Self-signed vs CA-signed:** Self-signed სერტიფიკატი ბრაუზერში გაფრთხილებას აჩვენებს, რადგან არცერთი სანდო Certificate Authority (CA) არ ადასტურებს მის ნამდვილობას. პროდაქშენში Let's Encrypt-ის ან სხვა CA-ს სერტიფიკატი გამოიყენება. სასწავლო და development გარემოში self-signed სრულიად საკმარისია.




## Nginx კონფიგურაციის განახლება:

```bash
sudo nano /etc/nginx/sites-available/docker-proxy
```

```nginx
server {
    listen 80;
    server_name _;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name _;

    ssl_certificate /etc/nginx/ssl/server.crt;
    ssl_certificate_key /etc/nginx/ssl/server.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /adminer/ {
        proxy_pass http://127.0.0.1:8081/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

```



შემოწმება და რესტარტი:

```bash
sudo nginx -t
```

```console
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
k@devserver:~/docker-app$
```

```bash
sudo systemctl restart nginx
```

### კონფიგურაციის განმარტება

**პირველი `server` ბლოკი (HTTP → HTTPS redirect):**

`return 301 https://$host$request_uri;` — ნებისმიერი HTTP მოთხოვნა 301 (Permanent Redirect) სტატუსით გადამისამართდება HTTPS-ზე. `$host` და `$request_uri` ინარჩუნებს ორიგინალ მისამართს.

**მეორე `server` ბლოკი (HTTPS):**

| დირექტივა | დანიშნულება |
|-----------|-------------|
| `listen 443 ssl` | HTTPS პორტზე მოსმენა SSL-ით |
| `ssl_certificate` | სერტიფიკატის ფაილის გზა |
| `ssl_certificate_key` | Private key-ის ფაილის გზა |
| `ssl_protocols TLSv1.2 TLSv1.3` | მხოლოდ თანამედროვე, უსაფრთხო პროტოკოლები |
| `ssl_ciphers HIGH:!aNULL:!MD5` | ძლიერი შიფრები, სუსტების გამორიცხვა |

> 💡 `location` ბლოკები Task 16-იდან უცვლელია — reverse proxy ლოგიკა იგივე რჩება, უბრალოდ ახლა SSL-ის მიღმა მუშაობს.




## Firewall-ში HTTPS-ის დაშვება

443 პორტი (HTTPS) უნდა იყოს გახსნილი firewall-ში:

```bash
sudo ufw allow 'Nginx Full'
sudo ufw status
```

```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443                        ALLOW       Anywhere
Nginx Full                 ALLOW       Anywhere
...
```

> 💡 `Nginx Full` პროფილი ერთდროულად ხსნის 80 (HTTP) და 443 (HTTPS) პორტებს. ორივე საჭიროა — 80 redirect-ისთვის, 443 HTTPS ტრაფიკისთვის.

```console
k@devserver:~/docker-app$ sudo ufw allow 'Nginx Full'
Rule added
Rule added (v6)
k@devserver:~/docker-app$ sudo ufw status
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443                        ALLOW       Anywhere
Nginx HTTP                 ALLOW       Anywhere
Nginx Full                 ALLOW       Anywhere
22/tcp (v6)                ALLOW       Anywhere (v6)
80/tcp (v6)                ALLOW       Anywhere (v6)
443 (v6)                   ALLOW       Anywhere (v6)
Nginx HTTP (v6)            ALLOW       Anywhere (v6)
Nginx Full (v6)            ALLOW       Anywhere (v6)

k@devserver:~/docker-app$
```

## ტესტირება ტერმინალიდან:
```bash
curl -k https://localhost
```

> `-k` flag self-signed სერტიფიკატს ენდობა


### HTTP → HTTPS redirect-ის ტესტი

```bash
curl -I http://localhost
```

მოსალოდნელი პასუხი:
```
HTTP/1.1 301 Moved Permanently
Location: https://localhost/
```


### Browser-იდან

`https://192.168.56.101/` — Browser აჩვენებს გაფრთხილებას: **"Your connection is not private"**. ეს ნორმალურია self-signed სერტიფიკატისთვის.

**Advanced → Proceed** (ან **Accept the Risk**) — ამის შემდეგ Docker app ჩანს HTTPS-ით.

`http://192.168.56.101/` — ავტომატურად გადამისამართდება `https://`-ზე.

> ✅ HTTPS მუშაობს, HTTP → HTTPS redirect მუშაობს.



## შედეგი

### SSL/TLS მოკლედ

SSL/TLS პროტოკოლი ორ რამეს აკეთებს: ადასტურებს სერვერის ვინაობას (authentication) და შიფრავს ტრაფიკს (encryption). ამისთვის ორი ფაილი გვჭირდება — private key და certificate. TLS handshake-ის დროს სერვერი კლიენტს სერტიფიკატს უგზავნის, კლიენტი ამოწმებს, შემდეგ სესიის გასაღებზე თანხმდებიან და ტრაფიკი იშიფრება.

### Self-signed vs Let's Encrypt

Self-signed სერტიფიკატი სწავლისა და development-ისთვის იდეალურია — არ სჭირდება domain name, არ სჭირდება ინტერნეტი, მყისიერად გენერირდება. პროდაქშენში კი Let's Encrypt-ს გამოვიყენებდით — უფასოა, ავტომატურად განახლებადია, და ბრაუზერი ენდობა.

### SSL Termination

SSL termination ნიშნავს რომ HTTPS კავშირი reverse proxy-ზე სრულდება. Proxy-სა და Docker კონტეინერებს შორის კომუნიკაცია ჩვეულებრივი HTTP-ით ხდება (`127.0.0.1`-ზე). ეს ნორმალური პრაქტიკაა — localhost ტრაფიკი სერვერიდან არ გადის და შიფრაცია არ სჭირდება.

```console
Browser ──HTTPS──▶ Nginx Proxy ──HTTP──▶ Docker Containers
         შიფრული        └─ SSL Termination    დაუშიფრავი
                                               (localhost)

```

---

## განახლებული ვერსია: HTTPS ახალ VM-ზე (`192.168.56.10`)

ზემოთ აღწერილია ძველი გარემო (`devserver`, Docker-ის წინ ერთი proxy). ახალ VM-ზე SSL გვაქვს `mgawm` საიტზე და სერტიფიკატი IP-ზეა გაცემული. <br>

```mermaid
flowchart TD
    B["Browser<br>https://192.168.56.10"] -->|"TLS handshake :443"| N["Nginx<br>server 443 ssl"]
    N -->|"აბრუნებს სერტიფიკატს<br>selfsigned.crt"| B
    B -->|"ვერ ამოწმებს CA-ს:<br>გაფრთხილება → Proceed"| N
    N -->|"დაშიფრული სესია<br>TLS 1.3"| S["/var/www/mgawm"]
    H["http://:80"] --> N2["Nginx server 80"]
    N2 --> S
```

### 1. სერტიფიკატი
```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/selfsigned.key \
  -out /etc/ssl/certs/selfsigned.crt \
  -subj "/CN=192.168.56.10" \
  -addext "subjectAltName=IP:192.168.56.10,DNS:app.test"
sudo chmod 600 /etc/ssl/private/selfsigned.key
```

| ნაწილი | რატომ |
|--------|-------|
| `-addext subjectAltName=IP:...,DNS:...` | თანამედროვე browser-ები მხოლოდ `CN`-ს აღარ ეყრდნობიან, IP/hostname SAN ველში უნდა იყოს |
| `-nodes` | გასაღებს პაროლი არ აქვს, რომ Nginx-ი რესტარტზე თავისით ჩაირთოს |
| `chmod 600` | გასაღები მხოლოდ root-ს უნდა კითხულობდეს |
| `/etc/ssl/private` და `/etc/ssl/certs` | Ubuntu-ს სტანდარტული ადგილი: გასაღები დახურულ საქაღალდეშია |

### 2. Nginx: ცალკე `server` ბლოკი 443-ზე
```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name _;

    ssl_certificate     /etc/ssl/certs/selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/selfsigned.key;
    ssl_protocols       TLSv1.2 TLSv1.3;

    root /var/www/mgawm;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```
`ssl_protocols` ძველ დაუცველ პროტოკოლებს (SSLv3, TLS 1.0/1.1) გამორთავს. 443 firewall-ში უკვე ღია იყო (Task 7). <br>

### 3. რეალური შედეგები
```text
$ sudo ss -tlnp | grep -E ":80|:443"
LISTEN 0 511   0.0.0.0:80    ... nginx
LISTEN 0 511   0.0.0.0:443   ... nginx
LISTEN 0 511   [::]:80       ... nginx
LISTEN 0 511   [::]:443      ... nginx

$ curl -kI https://localhost/
HTTP/1.1 200 OK
Server: nginx/1.28.3 (Ubuntu)
Content-Type: text/html
Content-Length: 3108

$ curl -kI https://192.168.56.10/ | head -n 1     # ჰოსტიდან
HTTP/1.1 200 OK
```
ბრაუზერში `https://192.168.56.10` გაფრთხილებას აჩვენებს (სერტიფიკატი თვითხელმოწერილია), **Advanced → Proceed** და საიტი იხსნება. `-k` curl-ში ნიშნავს „სერტიფიკატის ნდობა არ შეამოწმო“. <br>

### 4. რა შეცდომები დაგვხვდა
| პრობლემა | მიზეზი და გამოსწორება |
|----------|----------------------|
| `curl: (7) Failed to connect to localhost port 443`, `ss` ცარიელი | `ssl_certificate` ხაზები არასწორად ჩაჯდა არსებულ `listen 80` ბლოკში და `listen 443 ssl` საერთოდ არ იყო. `nginx -t` ამას ვერ იჭერს, ამიტომ ყოველთვის შეამოწმე `ss -tlnp \| grep :443` |
| `unknown directive "sudo"` | `sudo tee ... <<EOF` ბრძანება nano-ში ჩაიწერა ტექსტად. ბრძანება ტერმინალში უნდა გაეშვას, nano-ში მხოლოდ კონფიგის ტექსტი იწერება |
| `unknown directive "EOFserver"` | ფაილში `EOF` და ძველი ბლოკი დარჩა. `sudo sed -i '44,$d' ფაილი` ზედმეტი ხაზები წაშალა |
| `ls: cannot open '/etc/ssl/private/selfsigned.key'` | ნორმალურია: საქაღალდე root-ისაა, `sudo ls` გამოიყენე |

!!! tip "რატომ გვჭირდება HTTPS"
    HTTP-ზე პაროლები და მონაცემები ქსელში ღიად გადადის. TLS ტრაფიკს შიფრავს და სერვერის ვინაობას ამოწმებს. self-signed სერტიფიკატი შიფრავს, მაგრამ ვინაობას არავინ ადასტურებს, ამიტომ browser აფრთხილებს. რეალური საიტისთვის Let's Encrypt გამოიყენება.
