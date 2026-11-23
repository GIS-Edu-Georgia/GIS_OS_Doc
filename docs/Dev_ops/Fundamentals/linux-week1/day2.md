# დღე 2: საქაღალდეები, ფაილები, გზები

## Task 07: სამი გარემო
```bash
cd ~/linux-week1
mkdir -p environments/{dev,staging,prod}/{app,config,logs}
mkdir -p incoming documents backups restore releases reports transfer playground
ls -R | head -40
```
- ✅ `ls -R` აჩვენებს 3×3 გარემოს საქაღალდეებს და ცალკე რვა საქაღალდეს.
- 💡 **ახსნა:** *dev* = შემუშავება და ექსპერიმენტი; *staging* = prod-ის რეპეტიცია (იგივე სტრუქტურით) ტესტისთვის; *prod* = რეალური მუშა გარემო. **ვაცალკევებთ**, რომ ექსპერიმენტმა რეალურ სერვისს ზიანი არ მიაყენოს; ასევე **კონფიგურაცია** განსხვავებულია და **წვდომა** მხოლოდ საჭიროთათვის.

## Task 08: ნავიგაცია და გზები
```bash
cd ~/linux-week1/environments/dev && cat ../../hello.txt   # შეფარდებითი
cd /tmp && cat ~/linux-week1/hello.txt                       # აბსოლუტური (~ გაიშლება)
cd ~ && cat linux-week1/hello.txt                            # შეფარდებითი home-დან
```
`reports/paths.txt`-ში 5 აბსოლუტური + 5 შეფარდებითი, თითო საწყისი დირექტორიით:
```
/home/<user>/linux-week1/hello.txt
~/linux-week1/environments/dev:   ../../hello.txt
```
- 🔴 **აბსოლუტური** იწყება `/`-ით და **ნებისმიერი ადგილიდან** მუშაობს. **შეფარდებითი** გამოითვლება **მიმდინარე დირექტორიიდან** (`..` ზემოთ, `./` აქ).
- 💡 `../../hello.txt` მუშაობს მხოლოდ `environments/dev`-იდან; `/tmp`-იდან ვერ იმუშავებს.

## Task 09: შიგთავსიანი ფაილები
```bash
cd ~/linux-week1/environments/dev/app
cat > info.txt <<'EOF'
Environment: dev
Name: demo-shop
Owner: team-a
Purpose: testing new features
Status: unstable
EOF
echo "1.0.0-dev" > version.txt
echo "dev-team@example.com" > contacts.txt
```
იგივე staging და prod-ზე **სხვა ვერსიებით** (`1.4.0-rc`, `1.3.2`) და გამოგონილი კონტაქტებით.
- ✅ `cat environments/*/app/version.txt` სამ განსხვავებულ ვერსიას აჩვენებს.
- 💡 `touch` ქმნის **ცარიელ** ფაილს (ზომა 0). `echo "ტექსტი" > f` ქმნის ფაილს და **ჩაწერს ტექსტს**. `echo` ბეჭდავს, ჩაწერას `>` აკეთებს.

## Task 10: დამალული ფაილები (`.env`)
```bash
cat > ~/linux-week1/environments/dev/config/.env <<'EOF'
ENV_NAME=dev
APP_NAME=demo-shop
DB_HOST=db-dev.example
CACHE_TTL=60
FEATURE_X=on
EOF
ls  ~/linux-week1/environments/dev/config      # არ ჩანს
ls -a ~/linux-week1/environments/dev/config    # ჩანს
```
- 🔴 წერტილით დაწყებული სახელი ფაილს **ზოგადი `ls`-იდან მალავს**. ეს **დაცვა არ არის**: `ls -a` ან `cat .env` ნებისმიერს აჩვენებს. რეალური დაცვა არის **უფლებები**.

## Task 11: სახელები, რომლებიც აგვრევს
```bash
cd ~/linux-week1/playground
echo "lowercase" > report.txt
echo "uppercase R" > Report.txt
echo "with space" > "final report.txt"
mkdir dirA dirB
echo "notes in A" > dirA/notes.txt
echo "notes in B" > dirB/notes.txt
cat report.txt; cat Report.txt; cat "final report.txt"
```
- 🔴 **რეგისტრი:** `report.txt` და `Report.txt` **სხვადასხვა** ფაილებია. **გამოტოვება:** ბრჭყალების (ან `\ `) გარეშე shell ორ სახელად აღიქვამს. **სრული მისამართი:** `notes.txt` ორ საქაღალდეშია, ამიტომ მისამართი განსაზღვრავს, რომელი გვინდა.

## Task 12: სამუშაო ასლი
```bash
cd ~/linux-week1
cp -r environments backups/initial-environments
echo "Status: updated" >> environments/dev/app/info.txt
cat backups/initial-environments/dev/app/info.txt     # ძველი
cat environments/dev/app/info.txt                      # ახალი
cat environments/staging/app/info.txt                  # უცვლელი
ls -a backups/initial-environments/dev/config          # .env ასლშიც არის
```
- ✅ ასლში ძველი ტექსტი, სამუშაოში ახალი, დანარჩენი გარემოები უცვლელი; `.env` ასლშიც.
- 💡 `cp` ქმნის **ახალ დამოუკიდებელ ასლს** (საკუთარი შიგთავსით დისკზე), ამიტომ ორიგინალის შეცვლა ასლს არ ეხება. (ბმული კი **მიუთითებს** ორიგინალზე. იხ. Task 32.)

---

**წინა:** [დღე 1](day1.md) · **შემდეგი:** [დღე 3](day3.md)
