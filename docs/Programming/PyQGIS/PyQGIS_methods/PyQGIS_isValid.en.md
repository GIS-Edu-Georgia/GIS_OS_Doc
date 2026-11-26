# `isValid()` in PyQGIS

**`isValid()`** is PyQGIS's "health check". It tells you whether an object loaded successfully and **is ready to work with**.

---

## 🔑 The main idea

When you create a layer in QGIS, it is always **created in memory**, even if the file does not exist or the path is wrong. That is exactly why we need `isValid()`:

```
QgsVectorLayer("wrong/path.shp", "layer", "ogr")
        │
        ▼
  object created ✅   ←── always
        │
        ├── isValid() → True   ✅  data found
        └── isValid() → False  ❌  data not found
```

---

## 📦 Where does it come from?

`isValid()` is defined in the **`QgsMapLayer`** class, the common parent class of all PyQGIS layers:

```
QgsMapLayer          ← isValid() is defined here
    ├── QgsVectorLayer
    └── QgsRasterLayer
```

📌 So you can use `isValid()` on **any** layer, vector or raster.

---

## ▶️ Simple use

```python
from qgis.core import QgsVectorLayer

layer = QgsVectorLayer(
    r'C:\GIS\shapefile\lake.shp',
    'Lake Layer',
    'ogr'
)

if not layer.isValid():
    print("❌ The layer did not load — check the file path")
else:
    print("✅ The layer is valid — you can work with it")
```

> ⚠️ **Tip:** always call `isValid()` after loading a layer. Without it, later operations can **crash QGIS**.

---

## 🛠 Where else is `isValid()` found?

`isValid()` is not **only in layers**; other important PyQGIS classes have it too:

| Class | What `isValid()` checks |
|-------|------------------------|
| `QgsVectorLayer` | The data source (file/database) was found and opened |
| `QgsRasterLayer` | The raster file loaded successfully |
| `QgsGeometry` | The geometry meets the OGC standards (it is not "broken") |
| `QgsPointXY` | The point is initialized with valid coordinates |
| `QgsRectangle` | The rectangle is initialized with valid coordinates |
| `QgsMessageBar` | The visual element for showing messages is ready |

---

## 🔍 `QgsVectorLayer` — a detailed example

```python
from qgis.core import QgsVectorLayer, QgsProject

# ✅ correct path
layer = QgsVectorLayer(
    r'C:\GIS\shapefile\roads.shp',
    'Roads',
    'ogr'
)

if layer.isValid():
    QgsProject.instance().addMapLayer(layer)
    print(f"✅ Loaded — {layer.featureCount()} features")
    print(f"   CRS: {layer.crs().authid()}")
    print(f"   Type: {layer.geometryType()}")
else:
    print("❌ The layer did not load")
```

```python
# ❌ wrong path — the object is still created!
layer = QgsVectorLayer(
    r'C:\GIS\missing_file.shp',
    'Test',
    'ogr'
)

print(layer)           # → <QgsVectorLayer: ...>   ← the object exists
print(layer.isValid()) # → False                   ← but it is not valid
```

---

## 🔷 `QgsGeometry` — geometry validation

`QgsGeometry.isValid()` checks the OGC standards, i.e. **geometric correctness**:

```python
from qgis.core import QgsGeometry

# ✅ a valid geometry
geom_ok = QgsGeometry.fromWkt("POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0))")
print(geom_ok.isValid())   # → True

# ❌ a "broken" geometry — the polygon intersects itself (butterfly)
geom_bad = QgsGeometry.fromWkt("POLYGON ((0 0, 1 1, 1 0, 0 1, 0 0))")
print(geom_bad.isValid())  # → False

# the reason for the error
if not geom_bad.isValid():
    print(geom_bad.lastError())
    # → "Ring self-intersection" or similar
```

> 💡 To **fix** a geometry automatically: `geom.makeValid()` (QGIS 3.x+)

---

## 🔗 Together with `processing.run()`

```python
from qgis.core import QgsProject

result = processing.run("native:polygonstolines", {
    'INPUT' : fn,
    'OUTPUT': 'TEMPORARY_OUTPUT'
})

temp_layer = result['OUTPUT']

# check isValid() on the processing result too
if not temp_layer or not temp_layer.isValid():
    print("❌ The processing result is invalid")
elif temp_layer.featureCount() == 0:
    print("⚠️ The layer is empty")
else:
    QgsProject.instance().addMapLayer(temp_layer)
    print(f"✅ {temp_layer.featureCount()} features added")
```

---

## ⚡ try / except + `isValid()` — best practice

```python
from qgis.core import QgsVectorLayer, QgsProject

def load_layer(path: str, name: str) -> QgsVectorLayer | None:
    """
    Loads a layer and validates it.
    Returns a QgsVectorLayer on success, otherwise None.
    """
    try:
        layer = QgsVectorLayer(path, name, 'ogr')

        if not layer.isValid():
            print(f"❌ [{name}] — failed to load: {path}")
            return None

        QgsProject.instance().addMapLayer(layer)
        print(f"✅ [{name}] — {layer.featureCount()} features | {layer.crs().authid()}")
        return layer

    except Exception as e:
        print(f"❌ Exception: {e}")
        return None


# usage
layer = load_layer(r'C:\GIS\shapefile\regions.shp', 'Regions')

if layer:
    # we only work with a valid layer
    for feat in layer.getFeatures():
        print(feat['name'])
```

---

## 📌 Summary

- **`isValid()`** is the object's "health check": is it ready to work with or not
- It is defined in `QgsMapLayer`, so it works on **vector** and **raster** layers
- The object is always **created**; `isValid() → False` does not mean the object does not exist
- `QgsGeometry.isValid()` checks geometric correctness (self-intersection, ring validity)
- Skipping `isValid()` before later operations is a potential cause of **crashes**

👉 **Rule:** after loading any layer, the **first step** is always `isValid()`.
