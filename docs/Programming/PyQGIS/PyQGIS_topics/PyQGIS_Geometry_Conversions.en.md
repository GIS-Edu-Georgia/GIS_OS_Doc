# Geometry conversions
<br>
Official documentation <br>
Converting a point layer to a line — Point to Line Conversion
Points to [path:](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/vectorcreation.html#points-to-path) <br>
Converting a line layer to a polygon — Lines to polygon
Lines to [polygons:](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/vectorgeometry.html#lines-to-polygons) <br>
Converting a polygon layer to lines — Polygon to Lines Conversion
Polygons to [lines:](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/vectorgeometry.html#polygons-to-lines) <br>
Getting points from a line layer — Points along geometry
Points along [geometry:](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/vectorgeometry.html#points-along-geometry) <br>

**Geometry Conversions** — changing the geometry type of vector layers using `processing.run()`.

### Some definitions
- processing.run means the QGIS Processing Toolbox. [method/function]
- The word native means a QGIS tool, and pointstopath is its name.
- The code inside it follows the dictionary principle {}: the argument holds key:value pairs.

!!! warning
    Pay attention to 'ORDER_EXPRESSION': '"ID"' in the tool, because not every layer has this ID column in its table, and it must be replaced with the right one. Otherwise the program crashes completely.




---

## 🔑 The main idea

In PyQGIS you can **convert** the geometry of a vector layer into another type, by calling QGIS Processing Toolbox tools directly from code.

```
Point  ──→  Line  ──→  Polygon
  ↑                       │
  └───── Points along ←───┘
```

| Conversion | Tool | Processing ID |
|------------|---------|---------------|
| Point → line | Points to Path | `native:pointstopath` |
| Line → polygon | Lines to Polygons | `qgis:linestopolygons` |
| Polygon → line | Polygons to Lines | `native:polygonstolines` |
| Line → points | Points along Geometry | `native:pointsalonglines` |

---

## 🧩 `processing.run()` — how does it work?

```python
processing.run("provider:toolname", { parameters })
```

- **`processing.run`** — calling the QGIS Processing Toolbox from code
- **`native`** — a built-in QGIS tool
- **`qgis`** — the QGIS algorithm library
- **`{ ... }`** — parameters as a `key: value` dictionary

---

## 🟢 Point → line

**Points to Path** — converting a point layer to a line

📎 Official documentation: [Points to Path](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/vectorcreation.html#points-to-path)

```python
fn     = r'C:\Users\Public\Documents\GIS\shapefile\points.shp'
output = r'C:\Users\Public\Documents\GIS\shapefile\points_to_line.shp'

processing.run("native:pointstopath", {
    'INPUT'            : fn,
    'CLOSE_PATH'       : True,    # True = the line is closed (a loop)
    'ORDER_EXPRESSION' : '"ID"',  # ⚠️ column name — see the warning
    'NATURAL_SORT'     : False,
    'GROUP_EXPRESSION' : '',
    'OUTPUT'           : output
})

layer = iface.addVectorLayer(output, 'Points to Line', 'ogr')
```

> ⚠️ **`ORDER_EXPRESSION`**: this parameter defines **in what order** the points are joined into a line. Not every layer has an `"ID"` column — **check your layer's attributes** and replace it with the right column name. Without the column, or with a wrong name, the program gives an `ERROR`.

📌 The result is a **line** in which the points are joined in sequence according to `ORDER_EXPRESSION`.

---

## 🔵 Line → polygon

**Lines to Polygons** — converting a line layer to a polygon

📎 Official documentation: [Lines to Polygons](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/vectorgeometry.html#lines-to-polygons)

```python
fn     = r'C:\Users\Public\Documents\GIS\shapefile\line_layer.shp'
output = r'C:\Users\Public\Documents\GIS\shapefile\polygon_from_line.shp'

processing.run("qgis:linestopolygons", {
    'INPUT' : fn,
    'OUTPUT': output
})

layer = iface.addVectorLayer(output, 'Line to Polygon', 'ogr')
```

📌 The **first and last point** of the line are joined automatically, forming a **closed geometry** (a polygon).

> 💡 The line should be **closed** or nearly so; otherwise the result may be unexpected.

---

## 🟠 Polygon → line

**Polygons to Lines** — converting a polygon layer to lines

📎 Official documentation: [Polygons to Lines](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/vectorgeometry.html#polygons-to-lines)

```python
fn     = r'C:\Users\Public\Documents\GIS\shapefile\polygon_layer.shp'
output = r'C:\Users\Public\Documents\GIS\shapefile\line_from_polygon.shp'

processing.run("native:polygonstolines", {
    'INPUT' : fn,
    'OUTPUT': output
})

layer = iface.addVectorLayer(output, 'Polygon to Line', 'ogr')
```

📌 The polygon's **outline** becomes a line — useful for buffers, edge analysis and visualization.

---

## 🟣 Line → points (Points along geometry)

**Points along Geometry** — placing points along a line at equal distances

📎 Official documentation: [Points along Geometry](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/vectorgeometry.html#points-along-geometry)

```python
fn     = r'C:\Users\Public\Documents\GIS\shapefile\line_layer.shp'
output = r'C:\Users\Public\Documents\GIS\shapefile\points_on_line.shp'

processing.run("native:pointsalonglines", {
    'INPUT'       : fn,
    'DISTANCE'    : 5,    # ← distance between points (in CRS units)
    'START_OFFSET': 0,    # ← skip from the start of the line
    'END_OFFSET'  : 0,    # ← skip from the end of the line
    'OUTPUT'      : output
})

layer = iface.addVectorLayer(output, 'Points along Line', 'ogr')
```

📌 `DISTANCE` is **in CRS units**: if the layer is in metric coordinates (e.g. EPSG:32638), `5` means **5 meters**.

> 💡 In geographic coordinates (EPSG:4326) `DISTANCE` is **in degrees** — in that case change the projection to a metric one (`EPSG:32638`) for a correct result.

---

## 🗂️ Keeping results temporarily (memory layer)

Use `'TEMPORARY_OUTPUT'` or `'memory:'` for `OUTPUT` if you don't want a file:

```python
result = processing.run("native:polygonstolines", {
    'INPUT' : fn,
    'OUTPUT': 'TEMPORARY_OUTPUT'   # ← in memory only
})

# the temporary layer
temp_layer = result['OUTPUT']
QgsProject.instance().addMapLayer(temp_layer)
```

> 💡 `'TEMPORARY_OUTPUT'` is **deleted automatically** when the session ends. If you need to keep a file, use a full path.

---

## ⚡ Error handling

```python
import processing
from qgis.core import QgsVectorLayer

fn     = r'C:\Users\Public\Documents\GIS\shapefile\points.shp'
output = r'C:\Users\Public\Documents\GIS\shapefile\points_to_line.shp'

try:
    result = processing.run("native:pointstopath", {
        'INPUT'            : fn,
        'CLOSE_PATH'       : True,
        'ORDER_EXPRESSION' : '"ID"',
        'NATURAL_SORT'     : False,
        'GROUP_EXPRESSION' : '',
        'OUTPUT'           : output
    })

    layer = iface.addVectorLayer(output, 'Points to Line', 'ogr')

    if not layer or not layer.isValid():
        print("❌ The layer did not load")
    else:
        print(f"✅ Layer loaded — {layer.featureCount()} features")

except Exception as e:
    print(f"❌ Processing error: {e}")
```

---

## 📌 Summary

In this topic we covered:

| Conversion | Processing ID | Result |
|------------|--------------|--------|
| 🟢 Point → line | `native:pointstopath` | Points are joined in sequence |
| 🔵 Line → polygon | `qgis:linestopolygons` | The line closes and forms an area |
| 🟠 Polygon → line | `native:polygonstolines` | The outline becomes a line |
| 🟣 Line → points | `native:pointsalonglines` | Evenly spaced points on the line |

👉 Every conversion uses `processing.run()` — the power of the QGIS Processing Toolbox directly from code.

## 🟢 Converting a point layer to a line (Point to Line Conversion)


```py title="Points_to_line.py" linenums="1"
fn = r'C:\Users\Public\Documents\GIS\shapefile\points.shp'
output = r'C:\Users\Public\Documents\GIS\shapefile\points_to_line.shp'

processing.run("native:pointstopath", {
    'INPUT': fn,
    'CLOSE_PATH': True,
    'ORDER_EXPRESSION': '"ID"',
    'NATURAL_SORT': False,
    'GROUP_EXPRESSION': '',
    'OUTPUT': output
})

layer = iface.addVectorLayer(output, '', 'ogr')
```

📌 The result is a line that follows the order of the points.

---


## 🟢 Converting a line layer to a polygon (Line to Polygon)

```py title="Line_to_polygon.py" linenums="1"
fn = r'C:\Users\Public\Documents\GK\PyQGIS\shp\line_layer.shp'
output = r'C:\Users\Public\Documents\GK\PyQGIS\shp\Polygon_layer_from_line.shp'

processing.run("qgis:linestopolygons", {'INPUT':fn, 'OUTPUT':output})
layer = iface.addVectorLayer(output, '', 'ogr')
```

📌 The lines are joined and a polygon geometry is formed.

---

## 🟢 Converting a polygon layer to lines (Polygon to Lines Conversion)

```py title="Polygon_to_Line_Conversion.py" linenums="1"
fn = r'C:\Users\Public\Documents\GK\PyQGIS\shp\Polygon_layer.shp'
output = r'C:\Users\Public\Documents\GK\PyQGIS\shp\Line_layer_from_polygon.shp'

processing.run("native:polygonstolines", {'INPUT':fn,'OUTPUT':output})
layer = iface.addVectorLayer(output, '', 'ogr')
```

📌 The elements of the polygon layer become lines, following their outline/shape.

---

## 🟢 Getting points from a line layer (Points along geometry)

```py title="Points_along_geometry.py" linenums="1"
fn = r'C:\Users\Public\Documents\GK\PyQGIS\shp\Line_layer.shp'
output = r'C:\Users\Public\Documents\GK\PyQGIS\shp\Points_placed_on_line.shp'

processing.run("native:pointsalonglines", {'INPUT':fn,'DISTANCE':5,'START_OFFSET':0,'END_OFFSET':0,'OUTPUT':output})
layer = iface.addVectorLayer(output, '', 'ogr')
```

📌 Places points at a given spacing on every element of a line layer.

---



# 📚 Summary

In this topic we went through:  
- creating new layers with PyQGIS  
- point → line → polygon conversions  
- saving temporary and permanent results  
- finding and fixing errors
