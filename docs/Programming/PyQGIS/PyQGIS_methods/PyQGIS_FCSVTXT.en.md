# CSV / TXT files

## 📋 Methods table

| Method | Use | Module |
|--------|-----------|--------|
| `open(path, "r")` | Read a file | built-in |
| `open(path, "w")` | Overwrite a file | built-in |
| `open(path, "a")` | Append to the end | built-in |
| `csv.DictReader` | Read CSV by columns | `csv` |
| `csv.DictWriter` | Write CSV by columns | `csv` |
| `iface.activeLayer()` | The active QGIS layer | PyQGIS |
| `layer.getFeatures()` | Iterate over features | PyQGIS |
| `feature.geometry().asPoint()` | Point coordinates | PyQGIS |
| `QgsVectorLayer(uri, ...)` | Create a layer from a CSV | PyQGIS |

---
