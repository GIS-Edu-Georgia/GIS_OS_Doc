# PyQGIS — CSV და TXT ფაილებთან მუშაობა

> **წინაპირობები:** QGIS გარემო, Python Console ან Script Editor
> **თემა:** ფაილური ოპერაციები, ატრიბუტების ექსპორტი/იმპორტი

---

## 0. სამუშაო ფაილები

მაგალითებში გამოყენებული ფაილები ინახება დოკუმენტაციის GitHub რეპოზიტორიაში, საქაღალდეში
[`sample_data/temperatures`](https://github.com/GIS-Edu-Georgia/GIS_OS_Doc/tree/main/docs/Programming/PyQGIS/sample_data/temperatures).

| ფაილი | შიგთავსი | ჩამოწერა |
|-------|----------|----------|
| `temperatures.csv` | `station, temp_c, date` | [ჩამოწერა](https://raw.githubusercontent.com/GIS-Edu-Georgia/GIS_OS_Doc/main/docs/Programming/PyQGIS/sample_data/temperatures/temperatures.csv) |
| `exported_temperatures.csv` | `X, Y, station, temp_c, date` (EPSG:4326) | [ჩამოწერა](https://raw.githubusercontent.com/GIS-Edu-Georgia/GIS_OS_Doc/main/docs/Programming/PyQGIS/sample_data/temperatures/exported_temperatures.csv) |

ფაილების ხელით ჩამოწერის ნაცვლად შეგიძლია სკრიპტმა თვითონ ჩამოწეროს ისინი `C:/qgis_data` საქაღალდეში:

```py title="download_sample_data.py" linenums="1"
import os
import urllib.request

BASE = ("https://raw.githubusercontent.com/GIS-Edu-Georgia/GIS_OS_Doc/main/"
        "docs/Programming/PyQGIS/sample_data/temperatures/")

folder = "C:/qgis_data"
os.makedirs(folder, exist_ok=True)   # საქაღალდე თუ არ არსებობს, შეიქმნას

for name in ("temperatures.csv", "exported_temperatures.csv"):
    target = os.path.join(folder, name)
    urllib.request.urlretrieve(BASE + name, target)
    print("ჩამოწერილია:", target)
```

!!! note "შენიშვნა"
    ქვემოთ ყველა მაგალითი იყენებს გზას `C:/qgis_data/`. სხვა საქაღალდის შემთხვევაში შეცვალე `folder` და გზები სკრიპტებში.

---

## 1. CSV ფაილის წაკითხვა და დაბეჭდვა

CSV (Comma-Separated Values) — ყველაზე გავრცელებული ფორმატი ცხრილური მონაცემებისთვის.

### 1.1 — მარტივი წაკითხვა `open()`-ით

```py title="csv_read_simple.py" linenums="1"
import os

# ფაილის მისამართი
csv_path = "C:/qgis_data/temperatures.csv"

# ფაილის გახსნა და სტრიქონ-სტრიქონ წაკითხვა
with open(csv_path, "r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())  # .strip() — ცარიელ სივრცეებს/\n-ს შლის

# შედეგი:
# station,temp_c,date
# Tbilisi,17,2024-07-01
# Kutaisi,21,2024-07-01
# Batumi,24,2024-07-01
```

---

### 1.2 — `csv` მოდულით — სვეტების გამოყოფა

```py title="csv_read_module.py" linenums="1"
import csv

csv_path = "C:/qgis_data/temperatures.csv"

with open(csv_path, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)  # სათაური სვეტი ავტომატურად გამოიყოფა

    for row in reader:
        station = row["station"]
        temp    = row["temp_c"]
        date    = row["date"]

        print(f"სადგური: {station} | ტემპ: {temp}°C | თარიღი: {date}")

# შედეგი:
# სადგური: Tbilisi | ტემპ: 17°C | თარიღი: 2024-07-01
# სადგური: Kutaisi | ტემპ: 21°C | თარიღი: 2024-07-01
# სადგური: Batumi  | ტემპ: 24°C | თარიღი: 2024-07-01
```

> 💡 `csv.DictReader` — თითოეულ სტრიქონს **dictionary**-ად კითხულობს.
> სვეტის სახელი გახდება გასაღები (`key`), მნიშვნელობა — `value`.

---

### 1.3 — მხოლოდ კონკრეტული სვეტის დაბეჭდვა

```py title="csv_read_column.py" linenums="1"
import csv

csv_path = "C:/qgis_data/temperatures.csv"

temps = []  # ცარიელი სია

with open(csv_path, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)

    for row in reader:
        temps.append(float(row["temp_c"]))  # მხოლოდ temp_c სვეტი

print("ყველა ტემპერატურა:", temps)
print("საშუალო:", sum(temps) / len(temps))
print("მაქსიმუმი:", max(temps))
print("მინიმუმი:", min(temps))

# შედეგი:
# ყველა ტემპერატურა: [17.0, 21.0, 24.0]
# საშუალო: 20.666...
# მაქსიმუმი: 24.0
# მინიმუმი: 17.0
```

---

## 2. კონკრეტული ჩანაწერის TXT ფაილში ჩაწერა

### 2.1 — ერთი მნიშვნელობის ჩაწერა

```py title="txt_write_single.py" linenums="1"
import csv

csv_path = "C:/qgis_data/temperatures.csv"
txt_path = "C:/qgis_data/max_temp.txt"

# CSV-დან მაქსიმალური ტემპერატურის სადგურის პოვნა
with open(csv_path, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    rows = list(reader)

# სიაში ყველაზე მაღალი temp_c
max_row = max(rows, key=lambda r: float(r["temp_c"]))

# TXT ფაილში ჩაწერა
with open(txt_path, "w", encoding="utf-8") as out:
    out.write(f"მაქსიმალური ტემპერატურა:\n")
    out.write(f"სადგური : {max_row['station']}\n")
    out.write(f"ტემპ.   : {max_row['temp_c']}°C\n")
    out.write(f"თარიღი  : {max_row['date']}\n")

print(f"შედეგი ჩაიწერა: {txt_path}")
```

> ⚠️ `"w"` — **write** რეჟიმი. ფაილი **ახლიდან** იქმნება (ძველი შიგთავსი იშლება).
> `"a"` — **append** რეჟიმი. ახალი ტექსტი **ბოლოს** ემატება.

---

### 2.2 — ფილტრირებული ჩანაწერების ჩაწერა

```py title="txt_write_filtered.py" linenums="1"
import csv

csv_path = "C:/qgis_data/temperatures.csv"
txt_path = "C:/qgis_data/hot_stations.txt"

threshold = 20.0  # ზღვარი — 20°C-ზე მეტი სადგურები

with open(csv_path, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)

    with open(txt_path, "w", encoding="utf-8") as out:
        out.write(f"სადგურები ტემპ. > {threshold}°C\n")
        out.write("=" * 35 + "\n")

        for row in reader:
            if float(row["temp_c"]) > threshold:
                line = f"{row['station']:12} {row['temp_c']:>6}°C   {row['date']}\n"
                out.write(line)

print("ფაილი შეიქმნა:", txt_path)

# hot_stations.txt შინაარსი:
# სადგურები ტემპ. > 20.0°C
# ===================================
# Kutaisi       21.0°C   2024-07-01
# Batumi        24.0°C   2024-07-01
```

---

## 3. TXT ფაილიდან წაკითხვა

### 3.1 — მთელი ფაილის წაკითხვა

```py title="txt_read_all.py" linenums="1"
txt_path = "C:/qgis_data/hot_stations.txt"

with open(txt_path, "r", encoding="utf-8") as f:
    content = f.read()  # მთლიანი შიგთავსი — ერთ სტრიქონად

print(content)
```

---

### 3.2 — სტრიქონ-სტრიქონ დამუშავება

```py title="txt_read_lines.py" linenums="1"
txt_path = "C:/qgis_data/hot_stations.txt"

with open(txt_path, "r", encoding="utf-8") as f:
    lines = f.readlines()  # სია სტრიქონებით

for i, line in enumerate(lines, start=1):
    print(f"სტრ.{i:02d}: {line.strip()}")

# შედეგი:
# სტრ.01: სადგურები ტემპ. > 20.0°C
# სტრ.02: ===================================
# სტრ.03: Kutaisi       21.0°C   2024-07-01
# სტრ.04: Batumi        24.0°C   2024-07-01
```

---

## 4. PyQGIS — წერტილოვანი შრის ატრიბუტების CSV-ში შენახვა

### 4.1 — აქტიური შრის ტემპერატურების ექსპორტი

```py title="layer_to_csv.py" linenums="1"
import csv

# აქტიური შრის მიღება QGIS-ისგან
layer = iface.activeLayer()

# გამოსავალი ფაილი
csv_path = "C:/qgis_data/exported_temperatures.csv"

# სვეტის სახელები (ველები)
field_names = [field.name() for field in layer.fields()]

with open(csv_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=field_names)
    writer.writeheader()  # სათაური სტრიქონი

    for feature in layer.getFeatures():
        row = {}
        for field in field_names:
            row[field] = feature[field]
        writer.writerow(row)

print(f"ექსპორტირებულია {layer.featureCount()} ობიექტი")
print(f"ფაილი: {csv_path}")
```

---

### 4.2 — კონკრეტული ველების ექსპორტი კოორდინატებით

```py title="layer_to_csv_with_coords.py" linenums="1"
import csv

layer = iface.activeLayer()
csv_path = "C:/qgis_data/stations_export.csv"

with open(csv_path, "w", newline="", encoding="utf-8") as f:

    # სათაურები: X, Y კოორდინატები + ატრიბუტები
    fieldnames = ["X", "Y", "station", "temp_c", "date"]
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()

    for feature in layer.getFeatures():
        geom  = feature.geometry()
        point = geom.asPoint()  # წერტილის კოორდინატები

        writer.writerow({
            "X"       : round(point.x(), 6),
            "Y"       : round(point.y(), 6),
            "station" : feature["station"],
            "temp_c"  : feature["temp_c"],
            "date"    : feature["date"]
        })

print("CSV შეიქმნა:", csv_path)

# exported_temperatures.csv:
# X,Y,station,temp_c,date
# 44.783,41.693,Tbilisi,17,2024-07-01
# 42.700,42.269,Kutaisi,21,2024-07-01
# 41.642,41.637,Batumi,24,2024-07-01
```

> 💡 `geom.asPoint()` — მუშაობს მხოლოდ **Point** ტიპის გეომეტრიაზე.
> `point.x()` — გრძედი (Longitude / Easting)
> `point.y()` — განედი (Latitude / Northing)

---

### 4.3 — CSV-დან კელვინში კონვერტაცია და ახალი CSV-ში ჩაწერა

```py title="csv_celsius_to_kelvin.py" linenums="1"
import csv

input_path  = "C:/qgis_data/exported_temperatures.csv"
output_path = "C:/qgis_data/temperatures_kelvin.csv"

with open(input_path, "r", encoding="utf-8") as fin, \
     open(output_path, "w", newline="", encoding="utf-8") as fout:

    reader = csv.DictReader(fin)

    # ახალი სვეტი temp_k ემატება
    fieldnames = reader.fieldnames + ["temp_k"]
    writer = csv.DictWriter(fout, fieldnames=fieldnames)
    writer.writeheader()

    for row in reader:
        row["temp_k"] = float(row["temp_c"]) + 273.15
        writer.writerow(row)

print("კელვინის ფაილი შეიქმნა:", output_path)

# temperatures_kelvin.csv:
# X,Y,station,temp_c,date,temp_k
# 44.783,41.693,Tbilisi,17,2024-07-01,290.15
# 42.700,42.269,Kutaisi,21,2024-07-01,294.15
# 41.642,41.637,Batumi,24,2024-07-01,297.15
```

---

### 4.4 — CSV-დან PyQGIS შრეში ჩატვირთვა (ვიზუალიზაცია)

```py title="csv_to_layer.py" linenums="1"
from qgis.core import QgsVectorLayer

csv_path = "C:/qgis_data/exported_temperatures.csv"

# URI — QGIS-ის CSV პროვაიდერის ფორმატი
uri = (
    f"file:///{csv_path}"
    "?delimiter=,"
    "&xField=X"
    "&yField=Y"
    "&crs=EPSG:4326"   # WGS 84 კოორდინატთა სისტემა
)

# შრის შექმნა
layer = QgsVectorLayer(uri, "ტემპერატურები", "delimitedtext")

if layer.isValid():
    QgsProject.instance().addMapLayer(layer)
    print(f"შრე დაემატა: {layer.featureCount()} ობიექტი")
else:
    print("შეცდომა: შრე არ ჩაიტვირთა")
```

---

## 5. დამატებითი — ყველა ოპერაციის შეჯამება

```py title="full_pipeline.py" linenums="1"
"""
სრული მაგალითი:
1. CSV-ის წაკითხვა
2. ანალიზი
3. შედეგების TXT-ში ჩაწერა
4. PyQGIS შრის ექსპორტი
"""

import csv
from qgis.core import QgsVectorLayer

# ---- 1. CSV წაკითხვა ----
csv_in = "C:/qgis_data/temperatures.csv"

with open(csv_in, "r", encoding="utf-8") as f:
    data = list(csv.DictReader(f))

temps  = [float(r["temp_c"]) for r in data]
avg_t  = sum(temps) / len(temps)
max_r  = max(data, key=lambda r: float(r["temp_c"]))
min_r  = min(data, key=lambda r: float(r["temp_c"]))

# ---- 2. TXT ანგარიში ----
txt_out = "C:/qgis_data/report.txt"

with open(txt_out, "w", encoding="utf-8") as out:
    out.write("=== ტემპერატურების ანგარიში ===\n\n")
    out.write(f"სადგურების რაოდენობა : {len(data)}\n")
    out.write(f"საშუალო ტემპ.        : {avg_t:.2f}°C\n")
    out.write(f"მაქს. სადგური        : {max_r['station']} ({max_r['temp_c']}°C)\n")
    out.write(f"მინ. სადგური         : {min_r['station']} ({min_r['temp_c']}°C)\n")

print("ანგარიში შეიქმნა:", txt_out)

# ---- 3. PyQGIS შრის ექსპორტი ----
layer = iface.activeLayer()
csv_out = "C:/qgis_data/layer_export.csv"

if layer:
    fields = [f.name() for f in layer.fields()]
    with open(csv_out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["X", "Y"] + fields)
        w.writeheader()
        for feat in layer.getFeatures():
            pt  = feat.geometry().asPoint()
            row = {"X": round(pt.x(), 6), "Y": round(pt.y(), 6)}
            row.update({fn: feat[fn] for fn in fields})
            w.writerow(row)
    print(f"შრე ექსპორტირდა: {layer.featureCount()} ობიექტი")
```

---

## 📋 მეთოდების ცხრილი

| მეთოდი | გამოყენება | მოდული |
|--------|-----------|--------|
| `open(path, "r")` | ფაილის წაკითხვა | built-in |
| `open(path, "w")` | ფაილის ახლიდან ჩაწერა | built-in |
| `open(path, "a")` | ბოლოს დამატება | built-in |
| `csv.DictReader` | CSV სვეტებად წაკითხვა | `csv` |
| `csv.DictWriter` | CSV სვეტებად ჩაწერა | `csv` |
| `iface.activeLayer()` | აქტიური QGIS შრე | PyQGIS |
| `layer.getFeatures()` | ობიექტების იტერაცია | PyQGIS |
| `feature.geometry().asPoint()` | წერტილის კოორდინატები | PyQGIS |
| `QgsVectorLayer(uri, ...)` | CSV-დან შრის შექმნა | PyQGIS |

---

> **შემდეგი თემა:** ატრიბუტების განახლება (`changeAttributeValue`), სივრცული შეკითხვები, WKT/WKB ფორმატები.