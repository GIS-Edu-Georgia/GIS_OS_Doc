# 📝 დავალება 2

**საჭირო თემები:** [ატრიბუტული მონიშვნები](../PyQGIS_topics/PyQGIS_SQL_Spatial_Selection.md), [წაშლა](../PyQGIS_topics/PyQGIS_Obj_delete.md), [კოორდინატების კონვერტაცია](../PyQGIS_topics/PyQGIS_coordinates.md), [ვექტორის გეოდამუშავება](../PyQGIS_topics/PyQGIS_Vector_Processing.md)

**მონაცემები:** `sample_data/practice/task_02/` (`nakveTi1`, `frame`, `Pol_line`)

---

## ნაწილი 1 (საქაღალდე: `part_1`)

1. `nakveTi1`-დან მონიშნეთ ნაკვეთი საკადასტრო კოდით **"350445037"** და გაიტანეთ `shp`-ში.
2. `nakveTi1`-დან წაშალეთ ობიექტები, სადაც `OBJECTID` მეტია 2897895-ზე და ნაკლებია 3009460-ზე.
3. `nakveTi1`-ის ის ობიექტები, რომლებიც `frame` შრეშია მოქცეული, მოჭერით და შეინახეთ `clipped_parcels.shp` სახელით `shp` საქაღალდეში.

??? success "ამოხსნა 1.1"
    ```python
    layer = QgsVectorLayer(base + '/shp/nakveTi1.shp', 'nakveTi1', 'ogr')
    # სვეტის სახელი შეამოწმეთ: [f.name() for f in layer.fields()]
    layer.selectByExpression('"CADASTRAL_CODE" = \'350445037\'')
    processing.run('native:saveselectedfeatures',
        {'INPUT': layer, 'OUTPUT': base + '/shp/parcel_350445037.shp'})
    layer.removeSelection()
    ```

??? success "ამოხსნა 1.2"
    ```python
    layer.selectByExpression('"OBJECTID" > 2897895 AND "OBJECTID" < 3009460')
    layer.startEditing()
    layer.deleteSelectedFeatures()
    layer.commitChanges()
    ```

??? success "ამოხსნა 1.3"
    ```python
    frame = QgsVectorLayer(base + '/shp/frame.shp', 'frame', 'ogr')
    processing.run('native:clip', {
        'INPUT': layer, 'OVERLAY': frame,
        'OUTPUT': base + '/shp/clipped_parcels.shp'})
    ```

---

## ნაწილი 2 (საქაღალდე: `part_2`)

1. შექმენით წერტილოვანი შრე `points` (EPSG:4326) და შეინახეთ `shp`-ში.
2. გადაიყვანეთ კოორდინატები ათწილად გრადუსებში და დაბეჭდეთ კონსოლში:
    - 42°17'2.95"N, 43°16'55.79"E
    - 42°17'26.48"N, 43°16'46.89"E
3. `Pol_line` შრეში გამოთვალეთ სიგრძე ორ სხვადასხვა სვეტში: `WGS_Length` (ელიფსოიდური) და `UTM_Length` (UTM ზონის პროექციაში).

??? success "ამოხსნა 2.2"
    ```python
    def dms(d, m, s):
        return d + m / 60 + s / 3600

    for lat, lon in [((42, 17, 2.95), (43, 16, 55.79)),
                     ((42, 17, 26.48), (43, 16, 46.89))]:
        print(round(dms(*lat), 6), round(dms(*lon), 6))
    ```

??? success "ამოხსნა 2.3"
    ```python
    from qgis.PyQt.QtCore import QVariant
    line = QgsVectorLayer(base + '/shp/Pol_line.shp', 'Pol_line', 'ogr')
    line.dataProvider().addAttributes([QgsField('WGS_Length', QVariant.Double),
                                       QgsField('UTM_Length', QVariant.Double)])
    line.updateFields()

    # ელიფსოიდური სიგრძე
    d = QgsDistanceArea()
    d.setSourceCrs(line.crs(), QgsProject.instance().transformContext())
    d.setEllipsoid('WGS84')

    # UTM ზონა: 43°E -> 38N -> EPSG:32638
    to_utm = QgsCoordinateTransform(line.crs(), QgsCoordinateReferenceSystem('EPSG:32638'),
                                    QgsProject.instance())

    line.startEditing()
    for f in line.getFeatures():
        g = f.geometry()
        f['WGS_Length'] = d.measureLength(g)
        g_utm = QgsGeometry(g)
        g_utm.transform(to_utm)
        f['UTM_Length'] = g_utm.length()
        line.updateFeature(f)
    line.commitChanges()
    ```
