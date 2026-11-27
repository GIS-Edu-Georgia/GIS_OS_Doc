# 🔤 Attribute field types — Shapefile and GeoPackage

Like a spreadsheet, a vector layer's attribute table is made of **fields** (columns) and **records** (rows). Each field has a **data type** that determines what kind of value can be stored in it — an integer, a decimal, text, a date, etc.

!!! warning "Important"
    The field type and its limits **depend on the file format**. The same data is stored differently in a Shapefile and in a GeoPackage. Choosing the right format and type avoids **losing or distorting data** (e.g. dropping the time from a date, truncating text, cutting a field name short).

---

## 📊 Basic data types (theory)

| Type | Description | Example |
|------|--------|----------|
| **Integer / int** | A whole number (no decimals) | `42`, `-7`, `2025` |
| **Integer64 / bigint** | A large whole number (64-bit) | `9000000000` |
| **Real / Double / Float** | A decimal (floating-point) number | `3.14`, `-0.5`, `1250.75` |
| **String / Text** | A text value | `"road"`, `"Tbilisi"` |
| **Date** | A date (year-month-day) | `2025-07-10` |
| **DateTime** | Date + time | `2025-07-10 14:30:00` |
| **Boolean** | A logical value | `True` / `False` |

!!! info "Integer vs Double"
    - **Integer** — a whole number; it does not store decimals (`5`, not `5.0`).
    - **Double / Float** — stores the decimal part (`5.75`). `Double` (64-bit) is more precise than `Float` (32-bit).
    - If you store area or length — use **Double**; if you store a count of objects or an ID — **Integer**.

---

## 🗂️ Shapefile field types (.dbf)

In a Shapefile, attributes are stored in a **`.dbf` (dBASE)** file. This is an old format, and it has **strict limits**.

### Supported types

| dBASE code | QGIS name | Description | Limit |
|:---:|---|---|---|
| `C` | **Text (string)** | Text | **max. 254 characters** |
| `N` | **Integer (32 bit)** | Whole number | width ≤ 10 digits (int32) |
| `N` | **Integer64 (64 bit)** | Large whole number | width ≤ 18–20; not stored reliably |
| `N`/`F` | **Real / Double** | Decimal number | width + precision (max. ~15 significant digits) |
| `D` | **Date** | Date | format `YYYYMMDD`, **date only** |
| `L` | **Boolean** | Logical (T/F) | 1 character |

### ❗ The main limits of Shapefile

- 🏷️ **Field name — at most 10 characters.** A longer name is cut automatically (`temperature` → `temperatur`), which can cause **duplicates**.
- ✂️ **Text — at most 254 characters.** Longer text is **truncated**.
- ⏰ **There is no `DateTime` or `Time` type.** Only **`Date`**. The time part **is lost**.
- 🔢 **`Integer64` is not fully supported** — very large numbers can be damaged or turned into `Real`.
- 🈳 **Weak support for `NULL` (empty) values** — an empty field is often stored as `0` or as empty text.
- 🌍 **Encoding problems** — Georgian/Unicode text needs a correct `.cpg` file (UTF-8), otherwise the text gets garbled.
- 📐 **One geometry type per file** (Point / Line / Polygon — separately).

!!! danger "A typical mistake"
    If you store **a date and time** (`2025-07-10 14:30`) in a Shapefile field, the time **is lost** — only `2025-07-10` is stored. In this case, use **GeoPackage**.

---

## 📦 GeoPackage field types (.gpkg)

**GeoPackage** (`.gpkg`) is a modern, open (OGC) format built on an **SQLite** database. Its type system is **much richer and more flexible** than Shapefile's.

### Supported types

| GeoPackage type | Range / description | QGIS equivalent |
|---|---|---|
| `BOOLEAN` | `0` / `1` (true/false) | Boolean |
| `TINYINT` | 8-bit integer (−128…127) | Integer |
| `SMALLINT` | 16-bit integer | Integer |
| `MEDIUMINT` | 32-bit integer | **Integer (32 bit)** |
| `INTEGER` / `INT` | 64-bit integer | **Integer64 (64 bit)** |
| `FLOAT` | 32-bit decimal | Real (float) |
| `DOUBLE` / `REAL` | 64-bit decimal | **Real (double)** |
| `TEXT` / `TEXT(n)` | Text (**no limit**, or max. `n`) | **Text** |
| `DATE` | Date `YYYY-MM-DD` | Date |
| `DATETIME` | Date + time (ISO 8601, with time zone) | **DateTime** |
| `BLOB` | Binary data (e.g. an image) | Binary |

### ✅ Advantages of GeoPackage over Shapefile

- 🏷️ **No 10-character limit on field names.**
- 📝 **Text is practically unlimited** (the 254-character limit no longer applies).
- ⏱️ **Full `DateTime` support** — date, time and time zone are stored.
- 🔢 **Real 64-bit `Integer64`** support.
- 🈳 **Full `NULL` support** (empty ≠ zero).
- 🌍 **UTF-8 encoding is built in** — Georgian text is stored without problems.
- 🗃️ **Many layers in one file** (and many geometry types) — unlike Shapefile.
- 📁 **One file** instead of `.shp/.shx/.dbf/.prj/.cpg`.

---

## ⚖️ Shapefile vs GeoPackage — comparing fields

| Characteristic | 🗂️ Shapefile (`.dbf`) | 📦 GeoPackage (`.gpkg`) |
|---|:---:|:---:|
| Field name length | **≤ 10 characters** | Practically unlimited |
| Text length | **≤ 254 characters** | Unlimited / `TEXT(n)` |
| Integer (32 bit) | ✅ | ✅ (`MEDIUMINT`) |
| Integer64 (64 bit) | ⚠️ unreliable | ✅ (`INTEGER`) |
| Real / Double | ✅ | ✅ (`DOUBLE`) |
| Date | ✅ | ✅ |
| **DateTime (date+time)** | ❌ | ✅ |
| Boolean | ✅ (`L`) | ✅ (`BOOLEAN`) |
| Binary / BLOB | ❌ | ✅ |
| NULL value | ⚠️ weak | ✅ full |
| UTF-8 (Georgian) | ⚠️ depends on `.cpg` | ✅ built in |
| Number of files | min. 3 (`.shp/.shx/.dbf`) | 1 (`.gpkg`) |

!!! tip "Recommendation"
    For new projects use **GeoPackage** — it does not have Shapefile's limits (field name, text length, date+time). Keep Shapefile only **for compatibility** (e.g. when exchanging with older programs).

---

## 🔗 Additional resources

- [Shapefile — Wikipedia](https://en.wikipedia.org/wiki/Shapefile)
- [GeoPackage — official site (OGC)](https://www.geopackage.org/)
- [GeoPackage Encoding Standard — data types](https://www.geopackage.org/spec/#table_column_data_types)
- [GDAL — ESRI Shapefile drivers](https://gdal.org/drivers/vector/shapefile.html)
- [GDAL — GeoPackage vector driver](https://gdal.org/drivers/vector/gpkg.html)
