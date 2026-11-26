# Topic IV — deleting features and columns

Deleting a feature from a layer · deleting an attribute column · deleting duplicate geometries · deleting duplicate records

---

## Introduction

!!! tip "Recommendation"
    Before running a delete operation, **make a backup copy** (Shapefile / GeoPackage).
    `deleteFeatures()` and `deletecolumn` **change the file directly**, and the operation is **irreversible**.

---

## 1. Deleting features by index (ID)

The most direct method: a list of IDs is passed straight to `deleteFeatures()`.

```py title="delete_by_id.py" linenums="1"
from qgis.core import QgsProject, QgsVectorDataProvider

# find the layer by name
layers = QgsProject.instance().mapLayersByName('name of the layer to clean')
if not layers:
    raise ValueError('Layer not found')

layer = layers[0]
caps  = layer.dataProvider().capabilities()

if caps & QgsVectorDataProvider.DeleteFeatures:
    ids_to_delete = [0, 1, 2, 3, 4]   # list of IDs
    layer.dataProvider().deleteFeatures(ids_to_delete)
    layer.triggerRepaint()
    print(f"Deleted: {len(ids_to_delete)} features")
else:
    print("⚠ The layer does not support the DeleteFeatures operation")
```

> 💡 `triggerRepaint()` tells QGIS to redraw the layer.
> Without it, the change is written but the screen keeps showing the old state.

---

## 2. Deleting features by a **numeric** attribute

### Option 1 — a simple condition (`>`)

```py title="delete_numeric_v1.py" linenums="1"
from qgis.core import QgsProject, QgsVectorDataProvider

layer = QgsProject.instance().mapLayersByName('sadguri')[0]
caps  = layer.dataProvider().capabilities()
ids   = []

if caps & QgsVectorDataProvider.DeleteFeatures:
    for feat in layer.getFeatures():
        if feat['fid'] > 16:          # fid > 16 — will be deleted
            ids.append(feat.id())

    layer.dataProvider().deleteFeatures(ids)
    layer.triggerRepaint()
    print(f"Deleted: {len(ids)} features")
```

---

### Option 2 — two separate conditions (`or`)

```py title="delete_numeric_v2.py" linenums="1"
from qgis.core import QgsProject, QgsVectorDataProvider

layer = QgsProject.instance().mapLayersByName('Georgia_municipalities')[0]
caps  = layer.dataProvider().capabilities()
ids   = []

if caps & QgsVectorDataProvider.DeleteFeatures:
    for feat in layer.getFeatures():
        oid = feat['OBJECTID_1']
        if oid > 19 or oid < 17:      # 17, 18, 19 stay — the rest are deleted
            ids.append(feat.id())

    layer.dataProvider().deleteFeatures(ids)
    layer.triggerRepaint()
    print(f"Deleted: {len(ids)} features")
```

---

### Option 3 — a range condition (`<` `<`)

```py title="delete_numeric_v3.py" linenums="1"
from qgis.core import QgsProject, QgsVectorDataProvider

layer = QgsProject.instance().mapLayersByName('Georgia_municipalities')[0]
caps  = layer.dataProvider().capabilities()
ids   = []

if caps & QgsVectorDataProvider.DeleteFeatures:
    for feat in layer.getFeatures():
        # Python's "chained" comparison — reads naturally
        if 6 < feat['OBJECTID_1'] < 10:   # 7, 8, 9 are deleted
            ids.append(feat.id())

    layer.dataProvider().deleteFeatures(ids)
    layer.triggerRepaint()
    print(f"Deleted: {len(ids)} features")
```

> 💡 `6 < x < 10` is syntax specific to Python.
> It is equivalent to `x > 6 and x < 10`, but **easier to read**.

---

## 3. Deleting features by a **text** attribute

### Option 1 — exact match (`==`)

```py title="delete_text_v1.py" linenums="1"
from qgis.core import QgsProject, QgsVectorDataProvider

layer = QgsProject.instance().mapLayersByName('Georgia_municipalities')[0]
caps  = layer.dataProvider().capabilities()
ids   = []

if caps & QgsVectorDataProvider.DeleteFeatures:
    for feat in layer.getFeatures():
        if feat['DISTR_ENG'] == "Tsalka":   # only Tsalka is deleted
            ids.append(feat.id())

    layer.dataProvider().deleteFeatures(ids)
    layer.triggerRepaint()
    print(f"Deleted: {len(ids)} features")
```

---

### Option 2 — a combined condition (`!=` + `or`)

