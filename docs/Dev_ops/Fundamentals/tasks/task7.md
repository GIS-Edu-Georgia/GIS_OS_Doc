Task 7 — Firewall Setup

## პორტების გახსნა

სტანდარტულად ასე გამოიყურება პორტები და მათი ტიპები. <br>
სანამ Firewall-ს გაააქტიურებ, სათითაოდ გახსენი ის "კარები", რომლებიც გჭირდება: <br>

- SSH (პორტი 22): 
```bash
sudo ufw allow ssh (ან sudo ufw allow 22/tcp)
```

- HTTP (პორტი 80): 
```bash
sudo ufw allow http (ან sudo ufw allow 80/tcp)
```

- HTTPS (პორტი 443): 
```bash
sudo ufw allow https (ან sudo ufw allow 443/tcp)
```

გაუშვი კონსოლში ბრძანება
```bash
sudo ufw allow ssh
```
```bash
sudo ufw allow http
```
```bash
sudo ufw allow https
```

კონსოლი ყველა ჯერზე უნდა გიბრუნებდეს პასუხს
```console
Rules updated
Rules updated (v6)
```
ჩართე Firewall
ახლა, როცა SSH დაშვებულია, შეგიძლია უსაფრთხოდ ჩართო სისტემა:

## დამცავი კედელი

```bash
sudo ufw enable
```

!!! warning "ბრძანების შესრულებისას"
    კონსოლი აუცილებლად გაგაფრთხილებთ არსებული კავშირების გაწყვეტაზე და 
    უნდა დაეთანხმო ++y++ და ++enter++ დაწკაპებით


```console
Command may disrupt existing ssh connections. Proceed with operation (y|n)? Y
Firewall is active and enabled on system startup
```
გადაამოწმე სტატუსი
```console
sudo ufw status verbose
```
```console
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)
New profiles: skip

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW IN    Anywhere
80/tcp                     ALLOW IN    Anywhere
443                        ALLOW IN    Anywhere
22/tcp (v6)                ALLOW IN    Anywhere (v6)
80/tcp (v6)                ALLOW IN    Anywhere (v6)
443 (v6)                   ALLOW IN    Anywhere (v6)
```


!!! info "რას ნიშნავს"
    Deny incoming: ყველაფერი, რაც შენს სერვერზე შემოდის და არ არის პორტი 22, 80 ან 443, ავტომატურად დაიბლოკება.

    Allow outgoing: შენს სერვერს შეუძლია ნებისმიერ პორტზე გავიდეს გარეთ (მაგალითად, განახლებების გადმოსაწერად).

## ნაგულისხმევი პოლიტიკის დაყენება
ეს ბრძანებები ცხადად აყენებს წესს "ყველაფერი შემომავალი დაბლოკე, გამავალი დაუშვი" (ჩვეულებრივ ufw ისედაც ასეა): <br>
```bash
sudo ufw default deny incoming
```
```bash
sudo ufw default allow outgoing
```

!!! warning
    წესების თანმიმდევრობა მნიშვნელოვანია: SSH (22) ჯერ დაუშვი და მერე ჩართე `ufw enable`, თორემ SSH-ით გამოიკეტები. გასაუქმებლად VM-ის კონსოლიდან (VirtualBox-ის ფანჯრიდან): `sudo ufw disable`.

## წესების ნუმერაციით ნახვა
```bash
sudo ufw status numbered
```
```console
Status: active

     To                         Action      From
     --                         ------      ----
[ 1] 22/tcp                     ALLOW IN    Anywhere
[ 2] 80/tcp                     ALLOW IN    Anywhere
[ 3] 443/tcp                    ALLOW IN    Anywhere
[ 4] 22/tcp (v6)                ALLOW IN    Anywhere (v6)
[ 5] 80/tcp (v6)                ALLOW IN    Anywhere (v6)
[ 6] 443/tcp (v6)               ALLOW IN    Anywhere (v6)
```

## შემოწმება host-იდან
დაშვებული პორტი (SSH) მუშაობს: <br>
```bash
ssh k@192.168.56.10
```
პორტი, რომელიც არ არის დაშვებული (მაგალითად 8080), დაბლოკილია: <br>
```bash
timeout 3 bash -c 'echo > /dev/tcp/192.168.56.10/8080' && echo open || echo blocked
```
```console
blocked
```
ასე დასტურდება Task-ის შედეგი: firewall აქტიურია და მხოლოდ 22, 80, 443 პორტებია ღია.

