Task 9 — Custom Website Deploy

## ვარიანტი 1: საიტი GitHub-იდან (რეკომენდებული)
საიტი [mgawm](https://github.com/ezdanapak/mgawm) სტატიკურია (`index.html`, `styles.css`, `script.js`, `favicon.svg`, `og.jpg`), ამიტომ build არ სჭირდება და Nginx-ს პირდაპირ მოერგება. <br>

### 1. საიტის გადმოწერა
```bash
sudo mkdir -p /var/www/mgawm
```
```bash
sudo chown -R $USER:$USER /var/www/mgawm
```
```bash
git clone https://github.com/ezdanapak/mgawm /var/www/mgawm
```
!!! note
    თუ საქაღალდე ცარიელი არ არის, `git clone` ერორს დაწერს. წაშალე მისი შიგთავსი ან სხვა სახელი გამოიყენე.

### 2. Nginx-ის კონფიგურაცია
შექმენი ახალი server block: <br>
```bash
sudo nano /etc/nginx/sites-available/mgawm
```
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name _;

    root /var/www/mgawm;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```
გააქტიურე და default გათიშე (ორიგინალი `sites-available/default`-ში რჩება): <br>
```bash
sudo ln -s /etc/nginx/sites-available/mgawm /etc/nginx/sites-enabled/
```
```bash
sudo rm -f /etc/nginx/sites-enabled/default
```
!!! tip
    თუ `mysite`-ის ან სხვა კონფიგურაცია უკვე გაქვს, შეგიძლია მასში უბრალოდ `root` ხაზი შეცვალო: `root /var/www/mgawm;`.

### 3. შემოწმება და გადატვირთვა
```bash
sudo nginx -t
```
```bash
sudo systemctl reload nginx
```

### 4. შედეგი
```bash
curl -I http://localhost
```
```console
HTTP/1.1 200 OK
Server: nginx/1.28.3 (Ubuntu)
Date: Tue, 10 Nov 2026 08:28:14 GMT
Content-Type: text/html
Content-Length: 3108
Last-Modified: Tue, 10 Nov 2026 08:25:38 GMT
Connection: keep-alive
ETag: "6af2d502-c24"
Accept-Ranges: bytes
```
`Content-Length: 3108` ემთხვევა `index.html`-ის ზომას რეპოში. host-ის browser-ში გახსენი: <br>
```console
http://192.168.56.10/
```
თუ ძველი გვერდი ჩანს, გაასუფთავე browser-ის ქეში (++ctrl+shift+r++). <br>

### ხელით განახლება
GitHub-ზე ცვლილების შემდეგ VM-ში საკმარისია: <br>
```bash
cd /var/www/mgawm && git pull
```
Nginx-ის გადატვირთვა სტატიკური ფაილებისთვის არ სჭირდება, რადგან ის ფაილებს ყოველ მოთხოვნაზე დისკიდან კითხულობს. <br>

## ავტომატური განახლება GitHub-იდან
მიზანი: როცა GitHub-ზე რეპო განახლდება, VM თავად გადმოწერს ახალ ვერსიას და დაადასტურებს, რომ საიტი მუშაობს. <br>

!!! info "რატომ polling და არა webhook"
    GitHub-ს webhook-ით რომ ეთქვა VM-ისთვის "ახალი commit გაქვს", GitHub-იდან VM-ზე უნდა მიწვდომოდა. VM კი შიდა ქსელშია (NAT + Host-Only, `192.168.56.10`) და ინტერნეტიდან ხელმისაწვდომი არ არის. ამიტომ პირიქით ვაკეთებთ: VM ყოველ წუთს თავად ეკითხება GitHub-ს, ახალი რამ ხომ არ არის (polling). გამავალი კავშირი NAT-ით ისედაც მუშაობს და firewall-ს (Task 7) არ ეწინააღმდეგება. <br>

### დიაგრამა: რა ხდება ყოველ წუთზე
```mermaid
flowchart TD
    C["⏰ cron<br/>ყოველ წუთს"] --> S["📜 deploy-mgawm.sh"]
    S --> L{"🔒 flock:<br/>წინა გაშვება ჯერ მუშაობს?"}
    L -->|"კი"| X1["გასვლა"]
    L -->|"არა"| F["📥 git fetch<br/>GitHub-იდან ინფორმაცია"]
    F --> D{"LOCAL = REMOTE?"}
    D -->|"კი: ახალი არაფერია"| X2["გასვლა<br/>ლოგი არ იწერება"]
    D -->|"არა: ახალი commit"| R["🔄 git reset --hard<br/>origin/main"]
    R --> H["🩺 curl localhost<br/>health check"]
    H -->|"HTTP 200"| OK["✅ ლოგი: OK"]
    H -->|"სხვა კოდი"| ERR["❌ ლოგი: შეცდომა"]
    R -.-> N["🌐 Nginx ახალ ფაილებს<br/>პირდაპირ აწვდის"]
```
**როგორ წავიკითხოთ:** დიაგრამა ორ ადრეულ გასვლას აჩვენებს და ორივე განზრახ არის. თუ წინა გაშვება ჯერ არ დასრულებულა (`flock`), ახალი თავს ანებებს და ორი პროცესი ერთმანეთს ფაილებს არ გადაუფარავს. თუ GitHub-ზე ახალი commit არ არის, სკრიპტი ჩუმად გადის: ყოველ წუთს ლოგში ჩანაწერი რომ გაჩენილიყო, დღეში 1440 უსარგებლო ხაზი დაგროვდებოდა. ფაილების განახლებას მხოლოდ ერთი გზა აქვს (ახალი commit), ხოლო `health check` ამოწმებს, რომ განახლების შემდეგ საიტი ნამდვილად ცოცხალია. წყვეტილი ისარი ნიშნავს, რომ Nginx-ს სკრიპტი არ ეხება: ის უბრალოდ დისკიდან ახალ ფაილებს კითხულობს. <br>

### 1. სკრიპტის შექმნა
```bash
mkdir -p ~/scripts
```
```bash
nano ~/scripts/deploy-mgawm.sh
```
ჩაწერე: <br>
```bash
#!/usr/bin/env bash
# deploy-mgawm.sh — GitHub-ზე ახალი commit-ის შემოწმება და საიტის განახლება
set -euo pipefail

REPO_DIR="/var/www/mgawm"          # სადაც საიტია გადმოწერილი
BRANCH="main"                      # რომელ ბრანჩს ვადევნებთ თვალს
HEALTH_URL="http://localhost/"     # განახლების შემდეგ ამას ვამოწმებთ
LOG="$HOME/deploy-mgawm.log"
LOCK="/tmp/deploy-mgawm.lock"

log() { echo "$(date '+%F %T') $*" >> "$LOG"; }

# ერთდროულად ორი გაშვება რომ არ მოხდეს
exec 9>"$LOCK"
flock -n 9 || exit 0

cd "$REPO_DIR"

# 1. GitHub-იდან ინფორმაციის წამოღება (ფაილებს ჯერ არ ცვლის)
git fetch --quiet origin "$BRANCH"

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse "origin/$BRANCH")

