# Map composition

You can watch the video recordings [here](https://gtu.qgis.ge/GIS_SKA/Videos/) <br>


### ⚙️ Processing Toolbox <br>

Tool for merging rasters - [Merge](https://docs.qgis.org/3.40/en/docs/training_manual/map_composer/map_composer.html) <br>


### Official documentation <br>

Overview of the Print [Layout](https://docs.qgis.org/3.40/en/docs/user_manual/print_composer/overview_composer.html) <br>
Using Print [Layout](https://docs.qgis.org/3.40/en/docs/training_manual/map_composer/map_composer.html) <br>


### Additional links <br>

30-Meter SRTM [Tile](https://en.wikipedia.org/wiki/Geospatial_topology) <br>
 




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
  A[FirstName_LastName_GroupNumber_Assignment_Number] --> U{Layout};
  J --> V[Print];

```

Connect QGIS to your main folder (from the Browser window).

---

=== "Step II: processing the raster"

* Open the `"Chiatura_terrain.qgz"` file from the folder and save a copy named `"layout"`  
  Also save another `.qgs` file, `"Chiatura_layout.qgs"`   <br>
* Add the new folders Layout and Print to the project.
<br>
++left-control+left-shift+"N"++
<br>
* Open the Layout design mode
<br>
++left-control+"P"++
<br>
* Design your assignment following the principles of map composition.
* The theme is not restricted — what information you put on the map is up to you.
* You can also use terrain and other terrain elements to work on several compositions.
* Don't forget the map composition elements: title, north arrow, scale, legend, etc.
* 



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
