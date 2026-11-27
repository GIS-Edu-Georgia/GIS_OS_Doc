# 🗃️ Geographic databases and data management (QGIS)

---

## 1. 📦 Geospatial databases

A **geographic database** is a system for storing and managing geometric objects (point, line, polygon) and the attribute data linked to them.

### 📁 Common formats:
- **GeoPackage (.gpkg)** – modern and flexible, the main QGIS format. Stores several layers (vector, raster), styles and tabular data in one file.
- **File Geodatabase (.gdb)** – ESRI's proprietary format, the main ArcGIS database.
- **Personal Geodatabase (.mdb)** – outdated, based on Microsoft Access.
- **SpatiaLite (.sqlite)** – based on SQLite, with support for geodata. Works well in QGIS.
- **GeoJSON (.geojson)** – ideal for web maps, readable as text.
- **XML (.xml)** – for transferring metadata and geostructure.

🔎 See also: [ESRI Technical Paper – Data Management](https://proceedings.esri.com/library/userconf/proc17/tech-workshops/tw_2585-349.pdf)

---

## 📌 Data sources and correction

🧭 **Primary sources** of GIS data can be:
- remote sensing data (e.g. satellites, drones)
- physical registry records (the public registry)
- field surveys and GPS measurements
- cadastral or regulatory plans

🔧 **Correcting data**:
- correcting attributes with the layer's `Field Calculator`
- determining/changing the CRS or projection
- the `Join` and `Relate` functions for linking elements

---

## 2. 🧰 Data management

### 🎛️ In QGIS:
- With the **Data Source Manager** you can add data from various sources: .shp, .gpkg, PostGIS, WFS/WMS.
- With the **Processing Toolbox** you can import, export, clean and filter data.

### 📐 Creating geometry:
- 🟢 points: schools, houses, stops
- 🔵 lines: roads, rivers, railways
- 🟣 polygons: forests, parcels, stadiums

### 🧹 Optimizing data:
- **Delete Layer/Table**
- **Vacuum / Compact Database (SpatiaLite/SQLite)**
- **Repair Layer Paths** – when the data source is lost (the `Layer is broken` problem)

---

## 3. 📊 Attribute tables

- Every vector layer has its own **attribute table**.
- You can add, change or calculate column values (with the Field Calculator).
- Column types: text, numeric, date, boolean.

---

## 4. 🆔 OBJECTID / Feature ID

- In QGIS it is known as the **FID** (Feature ID), and in ArcGIS as **OBJECTID**.
- It is generated automatically and is unique for each feature.
- It is different from Shapefile IDs, which are just sequence numbers.

---

## 5. 🔣 Working with fields and assigning symbols

- Add new columns (fields): text, integer, decimal.
- Use short column names (especially with Shapefiles — at most 10 characters).
- Use symbol categorization: colours, shapes and symbols with `Categorized`, `Graduated`, `Rule-Based`.

🛑 **What happens if a category is missing?**
- Some features appear on the map with the `default symbol`.
- The attribute table cannot reflect the thematic group.

📍 Solution: `Layer Properties > Symbology` – add or remove the necessary categories.

---

## 6. 🎨 Saving and loading layer styles

- Saving a layer style in QGIS: `.qml` (QGIS Layer Style) or `.sld` (OGC Standard).
- You can use styles:
  - in the same project
  - in other projects, or to share with colleagues

---

## 7. 📏 Adding geometry properties  

**Adding geometric characteristics to the attribute table**:
- X and Y coordinates (Decimal Degrees)
- Length
- Area
- Perimeter

🔧 Use the `Field Calculator`:
```qgis
$area / 10000  -- area in hectares
length($geometry)  -- line length
x($geometry), y($geometry) -- coordinates
```

---

## 8. 🎁 Packaging and sharing maps in QGIS:

Use Project > Save to GeoPackage – all the project's layers in one file

Export > Save As Image/PDF – an image of the map

QGIS Project Package (.qgz) – the whole project file with styles and data


📘 Conclusion

Geographic databases and data management skills are essential for a professional GIS user.
QGIS and ArcGIS both offer versatile tools for organizing, cleaning and presenting data.
Students should know which format, data source or structure is best for what, and how to act in each case.