# 2. თუ ახალი არაფერია, გავდივართ (ლოგს არ ვავსებთ)
[ "$LOCAL" = "$REMOTE" ] && exit 0

# 3. განახლება: სერვერზე ზუსტად ის იქნება, რაც GitHub-ზეა
log "ახალი commit: ${LOCAL:0:7} -> ${REMOTE:0:7}"
git reset --hard --quiet "origin/$BRANCH"

# 4. შემოწმება, რომ Nginx საიტს სწორად აბრუნებს
CODE=$(curl -s -o /dev/null -w '%{http_code}' "$HEALTH_URL" || true)
if [ "$CODE" = "200" ]; then
    log "OK: საიტი განახლდა (HTTP $CODE)"
else
    log "შეცდომა: საიტი აბრუნებს HTTP $CODE"
    exit 1
fi
```
შეინახე (++ctrl+o++, ++enter++, ++ctrl+x++) და გახადე შესასრულებელი: <br>
```bash
chmod +x ~/scripts/deploy-mgawm.sh
```

### 2. რას აკეთებს სკრიპტი, ნაბიჯ-ნაბიჯ
| ნაწილი | რისთვის არის |
|--------|--------------|
| `set -euo pipefail` | სკრიპტი ჩერდება პირველივე ერორზე და არ გრძელდება ნახევრად გატეხილი მდგომარეობით |
| `exec 9>"$LOCK"` + `flock -n 9` | ერთდროულად ორი გაშვება რომ არ მოხდეს (ახალი გაშვება თავს ანებებს, თუ წინა ჯერ არ დასრულებულა) |
| `git fetch` | GitHub-იდან მხოლოდ ინფორმაციას იღებს. საიტის ფაილებს ჯერ არ ცვლის, ამიტომ უსაფრთხოა |
| `git rev-parse HEAD` / `origin/main` | ადარებს სერვერის commit-ს GitHub-ის commit-ს |
| `[ "$LOCAL" = "$REMOTE" ] && exit 0` | თუ ახალი არაფერია, ჩუმად გადის და ლოგს არ ავსებს (ყოველ წუთზე გაშვებისას ეს მნიშვნელოვანია) |
| `git reset --hard origin/main` | სერვერზე საიტი ზუსტად იგივე ხდება, რაც GitHub-ზეა |
| `curl ... $HEALTH_URL` | განახლების შემდეგ ამოწმებს, რომ Nginx საიტს `200 OK`-ით აბრუნებს |
| `log` | წერს `~/deploy-mgawm.log`-ში რა მოხდა და როდის |

!!! warning
    `git reset --hard` სერვერზე `/var/www/mgawm`-ში ხელით გაკეთებულ ცვლილებებს წაშლის. საიტის რედაქტირება GitHub-ზე უნდა მოხდეს და არა VM-ში.

### 3. ხელით ტესტი
```bash
~/scripts/deploy-mgawm.sh
```
თუ ახალი commit არ არის, არაფერს დაწერს, ეს ნორმალურია. გამართულობის სანახავად ლოგი: <br>
```bash
cat ~/deploy-mgawm.log
```

### 4. ავტომატური გაშვება cron-ით
```bash
crontab -e
```
ფაილის ბოლოს დაამატე: <br>
```text
* * * * * /home/k/scripts/deploy-mgawm.sh
```
`* * * * *` ნიშნავს "ყოველ წუთზე". შეინახე და გამოდი. შეამოწმე: <br>
```bash
crontab -l
```

### 5. სრული ციკლის შემოწმება
1. GitHub-ზე რეპოში გააკეთე ცვლილება და დააკომიტე.
2. დაელოდე დაახლოებით ერთ წუთს.
3. VM-ში ნახე ლოგი:
   ```bash
   tail -n 5 ~/deploy-mgawm.log
   ```
   ```console
   2026-11-10 12:32:14 ახალი commit: a5ced7e -> 0ac37a8
   2026-11-10 12:32:14 OK: საიტი განახლდა (HTTP 200)
   ```
4. host-ის browser-ში გახსენი `http://192.168.56.10/` (++ctrl+shift+r++) და ახალი ვერსია უნდა ჩანდეს.

