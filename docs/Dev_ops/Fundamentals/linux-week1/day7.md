# დღე 7: გადაცემა, შემოწმება, ჩაბარება

## Task 37: გადატანა ორ კომპიუტერს შორის
**ორივე ბრძანება კლიენტზე სრულდება** (`scp`-ს კლიენტი იწყებს):
```bash
# კლიენტზე (laptop-ის prompt)
scp linuxlab:linux-week1/backups/week1-backup.tar.gz ~/linux-lab-notes/day7/
scp ~/linux-lab-notes/day7/week1-backup.tar.gz linuxlab:linux-week1/transfer/week1-backup-returned.tar.gz
# სერვერზე (ssh linuxlab)
cd ~/linux-week1
tar -tzf transfer/week1-backup-returned.tar.gz | head -5
mkdir -p restore/returned
tar -xzf transfer/week1-backup-returned.tar.gz -C restore/returned
cat restore/returned/releases/v1/site/index.html
```
- ✅ ზომა ორივე მხარეს `2753` ბაიტია; არქივი იკითხება, შიგთავსი სწორია.
- 💡 **პირველ ეტაპზე** წყარო = VM, დანიშნულება = კლიენტი. **მეორეზე** პირიქით. ორივეჯერ ბრძანება **კლიენტიდან** გავუშვით.
- ⚠️ ამოღების ბრძანებები **სერვერზე** უნდა გაეშვას (პირველად კლიენტზე გავუშვით და `No such file or directory` მივიღეთ).

## Task 38: შეცდომის წაკითხვა
```bash
cd ~/linux-week1/playground
cd no-such-dir          # cd: no-such-dir: No such file or directory
cat no-such-file.txt    # cat: ...: No such file or directory
touch taken
mkdir taken             # mkdir: taken: File exists
# გასწორება
mkdir no-such-dir && cd no-such-dir && cd ..
echo "now exists" > no-such-file.txt && cat no-such-file.txt
mv taken taken.txt && mkdir taken
ls -ld taken taken.txt
```
- 💡 **შეცდომა ამბობს, რა არ არსებობს ან რა სახელია დაკავებული.** გავასწორეთ **გარემო** (შევქმენით რაც აკლდა, ან სახელი გავათავისუფლეთ), არა ბრძანება.

## Task 39: სრული გადამოწმება (`checklist.txt`)
```bash
cd ~/linux-week1
ln -sfn releases/v2 current
> reports/checklist.txt
echo "documents total: $(find documents -type f | wc -l) (expected 30)" >> reports/checklist.txt
echo "unique IDs: $(grep -rh '^ID:' documents | sort | uniq | wc -l) (expected 30)" >> reports/checklist.txt
echo "dev/staging/prod docs: $(ls documents/dev | wc -l)/$(ls documents/staging | wc -l)/$(ls documents/prod | wc -l) (expected 10/10/10)" >> reports/checklist.txt
echo ".env files: $(find environments -name .env | wc -l) (expected 3)" >> reports/checklist.txt
echo "app.conf files: $(ls environments/*/config/app.conf | wc -l) (expected 3)" >> reports/checklist.txt
echo "errors.log lines: $(wc -l < reports/errors.log) (expected 15)" >> reports/checklist.txt
echo "prod-errors.log lines: $(wc -l < reports/prod-errors.log) (expected 5)" >> reports/checklist.txt
echo "world-writable (symlinks excluded): $(find . -not -type l -perm -o+w | wc -l) (expected 0)" >> reports/checklist.txt
echo "private.txt perms: $(stat -c %a playground/access/private.txt) (expected 600)" >> reports/checklist.txt
echo "current -> $(readlink current) (expected releases/v2)" >> reports/checklist.txt
echo "v1: $(cat releases/v1/VERSION.txt), v2: $(cat releases/v2/VERSION.txt)" >> reports/checklist.txt
cat reports/checklist.txt
```
- ⚠️ **ჩვენი პირველი ვარიანტი `3`-ს გვიჩვენებდა** (`find . -perm -o+w`), სადაც ეს სამი სიმბოლური ბმული იყო (`current` და ორი ამოღებული ასლის `current`). ბმულებს ყოველთვის `777` ჩანს და ეს არაფერს ნიშნავს. გამოვრიცხეთ `-not -type l`-ით და მივიღეთ `0`.
- 💡 **ფაილის არსებობა არ კმარა:** უნდა შევამოწმოთ **რაოდენობა, შიგთავსი, უფლებები, ბმულები**. ზუსტად **შედარებამ „მიღებული vs მოსალოდნელი"** აღმოაჩინა ცრუ განგაში.

## Task 40: გადაბარება (`HANDOVER.txt`)
შენივე სიტყვებით, ექვსი ნაწილი: **სტრუქტურა, გარემოები, დოკუმენტის პოვნა, მიმდინარე რელიზი, backup, აღდგენის შემოწმება** (თითო 2-3 ხაზი). მაგ. დოკუმენტის პოვნა: `grep -r "DOC-017" documents`; მიმდინარე რელიზი: `current -> releases/v2`, გადართვა `ln -sfn releases/v1 current`.
- 💡 **გუნდური მუშაობა:** გადაბარებული ტექსტი გვაძლევს საშუალებას, ახალმა ადამიანმა მხოლოდ მისი წაკითხვით იპოვოს ყველაფერი, ჩვენს გარეშე.

## Task 41: ჩასაბარებელი არქივი
```bash
cd ~
tar -czf FIRSTNAME-LASTNAME-linux-week1.tar.gz linux-week1
mkdir verify-extract
tar -xzf FIRSTNAME-LASTNAME-linux-week1.tar.gz -C verify-extract
ls -la verify-extract/linux-week1                 # დამალულებიც ჩანს
find verify-extract -name ".*" -type f | head     # .env და .doc ფაილები
ls -l verify-extract/linux-week1/current          # ბმული ბმულად
rm -r verify-extract
```
- ✅ არქივი `linux-week1`-ის **გარეთაა**; `.ssh` არ შედის; დამალული ფაილები და `current -> releases/v2` ამოვიდა.
- 💡 **თვითონ არქივს ვამოწმებთ**, რადგან დაზიანებული ან არასრული არქივი ჩაბარებისას უშედეგოა.
- ⚠️ `FIRSTNAME-LASTNAME` შაბლონი **შენი სახელით** ჩაანაცვლე (ჩვენ თავიდან ისე დავტოვეთ და `mv`-ით გავასწორეთ).

## Task 42: დაცვა
იხ. [დაცვა](defense.md).

---

**წინა:** [დღე 6](day6.md) · **შემდეგი:** [შეცდომების კატალოგი](errors.md)
