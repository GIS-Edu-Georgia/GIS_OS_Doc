# `native:` and `qgis:` — the difference in PyQGIS

In `processing.run()` the first argument always looks like this:

```python
processing.run("native:pointstopath", {...})
processing.run("qgis:selectbyattribute", {...})
#               ↑
#          provider:toolname
#          ─────────────────
#          prefix : tool name
```

The **prefix** tells QGIS **where to look** for the tool.

---

## 🔑 The main difference

| | `native:` | `qgis:` |
|--|-----------|---------|
| **Written in** | C++ | Python |
| **Speed** | ⚡ fast | 🐢 relatively slow |
| **Maintained in** | The QGIS Core library | QGIS Python Plugins |
| **Stability** | ✅ high | 🔶 may change between versions |
| **Thread-safe** | ✅ | 🔶 not always |
| **Location** | `qgis/src/analysis/` | `python/plugins/processing/` |

---

## 🔧 `native:` — C++ tools

`native:` tools are built into the **C++ core** of QGIS. They are the fastest and most stable.

### Examples

```python
# point → line
processing.run("native:pointstopath", {
    'INPUT'            : layer,
    'ORDER_EXPRESSION' : '"ID"',
    'CLOSE_PATH'       : False,
    'OUTPUT'           : 'TEMPORARY_OUTPUT'
})

# buffer
processing.run("native:buffer", {
    'INPUT'    : layer,
    'DISTANCE' : 100,
    'SEGMENTS' : 5,
    'OUTPUT'   : 'TEMPORARY_OUTPUT'
})

# polygon → line
processing.run("native:polygonstolines", {
    'INPUT' : layer,
    'OUTPUT': 'TEMPORARY_OUTPUT'
})

# points along a line
processing.run("native:pointsalonglines", {
    'INPUT'   : layer,
    'DISTANCE': 50,
    'OUTPUT'  : 'TEMPORARY_OUTPUT'
})

# Dissolve
processing.run("native:dissolve", {
    'INPUT' : layer,
    'FIELD' : ['Region'],
    'OUTPUT': 'TEMPORARY_OUTPUT'
})

# delete duplicate geometries
processing.run("native:deleteduplicategeometries", {
    'INPUT' : layer,
    'OUTPUT': 'TEMPORARY_OUTPUT'
})
```

### Where does the code live?

```
QGIS Source Code:
  qgis/src/analysis/processing/
    ├── qgsalgorithmbuffer.cpp          ← native:buffer
    ├── qgsalgorithmpointstopath.cpp    ← native:pointstopath
    ├── qgsalgorithmpolygonstolines.cpp ← native:polygonstolines
    └── ...
```

---

## 🐍 `qgis:` — Python tools

`qgis:` tools are written in Python and are part of the QGIS Processing Framework.

### Examples

```python
# select by attribute ('კახეთი' = Kakheti, as stored in the data)
processing.run("qgis:selectbyattribute", {
    'INPUT'    : layer,
    'FIELD'    : 'Region',
    'OPERATOR' : 0,        # 0 = equals (=)
    'VALUE'    : 'კახეთი',
    'METHOD'   : 0         # 0 = new selection
})

# line → polygon
processing.run("qgis:linestopolygons", {
    'INPUT' : layer,
    'OUTPUT': 'TEMPORARY_OUTPUT'
})

# field calculation
processing.run("qgis:fieldcalculator", {
    'INPUT'         : layer,
    'FIELD_NAME'    : 'area_ha',
    'FIELD_TYPE'    : 0,       # 0 = Float
    'FIELD_LENGTH'  : 10,
    'FIELD_PRECISION': 2,
    'FORMULA'       : '$area / 10000',
    'OUTPUT'        : 'TEMPORARY_OUTPUT'
})

# random selection
processing.run("qgis:randomselection", {
    'INPUT' : layer,
    'METHOD': 0,     # 0 = Number of selected features
    'NUMBER': 10
})
```

### Where does the code live?

```
QGIS Source Code:
  python/plugins/processing/algs/qgis/
    ├── SelectByAttribute.py      ← qgis:selectbyattribute
    ├── LinesToPolygons.py        ← qgis:linestopolygons
    ├── FieldCalculator.py        ← qgis:fieldcalculator
    └── ...
```

---

## ⚡ Why the difference in speed?

```
native:buffer (C++)                    qgis:selectbyattribute (Python)
─────────────────────────────────      ─────────────────────────────────
compiled binary code                   interpreted Python code
         │                                        │
         ▼                                        ▼
executed directly by the CPU           Python interpreter → bytecode → CPU
         │                                        │
         ▼                                        ▼
    ~10x faster                          overhead on every operation
```

