# QgsRasterLayer in PyQGIS

`QgsRasterLayer` is the QGIS class used to load and manage **raster data** (e.g. GeoTIFF, JPEG, DEM, satellite images, etc.).

---

## 🔑 The main concept

A raster layer is made of a **matrix of pixels**. Each pixel has a value (e.g. elevation, temperature, image colour).  
In PyQGIS, `QgsRasterLayer` lets you:

- load and display rasters in various formats (GeoTIFF, ASCII GRID, JPEG, PNG, etc.)
- work with multiband data.
- read pixel values.
- apply styling (symbology).
- run analysis with the Raster Processing Toolbox.

---

## 📂 Main attributes

- **Datasource path** – the file path (e.g. `"C:/data/dem.tif"`)
- **Layer name** – the layer's name in the QGIS project
- **Provider type** – usually `"gdal"` (because GDAL is used to read raster files)

---

## 📝 Examples

### 1. Loading a raster file

```python
from qgis.core import QgsRasterLayer

path = r"C:\Users\Public\GIS\data\dem.tif"
layer_name = "Digital Elevation Model"

raster_layer = QgsRasterLayer(path, layer_name, "gdal")

if raster_layer.isValid():
    QgsProject.instance().addMapLayer(raster_layer)
    print("Raster loaded successfully!")
else:
    print("Failed to load raster.")
```

---

### 2. Getting information about the raster layer

```python
print("Layer name:", raster_layer.name())
print("Crs:", raster_layer.crs().authid())
print("Width:", raster_layer.width())
print("Height:", raster_layer.height())
print("Bands:", raster_layer.bandCount())
```

---

### 3. Information from a specific band

```python
provider = raster_layer.dataProvider()

# calculate band statistics
stats = provider.bandStatistics(1)
print("Minimum:", stats.minimumValue)
print("Maximum:", stats.maximumValue)
print("Mean:", stats.mean)
```

---

### 4. Getting a pixel value at a coordinate

```python
from qgis.core import QgsPointXY

point = QgsPointXY(356671, 4679923)
ident = raster_layer.dataProvider().identify(point, QgsRaster.IdentifyFormatValue)

if ident.isValid():
    print("Pixel value:", ident.results())
```

---

### 5. Changing the symbology (Singleband Gray)

```python
from qgis.core import QgsSingleBandGrayRenderer

provider = raster_layer.dataProvider()
renderer = QgsSingleBandGrayRenderer(provider, 1)  # first band
raster_layer.setRenderer(renderer)
raster_layer.triggerRepaint()
```

---

### 6. Symbology with a colour palette (Pseudo color)

```python
from qgis.core import QgsColorRampShader, QgsRasterShader, QgsSingleBandPseudoColorRenderer
from qgis.PyQt.QtGui import QColor

provider = raster_layer.dataProvider()
fcn = QgsColorRampShader()
fcn.setColorRampType(QgsColorRampShader.Interpolated)

# min/max values
fcn.setColorRampItemList([
    QgsColorRampShader.ColorRampItem(0, QColor(0,0,255), 'Low'),
    QgsColorRampShader.ColorRampItem(1000, QColor(0,255,0), 'Medium'),
    QgsColorRampShader.ColorRampItem(2000, QColor(255,0,0), 'High')
])

shader = QgsRasterShader()
shader.setRasterShaderFunction(fcn)

renderer = QgsSingleBandPseudoColorRenderer(provider, 1, shader)
raster_layer.setRenderer(renderer)
raster_layer.triggerRepaint()
```

---

## ⚙️ Areas of use

- **DEM (Digital Elevation Model)** → elevation analysis, slope, aspect
- **Satellite images** → Landsat, Sentinel, MODIS
- **Orthophotos (orthoimagery)** → cartography, topographic maps
- **Climate data** → temperature, precipitation

---

## ℹ️ Notes

- In PyQGIS a raster always uses the **GDAL provider**.
- Matching CRSs are required for correct overlay with other layers.
- When working with large rasters, **pyramids** and **tiling** may be needed.

---

# Conclusion

`QgsRasterLayer` is the main PyQGIS tool for managing raster data.  
