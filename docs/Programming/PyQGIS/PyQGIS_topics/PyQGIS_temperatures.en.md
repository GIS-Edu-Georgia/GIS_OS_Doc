# PyQGIS — working with CSV and TXT files

> **Prerequisites:** a QGIS environment, the Python Console or Script Editor
> **Topic:** file operations, exporting/importing attributes

---

## 0. Working files

The files used in the examples are stored in the documentation's GitHub repository, in the folder
[`sample_data/temperatures`](https://github.com/GIS-Edu-Georgia/GIS_OS_Doc/tree/main/docs/Programming/PyQGIS/sample_data/temperatures).

| File | Contents | Download |
|-------|----------|----------|
| `temperatures.csv` | `station, temp_c, date` | [download](https://raw.githubusercontent.com/GIS-Edu-Georgia/GIS_OS_Doc/main/docs/Programming/PyQGIS/sample_data/temperatures/temperatures.csv) |
| `exported_temperatures.csv` | `X, Y, station, temp_c, date` (EPSG:4326) | [download](https://raw.githubusercontent.com/GIS-Edu-Georgia/GIS_OS_Doc/main/docs/Programming/PyQGIS/sample_data/temperatures/exported_temperatures.csv) |

Instead of downloading the files by hand, you can let a script download them into the `C:/qgis_data` folder:

```py title="download_sample_data.py" linenums="1"
import os
import urllib.request

BASE = ("https://raw.githubusercontent.com/GIS-Edu-Georgia/GIS_OS_Doc/main/"
        "docs/Programming/PyQGIS/sample_data/temperatures/")

folder = "C:/qgis_data"
os.makedirs(folder, exist_ok=True)   # create the folder if it does not exist

for name in ("temperatures.csv", "exported_temperatures.csv"):
    target = os.path.join(folder, name)
    urllib.request.urlretrieve(BASE + name, target)
    print("Downloaded:", target)
```

!!! note "Note"
    All the examples below use the path `C:/qgis_data/`. If you use another folder, change `folder` and the paths in the scripts.

---

## 1. Reading and printing a CSV file

CSV (Comma-Separated Values) is the most common format for tabular data.

### 1.1 — simple reading with `open()`

```py title="csv_read_simple.py" linenums="1"
import os

# file path
csv_path = "C:/qgis_data/temperatures.csv"

# open the file and read it line by line
with open(csv_path, "r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())  # .strip() removes whitespace/\n

# result:
# station,temp_c,date
# Tbilisi,17,2024-07-01
# Kutaisi,21,2024-07-01
# Batumi,24,2024-07-01
```

---

### 1.2 — with the `csv` module — splitting the columns

```py title="csv_read_module.py" linenums="1"
import csv

csv_path = "C:/qgis_data/temperatures.csv"

with open(csv_path, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)  # the header row is split off automatically

    for row in reader:
        station = row["station"]
        temp    = row["temp_c"]
        date    = row["date"]

        print(f"Station: {station} | Temp: {temp}°C | Date: {date}")

# result:
# Station: Tbilisi | Temp: 17°C | Date: 2024-07-01
# Station: Kutaisi | Temp: 21°C | Date: 2024-07-01
# Station: Batumi  | Temp: 24°C | Date: 2024-07-01
```

> 💡 `csv.DictReader` reads each line as a **dictionary**.
> The column name becomes the `key`, and the cell becomes the `value`.

---

### 1.3 — printing only one column

```py title="csv_read_column.py" linenums="1"
import csv

csv_path = "C:/qgis_data/temperatures.csv"

temps = []  # an empty list

with open(csv_path, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)

    for row in reader:
        temps.append(float(row["temp_c"]))  # only the temp_c column

print("All temperatures:", temps)
print("Mean:", sum(temps) / len(temps))
print("Maximum:", max(temps))
print("Minimum:", min(temps))

# result:
# All temperatures: [17.0, 21.0, 24.0]
# Mean: 20.666...
# Maximum: 24.0
# Minimum: 17.0
```

---

## 2. Writing a specific record to a TXT file

### 2.1 — writing a single value

```py title="txt_write_single.py" linenums="1"
import csv

csv_path = "C:/qgis_data/temperatures.csv"
txt_path = "C:/qgis_data/max_temp.txt"

# find the station with the highest temperature in the CSV
with open(csv_path, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    rows = list(reader)

# the highest temp_c in the list
max_row = max(rows, key=lambda r: float(r["temp_c"]))

# write to a TXT file
with open(txt_path, "w", encoding="utf-8") as out:
    out.write(f"Maximum temperature:\n")
    out.write(f"Station : {max_row['station']}\n")
    out.write(f"Temp.   : {max_row['temp_c']}°C\n")
    out.write(f"Date    : {max_row['date']}\n")

print(f"Result written: {txt_path}")
```

> ⚠️ `"w"` is **write** mode. The file is created **from scratch** (the old contents are deleted).
> `"a"` is **append** mode. New text is added **at the end**.

---

### 2.2 — writing filtered records

```py title="txt_write_filtered.py" linenums="1"
import csv

csv_path = "C:/qgis_data/temperatures.csv"
txt_path = "C:/qgis_data/hot_stations.txt"

threshold = 20.0  # threshold — stations above 20°C

with open(csv_path, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)

    with open(txt_path, "w", encoding="utf-8") as out:
        out.write(f"Stations with temp. > {threshold}°C\n")
        out.write("=" * 35 + "\n")

        for row in reader:
            if float(row["temp_c"]) > threshold:
                line = f"{row['station']:12} {row['temp_c']:>6}°C   {row['date']}\n"
                out.write(line)

print("File created:", txt_path)

# contents of hot_stations.txt:
# Stations with temp. > 20.0°C
# ===================================
# Kutaisi       21.0°C   2024-07-01
# Batumi        24.0°C   2024-07-01
```

---

## 3. Reading from a TXT file

### 3.1 — reading the whole file

```py title="txt_read_all.py" linenums="1"
txt_path = "C:/qgis_data/hot_stations.txt"

with open(txt_path, "r", encoding="utf-8") as f:
    content = f.read()  # the whole contents as one string

print(content)
```

---

### 3.2 — processing line by line

```py title="txt_read_lines.py" linenums="1"
txt_path = "C:/qgis_data/hot_stations.txt"

with open(txt_path, "r", encoding="utf-8") as f:
    lines = f.readlines()  # a list of lines

for i, line in enumerate(lines, start=1):
    print(f"line {i:02d}: {line.strip()}")

# result:
# line 01: Stations with temp. > 20.0°C
# line 02: ===================================
# line 03: Kutaisi       21.0°C   2024-07-01
# line 04: Batumi        24.0°C   2024-07-01
```

---

## 4. PyQGIS — saving a point layer's attributes to CSV

### 4.1 — exporting the temperatures of the active layer

```py title="layer_to_csv.py" linenums="1"
import csv

# get the active layer from QGIS
layer = iface.activeLayer()

# output file
csv_path = "C:/qgis_data/exported_temperatures.csv"

# column names (fields)
field_names = [field.name() for field in layer.fields()]

with open(csv_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=field_names)
    writer.writeheader()  # the header row

    for feature in layer.getFeatures():
        row = {}
        for field in field_names:
            row[field] = feature[field]
        writer.writerow(row)

print(f"Exported {layer.featureCount()} features")
print(f"File: {csv_path}")
```

---

### 4.2 — exporting specific fields with coordinates

```py title="layer_to_csv_with_coords.py" linenums="1"
import csv

layer = iface.activeLayer()
csv_path = "C:/qgis_data/stations_export.csv"

with open(csv_path, "w", newline="", encoding="utf-8") as f:

    # headers: X, Y coordinates + attributes
    fieldnames = ["X", "Y", "station", "temp_c", "date"]
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()

    for feature in layer.getFeatures():
        geom  = feature.geometry()
        point = geom.asPoint()  # the point's coordinates

        writer.writerow({
            "X"       : round(point.x(), 6),
            "Y"       : round(point.y(), 6),
            "station" : feature["station"],
            "temp_c"  : feature["temp_c"],
            "date"    : feature["date"]
        })

print("CSV created:", csv_path)

# exported_temperatures.csv:
# X,Y,station,temp_c,date
# 44.783,41.693,Tbilisi,17,2024-07-01
# 42.700,42.269,Kutaisi,21,2024-07-01
# 41.642,41.637,Batumi,24,2024-07-01
```

> 💡 `geom.asPoint()` only works on **Point** geometry.
> `point.x()` — longitude (Longitude / Easting)
> `point.y()` — latitude (Latitude / Northing)

---

### 4.3 — converting to Kelvin from a CSV and writing a new CSV

```py title="csv_celsius_to_kelvin.py" linenums="1"
import csv

input_path  = "C:/qgis_data/exported_temperatures.csv"
output_path = "C:/qgis_data/temperatures_kelvin.csv"

with open(input_path, "r", encoding="utf-8") as fin, \
     open(output_path, "w", newline="", encoding="utf-8") as fout:

    reader = csv.DictReader(fin)

    # a new column temp_k is added
    fieldnames = reader.fieldnames + ["temp_k"]
    writer = csv.DictWriter(fout, fieldnames=fieldnames)
    writer.writeheader()

    for row in reader:
        row["temp_k"] = float(row["temp_c"]) + 273.15
        writer.writerow(row)

print("Kelvin file created:", output_path)

# temperatures_kelvin.csv:
# X,Y,station,temp_c,date,temp_k
# 44.783,41.693,Tbilisi,17,2024-07-01,290.15
# 42.700,42.269,Kutaisi,21,2024-07-01,294.15
# 41.642,41.637,Batumi,24,2024-07-01,297.15
```

---

### 4.4 — loading a CSV into a PyQGIS layer (visualization)

```py title="csv_to_layer.py" linenums="1"
from qgis.core import QgsVectorLayer

csv_path = "C:/qgis_data/exported_temperatures.csv"

# URI — the format of the QGIS CSV provider
uri = (
    f"file:///{csv_path}"
    "?delimiter=,"
    "&xField=X"
    "&yField=Y"
    "&crs=EPSG:4326"   # WGS 84 coordinate system
)

# create the layer
layer = QgsVectorLayer(uri, "Temperatures", "delimitedtext")

if layer.isValid():
    QgsProject.instance().addMapLayer(layer)
    print(f"Layer added: {layer.featureCount()} features")
else:
    print("Error: the layer did not load")
```

---

## 5. Extra — all operations together

```py title="full_pipeline.py" linenums="1"
"""
A full example:
1. read the CSV
2. analyse it
3. write the results to TXT
4. export the PyQGIS layer
"""

import csv
from qgis.core import QgsVectorLayer

# ---- 1. read the CSV ----
csv_in = "C:/qgis_data/temperatures.csv"

with open(csv_in, "r", encoding="utf-8") as f:
    data = list(csv.DictReader(f))

temps  = [float(r["temp_c"]) for r in data]
avg_t  = sum(temps) / len(temps)
max_r  = max(data, key=lambda r: float(r["temp_c"]))
min_r  = min(data, key=lambda r: float(r["temp_c"]))

# ---- 2. TXT report ----
txt_out = "C:/qgis_data/report.txt"

with open(txt_out, "w", encoding="utf-8") as out:
    out.write("=== Temperature report ===\n\n")
    out.write(f"Number of stations : {len(data)}\n")
    out.write(f"Mean temp.         : {avg_t:.2f}°C\n")
    out.write(f"Max. station       : {max_r['station']} ({max_r['temp_c']}°C)\n")
    out.write(f"Min. station       : {min_r['station']} ({min_r['temp_c']}°C)\n")

print("Report created:", txt_out)

# ---- 3. export the PyQGIS layer ----
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
    print(f"Layer exported: {layer.featureCount()} features")
```

---

## 📋 Methods table

| Method | Use | Module |
|--------|-----------|--------|
| `open(path, "r")` | Read a file | built-in |
| `open(path, "w")` | Overwrite a file | built-in |
| `open(path, "a")` | Append to the end | built-in |
| `csv.DictReader` | Read CSV by columns | `csv` |
| `csv.DictWriter` | Write CSV by columns | `csv` |
| `iface.activeLayer()` | The active QGIS layer | PyQGIS |
| `layer.getFeatures()` | Iterate over features | PyQGIS |
| `feature.geometry().asPoint()` | Point coordinates | PyQGIS |
| `QgsVectorLayer(uri, ...)` | Create a layer from a CSV | PyQGIS |

---

> **Next topic:** updating attributes (`changeAttributeValue`), spatial queries, WKT/WKB formats.
