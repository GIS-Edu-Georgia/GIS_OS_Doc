# 📝 დავალება 3

**საჭირო თემები:** [კოორდინატების კონვერტაცია](../PyQGIS_topics/PyQGIS_coordinates.md), [გაანგარიშებები ცხრილში](../PyQGIS_topics/PyQGIS_Calc_Attrib_Expressions.md), [რელიეფი](../PyQGIS_topics/PyQGIS_Raster_DEM.md)

**მონაცემები:** `sample_data/practice/task_03/` (`saxli`, `saxli_1`, `geo_regions.shp`, `srtm_45_04.tif`)

---

## ნაწილი 1 (საქაღალდე: `part_1`)

1. ჩატვირთეთ `saxli` და დაამატეთ სვეტი `saxeli / gvari` (ლათინური სახელით, მაგ. `saxeli_gvari`); ჩაწერეთ თქვენი სახელი და გვარი.
2. ჩატვირთეთ `saxli_1` და გააერთიანეთ `saxli`-სთან.
3. ჩატვირთეთ `geo_regions.shp` და `srtm_45_04.tif`. რელიეფი მოჭერით იმერეთის რეგიონით და ააგეთ ჩრდილოვანი რელიეფი (hillshade).

??? success "ამოხსნა 1.1 – 1.2"
    ```python
    from qgis.PyQt.QtCore import QVariant
    saxli = QgsVectorLayer(base + '/shp/saxli.shp', 'saxli', 'ogr')
    saxli.dataProvider().addAttributes([QgsField('saxeli_gvari', QVariant.String)])
    saxli.updateFields()

    saxli.startEditing()
    for f in saxli.getFeatures():
        f['saxeli_gvari'] = 'giorgi kapanadze'
        saxli.updateFeature(f)
    saxli.commitChanges()

    saxli_1 = QgsVectorLayer(base + '/shp/saxli_1.shp', 'saxli_1', 'ogr')
    processing.run('native:mergevectorlayers', {
        'LAYERS': [saxli, saxli_1], 'CRS': saxli.crs(),
        'OUTPUT': base + '/shp/saxli_merged.shp'})
    ```

??? success "ამოხსნა 1.3"
    ```python
    regions = QgsVectorLayer(base + '/shp/geo_regions.shp', 'geo_regions', 'ogr')
    dem = base + '/Raster/srtm_45_04.tif'

    imereti = processing.run('native:extractbyexpression', {
        'INPUT': regions,
        'EXPRESSION': '"name_en" = \'Imereti\'',   # შეამოწმეთ სვეტის სახელი
        'OUTPUT': 'memory:'})['OUTPUT']

    clipped = base + '/Raster/imereti_dem.tif'
    processing.run('gdal:cliprasterbymasklayer', {
        'INPUT': dem, 'MASK': imereti, 'CROP_TO_CUTLINE': True,
        'KEEP_RESOLUTION': True, 'NODATA': -9999, 'OUTPUT': clipped})

    processing.run('gdal:hillshade', {
        'INPUT': clipped, 'BAND': 1, 'Z_FACTOR': 1, 'AZIMUTH': 315,
        'ALTITUDE': 45, 'OUTPUT': base + '/Raster/imereti_hillshade.tif'})
    iface.addRasterLayer(base + '/Raster/imereti_hillshade.tif', 'hillshade')
    ```

---

## ნაწილი 2 (საქაღალდე: `part_2`)

1. `saxli`-ში დაამატეთ სვეტები `X_1` / `Y_1` და PyQGIS-ით გამოთვალეთ კოორდინატები შესაბამისი UTM ზონისა და ფორმულის გამოყენებით. *(ერთ შრეში ოთხივე ფორმულის შედეგი ვერ ჩაეწერება.)*
2. `saxli_1`-ში დაამატეთ `Lat` / `Long` სვეტები და გამოთვალეთ WGS-84 ელიფსოიდის კოორდინატები.
3. გააერთიანეთ `saxli_1` და `saxli`.
4. `srtm_45_04.tif` მოჭერით იმერეთისა და აჭარის რეგიონებით და მიღებული ორი ნაწილი გააერთიანეთ ერთ რასტრად `imereti_achara_dem.tif`.

??? success "ამოხსნა 2.1 – 2.2"
    ```python
    def fill_xy(layer, fx, fy, target_epsg):
        """ავსებს fx, fy სვეტებს კოორდინატებით target CRS-ში."""
        tr = QgsCoordinateTransform(layer.crs(),
              QgsCoordinateReferenceSystem(target_epsg), QgsProject.instance())
        layer.startEditing()
        for f in layer.getFeatures():
            p = tr.transform(f.geometry().asPoint())
            f[fx], f[fy] = p.x(), p.y()
            layer.updateFeature(f)
        layer.commitChanges()

    # X_1/Y_1 - UTM 38N (იმერეთი ~43°E), Lat/Long - WGS 84
    fill_xy(saxli, 'X_1', 'Y_1', 'EPSG:32638')
    fill_xy(saxli_1, 'Long', 'Lat', 'EPSG:4326')
    ```
    > სვეტები ჯერ დაამატეთ `addAttributes`-ით (Double ტიპის).

??? success "ამოხსნა 2.4"
    ```python
    parts = []
    for name in ('Imereti', 'Ajaria'):          # სახელები შეამოწმეთ ცხრილში
        mask = processing.run('native:extractbyexpression', {
            'INPUT': regions, 'EXPRESSION': f'"name_en" = \'{name}\'',
            'OUTPUT': 'memory:'})['OUTPUT']
        out = f'{base}/Raster/{name}_dem.tif'
        processing.run('gdal:cliprasterbymasklayer', {
            'INPUT': dem, 'MASK': mask, 'CROP_TO_CUTLINE': True,
            'NODATA': -9999, 'OUTPUT': out})
        parts.append(out)

    processing.run('gdal:merge', {
        'INPUT': parts, 'NODATA_INPUT': -9999, 'NODATA_OUTPUT': -9999,
        'DATA_TYPE': 5, 'OUTPUT': base + '/Raster/imereti_achara_dem.tif'})
    ```