**The practical difference:**

```python
import time

# a layer with 100,000 features

start = time.time()
processing.run("native:buffer", {'INPUT': large_layer, 'DISTANCE': 100, 'OUTPUT': 'TEMPORARY_OUTPUT'})
print(f"native: {time.time() - start:.2f}s")   # → native:  1.2s

start = time.time()
processing.run("qgis:buffer", {'INPUT': large_layer, 'DISTANCE': 100, 'OUTPUT': 'TEMPORARY_OUTPUT'})
print(f"qgis:   {time.time() - start:.2f}s")   # → qgis:   11.8s  (existed in older versions)
```

> 💡 That is exactly why **many `qgis:` tools were rewritten as `native:`** during the QGIS 3.x cycle.

---

## 🔄 `qgis:` → `native:` — migration

As QGIS 3.x developed, many `qgis:` tools were **rewritten in C++** and became `native:`. The old `qgis:` name is often kept as an **alias**, so old code still works.

```python
# in QGIS 3.x these two are often the same:
processing.run("qgis:dissolve", {...})    # ← alias
processing.run("native:dissolve", {...}) # ← the real implementation

# the QGIS toolbox responds with:
# "qgis:dissolve is deprecated, use native:dissolve"
```

### By version

| Tool | Old | New (3.x) |
|---------|-------|------------|
| Dissolve | `qgis:dissolve` | `native:dissolve` |
| Buffer | `qgis:fixeddistancebuffer` | `native:buffer` |
| Polygon to Lines | `qgis:polygonstolines` | `native:polygonstolines` |
| Points along Geometry | `qgis:pointsalonglines` | `native:pointsalonglines` |
| Centroid | `qgis:centroids` | `native:centroids` |

---

## 🌐 Other prefixes

Besides `native:` and `qgis:` there are other prefixes:

```python
# gdal: — the GDAL library (raster, vector)
processing.run("gdal:translate", {...})
processing.run("gdal:warpreproject", {...})
processing.run("gdal:rasterize", {...})

# grass7: — GRASS GIS tools
processing.run("grass7:v.buffer", {...})
processing.run("grass7:r.slope.aspect", {...})

# saga: — SAGA GIS tools
processing.run("saga:slopeaspectcurvature", {...})

# 3d: — QGIS 3D tools
processing.run("3d:tessellate", {...})
```

### Comparing the prefixes

| Prefix | Language | Specialization |
|---------|-----|--------------|
| `native:` | C++ | Vector, general geoprocessing |
| `qgis:` | Python | General, selection, fields |
| `gdal:` | C++ | Raster, format conversion |
| `grass7:` | C | Hydrology, analysis, raster |
| `saga:` | C++ | Modelling, terrain analysis |
| `3d:` | C++ | 3D geometry |

---

## 🔍 Finding a tool

### In the Python Console — list all tools

```python
# all tools
for alg in QgsApplication.processingRegistry().algorithms():
    print(alg.id())
# → native:buffer
# → native:pointstopath
# → qgis:selectbyattribute
# → gdal:translate
# → ...

# by a search word
for alg in QgsApplication.processingRegistry().algorithms():
    if 'point' in alg.id().lower():
        print(alg.id(), '→', alg.displayName())
# → native:pointstopath → Points to Path
# → native:pointsalonglines → Points along Geometry
# → native:randompointsinextent → Random points in extent
```

### Finding out a tool's parameters

```python
# full description of a tool
import processing
processing.algorithmHelp("native:pointstopath")
# prints:
# Points to Path (native:pointstopath)
# Parameters
# INPUT: Input layer [vector: point]
# ORDER_EXPRESSION: Order expression [expression]
# ...
```

### Visually, in the Processing Toolbox

```
QGIS → Processing → Toolbox (Ctrl+Alt+T)
     → right-click on a tool
     → "Copy as Python Command"
     → gives you the code directly, with processing.run()
```

---

## 📌 Summary

```
processing.run("native:pointstopath", {...})
               ↑
               └── native: = C++ = fast, stable ✅

processing.run("qgis:selectbyattribute", {...})
               ↑
               └── qgis: = Python = flexible, editable 🔶
```

- **`native:`**: written in C++, fast, **the first choice** if it exists
- **`qgis:`**: written in Python, slower, sometimes an **alias** of `native:`
- In new code, always use **`native:`** where possible
- **`gdal:`**, **`grass7:`**, **`saga:`**: specialized libraries
- `processing.algorithmHelp("native:toolname")`: find out a tool's parameters

👉 In the QGIS Processing Toolbox you can always see a tool's name with its `native:` or `qgis:` prefix.
