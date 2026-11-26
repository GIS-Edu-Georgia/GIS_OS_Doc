# 📝 Assignment 4

**Required topics:** [Attribute selection](../PyQGIS_topics/PyQGIS_SQL_Spatial_Selection.md), [Geometry conversions](../PyQGIS_topics/PyQGIS_Geometry_Conversions.md), [Creating layers](../PyQGIS_topics/PyQGIS_Create_layer.md), [Coordinate conversion](../PyQGIS_topics/PyQGIS_coordinates.md)

**Data:** `sample_data/practice/task_04/` (`points`, `sdstas`, `koordinatebi.txt`)

---

## Part 1 (folder: `part_1`)

1. Load `points` and filter the features where `real` = 1. Save them as `my_shp1.shp`.
2. Load `points`, delete the geometrically duplicated features and save the result as `my_shp_without_geo_duplicates`.
3. Load `my_shp_without_geo_duplicates`, delete the column `ORIG_FID` and save the result as `my_shp_without_ORIG_FID`.

??? success "Solution"
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

## Part 2 (folder: `part_2`)

1. Load `sdstas` and convert its geometry to lines. Save the result as `sdstas_line`.
2. Create a point layer `test1.shp` with the fields `ID` (int), `Name` (string), `Person_ID` (double); CRS EPSG:4326.
3. Create a point layer `test_1.shp` with the fields `ID` (int), `saxelwodeba` (string), `tipi` (string); CRS EPSG:32638. Add one record at the coordinates **4683402.40, 358412.16** (the start point): ID = 1, first text field "saxeli", second "ucnobia".
4. The folder contains `koordinatebi.txt`. Use PyQGIS to convert both coordinates to decimal degrees.

??? success "Solution 2.1"
    ```python
    sd = QgsVectorLayer(base + '/shp/sdstas.shp', 'sdstas', 'ogr')
    # polygons -> lines (for points, use native:pointstopath)
    processing.run('native:polygonstolines', {
        'INPUT': sd, 'OUTPUT': base + '/shp/sdstas_line.shp'})
    ```

??? success "Solution 2.2 – 2.3"
    ```python
    from qgis.PyQt.QtCore import QVariant

    fields = QgsFields()
    fields.append(QgsField('ID', QVariant.Int))
    fields.append(QgsField('Name', QVariant.String))
    fields.append(QgsField('Person_ID', QVariant.Double))
    w = QgsVectorFileWriter(base + '/shp/test1.shp', 'UTF-8', fields,
        QgsWkbTypes.Point, QgsCoordinateReferenceSystem('EPSG:4326'), 'ESRI Shapefile')
    del w   # close the file

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
    > The assignment writes the coordinates Y first (4683402.40), then X (358412.16). In UTM the X value (easting) has 6 digits, so you have to swap their order in `QgsPointXY`.

??? success "Solution 2.4"
    ```python
    tr = QgsCoordinateTransform(QgsCoordinateReferenceSystem('EPSG:32638'),
                                QgsCoordinateReferenceSystem('EPSG:4326'),
                                QgsProject.instance())
    with open(base + '/koordinatebi.txt', encoding='utf-8') as fh:
        for line in fh:
            parts = line.replace(',', ' ').split()
            if len(parts) < 2:
                continue
            x, y = float(parts[0]), float(parts[1])   # check the file format
            p = tr.transform(QgsPointXY(x, y))
            print(round(p.y(), 6), round(p.x(), 6))    # lat, lon
    ```
