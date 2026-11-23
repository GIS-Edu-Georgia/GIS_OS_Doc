# 📝 დავალება 3

**საჭირო თემები:** [შრის შექმნა](../PyQGIS_topics/PyQGIS_Create_layer.md), [კოორდინატების კონვერტაცია](../PyQGIS_topics/PyQGIS_coordinates.md), [გაანგარიშებები ცხრილში](../PyQGIS_topics/PyQGIS_Calc_Attrib_Expressions.md)

**მონაცემები:** `sample_data/practice/osm/` (`gis_osm_roads_free_Batumi`; OpenStreetMap, EPSG:4326). ყველა OSM შრე ერთ არქივად: [`OSM_shp_PyQGIS.zip`](https://github.com/GIS-Edu-Georgia/GIS_OS_Doc/releases/download/osm-data-v1/OSM_shp_PyQGIS.zip)

აქ და შემდეგ ამოხსნებში გამოიყენება [ზოგადი დამხმარე კოდი](index.md#ამოხსნები).

!!! danger "სავალდებულოა: იმუშავეთ ასლზე"
    ველების დამატება ხდება **პირდაპირ ფაილში**. სანამ დაიწყებთ, დააკოპირეთ შრეები (`.shp`, `.shx`, `.dbf`, `.prj`, `.cpg`) თქვენს `shp` საქაღალდეში და მუშაობა მხოლოდ ასლზე აწარმოეთ.

---

## ამოცანები (საქაღალდე: `part_1`)

1. შექმენით წერტილოვანი შრე `points`, CRS **EPSG:4326**, და შეინახეთ `shp` საქაღალდეში.
2. ჩაწერეთ კოორდინატები `txt` ფაილში. წაიკითხეთ ისინი სკრიპტით, გადაიყვანეთ ათწილად გრადუსებში და დაბეჭდეთ კონსოლში:
    - 42°17'2.95"N, 43°16'55.79"E
    - 42°17'26.48"N, 43°16'46.89"E

    > ამ კონკრეტულ დავალებაზე შაბლონის სკრიპტის გარდა შეგიძლიათ **AI-ს გამოყენება**.
3. `gis_osm_roads_free_Batumi` შრეში (ბათუმის გზები) გამოთვალეთ სიგრძე ორ სხვადასხვა სვეტში: `WGS_Length` (ელიფსოიდური) და `UTM_Length` (UTM ზონის პროექციაში). გადახედეთ მონაცემებს: გჭირდებათ თუ არა საკოორდინატო სისტემის შეცვლა?

??? success "ამოხსნა 1.1"
    ```python
    layer = QgsVectorLayer('Point?crs=EPSG:4326', 'points', 'memory')
    save_shp(layer, base + '/shp/points.shp')
    ```

??? success "ამოხსნა 1.2"
    `coords.txt` (თითო სტრიქონზე ერთი წერტილი: გრძედი, გრძივი):
    ```text
    42°17'2.95"N, 43°16'55.79"E
    42°17'26.48"N, 43°16'46.89"E
    ```
    ```python
    import re

    def dms(text):
        d, m, s, hemi = re.match(r'(\d+)°(\d+)\'([\d.]+)"([NSEW])', text.strip()).groups()
        value = int(d) + int(m) / 60 + float(s) / 3600
        return -value if hemi in 'SW' else value

    with open(base + '/coords.txt', encoding='utf-8') as fh:
        for line in fh:
            lat, lon = [dms(part) for part in line.split(',')]
            print(round(lat, 6), round(lon, 6))
    ```
    **მოსალოდნელი შედეგი:**
    ```text
    42.284153 43.282164
    42.290689 43.279692
    ```
    > ტექსტში სიმბოლო `°` არაა ლათინური, ამიტომ ფაილი UTF-8-ში შეინახეთ და `encoding='utf-8'` მიუთითეთ. გრძედი (N/S) პირველია, გრძივი (E/W) მეორე; წერტილის შესაქმნელად `QgsPointXY(lon, lat)` – ჯერ გრძივი.

??? success "ამოხსნა 1.3"
    შრის CRS არის **EPSG:4326** (გრადუსები), ამიტომ `geometry().length()` გრადუსებს დააბრუნებდა. სიგრძისთვის გვჭირდება ან ელიფსოიდური გაზომვა, ან პროექციულ CRS-ში გადაყვანა.
    ```python
    from qgis.PyQt.QtCore import QVariant
    roads = QgsVectorLayer(base + '/shp/gis_osm_roads_free_Batumi.shp', 'roads', 'ogr')
    print(roads.crs().authid())                       # EPSG:4326

    roads.dataProvider().addAttributes([QgsField('WGS_Length', QVariant.Double),
                                        QgsField('UTM_Length', QVariant.Double)])
    roads.updateFields()
    iw = roads.fields().lookupField('WGS_Length')
    iu = roads.fields().lookupField('UTM_Length')

    ctx = QgsProject.instance().transformContext()
    d = QgsDistanceArea()                             # ელიფსოიდური სიგრძე
    d.setSourceCrs(roads.crs(), ctx)
    d.setEllipsoid('WGS84')

    # ბათუმი ~41,6°E -> UTM ზონა 37N -> EPSG:32637
    to_utm = QgsCoordinateTransform(roads.crs(), QgsCoordinateReferenceSystem('EPSG:32637'), ctx)

    roads.startEditing()
    for f in roads.getFeatures():
        g = QgsGeometry(f.geometry())                 # ასლი
        wgs = d.measureLength(g) / 1000               # კმ
        g.transform(to_utm)
        utm = g.length() / 1000                       # კმ
        roads.changeAttributeValue(f.id(), iw, wgs)
        roads.changeAttributeValue(f.id(), iu, utm)
    roads.commitChanges()
    ```
    > ბათუმი მთლიანად ერთ UTM ზონაშია. ზონის გამოსათვლელად: `int((lon + 180) // 6) + 1` (41,6°E → 37).

    **შემოწმება:** ყველა 11 738 ხაზის ჯამი: `WGS_Length` ≈ 1202,6 კმ, `UTM_Length` ≈ 1202,8 კმ. სხვაობა მცირეა, რადგან UTM-ში მასშტაბის დამახინჯებაა.

    > შრე `gis_osm_roads_free_Batumi` მიღებულია მთელი საქართველოს `gis_osm_roads_free_1`-იდან (332 755 ხაზი) ბათუმის მუნიციპალიტეტით მოჭრით. ცხრილში „ქალაქის" ველი არ არის, ამიტომ გამოყენებულია სივრცითი ოპერაცია `native:clip`.
