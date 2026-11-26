# QgsPointXY in PyQGIS

## ℹ️ Overview
**QgsPointXY** is a simple object that represents a point (with X,Y coordinates).  
It is used to create geometry objects (e.g. `QgsGeometry`) and in various geographic operations.

---

## 🛠️ Main constructors
```python
# an empty point
pt = QgsPointXY()

# with X and Y values
pt = QgsPointXY(357965.61, 4683353.56)

# copy another QgsPointXY object
pt2 = QgsPointXY(pt)
```

---

## 📌 Main methods

### Accessing the coordinates
```python
x = pt.x()   # returns the X value
y = pt.y()   # returns the Y value
```

### Changing the coordinates
```python
pt.setX(358000.0)
pt.setY(4683400.0)
```

### Comparing points
```python
pt1 = QgsPointXY(10, 20)
pt2 = QgsPointXY(10, 20)
pt3 = QgsPointXY(15, 25)

print(pt1 == pt2)  # True
print(pt1 == pt3)  # False
```

---

## 🧭 Use with QgsGeometry
`QgsPointXY` is often used to create a geometry:
```python
pt = QgsPointXY(357965.61, 4683353.56)
geom = QgsGeometry.fromPointXY(pt)
```

---

## 🌍 Practical example — creating a point layer
```python
fn = r'C:/Users/Public/Documents/GIS/points.shp'

fields = QgsFields()
fields.append(QgsField('ID', QVariant.Int))
fields.append(QgsField('Name', QVariant.String))

writer = QgsVectorFileWriter(fn, 'UTF-8', fields, QgsWkbTypes.Point,
                             QgsCoordinateReferenceSystem('EPSG:32638'), 'ESRI Shapefile')

# points
coords = [(357960, 4683350), (357970, 4683360), (357980, 4683370)]

for i, (x, y) in enumerate(coords):
    pt = QgsPointXY(x, y)
    geom = QgsGeometry.fromPointXY(pt)
    feat = QgsFeature()
    feat.setGeometry(geom)
    feat.setAttributes([i, f"point_{i}"])
    writer.addFeature(feat)

del(writer)

layer = iface.addVectorLayer(fn, '', 'ogr')
```

---

## 📖 When to use it
- For simple point objects (e.g. X,Y coordinates).
- To create a geometry (`QgsGeometry`).
- To store temporary points and for analysis.
- To simplify algorithms where a full geometry object is not needed.

---

✅ **QgsPointXY** is one of the most frequently used PyQGIS classes when working with point data.
