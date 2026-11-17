Task 4 — SSH Configuration

## Bash commands
```bash
# SSH სერვერის ინსტალაცია და კონფიგურაცია
systemctl status ssh
sudo apt update
sudo apt install openssh-server
sudo systemctl enable ssh
sudo systemctl start ssh
```
```bash
# Firewall კონფიგურაცია
sudo ufw status
sudo ufw allow ssh
sudo ufw allow 22
```

## SSH Key Authentication 
მუშაობს "ბოქლომისა და გასაღების" პრინციპით: შენს კომპიუტერზე (Host) გაქვს Private Key (გასაღები), ხოლო სერვერზე აგდებ Public Key-ს (ბოქლომს).


## MobaXterm SSH Key Generator
MobaXterm-ს მოყვება ხელსაწყო, რომელიც ამას აკეთებს. <br>

გახსენი MobaXterm და მენიუში აირჩიე: Tools -> MobaKeyGen (SSH key generator). <br>
დააჭირე ღილაკს Generate და ამოძრავე მაუსი ცარიელ ადგილას (ეს საჭიროა შემთხვევითი  <br> მონაცემების შესაქმნელად).
გასაღები როცა შეიქმნება: <br>
Public Key: დააკოპირე ის გრძელი ტექსტი, რომელიც ფანჯრის ზედა ნაწილში გამოჩნდა (იწყება <br> ssh-rsa-ით).
Private Key: დააჭირე Save private key და შეინახე შენს კომპიუტერზე (მაგ: my_key.ppk).  <br>პაროლის (passphrase) დადება აუცილებელი არ არის, შეგიძლია გამოტოვო. <br>

key passphrase: ----

Public Key:
!!! example
    ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCC004lHrwHeoubnDFDZFcZidF84h3dwYmafcgUaT5/x0/ <br> qGEtDR2wXlDeFVOsE60EaUu0OBVtlSlwKhqUuOuH4n9WFaVgJwZdpdyKyHCpBH/krULumPLu9DL5<br>+58b8L4Ok8uI72F2n+gkJpNrynDbd/9lW20G00hPyGEIEMDljQaMOrUz6QbiopDiuYmpRy4vSRy7 <br>+PPy7NVv5okiAmHczZeybi3vPYOkTVXhYmdQq9IHoOgRPkk4e6cMuJuQoa9kjPhgERdmuFmlJ12KM27xSVX+R <br> +E0GD1hXq9B4mnrE1ivsZcYqJFvOFrc9mhEqdFcvsO3EQNm1Xwkcxg0WXeUL rsa-key-20260210 <br>

## Public Key-ს დამატება Ubuntu სერვერზე
ახლა სერვერს უნდა "ვასწავლოთ" შენი გასაღები. <br>

შედი სერვერზე (ჯერჯერობით პაროლით) MobaXterm-იდან.
შექმენი სპეციალური დირექტორია და ფაილი:
```bash
mkdir -p ~/.ssh
```
```bash
chmod 700 ~/.ssh
```
!!! tip
    ++ctrl+x++ დაგეხმარება გახსნილი ფაილის დახურვაში <br>
    ++ctrl+y++ დაგეხმარება დასტურში ფაილის სახელზე <br>
    ++enter++ უბრალოდ თანხმობა და ფაილი დაიხურება <br>

აქ შეგიძლია გასაღების ჩაშვება
```bash
nano ~/.ssh/authorized_keys
```
ჩასვი (Paste) ის ტექსტი, რომელიც წეღან MobaKeyGen-იდან დააკოპირე. <br>
შეინახე და გამოდი. <br>
მიანიჭე ფაილს სწორი უფლებები: <br>
```bash
chmod 600 ~/.ssh/authorized_keys
```

## MobaXterm-ის კონფიგურაცია
ახლა უნდა ვუთხრათ MobaXterm-ს, რომ ამ სერვერთან დაკავშირებისას გამოიყენოს შენი ფაილი. <br>

