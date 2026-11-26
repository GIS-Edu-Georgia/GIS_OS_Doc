# QgsProject

`QgsProject` is one of the most important PyQGIS classes. It is used to manage QGIS project files (`.qgz` or `.qgs`).  
With this class you can:

- open an existing project  
- create a new project  
- save the project  
- add/remove layers in the project  
- manage project properties (CRS, paths, entries)

---

## 📌 Main methods and attributes

### 1. `QgsProject.instance()`
QGIS has only one active project. You access it with the `instance()` method.

```python
project = QgsProject.instance()
```

---

### 2. `setFileName(path)`
Sets the path of the project file.

```python
project.setFileName("C:/Users/Public/Documents/GIS/my_project.qgz")
```

---

### 3. `read(path)` – opening a project
Loads an existing `.qgz` or `.qgs` file.

```python
project.read("C:/Users/Public/Documents/GIS/existing_project.qgz")
```

---

### 4. `write()`
Saves the project to the file set with `setFileName()`.

```python
project.write()
```

or under a new name:

```python
project.write("C:/Users/Public/Documents/GIS/new_project.qgz")
```

---

### 5. Adding layers to the project
You can add both vector and raster layers.

```python
from qgis.core import QgsVectorLayer, QgsRasterLayer

# add a vector layer
vlayer = QgsVectorLayer("C:/Users/Public/Documents/GIS/roads.shp", "Roads", "ogr")
project.addMapLayer(vlayer)

# add a raster layer
rlayer = QgsRasterLayer("C:/Users/Public/Documents/GIS/dem.tif", "DEM")
project.addMapLayer(rlayer)
```

---

### 6. `removeMapLayer(layer)`
Removes a layer from the project.

```python
project.removeMapLayer(vlayer.id())
```

---

### 7. `mapLayers()`
Returns a dictionary of all layers in the project (`layer_id: layer_object`).

```python
layers = project.mapLayers()
for layer_id, layer in layers.items():
    print(layer.name(), layer.type())
```

---

### 8. The project's CRS (Coordinate Reference System)
Sets the project's main CRS.

```python
from qgis.core import QgsCoordinateReferenceSystem

crs = QgsCoordinateReferenceSystem("EPSG:4326")  # WGS84
project.setCrs(crs)
```

---

## 📌 Full example

```python
from qgis.core import QgsProject, QgsVectorLayer, QgsRasterLayer, QgsCoordinateReferenceSystem

# get the project instance
project = QgsProject.instance()

# set the file name
project.setFileName("C:/Users/Public/Documents/GIS/my_project.qgz")

# add a vector layer
roads = QgsVectorLayer("C:/Users/Public/Documents/GIS/roads.shp", "Roads", "ogr")
project.addMapLayer(roads)

# add a raster layer
dem = QgsRasterLayer("C:/Users/Public/Documents/GIS/dem.tif", "DEM")
project.addMapLayer(dem)

# set the CRS
crs = QgsCoordinateReferenceSystem("EPSG:32638")  # UTM Zone 38N
project.setCrs(crs)

# save the project
project.write()
```

---

## 📖 Conclusion
`QgsProject` lets us manage a whole QGIS project in code.  
For students this is one of the basic topics, because practically every PyQGIS script works with the project's layers.
