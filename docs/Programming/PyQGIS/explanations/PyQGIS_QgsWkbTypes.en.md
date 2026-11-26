# QgsWkbTypes in PyQGIS

**QgsWkbTypes** is the PyQGIS class that defines **geometry types**, i.e. it answers the question: "is this layer made of points, lines or polygons?"

---

## 🔑 The main idea

`QgsWkbTypes` contains **constants (enumerations)** that describe the geometry type according to the WKB (Well-Known Binary) format.

This class is used:

- when creating a new layer or file (`QgsVectorFileWriter`, `QgsMemoryLayer`)
- when checking a geometry type
- when defining an object's geometry

---

## 📐 Main geometry types

| Constant | Meaning | Use |
|-----------|-------------|-----------|
| `QgsWkbTypes.Point` | Point | House, station, other object |
| `QgsWkbTypes.LineString` | Line | Road, river, pipeline |
| `QgsWkbTypes.Polygon` | Polygon | Land parcel, lake, building |
| `QgsWkbTypes.MultiPoint` | Multiple points | Many points in one feature |
| `QgsWkbTypes.MultiLineString` | Multiple lines | Road network |
| `QgsWkbTypes.MultiPolygon` | Multiple polygons | Islands, enclaves |
| `QgsWkbTypes.NoGeometry` | No geometry | Attribute table only |
| `QgsWkbTypes.Unknown` | Unknown type | Undefined |

---

## ▶️ Use — when creating a layer

```python
from qgis.core import (
    QgsVectorFileWriter,
    QgsFields,
    QgsField,
    QgsWkbTypes,
    QgsCoordinateReferenceSystem
)
from PyQt5.QtCore import QVariant

fields = QgsFields()
fields.append(QgsField('ID',   QVariant.Int))
fields.append(QgsField('Name', QVariant.String))

# create a Point layer
writer = QgsVectorFileWriter(
    r'C:\GIS\points.shp',
    'UTF-8',
    fields,
    QgsWkbTypes.Point,                          # ← here
    QgsCoordinateReferenceSystem('EPSG:32638'),
    'ESRI Shapefile'
)
del writer
```

📌 `QgsWkbTypes.Point` tells the writer that only points will be written to the file.

---

## 🔍 Checking the geometry type

```python
layer = QgsVectorLayer(r'C:\GIS\roads.shp', 'Roads', 'ogr')

geom_type = layer.wkbType()
print(geom_type)  # → 2 (LineString)

# human-readable name
type_name = QgsWkbTypes.displayString(geom_type)
print(type_name)  # → "LineString"
```

---

## 🛠 Practical methods

### `QgsWkbTypes.geometryType(wkb_type)`

Converts a WKB type into a general category:

```python
from qgis.core import QgsWkbTypes

wkb = QgsWkbTypes.MultiPolygon

# category
category = QgsWkbTypes.geometryType(wkb)
# → QgsWkbTypes.PolygonGeometry

# name
print(QgsWkbTypes.displayString(wkb))
# → "MultiPolygon"
```

Geometry categories:

| Category | WKB types |
|-----------|-----------|
| `PointGeometry` | Point, MultiPoint |
| `LineGeometry` | LineString, MultiLineString |
| `PolygonGeometry` | Polygon, MultiPolygon |
| `NullGeometry` | NoGeometry |

---

### `QgsWkbTypes.hasZ(wkb_type)` and `QgsWkbTypes.hasM(wkb_type)`

Checks whether there is a Z (elevation) or M (measure) coordinate:

```python
# PointZ — a 3D point
wkb_3d = QgsWkbTypes.PointZ

print(QgsWkbTypes.hasZ(wkb_3d))  # → True
print(QgsWkbTypes.hasM(wkb_3d))  # → False
```

---

### `QgsWkbTypes.isSingleType()` and `QgsWkbTypes.isMultiType()`

```python
print(QgsWkbTypes.isSingleType(QgsWkbTypes.Point))        # → True
print(QgsWkbTypes.isMultiType(QgsWkbTypes.MultiPolygon))  # → True
```

---

## 🌐 Z and M types (3D and measure)

| Type | Description |
|------|--------|
| `QgsWkbTypes.PointZ` | 3D point (X, Y, Z) |
| `QgsWkbTypes.PointM` | Measured point (X, Y, M) |
| `QgsWkbTypes.PointZM` | 3D + measure (X, Y, Z, M) |
| `QgsWkbTypes.LineStringZ` | 3D line |
| `QgsWkbTypes.PolygonZ` | 3D polygon |

```python
# create a 3D Point layer
writer = QgsVectorFileWriter(
    r'C:\GIS\points_3d.shp',
    'UTF-8',
    fields,
    QgsWkbTypes.PointZ,                         # ← Z coordinate
    QgsCoordinateReferenceSystem('EPSG:32638'),
    'ESRI Shapefile'
)
del writer
```

---

## 📊 WKB numeric values

`QgsWkbTypes` constants are actually **integers** (the OGC WKB standard):

```python
print(int(QgsWkbTypes.Point))        # → 1
print(int(QgsWkbTypes.LineString))   # → 2
print(int(QgsWkbTypes.Polygon))      # → 3
print(int(QgsWkbTypes.MultiPoint))   # → 4
print(int(QgsWkbTypes.PointZ))       # → 1001
print(int(QgsWkbTypes.PointM))       # → 2001
print(int(QgsWkbTypes.PointZM))      # → 3001
```

---

## 📌 Summary

- **`QgsWkbTypes`** defines the geometry type in PyQGIS
- It is used in `QgsVectorFileWriter`, `QgsMemoryLayer` and other classes
- It supports **2D**, **3D (Z)** and **M** types
- `displayString()` returns the geometry name as a string
- `geometryType()` converts to a general category

👉 Every time you create a new layer or check a geometry type, `QgsWkbTypes` is your first tool.
