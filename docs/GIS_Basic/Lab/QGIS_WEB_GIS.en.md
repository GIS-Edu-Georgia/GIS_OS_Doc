# WEB-GIS

You can watch the video recordings [here](https://gtu.qgis.ge/GIS_SKA/Videos/) <br>


### ⚙️ Processing Toolbox <br>

Tool Basic [fields](https:) <br>


### Official documentation <br>
Plugin - [qgis2web](https://github.com/qgis2web/qgis2web) <br>
Plugin - [Qgis2threejs](https://github.com/minorua/Qgis2threejs) <br>
JSON [Wikipedia](https://en.wikipedia.org/wiki/JSON) <br>

### Additional links <br>
Google My [Maps](https://www.google.com/maps) <br>
Template: hot dog [map](https://www.google.com/maps/d/u/3/edit?hl=ka&mid=176BVE02xYafhr-6qezCRy4sHJs76xZyf&ll=42.51875523468736%2C42.56166703834641&z=7)  <br>
Template: liquefied [gas](https://www.google.com/maps/d/u/3/edit?hl=ka&mid=1y3jZwVgz0WEYQWvZjlNysLex4eLLSrw&ll=42.17127030085311%2C43.86809699999997&z=9) <br>
Template: Georgia's Recycling [Map](https://www.google.com/maps/d/u/3/viewer?hl=ka&mid=18VONz4zIlS6VgcDRIAX6odQ8YGBjUQdz&ll=42.00871348204378%2C43.53747129999999&z=8) <br>
KML / KMZ – a format for exchanging spatial [data](https://gtu.qgis.ge/GIS_SKA/Theory/Google/Google_formats/) <br>
Municipal Services Development [Agency](https://ms.gov.ge/msmap/) <br>


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
* Geoserver – required ✅  

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
* We use the previous assignment, **OGC WEB  [task](https://gtu.qgis.ge/GIS_SKA/Lab/OGC_WEB/)**



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


```

Connect QGIS to your main folder (from the Browser window).

---

=== "Step II: setting up the services"

* Open the `"Chiatura_Geoserver_project.qgz"` file from the folder and save a copy named `"web_gis"`  
  Also save another `.qgs` file, `"Chiatura_web_gis.qgs"`   <br>

* Upload your material and build a map on the Google platform; the symbols, formatting, colours, line widths, images, descriptions, layers, etc. are up to your taste. Take a public shareable link.
* From the QGIS project, build a web map with the qgis2web plugin, save it in the right folder of your project and share it as an archive.
* Then register on GitHub, create a new repository, upload the files, enable GitHub Pages and take its link to share. 




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
