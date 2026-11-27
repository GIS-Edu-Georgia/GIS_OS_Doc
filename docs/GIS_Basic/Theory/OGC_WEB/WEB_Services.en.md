# 🌐 Spatial web services: WMS, WFS, WMTS, WCS and others

Spatial web services let us exchange, display and analyse geographic data over the internet. They are based on **OGC (Open Geospatial Consortium)** standards.

---

## 🗺️ WMS – Web Map Service

- **What it does:** generates a map image (PNG, JPEG) on the server and sends it to the client.
- **Use:** map visualization — but not attribute analysis.
- **Format:** only an image; you cannot read the data directly.

**Example request:**  
```
https://myserver/geoserver/wms?SERVICE=WMS&REQUEST=GetMap&...
```

📌 Used in Leaflet, OpenLayers, QGIS and other viewers.

---

## 🧾 WFS – Web Feature Service

- **What it does:** sends geographic features (e.g. buildings, roads) with their attributes.
- **Format:** GML, GeoJSON or other data-oriented formats.
- **Benefit:** allows querying, filtering and working with editable data.

**Example request:**  
```
https://myserver/geoserver/wfs?SERVICE=WFS&REQUEST=GetFeature&...
```

📌 Used for analysis, data export and filling in forms.

---

## 🗺️ WMTS – Web Map Tile Service

- **What it does:** sends pre-generated map tiles for fixed scales.
- **Speed:** faster than WMS, because it sends the client images that are already cut into tiles.
- **Format:** PNG, JPEG tiles.

**Example URL (RESTful):**  
```
https://myserver/geoserver/gwc/service/wmts?layer=mylayer&...
```

📌 Ideal for high-performance maps (e.g. basemaps).

---

## 🧊 WCS – Web Coverage Service

- **What it does:** delivers geographic *raster data* (coverage), for example terrain or satellite images.
- **Format:** TIFF, GRID, NetCDF and others.
- **Use:** for analysis and raster modelling.

**Example request:**  
```
https://myserver/geoserver/wcs?SERVICE=WCS&REQUEST=GetCoverage&...
```

📌 Used for modelling the environment, climate and land use.

---

## 🔗 Other services

### 🛰️ CSW – Catalogue Service for the Web
- searching for and delivering metadata.
- used in spatial data infrastructures (SDI).

### 📡 SOS – Sensor Observation Service
- access to sensor data (e.g. temperature, pressure).
- support for internet-connected sensors.

### 🧪 WPS – Web Processing Service
- running spatial analysis operations over the internet (buffer, clip, intersection).
- uses complex server-side processing.

---

## 📚 Comparison table

| Service | Data type | Format | Use |
|---------|----------------|---------|------------|
| WMS     | Image    | PNG, JPEG | Map visualization |
| WFS     | Features       | GML, GeoJSON | Attribute analysis |
| WMTS    | Tiles          | PNG, JPEG | Fast tiles |
| WCS     | Rasters        | GeoTIFF, GRID | Analytical rasters |
| CSW     | Metadata        | XML         | Finding resources |
| SOS     | Sensors       | XML, JSON   | Sensor data |
| WPS     | Processes       | XML         | Spatial analysis |

---

## 🎯 Conclusion 

OGC web services are essential for any web GIS system. Each service serves a specific purpose — images, attribute data, rasters or analysis. Choosing the right service depends on **what you want — viewing, querying, analysis or filtering**.
