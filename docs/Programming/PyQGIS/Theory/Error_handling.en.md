# PyQGIS — common errors and how to fix them

When working with PyQGIS, some errors keep **coming back**. This page describes the most frequent ones: what each means and **how to fix it**.

---

## 📋 Quick reference

| Error | Cause |
|---------|--------|
| `EOL while scanning string literal` | A quote or `'` is missing |
| `AttributeError: QVariant has no attribute 'int'` | Lowercase `i` — the correct form is `Int` |
| `NameError: name 'X' is not defined` | A typo in a name, or `[Region]` instead of `['Region']` |
| `IndexError: list index out of range` | The layer name was not found in the project |
| `KeyError: 'field_name'` | The column does not exist in the attribute table |
| `AssertionError` (startEditing) | The layer is already open in edit mode |
| `invalid syntax` | A word or symbol is split — it must be written together |
| `Missing functions in IDE` | `import qgis` is missing at the start of the code |

---

## 🔴 EOL while scanning string literal

### What does it mean?

**EOL** = End Of Line — Python could not read the string to its end because **a quote is missing**.

### Cause 1 — `'INPUT'` is missing a `'` on one side

```python
# ❌ error — the ' before INPUT is missing
processing.run("native:deletecolumn", {INPUT': layer,
    'COLUMN': ['SHAPE_Leng'],
    'OUTPUT': out
})

# ✅ correct
processing.run("native:deletecolumn", {'INPUT': layer,
    'COLUMN': ['SHAPE_Leng'],
    'OUTPUT': out
})
```

### Cause 2 — the file path is missing its closing quote

```python
# ❌ error
fn = r'C:\Users\Public\GIS\shapefile\roads.shp   # ← the closing ' is missing

# ✅ correct
fn = r'C:\Users\Public\GIS\shapefile\roads.shp'
```

> 💡 **Remember:** every opened `'` or `"` must be **closed**.

---

## 🔴 AttributeError: type object 'QVariant' has no attribute 'int'

### What does it mean?

`QVariant` has **no** attribute `int` (lowercase) — Python is case-sensitive.

```python
# ❌ error — lowercase 'i'
fields.append(QgsField('ID', QVariant.int))

# ✅ correct — uppercase 'I'
fields.append(QgsField('ID', QVariant.Int))
```

### Correct values

```python
QVariant.Int        # integer
QVariant.Double     # decimal
QVariant.String     # text
QVariant.Bool       # True / False
QVariant.Date       # date
QVariant.DateTime   # date + time
```

---

## 🔴 NameError: name 'X' is not defined

### Cause 1 — a typo in the variable name

```python
# ❌ error — 'layes' (missing r)
layer = layes[0]

# ✅ correct
layer = layers[0]
```

```python
# ❌ error — 'f' (missing n)
iface.addVectorLayer(f, '', 'ogr')

# ✅ correct
iface.addVectorLayer(fn, '', 'ogr')
```

### Cause 2 — `[Region]` instead of `['Region']`

The `FIELD` parameter expects a **list of strings**, so the quotes are required:

```python
# ❌ error — Region without quotes, Python looks for it as a variable
processing.run("native:dissolve", {
    'INPUT' : layer,
    'FIELD' : [Region],       # ← Python: "a variable called Region?"
    'OUTPUT': fn
})

# ✅ correct — 'Region' as a string in the list
processing.run("native:dissolve", {
    'INPUT' : layer,
    'FIELD' : ['Region'],     # ← the column name as a string
    'OUTPUT': fn
})
```

---

## 🔴 IndexError: list index out of range

### What does it mean?

`mapLayersByName()` returns an **empty list**: no layer with that name was **found** in the project.

```python
# ❌ error — there is no layer named 'sadguri' in the project
layers = QgsProject.instance().mapLayersByName('sadguri')
layer  = layers[0]   # ← IndexError: list index out of range
```

```python
# ✅ correct — check first, then use it
layers = QgsProject.instance().mapLayersByName('sadguri')

if not layers:
    print("❌ Layer 'sadguri' not found — check the name in the Layers panel")
else:
    layer = layers[0]
    print(f"✅ Found: {layer.name()}")
```

> 💡 **How do you check the name?** Hover over the layer in the QGIS Layers panel to see its exact name. In the code it must match **exactly** (including upper/lower case).

---

## 🔴 KeyError: 'field_name'

### Cause 1 — the column does not exist in the attribute table

```python
# ❌ error — there is no 'fid' column in the table
for feat in layer.getFeatures():
    print(feat['fid'])   # → KeyError: 'fid'
```

```python
# ✅ fix — check the columns first
print([f.name() for f in layer.fields()])
# → ['ID', 'Name', 'Area', 'Region']  ← no 'fid'!

# then use the correct name
for feat in layer.getFeatures():
    print(feat['ID'])
```

### Cause 2 — the column name is too long for a Shapefile

An ESRI Shapefile allows **at most 10 characters** in a column name:

