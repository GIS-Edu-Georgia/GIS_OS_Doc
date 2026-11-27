# 📁 CAD and GIS: DXF/DWG files in geographic information systems

## 🔹 Introduction

**CAD (Computer-Aided Design)** is a family of systems used in engineering, architecture, surveying and construction for precise modelling of spatial objects. Its main formats are:

- **DWG (Drawing):** a proprietary format developed by AutoDesk.
- **DXF (Drawing Exchange Format):** an open text format created to make sharing DWG with other systems easy.

## 🔹 The main differences between CAD and GIS

| Parameter       | CAD                             | GIS                                  |
|----------------|----------------------------------|---------------------------------------|
| Purpose          | A precise technical drawing           | Spatial analysis and a database    |
| Coordinates     | Often local, without a projection | Georeferenced, global         |
| File format  | DWG, DXF                         | Shapefile, GeoPackage, GeoJSON, DB   |
| Type of information| Lines, points, text         | Geometry + attribute data     |

## 🔹 DXF/DWG files in GIS

GIS systems (e.g. QGIS, ArcGIS) often need to **import CAD files**, especially when survey drawings must be combined with other spatial data.

### 🔸 Importing DWG/DXF in QGIS

- **QGIS support:**
  - QGIS can load DXF files directly as **vector layers** (point, line, polygon).
  - DWG files need GDAL/OGR support or conversion to DXF.

- **Process:**
  1. Open QGIS → *Layer* > *Add Layer* > *Add Vector Layer*
  2. Choose the DXF file
  3. Several layers appear: `entities`, `points`, `lines`, `polygons`, `annotations`.

### 🔸 In ArcGIS

ArcGIS can import CAD files directly if they are **correctly georeferenced**.

- The CAD file opens automatically as a CAD Dataset.
- It can be converted to a Feature Class.
- The *CAD to Geodatabase* or *Feature Class to Feature Class* tools are used.

## 🔹 Georeferencing a CAD file

A CAD file does not always contain a geographic system. You need:

- to **assign the correct coordinate system** in GIS
- or to georeference it using **reference points** — known points

## 🔹 Usage examples in GIS

1. **Integrating architectural drawings with urban GIS data**
2. **Adding existing infrastructure to urban planning maps**
3. **Visualizing utility networks (water, electricity, gas)**
4. **Analysing survey data together with other spatial layers**

## 🔹 Converting CAD → GIS

| Tool      | Description                                  |
|------------------|------------------------------------------|
| `ogr2ogr`         | Converting DXF → Shapefile or GeoJSON   |
| QGIS Processing  | DXF layers → Shapefile                   |
| ArcGIS Toolboxes | CAD to GDB/Feature Class                 |

## 🔹 Good practice

- Use only the **DXF (R2007 or lower)** format for QGIS.
- Make sure the CAD drawing is built with **accurate coordinates**.
- Use a layer structure (layer names), so that they are easy to classify in GIS.

## 🔹 References and resources

- [QGIS Documentation on CAD support](https://docs.qgis.org/)
- [AutoDesk DXF Format Specification](https://www.autodesk.com)
- [GDAL OGR CAD Driver](https://gdal.org/drivers/vector/dxf.html)
- [ArcGIS CAD Integration Guide](https://pro.arcgis.com/)
