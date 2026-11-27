# Selections | export | statistics | metadata

You can watch the video recordings [here](https://gtu.qgis.ge/GIS_SKA/Videos/) <br>


### ⚙️ Processing Toolbox <br>

Tool Basic statistics for [fields](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/vectoranalysis.html#qgisbasicstatisticsforfields) <br>
Tool Package [layers](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/database.html#qgispackage) <br>
Documentation Vector [selection](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/vectorselection.html) <br>

### Official documentation <br>
Window - The Browser [panel](https://docs.qgis.org/3.40/en/docs/user_manual/introduction/browser.html#resources-that-can-be-opened-run-from-the-browser) <br>
Window - Bookmarking extents on the [map](https://docs.qgis.org/3.40/en/docs/user_manual/map_views/map_view.html#bookmarking-extents-on-the-map) <br>
Window - [Metadata](https://docs.qgis.org/3.40/en/docs/user_manual/introduction/general_tools.html#metadata) <br>



### Additional links <br>
Theory - saving a vector [layer](https://gtu.qgis.ge/GIS_SKA/Theory/Save_vector_layer/) <br>
Data [OSM](https://download.geofabrik.de/europe/georgia.html) <br>
National Spatial Data Infrastructure [NSDI](https://nsdi.gov.ge/ka) <br>
The Law of Georgia on the National Spatial Data [Infrastructure](https://www.napr.gov.ge/uploads/Laws/13/638245c432a7a8aaf58118487d569635be3ccafd.pdf) (in Georgian) <br>
OGC - [consortium](https://www.ogc.org/) <br>





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
* We use the previous assignment, **Digitization 1 [task](https://gtu.qgis.ge/GIS_SKA/Lab/Digitization1/)**



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


```

Connect QGIS to your main folder (from the Browser window).

---

=== "Step II: various geoprocessing tools"

* Open the `"Chiatura_Digitalization_digitalizacia1.qgz"` file from the folder and save a copy named `"Geodatabase_project"`  
  Also save another `.qgs` file, `"Chiatura_Geodatabase_selections.qgs"`   <br>
* Use your own digitized material from the previous assignment, or download and process OSM data for the same municipality. <br>
* Using attribute table filtering, select different objects by category or by another characteristic in the table. Also 
use the SQL query language and its elements through expressions. | <br>
* Use the interactive selection elements. | <br>
* Select different objects with spatial selection. | <br>
* Use the selection arrow and its options: invert selection, select all, deselect, etc. | <br>
* > Each time, export the selected objects to different vector formats: GeoPackage, ESRI Shapefile, GeoJSON, KML, DXF, CSV, GML, etc. <br>
* Create spatial bookmarks and save them with export. <br>
* Create metadata for one of the spatial layers and save it with export. <br>



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
