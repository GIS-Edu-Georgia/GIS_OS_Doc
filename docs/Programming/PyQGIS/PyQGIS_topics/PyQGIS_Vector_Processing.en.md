# 🧭 Data processing

---

## ⚙️ Selection operators

| Code | Operator | Description |
|------|------------|---------|
| 0 | `=` | equals |
| 1 | `≠` | does not equal |
| 2 | `>` | greater than |
| 3 | `>=` | greater than or equal |
| 4 | `<` | less than |
| 5 | `<=` | less than or equal |
| 6 | begins with | begins with |
| 7 | contains | contains |
| 8 | is null | is empty |
| 9 | is not null | is not empty |
| 10 | does not contain | does not contain |

---

## 🖱️ Interactive selection methods

| Code | Method | Description |
|------|---------|---------|
| 0 | creating new selection | create a new selection |
| 1 | adding to current selection | add to the current selection |
| 2 | removing from current selection | remove from the current selection |
| 3 | selecting within current selection | select within the current selection |

---

## 📊 Extracting data from a layer

**Rounding, filtering and creating a new layer**

```python
layers = QgsProject.instance().mapLayersByName('rivers')
layer = layers[0]
feats = layer.getFeatures()

L = []
for i in feats:
   L.append(round(i["Shape_Leng"]))

L.sort(reverse=True)
print(L[5])

processing.run("qgis:selectbyattribute", {
   'INPUT': layer,
   'FIELD': 'Shape_Leng',
   'OPERATOR': 2,
   'VALUE': L[5],
   'METHOD': 0
})

fn = r'C:\Users\Public\Documents\GK\PyQGIS\shp\tema_6\river_select.shp'

writer = QgsVectorFileWriter.writeAsVectorFormat(
   layer, fn, 'utf-8', driverName='ESRI Shapefile', onlySelected=True
)

layer1 = iface.addVectorLayer(fn, '', 'ogr')
del(writer)
```

---

## 🌀 Buffer

```python
layers = QgsProject.instance().mapLayersByName('river_select')
layer = layers[0]
fields = layer.fields()
feats = layer.getFeatures()

dist = 100
fn = r'C:\Users\Public\Documents\GK\PyQGIS\shp\tema_6\river_select_buffer.shp'

writer = QgsVectorFileWriter(fn, 'UTF-8', fields, QgsWkbTypes.Polygon,
   layer.sourceCrs(), 'ESRI Shapefile')

for i in feats:
   geo = i.geometry()
   buf = geo.buffer(dist, 50)
   i.setGeometry(buf)
   writer.addFeature(i)

del writer
iface.addVectorLayer(fn, '', 'ogr')

```

---

## 💧 Buffer 2 (Processing buffer)

```python
layers = QgsProject.instance().mapLayersByName('river_select')
layer = layers[0]

fn = r'C:\Users\Public\Documents\GK\PyQGIS\shp\tema_6\riverb1.shp'

processing.run('native:buffer', {
   'INPUT': layer,
   'DISTANCE': 150,
   'OUTPUT': fn
})
iface.addVectorLayer(fn, '', 'ogr')
```

---

## 🔗 Dissolve

```python
layers = QgsProject.instance().mapLayersByName('Municipality')
layer = layers[0]

fn = r'C:\Users\Public\Documents\GK\PyQGIS\shp\tema_6\mun_dissolve.shp'

processing.run("native:dissolve", {
   'INPUT': layer,
   'FIELD': [],
   'SEPARATE_DISJOINT': False,
   'OUTPUT': fn
})

iface.addVectorLayer(fn, '', 'ogr')
```

---

## 🧩 Buffer + Dissolve

```python
layers = QgsProject.instance().mapLayersByName('Municipality')
layer = layers[0]

fn = r'C:\Users\Public\Documents\GK\PyQGIS\shp\tema_6\mun_dissolve1.shp'

processing.run('native:buffer', {
   'INPUT': layer,
   'FIELD': ['Region'],
   'DISTANCE': 500,
   'DISSOLVE': True,
   'OUTPUT': fn
})
iface.addVectorLayer(fn, '', 'ogr')
```

---

