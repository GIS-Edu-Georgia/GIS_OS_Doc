# TEMPORARY_OUTPUT in PyQGIS

**`TEMPORARY_OUTPUT`** is a special value of `processing.run()` that **does not save** the result to a file; instead it creates a **temporary layer** in memory (RAM).

---

## 🔑 The main idea

In `processing.run()` the `'OUTPUT'` parameter is usually given a file path:

```python
# the usual way — a file on disk
processing.run("native:polygonstolines", {
    'INPUT' : fn,
    'OUTPUT': r'C:\GIS\output.shp'   # ← file on disk
})
```

With `TEMPORARY_OUTPUT` the result is **not written to a file**:

```python
# TEMPORARY_OUTPUT — in memory only
processing.run("native:polygonstolines", {
    'INPUT' : fn,
    'OUTPUT': 'TEMPORARY_OUTPUT'     # ← in RAM, no file is created
})
```

---

## 🧱 Structure — what happens inside?

```
processing.run(...)
       │
       ▼
  result → QgsVectorLayer (memory provider)
       │
       ├── type:     "memory:"
       ├── file:     does not exist on disk
       ├── lifetime: the QGIS session
       └── access:   via the result['OUTPUT'] object
```

---

## ▶️ Correct use

`processing.run()` **always** returns a dictionary.
With `TEMPORARY_OUTPUT`, `result['OUTPUT']` holds a **`QgsVectorLayer` object** (not a string):

```python
result = processing.run("native:polygonstolines", {
    'INPUT' : fn,
    'OUTPUT': 'TEMPORARY_OUTPUT'
})

# result['OUTPUT'] → a QgsVectorLayer object
temp_layer = result['OUTPUT']

print(type(temp_layer))
# → <class 'qgis._core.QgsVectorLayer'>

print(temp_layer.name())
# → "Polygons to lines"

print(temp_layer.featureCount())
# → 42  (number of features)
```

---

## 🗺️ Showing it in QGIS — `addMapLayer()`

The layer **does not appear** in the QGIS Layers panel automatically; you have to add it yourself:

```python
from qgis.core import QgsProject

result = processing.run("native:polygonstolines", {
    'INPUT' : fn,
    'OUTPUT': 'TEMPORARY_OUTPUT'
})

temp_layer = result['OUTPUT']

# add it to the QGIS Layers panel
QgsProject.instance().addMapLayer(temp_layer)
```

> 💡 Without `addMapLayer()` the layer exists in memory, but it is **not visible**.

---

## 🔗 Chaining — output as input

The most powerful use of `TEMPORARY_OUTPUT` is **feeding one tool's result into another**:

```python
fn = r'C:\GIS\shapefile\polygon_layer.shp'

# step 1: polygon → line
step1 = processing.run("native:polygonstolines", {
    'INPUT' : fn,
    'OUTPUT': 'TEMPORARY_OUTPUT'
})

# step 2: line → points (step1's result goes straight in as input)
step2 = processing.run("native:pointsalonglines", {
    'INPUT'   : step1['OUTPUT'],   # ← the QgsVectorLayer directly
    'DISTANCE': 10,
    'OUTPUT'  : 'TEMPORARY_OUTPUT'
})

# step 3: add the final result to the map
final_layer = step2['OUTPUT']
QgsProject.instance().addMapLayer(final_layer)

print(f"✅ {final_layer.featureCount()} points placed")
```

📌 No intermediate paths or files — **everything stays in memory**.

---

## 💾 Saving a temporary layer to a file

If you have done the analysis and need a file at the end:

```python
from qgis.core import QgsVectorFileWriter, QgsProject

result = processing.run("native:polygonstolines", {
    'INPUT' : fn,
    'OUTPUT': 'TEMPORARY_OUTPUT'
})

temp_layer = result['OUTPUT']

# option A — writeAsVectorFormatV3
options = QgsVectorFileWriter.SaveVectorOptions()
options.driverName   = "ESRI Shapefile"
options.fileEncoding = "UTF-8"

save_path = r'C:\GIS\output_final.shp'

error, _, _, _ = QgsVectorFileWriter.writeAsVectorFormatV3(
    temp_layer,
    save_path,
    QgsProject.instance().transformContext(),
    options
)

if error == QgsVectorFileWriter.NoError:
    print("✅ File saved:", save_path)
else:
    print("❌ Error:", error)
```

```python
# option B — processing.run savefeatures
processing.run("native:savefeatures", {
    'INPUT' : temp_layer,
    'OUTPUT': r'C:\GIS\output_final.shp'
})
```

---

## 🔄 `TEMPORARY_OUTPUT` vs a file path

| | `TEMPORARY_OUTPUT` | File path |
|--|-------------------|---------------|
| **Stored in** | RAM (memory) | Disk |
| **Speed** | ⚡ fast | 🐢 relatively slow |
| **Lifetime** | Until the end of the QGIS session | Permanent |
| **Shown automatically** | ❌ `addMapLayer()` needed | ❌ `addVectorLayer()` needed |
| **Type of result['OUTPUT']** | `QgsVectorLayer` | `str` (path) |
| **Chaining** | ✅ directly | ❌ the path has to be passed again |
| **Disk space** | ✅ not needed | ❌ needed |

---

## ⚡ Error handling

```python
try:
    result = processing.run("native:polygonstolines", {
        'INPUT' : fn,
        'OUTPUT': 'TEMPORARY_OUTPUT'
    })

    temp_layer = result['OUTPUT']

    if not temp_layer or not temp_layer.isValid():
        print("❌ The layer is invalid")
    elif temp_layer.featureCount() == 0:
        print("⚠️ The layer is empty — no features found")
    else:
        QgsProject.instance().addMapLayer(temp_layer)
        print(f"✅ {temp_layer.featureCount()} features added to the map")

except Exception as e:
    print(f"❌ Processing error: {e}")
```

---

## 📌 Summary

- **`TEMPORARY_OUTPUT`**: a result without a file, in RAM only
- `result['OUTPUT']` → a **`QgsVectorLayer`** object (not a string)
- `QgsProject.instance().addMapLayer()`: you have to add it to the panel yourself
- **Chaining**: one result is passed directly as the next tool's `'INPUT'`
- When the session ends, every `TEMPORARY_OUTPUT` is **deleted automatically**

👉 Use `TEMPORARY_OUTPUT` for intermediate steps, for testing, or when you don't need a file in the end.
