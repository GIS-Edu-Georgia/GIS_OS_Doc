# OGC WEB სერვისები

ვიდეო ჩანაწერებს ნახავ [აქ](https://gtu.qgis.ge/GIS_SKA/Videos/) <br>


### ⚙️ Processing Toolbox <br>

ხელსაწყო Basic [fields](https:) <br>


### ოფიციალური დოკუმენტაცია <br>
ფანჯარა - Working with OGC / ISO [protocols](https://docs.qgis.org/3.40/en/docs/user_manual/working_with_ogc/ogc_client_support.html) <br>
GeoServer [documentation](https://docs.geoserver.org/) <br>
QGIS Server [Guide](https://docs.qgis.org/3.40/en/docs/server_manual/getting_started.html#prepare-a-project-to-serve) <br>
GeoNode [დოკუმენტაცია](https://docs.geonode.org/en/master/) <br>
GeoNetwork [დოკუმენტაცია](https://www.geonetwork-opensource.org/docs.html) <br>
Sentinel Hub - OGC [service](https://docs.sentinel-hub.com/api/latest/api/ogc/) <br>

### დამატებითი ბმულები <br>
OGC - [კონსორციუმი](https://www.ogc.org/) <br>
GeoNode - Open Source Geospatial Content Management [System](https://geonode.org/) <br>
GeoNetwork is a catalog application to manage spatially referenced [resources](https://www.geonetwork-opensource.org/) <br>
ეროვნული სივრცითი მონაცემების ინფრასტრუქტურა [NSDI](https://nsdi.gov.ge/ka) <br>
პროგრამული [უზრუნველყოფა](https://gtu.qgis.ge/GIS_SKA/Software/Geoserver/) <br>
Windows Environment და GeoServer-ის [კონფიგურაცია](https://gtu.qgis.ge/GIS_SKA/Theory/Win_ENV/) <br>
Save Vector [Layer As](https://gtu.qgis.ge/GIS_SKA/Theory/Save_vector_layer/#vector-formats-available-in-qgis) <br>
QGIS SLD [ფორმატი](https://gtu.qgis.ge/GIS_SKA/Theory/QML_SLD/) <br>
OGC [WEB](https://gtu.qgis.ge/GIS_SKA/Theory/WEB_Services/) <br>
NAPR GeoNetwork [catalogue](https://geonetwork.napr.gov.ge/geonetwork/srv/geo/catalog.search#/home) <br>
[GeoNode](https://gtu.qgis.ge/GIS_SKA/Theory/GeoNode/) <br>
[GeoNetwork](https://gtu.qgis.ge/GIS_SKA/Theory/GeoNetwork/) <br>



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
* Geoserver – აუცილებელია ✅  

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
* ვიყენებთ წინა დავალებას **მონიშვნები  [task](https://gtu.qgis.ge/GIS_SKA/Lab/Selection/)**



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

დააკავშირეთ QGIS (Browser ფანჯრიდან) თქვენს მთავარ საქაღალდესთან.

---

=== "ნაბიჯი II: სერვისების აწყობა"

* გახსენით `"Chiatura_selection.qgz"` ფაილი საქაღალდიდან და შეინახეთ ასლი სახელით `"Geoserver_project"`  
  დამატებით შეინახეთ სხვა `.qgs` ფაილი `"Chiatura_Geoserver_project.qgs"`   <br>
* გამოიყენეთ თქვენი გაცოცხლებული მასალა წინა დავალების ან ჩამოტვირთეთ და დაამუშავეთ OSM მონაცემები იმავე მუნიციპალიტეტზე. <br>
* ააწყვეთ საბაზისო პროექტი Geoserver - ში და გამოაქვეყნეთ რამდენიმე შრე სერვისებად. <br>
* შრის სტილი SLD ფორმატში QGIS პროექტიდან შეინახეთ დამატებით სერვერზე ასატვირთად, გამოიყენეთ შრის გამოქვეყნებისას სერვისზე. <br>
* შემოიტანეთ თქვენს მიერ აწყობილი WMS, WFS სერვისები QGIS პროეტში გასატესტად.
* ესტუმრეთ NAPR - ის ოფიციალურ [კატალოგს](https://geonetwork.napr.gov.ge/geonetwork/srv/geo/catalog.search#/home), მოძებნეთ სასურველი სივრცითი მასალა და სერვისის სახით შემოიტანეთ თქვენს პროექტში გასატესტად. <br>
* დარეგისტრირდით [GeoNode - ზე](https://stable.demo.geonode.org/#/), ატვირთეთ თქვენი რომელიმე შრე, სერვისის ბმული დააკოპირეთ "Copy OGC WEB Services URL" და შემოიტანეთ QGIS პროექტში WMS ან WFS გასატესტად. <br>
* სხვა შემთხვევაში დაათვალიერეთ Datasets [კატალოგი](https://stable.demo.geonode.org/catalogue/#/datasets), აირჩიეთ ნებისმიერი თქვენთვის სასურველი მონაცემი და გაიმეორეთ იგივე პროცესი, შაბლონად ვარდი შეგიძლიათ [გამოიყენოთ](https://stable.demo.geonode.org/catalogue/uuid/2f6c18f7-d11b-4fd0-9914-29ddac5c01fc0) <br>
* ასევე შესაძლებელია მთლიანად GeoNode - ის Geoserver - ზე განთავსებული მასალა წამოიღოთ მოთხოვნით QGIS - ში https://stable.demo.geonode.org/geoserver/ows <br>






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