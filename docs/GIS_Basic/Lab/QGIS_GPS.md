# გლობალური პოზიციონირების სისტემები

ვიდეო ჩანაწერებს ნახავ [აქ](https://gtu.qgis.ge/GIS_SKA/Videos/) <br>

ოფიციალური დოკუმენტაცია <br>

დროებითი შრე - Creating a new Temporary Scratch [Layer](https://docs.qgis.org/3.40/en/docs/user_manual/managing_data_source/create_layers.html#creating-a-new-temporary-scratch-layer) <br>
ფანჯარა - The Browser [panel](https://docs.qgis.org/3.40/en/docs/user_manual/introduction/browser.html#resources-that-can-be-opened-run-from-the-browser) <br>

### ⚙️ Processing Toolbox <br>

ხელსაწყო [Import geotagged photos](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/vectorcreation.html#import-geotagged-photos) <br>
ხელსაწყო [Add geometry attributes](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/vectorgeometry.html#qgisexportaddgeometrycolumns) <br>
ხელსაწყო [Reproject layer](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/vectorgeneral.html#qgisreprojectlayer) <br>

დამატებითი ბმულები <br>
SVG [მარკერები](https://www.svgrepo.com/) <br>
ვექტორული შრის [შენახვა](https://gtu.qgis.ge/GIS_SKA/Theory/Save_vector_layer/) <br>
დროებითი შრე - Creating a new Temporary Scratch [Layer](https://gtu.qgis.ge/GIS_SKA/Theory/Scratch_layer/) <br>
სტილები [QML&SLD](https://gtu.qgis.ge/GIS_SKA/Theory/QML_SLD/) <br>

დანამატები - Plugins <br>
დანამატი [ImportPhotos](https://plugins.qgis.org/plugins/ImportPhotos/) <br>

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
* ვიყენებთ წინა დავალებას **გეომონაცემთა ბაზები [task](https://gtu.qgis.ge/GIS_SKA/Lab/Geodatabase/)**



* მის შიგნით შექმენით შემდეგი ქვე-საქაღალდეები: <br>
    - archive
    - GPS_coordinates 
    - Fonts
    - GeoTaggedphoto 

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

```

დააკავშირეთ QGIS (Browser ფანჯრიდან) თქვენს მთავარ საქაღალდესთან.

---


=== "ნაბიჯი II: პრაქტიკული ამოცანების შესრულება"

* გახსენით `"Chiatura_Geodatabase_project.qgz"` ფაილი საქაღალდიდან და შეინახეთ ასლი სახელით `"Chiatura_GPS_project.qgz"` და დამატებით შეინახეთ სხვა `.qgs` ფაილი `"Chiatura_GPS_project.qgs"`
* ფონტები, ინსტალაცია, მათი მნიშვნელობა, გამოყენება წარწერებზე.
* GPS კოორდინატები მასალიდან დააკონვერტირეთ შესაბამის ფორმატში, შემოიტანეთ პროგრამაში დასვით შესაბამის საკოორდინატო სისტემაში,
შეინახეთ ექსპორტზე თითოეული მათგანი როგორც shapefile, ან გეომონაცემთა ბაზის Feature class. <br>
* შემოიტანეთ კოორდინატებიანი ფოტოსურათები (Geotaggedphotos) როგორც shapefile, ან როგორც გეომონაცემთა ბაზის Feature class. <br>
* გარდაქმენით ფოტოების შრე PT Assign projection ელიფსოიდიდან UTM ზონაში და გამოთვალეთ XY კოორდინატები Add geometry attributes შრის ცხრილში. <br>
* აიღეთ ფოტო კოორდინატების გარეშე და დამატებითი ხელსაწყოების დახმარებით მიანიჭეთ ადგილმდებარეობა [geoimgr](https://tool.geoimgr.com/), [GEOSETTER](https://geosetter.de/en/main-en/). <br>
* SVG მარკერები, ჩამოწერა თავისუფალი წვდომით, შენახვა და გამოყენება წერტილოვან გეომეტრიაზე ხატულად. <br>
* შეინახე შრის სტილი როგორც QGIS qml ფორმატში ასევე SLD ფაილად. <br>
* შეინახეთ პროექტის ფაილი სახელით `"Chiatura_GPS_project.qgz"`. ასევე შეინახეთ  `"Chiatura_GPS_project.qgs"` ფორმატში. <br>



---

=== "ეტაპი IV: შემოწმება და გაგზავნა"
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







