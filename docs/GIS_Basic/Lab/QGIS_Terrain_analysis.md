# რელიეფის ანალიზი

ვიდეო ჩანაწერებს ნახავ [აქ](https://gtu.qgis.ge/GIS_SKA/Videos/) <br>


### ⚙️ Processing Toolbox <br>

ხელსაწყო რასტრის გაერთიანება - [Merge](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/gdal/rastermiscellaneous.html#gdalmerge) <br>
ხელსაწყო იზოჰიფსები - [Contour](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/gdal/rasterextraction.html#gdalcontour) <br>
ხელსაწყო Clip raster by mask [layer](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/gdal/rasterextraction.html#gdalcliprasterbymasklayer)  <br>
ხელსაწყო TIN [Interpolation](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/interpolation.html#qgistininterpolation) <br>
ხელსაწყო Reclassify by [table](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/rasteranalysis.html#qgisreclassifybytable)  <br>
ხელსაწყო [Slope](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/rasterterrainanalysis.html#qgisslope) <br>
ხელსაწყო [Aspect](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/rasterterrainanalysis.html#qgisaspect) <br>
ხელსაწყო [Hillshade](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/rasterterrainanalysis.html#qgishillshade) <br>
ხელსაწყო Raster [Analysis](https://docs.qgis.org/3.40/en/docs/user_manual/working_with_raster/raster_analysis.html) <br>

### ოფიციალური დოკუმენტაცია <br>

3D Map [View](https://docs.qgis.org/3.40/en/docs/user_manual/map_views/3d_map_view.html) <br>


### დამატებითი ბმულები <br>

30-Meter SRTM [Tile](https://dwtkns.com/srtm30m/) <br>
Shuttle radar topography [mission](https://eospso.gsfc.nasa.gov/missions/shuttle-radar-topography-mission) <br>
NASA [Earthdata](https://urs.earthdata.nasa.gov/) <br>
მზის [ელ-სადგური](https://kapanadze.medium.com/%E1%83%9B%E1%83%96%E1%83%98%E1%83%A1-%E1%83%94%E1%83%9A-%E1%83%A1%E1%83%90%E1%83%93%E1%83%92%E1%83%A3%E1%83%A0%E1%83%98-564fcf10776f) <br>
ტოპოგრაფიული [რუკა](https://kapanadze.medium.com/%E1%83%9E%E1%83%98%E1%83%A0%E1%83%95%E1%83%94%E1%83%9A%E1%83%98-%E1%83%A1%E1%83%98%E1%83%A7%E1%83%95%E1%83%90%E1%83%A0%E1%83%A3%E1%83%9A%E1%83%98-ccbe373a05e0) <br>

გარკვეული მასალები ინახება გუგლის საკლასო [ოთახში](https://classroom.google.com/c/Nzg3MzAxMDU4MzEy/m/Nzg3NTk5MzU2OTYw/details) ⚠️ <br>

---
## დავალების ინსტრუქციები

⚠️ **სამუშაო გარემო**

უნივერსიტეტის კომპიუტერებზე იმუშავეთ შემდეგ საქაღალდეში:  
`C:\Users\Public\` ან `C:\Users\Public\Documents`  
*(რეკომენდებულია პირად კომპიუტერებზეც, რადგან პროგრამას სხვა ადგილას არსებული ფაილების დამუშავება შესაძლოა გაუჭირდეს.)*

📦 **საჭირო პროგრამები**

* QGIS – აუცილებელია ✅  
* Google Earth – სურვილისამებრ (დავალების მიხედვით) ✅  

---

!!!warning
    დასრულებული მასალა არ წაშალოთ სემესტრის ბოლომდე.
    
---

!!!danger 
    **ფაილების დასახელების წესები**

    ❌ **არასწორი:**  

    Giorgi Kapanadze.Group/1$ work1  

    ❌ არ გამოიყენოთ:

    - ქართული ასოები (ა, ბ, გ, დ და სხვ.)  
    - სპეციალური სიმბოლოები (გარდა ხაზგასმისა `_`)

    ✅ **სწორი:**  

    Giorgi_Kapanadze_Group_1_work_1  

!!!tip
    გამოიყენეთ მხოლოდ ლათინური ასოები, ციფრები და ხაზგასმა (`_`) შემდეგ შემთხვევებში:  
    არქივის სახელები, საქაღალდეებისა და ფაილების სახელები, ცხრილის სვეტების სახელები.

---

## 📘 ეტაპობრივი სახელმძღვანელო

!!!note
    მონაცემების ჩამოსატვირთად და დავალების ასატვირთად საჭიროა ავტორიზაცია გუგლის საკლასო ოთახზე
     : [classroom.google.com](https://classroom.google.com/)

=== "I ეტაპი: საქაღალდის ორგანიზება"
* ვიყენებთ წინა დავალებას **მონიშვნები [task](https://gtu.qgis.ge/GIS_SKA/Lab/Selection/)**



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

დააკავშირეთ QGIS (Browser ფანჯრიდან) თქვენს მთავარ საქაღალდესთან.

---

=== "ნაბიჯი II: რასტრის დამუშავება"

* გახსენით `"Chiatura_topology.qgz"` ფაილი საქაღალდიდან და შეინახეთ ასლი სახელით `"terrain"`  
  დამატებით შეინახეთ სხვა `.qgs` ფაილი `"Chiatura_terrain.qgs"`   <br>
* ჩამოიწერეთ [საიტიდან](https://dwtkns.com/srtm30m/) რელიეფის 2 რომელიმე ნაწილი და გააერთიანეთ.   <br>
* მოჭერით რელიეფი მუნიციპალიტეტის საზღვრებით.  <br>
* ამოიღეთ იზოჰიფსები ამ რელიეფიდან სხვადასხვა რაოდენობით. **100 მეტრის ინტერვალით** (`Contour interval`) და **100 მეტრის საწყისი მნიშვნელობით** (`Base contour`) <br>
* ამავე იზოჰიფსებით შექმენით რელიეფი შესაბამისი პიქსელის ზომით. <br>
* დაყავით რელიეფი წინასწარ განსაზღვრულ კლასებად. <br>
* შექმენით ფერბობების დახრილობა, რელიეფის ჩრდილი, ჰორიზონტის მიმართულებები. <br>
* რასტრის კალკულატორის დახმარებით გამოყავით რასტრიდან კონკრეტული სიმაღლე ან დახრილობა.  <br>
* შექმენით რელიეფისგან 3D მოდელი. <br>



=== "ეტაპი III: შემოწმება და გაგზავნა"
* გააკეთეთ არქივი თქვენს საქაღალდეზე. 💾
* გამოიყენეთ `.rar` ან `.zip` ფორმატები.
* დაარქვით არქივს შემდეგი ფორმატით:  
  `FirstName_LastName_GroupNumber_Assignment_Number`

* ატვირტეთ გუგლის საკლასო ოთახში ნამუშევარი

---

!!!warning
    თუ გაგზავნის პროცესში შეგექმნათ რაიმე პრობლემა, დაგვიკავშირდით:  
    g.kapanadze1908@gmail.com  
    ან გამოიყენეთ ნებისმიერი ფაილგადაცემის სერვისი. <br>

    https://www.swisstransfer.com/en-gb

    https://wetransfer.com/

    https://www.filemail.com/

    https://dropmefiles.com/

    https://www.swisstransfer.com/en-gb

    https://www.sendgb.com/

    https://workupload.com/ 

!!!info
    📌 თუ რაიმე გაუგებარია, თამამად იკითხე! 😊  
    თუ რამე არასწორადაა შესრულებული, გავასწორებ — ან თავად შექმენი pull request. 