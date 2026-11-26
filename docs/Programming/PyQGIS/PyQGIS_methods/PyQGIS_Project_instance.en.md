# `QgsProject.instance()` in PyQGIS

**`QgsProject.instance()`** is the **global object** of the current QGIS project. It is the single access point to the project's data, layers, CRS and settings.

---

## 🔑 The main idea

In QGIS **one project is always open** (it may be empty). `QgsProject.instance()` returns exactly that project — the **Singleton pattern**:

```
QGIS application
    │
    └── QgsProject  (only one instance)
            │
            ├── Layers
            ├── CRS (coordinate reference system)
            ├── Variables
            ├── Path (.qgz file)
            └── Settings
```

> 💡 **Singleton** is a design pattern where a class can have **only one instance**. `instance()` always returns the **same** object.

---

## 📦 Import

```python
from qgis.core import QgsProject

# Singleton — every call returns the same object
project = QgsProject.instance()

print(type(project))
# → <class 'qgis._core.QgsProject'>

# two calls — one and the same object
a = QgsProject.instance()
b = QgsProject.instance()
print(a is b)  # → True
```

---

## 🗂️ Managing layers

### Adding a layer

```python
from qgis.core import QgsVectorLayer, QgsProject

layer = QgsVectorLayer(
    r'C:\GIS\shapefile\regions.shp',
    'Regions',
    'ogr'
)

if layer.isValid():
    QgsProject.instance().addMapLayer(layer)
    print("✅ Layer added to the project")
```

### Listing all layers

```python
project = QgsProject.instance()

# dictionary — {layer_id: QgsMapLayer}
all_layers = project.mapLayers()

for layer_id, layer in all_layers.items():
    print(f"ID: {layer_id[:8]}...  name: {layer.name()}")
```

### Finding a layer by name

```python
# by name (a list — several may match)
layers = QgsProject.instance().mapLayersByName('Roads')

if layers:
    layer = layers[0]
    print(f"✅ Found: {layer.name()} — {layer.featureCount()} features")
else:
    print("❌ Layer not found")
```

### Finding a layer by ID

```python
layer_id = "roads_abc123_20250101"

layer = QgsProject.instance().mapLayer(layer_id)

if layer:
    print(f"✅ {layer.name()}")
else:
    print("❌ ID not found")
```

### Removing a layer

```python
layer = QgsProject.instance().mapLayersByName('TempLayer')[0]

# remove by ID
QgsProject.instance().removeMapLayer(layer.id())

# or directly by object
QgsProject.instance().removeMapLayer(layer)

print("🗑️ Layer removed from the project")
```

---

## 🌐 CRS — coordinate reference system

```python
from qgis.core import QgsProject, QgsCoordinateReferenceSystem

project = QgsProject.instance()

# the project's current CRS
crs = project.crs()
print(crs.authid())       # → "EPSG:32638"
print(crs.description())  # → "WGS 84 / UTM zone 38N"

# change the project CRS
new_crs = QgsCoordinateReferenceSystem('EPSG:4326')
project.setCrs(new_crs)
print("✅ CRS changed:", project.crs().authid())
```

---

## 📁 The project file

```python
project = QgsProject.instance()

# full path of the project file
print(project.fileName())
# → "C:/GIS/Projects/my_project.qgz"  or "" if not saved

# project title
print(project.title())
# → "GGTC Pipeline Map"

# change the title
project.setTitle("GGTC Pipeline Map 2025")

# save the project
project.write()
print("💾 Project saved")

# save to a new path
project.write(r'C:\GIS\Projects\backup.qgz')
```

---

## 🔧 Transform context

`transformContext()` is the coordinate transformation context, which is **required** in the modern PyQGIS API (`QgsVectorFileWriter.create()`, `writeAsVectorFormatV3()`):

```python
from qgis.core import QgsProject, QgsVectorFileWriter

transform_context = QgsProject.instance().transformContext()

options = QgsVectorFileWriter.SaveVectorOptions()
options.driverName   = "ESRI Shapefile"
options.fileEncoding = "UTF-8"

writer = QgsVectorFileWriter.create(
    r'C:\GIS\output.shp',
    fields,
    QgsWkbTypes.Point,
    QgsCoordinateReferenceSystem('EPSG:32638'),
    transform_context,          # ← QgsProject.instance().transformContext()
    options
)
del writer
```

---

## 🧩 Variables

```python
from qgis.core import QgsExpressionContextUtils, QgsProject

project = QgsProject.instance()

# set a variable
QgsExpressionContextUtils.setProjectVariable(project, 'company',  'GGTC')
QgsExpressionContextUtils.setProjectVariable(project, 'map_year', 2025)

# read a variable
scope = QgsExpressionContextUtils.projectScope(project)
print(scope.variable('company'))   # → "GGTC"
print(scope.variable('map_year'))  # → 2025

# used in QGIS expressions as: @company, @map_year
```

---

## 🧹 Clearing the project

```python
# remove all layers
QgsProject.instance().removeAllMapLayers()
print("🗑️ All layers removed")

# clear the project completely (layers + settings)
QgsProject.instance().clear()
print("🔄 Project cleared")
```

> ⚠️ `clear()` is **irreversible**. All of the project's data, variables and settings are removed.

---

## 📡 Signals

`QgsProject` emits PyQt signals, so you can listen to **events**:

```python
project = QgsProject.instance()

# when layers are added
project.layersAdded.connect(
    lambda layers: print(f"➕ Added: {[l.name() for l in layers]}")
)

# when layers are removed
project.layersRemoved.connect(
    lambda ids: print(f"🗑️ Removed: {ids}")
)

# when the project is saved
project.projectSaved.connect(
    lambda: print(f"💾 Saved: {project.fileName()}")
)

# when the CRS changes
project.crsChanged.connect(
    lambda: print(f"🌐 CRS changed: {project.crs().authid()}")
)
```

---

## 📋 Frequently used methods

| Method | Purpose | Return type |
|--------|------------|----------------|
| `instance()` | The project's Singleton object | `QgsProject` |
| `addMapLayer(layer)` | Add a layer | `QgsMapLayer` |
| `removeMapLayer(id)` | Remove a layer by ID | — |
| `mapLayers()` | Dictionary of all layers | `dict` |
| `mapLayersByName(name)` | Find layers by name | `list` |
| `mapLayer(id)` | Find a layer by ID | `QgsMapLayer` |
| `crs()` | The project CRS | `QgsCoordinateReferenceSystem` |
| `setCrs(crs)` | Change the CRS | — |
| `fileName()` | Path of the `.qgz` file | `str` |
| `title()` | Project title | `str` |
| `write()` | Save | `bool` |
| `clear()` | Clear everything | — |
| `transformContext()` | Coordinate transformation context | `QgsCoordinateTransformContext` |
| `removeAllMapLayers()` | Remove all layers | — |

---

## 📌 Summary

- **`QgsProject.instance()`** is a **Singleton**: always **one and the same** object
- The project's **layers, CRS, variables and path** are all available from here
- **`transformContext()`** is required in `QgsVectorFileWriter.create()` and `writeAsVectorFormatV3()`
- **Signals**: adding/removing layers, CRS changes and saving are all events you can listen to
- `clear()`: **be careful**, it is an irreversible full reset

👉 `QgsProject.instance()` is the **central hub** of PyQGIS. Any interaction with the project starts from this object.
