# Geodatabases

You can watch the video recordings [here](https://gtu.qgis.ge/GIS_SKA/Videos/) <br>

Official documentation <br>

Window - DB Manager [Plugin](https://docs.qgis.org/3.40/en/docs/user_manual/plugins/core_plugins/plugins_db_manager.html#index-0) <br>
Attribute [table](https://docs.qgis.org/3.40/en/docs/user_manual/working_with_vector/attribute_table.html#index-0) <br>
Field [calculator](https://docs.qgis.org/3.40/en/docs/user_manual/working_with_vector/attribute_table.html#index-6) <br>
Style [manager](https://docs.qgis.org/3.40/en/docs/user_manual/style_library/style_manager.html) <br>
Symbology [properties](https://docs.qgis.org/3.40/en/docs/user_manual/working_with_vector/vector_properties.html#symbology-properties) <br>
Window - The Browser [panel](https://docs.qgis.org/3.40/en/docs/user_manual/introduction/browser.html#resources-that-can-be-opened-run-from-the-browser) <br>

Additional links <br>
Styles [QML&SLD](https://gtu.qgis.ge/GIS_SKA/Theory/QML_SLD/) <br>


### ⚙️ Processing Toolbox <br>

Tool - Package [layers](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/database.html#qgispackage) <br>




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
* We use the previous assignment, **Digitization [task](https://gtu.qgis.ge/GIS_SKA/Lab/Digitization/)**


* Inside it, create these subfolders:  
  - Geodatabase
  - Style  

``` mermaid
graph LR
  A[FirstName_LastName_GroupNumber_Assignment_Number] --> B{Project};
  A[FirstName_LastName_GroupNumber_Assignment_Number] --> C{Plugins};
  A[FirstName_LastName_GroupNumber_Assignment_Number] --> D{shp};
  A[FirstName_LastName_GroupNumber_Assignment_Number] --> E{Geodatabase};
  A[FirstName_LastName_GroupNumber_Assignment_Number] --> F{Style};
```

Connect QGIS to your main folder (from the Browser window).

---

=== "Step II: adding a geodatabase"

* Open the `"Chiatura_Digitalization_project.qgz"` file from the folder and save a copy named `"Geodatabase_project"`  
  Also save another `.qgs` file, `"Chiatura_Geodatabase_project.qgs"`  

* Create a new GeoPackage (with the .gpkg extension) in the Geodatabase folder.

* With the DB Manager, import the layers that are in the project into the database.

* Change the layers' sources (Change Data Source) from the shapefiles to the geodatabase feature classes.


* Use formulas to calculate the information <br>

For the ellipsoid <br>
* note that the formula is the part inside the brackets  <br>
( $x ) <br>
( $y ) <br>
( $length ) <br>
( $area ) <br> 
( $perimeter ) <br>

For UTM <br>
( length($geometry) ) <br>
( area($geometry) ) <br>
( perimeter($geometry) ) <br>
( x($geometry) ) <br>
( y($geometry) ) <br>

* Fill in additional information in the attribute table:

**For roads:** <br>
- Create a field `"name"` and enter values such as `"E117"` or `"S22"` for highways, or `"Shota Rustaveli Street"` for streets. <br>
- Create a field `"length_m"` — to calculate each feature's length in meters (UTM zone). <br>
- Create a field `"length_km"` — to calculate the length in kilometers (UTM zone). <br>

**For rivers:** <br>
- Create a field `"name"` — for example `"Mtiuleti Aragvi"` or `"Gudamakari Aragvi"`. If a river has no name, enter `"unnamed"`. <br>
- Create a field `"length_m"` — to calculate the length in meters (UTM zone). <br>
- Create a field `"length_km"` — to calculate the length in kilometers (UTM zone). <br>

**For bridges:** <br>
- Create a field `"type"` — where you enter the type of bridge: `"pedestrian"`, `"vehicle"`, or `"mixed"`. <br>

**For parcels:** <br>
- Create the owner data fields: `"name"`, `"surname"`, `"identity"`, `"personal_id"` <br>
- `"name"` — first name (String) <br>
- `"surname"` — surname (String) <br>
- `"identity"` — ID card/passport (String) <br>
- `"personal_id"` — personal number (Integer) <br>
- `"area_sqm"` — area in square meters (UTM zone) <br>
- `"area_sqkm"` — area in square kilometers (UTM zone) <br>
- `"periemter_m"` — perimeter in meters (UTM zone) <br>
- `"perimeter_km"` — perimeter in kilometers (UTM zone) <br>

**For restaurants, hotels and stadiums:** <br>
- Create a field `"name"` — and enter the name of the object. <br>

**Additional information** <br>

> **Note:** not every object type is described individually. <br>
> Process each layer according to its geometry type: <br>

- **Point features:**  <br>
  Add fields for the **X** and **Y** coordinates (in your projected system). <br>

- **Line features:**   <br>
  Add fields for calculating the length:
  - `"Length_m"` — length in meters (UTM zone) <br>
  - `"Length_km"` — length in kilometers (UTM zone) <br>

- **Polygon features:**   <br>
  Add fields for area and perimeter: <br>
  - `"Area_sqm"` — area in square meters (UTM zone) <br>
  - `"Area_ha"` — area in hectares <br>
  - `"Perimeter_m"` — perimeter in meters <br>

* If some data is not available for a particular object, leave the cell empty. <br>


=== "Stage III: symbology"

* Split each layer into categories by the `"name"` and `"attribute"` fields, or by whatever field you have.

* Add labels to each object, if you have entered the corresponding information.

* Save each layer's style in the designated `Style` folder.

* Compact the geodatabase with Compact Geodatabase.

* Click the Save button to save the project, and close it.


=== "Stage IV: checking and submitting"
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
