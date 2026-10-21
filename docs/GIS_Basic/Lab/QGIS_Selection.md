# მონიშვნები | ექსპორტი | სტატისტიკა | მეტამონაცემები

ვიდეო ჩანაწერებს ნახავ [აქ](https://gtu.qgis.ge/GIS_SKA/Videos/) <br>


### ⚙️ Processing Toolbox <br>

ხელსაწყო Basic statistics for [fields](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/vectoranalysis.html#qgisbasicstatisticsforfields) <br>
ხელსაწყო Package [layers](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/database.html#qgispackage) <br>
დოკუმენტაცია Vector [selection](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/vectorselection.html) <br>

### ოფიციალური დოკუმენტაცია <br>
ფანჯარა - The Browser [panel](https://docs.qgis.org/3.40/en/docs/user_manual/introduction/browser.html#resources-that-can-be-opened-run-from-the-browser) <br>
ფანჯარა - Bookmarking extents on the [map](https://docs.qgis.org/3.40/en/docs/user_manual/map_views/map_view.html#bookmarking-extents-on-the-map) <br>
ფანჯარა - [Metadata](https://docs.qgis.org/3.40/en/docs/user_manual/introduction/general_tools.html#metadata) <br>



### დამატებითი ბმულები <br>
თეორია - ვექტორული შრის [შენახვა](https://gtu.qgis.ge/GIS_SKA/Theory/Save_vector_layer/) <br>
მასალა [OSM](https://download.geofabrik.de/europe/georgia.html) <br>
ეროვნული სივრცითი მონაცემების ინფრასტრუქტურა [NSDI](https://nsdi.gov.ge/ka) <br>
საქართველოს კანონი ეროვნული სივრცითი მონაცემების ინფრასტრუქტურის [შესახებ](https://www.napr.gov.ge/uploads/Laws/13/638245c432a7a8aaf58118487d569635be3ccafd.pdf) <br>
OGC - [კონსორციუმი](https://www.ogc.org/) <br>





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
* ვიყენებთ წინა დავალებას **დიგიტალიზაცია 1 [task](https://gtu.qgis.ge/GIS_SKA/Lab/Digitization1/)**



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

დააკავშირეთ QGIS (Browser ფანჯრიდან) თქვენს მთავარ საქაღალდესთან.

---

=== "ნაბიჯი II: გეოდამუშავების სხვადასხვა ხელსაწყოები"

* გახსენით `"Chiatura_Digitalization_digitalizacia1.qgz"` ფაილი საქაღალდიდან და შეინახეთ ასლი სახელით `"Geodatabase_project"`  
  დამატებით შეინახეთ სხვა `.qgs` ფაილი `"Chiatura_Geodatabase_selections.qgs"`   <br>
* გამოიყენეთ თქვენი გაცოცხლებული მასალა წინა დავალების ან ჩამოტვირთეთ და დაამუშავეთ OSM მონაცემები იმავე მუნიციპალიტეტზე. <br>
* ატრიბუტული ცხრილის ფილტრაციის დახმარებით მონიშნეთ კატეგორიების, ცხრილში არსებული სხვა მახასიათებლის მიხედვით სხვადასხვა ობიექტები. ასევე 
გამოხატვის საშუალებით გამოიყენეთ SQL მოთხოვნის ენა და მისი ელემენტები. | <br>
* გამოიეყენეთ ინტერაქტიული მონიშვნის ელემენტები. | <br>
* სივრცითი მონიშვნის დახმარებით შეარჩიეთ სხვადასხვა ობიექტები. | <br>
* გამოიყენეთ მონიშვნის ისარი და მისი პარამეტრები, შერჩევის შებრუნება, ყველაფრის შერჩევა, განიშვნა და ა.შ | <br>
* > ყველა ჯერზე შერჩეული ობიექტები გაიტანეთ ექსპორტზე სხვადასხვა ვექტორულ ფორმატში: GeoPackage, ESRI Shapefile, GeoJSON, KML, DXF, CSV, GML და ა.შ <br>
* შექმენით სივრცული სანიშნეები და შეინახეთ ექსპორტით. <br>
* რომელიმე სივრცულ შრეზე შექმენით მეტამონაცემები და შეინახეთ ექსპორტით. <br>



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