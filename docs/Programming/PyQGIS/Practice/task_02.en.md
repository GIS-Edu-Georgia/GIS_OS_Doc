# 📝 Assignment 2

**Required topics:** [Attribute selection](../PyQGIS_topics/PyQGIS_SQL_Spatial_Selection.md), [Spatial selection](../PyQGIS_topics/PyQGIS_Spatial_Selection.md), [Deleting](../PyQGIS_topics/PyQGIS_Obj_delete.md), [Coordinate conversion](../PyQGIS_topics/PyQGIS_coordinates.md), [Vector geoprocessing](../PyQGIS_topics/PyQGIS_Vector_Processing.md)

**Data:** `sample_data/practice/osm/` (`gis_osm_places_free_1`, `gis_osm_adminareas_a_free_1`, `gis_osm_roads_free_Batumi`; OpenStreetMap, EPSG:4326). All OSM layers in one archive: [`OSM_shp_PyQGIS.zip`](https://github.com/GIS-Edu-Georgia/GIS_OS_Doc/releases/download/osm-data-v1/OSM_shp_PyQGIS.zip)

Here and in the following solutions the [general helper code](index.md#solutions) is used.

!!! danger "Required: work on a copy"
    Deleting features and adding fields happen **directly in the file**. Before you start, copy the layers (`.shp`, `.shx`, `.dbf`, `.prj`, `.cpg`) into your `shp` folder and work only on the copy.

---

## Part 1 (folder: `part_1`)

1. In `gis_osm_places_free_1`, select the feature whose `population` is **1331** and export it to `shp`.
2. Delete **from the same layer** `gis_osm_places_free_1` the features whose `osm_id` is greater than **1014750524** and less than **10926200653**.
3. Load `gis_osm_adminareas_a_free_1` and select the municipality **"ჭიათურის მუნიციპალიტეტი"** (Chiatura Municipality; by the `name` column, `fclass = admin_level6`). In `gis_osm_places_free_1`, select the features that fall inside this municipality, clip them and save the result as `gis_osm_places_free_1_Chiatura` in the `shp` folder.

??? success "Solution 1.1"
    ```python
    places = QgsVectorLayer(base + '/shp/gis_osm_places_free_1.shp', 'places', 'ogr')
    QgsProject.instance().addMapLayer(places)

    places.selectByExpression('"population" = 1331')
    print(places.selectedFeatureCount())          # 1
    processing.run('native:saveselectedfeatures',
        {'INPUT': places, 'OUTPUT': base + '/shp/places_pop_1331.shp'})
    places.removeSelection()
    ```

??? success "Solution 1.2"
    ```python
    places.selectByExpression(
        'to_int("osm_id") > 1014750524 AND to_int("osm_id") < 10926200653')
    print(places.selectedFeatureCount(), 'to delete')

    places.startEditing()
    places.deleteSelectedFeatures()
    places.commitChanges()
    print(places.featureCount(), 'left')
    ```
    > `osm_id` is a text (String) field. The expression `"osm_id" > 1014750524` would compare it as text and give a wrong result, so `to_int("osm_id")` is needed.

    **Expected result:** 1190 of the 5263 features are deleted (4073 remain).

??? success "Solution 1.3"
    ```python
    adm = QgsVectorLayer(base + '/shp/gis_osm_adminareas_a_free_1.shp', 'adminareas', 'ogr')
    QgsProject.instance().addMapLayer(adm)
    adm.selectByExpression(
        '"fclass" = \'admin_level6\' AND "name" = \'ჭიათურის მუნიციპალიტეტი\'')
    print(adm.selectedFeatureCount())                 # 1

    # features of places that fall inside the selected municipality
    processing.run('native:selectbylocation', {
        'INPUT': places, 'PREDICATE': [0],           # 0 = intersects
        'INTERSECT': QgsProcessingFeatureSourceDefinition(adm.id(), True),
        'METHOD': 0})
    print(places.selectedFeatureCount())              # 106

    # clip: only the selected features, by the selected municipality
    processing.run('native:clip', {
        'INPUT': QgsProcessingFeatureSourceDefinition(places.id(), True),
        'OVERLAY': QgsProcessingFeatureSourceDefinition(adm.id(), True),
        'OUTPUT': base + '/shp/gis_osm_places_free_1_Chiatura.shp'})
    ```
    > `QgsProcessingFeatureSourceDefinition(layer.id(), True)` means "selected features only". If you pass the layer directly, the algorithm uses **all** features. That is why the layers must first be added to the project (`addMapLayer`).

    > `"name" = 'ჭიათურა'` alone would pick the town polygon (`admin_level8`), not the municipality, so `fclass` is required too.

    **Expected result:** `gis_osm_places_free_1_Chiatura` has 106 points (Chiatura, Khunevi, Rgani and others).

---

## Part 2 (folder: `part_2`)

1. Create a point layer `points` with CRS **EPSG:4326** and save it in the `shp` folder.
2. Write the coordinates into a `txt` file. Read them with a script, convert them to decimal degrees and print them in the console:
    - 42°17'2.95"N, 43°16'55.79"E
    - 42°17'26.48"N, 43°16'46.89"E

    > For this particular task you may **use AI** in addition to the template script.

3. In the `gis_osm_roads_free_Batumi` layer (roads of Batumi), calculate the length in two separate columns: `WGS_Length` (ellipsoidal) and `UTM_Length` (in the UTM zone projection). Look at the data: do you need to change the coordinate reference system?

??? success "Solution 2.1"
    ```python
    layer = QgsVectorLayer('Point?crs=EPSG:4326', 'points', 'memory')
    save_shp(layer, base + '/shp/points.shp')
    ```

??? success "Solution 2.2"
    `coords.txt` (one point per line: latitude, longitude):
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
    **Expected result:**
    ```text
    42.284153 43.282164
    42.290689 43.279692
    ```
    > The `°` symbol is not ASCII, so save the file as UTF-8 and pass `encoding='utf-8'`. Latitude (N/S) comes first and longitude (E/W) second; to create a point use `QgsPointXY(lon, lat)`, longitude first.

??? success "Solution 2.3"
    The layer's CRS is **EPSG:4326** (degrees), so `geometry().length()` would return degrees. For length we need either an ellipsoidal measurement or a transformation into a projected CRS.
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
    d = QgsDistanceArea()                             # ellipsoidal length
    d.setSourceCrs(roads.crs(), ctx)
    d.setEllipsoid('WGS84')

    # Batumi ~41.6°E -> UTM zone 37N -> EPSG:32637
    to_utm = QgsCoordinateTransform(roads.crs(), QgsCoordinateReferenceSystem('EPSG:32637'), ctx)

    roads.startEditing()
    for f in roads.getFeatures():
        g = QgsGeometry(f.geometry())                 # a copy
        wgs = d.measureLength(g) / 1000               # km
        g.transform(to_utm)
        utm = g.length() / 1000                       # km
        roads.changeAttributeValue(f.id(), iw, wgs)
        roads.changeAttributeValue(f.id(), iu, utm)
    roads.commitChanges()
    ```
    > Batumi lies entirely in one UTM zone. To compute the zone: `int((lon + 180) // 6) + 1` (41.6°E → 37).

    **Check:** the total of all 11,738 lines: `WGS_Length` ≈ 1202.6 km, `UTM_Length` ≈ 1202.8 km. The difference is small and comes from the scale distortion of UTM.

    > The `gis_osm_roads_free_Batumi` layer was made from the all-Georgia `gis_osm_roads_free_1` (332,755 lines) by clipping it with the Batumi municipality. The table has no "city" field, so the spatial operation `native:clip` was used.
