# Raster images

# Links

Band combinations for [landsat 8](https://www.esri.com/arcgis-blog/products/product/imagery/band-combinations-for-landsat-8) <br>

Remote sensing [indices](https://www.google.com/search?sxsrf=AE3TifNCTqXj97RwuleVhnxbNqx2DgupRg:1753289260424&q=remote+sensing+indices&udm=2#vhid=_6LO4RyUDRUhwM&vssid=mosaic) <br>

Remote sensing [indices](https://www.researchgate.net/publication/336975237/figure/tbl2/AS:820629183922180@1572664652843/Equations-of-tested-nine-remote-sensing-indices.png) <br>


<!-- Obsidian / VSCode Preview / Web rendering -->
<p align="center">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/yPF2jpjB3Qw" 
          title="YouTube video" frameborder="0" allowfullscreen></iframe>
</p>





**Raster data** is spatial information based on a grid structure. Each element of this grid — a *pixel* — carries a specific value that represents some attribute or layer (e.g. elevation, temperature, colour).

---

## 📌 Main characteristics

- made of a grid of **pixels** (grid cells)
- each pixel has:
  - a *location* (its place in the grid)
  - a *resolution* (the geographic size of each pixel)
  - a *value* (e.g. a colour code, elevation, temperature)
- the data is stored as a **matrix** (rows and columns)

---

## 🖼️ Types of raster data

| Type | Description | Examples |
|------|--------|------------|
| 📷 **Colour image** (True Color) | A visual image with red, green and blue bands | Satellite photos, Google Earth |
| 🌡️ **Thematic raster** | Each pixel represents an attribute or category | Land use maps, soil types |
| ⛰️ **Digital elevation model (DEM)** | A matrix of elevation data | Terrain analysis, slope calculation |
| 🌫️ **Hyperspectral/multispectral images** | Many spectral bands, with highly precise information | Environmental monitoring, agriculture |

---

## 📏 Geographic resolution

- **Spatial (geographic) resolution**: the physical size one pixel covers in the real world (e.g. 10 m × 10 m).
- The smaller the pixel size, the more **detailed** the image.

---

## 🗂️ Raster vs Vector

| Parameter | Raster | Vector |
|-----------|--------|--------|
| Data type | Grid | Point, line, polygon |
| Data volume | Large | Relatively small |
| Processing | Fast for analysis | Complex analysis |
| Areas of use | Terrain, temperature, satellite images | Roads, buildings, boundaries |

---

## 🛠️ Software for working with rasters

- **QGIS** – open-source GIS software (Georeferencer, Raster Calculator)
- **ArcGIS** – a professional platform with broad functionality
- **GDAL** – a library for raster and vector data

---

## 🎓 Areas of use

- environmental monitoring and climate analysis  
- interpreting satellite images  
- urban planning and land use  
- natural resource management  

---

# 📊 Types of resolution in remote sensing

| Category              | Spatial resolution                  | Spectral resolution                         | Temporal resolution                           | Radiometric resolution                      |
|------------------------|-----------------------------------------------|----------------------------------------------------------|--------------------------------------------------------|------------------------------------------------------------|
| 📌 **Definition**     | The size of the ground area represented by a pixel      | The ability to distinguish wavelengths in the electromagnetic spectrum       | How often images of the same location are acquired | The sensor's sensitivity to small differences in energy |
| 📏 **How it is measured**     | Pixel size (e.g. 10 m, 30 m, 0.5 m)        | The number, width and placement of spectral bands         | The interval between images (e.g. 1 day, 5 days)        | Bits per pixel (e.g. 8-bit = 256 levels)     |
| 📈 **High resolution**| Small pixels; more spatial detail         | More, narrower spectral bands                         | More frequent data acquisition                          | Higher precision for detecting small differences            |
| 🎯 **Areas of use** | Urban maps, precision agriculture, habitat delineation | Crop classification, mineral detection, vegetation indices | Change detection, phenology, emergencies | Crop stress, water turbidity, thermal variation         |
| 📷 **Examples**      | WorldView-3 (0.31 m), Sentinel-2 (10 m), Landsat 8 (30 m) | AVIRIS (224 bands), Hyperion (220), Sentinel-2 (13)       | MODIS (1-2 days), Sentinel-2 (5 days), Landsat 8 (16 days) | Landsat 8 (12-bit), Sentinel-2, MODIS (12–16 bit)         |
| 💾 **Effect on file size** | Higher resolution = more pixels = a larger file | More bands = a wider spectrum = a larger file                 | Frequent acquisitions = more volume over time                | More bits per pixel = more data and processing time       |
| ⚖️ **Trade-offs**     | High detail reduces the area covered and increases volume | Narrow bands increase noise and reduce signal quality    | High frequency often comes with less spatial detail       | High bit depth increases data volume              |
| ⚙️ **What it depends on** | Sensor design and altitude, orbit              | Filters and wavelength limits                    | The satellite's orbit (sun-synchronous, geostationary), swath width | Sensor electronics, the precision of analog-to-digital conversion   |
| 🔗 **Related concepts** | GSD (Ground Sampling Distance), Pixel Footprint | Bandwidth, Hyperspectral vs. Multispectral              | Temporal frequency, Repeat cycle, Temporal aliasing    | Digital Number (DN), Signal-to-Noise Ratio (SNR)            |

> 📝 **Note**: understanding these characteristics correctly helps you choose for tasks such as land cover change, disaster mapping, environmental monitoring and precision agriculture.


## ✅ Summary

Raster data is ideal for representing continuous, surface-type data. Use it when you need a detailed image or attributes that vary continuously (for example, elevation, temperature, illumination, etc.).