```python
# ❌ error — 12 characters, the Shapefile cannot store it
layer.dataProvider().addAttributes([
    QgsField('X_coordinate', QVariant.Double)   # → KeyError: 'X_coordinate'
])

# ✅ correct — within 10 characters
layer.dataProvider().addAttributes([
    QgsField('X_coord', QVariant.Double)        # 7 characters ✅
])
```

> 💡 GeoPackage (`.gpkg`) and GeoJSON have **no** name length limit.

---

## 🔴 AssertionError — startEditing()

### What does it mean?

The layer is already open in **edit mode** — it cannot be opened twice.

```
AssertionError
File "edit.py", line 38, in __enter__
    assert self.layer.startEditing()
```

### Fix

```python
# ✅ fix A — turn off Edit Mode by hand in QGIS (the ✏️ button in the toolbar)

# ✅ fix B — check in code before opening it
if layer.isEditable():
    layer.rollBack()        # or layer.commitChanges()

with edit(layer):
    # now you can edit safely
    layer.changeAttributeValue(feat.id(), idx, new_value)
```

> ⚠️ **In QGIS**, a small ✏️ pencil icon appears next to the layer in the Layers panel when Edit Mode is on — **turn it off** before running the script.

---

## 🔴 invalid syntax — the Processing function name

### What does it mean?

The function name is split, and Python **cannot recognize** a split name.

```python
# ❌ error — 'proces sing' is split
proces sing.run("native:deleteduplicategeometries", {
    'INPUT' : layer,
    'OUTPUT': output
})

# ✅ correct — written together
processing.run("native:deleteduplicategeometries", {
    'INPUT' : layer,
    'OUTPUT': output
})
```

---

## 🔴 Missing functions in IDE

### What does it mean?

In an external IDE (VS Code, PyCharm), `QgsVectorLayer`, `QgsProject` and other classes are **not visible** because the `qgis` module has **not been imported**.

```python
# ❌ error — the QGIS classes are not available
layer = QgsVectorLayer(fn, 'Layer', 'ogr')   # → NameError

# ✅ correct — import at the start of the code
import qgis
from qgis.core import QgsVectorLayer, QgsProject, QgsVectorFileWriter

layer = QgsVectorLayer(fn, 'Layer', 'ogr')
```

> 💡 In the **QGIS Python Console** this import happens **automatically**. In an external IDE you have to write it yourself.

---

## 🗂️ File paths — writing them correctly

On Windows, the `\` character is an **escape character** in Python — it has a special meaning.

```python
# ❌ wrong — Python reads \U, \P as special characters
fn = 'C:\Users\Public\GIS\points.shp'

# ✅ option 1 — r"" raw string (recommended)
fn = r'C:\Users\Public\GIS\points.shp'

# ✅ option 2 — double backslash
fn = 'C:\\Users\\Public\\GIS\\points.shp'

# ✅ option 3 — forward slash (works on Windows too)
fn = 'C:/Users/Public/GIS/points.shp'
```

> 💡 **Recommendation:** use `r''` (raw string) — it is the most readable and rules out errors.

---

## 💡 `iface.addVectorLayer()` — the name parameter

```python
iface.addVectorLayer(fn, '', 'ogr')
#                        ↑
#                  this is the layer name in QGIS
#                  '' = empty → QGIS uses the file name
```

```python
# with a name
iface.addVectorLayer(fn, 'My layer', 'ogr')
```

---

## 🔴 TypeError: '>=' not supported between instances of 'str' and 'int'

### What does it mean?

Python is trying to **compare a string with an integer**, which is not possible. The `>=`, `<=`, `>`, `<` operators work between values **of the same type**.

### Where it happens

```python
layers = QgsProject.instance().mapLayersByName('gis_osm_places_free_1')
layer  = layers[0]

delf  = layer.dataProvider().capabilities()
feats = layer.getFeatures()
dfeats = []

if delf & QgsVectorDataProvider.DeleteFeatures:
    for feat in feats:
        if feat['osm_id'] >= 9934538919:   # ← ❌ TypeError here!
            dfeats.append(feat.id())
```

### Cause

`feat['osm_id']`: the `osm_id` column is stored as a **string** (`str`) in the attribute table, but `9934538919` is an **integer** (`int`):

```python
for feat in layer.getFeatures():
    print(type(feat['osm_id']))
# → <class 'str'>   ← a string, not an int!

# Python cannot compare:
"9934538919" >= 9934538919   # ❌ TypeError
```

### Checking the column type

```python
for field in layer.fields():
    if field.name() == 'osm_id':
        print(f"Name: {field.name()}")
        print(f"Type: {field.typeName()}")   # → "String" or "Integer"
        print(f"Type: {field.type()}")        # → 10 (String) or 2 (Int)