## ✂️ Clipping vector data with another vector (Clip by Vector)

```python
layers = QgsProject.instance().mapLayersByName('Municipality')
over = QgsProject.instance().mapLayersByName('imereti')
layer = layers[0]
ov = over[0]

fn = r'C:\Users\Public\Documents\GK\PyQGIS\shp\tema_7\test.shp'

processing.run('native:clip', {
   'INPUT': layer,
   'OVERLAY': ov,
   'OUTPUT': fn
})
iface.addVectorLayer(fn, '', 'ogr')
```

---

## 📐 Clip by Extent

```python
layers = QgsProject.instance().mapLayersByName('Municipality')
over = QgsProject.instance().mapLayersByName('imereti')
layer = layers[0]
ov = over[0]

fn = r'C:\Users\Public\Documents\GK\PyQGIS\shp\tema_7\test.shp'

processing.run("native:extractbyextent", {
    'INPUT': layer,
    'EXTENT': ov,
    'CLIP': False,
    'OUTPUT': fn
})
iface.addVectorLayer(fn, '', 'ogr')
```

---

## 📍 Extract by Location

```python

layers = QgsProject.instance().mapLayersByName('settlement')
intersct = QgsProject.instance().mapLayersByName('imereti')
layer = layers[0]
intsct = intersct[0]

fn = r'C:\Users\Public\Documents\GK\PyQGIS\shp\tema_7\settlement_imereti.shp'

processing.run("native:extractbylocation", {
    'INPUT': layer,
    'PREDICATE': [0],
    'INTERSECT': intsct,
    'OUTPUT': fn
})
iface.addVectorLayer(fn, '', 'ogr')

```

---

## 📍 Extract by Location (on selected municipalities)

```python
layers = QgsProject.instance().mapLayersByName('settlement')
layer = layers[0]

intersct = r'C:\Users\Public\Documents\GK\PyQGIS\shp\tema_7\Municipality.shp'
fn = r'C:\Users\Public\Documents\GK\PyQGIS\shp\tema_7\test.shp'

processing.run("native:extractbylocation", {
    'INPUT': layer,
    'PREDICATE': [0],
    'INTERSECT': QgsProcessingFeatureSourceDefinition(
        intersct,
        selectedFeaturesOnly=True,
        featureLimit=-1,
        geometryCheck=QgsFeatureRequest.GeometryAbortOnInvalid
    ),
    'OUTPUT': fn
})
iface.addVectorLayer(fn, '', 'ogr')
```

---

## 🔀 Merging different vector layers (Merge Vector Layers)

```python
layers_aW = QgsProject.instance().mapLayersByName('chiatura')
layers_af = QgsProject.instance().mapLayersByName('sachxere')
layer_aW = layers_aW[0]
layer_af = layers_af[0]

fn = r'C:\Users\Public\Documents\GK\PyQGIS\shp\tema_7\chiatura_sachxere.shp'

processing.run('native:mergevectorlayers', {
   'LAYERS': [layer_aW, layer_af],
   'CRS': QgsCoordinateReferenceSystem('EPSG:32637'),
   'OUTPUT': fn
})

iface.addVectorLayer(fn, '', 'ogr')
```

----

## 🧭 **Selecting Neighbors — selecting neighbouring features with an action button**

👉 This script selects the features that spatially touch a given feature (its neighbours).

```python
layer_id = '[%@layer_id%]'
fid = [% $id %]

layer = QgsProject.instance().mapLayer(layer_id)

def get_neighbors(fid):
    f = layer.getFeature(fid)
    neighbors = [
        c.id()
        for c in layer.getFeatures(f.geometry().boundingBox())
        if c.geometry().intersects(f.geometry()) and c.id() != f.id()
    ]
    return neighbors

first_degree_neighbors = get_neighbors(fid)
second_degree_neighbors = set()

for n in first_degree_neighbors:
    neighbors = get_neighbors(n)
    second_degree_neighbors.update(neighbors)

second_degree_neighbors = second_degree_neighbors.difference(set(first_degree_neighbors))
second_degree_neighbors.discard(fid)

layer.selectByIds(list(second_degree_neighbors))
```
