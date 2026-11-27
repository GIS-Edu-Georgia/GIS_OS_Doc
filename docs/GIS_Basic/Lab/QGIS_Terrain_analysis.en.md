# Terrain analysis

You can watch the video recordings [here](https://gtu.qgis.ge/GIS_SKA/Videos/) <br>


### ⚙️ Processing Toolbox <br>

Tool for merging rasters - [Merge](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/gdal/rastermiscellaneous.html#gdalmerge) <br>
Tool for contour lines - [Contour](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/gdal/rasterextraction.html#gdalcontour) <br>
Tool Clip raster by mask [layer](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/gdal/rasterextraction.html#gdalcliprasterbymasklayer)  <br>
Tool TIN [Interpolation](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/interpolation.html#qgistininterpolation) <br>
Tool Reclassify by [table](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/rasteranalysis.html#qgisreclassifybytable)  <br>
Tool [Slope](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/rasterterrainanalysis.html#qgisslope) <br>
Tool [Aspect](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/rasterterrainanalysis.html#qgisaspect) <br>
Tool [Hillshade](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/rasterterrainanalysis.html#qgishillshade) <br>
Tool Raster [Analysis](https://docs.qgis.org/3.40/en/docs/user_manual/working_with_raster/raster_analysis.html) <br>

### Official documentation <br>

3D Map [View](https://docs.qgis.org/3.40/en/docs/user_manual/map_views/3d_map_view.html) <br>


### Additional links <br>

30-Meter SRTM [Tile](https://dwtkns.com/srtm30m/) <br>
Shuttle radar topography [mission](https://eospso.gsfc.nasa.gov/missions/shuttle-radar-topography-mission) <br>
NASA [Earthdata](https://urs.earthdata.nasa.gov/) <br>
Solar power [plant](https://kapanadze.medium.com/%E1%83%9B%E1%83%96%E1%83%98%E1%83%A1-%E1%83%94%E1%83%9A-%E1%83%A1%E1%83%90%E1%83%93%E1%83%92%E1%83%A3%E1%83%A0%E1%83%98-564fcf10776f) (article in Georgian) <br>
Topographic [map](https://kapanadze.medium.com/%E1%83%9E%E1%83%98%E1%83%A0%E1%83%95%E1%83%94%E1%83%9A%E1%83%98-%E1%83%A1%E1%83%98%E1%83%A7%E1%83%95%E1%83%90%E1%83%A0%E1%83%A3%E1%83%9A%E1%83%98-ccbe373a05e0) (article in Georgian) <br>

Some materials are kept in Google [Classroom](https://classroom.google.com/c/Nzg3MzAxMDU4MzEy/m/Nzg3NTk5MzU2OTYw/details) ⚠️ <br>

---
## Assignment instructions

⚠️ **Working environment**

On university computers, work in this folder:  
`C:\Users\Public\` or `C:\Users\Public\Documents`  
*(recommended on personal computers too, because the program may have trouble processing files located elsewhere.)*

📦 **Required programs**

* QGIS – required ✅  
* Google Earth – optional (depending on the assignment) ✅  

---

!!!warning
    Do not delete the finished material until the end of the semester.
    
---

!!!danger 
    **File naming rules**

    ❌ **Wrong:**  

    Giorgi Kapanadze.Group/1$ work1  

    ❌ Do not use:

    - Georgian letters (ა, ბ, გ, დ, etc.)  
    - special characters (except the underscore `_`)

    ✅ **Correct:**  

    Giorgi_Kapanadze_Group_1_work_1  

!!!tip
    Use only Latin letters, digits and the underscore (`_`) for:  
    archive names, folder and file names, table column names.

---

## 📘 Step-by-step guide

!!!note
    To download the data and upload the assignment, you need to sign in to Google Classroom
     : [classroom.google.com](https://classroom.google.com/)

=== "Stage I: organizing the folder"
* We use the previous assignment, **Selections [task](https://gtu.qgis.ge/GIS_SKA/Lab/Selection/)**



``` mermaid
graph LR
  A[FirstName_LastName_GroupNumber_Assignment_Number] --> B{Project};
  A[FirstName_LastName_GroupNumber_Assignment_Number] --> C{Plugins};
  A[FirstName_LastName_GroupNumber_Assignment_Number] --> D{shp};
  A[FirstName_LastName_GroupNumber_Assignment_Number] --> E{Geodatabase};
  A[FirstName_LastName_GroupNumber_Assignment_Number] --> F{Style};
  A[FirstName_LastName_GroupNumber_Assignment_Number] --> G{archive};
  A[FirstName_LastName_GroupNumber_Assignment_Number] --> H{GPS_coordinates};
  A[FirstName_LastName_GroupNumber_Assignment_Number] --> I{Fonts};
  A[FirstName_LastName_GroupNumber_Assignment_Number] --> J{Raster};
  J --> K[GeoTaggedphoto];
  A[FirstName_LastName_GroupNumber_Assignment_Number] --> L{CAD};
  A[FirstName_LastName_GroupNumber_Assignment_Number] --> M{GML};
  A[FirstName_LastName_GroupNumber_Assignment_Number] --> N{GeoJSON};
  F --> O[geoserver];
  A[FirstName_LastName_GroupNumber_Assignment_Number] --> P{WEB};
  A[FirstName_LastName_GroupNumber_Assignment_Number] --> Q{Google};
  A[FirstName_LastName_GroupNumber_Assignment_Number] --> R{Topology_rules};
  J -->|Slope, Aspect, Hillshade| S[Terrain];
  J --> T[DEM];


```

Connect QGIS to your main folder (from the Browser window).

---

=== "Step II: processing the raster"

* Open the `"Chiatura_topology.qgz"` file from the folder and save a copy named `"terrain"`  
  Also save another `.qgs` file, `"Chiatura_terrain.qgs"`   <br>
* Download any 2 parts of the terrain from the [website](https://dwtkns.com/srtm30m/) and merge them.   <br>
* Clip the terrain with the municipality boundaries.  <br>
* Extract contour lines from this terrain in different amounts: **at a 100 meter interval** (`Contour interval`) and **with a 100 meter base value** (`Base contour`) <br>
* From the same contour lines, create a terrain model with an appropriate pixel size. <br>
* Divide the terrain into predefined classes. <br>
* Create slope, hillshade and aspect. <br>
* With the raster calculator, extract a specific elevation or slope from the raster.  <br>
* Create a 3D model from the terrain. <br>



=== "Stage III: checking and submitting"
* Make an archive of your folder. 💾
* Use the `.rar` or `.zip` format.
* Name the archive in this format:  
  `FirstName_LastName_GroupNumber_Assignment_Number`

* Upload the work to Google Classroom

---

!!!warning
    If you have any problem while submitting, contact us:  
    g.kapanadze1908@gmail.com  
    or use any file transfer service. <br>

    https://www.swisstransfer.com/en-gb

    https://wetransfer.com/

    https://www.filemail.com/

    https://dropmefiles.com/

    https://www.swisstransfer.com/en-gb

    https://www.sendgb.com/

    https://workupload.com/ 

!!!info
    📌 If anything is unclear, feel free to ask! 😊  
    If something is done incorrectly, I will fix it — or create a pull request yourself.
