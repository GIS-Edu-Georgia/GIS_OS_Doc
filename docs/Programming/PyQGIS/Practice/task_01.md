# 📝 დავალება 1

**საჭირო თემები:** [შრის შექმნა](../PyQGIS_topics/PyQGIS_Create_layer.md), [წაშლა](../PyQGIS_topics/PyQGIS_Obj_delete.md), [გაანგარიშებები ცხრილში](../PyQGIS_topics/PyQGIS_Calc_Attrib_Expressions.md), [ვექტორის გეოდამუშავება](../PyQGIS_topics/PyQGIS_Vector_Processing.md)

**მონაცემები:** `sample_data/practice/task_01/` (`nakveTi1`, `nakveti_poi`)

აქ და შემდეგ ამოხსნებში გამოიყენება [ზოგადი დამხმარე კოდი](index.md#ამოხსნები).

---

## ნაწილი 1 (საქაღალდე: `part_1`)

1. შექმენით ხაზოვანი შრე `reg_line`, CRS **EPSG:32637**, და შეინახეთ `shp` საქაღალდეში.
2. ჩატვირთეთ `nakveTi1` და წაშალეთ სვეტები `BLOCK`, `WEB_STATUS`, `ZONE_ID`.
3. გამოთვალეთ `nakveTi1`-ის ფართობი და პერიმეტრი.
4. იპოვეთ დუბლირებული ნაკვეთები და წაშალეთ `nakveTi1`-დან.

??? success "ამოხსნა 1.1"
    ```python
    layer = QgsVectorLayer('LineString?crs=EPSG:32637', 'reg_line', 'memory')
    save_shp(layer, base + '/shp/reg_line.shp')
    ```

??? success "ამოხსნა 1.2"
    ```python
    layer = QgsVectorLayer(base + '/shp/nakveTi1.shp', 'nakveTi1', 'ogr')
    idx = [layer.fields().lookupField(n) for n in ('BLOCK', 'WEB_STATUS', 'ZONE_ID')]
    layer.dataProvider().deleteAttributes([i for i in idx if i != -1])
    layer.updateFields()
    ```

??? success "ამოხსნა 1.3"
    ```python
    from qgis.PyQt.QtCore import QVariant
    pr = layer.dataProvider()
    pr.addAttributes([QgsField('area_m2', QVariant.Double),
                      QgsField('perim_m', QVariant.Double)])
    layer.updateFields()

    layer.startEditing()
    for f in layer.getFeatures():
        g = f.geometry()
        f['area_m2'] = g.area()
        f['perim_m'] = g.length()
        layer.updateFeature(f)
    layer.commitChanges()
    ```
    > ფართობი გამოითვლება შრის CRS-ში. სწორი შედეგისთვის CRS უნდა იყოს პროექციული (მეტრებში).

??? success "ამოხსნა 1.4"
    ```python
    res = processing.run('native:deleteduplicategeometries',
        {'INPUT': layer, 'OUTPUT': base + '/shp/nakveTi1_unique.shp'})
    print(layer.featureCount(), '->', QgsVectorLayer(res['OUTPUT']).featureCount())
    ```

---

## ნაწილი 2 (საქაღალდე: `part_2`)

1. შექმენით წერტილოვანი შრე `points`, CRS **EPSG:4326**, და შეინახეთ `shp` საქაღალდეში.
2. ჩატვირთეთ `nakveti_poi` და წაშალეთ სვეტები `ZONE_ID`, `DANISHNULE`.
3. გამოთვალეთ `nakveti_poi`-ს XY კოორდინატები.
4. ჩატვირთეთ `nakveTi1`, იპოვეთ დუბლირებული ნაკვეთები და წაშალეთ.

??? success "ამოხსნა 2.1 – 2.3"
    ```python
    layer = QgsVectorLayer('Point?crs=EPSG:4326', 'points', 'memory')
    save_shp(layer, base + '/shp/points.shp')

    poi = QgsVectorLayer(base + '/shp/nakveti_poi.shp', 'nakveti_poi', 'ogr')
    idx = [poi.fields().lookupField(n) for n in ('ZONE_ID', 'DANISHNULE')]
    poi.dataProvider().deleteAttributes([i for i in idx if i != -1])
    poi.updateFields()

    res = processing.run('native:addxyfields', {
        'INPUT': poi, 'CRS': poi.crs(), 'PREFIX': '',
        'OUTPUT': base + '/shp/nakveti_poi_xy.shp'})
    ```

??? success "ამოხსნა 2.4"
    იგივეა, რაც ამოხსნა 1.4 (`native:deleteduplicategeometries`).
