# 🧩 PyQGIS — QgsFeature
**QgsFeature** represents a single geographic object in a vector layer: it has a **geometry** (QgsGeometry) and **attributes** (values for the fields).  

---

## 📚 When do we use QgsFeature?
- to add a new object to a layer (point/line/polygon)
- to collect, read and change existing objects
- to set/update attributes
- to write the results of buffers/overlays/other analysis

---

## 🧠 Core concepts
- **Feature (object)** — a combination of geometry and attributes
- **FID/ID** — a unique identifier within the layer (different from an "ID" in an attribute column)
- **Geometry** — QgsGeometry (Point/LineString/Polygon/Multiparts…)
- **Attributes** — a list of values that matches the layer's `QgsFields()` structure

---

## ✅ Quick example — creating a QgsFeature and setting attributes
```python
from qgis.core import QgsFeature, QgsGeometry, QgsPointXY

feat = QgsFeature()                              # an empty object
geom = QgsGeometry.fromPointXY(QgsPointXY(44.8, 41.7))
feat.setGeometry(geom)                           # assign the geometry
feat.setAttributes([1, "Tbilisi", 1110000])     # assign the attributes (preferably in the layer's field order)
```

> Note: the number of elements in the `setAttributes()` list must match the number of the layer's `QgsFields()` (or use `setAttribute(index, value)`).

---

## 🧪 Use with a layer — writing a new object
```python
from qgis.core import QgsProject, QgsVectorLayer, QgsField, QgsFields, QgsWkbTypes, QgsFeature, QgsGeometry, QgsPointXY
from PyQt5.QtCore import QVariant

# create a memory layer (Point, EPSG:4326)
vl = QgsVectorLayer("Point?crs=EPSG:4326", "Cities", "memory")
pr = vl.dataProvider()

# add fields
pr.addAttributes([QgsField("ID", QVariant.Int), QgsField("Name", QVariant.String), QgsField("Pop", QVariant.Int)])
vl.updateFields()

# create the object
f = QgsFeature(vl.fields())                      # pass the field structure
f.setGeometry(QgsGeometry.fromPointXY(QgsPointXY(44.8, 41.7)))
f["ID"] = 1                                      # alternative: f.setAttribute("ID", 1)
f["Name"] = "Tbilisi"
f["Pop"] = 1110000

pr.addFeatures([f])                              # add it to the layer
vl.updateExtents()

QgsProject.instance().addMapLayer(vl)
```

---

## 🔁 Reading and changing existing objects (edit mode)
```python
# edit mode is needed to change attributes/geometry
vl.startEditing()

for f in vl.getFeatures():                       # iterate over all objects
    if f["Name"] == "Tbilisi":
        vl.changeAttributeValue(f.id(), vl.fields().indexOf("Pop"), 1200000)  # Pop = 1.2m

# change the geometry (e.g. a tiny shift)
for f in vl.getFeatures():
    g = f.geometry()
    if g and g.isMultipart() is False:
        p = g.asPoint()
        new_g = QgsGeometry.fromPointXY(QgsPointXY(p.x() + 0.001, p.y()))
        vl.changeGeometry(f.id(), new_g)

vl.commitChanges()                               # save the changes
```

> TIP: use `vl.rollBack()` to undo the changes on error.

---

## 🧮 Useful methods
- `QgsFeature(fields=None)` — constructor; optionally with a field structure
- `setGeometry(QgsGeometry)` / `geometry()`
- `setAttributes(list)` / `attributes()`
- `setAttribute(index_or_name, value)` / `attribute(index_or_name)`
- `id()` — the layer's internal identifier (FID)
- `isValid()` — whether the assigned geometry/attributes are consistent

---

## 🧷 Multipart geometry
```python
from qgis.core import QgsGeometry, QgsPointXY

# a Multipart Point from two points
mp = QgsGeometry.fromMultiPointXY([QgsPointXY(44.8, 41.7), QgsPointXY(41.6, 41.65)])
f = QgsFeature(vl.fields())
f.setGeometry(mp)
f.setAttributes([2, "Cities MP", None])
vl.dataProvider().addFeatures([f])
vl.updateExtents()
```

> Use `geometry().isMultipart()` to find out whether an object is multipart.

---

## 🧰 Getting QgsFeatures from layers (selection / filter)
```python
# 1) Feature iterator + expression filter
expr = '"Pop" > 1000000'                         # QGIS expression
for f in vl.getFeatures(expr):
    print(f["Name"], f["Pop"])

# 2) by identifying feature IDs
ids = [f.id() for f in vl.getFeatures() if f["Name"].startswith("T")]
for fid in ids:
    feat = next(vl.getFeatures(f"id = {fid}"))   # find a specific FID
    print("Selected:", feat["Name"])
```

---

## 🧱 Errors and common pitfalls
- **Field mismatch** — the length of the `setAttributes()` list does not match the number of `QgsFields()` → use `setAttribute()` individually.
- **Forgetting edit mode** — `changeAttributeValue` / `changeGeometry` require `startEditing()` and `commitChanges()`.
- **FID vs attribute ID** — `f.id()` != `f["ID"]` (the first is an internal technical identifier).  
- **CRS/units** — `geometry().area()/length()` return results in the units of the layer's CRS.

---

## 🧭 Small exercises
1) Create a Point memory layer with the fields `ID(Int), Name(String), Elev(Double)` and add 5 points.  
2) Find all points where `Elev > 1200` and set `High=True` in a new field.  
3) From an existing line layer, take each feature and write its length to the field `Len_m` (keep in mind the CRS must be in meters).  
4) Create a Multipart Polygon with one feature made of two triangles and add it to the layer.

---

## 🔚 Summary
- **QgsFeature** is the basic building block of vector data.  
- You use it together with **QgsGeometry** and **QgsFields/QgsField**.  
- The correct editing cycle: `startEditing()` → changes → `commitChanges()` (or `rollBack()`).  
- Work with a clear attribute schema and an understanding of CRSs.
