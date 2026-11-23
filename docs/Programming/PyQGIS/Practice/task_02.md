# 📝 დავალება 2

**საჭირო თემები:** [ატრიბუტული მონიშვნები](../PyQGIS_topics/PyQGIS_SQL_Spatial_Selection.md), [სივრცითი მონიშვნები](../PyQGIS_topics/PyQGIS_Spatial_Selection.md), [წაშლა](../PyQGIS_topics/PyQGIS_Obj_delete.md), [ვექტორის გეოდამუშავება](../PyQGIS_topics/PyQGIS_Vector_Processing.md)

**მონაცემები:** `sample_data/practice/osm/` (`gis_osm_places_free_1`, `gis_osm_adminareas_a_free_1`; OpenStreetMap, EPSG:4326). ყველა OSM შრე ერთ არქივად: [`OSM_shp_PyQGIS.zip`](https://github.com/GIS-Edu-Georgia/GIS_OS_Doc/releases/download/osm-data-v1/OSM_shp_PyQGIS.zip)

აქ და შემდეგ ამოხსნებში გამოიყენება [ზოგადი დამხმარე კოდი](index.md#ამოხსნები).

!!! danger "სავალდებულოა: იმუშავეთ ასლზე"
    ობიექტების წაშლა ხდება **პირდაპირ ფაილში**. სანამ დაიწყებთ, დააკოპირეთ შრეები (`.shp`, `.shx`, `.dbf`, `.prj`, `.cpg`) თქვენს `shp` საქაღალდეში და მუშაობა მხოლოდ ასლზე აწარმოეთ.

---

1. `gis_osm_places_free_1`-დან მონიშნეთ ობიექტი, რომლის `population` არის **1331**, და გაიტანეთ `shp`-ში.
2. `gis_osm_places_free_1`-დან **ამავე შრიდან** წაშალეთ ობიექტები, სადაც `osm_id` მეტია **1014750524**-ზე და ნაკლებია **10926200653**-ზე.
3. შემოიტანეთ `gis_osm_adminareas_a_free_1` და მონიშნეთ მუნიციპალიტეტი **"ჭიათურის მუნიციპალიტეტი"** (`name` სვეტით, `fclass = admin_level6`). `gis_osm_places_free_1`-დან მონიშნეთ ის ობიექტები, რომლებიც ამ მუნიციპალიტეტში ხვდება, მოჭერით და შეინახეთ `gis_osm_places_free_1_Chiatura` სახელით `shp` საქაღალდეში.

??? success "ამოხსნა 1.1"
    ```python
    places = QgsVectorLayer(base + '/shp/gis_osm_places_free_1.shp', 'places', 'ogr')
    QgsProject.instance().addMapLayer(places)

    places.selectByExpression('"population" = 1331')
    print(places.selectedFeatureCount())          # 1
    processing.run('native:saveselectedfeatures',
        {'INPUT': places, 'OUTPUT': base + '/shp/places_pop_1331.shp'})
    places.removeSelection()
    ```

??? success "ამოხსნა 1.2"
    ```python
    places.selectByExpression(
        'to_int("osm_id") > 1014750524 AND to_int("osm_id") < 10926200653')
    print(places.selectedFeatureCount(), 'წასაშლელი')

    places.startEditing()
    places.deleteSelectedFeatures()
    places.commitChanges()
    print(places.featureCount(), 'დარჩა')
    ```
    > `osm_id` ტექსტური (String) ველია. გამოსახულებაში `"osm_id" > 1014750524` ტექსტურად შეადარებდა და არასწორ შედეგს მოგცემდათ, ამიტომ საჭიროა `to_int("osm_id")`.

    **მოსალოდნელი შედეგი:** 5263 ობიექტიდან წაიშლება 1190 (დარჩება 4073).

??? success "ამოხსნა 1.3"
    ```python
    adm = QgsVectorLayer(base + '/shp/gis_osm_adminareas_a_free_1.shp', 'adminareas', 'ogr')
    QgsProject.instance().addMapLayer(adm)
    adm.selectByExpression(
        '"fclass" = \'admin_level6\' AND "name" = \'ჭიათურის მუნიციპალიტეტი\'')
    print(adm.selectedFeatureCount())                 # 1

    # places-ის ის ობიექტები, რომლებიც მონიშნულ მუნიციპალიტეტში ხვდება
    processing.run('native:selectbylocation', {
        'INPUT': places, 'PREDICATE': [0],           # 0 = intersects
        'INTERSECT': QgsProcessingFeatureSourceDefinition(adm.id(), True),
        'METHOD': 0})
    print(places.selectedFeatureCount())              # 106

    # მოჭრა: მხოლოდ მონიშნული ობიექტები მონიშნული მუნიციპალიტეტით
    processing.run('native:clip', {
        'INPUT': QgsProcessingFeatureSourceDefinition(places.id(), True),
        'OVERLAY': QgsProcessingFeatureSourceDefinition(adm.id(), True),
        'OUTPUT': base + '/shp/gis_osm_places_free_1_Chiatura.shp'})
    ```
    > `QgsProcessingFeatureSourceDefinition(layer.id(), True)` ნიშნავს „მხოლოდ მონიშნული ობიექტები". თუ შრეს პირდაპირ გადასცემთ, ალგორითმი **ყველა** ობიექტს გამოიყენებს. ამიტომ შრეები ჯერ პროექტში უნდა დაემატოს (`addMapLayer`).

        > მხოლოდ `"name" = 'ჭიათურა'` ქალაქის პოლიგონს (`admin_level8`) აირჩევდა და არა მუნიციპალიტეტს, ამიტომ `fclass`-იც სავალდებულოა.

    **მოსალოდნელი შედეგი:** `gis_osm_places_free_1_Chiatura` – 106 წერტილი (ჭიათურა, ხუნევი, რგანი და სხვა).
