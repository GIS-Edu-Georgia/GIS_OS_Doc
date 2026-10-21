# WEB-GIS

ვიდეო ჩანაწერებს ნახავ [აქ](https://gtu.qgis.ge/GIS_SKA/Videos/) <br>


### ⚙️ Processing Toolbox <br>

ხელსაწყო Basic [fields](https:) <br>


### ოფიციალური დოკუმენტაცია <br>
დანამატი  - [qgis2web](https://github.com/qgis2web/qgis2web) <br>
დანამატი - [Qgis2threejs](https://github.com/minorua/Qgis2threejs) <br>
JSON [Wikipedia](https://en.wikipedia.org/wiki/JSON) <br>

### დამატებითი ბმულები <br>
Google My[Maps](https://www.google.com/maps) <br>
შაბლონი ცხელძაღლური [რუკა](https://www.google.com/maps/d/u/3/edit?hl=ka&mid=176BVE02xYafhr-6qezCRy4sHJs76xZyf&ll=42.51875523468736%2C42.56166703834641&z=7)  <br>
შაბლონი თხევადი [გაზი](https://www.google.com/maps/d/u/3/edit?hl=ka&mid=1y3jZwVgz0WEYQWvZjlNysLex4eLLSrw&ll=42.17127030085311%2C43.86809699999997&z=9) <br>
შაბლონი Georgia's Recycling [Map](https://www.google.com/maps/d/u/3/viewer?hl=ka&mid=18VONz4zIlS6VgcDRIAX6odQ8YGBjUQdz&ll=42.00871348204378%2C43.53747129999999&z=8) <br>
𝐊𝐌𝐋 / 𝐊𝐌𝐙 – სივრცითი მონაცემების გაცვლის [ფორმატი](https://gtu.qgis.ge/GIS_SKA/Theory/Google/Google_formats/) <br>
მუნიციპალური სერვისების განვითარების [სააგენტო](https://ms.gov.ge/msmap/) <br>


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
* ვიყენებთ წინა დავალებას **OGC WEB  [task](https://gtu.qgis.ge/GIS_SKA/Lab/OGC_WEB/)**



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

დააკავშირეთ QGIS (Browser ფანჯრიდან) თქვენს მთავარ საქაღალდესთან.

---

=== "ნაბიჯი II: სერვისების აწყობა"

* გახსენით `"Chiatura_Geoserver_project.qgz"` ფაილი საქაღალდიდან და შეინახეთ ასლი სახელით `"web_gis"`  
  დამატებით შეინახეთ სხვა `.qgs` ფაილი `"Chiatura_web_gis.qgs"`   <br>

* ატვირთეთ თქვენი მასალა და შეადგინეთ რუკა გუგლის პლატფორმაზე, სიმბოლოები, ფორმირება, ფერები, სისქე, სურათები, აღწერა, შრეები და ა.შ მოსაწესრიგებელია თქვენი გემოვნებით. გაზიარებადი ბმული აიღეთ საჯარო ფორმის.
* QGIS პროექტიდან დანამატის qgis2web დახმარებით შეადგინეთ ვებ რუკა, შეინახეთ თქვენს აწყობილ პროექტში შესაბამის საქაღალდეში და არქივად გააზიარეთ.
* შემდეგ დარეგისტრირდით Github - ზე, შექმენით ახალი რეპოზიტორია, ატვირთეთ ფაილები, გააქტიურეთ Github Pages და აიღეთ გასაზიარებლად მისი ბმული. 




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