```py title="delete_text_v2.py" linenums="1"
from qgis.core import QgsProject, QgsVectorDataProvider

layer = QgsProject.instance().mapLayersByName('Georgia_municipalities')[0]
caps  = layer.dataProvider().capabilities()
ids   = []

if caps & QgsVectorDataProvider.DeleteFeatures:
    for feat in layer.getFeatures():
        # deleted: everything that is not Tsalka — or is Gurjaani
        if feat['DISTR_ENG'] != "Tsalka" or feat['MUNICIPAL'] == "Gurjaani":
            ids.append(feat.id())

    layer.dataProvider().deleteFeatures(ids)
    layer.triggerRepaint()
    print(f"Deleted: {len(ids)} features")
```

> ⚠️ `or` is a **broad** condition — use it carefully.
> For more control, prefer `and`.

---

## 4. Deleting a column from the attribute table

`native:deletecolumn` takes the column(s) and exports the result as a new file.

```py title="delete_column.py" linenums="1"
import processing
from qgis.core import QgsProject

layer  = QgsProject.instance().mapLayersByName('Georgia_municipalities')[0]
output = r'C:\Users\Public\Documents\GK\PyQGIS\shp\tema_4\Georgia_municipalities2.shp'

result = processing.run(
    'native:deletecolumn',
    {
        'INPUT' : layer,
        'COLUMN': ['SHAPE_Leng', 'SHAPE_Area'],   # a list — one or more columns
        'OUTPUT': output
    }
)

print("New file:", result['OUTPUT'])
```

> 💡 `COLUMN` is a **list**. You can delete several columns at once.
> The operation creates a **new file** — the original is **not changed**.

---

## 5. Deleting duplicate attributes

`native:removeduplicatesbyattribute` keeps the **unique** records and puts the duplicates in a separate file.

```py title="delete_duplicate_attributes.py" linenums="1"
import processing
from qgis.core import QgsProject

layer = QgsProject.instance().mapLayersByName('Georgia_municipalities')[0]

result = processing.run(
    'native:removeduplicatesbyattribute',
    {
        'INPUT'     : layer,
        'FIELDS'    : ['MUNICIPAL'],    # duplicates are determined by this column
        'OUTPUT'    : r'C:\Users\Public\Documents\GK\PyQGIS\shp\test\municipalities_unique.shp',
        'DUPLICATES': r'C:\Users\Public\Documents\GK\PyQGIS\shp\test\municipalities_duplicates.shp'
    }
)

print("Unique:", result['OUTPUT'])
print("Duplicates:", result['DUPLICATES'])
```

> 💡 `DUPLICATES` is optional but useful: it stores the **removed** features
> in a separate file, so you can check them.

---

## 6. Deleting duplicate geometries

`native:deleteduplicategeometries`: when there are **two or more** identical geometries in one place, it keeps only one.

```py title="delete_duplicate_geometries.py" linenums="1"
import processing
from qgis.core import QgsProject

layer  = QgsProject.instance().mapLayersByName('Georgia_municipalities')[0]
output = r'C:\Users\Public\Documents\GK\PyQGIS\shp\tema_4\municipalities_no_dupes.shp'

result = processing.run(
    'native:deleteduplicategeometries',
    {
        'INPUT' : layer,
        'OUTPUT': output
    }
)

print("Result:", result['OUTPUT'])
```

---

## 📋 Methods summary

| Method / tool | Use | Note |
|----------------------|-----------|----------|
| `deleteFeatures([ids])` | Features by ID | **Changes the layer directly** |
| `feat.id()` | The feature's internal ID | Different from an `fid` attribute |
| `triggerRepaint()` | Refresh the screen | After every deletion |
| `native:deletecolumn` | Delete a column | Saves as a new file |
| `native:removeduplicatesbyattribute` | Attribute duplicates | Saves the duplicates separately |
| `native:deleteduplicategeometries` | Geometry duplicates | Saves as a new file |

---

## ⚠️ Safety reminders

1. **Always a backup copy** — `deleteFeatures()` is irreversible
2. **Layer type** — `deleteFeatures` only works on **vector** layers
3. **Check the capabilities** — `caps & QgsVectorDataProvider.DeleteFeatures` — always check whether the layer supports deletion (e.g. read-only WFS layers do not)
4. **processing functions** create a new file and do **not change** the original

---

> **Next topic:** **creating and updating** features and attributes — `addFeatures()`, `changeAttributeValue()`.