```

### Fix — convert with `int()`

```python
# ✅ convert str → int before comparing
if delf & QgsVectorDataProvider.DeleteFeatures:
    for feat in feats:
        if int(feat['osm_id']) >= 9934538919:
            dfeats.append(feat.id())
    df = layer.dataProvider().deleteFeatures(dfeats)
    layer.triggerRepaint()
```

### Fix — a safe version with `try/except`

```python
# ✅ if osm_id is sometimes empty or NULL
if delf & QgsVectorDataProvider.DeleteFeatures:
    for feat in feats:
        try:
            osm_id = int(feat['osm_id'])
            if osm_id >= 9934538919:
                dfeats.append(feat.id())
        except (ValueError, TypeError):
            print(f"⚠️ Feature {feat.id()}: could not convert osm_id → '{feat['osm_id']}'")

    if dfeats:
        df = layer.dataProvider().deleteFeatures(dfeats)
        layer.triggerRepaint()
        print(f"🗑️ Deleted {len(dfeats)} features")
    else:
        print("ℹ️ No features to delete were found")
```

### Type comparison table

| Column type | `feat['osm_id']` | Comparing with `int` | Fix |
|------------|-----------------|-------------------|------------|
| `String` | `"9934538919"` | ❌ TypeError | `int(feat['osm_id'])` |
| `Integer` / `Int64` | `9934538919` | ✅ works | No conversion needed |
| `Double` | `9934538919.0` | ✅ works | `int()` optional |
| `NULL` / `None` | `None` | ❌ TypeError | `try/except` |

> 💡 In **OSM data** the `osm_id` column is often stored as a **String**, because the IDs can be very large. Always check the column type with `field.typeName()` before comparing.

---


## 🔴 PyQGIS Crash

```python
processing.run("native:pointstopath", {'INPUT': fn, 'CLOSE_PATH': True, \

             'ORDER_EXPRESSION': '"ID"', 'NATURAL_SORT': False, \

             'GROUP_EXPRESSION': '', 'OUTPUT': output })

```

1. Main cause: wrong syntax in ORDER_EXPRESSION, or a column that does not exist.
If the table has no ID column at all, or the syntax is wrong, the QGIS C++ core (backend) tries to read data that does not exist. Unlike Python, which would raise an error, C++ often hits a memory error (Segmentation Fault) at this point and takes the whole of QGIS down with it.

How it should be written: ORDER_EXPRESSION expects text (a string) that is a field name. Double quotes inside quotes (`'"ID"'`) often cause confusion.

Solution: if the column is ID, simply write `'ID'`. If the layer has no such column at all, either remove this line or leave it empty `''`, because this parameter is optional.

2. A problem writing/overwriting the file (lock).
If you run the code a second time and lake_line.shp is already open in QGIS (it is in the panel on the left of the interface), the tool tries to overwrite that file.
Because QGIS holds the file (it is locked), the operating system forbids writing, and native:pointstopath often fails on this.

How do we fix the code?
To be safe, it is better to use a memory layer (a temporary in-memory layer) as the output, so that writing and overwriting files on disk does not get in the way. If you really do want to save to a file, fix the syntax like this:

```Python
import processing

fn = r'C:\Users\Public\Documents\GK\PyQGIS\shp\lake.shp'
output = r'C:\Users\Public\Documents\GK\PyQGIS\shp\lake_line.shp'

# safe parameters: if you have no ID column, remove ORDER_EXPRESSION entirely,
# or write a real column name, e.g. 'id' (without inner quotes)
params = {
    'INPUT': fn, 
    'CLOSE_PATH': True, 
    'ORDER_EXPRESSION': '', # leave it empty if you don't need it
    'NATURAL_SORT': False, 
    'GROUP_EXPRESSION': '', 
    'OUTPUT': output 
}

# before running, check whether the file is already open/locked
try:
    res = processing.run("native:pointstopath", params)
    # only if everything went well, load it onto the screen
    if res and 'OUTPUT' in res:
        iface.addVectorLayer(res['OUTPUT'], 'Lake Line Layer', 'ogr')
except Exception as e:
    print(f"Error while running the tool: {e}")

```

💡 A small development tip:
When you are testing code, write `'TEMPORARY_OUTPUT'` as the OUTPUT instead of a file path. Then everything happens in RAM, nothing gets locked, and the chance of crashing QGIS is reduced to a minimum.



---

## 📌 Summary — error flowchart

```
Got an error?
      │
      ├── EOL / SyntaxError    → is a quote or ' missing?
      │
      ├── NameError            → a typo in a name? quotes in ['Field']?
      │
      ├── AttributeError       → QVariant.Int (uppercase I)?
      │
      ├── IndexError           → is the mapLayersByName() name correct?
      │
      ├── KeyError             → does the column exist? is the name ≤10 characters?
      │
      ├── TypeError            → is feat['column'] a string? convert with int()
      │
      └── AssertionError       → is Edit Mode off? check isEditable()
```

👉 **Always the first step:** read the **last line** of the error message — that is where the cause is.