### რომელი პროცესი რისთვის არის
- **cron** — წუთში ერთხელ ეშვება სკრიპტი, ანუ ის არის "საათი".
- **სკრიპტი** — ადარებს ვერსიებს და საჭიროების შემთხვევაში განაახლებს ფაილებს.
- **git** — GitHub-იდან ფაილების გადმოწერა და ვერსიის შედარება.
- **flock** — დაცვა გადაფარვისგან.
- **Nginx** — არაფერს ხელახლა არ იტვირთავს, უბრალოდ მიაწვდის ახალ ფაილებს.
- **curl health check** — ამოწმებს, რომ განახლების შემდეგ საიტი ცოცხალია.
- **ლოგი** — ისტორია იმისა, როდის და რა განახლდა.

### თუ არ მუშაობს
- `sudo nginx -t` — სინტაქსის ერორი
- `ls -l /etc/nginx/sites-enabled/` — უნდა ჩანდეს `mgawm` და `default` არა
- `sudo journalctl -u nginx --no-pager | tail` — ერორის ლოგი
- 403 Forbidden: `ls -ld /var/www/mgawm` — საქაღალდე წაკითხვადი უნდა იყოს

---

## ვარიანტი 2: ხელით შექმნილი გვერდი

### საკუთარი ვებ გვერდი
ვებ სერვერზე გასაშვებად დავაგენერირებინოთ AI - ს სასურველი შაბლონური გვერდი<br>
გავხსნათ ფაილი 



```bash
sudo nano /var/www/html/index.html
```
დავაკოპიროთ ++ctrl+c++ და ++ctrl+v++ AI - ს შემოქმედება <br>
და ჩავუშვათ index.html ფაილში <br>

!!! tip
    ++ctrl+x++ დაგეხმარება გახსნილი ფაილის დახურვაში <br>
    ++ctrl+y++ დაგეხმარება დასტურში ფაილის სახელზე <br>
    ++enter++ უბრალოდ თანხმობა და ფაილი დაიხურება <br>

### შაბლონი ვებ გვერდი
ეს ჩემი შემოქმედებაა და შაბლონად სრულებით საკმარისი, შეგიძლია ისარგებლო. 

