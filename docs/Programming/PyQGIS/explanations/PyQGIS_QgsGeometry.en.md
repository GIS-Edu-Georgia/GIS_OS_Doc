# PyQGIS Class: QgsGeometry

## Introduction
`QgsGeometry` is the main PyQGIS class for storing and processing geometry objects (points, lines, polygons and more).  
This class lets us create, transform, compare and combine geometric shapes.

---

## Key Features
- **Geometry Creation** — creating points, lines and polygons.
- **Geometry Transformation** — moving, buffering.
- **Geometry Analysis** — checking overlaps, calculating distances.
- **Geometry Export** — converting to other formats (WKT, WKB).

---

## Commonly Used Methods

### 1. Geometry Creation
```python
from qgis.core import QgsPointXY, QgsGeometry

# point geometry
point = QgsGeometry.fromPointXY(QgsPointXY(357965.61, 4683353.56))

# line geometry
line = QgsGeometry.fromPolylineXY([
    QgsPointXY(357965.61, 4683353.56),
    QgsPointXY(357970.20, 4683360.10)
])

# polygon geometry
polygon = QgsGeometry.fromPolygonXY([[
    QgsPointXY(357965.61, 4683353.56),
    QgsPointXY(357970.20, 4683360.10),
    QgsPointXY(357960.10, 4683365.50),
    QgsPointXY(357965.61, 4683353.56)
]])
```

---

### 2. Geometry Transformation
```python
# create a buffer (e.g. 50 meters)
buffer = point.buffer(50, 5)

# move the geometry
moved = point.translate(100, 200)

# simplify the geometry
simplified = line.simplify(10)
```

---

### 3. Geometry Analysis
```python
# intersection of two geometries
intersects = point.intersects(buffer)

# distance between objects
dist = point.distance(line)

# geometry area (for a polygon)
area = polygon.area()

# geometry length / perimeter
length = line.length()
```

---

### 4. Geometry Export
```python
# convert to WKT
print(point.asWkt())

# to JSON
print(polygon.asJson())

# binary form (WKB)
wkb = line.asWkb()
```

---

## Example: Checking if a Point is Inside a Polygon
```python
point = QgsGeometry.fromPointXY(QgsPointXY(357965.61, 4683353.56))
polygon = QgsGeometry.fromPolygonXY([[
    QgsPointXY(357960, 4683350),
    QgsPointXY(357970, 4683350),
    QgsPointXY(357970, 4683360),
    QgsPointXY(357960, 4683360),
    QgsPointXY(357960, 4683350)
]])

if point.within(polygon):
    print("Point is inside polygon")
else:
    print("Point is outside polygon")
```

---

## Notes
- `QgsGeometry` works with every geometry type: **Point, MultiPoint, LineString, MultiLineString, Polygon, MultiPolygon**.
- It is often used together with other classes: `QgsFeature`, `QgsVectorLayer`.
- It relies on the GEOS library for geometric operations.

---

## Summary
`QgsGeometry` is one of the most important PyQGIS classes.  
It gives us the tools to create, process and analyse spatial data.  
Students should practise using it in a variety of GIS operations.
