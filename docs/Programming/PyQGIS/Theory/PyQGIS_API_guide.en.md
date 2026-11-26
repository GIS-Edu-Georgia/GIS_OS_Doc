# Reading the PyQGIS API documentation

The official PyQGIS documentation can **look hard** at first — symbols, types, arrows. This page explains **how to read** that information with practical examples.

---

## 🔗 Example — `mapLayersByName`

Link to the official documentation:
[QgsMapLayerStore.mapLayersByName](https://qgis.org/pyqgis/3.44/core/QgsMapLayerStore.html#qgis.core.QgsMapLayerStore.mapLayersByName)

```
mapLayersByName(self, name: str | None) → list[QgsMapLayer]
```

---

## 🔬 Breaking down the signature

```
mapLayersByName  (  self,  name: str | None  )  →  list[QgsMapLayer]
│                   │      │                      │
│                   │      │                      └── what it returns
│                   │      └── parameter with name and type
│                   └── in every Python class method — the object itself
└── method name
```

### Part 1 — `self`

```python
mapLayersByName(self, name: str | None)
#               ↑
#   Always first in Python class methods.
#   You do not pass it by hand — Python does it automatically.
#   It means: "this method belongs to an object of the class"
```

```python
# self = QgsProject.instance() — i.e. the project object
QgsProject.instance().mapLayersByName('gis_osm_places_free_1')
#          ↑
#     this is "self" — the object the method is called on
```

---

### Part 2 — `name: str | None`

```
name: str | None
│     │    │
│     │    └── None is accepted too (optional parameter)
│     └── str — a string
└── parameter name
```

```
str | None  ←→  Optional[str]
```

This means the `name` parameter can be:

```python
# ✅ a string
mapLayersByName('gis_osm_places_free_1')

# ✅ None
mapLayersByName(None)    # ← returns all layers regardless of name
```

---

### Part 3 — `→ list[QgsMapLayer]`

```
→ list[QgsMapLayer]
↑  │    │
│  │    └── type of the list elements — QgsMapLayer objects
│  └── a Python list
└── arrow = "returns"
```

So the method **always returns a list** — `[]` — even when nothing is found:

```python
result = QgsProject.instance().mapLayersByName('gis_osm_places_free_1')
print(type(result))   # → <class 'list'>

# found
print(result)         # → [<QgsVectorLayer: 'gis_osm_places_free_1' (ogr)>]

# not found
result = QgsProject.instance().mapLayersByName('nonexistent')
print(result)         # → []    ← an empty list, not None!
```

---

## 📖 Reading the full documentation

```
mapLayersByName(self, name: str | None) → list[QgsMapLayer]   ← signature

Retrieve a list of matching layers by layer name.            ← what it does

Parameters:
    name (Optional[str]) – name of layers to match          ← parameter description

Return type:
    list[QgsMapLayer]                                        ← return type

Returns:
    list of matching layers                                  ← description of the return value

See also
    mapLayer()                                               ← similar methods
    mapLayers()
```

### Field by field

| Field | Value | Meaning |
|------|-----------|---------|
| **Signature** | `mapLayersByName(self, name: str \| None)` | The method's signature |
| **Parameters** | `name (Optional[str])` | What is passed in |
| **Return type** | `list[QgsMapLayer]` | What type is returned |
| **Returns** | `list of matching layers` | Description of what is returned |
| **See also** | `mapLayer()`, `mapLayers()` | Similar methods |

---

## ✍️ Turning it into code

From reading the documentation to code:

```python
# from the signature we know:
# 1. we call it on QgsProject.instance() (self)
# 2. we pass a string as name
# 3. we get a list back

layers = QgsProject.instance().mapLayersByName('gis_osm_places_free_1')
#                               ↑ the name parameter

# "→ list[QgsMapLayer]" — we got a list
# list[0] — the first element (a QgsMapLayer object)
layer = layers[0]
```

### Why `[0]` on the list?

```python
# mapLayersByName returns a list — several layers may share one name!
layers = QgsProject.instance().mapLayersByName('roads')
# → [<QgsVectorLayer: 'roads' (ogr)>, <QgsVectorLayer: 'roads' (memory)>]
#     ↑ index 0                         ↑ index 1

layer = layers[0]    # ← we took the first layer
```

### Correct use — to avoid an `IndexError`

```python
layers = QgsProject.instance().mapLayersByName('gis_osm_places_free_1')

# ❌ [0] directly — if the list is empty → IndexError: list index out of range
layer = layers[0]

# ✅ with a check
if layers:
    layer = layers[0]
    print(f"✅ Found: {layer.name()}")
else:
    print("❌ Layer not found — check the name in the Layers panel")
```

---

## 🔗 `See also` — similar methods

The documentation always suggests **similar methods**:

```
See also  mapLayer()    ← one layer by ID
See also  mapLayers()   ← all layers as a dictionary
```

| Method | Signature | Used for |
|--------|----------|------------|
| `mapLayersByName()` | `(name) → list[QgsMapLayer]` | Search by name |
| `mapLayer()` | `(layerId) → QgsMapLayer` | Search by ID |
| `mapLayers()` | `() → dict[str, QgsMapLayer]` | All layers |

```python
# mapLayer() — returns one object (not a list)
layer = QgsProject.instance().mapLayer('abc123_20250115')
# → <QgsVectorLayer: ...>  or  None

# mapLayers() — all layers as a dictionary
all_layers = QgsProject.instance().mapLayers()
# → {'id1': <QgsVectorLayer...>, 'id2': <QgsRasterLayer...>, ...}
for layer_id, layer in all_layers.items():
    print(layer.name())
```

---

## 📐 Type reference

These signs often appear in the API documentation:

| Sign | Meaning | Example |
|--------|------------|---------|
| `str` | String | `'roads'` |
| `int` | Integer | `42` |
| `float` | Decimal | `3.14` |
| `bool` | Boolean | `True` / `False` |
| `None` | Empty value | `None` |
| `str \| None` | A string **or** None | `Optional[str]` |
| `list[X]` | A list of type X | `[layer1, layer2]` |
| `dict[K, V]` | A K→V dictionary | `{'id': layer}` |
| `→ X` | Returns type X | `→ list[QgsMapLayer]` |
| `self` | The class object | Not passed by hand |

---

## 📌 Summary

```
mapLayersByName(self, name: str | None) → list[QgsMapLayer]
      │               │    │                 │
      │               │    └── None is also allowed
      │               └── str — a string
      │         you pass → name='roads'
      └── a method on QgsProject.instance()

→ list[QgsMapLayer]   =   always a list
                          empty [] if nothing is found
                          [layer] if one is found
                          [l1, l2] if several share one name
```

```python
# steps for reading the documentation:
# 1. name         → mapLayersByName
# 2. parameter    → name: str
# 3. return       → list → [0] first element
# 4. See also     → mapLayer() / mapLayers() — alternatives

layers = QgsProject.instance().mapLayersByName('gis_osm_places_free_1')
if layers:
    layer = layers[0]
```

👉 Official PyQGIS 3.44 documentation: [qgis.org/pyqgis/3.44](https://qgis.org/pyqgis/3.44/)
