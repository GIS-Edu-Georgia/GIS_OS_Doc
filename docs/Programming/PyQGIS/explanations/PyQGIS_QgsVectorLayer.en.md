# QgsVectorLayer in QGIS

**QgsVectorLayer** is one of the most important PyQGIS classes. It is used to load and manage vector data (e.g. Shapefile, GeoPackage, PostGIS).

---

## 🔑 The main idea
QgsVectorLayer represents a **vector layer** (points, lines, polygons) that has:
- **geometry** (spatial data)
- **attributes** (tabular data)

This object lets us: <br>
- load an existing file <br>
- create a new layer <br>
- read/add/write features <br>
- manage the symbology and layer style <br>

---

## ▶️ Creating a QgsVectorLayer

```python
# connect to an existing vector file
fn = r"C:/Users/Public/Documents/GIS/shapefile/lake.shp"
layer = QgsVectorLayer(fn, "Lake Layer", "ogr")

if not layer.isValid():
    print("❌ Failed to load the layer")
else:
    print("✅ Layer loaded successfully")
```

📌 Here:
- `fn` = the file path
- `"Lake Layer"` = the name in QGIS
- `"ogr"` = data provider (Shapefile, GeoJSON, GeoPackage, etc.)

---

## 🛠 Layer types

A QgsVectorLayer can be: <br>
- **QgsWkbTypes.Point** → points <br>
- **QgsWkbTypes.LineString** → lines <br>
- **QgsWkbTypes.Polygon** → polygons <br>

---

## 📋 Accessing attributes

```python
for feature in layer.getFeatures():
    geom = feature.geometry()
    attrs = feature.attributes()
    print("Geometry:", geom.asWkt())
    print("Attributes:", attrs)
```

---

## ➕ Adding a new feature

```python
from qgis.PyQt.QtCore import QVariant

pr = layer.dataProvider()

# new attribute fields
pr.addAttributes([QgsField("Name", QVariant.String),
                  QgsField("Value", QVariant.Double)])
layer.updateFields()

# create a new feature
feat = QgsFeature(layer.fields())
feat.setGeometry(QgsGeometry.fromPointXY(QgsPointXY(357965.61, 4683353.56)))
feat.setAttributes(["Lake1", 123.45])

pr.addFeature(feat)
layer.updateExtents()
```

---

## 💾 Creating a new vector file

```python
from qgis.core import QgsVectorFileWriter, QgsFields, QgsField, QgsWkbTypes, QgsCoordinateReferenceSystem

fn = r"C:/Users/Public/Documents/GIS/shapefile/new_layer.shp"
fields = QgsFields()
fields.append(QgsField("ID", QVariant.Int))
fields.append(QgsField("Name", QVariant.String))

writer = QgsVectorFileWriter(fn, "UTF-8", fields,
                             QgsWkbTypes.Point,
                             QgsCoordinateReferenceSystem("EPSG:32638"),
                             "ESRI Shapefile")

del writer
```

---

## 🔍 Filtering and queries

```python
expr = QgsExpression("Value > 100")
it = layer.getFeatures(QgsFeatureRequest(expr))

for f in it:
    print(f["Name"], f["Value"])
```

---

## 🎨 Symbols and visualization

```python
symbol = QgsSymbol.defaultSymbol(layer.geometryType())
symbol.setColor(QColor("blue"))
symbol.setSize(3)

layer.renderer().setSymbol(symbol)
layer.triggerRepaint()
```

---

## 📌 Summary

- **QgsVectorLayer** is the main object for vector data in PyQGIS.
- With it we can:
  - load a layer
  - add new features
  - manage attributes
  - write it to a file
  - change the symbols

👉 This class is one of the most used tools of the QGIS API for managing GIS data.
