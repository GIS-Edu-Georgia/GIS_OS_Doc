# 📚 Using the OGR library in PyQGIS

This document introduces the **OGR library** (Open Geospatial Consortium Simple Features Reading/Writing) in the context of **PyQGIS**.  
OGR is part of **GDAL (Geospatial Data Abstraction Library)** and provides reading, manipulation and writing of vector GIS data in many formats.  

In PyQGIS, OGR is integrated through **QgsVectorLayer** and **QgsVectorFileWriter**, which makes automation possible in QGIS scripts.  
 
👉 **QGIS 3.28+** and the **Python Console** (Plugins > Python Console) are recommended.  

---

## 🔹 Introduction to OGR

### What is OGR?
- It supports **400+ vector formats** (Shapefile, GeoJSON, GeoPackage, KML and more).  
- In PyQGIS it is used to create and manage vector layers.  

### Main classes:
- **QgsVectorLayer** – represents a vector layer.  
- **QgsFeature** – a single element of the layer (geometry + attributes).  
- **QgsVectorFileWriter** – writes to a file using OGR drivers.  

---

## 🚀 Why use OGR in PyQGIS?

- **Automation** – loading, transforming and filtering data.  
- **Conversion** – converting from one format to another (e.g. Shapefile → GeoJSON).  

### Prerequisites:
```py
from qgis.core import *
```

---

## 🧩 Core OGR concepts

- **Geometry**: Point, LineString, Polygon.  
- **Attributes**: table fields (e.g. ID, name).  
- **CRS (Coordinate Reference System)**: EPSG codes (e.g. EPSG:4326 WGS84).  

---

## 📂 OGR drivers in PyQGIS

Drivers define the data format. The most common:

| Driver | Format       | Example file extension |
|----------|--------------|---------------------------|
| ESRI Shapefile | Shapefile    | `.shp` |
| GeoJSON        | GeoJSON      | `.geojson` |
| GPKG           | GeoPackage   | `.gpkg` |
| CSV            | CSV (WKT)    | `.csv` |
| KML            | KML          | `.kml` |

👉 You must set `driverName` when writing a file.

---

## 📥 Loading a vector layer (reading)

```py
from qgis.core import QgsVectorLayer, QgsProject

layer_path = "/path/to/your/data/airports.shp"
vlayer = QgsVectorLayer(layer_path, "Airports", "ogr")

if not vlayer.isValid():
    print("Error: the layer failed to load!")
else:
    QgsProject.instance().addMapLayer(vlayer)
    print("Layer loaded successfully.")
```

- **ogr** – specifies the OGR provider.  
- **isValid()** – checks that the layer is valid.  

---

## 🔎 Inspecting the layer (iteration)

```py
features = vlayer.getFeatures()

for feature in features:
    geom = feature.geometry()
    attrs = feature.attributes()
    print(f"ID: {feature.id()}")
    if geom.type() == 0:  # Point
        print(f"Coordinates: {geom.asPoint()}")
    print(f"Attributes: {attrs}")
    break
```

- **getFeatures()** – returns an iterator over the features.  
- **geometry().asPoint()** – coordinates of a Point.  

---

## 🎯 Filtering (spatial and attribute)

```py
from qgis.core import QgsRectangle, QgsFeatureRequest

roi = QgsRectangle(450290, 400520, 450750, 400780)
request = QgsFeatureRequest().setFilterRect(roi)

request = QgsFeatureRequest().setFilterExpression("name = 'Tbilisi'")

for feature in vlayer.getFeatures(request):
    print(f"Matching feature: {feature['name']}")
```

---

## 💾 Writing vector data

```py
from qgis.core import QgsVectorFileWriter, QgsProject

save_options = QgsVectorFileWriter.SaveVectorOptions()
save_options.driverName = "GPKG"
save_options.fileEncoding = "UTF-8"

transform_context = QgsProject.instance().transformContext()

output_path = "/path/to/output/my_data.gpkg"
error = QgsVectorFileWriter.writeAsVectorFormatV3(
    vlayer, output_path, transform_context, save_options
)

if error[0] == QgsVectorFileWriter.NoError:
    print("Saved successfully!")
else:
    print(f"Error: {error}")
```

- **driverName** – the format (e.g. `"ESRI Shapefile"`).  
- **writeAsVectorFormatV3** – the modern way to write.  

---

## 🆕 Creating a new layer from scratch

```py
from qgis.PyQt.QtCore import QVariant
from qgis.core import QgsFields, QgsField, QgsFeature, QgsGeometry, QgsPointXY

fields = QgsFields()
fields.append(QgsField("ID", QVariant.Int))
fields.append(QgsField("name", QVariant.String))

new_layer = QgsVectorLayer(
    "Point?crs=epsg:4326&field=ID:integer&field=name:string",
    "new_layer", "memory"
)
new_layer.dataProvider().addFeatures([])

feat = QgsFeature(new_layer.fields())
feat.setAttribute("ID", 1)
feat.setAttribute("name", "Tbilisi")
feat.setGeometry(QgsGeometry.fromPointXY(QgsPointXY(44.7937, 41.7151)))
new_layer.dataProvider().addFeature(feat)

save_options.driverName = "ESRI Shapefile"
QgsVectorFileWriter.writeAsVectorFormatV3(new_layer, "/path/to/new.shp", transform_context, save_options)
```

---

## 📝 Practical tasks

1. Download the Natural Earth shapefiles, load them in PyQGIS and count the features:  
```py
print(f"Number of features: {vlayer.featureCount()}")
```

2. Create a new Point layer with the coordinates of Tbilisi and save it as **GeoJSON**.  

3. Filter the layer by CRS and save it in a new format:  
```py
print(layer.crs().authid())
```

---

## ⚠ Errors and tips

- **"Layer not valid"** – check the file path and format.  
- Use the **QGIS Python Console** for testing.  
- For more examples: the **QGIS PyQGIS Cookbook**.  

---

## 📚 Additional resources

- [QGIS PyQGIS Developer Cookbook](https://docs.qgis.org)  
- [GDAL Vector Drivers](https://gdal.org/drivers/vector/index.html)
