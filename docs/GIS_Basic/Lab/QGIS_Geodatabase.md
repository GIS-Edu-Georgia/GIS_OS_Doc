# გეომონაცემთა ბაზები

ვიდეო ჩანაწერებს ნახავ [აქ](https://gtu.qgis.ge/GIS_SKA/Videos/) <br>

ოფიციალური დოკუმენტაცია <br>

ფანჯარა -  DB Manager [Plugin](https://docs.qgis.org/3.40/en/docs/user_manual/plugins/core_plugins/plugins_db_manager.html#index-0) <br>
ატრიბუტული [ცხრილი](https://docs.qgis.org/3.40/en/docs/user_manual/working_with_vector/attribute_table.html#index-0) <br>
ველის [კალკულატორი](https://docs.qgis.org/3.40/en/docs/user_manual/working_with_vector/attribute_table.html#index-6) <br>
სტილების [მენეჯერი](https://docs.qgis.org/3.40/en/docs/user_manual/style_library/style_manager.html) <br>
სიმბოლიზირების [პარამეტრები](https://docs.qgis.org/3.40/en/docs/user_manual/working_with_vector/vector_properties.html#symbology-properties) <br>
ფანჯარა - The Browser [panel](https://docs.qgis.org/3.40/en/docs/user_manual/introduction/browser.html#resources-that-can-be-opened-run-from-the-browser) <br>

დამატებითი ბმულები <br>
სტილები [QML&SLD](https://gtu.qgis.ge/GIS_SKA/Theory/QML_SLD/) <br>


### ⚙️ Processing Toolbox <br>

ხელსაწყო - Package [layers](https://docs.qgis.org/3.40/en/docs/user_manual/processing_algs/qgis/database.html#qgispackage) <br>




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
* ვიყენებთ წინა დავალებას **დიგიტალიზაცია [task](https://gtu.qgis.ge/GIS_SKA/Lab/Digitization/)**


* მის შიგნით შექმენით შემდეგი ქვე-საქაღალდეები:  
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

დააკავშირეთ QGIS (Browser ფანჯრიდან) თქვენს მთავარ საქაღალდესთან.

---

=== "ნაბიჯი II: გეომონაცემთა ბაზის დამატება"

* გახსენით `"Chiatura_Digitalization_project.qgz"` ფაილი საქაღალდიდან და შეინახეთ ასლი სახელით `"Geodatabase_project"`  
  დამატებით შეინახეთ სხვა `.qgs` ფაილი `"Chiatura_Geodatabase_project.qgs"`  

* შექმენით ახალი GeoPackage (.gpkg გაფართოებით) Geodatabase საქაღალდეში.

* DB manager - ის დახმარებით იმპორტზე უნდა შემოიტანოთ პროექტში არსებული შრეები ბაზაში.

* შეცვალეთ შრეების Source-ები (Change data Source) shapefile-დან Geodatabase-ის feature class-ებზე.


* გამოიყენეთ ფორმულები ინფორმაციის დასათვლელად <br>

ელიფსოიდისთვის <br>
* გაითვალისწინე ფორმულა განთავსებულია ფრჩხილებს შიგნით  <br>
( $x ) <br>
( $y ) <br>
( $length ) <br>
( $area ) <br> 
( $perimeter ) <br>

UTM - ისთვის <br>
( length($geometry) ) <br>
( area($geometry) ) <br>
( perimeter($geometry) ) <br>
( x($geometry) ) <br>
( y($geometry) ) <br>

* ატრიბუტულ ცხრილში შეავსეთ დამატებითი ინფორმაცია:

**გზებისთვის:** <br>
- შექმენით ველი `"name"`, სადაც შეიყვანეთ მნიშვნელობები, როგორიცაა `"E117"` ან `"S22"` ტრასებისთვის, ან `"Shota Rustaveli Street"` ქუჩებისთვის. <br>
- შექმენით ველი `"length_m"` — თითოეული ობიექტის სიგრძის გამოთვლისთვის მეტრებში (UTM ზონა). <br>
- შექმენით ველი `"length_km"` — სიგრძის გამოთვლისთვის კილომეტრებში (UTM ზონა). <br>

**მდინარეებისთვის:** <br>
- შექმენით ველი `"name"` — მაგალითად `"მთიულეთის არაგვი"` ან `"გუდამაყრის არაგვი"`. თუ მდინარეს სახელი არ აქვს, მიუთითეთ `"უსახელო"`. <br>
- შექმენით ველი `"length_m"` — სიგრძის მეტრებში გამოსათვლელად (UTM ზონა). <br>
- შექმენით ველი `"length_km"` — სიგრძის კილომეტრებში გამოსათვლელად (UTM ზონა). <br>

**ხიდებისთვის:** <br>
- შექმენით ველი `"type"` — სადაც მიუთითებთ ხიდის ტიპს: `"ქვეითი"`, `"ტრანსპორტის"`, ან `"შერეული"`. <br>

**ნაკვეთისთვის (parcels):** <br>
- შექმენით მფლობელის მონაცემების ველები: `"name"`, `"surname"`, `"identity"`, `"personal_id"` <br>
- `"name"` — სახელი (String) <br>
- `"surname"` — სახელი (String) <br>
- `"identity"` — პირადობა/პასპორტი (String) <br>
- `"personal_id"` — პირადი ნომერი (Integer) <br>
- `"area_sqm"` — ფართობი კვ. მეტრებში (UTM ზონა) <br>
- `"area_sqkm"` — ფართობი კვ. კილომეტრებში (UTM ზონა) <br>
- `"periemter_m"` — პერიმეტრი მეტრებში (UTM ზონა) <br>
- `"perimeter_km"` — პერიმეტრი კილომეტრებში (UTM ზონა) <br>

**რესტორნებისთვის, სასტუმროებისთვის და სტადიონებისთვის:** <br>
- შექმენით ველი `"name"` — და მიუთითეთ შესაბამისი ობიექტის სახელი. <br>

**დამატებითი ინფორმაცია** <br>

> **შენიშვნა:** ყველა ობიექტის ტიპის ინდივიდუალური აღწერა მოცემული არაა. <br>
> დაამუშავეთ თითოეული შრე მისი გეომეტრიის ტიპის შესაბამისად: <br>

- **წერტილოვანი ობიექტები (Point features):**  <br>
  დაამატეთ ველები **X** და **Y** კოორდინატებისთვის (თქვენს პროექცირებულ სისტემაში). <br>

- **ხაზოვანი ობიექტები (Line features):**   <br>
  დაამატეთ ველები სიგრძის გამოსათვლელად:
  - `"Length_m"` — სიგრძე მეტრებში (UTM ზონა) <br>
  - `"Length_km"` — სიგრძე კილომეტრებში (UTM ზონა) <br>

- **პოლიგონური ობიექტები (Polygon features):**   <br>
  დაამატეთ ველები ფართობისა და პერიმეტრისთვის: <br>
  - `"Area_sqm"` — ფართობი კვ. მეტრებში (UTM ზონა) <br>
  - `"Area_ha"` — ფართობი ჰექტარებში <br>
  - `"Perimeter_m"` — პერიმეტრი მეტრებში <br>

* თუ რომელიმე მონაცემი კონკრეტული ობიექტისთვის მიუწვდომელია, დატოვეთ უჯრა ცარიელი. * <br>


=== "ეტაპი III: სიმბოლიზაცია"

* თითოეული შრე დაყავით კატეგორიებად `"name"` და `"attribute"` ველების მიხედვით, ან იმ ველის მიხედვით რაც გაქვთ.

* მიუთითეთ შესაბამისი ლეიბლები (labels) თითოეულ ობიექტზე, თუ გაქვთ შესაბამისი ინფორმაცია შეტანილი.

* თითოეული შრის სტილი შეინახეთ მითითებულ `Style` საქაღალდეში.

* Compact Geodatabase-ს გამოყენებით შეკუმშეთ გეომონაცემთაბაზა.

* დააწკაპუნეთ Save ღილაკზე პროექტის შესანახად და დახურეთ.


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