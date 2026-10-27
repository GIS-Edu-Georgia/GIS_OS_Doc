# 📝 დავალება 1

**საჭირო თემები:** [შრის შექმნა](../PyQGIS_topics/PyQGIS_Create_layer.md), [წაშლა](../PyQGIS_topics/PyQGIS_Obj_delete.md), [გაანგარიშებები ცხრილში](../PyQGIS_topics/PyQGIS_Calc_Attrib_Expressions.md), [ვექტორის გეოდამუშავება](../PyQGIS_topics/PyQGIS_Vector_Processing.md)

**მონაცემები:** `sample_data/practice/task_01/` (`gis_osm_places_free_1`, `gis_osm_protected_areas_a_free_1`; OpenStreetMap, EPSG:4326). ყველა OSM შრე ერთ არქივად: [`OSM_shp_PyQGIS.zip`](https://github.com/GIS-Edu-Georgia/GIS_OS_Doc/releases/download/osm-data-v1/OSM_shp_PyQGIS.zip) (7 შრე, 7 MB)

აქ და შემდეგ ამოხსნებში გამოიყენება [ზოგადი დამხმარე კოდი](index.md#ამოხსნები).

!!! danger "სავალდებულოა: იმუშავეთ ასლზე"
    ველების წაშლა, გამოთვლა და ობიექტების წაშლა ხდება **პირდაპირ ფაილში**. სანამ დაიწყებთ, დააკოპირეთ ორივე შრე (`.shp`, `.shx`, `.dbf`, `.prj`, `.cpg`) თქვენს `shp` საქაღალდეში და მუშაობა მხოლოდ ასლზე აწარმოეთ.

---

## ნაწილი 1 (საქაღალდე: `part_1`)

1. შექმენით ხაზოვანი შრე `regline_layer`, CRS **EPSG:32637**, და შეინახეთ `shp` საქაღალდეში.
2. ჩატვირთეთ `gis_osm_places_free_1` და წაშალეთ სვეტები `osm_id`, `code`, `fclass`.
3. **ამავე შრეზე** გამოთვალეთ XY კოორდინატები.
4. იპოვეთ დუბლირებული წერტილები და წაშალეთ **ამავე შრიდან**.

??? success "ამოხსნა 1.1"
    ```python
    layer = QgsVectorLayer('LineString?crs=EPSG:32637', 'regline_layer', 'memory')
    save_shp(layer, base + '/shp/regline_layer.shp')
    ```

??? success "ამოხსნა 1.2"
    ```python
    places = QgsVectorLayer(base + '/shp/gis_osm_places_free_1.shp', 'places', 'ogr')
    idx = [places.fields().lookupField(n) for n in ('osm_id', 'code', 'fclass')]
    places.dataProvider().deleteAttributes([i for i in idx if i != -1])
    places.updateFields()
    print(places.fields().names())   # ['population', 'name']
    ```

??? success "ამოხსნა 1.3"
    ```python
    from qgis.PyQt.QtCore import QVariant
    places.dataProvider().addAttributes([QgsField('x', QVariant.Double),
                                         QgsField('y', QVariant.Double)])
    places.updateFields()
    ix = places.fields().lookupField('x')
    iy = places.fields().lookupField('y')

    places.startEditing()
    for f in places.getFeatures():
        p = f.geometry().asPoint()
        places.changeAttributeValue(f.id(), ix, p.x())
        places.changeAttributeValue(f.id(), iy, p.y())
    places.commitChanges()
    ```
    > კოორდინატები შრის CRS-შია (EPSG:4326: `x` – გრძედი/გრძივი ანუ longitude, `y` – latitude, გრადუსებში).

??? success "ამოხსნა 1.4"
    ```python
    seen, dup_ids = set(), []
    for f in places.getFeatures():
        key = f.geometry().asWkt()
        if key in seen:
            dup_ids.append(f.id())
        else:
            seen.add(key)

    places.startEditing()
    places.deleteFeatures(dup_ids)
    places.commitChanges()
    print(len(dup_ids), 'წაიშალა,', places.featureCount(), 'დარჩა')
    ```
    > `processing.run('native:deleteduplicategeometries', ...)` ქმნის **ახალ** შრეს, ამიტომ აქ გამოიყენება ციკლი, რომელიც ობიექტებს ამავე შრიდან შლის.

    **მოსალოდნელი შედეგი:** 5263 წერტილიდან წაიშლება 159 (დარჩება 5104). ყველა დუბლიკატი ატრიბუტებითაც იდენტურია.

---

## ნაწილი 2 (საქაღალდე: `part_2`)

1. შექმენით პოლიგონალური შრე `polygon_layer`, CRS **EPSG:4326**, და შეინახეთ `shp` საქაღალდეში.
    1. ჩატვირთეთ `gis_osm_protected_areas_a_free_1` და წაშალეთ სვეტები `osm_id`, `code`.
2. **ამავე შრეში** გამოთვალეთ ფართობი და პერიმეტრი შესაბამისი UTM ზონით.
3. იპოვეთ სრულად დუბლირებული ობიექტები (იგივე გეომეტრია და იგივე ატრიბუტები) და წაშალეთ **ამავე შრიდან**.

??? success "ამოხსნა 2.1"
    ```python
    layer = QgsVectorLayer('Polygon?crs=EPSG:4326', 'polygon_layer', 'memory')
    save_shp(layer, base + '/shp/polygon_layer.shp')

    pa = QgsVectorLayer(base + '/shp/gis_osm_protected_areas_a_free_1.shp', 'protected', 'ogr')
    idx = [pa.fields().lookupField(n) for n in ('osm_id', 'code')]
    pa.dataProvider().deleteAttributes([i for i in idx if i != -1])
    pa.updateFields()
    ```

??? success "ამოხსნა 2.2"
    ```python
    from qgis.PyQt.QtCore import QVariant
    pa.dataProvider().addAttributes([QgsField('area_km2', QVariant.Double),
                                     QgsField('perim_km', QVariant.Double)])
    pa.updateFields()
    ia = pa.fields().lookupField('area_km2')
    ip = pa.fields().lookupField('perim_km')

    ctx = QgsProject.instance().transformContext()
    transforms = {}                       # ზონა -> გარდაქმნა

    pa.startEditing()
    for f in pa.getFeatures():
        g = QgsGeometry(f.geometry())     # ასლი, რომ ორიგინალი არ შეიცვალოს
        lon = g.centroid().asPoint().x()
        zone = int((lon + 180) // 6) + 1
        if zone not in transforms:
            transforms[zone] = QgsCoordinateTransform(
                pa.crs(), QgsCoordinateReferenceSystem(f'EPSG:326{zone}'), ctx)
        g.transform(transforms[zone])
        pa.changeAttributeValue(f.id(), ia, g.area() / 1e6)
        pa.changeAttributeValue(f.id(), ip, g.length() / 1e3)
    pa.commitChanges()
    ```
    > `g.length()` პოლიგონზე პერიმეტრს აბრუნებს. 4326-ში `g.area()` გრადუსის კვადრატებს მოგცემდათ, ამიტომ ჯერ გეომეტრია პროექციულ CRS-ში გადაგვყავს.

    > მონაცემები ორ UTM ზონაშია (37N და 38N), ამიტომ ზონა თითოეული ობიექტისთვის ცალკე განისაზღვრება.

    **შემოწმება:** პირველი ობიექტი (`national_park`) ≈ 168,27 კმ², პერიმეტრი ≈ 96,94 კმ. ყველა 120 ობიექტის ჯამი ≈ 13 366 კმ² (ზონა 38 – 104 ობიექტი, ზონა 37 – 16).

??? success "ამოხსნა 2.3"
    ```python
    seen, dup_ids = set(), []
    for f in pa.getFeatures():
        key = (f.geometry().asWkt(), f['fclass'])
        if key in seen:
            dup_ids.append(f.id())
        else:
            seen.add(key)

    pa.startEditing()
    pa.deleteFeatures(dup_ids)
    pa.commitChanges()
    print(len(dup_ids), 'წაიშალა,', pa.featureCount(), 'დარჩა')
    ```
    **მოსალოდნელი შედეგი:** 120 ობიექტიდან წაიშლება 7 (დარჩება 113).

    > ერთსა და იმავე გეომეტრიას ხშირად ორი ჩანაწერი აქვს (`national_park` და `nature_reserve`). მხოლოდ გეომეტრიით შედარებისას (`f.geometry().asWkt()`) წაიშლებოდა 53 და მეორე ჩანაწერის `fclass` დაიკარგებოდა, ამიტომ გასაღებში `fclass`-იც შედის. `osm_id` და `code` უკვე წაშლილია, ამიტომ ისინი შედარებაში არ მონაწილეობს.
