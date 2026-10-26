# 📝 დავალება 5

**საჭირო თემები:** [რასტრის სტატისტიკა](../PyQGIS_topics/PyQGIS_Raster_Statistics.md), [რელიეფი](../PyQGIS_topics/PyQGIS_Raster_DEM.md)

**მონაცემები:** `sample_data/practice/task_05/` (`Raster/srtm_45_04.tif`, `shp/geo_regions.shp`)

---

## ნაწილი 1

1. ჩატვირთეთ რასტრი `srtm_45_04` და PyQGIS-ით კონსოლში დაბეჭდეთ `minimumValue`, `maximumValue`, `mean`, `sumOfSquares`.
2. რასტრი გადააკლასიფიცირეთ სამ კლასად:
    - კლასი 1: -5 … 0
    - კლასი 2: 0 … 2000
    - კლასი 3: 2000 … 3500

    შედეგი: `srtm_45_04_reclassified.tif`.
3. ააგეთ ამავე რასტრის ჰისტოგრამა PyQGIS-ით.

??? success "ამოხსნა 1.1"
    ```python
    dem = base + '/Raster/srtm_45_04.tif'
    rl = iface.addRasterLayer(dem, 'srtm_45_04')
    st = rl.dataProvider().bandStatistics(1, QgsRasterBandStats.All)
    print('minimumValue:', st.minimumValue)
    print('maximumValue:', st.maximumValue)
    print('mean:', st.mean)
    print('sumOfSquares:', st.sumOfSquares)
    ```

??? success "ამოხსნა 1.2"
    ```python
    processing.run('native:reclassifybytable', {
        'INPUT_RASTER': rl, 'RASTER_BAND': 1,
        'TABLE': [-5, 0, 1,
                   0, 2000, 2,
                   2000, 3500, 3],
        'NO_DATA': -9999, 'RANGE_BOUNDARIES': 0, 'NODATA_FOR_MISSING': True,
        'DATA_TYPE': 5,
        'OUTPUT': base + '/Raster/srtm_45_04_reclassified.tif'})
    ```

??? success "ამოხსნა 1.3"
    ```python
    import matplotlib.pyplot as plt
    bins = 50
    h = rl.dataProvider().histogram(1, bins, st.minimumValue, st.maximumValue)
    step = (st.maximumValue - st.minimumValue) / bins
    xs = [st.minimumValue + i * step for i in range(bins)]
    plt.bar(xs, h.histogramVector, width=step, align='edge')
    plt.xlabel('Elevation (m)'); plt.ylabel('Pixels')
    plt.savefig(base + '/Raster/histogram.png')
    plt.show()
    ```

---

## ნაწილი 2

1. `srtm_45_04`-დან PyQGIS-ით ამოიღეთ იზოჰიფსები (კონტურები) 200 მ ინტერვალით.
2. `\shp` საქაღალდიდან ჩატვირთეთ `geo_regions.shp`. რასტრი მოჭერით სამეგრელო-ზემო სვანეთის რეგიონით, ააგეთ მოჭრილი რასტრის ჰისტოგრამა და შედეგს დაარქვით `Samegrelo_z_s.tif`.
3. კონსოლში დაბეჭდეთ `Samegrelo_z_s.tif`-ის სტრიქონებისა და სვეტების რაოდენობა.

??? success "ამოხსნა 2.1"
    ```python
    processing.run('gdal:contour', {
        'INPUT': dem, 'BAND': 1, 'INTERVAL': 200, 'FIELD_NAME': 'ELEV',
        'OUTPUT': base + '/shp/contours_200.shp'})
    ```

??? success "ამოხსნა 2.2 – 2.3"
    ```python
    regions = QgsVectorLayer(base + '/shp/geo_regions.shp', 'geo_regions', 'ogr')
    mask = processing.run('native:extractbyexpression', {
        'INPUT': regions,
        'EXPRESSION': '"name_en" = \'Samegrelo-Zemo Svaneti\'',  # შეამოწმეთ ცხრილში
        'OUTPUT': 'memory:'})['OUTPUT']

    out = base + '/Raster/Samegrelo_z_s.tif'
    processing.run('gdal:cliprasterbymasklayer', {
        'INPUT': dem, 'MASK': mask, 'CROP_TO_CUTLINE': True,
        'NODATA': -9999, 'OUTPUT': out})

    clip = QgsRasterLayer(out, 'Samegrelo_z_s')
    print('rows:', clip.height(), 'columns:', clip.width())
    ```
    ჰისტოგრამისთვის გამოიყენეთ იგივე კოდი, რაც ამოხსნა 1.3-ში, `rl`-ის ნაცვლად `clip`-ით.
