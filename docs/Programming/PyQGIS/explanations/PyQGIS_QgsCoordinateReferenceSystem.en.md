# `QgsCoordinateReferenceSystem` in PyQGIS

**`QgsCoordinateReferenceSystem`** (short: `QgsCRS`) is the PyQGIS class that represents and manages **coordinate reference systems** (CRS). A CRS defines **how** a flat GIS map **relates** to the real surface of the Earth.

---

## 🔑 Main purpose

- storing and managing CRS information
- supporting EPSG codes and PROJ strings
- checking CRS validity
- getting information about units, the ellipsoid and the projection
- transforming coordinates from one CRS to another

---

## 📦 Import

```python
from qgis.core import (
    QgsCoordinateReferenceSystem,
    QgsCoordinateTransform,
    QgsProject
)
```

---

## ▶️ Creating a CRS

### By EPSG code (recommended)

```python
# WGS 84 — geographic coordinates
crs_geo = QgsCoordinateReferenceSystem("EPSG:4326")

# WGS 84 / UTM Zone 38N — Georgia
crs_utm = QgsCoordinateReferenceSystem("EPSG:32638")

print(crs_utm.isValid())      # → True
print(crs_utm.authid())       # → "EPSG:32638"
print(crs_utm.description())  # → "WGS 84 / UTM zone 38N"
```

### By PROJ string

```python
crs = QgsCoordinateReferenceSystem.fromProj(
    "+proj=longlat +datum=WGS84 +no_defs"
)
print(crs.isValid())   # → True
print(crs.authid())    # → "EPSG:4326"
```

### In WKT (Well-Known Text) format

```python
wkt = 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257]]]'

crs = QgsCoordinateReferenceSystem()
crs.createFromWkt(wkt)

print(crs.isValid())   # → True
```

> 💡 **Recommendation:** always use an **EPSG code**; it is the most readable and standard. Use a PROJ string or WKT only in special cases.

---

## 📖 Main methods

| Method | Purpose | Example |
|--------|------------|---------|
| `isValid()` | Is the CRS valid? | `True` / `False` |
| `authid()` | Authority ID | `"EPSG:32638"` |
| `description()` | Human-readable name | `"WGS 84 / UTM zone 38N"` |
| `mapUnits()` | Unit of measure | `QgsUnitTypes.DistanceMeters` |
| `toWkt()` | Convert to WKT | full WKT string |
| `toProj()` | PROJ string | `"+proj=utm +zone=38..."` |
| `ellipsoidAcronym()` | Ellipsoid name | `"WGS84"` |
| `isGeographic()` | Is it geographic? (degrees) | `True` for EPSG:4326 |
| `projectionAcronym()` | Projection name | `"utm"`, `"longlat"` |

---

## 🔍 Printing CRS information

```python
crs = QgsCoordinateReferenceSystem("EPSG:32638")

if crs.isValid():
    print("✅ CRS is valid")
    print("   Auth ID:     ", crs.authid())
    print("   Name:        ", crs.description())
    print("   Ellipsoid:   ", crs.ellipsoidAcronym())
    print("   Projection:  ", crs.projectionAcronym())
    print("   Geographic?: ", crs.isGeographic())
    print("   WKT:         ", crs.toWkt()[:60], "...")
else:
    print("❌ CRS is invalid")
```

**Output:**

```
✅ CRS is valid
   Auth ID:      EPSG:32638
   Name:         WGS 84 / UTM zone 38N
   Ellipsoid:    WGS84
   Projection:   utm
   Geographic?:  False
   WKT:          PROJCRS["WGS 84 / UTM zone 38N",BASEGEOGCRS["WGS 84" ...
```

---

## 🔄 Transforming coordinates — `QgsCoordinateTransform`

**Transforming a point** from one CRS to another:

