# დღე 5: კონფიგურაცია და უფლებები

## Task 25: `app.conf`
```bash
cd ~/linux-week1/environments
cat > dev/config/app.conf <<'EOF'
APP_NAME=demo-shop
APP_ENV=dev
LOG_LEVEL=DEBUG
PORT=8081
EOF
# staging: APP_ENV=staging, LOG_LEVEL=INFO, PORT=8082;  prod: APP_ENV=prod, LOG_LEVEL=INFO, PORT=8083
cat */config/app.conf
```
- 💡 **პორტის ჩაწერა ფაილში არ ნიშნავს ამ პორტზე პროგრამის გაშვებას:** ფაილი მხოლოდ ტექსტია. პროგრამა ცალკე უნდა გაეშვას და ამ ფაილს თვითონ უნდა წაიკითხოს.

## Task 26: მხოლოდ საჭირო ცვლილებები
```bash
cd ~/linux-week1
mkdir -p backups/config-before/{dev,staging,prod}
cp environments/dev/config/app.conf     backups/config-before/dev/
cp environments/staging/config/app.conf backups/config-before/staging/
cp environments/prod/config/app.conf    backups/config-before/prod/
sed -i 's/^PORT=.*/PORT=9090/'                 environments/dev/config/app.conf
sed -i 's/^APP_NAME=.*/APP_NAME=demo-shop-stg/' environments/staging/config/app.conf
sed -i 's/^LOG_LEVEL=.*/LOG_LEVEL=DEBUG/'       environments/prod/config/app.conf
grep -H "PORT" backups/config-before/dev/app.conf environments/dev/config/app.conf   # ძველი/ახალი
sed -i 's/^LOG_LEVEL=.*/LOG_LEVEL=INFO/' environments/prod/config/app.conf            # prod უკან
```
- 🔴 `sed -i 's/ძველი/ახალი/'` ცვლის ტექსტს **ადგილზე**; `^PORT=.*` ნიშნავს „ხაზი, რომელიც PORT=-ით იწყება".
- 💡 ძველი ვერსია **უკან დასაბრუნებლად** ვინახავთ. სამივე ფაილს ერთნაირად არ ვცვლით: თითო გარემოს თავისი ფუნქცია აქვს, dev-ის ცვლილება prod-ს არ უნდა შეეხოს.

## Task 27: უფლებების დაყენება
```bash
cd ~/linux-week1/playground && mkdir access && cd access
touch public.txt team.txt private.txt
chmod 644 public.txt     # rw-r--r--
chmod 640 team.txt       # rw-r-----
chmod 600 private.txt    # rw-------
ls -l
```
- ⚠️ ნაგულისხმევი უფლება იყო `-rw-rw-r--`: ჯგუფს ჩაწერა და სხვებს წაკითხვა ჰქონდათ: `private.txt`-ისთვის ბევრია.
- 🔴 **მფლობელი** (ფაილის შემქმნელი), **ჯგუფი** (იმ ჯგუფის წევრები), **სხვები** (ყველა დანარჩენი); `r`, `w`, `x` ცხრილი იხ. 2.5.

## Task 28: ჩაწერის შეცდომა
```bash
touch locked.txt
chmod 400 locked.txt            # r--------
echo "text" >> locked.txt       # bash: locked.txt: Permission denied
chmod 600 locked.txt
echo "text" >> locked.txt; cat locked.txt
```
- 💡 **როგორ მივხვდი, რომ მიზეზი უფლება იყო:** შეტყობინებაა `Permission denied`, არა `No such file or directory`, და `ls -l` აჩვენებს, რომ ფაილი **არსებობს** (`-r--------`, `w` არ არის).

## Task 29: დირექტორიაში შესვლა
```bash
cd ~/linux-week1/playground
mkdir secret-dir && echo "hello" > secret-dir/file.txt
chmod 600 secret-dir            # rw- : x არ არის
ls secret-dir                   # სახელები ჩანს (r აქვს)
cd secret-dir                   # Permission denied (x აკლია)
cat secret-dir/file.txt         # Permission denied
chmod 700 secret-dir            # x დაბრუნდა
cd secret-dir && cat file.txt
```
- 🔴 დირექტორიაზე: `r` = სახელების ნახვა, `w` = შიგ შექმნა/წაშლა, `x` = **შესვლა**. ფაილზე `x` = გაშვება.

## Task 30: უსაფრთხოების შემოწმება
```bash
cd ~/linux-week1
ls -lR playground/access
find . -not -type l -perm -o+w     # ყველასთვის ჩაწერადი ფაილი/დირექტორია: უნდა იყოს ცარიელი
```
- ⚠️ ჩვეულებრივი `find . -perm -o+w` დაგვიბრუნებს სიმბოლურ ბმულებს (`current`), რადგან ბმულებს ყოველთვის `777` ჩანს: ეს ცრუ განგაშია (იხ. Task 39).
- 💡 `777` ყველას აძლევს წაშლის და შეცვლის უფლებას: ნებისმიერ მომხმარებელს შეუძლია მონაცემი დააზიანოს. სწორი წესია **მხოლოდ საჭირო უფლება**.

---

**წინა:** [დღე 4](day4.md) · **შემდეგი:** [დღე 6](day6.md)
