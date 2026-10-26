# 📝 დავალება 4

**საჭირო თემები:** [ატრიბუტული მონიშვნები](../PyQGIS_topics/PyQGIS_SQL_Spatial_Selection.md), [გეომეტრიის ცვლილება](../PyQGIS_topics/PyQGIS_Geometry_Conversions.md), [შრის შექმნა](../PyQGIS_topics/PyQGIS_Create_layer.md), [კოორდინატების კონვერტაცია](../PyQGIS_topics/PyQGIS_coordinates.md)

**მონაცემები:** `sample_data/practice/task_04/` (`points`, `sdstas`, `koordinatebi.txt`)

---

## ნაწილი 1 (საქაღალდე: `part_1`)

1. ჩატვირთეთ `points` და გაფილტრეთ ობიექტები, სადაც `real` = 1. შეინახეთ `my_shp1.shp`.
2. ჩატვირთეთ `points`, წაშალეთ გეომეტრიულად დუბლირებული ობიექტები და შეინახეთ `my_shp_without_geo_duplicates`.
3. ჩატვირთეთ `my_shp_without_geo_duplicates`, წაშალეთ სვეტი `ORIG_FID` და შეინახეთ `my_shp_without_ORIG_FID`.

??? success "ამოხსნა"
    ```python
    pts = QgsVectorLayer(base + '/shp/points.shp', 'points', 'ogr')

    # 1
    processing.run('native:extractbyexpression', {
        'INPUT': pts, 'EXPRESSION': '"real" = 1',
        'OUTPUT': base + '/shp/my_shp1.shp'})

    # 2
    processing.run('native:deleteduplicategeometries', {
        'INPUT': pts, 'OUTPUT': base + '/shp/my_shp_without_geo_duplicates.shp'})

    # 3
    nodup = QgsVectorLayer(base + '/shp/my_shp_without_geo_duplicates.shp', 'nodup', 'ogr')
    processing.run('native:deletecolumn', {
        'INPUT': nodup, 'COLUMN': ['ORIG_FID'],
        'OUTPUT': base + '/shp/my_shp_without_ORIG_FID.shp'})
    ```

---

## ნაწილი 2 (საქაღალდე: `part_2`)

1. ჩატვირთეთ `sdstas` და გადაიყვანეთ მისი გეომეტრია ხაზებად. შეინახეთ `sdstas_line`.
2. შექმენით წერტილოვანი შრე `test1.shp` ველებით: `ID` (int), `Name` (string), `Person_ID` (double); CRS EPSG:4326.
3. შექმენით წერტილოვანი შრე `test_1.shp` ველებით: `ID` (int), `saxelwodeba` (string), `tipi` (string); CRS EPSG:32638. დაამატეთ ერთი ჩანაწერი კოორდინატებით **4683402.40, 358412.16** (საწყისი წერტილი): ID = 1, პირველი ტექსტური ველი „saxeli", მეორე „ucnobia".
4. საქაღალდეში არის `koordinatebi.txt`. PyQGIS-ით გადაიყვანეთ ორივე კოორდინატი ათწილად გრადუსებში.

??? success "ამოხსნა 2.1"
    ```python
    sd = QgsVectorLayer(base + '/shp/sdstas.shp', 'sdstas', 'ogr')
    # პოლიგონები -> ხაზები (წერტილის შემთხვევაში გამოიყენეთ native:pointstopath)
    processing.run('native:polygonstolines', {
        'INPUT': sd, 'OUTPUT': base + '/shp/sdstas_line.shp'})
    ```

??? success "ამოხსნა 2.2 – 2.3"
    ```python
    from qgis.PyQt.QtCore import QVariant

    fields = QgsFields()
    fields.append(QgsField('ID', QVariant.Int))
    fields.append(QgsField('Name', QVariant.String))
    fields.append(QgsField('Person_ID', QVariant.Double))
    w = QgsVectorFileWriter(base + '/shp/test1.shp', 'UTF-8', fields,
        QgsWkbTypes.Point, QgsCoordinateReferenceSystem('EPSG:4326'), 'ESRI Shapefile')
    del w   # ფაილის დახურვა

    fields = QgsFields()
    fields.append(QgsField('ID', QVariant.Int))
    fields.append(QgsField('saxelwodeba', QVariant.String))
    fields.append(QgsField('tipi', QVariant.String))
    w = QgsVectorFileWriter(base + '/shp/test_1.shp', 'UTF-8', fields,
        QgsWkbTypes.Point, QgsCoordinateReferenceSystem('EPSG:32638'), 'ESRI Shapefile')
    f = QgsFeature(fields)
    # 358412.16 = X (easting), 4683402.40 = Y (northing)
    f.setGeometry(QgsGeometry.fromPointXY(QgsPointXY(358412.16, 4683402.40)))
    f.setAttributes([1, 'saxeli', 'ucnobia'])
    w.addFeature(f)
    del w
    ```
    > პირობაში კოორდინატები ჯერ Y-ით (4683402.40), შემდეგ X-ით (358412.16) არის დაწერილი. UTM-ში X (easting) 6-ციფრიანია, ამიტომ `QgsPointXY`-ში მათი თანმიმდევრობა უნდა შეატრიალოთ.

??? success "ამოხსნა 2.4"
    ```python
    tr = QgsCoordinateTransform(QgsCoordinateReferenceSystem('EPSG:32638'),
                                QgsCoordinateReferenceSystem('EPSG:4326'),
                                QgsProject.instance())
    with open(base + '/koordinatebi.txt', encoding='utf-8') as fh:
        for line in fh:
            parts = line.replace(',', ' ').split()
            if len(parts) < 2:
                continue
            x, y = float(parts[0]), float(parts[1])   # ფაილის ფორმატი შეამოწმეთ
            p = tr.transform(QgsPointXY(x, y))
            print(round(p.y(), 6), round(p.x(), 6))    # lat, lon
    ```
