# 🧮 Raster Statistics & Calculations — PyQGIS

PyQGIS lets us run statistical analysis on raster data, extract pixel values, perform mathematical operations and many other calculations.

---

## 📊 **Statistics 1 — raster statistics (minimum, maximum, etc.)**

This example calculates the main statistics of a raster layer — **minimum**, **maximum**, **mean**, **range**, **sum** and **sum of squares**.

```python
fn = r'C:\Users\Public\Documents\GK\PyQGIS\shp\tema_9\Raster\DEM\dem.tif'

rlayer = iface.addRasterLayer(fn)

stats = rlayer.dataProvider().bandStatistics(1, QgsRasterBandStats.All)

print("minimumValue:", stats.minimumValue)
print("maximumValue:", stats.maximumValue)
print("mean:", stats.mean)
print("range:", stats.range)
print("sum:", stats.sum)
print("sumOfSquares:", stats.sumOfSquares)
```

**Example output:**
```
minimumValue:  -18.0  
maximumValue:  5035.0  
mean:  1233.8903706592614  
range:  5053.0  
sum:  13471455895.0  
sumOfSquares:  7804600900270.026
```

---

## 📍 **Statistics 2 — getting the pixel value at a specific point**

👉 Checks the raster value at a specific coordinate.  
If the point is outside the raster, `False` is returned.

```python
fn = r'C:\Users\Public\Documents\GK\PyQGIS\shp\tema_9\Raster\DEM\dem.tif'

rlayer = iface.addRasterLayer(fn)

val, res = rlayer.dataProvider().sample(QgsPointXY(474517, 4615243), 1)

print(val, res)
```

📘 **Note:**
- If `res = True`, `val` holds the pixel value.  
- If `res = False`, the point is outside the raster.

---

## 🧠 **Statistics 3 — reading raster data as an array**

👉 For deeper analysis you can read the whole raster matrix with the `gdal` module.

```python
from osgeo import gdal

fn = r'C:\Users\Public\Documents\GK\PyQGIS\shp\tema_9\Raster\DEM\dem.tif'

rlayer = iface.addRasterLayer(fn)

ds = gdal.Open(rlayer.dataProvider().dataSourceUri())
tin_arr = ds.GetRasterBand(1).ReadAsArray()

print(tin_arr)           # the whole array
print(len(tin_arr))      # number of rows
print(len(tin_arr[0]))   # number of columns
print(tin_arr[1200][1200])  # value of a specific pixel
```

**Example output:**
```
[[255. 255. 255. 255. 255. 255.]
 [255. 255. 255. 255. 255. 255.]
 ...
 [255. 255. 255. 255. 255. 255.]]
3644
6883
255.0
```

---

## 🧮 **Raster Calculator in PyQGIS**

👉 Used to run simple mathematical operations on a raster (e.g. adding to or multiplying values).

```python
from osgeo import gdal

fn = r'C:\Users\Public\Documents\GK\PyQGIS\shp\tema_9\Raster\DEM\dem.tif'

lyr1 = QgsRasterLayer(fn)
out = r'C:\Users\Public\Documents\GK\PyQGIS\shp\tema_9\Raster\DEM\dem_calc.tif'

entries = []

ras = QgsRasterCalculatorEntry()
ras.ref = 'ras@1'
ras.raster = lyr1
ras.bandNumber = 1
entries.append(ras)

calc = QgsRasterCalculator(
    'ras@1 + 25.7',  # example: add 25.7 to every pixel
    out,
    'GTiff',
    lyr1.extent(),
    lyr1.width(),
    lyr1.height(),
    entries
)

calc.processCalculation()
iface.addRasterLayer(out)
```

---

## 🎨 **Symbology — styling a raster image (assigning colours)**

👉 Assigning easy-to-read colours according to the values.

```python
rl = r'C:\Users\Public\Documents\GK\PyQGIS\shp\tema_9\Raster\DEM\Georgia_slope.tif'
ifc = iface.addRasterLayer(rl)

stats = ifc.dataProvider().bandStatistics(1, QgsRasterBandStats.All)
min = stats.minimumValue
a = 10
b = 25
c = 40
max = stats.maximumValue

CS = QgsColorRampShader()
CS.setColorRampType(QgsColorRampShader.Interpolated)

lst = [
    QgsColorRampShader.ColorRampItem(min, QColor(250, 235, 221)),
    QgsColorRampShader.ColorRampItem(a, QColor(245, 136, 96)),
    QgsColorRampShader.ColorRampItem(b, QColor('#cb1b4f')),
    QgsColorRampShader.ColorRampItem(c, QColor('#611f53')),
    QgsColorRampShader.ColorRampItem(max, QColor('#03051a'))
]

CS.setColorRampItemList(lst)
shad = QgsRasterShader()
shad.setRasterShaderFunction(CS)

render = QgsSingleBandPseudoColorRenderer(ifc.dataProvider(), 1, shad)
ifc.setRenderer(render)
```

---


## 🗺️ **Reclassify by Table**

👉 This function lets us group raster values into defined ranges (classes).

```python
rl = r'C:\Users\Public\Documents\GK\PyQGIS\shp\tema_9\Raster\DEM\Georgia_slope.tif'
out = r'C:\Users\Public\Documents\GK\PyQGIS\shp\tema_9\Raster\DEM\G_Slope_Reclass.tif'

processing.run(
    'native:reclassifybytable',
    {
        'INPUT_RASTER': rl,
        'RASTER_BAND': 1,
        'TABLE': [0, 10, 1, 10, 25, 2, 25, 40, 3, 40, 55, 4],
        'NO_DATA': 0,
        'RANGE_BOUNDARIES': 0,
        'NODATA_FOR_MISSING': True,
        'DATA_TYPE': 5,
        'OUTPUT': out
    }
)

iface.addRasterLayer(out)
```

---

📘 **Note:**  
`QgsRasterCalculator` lets you create a new raster with various mathematical calculations (e.g. `ras@1 * 2`, `ras@1 - 100`, etc.).

---

✅ **Conclusion:**  
PyQGIS gives you powerful tools for analysing raster data and running operations on it — statistics, pixel extraction, mathematical calculations and access to the full matrix.

---
