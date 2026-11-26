# QgsVectorFileWriter in PyQGIS

**QgsVectorFileWriter** is the PyQGIS class used to **create and write vector files** — e.g. Shapefile, GeoPackage, GeoJSON and other formats.

---

## 🔑 The main idea

`QgsVectorFileWriter` lets us:

- create a new vector file from scratch
- write `QgsFeature` objects to the file
- choose the file format, CRS and encoding
- export an existing layer to another format

---

## 📦 Import

```python
from qgis.core import (
    QgsVectorFileWriter,
    QgsFields,
    QgsField,
    QgsFeature,
    QgsGeometry,
    QgsPointXY,
    QgsWkbTypes,
    QgsCoordinateReferenceSystem,
    QgsProject
)
from PyQt5.QtCore import QVariant
```

---

## ▶️ Basic syntax — the old style

```python
writer = QgsVectorFileWriter(
    path,          # file path
    encoding,      # encoding, e.g. 'UTF-8'
    fields,        # a QgsFields object
    geometryType,  # QgsWkbTypes.Point / LineString / Polygon
    crs,           # QgsCoordinateReferenceSystem
    driverName     # 'ESRI Shapefile', 'GPKG', 'GeoJSON', etc.
)
```

📌 This syntax still works in QGIS 3.x, but it is considered deprecated.

---

## 🛠 Simple example — Point Shapefile

```python
from qgis.core import (
    QgsVectorFileWriter, QgsFields, QgsField,
    QgsWkbTypes, QgsCoordinateReferenceSystem
)
from PyQt5.QtCore import QVariant

shapefile_path = r'C:\Users\Public\Documents\GIS\shapefile\saxli.shp'

# define the fields
fields = QgsFields()
fields.append(QgsField('ID',    QVariant.Int))
fields.append(QgsField('Name',  QVariant.String, len=100))
fields.append(QgsField('Area',  QVariant.Double, prec=2))

# create the writer
writer = QgsVectorFileWriter(
    shapefile_path,
    'UTF-8',
    fields,
    QgsWkbTypes.Point,
    QgsCoordinateReferenceSystem('EPSG:32638'),
    'ESRI Shapefile'
)

# ⚠️ del is required! Only then is the file closed
del writer
```

---

## ➕ Writing features

```python
from qgis.core import QgsFeature, QgsGeometry, QgsPointXY

# after creating the writer — add features
feat = QgsFeature(fields)
feat.setGeometry(QgsGeometry.fromPointXY(QgsPointXY(490230.0, 4741850.0)))
feat['ID']   = 1
feat['Name'] = 'House N1'
feat['Area'] = 120.5

if writer.addFeature(feat):
    print("✅ Feature written")
else:
    print("❌ Writing failed")

del writer
```

---

## 🚀 Modern syntax — `create()` (QGIS 3.22+)

```python
from qgis.core import QgsVectorFileWriter, QgsProject

options = QgsVectorFileWriter.SaveVectorOptions()
options.driverName   = "ESRI Shapefile"
options.fileEncoding = "UTF-8"
options.actionOnExistingFile = QgsVectorFileWriter.CreateOrOverwriteFile

writer = QgsVectorFileWriter.create(
    shapefile_path,
    fields,
    QgsWkbTypes.Point,
    QgsCoordinateReferenceSystem('EPSG:32638'),
    QgsProject.instance().transformContext(),
    options
)

if writer.hasError() != QgsVectorFileWriter.NoError:
    print("❌ Error:", writer.errorMessage())
else:
    writer.addFeature(feat)
    del writer
    print("✅ File created")
```

📌 `create()` is the recommended approach since QGIS 3.22.

---

## 💾 Supported formats

| `driverName` | Format | Extension |
|-------------|---------|-----------|
| `"ESRI Shapefile"` | Shapefile | `.shp` |
| `"GPKG"` | GeoPackage | `.gpkg` |
| `"GeoJSON"` | GeoJSON | `.geojson` |
| `"KML"` | Keyhole Markup Language | `.kml` |
| `"CSV"` | CSV (without geometry) | `.csv` |
| `"MapInfo File"` | MapInfo TAB | `.tab` |
| `"DXF"` | AutoCAD DXF | `.dxf` |

---

## 📤 Exporting a layer — `writeAsVectorFormatV3`

If you have an existing `QgsVectorLayer` and want to save it in another format:

```python
layer = iface.activeLayer()  # or any QgsVectorLayer

options = QgsVectorFileWriter.SaveVectorOptions()
options.driverName   = "GPKG"
options.fileEncoding = "UTF-8"

error, new_file, _, _ = QgsVectorFileWriter.writeAsVectorFormatV3(
    layer,
    r'C:\GIS\output.gpkg',
    QgsProject.instance().transformContext(),
    options
)

if error == QgsVectorFileWriter.NoError:
    print("✅ Export succeeded:", new_file)
else:
    print("❌ Error:", error)
```

📌 With `writeAsVectorFormatV3`, `del` is **not needed**.

---

## 🛡️ Checking for errors

```python
writer = QgsVectorFileWriter.create(...)

# error code
error_code = writer.hasError()

if error_code == QgsVectorFileWriter.NoError:
    print("✅ Writer is ready")
elif error_code == QgsVectorFileWriter.ErrDriverNotFound:
    print("❌ Driver not found")
elif error_code == QgsVectorFileWriter.ErrCreateDataSource:
    print("❌ Failed to create the file")
elif error_code == QgsVectorFileWriter.ErrCreateLayer:
    print("❌ Failed to create the layer")
else:
    print("❌ Other error:", writer.errorMessage())
```

---

## ♻️ Cleanup — `del writer` and `try / finally`

`QgsVectorFileWriter` **locks the file** while it is alive.
`del writer` calls the C++ destructor and closes the file.

```python
writer = QgsVectorFileWriter.create(...)

try:
    for feat in features:
        writer.addFeature(feat)
    print(f"✅ {len(features)} features written")
except Exception as e:
    print(f"❌ Error: {e}")
finally:
    del writer  # guaranteed cleanup
    print("🔒 File closed")
```

> Without `del`: the file may stay locked, the last data may not be written, and memory may leak in loops.

---

## 📋 `SaveVectorOptions` parameters

```python
options = QgsVectorFileWriter.SaveVectorOptions()

options.driverName        = "ESRI Shapefile"   # format
options.fileEncoding      = "UTF-8"             # encoding
options.layerName         = "my_layer"          # layer name (in GPKG)
options.onlySelectedFeatures = False            # selected features only?
options.actionOnExistingFile = QgsVectorFileWriter.CreateOrOverwriteFile
# or: QgsVectorFileWriter.AppendToLayerNoNewFields
# or: QgsVectorFileWriter.AppendToLayerAddNewFields
```

---

## 📌 Summary

- **`QgsVectorFileWriter`** creates vector files in PyQGIS
- `create()` is the modern, recommended way (QGIS 3.22+)
- `writeAsVectorFormatV3()` is for exporting an existing layer
- `del writer` is **always** required for writers created with `create()`
- `try / finally` guarantees cleanup in any scenario

👉 This class is the main tool for saving vector data in PyQGIS.