```python
from qgis.core import (
    QgsCoordinateReferenceSystem,
    QgsCoordinateTransform,
    QgsPointXY,
    QgsProject
)

# source and target CRS
src_crs  = QgsCoordinateReferenceSystem("EPSG:32638")  # UTM 38N
dest_crs = QgsCoordinateReferenceSystem("EPSG:4326")   # WGS 84

# transform object
transform = QgsCoordinateTransform(
    src_crs,
    dest_crs,
    QgsProject.instance()
)

# a UTM coordinate (roughly Tbilisi)
point_utm = QgsPointXY(490230.0, 4741850.0)

# transform to WGS 84
point_geo = transform.transform(point_utm)

print(f"UTM:   X={point_utm.x():.1f},  Y={point_utm.y():.1f}")
print(f"WGS84: lon={point_geo.x():.6f}, lat={point_geo.y():.6f}")
```

**Output:**

```
UTM:   X=490230.0,  Y=4741850.0
WGS84: lon=44.796132, lat=42.835241
```

---

## 🗺️ Transforming a layer to another CRS

```python
from qgis.core import QgsVectorFileWriter, QgsProject

layer = iface.activeLayer()

# target CRS
dest_crs = QgsCoordinateReferenceSystem("EPSG:4326")

options = QgsVectorFileWriter.SaveVectorOptions()
options.driverName   = "ESRI Shapefile"
options.fileEncoding = "UTF-8"
options.ct = QgsCoordinateTransform(
    layer.crs(),
    dest_crs,
    QgsProject.instance()
)

output_path = r'C:\GIS\output_wgs84.shp'

error, _, _, _ = QgsVectorFileWriter.writeAsVectorFormatV3(
    layer,
    output_path,
    QgsProject.instance().transformContext(),
    options
)

if error == QgsVectorFileWriter.NoError:
    print(f"✅ Layer saved in WGS84: {output_path}")
else:
    print(f"❌ Error: {error}")
```

---

## 🌍 CRSs used in Georgia

| EPSG | Name | Use |
|------|--------|-----------|
| `EPSG:4326` | WGS 84 | GPS, geographic coordinates |
| `EPSG:32637` | WGS 84 / UTM Zone 37N | Western Georgia |
| `EPSG:32638` | WGS 84 / UTM Zone 38N | Eastern Georgia |
| `EPSG:5342` | ETRS89 / UTM Zone 38N | European standard |
| `EPSG:28408` | Pulkovo 1942 / GK Zone 8 | Old Soviet maps |

> 💡 **Recommendation for Georgia:** `EPSG:32638` — WGS 84 / UTM Zone 38N. Metric units, for correct area and length calculations.

---

## ⚠️ Common errors

### CRS mismatch

```python
layer1 = QgsVectorLayer(r'C:\GIS\roads.shp',    'Roads',    'ogr')
layer2 = QgsVectorLayer(r'C:\GIS\buildings.shp', 'Buildings', 'ogr')

# check whether they match
if layer1.crs() != layer2.crs():
    print("⚠️ The CRSs do not match!")
    print(f"   Roads:     {layer1.crs().authid()}")
    print(f"   Buildings: {layer2.crs().authid()}")
    print("   Transform them to one CRS before spatial analysis")
else:
    print("✅ The CRSs match")
```

### Validating a CRS

```python
crs = QgsCoordinateReferenceSystem("EPSG:99999")  # a non-existent code

if not crs.isValid():
    print("❌ The CRS is invalid — check the EPSG code")
```

---

## 📌 Summary

- **`QgsCoordinateReferenceSystem`** represents and manages a CRS in PyQGIS
- An **EPSG code** is the most convenient way to define a CRS
- **`isValid()`**: always check it after creating a CRS
- **`QgsCoordinateTransform`** transforms coordinates from one CRS to another
- **CRS mismatch** is the most common source of errors in spatial analysis
- For Georgia → **`EPSG:32638`** (UTM Zone 38N, meters)

👉 Before any spatial operation, **check the CRS**. This guarantees that area, length and location are **calculated correctly**.

---

## 📚 Resources used

- [QGIS Documentation — CRS](https://docs.qgis.org/latest/en/docs/user_manual/working_with_projections/working_with_projections.html)
- [PyQGIS Developer Cookbook — CRS](https://docs.qgis.org/latest/en/docs/pyqgis_developer_cookbook/crs.html)
- [EPSG Registry](https://epsg.io)
