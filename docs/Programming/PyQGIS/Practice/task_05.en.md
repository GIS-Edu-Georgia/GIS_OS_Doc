# 📝 Assignment 5

**Required topics:** [Raster statistics](../PyQGIS_topics/PyQGIS_Raster_Statistics.md), [Terrain](../PyQGIS_topics/PyQGIS_Raster_DEM.md)

**Data:** `sample_data/practice/task_05/` (`Raster/srtm_45_04.tif`, `shp/geo_regions.shp`)

---

## Part 1

1. Load the raster `srtm_45_04` and use PyQGIS to print `minimumValue`, `maximumValue`, `mean`, `sumOfSquares` in the console.
2. Reclassify the raster into three classes:
    - class 1: -5 … 0
    - class 2: 0 … 2000
    - class 3: 2000 … 3500

    Result: `srtm_45_04_reclassified.tif`.
3. Build a histogram of the same raster with PyQGIS.

??? success "Solution 1.1"
    ```python
    dem = base + '/Raster/srtm_45_04.tif'
    rl = iface.addRasterLayer(dem, 'srtm_45_04')
    st = rl.dataProvider().bandStatistics(1, QgsRasterBandStats.All)
    print('minimumValue:', st.minimumValue)
    print('maximumValue:', st.maximumValue)
    print('mean:', st.mean)
    print('sumOfSquares:', st.sumOfSquares)
    ```

??? success "Solution 1.2"
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

??? success "Solution 1.3"
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

## Part 2

1. Use PyQGIS to extract contour lines from `srtm_45_04` at a 200 m interval.
2. Load `geo_regions.shp` from the `\shp` folder. Clip the raster with the Samegrelo-Zemo Svaneti region, build a histogram of the clipped raster and name the result `Samegrelo_z_s.tif`.
3. Print the number of rows and columns of `Samegrelo_z_s.tif` in the console.

??? success "Solution 2.1"
    ```python
    processing.run('gdal:contour', {
        'INPUT': dem, 'BAND': 1, 'INTERVAL': 200, 'FIELD_NAME': 'ELEV',
        'OUTPUT': base + '/shp/contours_200.shp'})
    ```

??? success "Solution 2.2 – 2.3"
    ```python
    regions = QgsVectorLayer(base + '/shp/geo_regions.shp', 'geo_regions', 'ogr')
    mask = processing.run('native:extractbyexpression', {
        'INPUT': regions,
        'EXPRESSION': '"name_en" = \'Samegrelo-Zemo Svaneti\'',  # check in the table
        'OUTPUT': 'memory:'})['OUTPUT']

    out = base + '/Raster/Samegrelo_z_s.tif'
    processing.run('gdal:cliprasterbymasklayer', {
        'INPUT': dem, 'MASK': mask, 'CROP_TO_CUTLINE': True,
        'NODATA': -9999, 'OUTPUT': out})

    clip = QgsRasterLayer(out, 'Samegrelo_z_s')
    print('rows:', clip.height(), 'columns:', clip.width())
    ```
    For the histogram, use the same code as in Solution 1.3, with `clip` instead of `rl`.
