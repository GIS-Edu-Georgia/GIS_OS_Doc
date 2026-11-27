# 🌍 Terrain data and processing it in QGIS

## 🔍 What terrain data is

Terrain is the combination of the heights, slopes and shapes of the Earth's surface. Analysing it is essential for:

- geomorphological research  
- hazard assessment (landslides, floods, etc.)  
- infrastructure planning  
- landscape modelling and visualization  

---

## 🛰️ The main sources of terrain data

### 1. **SRTM (Shuttle Radar Topography Mission)**
- Extension: `.tif` (GeoTIFF)
- Global coverage at 30 m and 90 m resolution
- Source: https://earthexplorer.usgs.gov/

### 2. **ASTER GDEM**
- Extension: `.tif`
- Global coverage at ~30 m resolution
- Source: https://asterweb.jpl.nasa.gov/gdem.asp

### 3. **Copernicus DEM**
- Extension: `.tif`
- High-accuracy terrain (30 m and 10 m)
- Source: https://dataspace.copernicus.eu/

### 4. **ALOS PALSAR**
- Extension: `.tif`
- Detailed terrain data (12.5 m)
- Source: https://asf.alaska.edu/

### 5. **GeoPortal.ge (NAPR)**
- Georgia's national data
- Source: https://www.geoportal.ge/

---

## 💻 Processing terrain data in QGIS

### 📥 Loading the data

1. Open QGIS  
2. Layer > Add Layer > Add Raster Layer  
3. Choose your `.tif` terrain file  

### 🗺️ Colour terrain visualization

- Layer Styling Panel > Render type: Singleband pseudocolor  
- Choose a color ramp (e.g. `terrain`, `viridis`)  
- Set the classification (`Mode`: Equal interval, Quantile, etc.)

### 📈 Generating slope, aspect and hillshade

1. Processing Toolbox > Raster Terrain Analysis  
2. Use:
   - **Slope** – a slope map  
   - **Aspect** – the direction the slope faces   
   - **Hillshade** – simulated light on the terrain  

### 🌀 Generating contour lines

1. Processing Toolbox > Contour  
2. Choose the DEM  
3. Example:
   - Interval: 10 m
   - Attribute name: ELEV  

### 🧮 Reclassification

1. Processing Toolbox > `Reclassify by table`  
2. Use classes by elevation range  
   - e.g. 0–200 = lowland  
   - 200–600 = hills  
   - 600+ = mountains  

### 🌐 TIN and 3D visualization

- Use `TIN interpolation` and `3D Map View`  
- Show the terrain at scale, in three dimensions  

---

## 📚 Additional resources

- [QGIS Terrain Analysis Documentation](https://docs.qgis.org/latest/en/docs/user_manual/processing_algs/qgis/rasteranalysis.html)
- [NASA SRTM Overview](https://www2.jpl.nasa.gov/srtm/)
- [QGIS Tutorials](https://www.qgistutorials.com/)

---
