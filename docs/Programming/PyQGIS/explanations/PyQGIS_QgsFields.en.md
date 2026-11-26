# 📝 PyQGIS: what is **QgsFields()** and what does it do?

## ▶️ What is QgsFields()?  
`QgsFields` is a **PyQGIS class** that represents the **collection of columns of an attribute table**.  
When we create a new vector layer (e.g. a shapefile), we must define the columns of its table (ID, name, age, etc.). These columns are stored in a **QgsFields()** object.
Fields are data structures that define the data stored in a layer or file. Each field has a name, a type (e.g. text, number) and other properties.
layerfield = QgsFields()
As a result of this code:

an empty QgsFields object is created.
This object is used to add new attribute fields, or to hold a layer's existing fields.

---

## 📦 Main function
- Stores **QgsField** objects (i.e. the description of each column).  
- Lets you add, remove or look up columns.  
- Is used when writing data to a new layer.

---

## 🧱 Example – creating a new attribute table

```python
from qgis.core import QgsFields, QgsField
from PyQt5.QtCore import QVariant

# create an empty collection of columns
fields = QgsFields()

# add columns
fields.append(QgsField("ID", QVariant.Int))
fields.append(QgsField("Name", QVariant.String))
fields.append(QgsField("Age", QVariant.Double))

# now the fields object holds 3 columns: ID, Name, Age
print(fields.count())   # prints 3
```

---

## 📊 How does it work?

- `QgsField` – describes one column (name + type).  
- `QgsFields` – is a **group of columns**.  
- When we pass `QgsFields` to `QgsVectorFileWriter`, it creates a new shapefile with the given columns.

---

## 🔎 Why is it important?

1. **Defining the structure** – without attribute columns we cannot store values.  
2. **Managing data** – in code we control what type of information is written (integer, text, decimal, etc.).  
3. **Automation** – when many shapefiles with the same structure must be created, `QgsFields()` simplifies the process.

---

## 🚀 Practical example: creating a layer with columns
```python
from qgis.core import QgsVectorFileWriter, QgsCoordinateReferenceSystem, QgsWkbTypes, QgsFeature, QgsGeometry, QgsPointXY

# file path
fn = r"C:\Users\Public\Documents\GIS\new_points.shp"

# create the columns
fields = QgsFields()
fields.append(QgsField("ID", QVariant.Int))
fields.append(QgsField("Name", QVariant.String))

# create the layer
writer = QgsVectorFileWriter(fn, "UTF-8", fields, QgsWkbTypes.Point,
                             QgsCoordinateReferenceSystem("EPSG:32638"), "ESRI Shapefile")

# add a point
feat = QgsFeature()
feat.setGeometry(QgsGeometry.fromPointXY(QgsPointXY(356000, 4679000)))
feat.setAttributes([1, "Lake"])
writer.addFeature(feat)

del(writer)  # close the writer

iface.addVectorLayer(fn, "", "ogr")  # add it to QGIS
```

---

## 🎯 Conclusion
- **`QgsField`** – describes one column.  
- **`QgsFields`** – is the full list of columns (the structure of the attribute table).  
- If you want to create a new file in QGIS, `QgsFields()` is required.
