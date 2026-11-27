# 🗺️ Shapefile — one of the most common GIS formats

A **Shapefile** (.shp format) is one of the most common and historically important vector data formats, used to store and share geographic data. It consists of several related files that together make up a complete geodata layer.

📎 Official description: [Shapefile – Wikipedia](https://en.wikipedia.org/wiki/Shapefile)

---

## 📐 Geometry types in a shapefile

A shapefile layer can have only **one type of geometry**:  
- 📍 **Point**  
- ➖ **Line**  
- 🔷 **Polygon**

💡 Each shapefile contains only one geometry type — for example, one file for points and another for polygons.

---

## 🔤 Encoding and projection

📌 **Important:** choose the right **text encoding** (e.g. UTF-8, CP1251) and the correct **coordinate reference system (CRS)**.  
📍 For example, `EPSG:32638` (UTM zone 38N, WGS 84) is common in Georgia.

---

## 📂 The structure of a shapefile

Technically, a shapefile consists of **at least 3 main files**:

| Extension | Contents                  |
|------------|---------------------------|
| `.shp`     | Geometry (points, lines, polygons) |
| `.shx`     | Index (offset information)          |
| `.dbf`     | Attribute data (similar to .xls) |

📎 Additional files: `.prj` (projection), `.cpg` (encoding), `.qml` (QGIS style) and others.

---

## ❗ What happens if a component is missing?

➡️ If the `.shx` or `.dbf` file is deleted:
- the layer **will not load correctly** in QGIS.
- you may see only the geometry or only the attributes, but not both together.

📌 Always keep all the components of a shapefile **in one folder**.

---

## 🌐 Assigning and changing the projection

- 📥 **Assigning:** if the file has no `.prj`, use the "Assign Projection" function.
- 🔄 **Changing:** use "Reproject Layer" in QGIS, or "Save As…" in another CRS.

---

## 🗃️ Absolute vs relative paths

| Term        | Description |
|----------------|--------|
| **Absolute** | Gives the full path of the file (e.g. `C:/Users/data/roads.shp`) |
| **Relative** | Gives the file's location relative to the project file (e.g. `./data/roads.shp`) |

✅ **Relative paths are recommended**, especially **for projects you share**.

---

## 📌 Conclusion

The Shapefile remains a standard vector format in many GIS systems. Knowing how to use it correctly and understanding its structure is an essential step for both beginners and professional map makers.

---
