# დღე 3: ბევრი ფაილის დალაგება და ძებნა

## Task 13: არეული დოკუმენტები (30 ცალი)
```bash
cd ~/linux-week1/incoming
mkdir a b c
for i in $(seq 1 30); do
  n=$(printf "%03d" $i)
  case $(( (i-1) % 3 )) in 0) env=dev;; 1) env=staging;; 2) env=prod;; esac
  case $(( (i-1) / 10 )) in 0) d=a;; 1) d=b;; 2) d=c;; esac
  printf "ID: DOC-%s\nEnvironment: %s\nDescription: sample document %s about %s service\n" "$n" "$env" "$n" "$env" > "$d/doc$n.txt"
done
# დამალული სახელები და ერთნაირი სახელები სხვადასხვა საქაღალდეში:
mv a/doc001.txt a/.doc001.txt; mv b/doc011.txt b/.doc011.txt; mv c/doc021.txt c/.doc021.txt
mv a/doc002.txt a/report.txt;  mv b/doc012.txt b/report.txt;  mv c/doc022.txt c/report.txt
```
ციკლის ახსნა: `seq 1 30` რიცხვები; `printf "%03d"` ნულებით (`001`); `case ... % 3` ანაწილებს გარემოებს (10 თითოზე); `/ 10` ანაწილებს საქაღალდეებს; `printf ... >` წერს სამხაზიან ფაილს.
- ✅ სამივე საქაღალდეში 10-10 ფაილი, სამი დამალული, სამი `report.txt` **განსხვავებული შიგთავსით**.
- 💡 **ფაილის სახელს არ ვენდობით:** `report.txt` სამ ადგილას სამი სხვადასხვა დოკუმენტია. ID და გარემო **შიგთავსშია**.

## Task 14: ინვენტარი
```bash
cd ~/linux-week1
find incoming -type f | sort | while read f; do
  echo "$(sed -n 1p "$f") | $(sed -n 2p "$f") | $f"
done > reports/inventory.txt
wc -l reports/inventory.txt                         # 30
grep -rh "^ID:" incoming | sort | uniq -d           # ცარიელი = დუბლიკატი არ არის
find incoming -name ".*" -type f                     # დამალული: 3
cp -r incoming backups/initial-incoming
```
- ✅ `30` ხაზი; დუბლიკატების სია ცარიელია; სამი დამალული ფაილი ნაპოვნია და ინვენტარშია.
- 💡 `find -type f` ყველა ფაილს ითვლის, დამალულებსაც. გადავამოწმეთ: რაოდენობა = 30, `find -name ".*"` = 3, `uniq -d` = ცარიელი.

## Task 15: დალაგება
```bash
cd ~/linux-week1
mkdir documents/dev documents/staging documents/prod
> reports/document-map.txt
find incoming -type f | sort | while read f; do
  id=$(sed -n 1p "$f" | cut -d' ' -f2)
  env=$(sed -n 2p "$f" | cut -d' ' -f2)
  echo "$id: $f -> documents/$env/$id.txt" >> reports/document-map.txt
  mv -n "$f" "documents/$env/$id.txt"
done
ls documents/dev | wc -l          # 10 (იგივე staging, prod)
find incoming -type f | wc -l     # 0
wc -l reports/document-map.txt    # 30
```
- 💡 **გადაწერის თავიდან აცილება:** ახალი სახელი **უნიკალური ID-დან** იქმნება (შიგთავსიდან), და `mv -n` არსებულ ფაილს არ გადააწერს. რუკაში **ჯერ ჩავწერეთ**, მერე გადავიტანეთ.

## Task 16: მოძებნა
```bash
cd ~/linux-week1
find . -type d | head          # დირექტორიები
find . -type f | head          # ფაილები
find . -name ".*" -type f      # დამალულები
find . -name "*.txt" | head    # გაფართოებით
grep -r "DOC-017" documents                     # შიგთავსით: ID
grep -rl "Environment: prod" documents | head   # გარემოთი
grep -rl "staging service" documents | head     # აღწერის სიტყვით
```
- 🔴 `find` ეძებს **სახელს**, `grep` **შიგთავსს**. შედეგი: `documents/staging/DOC-017.txt:ID: DOC-017`.

## Task 17: კოპირება და გადატანა
```bash
cd ~/linux-week1/playground && mkdir ext-test && cd ext-test
touch a.txt b.txt c.TXT d.TXT e.log f.log
mkdir copy-here moved-logs
cp *.txt copy-here/
mv *.log moved-logs/
ls . copy-here moved-logs
```
| ფაილი | ბოლოს სად არის | რატომ |
|---|---|---|
| `a.txt`, `b.txt` | ძველ ადგილას **და** `copy-here`-ში | `cp` ორიგინალს ტოვებს |
| `e.log`, `f.log` | მხოლოდ `moved-logs`-ში | `mv` აცილებს წყაროდან |
| `c.TXT`, `d.TXT` | მხოლოდ ძველ ადგილას | `*.txt` რეგისტრს არჩევს |

## Task 18: წაშლა
```bash
cd ~/linux-week1
find incoming                              # მხოლოდ ცარიელი ქვედირექტორიები
rmdir incoming/a incoming/b incoming/c     # incoming რჩება
cd playground
mkdir emptydir fulldir && touch fulldir/x.txt
rmdir emptydir                              # კარგია
rmdir fulldir                               # შეცდომა: Directory not empty
cp -r fulldir ~/linux-week1/backups/fulldir-copy
rm -r fulldir                               # ასლის შემდეგ
```
- 🔴 **წაშლამდე:** `pwd`, `ls`/`find`, ცარიელია თუ არა; მნიშვნელოვანზე **ჯერ ასლი**. **ტერმინალში წაშლა საბოლოოა:** სანაგვე ყუთი არ არსებობს. `rmdir` არაცარიელზე უარს ამბობს და ეს დაცვაა.

---

**წინა:** [დღე 2](day2.md) · **შემდეგი:** [დღე 4](day4.md)
