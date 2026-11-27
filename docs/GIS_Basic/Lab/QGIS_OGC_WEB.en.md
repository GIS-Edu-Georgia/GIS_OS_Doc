# OGC WEB services

You can watch the video recordings [here](https://gtu.qgis.ge/GIS_SKA/Videos/) <br>


### ⚙️ Processing Toolbox <br>

Tool Basic [fields](https:) <br>


### Official documentation <br>
Window - Working with OGC / ISO [protocols](https://docs.qgis.org/3.40/en/docs/user_manual/working_with_ogc/ogc_client_support.html) <br>
GeoServer [documentation](https://docs.geoserver.org/) <br>
QGIS Server [Guide](https://docs.qgis.org/3.40/en/docs/server_manual/getting_started.html#prepare-a-project-to-serve) <br>
GeoNode [documentation](https://docs.geonode.org/en/master/) <br>
GeoNetwork [documentation](https://www.geonetwork-opensource.org/docs.html) <br>
Sentinel Hub - OGC [service](https://docs.sentinel-hub.com/api/latest/api/ogc/) <br>

### Additional links <br>
OGC - [consortium](https://www.ogc.org/) <br>
GeoNode - Open Source Geospatial Content Management [System](https://geonode.org/) <br>
GeoNetwork is a catalog application to manage spatially referenced [resources](https://www.geonetwork-opensource.org/) <br>
National Spatial Data Infrastructure [NSDI](https://nsdi.gov.ge/ka) <br>
[Software](https://gtu.qgis.ge/GIS_SKA/Software/Geoserver/) <br>
The Windows environment and configuring [GeoServer](https://gtu.qgis.ge/GIS_SKA/Theory/Win_ENV/) <br>
Save Vector [Layer As](https://gtu.qgis.ge/GIS_SKA/Theory/Save_vector_layer/#vector-formats-available-in-qgis) <br>
The QGIS SLD [format](https://gtu.qgis.ge/GIS_SKA/Theory/QML_SLD/) <br>
OGC [WEB](https://gtu.qgis.ge/GIS_SKA/Theory/WEB_Services/) <br>
NAPR GeoNetwork [catalogue](https://geonetwork.napr.gov.ge/geonetwork/srv/geo/catalog.search#/home) <br>
[GeoNode](https://gtu.qgis.ge/GIS_SKA/Theory/GeoNode/) <br>
[GeoNetwork](https://gtu.qgis.ge/GIS_SKA/Theory/GeoNetwork/) <br>



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
* We use the previous assignment, **Selections  [task](https://gtu.qgis.ge/GIS_SKA/Lab/Selection/)**



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


```

Connect QGIS to your main folder (from the Browser window).

---

=== "Step II: setting up the services"

* Open the `"Chiatura_selection.qgz"` file from the folder and save a copy named `"Geoserver_project"`  
  Also save another `.qgs` file, `"Chiatura_Geoserver_project.qgs"`   <br>
* Use your own digitized material from the previous assignment, or download and process OSM data for the same municipality. <br>
* Set up a basic project in GeoServer and publish several layers as services. <br>
* Save the layer style in SLD format from the QGIS project, to upload to the server as well, and use it when publishing the layer as a service. <br>
* Bring the WMS and WFS services you set up into a QGIS project to test them.
* Visit NAPR's official [catalogue](https://geonetwork.napr.gov.ge/geonetwork/srv/geo/catalog.search#/home), find the spatial material you want and bring it into your project as a service to test it. <br>
* Register on [GeoNode](https://stable.demo.geonode.org/#/), upload one of your layers, copy the service link with "Copy OGC WEB Services URL" and bring it into a QGIS project as WMS or WFS to test it. <br>
* Otherwise, browse the Datasets [catalogue](https://stable.demo.geonode.org/catalogue/#/datasets), choose any data you like and repeat the same process; you can [use](https://stable.demo.geonode.org/catalogue/uuid/2f6c18f7-d11b-4fd0-9914-29ddac5c01fc0) this one as a template <br>
* You can also bring all the material hosted on GeoNode's GeoServer into QGIS with a request: https://stable.demo.geonode.org/geoserver/ows <br>






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
