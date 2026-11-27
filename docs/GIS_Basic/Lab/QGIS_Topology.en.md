# Topology

You can watch the video recordings [here](https://gtu.qgis.ge/GIS_SKA/Videos/) <br>


### ⚙️ Processing Toolbox <br>

Tool Topological [coloring](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/cartography.html#qgistopologicalcoloring) <br>


### Official documentation <br>

[Topology](https://docs.qgis.org/3.40/en/docs/gentle_gis_introduction/topology.html) <br>



### Additional links <br>

[Topology](https://en.wikipedia.org/wiki/Geospatial_topology) <br>
 




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


```

Connect QGIS to your main folder (from the Browser window).

---

=== "Step II: various geoprocessing tools"

* Open the `"Chiatura_web_gis.qgz"` file from the folder and save a copy named `"topology"`  
  Also save another `.qgs` file, `"Chiatura_topology.qgs"`   <br>
* To find geometry errors, choose the layers you want in the project and group them. <br>
* Create a new folder where you will save the topology rules you set up. <br>
* Check for geometry errors, fix them and save. <br>


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