```html
<!DOCTYPE html>
<html lang="ka">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ქუთაისის მულტიფუნქციური ცენტრი</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@300;400;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --primary: #1a1a2e;
            --accent: #e94560;
            --accent-glow: rgba(233, 69, 96, 0.3);
            --surface: #16213e;
            --surface-light: #1c2a4a;
            --text: #eaeaea;
            --text-muted: #8892a4;
            --gold: #f5c518;
        }

        body {
            font-family: 'Noto Sans Georgian', sans-serif;
            background: var(--primary);
            color: var(--text);
            min-height: 100vh;
            overflow-x: hidden;
        }

        /* === HEADER === */
        header {
            position: relative;
            padding: 2.5rem 2rem 2rem;
            text-align: center;
            background: linear-gradient(135deg, var(--primary) 0%, var(--surface) 50%, #0f3460 100%);
            border-bottom: 3px solid var(--accent);
            overflow: hidden;
        }

        header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle at 30% 50%, var(--accent-glow) 0%, transparent 50%),
                        radial-gradient(circle at 70% 80%, rgba(15, 52, 96, 0.4) 0%, transparent 40%);
            animation: headerPulse 8s ease-in-out infinite;
        }

        @keyframes headerPulse {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
        }

        header > * { position: relative; z-index: 1; }

        .logo-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 64px;
            height: 64px;
            background: var(--accent);
            border-radius: 16px;
            margin-bottom: 1rem;
            font-size: 1.8rem;
            box-shadow: 0 4px 24px var(--accent-glow);
            animation: badgePop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        @keyframes badgePop {
            from { transform: scale(0) rotate(-20deg); opacity: 0; }
            to { transform: scale(1) rotate(0); opacity: 1; }
        }

        h1 {
            font-size: clamp(1.5rem, 4vw, 2.2rem);
            font-weight: 800;
            letter-spacing: -0.02em;
            margin-bottom: 0.4rem;
            background: linear-gradient(90deg, #fff 0%, var(--gold) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .subtitle {
            font-size: 0.95rem;
            color: var(--text-muted);
            font-weight: 300;
        }

        /* === MAP === */
        .map-wrapper {
            position: relative;
            margin: 0;
        }

        #map {
            width: 100%;
            height: 55vh;
            min-height: 350px;
            z-index: 1;
        }

        .map-overlay-gradient {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 80px;
            background: linear-gradient(to top, var(--primary), transparent);
            z-index: 2;
            pointer-events: none;
        }

        /* === INFO SECTION === */
        .info-section {
            max-width: 700px;
            margin: -2rem auto 0;
            padding: 0 1.5rem 3rem;
            position: relative;
            z-index: 3;
        }

        .info-card {
            background: var(--surface);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 20px 60px rgba(0,0,0,0.4);
            animation: cardSlide 0.7s ease-out both;
            animation-delay: 0.3s;
        }

        @keyframes cardSlide {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .info-row {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            padding: 1rem 0;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            transition: background 0.2s;
        }

        .info-row:last-child { border-bottom: none; }

        .info-row:hover {
            background: rgba(255,255,255,0.02);
            border-radius: 12px;
            margin: 0 -0.5rem;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
        }

        .info-icon {
            flex-shrink: 0;
            width: 42px;
            height: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--surface-light);
            border-radius: 12px;
            font-size: 1.2rem;
        }

        .info-content {
            flex: 1;
            min-width: 0;
        }

        .info-label {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--text-muted);
            margin-bottom: 0.25rem;
            font-weight: 600;
        }

        .info-value {
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
        }

        .info-value a {
            color: var(--accent);
            text-decoration: none;
            transition: color 0.2s;
            word-break: break-all;
        }

        .info-value a:hover {
            color: var(--gold);
        }

        /* Social buttons */
        .social-links {
            display: flex;
            gap: 0.75rem;
            margin-top: 0.3rem;
            flex-wrap: wrap;
        }

        .social-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.55rem 1.1rem;
            border-radius: 10px;
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .social-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }

        .social-btn.instagram {
            background: linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
            color: #fff;
        }

        .social-btn.facebook {
            background: #1877f2;
            color: #fff;
        }

        .social-btn svg {
            width: 18px;
            height: 18px;
            fill: currentColor;
        }

        /* Phone CTA */
        .phone-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: linear-gradient(135deg, #00c853, #00e676);
            color: #000;
            padding: 0.6rem 1.2rem;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 700;
            font-size: 1rem;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .phone-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,200,83,0.3);
        }

        /* Footer */
        footer {
            text-align: center;
            padding: 1.5rem;
            font-size: 0.75rem;
            color: var(--text-muted);
            border-top: 1px solid rgba(255,255,255,0.04);
        }

        /* Leaflet popup custom */
        .leaflet-popup-content-wrapper {
            background: var(--surface) !important;
            color: var(--text) !important;
            border-radius: 14px !important;
            border: 1px solid rgba(233,69,96,0.3) !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5) !important;
        }

        .leaflet-popup-tip {
            background: var(--surface) !important;
            border: 1px solid rgba(233,69,96,0.3) !important;
        }

        .leaflet-popup-content {
            font-family: 'Noto Sans Georgian', sans-serif !important;
            font-size: 0.9rem !important;
            line-height: 1.6 !important;
        }

        .popup-title {
            font-weight: 700;
            font-size: 1rem;
            color: var(--gold);
            margin-bottom: 4px;
        }

        .popup-addr {
            color: var(--text-muted);
            font-size: 0.82rem;
        }

        /* Responsive */
        @media (max-width: 480px) {
            header { padding: 1.5rem 1rem 1.5rem; }
            .info-card { padding: 1.2rem; }
            .social-links { flex-direction: column; }
            #map { height: 45vh; min-height: 280px; }
        }
    </style>
</head>
<body>

<header>
    <div class="logo-badge">🏢</div>
    <h1>ქუთაისის მულტიფუნქციური ცენტრი</h1>
    <p class="subtitle">Kutaisi Multifunctional Center</p>
</header>

<div class="map-wrapper">
    <div id="map"></div>
    <div class="map-overlay-gradient"></div>
</div>

<section class="info-section">
    <div class="info-card">

        <div class="info-row">
            <div class="info-icon">📍</div>
            <div class="info-content">
                <div class="info-label">მისამართი / Address</div>
                <div class="info-value">ილია ჭავჭავაძის #21, ქუთაისი, საქართველო, 4600</div>
            </div>
        </div>

        <div class="info-row">
            <div class="info-icon">📞</div>
            <div class="info-content">
                <div class="info-label">ტელეფონი / Phone</div>
                <div class="info-value">
                    <a href="tel:+995571333303" class="phone-link">📞 +995 571 333 303</a>
                </div>
            </div>
        </div>

        <div class="info-row">
            <div class="info-icon">🌐</div>
            <div class="info-content">
                <div class="info-label">სოციალური ქსელები / Social</div>
                <div class="info-value">
                    <div class="social-links">
                        <a href="https://www.instagram.com/multi_kutaisi" target="_blank" class="social-btn instagram">
                            <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                            Instagram
                        </a>
                        <a href="https://www.facebook.com/multikutaisi" target="_blank" class="social-btn facebook">
                            <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            Facebook
                        </a>
                    </div>
                </div>
            </div>
        </div>

    </div>
</section>

<footer>
    © 2025 ქუთაისის მულტიფუნქციური ცენტრი
</footer>

<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof L === 'undefined') {
            document.getElementById('map').innerHTML = '<p style="padding:2rem;color:#e94560;text-align:center;">რუკის ჩატვირთვა ვერ მოხერხდა. შეამოწმეთ ინტერნეტ კავშირი.</p>';
            return;
        }

        const lat = 42.2668;
        const lng = 42.6941;

        const map = L.map('map', {
            center: [lat, lng],
            zoom: 17,
            zoomControl: false
        });

        L.control.zoom({ position: 'topright' }).addTo(map);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19
        }).addTo(map);

        const customIcon = L.divIcon({
            html: '<div style="width:40px;height:40px;background:#e94560;border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 16px rgba(233,69,96,0.5);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:18px;">🏢</span></div>',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -42],
            className: ''
        });

        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

        marker.bindPopup(
            '<div class="popup-title">ქუთაისის მულტიფუნქციური ცენტრი</div>' +
            '<div class="popup-addr">ილია ჭავჭავაძის #21<br>ქუთაისი, 4600</div>'
        ).openPopup();
    });
</script>

</body>
</html>
```

### უფლებების დაყენება

```bash
sudo chown www-data:www-data /var/www/html/index.html
```
```bash
sudo chmod 644 /var/www/html/index.html
```

### Nginx
```bash
sudo systemctl restart nginx
```

### Browser-ში შემოწმება

```console
http://192.168.56.10/
```
