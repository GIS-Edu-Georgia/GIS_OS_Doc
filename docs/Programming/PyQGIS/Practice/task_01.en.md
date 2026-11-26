# 📝 Assignment 1

**Required topics:** [Creating layers](../PyQGIS_topics/PyQGIS_Create_layer.md), [Deleting](../PyQGIS_topics/PyQGIS_Obj_delete.md), [Attribute calculations](../PyQGIS_topics/PyQGIS_Calc_Attrib_Expressions.md), [Vector geoprocessing](../PyQGIS_topics/PyQGIS_Vector_Processing.md)

**Data:** `sample_data/practice/osm/` (`gis_osm_places_free_1`, `gis_osm_protected_areas_a_free_1`; OpenStreetMap, EPSG:4326). All OSM layers in one archive: [`OSM_shp_PyQGIS.zip`](https://github.com/GIS-Edu-Georgia/GIS_OS_Doc/releases/download/osm-data-v1/OSM_shp_PyQGIS.zip) (8 layers, 8 MB)

Here and in the following solutions the [general helper code](index.md#solutions) is used.

!!! danger "Required: work on a copy"
    Deleting fields, calculating values and deleting features all happen **directly in the file**. Before you start, copy both layers (`.shp`, `.shx`, `.dbf`, `.prj`, `.cpg`) into your `shp` folder and work only on the copy.

---

## Part 1 (folder: `part_1`)

1. Create a line layer `regline_layer` with CRS **EPSG:32637** and save it in the `shp` folder.
2. Load `gis_osm_places_free_1` and delete the columns `osm_id`, `code`, `fclass`.
3. Calculate XY coordinates **on the same layer**.
4. Find duplicate points and delete them **from the same layer**.

??? success "Solution 1.1"
    ```python
    layer = QgsVectorLayer('LineString?crs=EPSG:32637', 'regline_layer', 'memory')
    save_shp(layer, base + '/shp/regline_layer.shp')
    ```

??? success "Solution 1.2"
    ```python
    places = QgsVectorLayer(base + '/shp/gis_osm_places_free_1.shp', 'places', 'ogr')
    idx = [places.fields().lookupField(n) for n in ('osm_id', 'code', 'fclass')]
    places.dataProvider().deleteAttributes([i for i in idx if i != -1])
    places.updateFields()
    print(places.fields().names())   # ['population', 'name']
    ```

??? success "Solution 1.3"
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
    > The coordinates are in the layer's CRS (EPSG:4326: `x` is longitude, `y` is latitude, in degrees).

??? success "Solution 1.4"
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
    print(len(dup_ids), 'deleted,', places.featureCount(), 'left')
    ```
    > `processing.run('native:deleteduplicategeometries', ...)` creates a **new** layer, so a loop that deletes features from the same layer is used here.

    **Expected result:** 159 of the 5263 points are deleted (5104 remain). All duplicates also have identical attributes.

---

## Part 2 (folder: `part_2`)

1. Create a polygon layer `polygon_layer` with CRS **EPSG:4326** and save it in the `shp` folder.
    1. Load `gis_osm_protected_areas_a_free_1` and delete the columns `osm_id`, `code`.
2. Calculate area and perimeter **in the same layer** using the appropriate UTM zone.
3. Find fully duplicated features (same geometry and same attributes) and delete them **from the same layer**.

??? success "Solution 2.1"
    ```python
    layer = QgsVectorLayer('Polygon?crs=EPSG:4326', 'polygon_layer', 'memory')
    save_shp(layer, base + '/shp/polygon_layer.shp')

    pa = QgsVectorLayer(base + '/shp/gis_osm_protected_areas_a_free_1.shp', 'protected', 'ogr')
    idx = [pa.fields().lookupField(n) for n in ('osm_id', 'code')]
    pa.dataProvider().deleteAttributes([i for i in idx if i != -1])
    pa.updateFields()
    ```

??? success "Solution 2.2"
    ```python
    from qgis.PyQt.QtCore import QVariant
    pa.dataProvider().addAttributes([QgsField('area_km2', QVariant.Double),
                                     QgsField('perim_km', QVariant.Double)])
    pa.updateFields()
    ia = pa.fields().lookupField('area_km2')
    ip = pa.fields().lookupField('perim_km')

    ctx = QgsProject.instance().transformContext()
    transforms = {}                       # zone -> transform

    pa.startEditing()
    for f in pa.getFeatures():
        g = QgsGeometry(f.geometry())     # a copy, so the original is not changed
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
    > On a polygon, `g.length()` returns the perimeter. In 4326, `g.area()` would give square degrees, so we first transform the geometry into a projected CRS.

    > The data spans two UTM zones (37N and 38N), so the zone is determined separately for each feature.

    **Check:** the first feature (`national_park`) ≈ 168.27 km², perimeter ≈ 96.94 km. The total of all 120 features ≈ 13,366 km² (zone 38: 104 features, zone 37: 16).

??? success "Solution 2.3"
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
    print(len(dup_ids), 'deleted,', pa.featureCount(), 'left')
    ```
    **Expected result:** 7 of the 120 features are deleted (113 remain).

    > The same geometry often has two records (`national_park` and `nature_reserve`). Comparing by geometry alone (`f.geometry().asWkt()`) would delete 53 features and lose the second record's `fclass`, so `fclass` is part of the key. `osm_id` and `code` are already deleted, so they take no part in the comparison.
