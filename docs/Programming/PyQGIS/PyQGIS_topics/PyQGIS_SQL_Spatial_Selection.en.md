# Selecting features in a QGIS layer with PyQGIS


## Definitions

- `iface` — for the QGIS GUI (QGIS Python Console / plugins).
- `QgsProject` — managing the current project (reading layers, etc.).
- `processing` — the set of QGIS tools; selections such as `qgis:selectbyattribute`, `native:selectbylocation` and others.

- The code on this page shows both reading a layer from a folder and selecting its features, and finding a layer that is already in the project, activating it and running an operation on it.

---



Selection operators are used in the `selectbyattribute` function. They define the logical comparison with the field value.

| Code | Operator | Description | Example in SQL |
|------|-----------|--------|------------------|
| 0    | =         | equals | `DISTR_ENG = 'Oni'` |
| 1    | ≠         | does not equal | `DISTR_ENG ≠ 'Poti'` |
| 2    | >         | greater than | `Area > 1000000` |
| 3    | >=        | greater than or equal | `Area >= 1000000` |
| 4    | <         | less than | `Area < 1000000` |
| 5    | <=        | less than or equal | `Area <= 1000000` |
| 6    | begins with | begins with... | `DISTR_ENG begins with 'O'` |
| 7    | contains  | contains | `DISTR_ENG contains 'ani'` |
| 8    | is null   | is empty | `DISTR_ENG is null` |
| 9    | is not null | is not empty | `DISTR_ENG is not null` |
| 10   | does not contain | does not contain | `DISTR_ENG does not contain 'ani'` |

---


## Interactive selection methods

Interactive selection methods define how a new selection affects the existing one.

| Code | Method | Description |
|------|--------|--------|
| 'METHOD':0    | creating new selection | creates a new selection (the previous selection is cleared) |
| 'METHOD':1    | adding to current selection | adds new features to the current selection |
| 'METHOD':2    | removing from current selection | removes features from the current selection |
| 'METHOD':3    | selecting within current selection | selects only within the current selection |

---


### Reading a layer

```py title="Read_layer" linenums="1"
# read a layer from a folder into the project
fn = r'C:\Users\Public\Documents\GIS\shp\Georgia_municipalities.shp'
layer = iface.addVectorLayer(fn, '', 'ogr')
#proccess

# read a layer that is already in the project
layers = QgsProject.instance().mapLayersByName('Georgia_municipalities')
layer = layers[0]
#proccess
```

### Selecting all features in a layer — *Select All*

```py title="select_all_features" linenums="1"

fn = r'C:\Users\Public\Documents\GIS\shp\Georgia_municipalities.shp'
layer = iface.addVectorLayer(fn, 'Georgia Municipalities', 'ogr')
if not layer:
    raise ValueError(f"Layer not loaded: {fn}")

# select all features
#layer.selectAll()
```

## Changing the colour of selected features <br>

```py title="change_selection_color" linenums="1"

iface.mapCanvas().setSelectionColor(QColor('red'))

```


## Selecting by attribute

```py title="select_object_with_selectbyattribute_tool" linenums="1"
# in SQL: DISTR_ENG = 'Oni'

fn = r'C:\Users\Public\Documents\GIS\shp\Georgia_municipalities.shp'

layer = iface.addVectorLayer(fn, '', 'ogr')

processing.run("qgis:selectbyattribute", {'INPUT':fn,'FIELD':'DISTR_ENG','OPERATOR':0,'VALUE':'Oni','METHOD':0})

```

## Select every municipality in the layer except Poti

```py title="select_object_with_selectbyattribute_tool" linenums="1"
# in SQL: DISTR_ENG ≠ 'Poti'

fn = r'C:\Users\Public\Documents\GIS\shp\Georgia_municipalities.shp'

layer = iface.addVectorLayer(fn, '', 'ogr')

# 'OPERATOR':1 decides the whole thing in the code

processing.run("qgis:selectbyattribute", {'INPUT':fn,'FIELD':'DISTR_ENG','OPERATOR':1,'VALUE':'Poti','METHOD':0})

```

## Selecting features by expression — Select By Expression

Text data

In SQL: `DISTR_ENG  =  'Gardabani'`

```py title="select_object_with_selectbyattribute_tool" linenums="1"

fn = r'C:\Users\Public\Documents\GIS\shp\Georgia_municipalities.shp'

layer = iface.addVectorLayer(fn, '', 'ogr')

layer.selectByExpression('"DISTR_ENG"  =  \'Gardabani\'')
```
!!!info
    Single quotes ('') are used for text values (strings), because that is how QGIS SQL defines them.
    \' is an escape sequence in Python: since the whole expression is enclosed in one pair of quotes ("" or ''), you have to use \' inside to start/end the inner quote, so that Python does not get confused and parses the string correctly. Without the escape, Python's parser would raise a syntax error.

---


## Numeric data

```py title="select_object_selectByExpression" linenums="1"
# in SQL: Area >= 1268097314
fn = r'C:\Users\Public\Documents\GIS\shp\Georgia_municipalities.shp'

layer = iface.addVectorLayer(fn, '', 'ogr')

layer.selectByExpression('"Area"  >=  1268097314')

```
## Selecting by expression in a layer that is already in the project
```py title="select_object_selectByExpression" linenums="1"
#
layers = QgsProject.instance().mapLayersByName('Georgia_municipalities')
layer = layers[0]

layer.selectByExpression('"Area"  <=  1268097314')
```


## Creating a separate new layer from the selected feature
```py title="selectByExpression_create_new_layer" linenums="1"

layers = QgsProject.instance().mapLayersByName('Georgia_municipalities')

layer = layers[0]

layer.selectByExpression('"Area"  =  1268097314')

# define the new layer and pass it to the writer to be written

fn2 = r'C:\Users\Public\Documents\GK\PyQGIS\shp\tema_3\Georgia_municipalities1.shp'

# create it from the selected feature only: the onlySelected = True parameter
writer = QgsVectorFileWriter.writeAsVectorFormat(layer, fn2, \
    'utf-8', driverName = 'ESRI Shapefile', onlySelected = True)

layer2 = iface.addVectorLayer(fn2, '', 'ogr')

del(writer)

```