MobaXterm-ში დააწკაპუნე მარჯვენა ღილაკით შენს სესიაზე (Session) და აირჩიე Edit session. <br>
გადადი SSH settings ტაბში. <br>
მონიშნე Use private key. <br>
დააჭირე ლურჯ ხატულას და აირჩიე ის .ppk ფაილი, რომელიც ნაბიჯ 1-ში შეინახე. <br>
დააჭირე OK. <br>

## Electerm-ის კონფიგურაცია (Linux host)
Electerm საკუთარ SSH კლიენტს იყენებს და `~/.ssh/` ფოლდერს ავტომატურად არ კითხულობს, ამიტომ key ხელით უნდა მიუთითო. <br>

### 1. Key-ის შექმნა host-ზე
```bash
ssh-keygen -t ed25519 -C "k@k-M4700"
```
კითხვებზე დააჭირე Enter. შეიქმნება `~/.ssh/id_ed25519` (პრივატული) და `~/.ssh/id_ed25519.pub` (საჯარო). <br>

### 2. Public key-ის გადატანა VM-ზე
```bash
ssh-copy-id k@192.168.56.10
```
ერთხელ ჩაწერე VM-ის პაროლი. <br>

### 3. Electerm-ში bookmark
1. შექმენი ახალი bookmark.
2. **Host:** `192.168.56.10`, **Port:** `22`, **Username:** `k`.
3. პაროლის ველი დატოვე ცარიელი.
4. **Private Key** ველში ჩასვი პრივატული key-ის შიგთავსი (`-----BEGIN OPENSSH PRIVATE KEY-----`-დან `-----END ...`-მდე):
   ```bash
   cat ~/.ssh/id_ed25519
   ```
5. Passphrase დატოვე ცარიელი, თუ key-ის შექმნისას არ დაგიწერია.
6. შეინახე და დააჭირე Connect.

!!! warning
    პრივატული key-ი არავის გაუგზავნო და git-ში არ ატვირთო. მხოლოდ `.pub` ფაილია საჯარო.


## შემოწმება
გათიშე მიმდინარე სესია და ხელახლა დაუკავშირდი სერვერს. <br>
თუ ყველაფერი სწორად გააკეთე, სერვერი პაროლს აღარ მოგთხოვს და პირდაპირ ტერმინალში შეგიშვებს. <br>

## პაროლით შესვლის აკრძალვა

```bash
sudo nano /etc/ssh/sshd_config
```
მოძებნე ეს ხაზები და გადააკეთე ასე: <br>
```text
PasswordAuthentication no
PubkeyAuthentication yes
PermitRootLogin no
```
- `PasswordAuthentication no` — პაროლით შესვლა აკრძალულია, მხოლოდ key-ით
- `PubkeyAuthentication yes` — SSH key-ით ავტორიზაცია ჩართულია
- `PermitRootLogin no` — root იუზერით პირდაპირ შესვლა აკრძალულია

!!! warning
    ეს გააკეთე მხოლოდ მას შემდეგ, რაც key-ით შესვლა წარმატებით შეამოწმე, თორემ სერვერიდან გამოიკეტები.

!!! tip
    Ubuntu-ზე `/etc/ssh/sshd_config.d/` ფოლდერის ფაილებიც იკითხება და `50-cloud-init.conf`-ს შეუძლია `PasswordAuthentication yes` დააბრუნოს. ამიტომ სუფთა გზაა ცალკე ფაილი: `sudo nano /etc/ssh/sshd_config.d/00-keys-only.conf` და იმ სამი ხაზის ჩაწერა მასში. `00-` სახელი პირველი იკითხება და იმარჯვებს.

კონფიგურაციის შემოწმება გადატვირთვამდე: <br>
```bash
sudo sshd -t
```

### გადატვირთვა SSH
```bash
sudo systemctl restart ssh
```
