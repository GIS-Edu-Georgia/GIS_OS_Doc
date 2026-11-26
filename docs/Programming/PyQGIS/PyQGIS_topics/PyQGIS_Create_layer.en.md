# Creating a layer (ESRI Shapefile)
<br>
Official documentation <br>
Class: [QgsWkbTypes](https://qgis.org/pyqgis/3.44/core/QgsWkbTypes.html) <br>
GDAL [OGR](https://www.osgeo.org/projects/gdal/) <br>
To choose a coordinate system: Coordinate Systems [Worldwide](https://epsg.io/)

For details on QgsField, QgsFields(), QVariant, QgsFeature(), iface, etc. <br>
see the Explanations section < < <

### Point layer

**Some definitions**

- The geometry is specified here because the writer needs to take it into account; instead of QgsWkbTypes.Point you can use Line, Polygon, Unknown, Null.

## ✅ The main geometry types in PyQGIS:

| Type           | Layer type (as a string) | Example in code |
|----------------|--------------------------|----------------|
| Point          | `"Point"`                | `QgsGeometry.fromPointXY(QgsPointXY(x, y))` |
| MultiPoint     | `"MultiPoint"`           | `QgsGeometry.fromMultiPointXY([QgsPointXY(x1, y1), QgsPointXY(x2, y2)])` |
| Line           | `"LineString"`           | `QgsGeometry.fromPolylineXY([QgsPointXY(x1, y1), QgsPointXY(x2, y2)])` |
| MultiLine      | `"MultiLineString"`      | `QgsGeometry.fromMultiPolylineXY([[QgsPointXY(x1, y1), QgsPointXY(x2, y2)], [QgsPointXY(x3, y3), QgsPointXY(x4, y4)]])` |
| Polygon        | `"Polygon"`              | `QgsGeometry.fromPolygonXY([[QgsPointXY(x1, y1), QgsPointXY(x2, y2), QgsPointXY(x3, y3), QgsPointXY(x1, y1)]])` |
| MultiPolygon   | `"MultiPolygon"`         | `QgsGeometry.fromMultiPolygonXY([[[QgsPointXY(x1, y1), QgsPointXY(x2, y2), QgsPointXY(x3, y3), QgsPointXY(x1, y1)]]])` |

- shapefile_home is a variable and goes through the script under a meaningful name
- QgsFields() creates the columns of the attribute table
- File Handling - "r" - Read - Default value. Opens a file for reading, error if the file does not exist 
- the writer collects the information, the encoding, the columns, the geometry and the coordinate system, and combines them into a container.
- the new layer is created and saved with the 'ESRI Shapefile' driver.
- the encoding, projection, driver, etc. must be passed as arguments
- the function returns an object, defined as writer in the code, that can add and write new features to the layer.



Test the code directly in the QGIS Python console, which you can open with the shortcut

<br>
++left-control+left-alt+"P"++
<br>


```py title="new_shapefile_point.py" linenums="1"

shapefile_home = r'C:\Users\Public\Documents\GIS\shapefile\saxli.shp'

layerfield = QgsFields() 

layerfield.append(QgsField('ID', QVariant.Int)) # column 1

layerfield.append(QgsField('Field_1', QVariant.String)) # column 2

layerfield.append(QgsField('Field_2', QVariant.Double, len=10, prec=2)) # column 3

writer = QgsVectorFileWriter(shapefile_home, 'UTF-8', layerfield, QgsWkbTypes.Point, \

               QgsCoordinateReferenceSystem('EPSG:32638'), 'ESRI Shapefile')


del(writer)

```

This shortcut helps you comment code out or back in
<br>
++left-control+left-shift+":"++
<br>

<p>We can also write data to the layer right here</p>
```py title="new_shapefile_point_with_data.py" linenums="1"

# this part of the code goes in after the writer is created

fc = QgsFeature() # creates a spatial feature

# creates the geometry at a predefined coordinate
fc.setGeometry(QgsGeometry.fromPointXY(QgsPointXY(357965.61, 4683353.56))) 

# puts information into the attribute table, following
# the columns we defined when creating the layer
fc.setAttributes([1, 'text', 25])  # (ID, 'text for this cell', number)

writer.addFeature(fc) # add the feature to the layer
```

!!! warning "Where `del(writer)` goes"
    The code that adds features must come **after** the `writer` is created and before `del(writer)`. `del(writer)` closes the file and writes the data to disk, so `writer.addFeature(fc)` no longer works after it.

The full sequence in one script:

```py title="new_shapefile_point_full.py" linenums="1"
shapefile_home = r'C:\Users\Public\Documents\GIS\shapefile\saxli.shp'

layerfield = QgsFields()
layerfield.append(QgsField('ID', QVariant.Int))
layerfield.append(QgsField('Field_1', QVariant.String))
layerfield.append(QgsField('Field_2', QVariant.Double, len=10, prec=2))

# 1. the writer is created
writer = QgsVectorFileWriter(shapefile_home, 'UTF-8', layerfield, QgsWkbTypes.Point, \
               QgsCoordinateReferenceSystem('EPSG:32638'), 'ESRI Shapefile')

# 2. a feature is added to the writer
fc = QgsFeature()
fc.setGeometry(QgsGeometry.fromPointXY(QgsPointXY(357965.61, 4683353.56)))
fc.setAttributes([1, 'text', 25])
writer.addFeature(fc)

# 3. finally the writer is closed
del(writer)

# 4. the layer is added to the QGIS project
layer = iface.addVectorLayer(shapefile_home, '', 'ogr')
```

## Adding the layer to the QGIS project

```py title="shapefile_point.py" linenums="1"
# shapefile_home: the file name - '': the layer name - ogr: vector file

# iface.addVectorLayer decides which layer is added to the QGIS Layers panel.
layer = iface.addVectorLayer(shapefile_home, '', 'ogr')
```

Creating a new point vector layer from coordinate pairs and adding it to the QGIS project.

```py title="create_shapefile_with_tuples.py" linenums="1"
fn = r'C:\Users\Public\Documents\GIS\shapefile\new_shapefile_point_tuples.shp'



layerfield = QgsFields()

layerfield.append(QgsField('ID', QVariant.Int))

layerfield.append(QgsField('Category', QVariant.String))



writer = QgsVectorFileWriter(fn, 'UTF-8', layerfield, QgsWkbTypes.Point, \

              QgsCoordinateReferenceSystem('EPSG:32638'), 'ESRI Shapefile')



XY = [(356671.0049, 4679923.0988),

(356672.2015, 4679929.5719),

(356672.9728, 4679933.1198),

(356674.5925, 4679935.2022),

(356676.0579, 4679936.8219),

(356676.9835, 4679938.1332),

(356645.632, 4679901.1075),

(356654.4244, 4679905.3495),

(356659.9775, 4679909.2829),

(356664.2194, 4679912.7536),

(356668.055, 4679916.8107)]  


for i in XY:

    fc = QgsFeature()

    fc.setGeometry(QgsGeometry.fromPointXY(QgsPointXY(i[0], i[1])))

    fc.setAttributes([XY.index(i), 'lake'])

    writer.addFeature(fc)



del(writer)



layer = iface.addVectorLayer(fn, '', 'ogr')

```


!!! info "`XY.index(i)` or `enumerate`?"
    In the loop above, `XY.index(i)` gives us the ID. It searches the list for the element and returns its position. This works, but if the list contains two identical points, both get the same ID, and it also searches the list from the start every time.
    A simple alternative is `enumerate`, which gives us the number and the element itself:

    ```py
    for n, (x, y) in enumerate(XY, start=1):
        fc = QgsFeature()
        fc.setGeometry(QgsGeometry.fromPointXY(QgsPointXY(x, y)))
        fc.setAttributes([n, 'lake'])   # n = 1, 2, 3 ...
        writer.addFeature(fc)
    ```

    `start=1` means counting starts at 1 (by default it starts at 0).


## Creating a layer with a function (improved version)

The scripts above make us rewrite the geometry, the fields and the path by hand every time. The function below:

- works with **any geometry** (`Point`, `LineString`, `Polygon`, `Multi...`)
- works with **both Shapefile and GeoPackage** (it picks the driver from the extension)
- checks whether the file and folder exist, and gives a clear message on error
- takes the fields from a simple list and **adds all features at once**
- finally adds the layer to the project

```py title="create_layer_function.py" linenums="1"
import os
from qgis.core import (
    QgsVectorFileWriter, QgsFields, QgsField, QgsFeature, QgsGeometry,
    QgsPointXY, QgsCoordinateReferenceSystem, QgsProject, QgsVectorLayer, QgsWkbTypes
)
from qgis.PyQt.QtCore import QVariant

# field types as strings, so we don't need QVariant every time
FIELD_TYPES = {
    'int': QVariant.Int,
    'str': QVariant.String,
    'float': QVariant.Double,
    'date': QVariant.Date,
}

# extension -> OGR driver
DRIVERS = {'.shp': 'ESRI Shapefile', '.gpkg': 'GPKG', '.geojson': 'GeoJSON'}


def create_layer(path, geom_type, epsg, fields, features=None,
                 overwrite=False, add_to_project=True):
    """
    path        - full file path (.shp / .gpkg / .geojson)
    geom_type   - QgsWkbTypes.Point, QgsWkbTypes.LineString, QgsWkbTypes.Polygon ...
    epsg        - e.g. 32638
    fields      - [('ID', 'int'), ('Name', 'str'), ('Area', 'float')]
    features    - [(geometry, [attributes]), ...]  (optional)
    overwrite   - whether to overwrite the file if it already exists
    """
    folder, ext = os.path.dirname(path), os.path.splitext(path)[1].lower()

    if ext not in DRIVERS:
        raise ValueError(f'Unsupported format: {ext}')
    if not os.path.isdir(folder):
        os.makedirs(folder)          # create the folder if it does not exist
    if os.path.exists(path) and not overwrite:
        raise FileExistsError(f'The file already exists: {path}')

    crs = QgsCoordinateReferenceSystem(f'EPSG:{epsg}')
    if not crs.isValid():
        raise ValueError(f'Invalid EPSG code: {epsg}')

    qfields = QgsFields()
    for name, ftype in fields:
        qfields.append(QgsField(name, FIELD_TYPES[ftype]))

    options = QgsVectorFileWriter.SaveVectorOptions()
    options.driverName = DRIVERS[ext]
    options.fileEncoding = 'UTF-8'
    options.actionOnExistingFile = QgsVectorFileWriter.CreateOrOverwriteFile

    writer = QgsVectorFileWriter.create(
        path, qfields, geom_type, crs,
        QgsProject.instance().transformContext(), options
    )
    if writer.hasError() != QgsVectorFileWriter.NoError:
        raise RuntimeError(writer.errorMessage())

    for geom, attrs in (features or []):
        fc = QgsFeature(qfields)
        fc.setGeometry(geom)
        fc.setAttributes(attrs)
        writer.addFeature(fc)

    del writer   # the file is closed and the data is written to disk

    layer = QgsVectorLayer(path, os.path.splitext(os.path.basename(path))[0], 'ogr')
    if add_to_project and layer.isValid():
        QgsProject.instance().addMapLayer(layer)
    return layer
```

### Usage examples

**A point layer with data**

```py title="example_points.py" linenums="1"
pts = [(356671.0049, 4679923.0988), (356672.2015, 4679929.5719)]

features = [
    (QgsGeometry.fromPointXY(QgsPointXY(x, y)), [i, 'lake'])
    for i, (x, y) in enumerate(pts, start=1)
]

layer = create_layer(
    r'C:\Users\Public\Documents\GIS\shapefile\lakes.shp',
    QgsWkbTypes.Point, 32638,
    fields=[('ID', 'int'), ('Category', 'str')],
    features=features,
    overwrite=True
)
```

**An empty polygon layer in a GeoPackage (we will draw the data by hand later)**

```py title="example_polygon_gpkg.py" linenums="1"
layer = create_layer(
    r'C:\Users\Public\Documents\GIS\parcels.gpkg',
    QgsWkbTypes.Polygon, 32638,
    fields=[('ID', 'int'), ('Owner', 'str'), ('Area_m2', 'float')],
    overwrite=True
)
```

!!! tip "Why GeoPackage?"
    Shapefile has limits: a field name is at most 10 characters, text up to 254 characters, and one layer is made of 3–7 files. `.gpkg` has none of these problems, so it is the better choice for new projects.

!!! note "About QVariant"
    Since QGIS 3.38, `QVariant.Int` and similar types have been replaced by `QMetaType.Type.Int`. The old form still works, but it may show a warning.

## Creating a point layer from a CSV file

Coordinates are often in a table (e.g. points collected with GPS). The script below reads a CSV and uses the `create_layer()` function described above to create the layer.

An example CSV file (`points.csv`, the first line is the header):

```text
ID,Name,X,Y
1,Lake 1,356671.0049,4679923.0988
2,Lake 2,356672.2015,4679929.5719
3,Spring,356676.9835,4679938.1332
```

```py title="create_layer_from_csv.py" linenums="1"
import csv

csv_path = r'C:\Users\Public\Documents\GIS\points.csv'
out_path = r'C:\Users\Public\Documents\GIS\shapefile\points.gpkg'

features = []

# utf-8-sig also opens UTF-8 files saved by Excel (with a BOM)
with open(csv_path, newline='', encoding='utf-8-sig') as f:
    for n, row in enumerate(csv.DictReader(f), start=2):  # line 1 is the header
        try:
            x = float(row['X'].replace(',', '.'))
            y = float(row['Y'].replace(',', '.'))
            attrs = [int(row['ID']), row['Name']]
        except (KeyError, ValueError) as e:
            print(f'Line {n} skipped: {e}')   # a bad line does not stop us
            continue

        features.append((QgsGeometry.fromPointXY(QgsPointXY(x, y)), attrs))

layer = create_layer(
    out_path,
    QgsWkbTypes.Point, 32638,
    fields=[('ID', 'int'), ('Name', 'str')],
    features=features,
    overwrite=True
)

print(f'Added {len(features)} features')
```

!!! note "Things to watch out for"
    - The coordinate column names (`X`, `Y`) and the EPSG code (`32638`) must match your data. For geographic coordinates (longitude/latitude) use `4326`.
    - If the CSV is separated by semicolons (`;`), add `delimiter=';'` to `DictReader`.
    - The `create_layer()` function must already have been run in the same console.

!!! tip "A quick alternative"
    If we don't need to save the layer to a file, QGIS can open the CSV directly as points:
    ```py
    uri = 'file:///C:/Users/Public/Documents/GIS/points.csv?delimiter=,&xField=X&yField=Y&crs=EPSG:32638'
    layer = QgsVectorLayer(uri, 'points', 'delimitedtext')
    QgsProject.instance().addMapLayer(layer)
    ```

## Adding fields to an existing layer

For adding new columns to an existing layer and calculating them, see the page
[attribute table calculations](PyQGIS_Calc_Attrib_Expressions.md).

## ℹ️ Explanations – PyQGIS components

This section gives short explanations of frequently used objects and classes that you need when writing PyQGIS scripts.

> ❗ *These components often come up when creating layers or working with attributes or geometry.*

---

### 🔹 `QgsField`

Used to define a layer field (an attribute column). It holds the field's name and type.

**Example**:

```python
QgsField("name", QVariant.String)
# creates a text field named "name"
```

---

### 🔹 `QgsFields`

Represents a collection of fields (i.e. several `QgsField`s together). It is needed when you have to pass all fields at once, for example when creating a layer.

**Example**:

```python
fields = QgsFields()
fields.append(QgsField("name", QVariant.String))
```

---

### 🔹 `QVariant`

A Qt data type class that QGIS uses to define the types of attribute values (e.g. `String`, `Int`, `Double`, etc.).

**Examples**:

* `QVariant.String` – a text field
* `QVariant.Int` – an integer
* `QVariant.Double` – a decimal number

---

### 🔹 `QgsFeature`

Represents one object (a point, line or polygon) with its geometry and attributes.

**Example**:

```python
feature = QgsFeature()
feature.setGeometry(QgsGeometry.fromPointXY(QgsPointXY(44.8, 41.7)))
feature.setAttributes(["Tbilisi"])
```

---

### 🔹 `iface`

`iface` (Interface) is the main QGIS object used to interact with the QGIS interface (Layers Panel, Map Canvas, etc.).

**Example**:

```python
iface.addVectorLayer("/path/to/file.shp", "My Layer", "ogr")
# adds the layer directly to the QGIS project
```

⚠️ `iface` is only available in the QGIS **Python Console**. It does not work in a standard Python script.

---

### 🔹 Other useful classes

| Class                          | Description                                                    |
| ------------------------------ | -------------------------------------------------------------- |
| `QgsGeometry`                  | A geometry object (point, line, polygon, etc.)                 |
| `QgsPointXY`                   | A 2D point object – with x and y coordinates                   |
| `QgsVectorLayer`               | A vector layer object                                          |
| `QgsProject`                   | The QGIS project – lets you add and manage layers              |
| `QgsCoordinateReferenceSystem` | Defines a coordinate system by EPSG code                       |
