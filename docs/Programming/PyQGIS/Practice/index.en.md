# 📝 PyQGIS — Practical assignments

This section collects practical assignments for students. Every operation must be done with **PyQGIS** (in the QGIS Python console).

| # | Assignment | Topics |
|---|----------|--------|
| 1 | [Assignment 1](task_01.md) | Creating a layer, deleting fields, XY, area/perimeter (UTM), duplicates |
| 2 | [Assignment 2](task_02.md) | Attribute and spatial selection, deleting, clipping, DMS → decimal, lengths (ellipsoid/UTM) |
| 3 | [Assignment 3](task_03.md) | Coming soon |
| 4 | [Assignment 4](task_04.md) | Filter, geometry conversion, creating a layer, coordinate conversion |
| 5 | [Assignment 5](task_05.md) | Raster statistics, reclassification, histogram, contour lines |

---

## 📋 General rules

- Name your folder with your first and last name, e.g. `Giorgi_Kapanadze_task1`.
- Use **only Latin letters and underscores** in the names of archives, folders, files, table columns, variables, functions and classes. Georgian letters and other symbols are not allowed.
- Where the assignment does not specify them, choose the names of layers, columns and output folders yourself, following GIS file organization principles.
- Take full-screen screenshots (Snipping Tool). Upload **only the screenshots** to the class.
- On university computers, work in the `C:\Users\Public\` or `C:\Users\Public\Documents` folder.
- Write every operation in PyQGIS and save screenshots of the code in a `screenshot` folder.

---

## 📦 Data

The data for the assignments is in the folder
[`sample_data/practice`](https://github.com/ezdanapak/GIS_OS_Doc/tree/main/docs/Programming/PyQGIS/sample_data/practice).
Each assignment page lists the files it needs.

The elevation model [`srtm_45_04.tif`](https://github.com/GIS-Edu-Georgia/GIS_OS_Doc/releases/download/pyqgis-data-v1/srtm_45_04.tif) (24 MB) is downloaded separately from a GitHub Release. The other files are in the `osm/` and `task_04/` folders.

The OpenStreetMap layers (Georgia, 8 shapefiles) are in one archive: [`OSM_shp_PyQGIS.zip`](https://github.com/GIS-Edu-Georgia/GIS_OS_Doc/releases/download/osm-data-v1/OSM_shp_PyQGIS.zip) (8 MB; including `gis_osm_roads_free_Batumi`). Data © OpenStreetMap contributors (ODbL).

---

## 💡 Solutions

Under each problem there is a collapsed **"Solution"** block. Try it on your own first and open the block only afterwards.
Paths and column names in the solutions are illustrative; adapt them to your data.

??? tip "General helper code (used in all assignments)"
    ```python
    from qgis.core import *
    import processing

    base = r'C:/Users/Public/Documents/practice'   # your working folder

    def save_shp(layer, path):
        """Saves a layer as a Shapefile (UTF-8)."""
        opts = QgsVectorFileWriter.SaveVectorOptions()
        opts.driverName = 'ESRI Shapefile'
        opts.fileEncoding = 'UTF-8'
        res = QgsVectorFileWriter.writeAsVectorFormatV3(
            layer, path, QgsProject.instance().transformContext(), opts)
        return res[0] == QgsVectorFileWriter.NoError
    ```
