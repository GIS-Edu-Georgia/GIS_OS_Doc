# WKT and WKB — a full explanation

> **OGC standard | geometry encoding | GIS | PostGIS | PyQGIS**

**WKT** and **WKB** are two standards for geometry **serialization**. Both are formats defined by the OGC (Open Geospatial Consortium) that represent geometric shapes (point, line, polygon...) **uniformly**, regardless of language or platform.

---

## 📋 Contents

1. [Basic definition](#basic_definition)
2. [WKT — Well-Known Text](#wkt_well-known_text)
3. [WKB — Well-Known Binary](#wkb_well-known_binary)
4. [Similarities and differences](#similarities_and_differences)
5. [Geometry types](#geometry_types)
6. [3D and M variants](#3d_and_m_variants)
7. [EWKT and EWKB — the PostGIS extension](#ewkt_and_ewkb_the_postgis_extension)
8. [Use in PostGIS](#use_in_postgis)
9. [Use in PyQGIS](#use_in_pyqgis)
10. [Use in other technologies](#use_in_other_technologies)
11. [The OGC standard](#the_ogc_standard)
12. [Comparison table](#comparison_table)

---

## 🔑 Basic definition

```
geometry (in memory)
         │
         ├──→  WKT  →  "POINT (41.69 44.83)"          ← read by people
         │
         └──→  WKB  →  0101000000...3D0A57404048F340   ← read by computers
```

| | **WKT** | **WKB** |
|--|---------|---------|
| Full name | Well-Known Text | Well-Known Binary |
| Format | Text (ASCII / UTF-8) | Binary (bytes) |
| Readability | ✅ for people | ❌ for people |
| Size | Large | Small (≈ 2-3x) |
| Speed | Slow (parsing) | Fast (direct read) |
| Standard | OGC SFA | OGC SFA |

---

## 📝 WKT — Well-Known Text

**WKT** is a **text** format for expressing geometry. It is human-readable, and ideal for debugging and documentation.

### WKT syntax

```
GEOMETRY_TYPE (coordinates)
```

### Simple examples

```
POINT (44.8015 41.6938)
```

```
LINESTRING (44.80 41.69, 44.81 41.70, 44.82 41.68)
```

```
POLYGON ((44.79 41.69, 44.82 41.69, 44.82 41.71, 44.79 41.71, 44.79 41.69))
```

> 💡 **Coordinate order:** in WKT the coordinates are in **`X Y`** order — in geographic systems X=**lon**, Y=**lat**.

### Structure of WKT

```
POLYGON (
    (
        44.79 41.69,    ← exterior ring — required
        44.82 41.69,
        44.82 41.71,
        44.79 41.71,
        44.79 41.69     ← first = last (closed)
    ),
    (
        44.80 41.695,   ← interior ring / hole — optional
        44.81 41.695,
        44.81 41.705,
        44.80 41.695
    )
)
```

---

## 💾 WKB — Well-Known Binary

**WKB** is a **binary** format: the same geometry, but **as bytes**. A computer reads it directly, no parsing needed.

### WKB structure

```
┌──────────┬──────────────┬──────────────────────────────────────┐
│  1 byte  │   4 bytes    │           N bytes                    │
│  byte    │   geometry   │           coordinates                │
│  order   │   type       │           (8 bytes per ordinate)     │
├──────────┼──────────────┼──────────────────────────────────────┤
│  01      │  01000000    │  000000000000F040  000000000048F340  │
│  (LE)    │  (Point=1)   │  X = 44.8015       Y = 41.6938      │
└──────────┴──────────────┴──────────────────────────────────────┘
```

### Byte order (endianness)

```
01 → Little-Endian (LE) — Intel/AMD x86 — the most common
00 → Big-Endian (BE)    — network byte order, SPARC
```

### WKB in hexadecimal form (HEX-WKB)

WKB is often used in databases and APIs as a **hexadecimal string**:

```
Point (44.8015, 41.6938) WKB Hex:
0101000000713D0A57404046403D0A573D0A4846 40

Parts:
01         → byte order (Little-Endian)
01000000   → geometry type (Point = 1)
713D0A5740404640 → X = 44.8015 (IEEE 754 double)
3D0A573D0A484640 → Y = 41.6938 (IEEE 754 double)
```

### WKB geometry type codes

```
1  → Point
2  → LineString
3  → Polygon
4  → MultiPoint
5  → MultiLineString
6  → MultiPolygon
7  → GeometryCollection

1001 → PointZ
1002 → LineStringZ
1003 → PolygonZ
2001 → PointM
3001 → PointZM
```

---

## 🔄 Similarities and differences

### Similarities

```
✅ both are OGC SFA (Simple Features Access) standards
✅ both represent the same geometry types
✅ both are reversible — WKT → WKB → WKT (without losing information)
✅ both support 2D, 3D (Z), M and ZM geometries
✅ both are CRS-independent (CRS info is in EWKT/EWKB)
```

### Differences — in depth

```
┌─────────────────────┬──────────────────────┬──────────────────────┐
│ Criterion           │ WKT                  │ WKB                  │
├─────────────────────┼──────────────────────┼──────────────────────┤
│ Format              │ ASCII string         │ bytes / hex string   │
│ Size (Point)        │ ~25 characters       │ 21 bytes             │
│ Size (Polygon 100p) │ ~2,500 characters    │ ~826 bytes           │
│ Compression         │ ≈1x (baseline)       │ ≈2-3x smaller        │
│ Parsing speed       │ slow (string parse)  │ fast (direct copy)   │
│ Readability         │ ✅ people can read it │ ❌ hex/bytes          │
│ Debug/explanation   │ ✅ ideal             │ ❌ hard               │
│ DB storage          │ TEXT column          │ BYTEA / geometry     │
│ Network transfer    │ in JSON/XML APIs     │ PostGIS native       │
│ Reading in SQL      │ ST_AsText()          │ ST_AsBinary()        │
│ Writing in SQL      │ ST_GeomFromText()    │ ST_GeomFromWKB()     │
└─────────────────────┴──────────────────────┴──────────────────────┘
```

### Size comparison — a real example

```python
# Point (44.8015, 41.6938)

WKT:  "POINT (44.8015 41.6938)"         → 23 characters = 23 bytes
WKB:  0101000000...                     → 21 bytes
      (header 5 + X 8 + Y 8 = 21)

# Polygon — 1000 points
WKT:  ≈ 22,000 bytes
WKB:  ≈  8,017 bytes   (≈ 2.7x smaller)
```

---

## 📐 Geometry types

### All types in WKT form

```sql
-- point
POINT (44.80 41.69)

-- line
LINESTRING (44.79 41.69, 44.82 41.70, 44.85 41.68)

-- polygon (without a hole)
POLYGON ((44.79 41.69, 44.82 41.69, 44.82 41.71, 44.79 41.71, 44.79 41.69))

-- polygon with a hole
POLYGON (
    (44.79 41.69, 44.83 41.69, 44.83 41.72, 44.79 41.72, 44.79 41.69),
    (44.80 41.70, 44.82 41.70, 44.82 41.71, 44.80 41.71, 44.80 41.70)
)

-- multiple points
MULTIPOINT ((44.80 41.69), (44.81 41.70), (44.82 41.68))

-- multiple lines
MULTILINESTRING (
    (44.79 41.69, 44.82 41.70),
    (44.83 41.68, 44.85 41.71)
)

-- multiple polygons
MULTIPOLYGON (
    ((44.79 41.69, 44.81 41.69, 44.81 41.71, 44.79 41.69)),
    ((44.82 41.70, 44.84 41.70, 44.84 41.72, 44.82 41.70))
)

-- mixed collection
GEOMETRYCOLLECTION (
    POINT (44.80 41.69),
    LINESTRING (44.79 41.69, 44.82 41.70),
    POLYGON ((44.83 41.68, 44.85 41.68, 44.85 41.70, 44.83 41.68))
)

-- empty geometry
POINT EMPTY
LINESTRING EMPTY
POLYGON EMPTY
```

---

## 🌐 3D and M variants

WKT/WKB support **Z** (elevation) and **M** (measure) coordinates:

### Z — elevation (3D)

```sql
POINT Z (44.80 41.69 520.5)
--                    ↑ elevation in meters

LINESTRING Z (44.79 41.69 400, 44.82 41.70 450, 44.85 41.68 380)

POLYGON Z ((44.79 41.69 300, 44.82 41.69 300, 44.82 41.71 300, 44.79 41.71 300, 44.79 41.69 300))
```

### M — measure

```sql
POINT M (44.80 41.69 125.5)
--                    ↑ measure (e.g. pipeline km, a time value)

LINESTRING M (44.79 41.69 0, 44.82 41.70 5.2, 44.85 41.68 10.8)
--                          ↑ km chainage
```

### ZM — elevation + measure

```sql
POINT ZM (44.80 41.69 520.5 125.5)
--                    ↑Z    ↑M

LINESTRING ZM (44.79 41.69 400 0, 44.82 41.70 450 5.2)
```

> 💡 **Use in Georgia:** in pipeline GIS, `M` is the **km chainage** and `Z` is the **elevation above sea level**. Both can be stored in one geometry (ZM).

---

## 🐘 EWKT and EWKB — the PostGIS extension

**EWKT** (Extended WKT) and **EWKB** (Extended WKB) are a PostGIS **extension** that adds **SRID** (CRS) information to the OGC standard.

### EWKT — with SRID

```sql
-- SRID=32638 → WGS84 / UTM Zone 38N
SRID=32638;POINT (490230.0 4741850.0)

SRID=4326;POINT (44.8015 41.6938)

SRID=32638;LINESTRING (490230 4741850, 491000 4742000, 491500 4741700)

SRID=4326;POLYGON ((44.79 41.69, 44.82 41.69, 44.82 41.71, 44.79 41.71, 44.79 41.69))
```

### EWKB — with SRID (hex)

```
In EWKB the SRID is embedded in the WKB header (with a special flag):

01           → byte order (LE)
01000020     → Point type + SRID flag (0x20000000)
E6100000     → SRID = 4326 (little-endian)
...          → coordinates
```

### WKT vs EWKT

```sql
WKT:   POINT (44.8015 41.6938)
EWKT:  SRID=4326;POINT (44.8015 41.6938)
       ↑ the SRID is written directly
```

> ⚠️ **OGC vs PostGIS:** EWKT/EWKB are **not an OGC standard** — they are a PostGIS-specific extension. For exchange with other systems, use OGC WKT/WKB.

---

## 🐘 Use in PostGIS

### Writing and reading WKT

```sql
-- create the table
CREATE TABLE pipeline_points (
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(100),
    geom    GEOMETRY(POINT, 32638)
);

-- insert from WKT — ST_GeomFromText()
INSERT INTO pipeline_points (name, geom)
VALUES (
    'Lake N1',
    ST_GeomFromText('POINT (490230.0 4741850.0)', 32638)
);

-- insert from EWKT — ST_GeomFromEWKT()
INSERT INTO pipeline_points (name, geom)
VALUES (
    'Lake N2',
    ST_GeomFromEWKT('SRID=32638;POINT (491000.0 4742000.0)')
);

-- read as WKT — ST_AsText()
SELECT name, ST_AsText(geom) AS wkt
FROM pipeline_points;
-- → "POINT(490230 4741850)"

-- read as EWKT — ST_AsEWKT()
SELECT name, ST_AsEWKT(geom) AS ewkt
FROM pipeline_points;
-- → "SRID=32638;POINT(490230 4741850)"
```

### Writing and reading WKB

```sql
-- read as WKB (hex) — ST_AsBinary() / ST_AsEWKB()
SELECT name,
       ST_AsBinary(geom)  AS wkb,    -- OGC WKB
       ST_AsEWKB(geom)    AS ewkb,   -- EWKB (with SRID)
       encode(ST_AsBinary(geom), 'hex') AS wkb_hex
FROM pipeline_points;

-- insert from WKB hex
INSERT INTO pipeline_points (name, geom)
VALUES (
    'Lake N3',
    ST_GeomFromWKB(decode('0101000020E6100000...', 'hex'))
);
```

### Useful PostGIS functions

```sql
-- type
SELECT ST_GeometryType(geom) FROM pipeline_points;  -- → "ST_Point"

-- SRID
SELECT ST_SRID(geom) FROM pipeline_points;           -- → 32638

-- validation
SELECT ST_IsValid(geom), ST_IsValidReason(geom) FROM pipeline_points;

-- WKT → GeoJSON
SELECT ST_AsGeoJSON(geom) FROM pipeline_points;

-- extract the coordinates
SELECT ST_X(geom), ST_Y(geom) FROM pipeline_points;  -- → 490230, 4741850

-- CRS transformation, as WKT
SELECT ST_AsText(
    ST_Transform(geom, 4326)
) FROM pipeline_points;
-- → "POINT(44.8015 41.6938)"
```

---

## 🐍 Use in PyQGIS

### WKT → QgsGeometry

```python
from qgis.core import QgsGeometry, QgsWkbTypes

# create a geometry from WKT
geom_point = QgsGeometry.fromWkt("POINT (490230.0 4741850.0)")
geom_line  = QgsGeometry.fromWkt("LINESTRING (490230 4741850, 491000 4742000)")
geom_poly  = QgsGeometry.fromWkt(
    "POLYGON ((490000 4741000, 491000 4741000, 491000 4742000, 490000 4742000, 490000 4741000))"
)

# check validity
print(geom_point.isValid())         # → True
print(geom_point.type())            # → QgsWkbTypes.PointGeometry
print(QgsWkbTypes.displayString(geom_point.wkbType()))  # → "Point"
```

### QgsGeometry → WKT

```python
# convert to WKT
wkt = geom_point.asWkt()
print(wkt)
# → "Point (490230 4741850)"

# with a given precision
wkt_precise = geom_point.asWkt(precision=6)
print(wkt_precise)
# → "Point (490230.000000 4741850.000000)"
```

### WKB in QgsGeometry

```python
# QgsGeometry → WKB (bytes)
wkb_bytes = geom_point.asWkb()
print(type(wkb_bytes))   # → <class 'QByteArray'>
print(bytes(wkb_bytes).hex())
# → "0101000000000000004046174100000040..."

# WKB → QgsGeometry
from qgis.core import QgsGeometry

wkb_hex = "0101000000713D0A574040464..."
geom_from_wkb = QgsGeometry()
geom_from_wkb.fromWkb(bytes.fromhex(wkb_hex))
```

### A feature's geometry as WKT

```python
layer = iface.activeLayer()

for feature in layer.getFeatures():
    geom = feature.geometry()

    # WKT
    print(f"ID {feature.id()}: {geom.asWkt()}")

    # type
    print(f"  type: {QgsWkbTypes.displayString(geom.wkbType())}")

    # validation
    if not geom.isValid():
        print(f"  ⚠️ broken geometry: {geom.lastError()}")
        fixed = geom.makeValid()
        print(f"  ✅ fixed: {fixed.asWkt()}")
```

### Using WKT for new features

```python
from qgis.core import QgsFeature, QgsGeometry, QgsFields, QgsField
from PyQt5.QtCore import QVariant

# turn a list of WKT strings into features
wkt_list = [
    ("Pipeline KP 0",  "POINT ZM (490230 4741850 520 0)"),
    ("Pipeline KP 5",  "POINT ZM (491000 4742000 510 5)"),
    ("Pipeline KP 10", "POINT ZM (491500 4741700 505 10)"),
]

fields = QgsFields()
fields.append(QgsField('name', QVariant.String))
fields.append(QgsField('km',   QVariant.Double))

features = []
for name, wkt in wkt_list:
    feat = QgsFeature(fields)
    feat.setGeometry(QgsGeometry.fromWkt(wkt))
    feat['name'] = name
    features.append(feat)

print(f"✅ {len(features)} features prepared")
```

---

## 🌍 Use in other technologies

### Compared with GeoJSON

```
WKT:     POINT (44.80 41.69)
WKB:     0101000000...
GeoJSON: {"type": "Point", "coordinates": [44.80, 41.69]}
```

| | WKT | WKB | GeoJSON |
|--|-----|-----|---------|
| **Readability** | ✅ | ❌ | ✅ |
| **Size** | Medium | Small | Large |
| **Web API** | 🔶 | ❌ | ✅ |
| **DB storage** | ✅ | ✅ (native) | 🔶 |
| **CRS** | ❌ (✅ in EWKT) | ❌ (✅ in EWKB) | ❌ (CRS84 default) |

### Shapefile (.shp)

```
Shapefile → a binary format similar to WKB, but ESRI-specific.
In PostGIS: shp2pgsql → converts to WKB automatically.
```

### GML (Geography Markup Language)

```xml
<!-- GML — XML-based, an OGC standard -->
<gml:Point srsName="EPSG:4326">
    <gml:coordinates>44.80,41.69</gml:coordinates>
</gml:Point>
```

### KML (Google/OGC)

```xml
<Point>
    <coordinates>44.80,41.69,0</coordinates>
</Point>
```

### The Python shapely library

```python
from shapely import wkt, wkb
from shapely.geometry import Point, LineString, Polygon

# create from WKT
geom = wkt.loads("POINT (44.80 41.69)")

# convert to WKT
print(geom.wkt)           # → "POINT (44.8 41.69)"

# convert to WKB
wkb_bytes = wkb.dumps(geom)
print(wkb_bytes.hex())

# create from WKB
geom2 = wkb.loads(wkb_bytes)
print(geom2.wkt)

# operations based on WKT
poly = wkt.loads("POLYGON ((44.79 41.69, 44.82 41.69, 44.82 41.71, 44.79 41.71, 44.79 41.69))")
point_in = wkt.loads("POINT (44.80 41.70)")
point_out = wkt.loads("POINT (44.85 41.75)")

print(poly.contains(point_in))   # → True
print(poly.contains(point_out))  # → False
```

---

## 📜 The OGC standard

### SFA — Simple Features Access

**WKT** and **WKB** are defined in the OGC **Simple Features Access (SFA)** standard:

```
OGC 06-103r4 — OpenGIS Implementation Standard
"Geographic information — Simple feature access — Part 1: Common architecture"

ISO 19125-1:2004 — Geographic information — Simple feature access
```

### Evolution of the standard

```
1999 → OGC SFA 1.0 — the first version of WKT/WKB
2003 → OGC SFA 1.1 — multi-geometries
2006 → OGC SFA 1.2 — ISO 19125 adoption, Z/M support
2011 → OGC SFA 1.2.1 — the current standard
```

### PostGIS EWKT/EWKB — extensions

```
PostGIS introduced EWKT/EWKB:
  → embedding the SRID in the geometry
  → an alternative to ISO SQL/MM

ISO SQL/MM (ISO 13249-3):
  → geometry types in SQL
  → the standard for ST_ functions
  → PostGIS 1.5+ — full support
```

---

## 📊 Comparison table

### WKT vs WKB — full comparison

| Criterion | WKT | WKB | EWKT | EWKB |
|-----------|-----|-----|------|------|
| **Format** | ASCII text | binary/hex | ASCII text | binary/hex |
| **SRID** | ❌ | ❌ | ✅ | ✅ |
| **Readability** | ✅ | ❌ | ✅ | ❌ |
| **Size** | Large | Small | Large | Small |
| **Speed** | Slow | Fast | Slow | Fast |
| **OGC standard** | ✅ | ✅ | ❌ (PostGIS) | ❌ (PostGIS) |
| **PostGIS** | ✅ | ✅ | ✅ | ✅ |
| **PyQGIS** | ✅ | ✅ | ❌ | ❌ |
| **Shapely** | ✅ | ✅ | ❌ | ❌ |
| **GeoServer** | ✅ | ✅ | ✅ | ✅ |
| **Debug** | ✅ ideal | ❌ hard | ✅ | ❌ |
| **3D (Z)** | ✅ | ✅ | ✅ | ✅ |
| **M** | ✅ | ✅ | ✅ | ✅ |

### Where to use which

| Scenario | Recommended |
|---------|--------------|
| Writing to PostGIS | EWKT or EWKB |
| Debugging a PostGIS query | WKT (`ST_AsText()`) |
| Creating geometry in PyQGIS | WKT (`fromWkt()`) |
| DB export / exchange | WKT or GeoJSON |
| Native DB storage | WKB (automatic) |
| Web API | GeoJSON (WKT is less common) |
| Pipeline GIS | EWKT with ZM (SRID + Z + M) |
| Logs/documentation | WKT |

---

## 📌 Summary

```
WKT   → "POINT (44.80 41.69)"           ← readable, debug, API
WKB   → 0101000000...                   ← fast, DB native, compact
EWKT  → "SRID=4326;POINT (44.80 41.69)" ← PostGIS, with CRS
EWKB  → 0101000020E6100000...           ← PostGIS native storage
```

- **WKT**: read by people → use it for debugging, in documentation, in APIs
- **WKB**: read by computers → the native DB format, fast, compact
- **EWKT/EWKB**: a PostGIS extension → SRID embedded, **the standard in PostGIS**
- Both are **OGC SFA** standards and **convertible into each other** without losing information
- Z and M: **3D and measure** coordinates are built into the standard itself

👉 In PyQGIS → **`fromWkt()` / `asWkt()`** | In PostGIS → **`ST_GeomFromText()` / `ST_AsText()`**

---

## 📚 Resources used

- [OGC Simple Features Access Standard](https://www.ogc.org/standards/sfa)
- [PostGIS — WKT/WKB Functions](https://postgis.net/docs/reference.html#Geometry_Inputs)
- [PyQGIS — QgsGeometry](https://qgis.org/pyqgis/master/core/QgsGeometry.html)
- [Shapely — WKT/WKB](https://shapely.readthedocs.io/en/stable/manual.html#well-known-formats)
