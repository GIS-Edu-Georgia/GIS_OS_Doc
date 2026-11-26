# QGIS Python Interface (iface)

## What is `iface`?
`iface` is a **QgisInterface** object that gives the Python console and QGIS plugins access to the QGIS graphical user interface (GUI).  
With it you can:
- add/remove layers
- control the map view
- show messages to the user
- interact with the project window

---

## iface.addVectorLayer()

### Description
`iface.addVectorLayer()` is used to **add a vector layer to the QGIS interface**.  

### Syntax
```python
iface.addVectorLayer(path, layer_name, provider)
```

### Parameters
- **path** *(str)* – file path or data source URI  
- **layer_name** *(str)* – the name in the Layers Panel  
- **provider** *(str)* – data provider (e.g. `"ogr"`, `"postgres"`, `"spatialite"`, `"memory"`)

### Return value
Returns a **QgsVectorLayer** object (or `None` if the layer failed to load).

### Examples
```python
# Shapefile
iface.addVectorLayer("C:/data/roads.shp", "Roads", "ogr")

# GeoJSON
iface.addVectorLayer("C:/data/buildings.geojson", "Buildings", "ogr")

# PostGIS
uri = "dbname='gisdb' host=localhost port=5432 user='postgres' password='1234' table=\"public\".\"roads\" (geom)"
iface.addVectorLayer(uri, "Roads from PostGIS", "postgres")
```

---

## Alternative: QgsVectorLayer + QgsProject

```python
layer = QgsVectorLayer("C:/data/roads.shp", "Roads", "ogr")
if layer.isValid():
    QgsProject.instance().addMapLayer(layer)
```

---

## Other frequently used iface methods

### 1. Controlling the map view
- **`iface.mapCanvas()`** – returns the map canvas object  
- **`iface.zoomIn()`** – zoom in  
- **`iface.zoomOut()`** – zoom out  
- **`iface.zoomFull()`** – zoom to the full extent  
- **`iface.zoomToActiveLayer()`** – zoom to the active layer  

### 2. Working with layers
- **`iface.activeLayer()`** – returns the currently active layer  
- **`iface.addRasterLayer(path, name)`** – add a raster layer  
- **`iface.legendInterface()`** *(QGIS 2.x)* – layer control (QGIS 3 uses `QgsLayerTree`)  

### 3. Messages and dialogs
- **`iface.messageBar().pushMessage("Title", "Text")`** – show a message in the Message Bar  
- **`iface.messageBar().pushWarning("Warning", "Something went wrong")`**  
- **`iface.messageBar().pushSuccess("Success", "Operation completed")`**  

### 4. GUI windows and panels
- **`iface.mainWindow()`** – returns the QGIS main window (a QMainWindow object)  
- **`iface.layerTreeView()`** – returns the layer tree view  
- **`iface.newProject()`** – creates a new empty project  

### 5. Cursor position
- **`iface.mapCanvas().mouseLastXY()`** – the last cursor coordinates on the canvas  
- **`iface.mapCanvas().extent()`** – the current extent  

---

## Where `iface` is used
- **QGIS Python Console** – for running scripts directly  
- **QGIS Plugins** – for reacting to the GUI and managing layers  
- **Teaching examples** – when introducing students to the QGIS API  

---

## ✍️ Summary
- `iface` = **QgisInterface**, which connects Python with the QGIS interface.  
- `iface.addVectorLayer()` adds a vector layer to the GUI.  
- `iface` also covers map control, showing messages, layer control and access to the project window.  
