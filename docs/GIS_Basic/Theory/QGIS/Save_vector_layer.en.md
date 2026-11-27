# 📁 QGIS – Save Vector Layer As: format options

In the QGIS **`Save Vector Layer As...`** window you can save layers in various formats — each of them suits different needs and environments.

## 🗂️ Vector formats available in QGIS

| Format name                | Extension(s)       | Description |
|---------------------------|--------------------|-------------|
| **GeoPackage**            | `.gpkg`            | 💡 A modern, recommended format. Stores many layers, attributes and styles in one file and supports UTF-8. |
| **ESRI Shapefile**        | `.shp`             | 📦 A legacy format, widely supported. One layer only, limited fields, and many companion files (.dbf, .shx, .prj). |
| **GeoJSON**               | `.geojson`, `.json`| 🌐 Text-based, compatible with the web and with Leaflet. |
| **KML**                   | `.kml`             | 🌍 An XML format intended for Google Earth. |
| **DXF**                   | `.dxf`             | 🏗️ For integration with CAD systems. Stores geometry and some attributes. |
| **CSV**                   | `.csv`             | 📊 Tabular data. If it contains coordinates, it can be used as a point layer. |
| **GML**                   | `.gml`             | 📁 An XML-based OGC standard, good for exchanging data. |
| **MapInfo File**          | `.tab`, `.mif`     | 🧭 Formats used by MapInfo GIS. |
| **SpatiaLite**            | `.sqlite`          | 🧱 Built on an SQLite database, a compatible format — similar to GeoPackage. |
| **Memory**                | *(no file)*        | 🧠 A temporary layer in memory. Not saved to a file. |
| **PostgreSQL**            | *Database*         | 🛢️ Saving directly to a PostgreSQL/PostGIS database. |
| **MySQL / MSSQL**         | *Database*         | 🔗 Database formats — need connection settings. |
| **WFS-T**                 | *Service*          | 🌐 Web Feature Service (Transactional) – sends the data to a server. |
| **DXF Export (QCAD/AutoCAD)** | `.dxf`        | 👷 A CAD file for geometry. |
| **JSON/TopoJSON**         | `.json`, `.topojson`| 📡 For WebGIS use. |
| **FlatGeobuf**     | `.fgb`             | ⚡ A fast, streaming-oriented alternative to GPKG. |

## ✅ Tips

- **GeoPackage (.gpkg)** — 🥇 the recommended modern format, replacing Shapefile.
- **GeoJSON / TopoJSON** — works best with Leaflet and web maps.
- **Shapefile (.shp)** — needed only if you require backward compatibility with older systems.
- **DXF / DWG** — use it when working with CAD.
- **PostgreSQL/PostGIS** — use it if your organization uses spatial databases.

---

🔄 Format support depends on the GDAL version and how QGIS was built.

📌 See more [information:](https://gdal.org/drivers/vector/index.html)





The QGIS **`Save Vector Layer As...`** function lets you save spatial data in many formats — each with its own advantages and areas of use.

---

## 🗺️ Vector formats (best: **GeoPackage → `.gpkg`**)

### 🔹 **GeoPackage (.gpkg)**
- ✅ stores **many layers in one file** (points, lines, polygons, rasters)
- ✅ **UTF-8 support** for correct text encoding
- ✅ **saved styles** and metadata
- 🟢 recommended as a **modern, stable, cross-platform** file format

### 🔸 **Shapefile (.shp)**
- 📦 a classic format, very widely supported
- ❗ only one layer per file
- ❗ field names are limited to 10 characters
- ❗ extra files are required (.shx, .dbf, .prj)

### 🌐 **GeoJSON / KML**
- 🌍 ideal for web maps and for sharing with Google Earth
- ✅ text-based, human-readable
- ✅ easy to embed in JavaScript libraries (Leaflet, Mapbox)

### 🏗️ **DXF (.dxf)**
- 💼 a format for exchanging CAD data
- 🎯 precise geometry for integration with AutoCAD and other CAD programs

---

## 🟨 Raster formats (best: **GeoTIFF → `.tif`**)

### 🖼️ **GeoTIFF (.tif)**
- 🛰️ the standard for satellite imagery, DEMs and indices (NDVI, hillshade)
- ✅ supports multiband data and metadata
- ✅ widely supported across platforms

### 🧾 **IMG / ASCII**
- 🕰️ legacy and modelling formats
- 💡 useful for environmental simulations or specialized GIS modules

---

## 📊 Tabular formats (best: **CSV → `.csv`**)

### 📄 **CSV / Excel (.csv / .xlsx)**
- 🔗 a simple way to import attribute tables and join data to layers
- 🧭 if you have coordinates, you can turn them straight into a point map

---

## ✅ Key takeaways

- 🎯 Choosing the right format ensures:
  - **data integrity**
  - **cross-platform compatibility** (ArcGIS, GRASS, FME)
  - **easier collaboration** on projects
- 🏙️ Whether it is urban planning, infrastructure design or cadastral databases — the format matters.

---

**ℹ️ Tip:**  
If you are starting a new project, start with the `.gpkg` format — it is simple, stable and flexible!

---
