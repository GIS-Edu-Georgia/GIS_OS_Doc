# 🧱 Tile pyramid (XYZ)

Web maps (Google Maps, OpenStreetMap, Mapbox) never load the whole Earth. The map is cut in advance into thousands of small square images, **tiles**, and the browser requests only the ones visible on screen. This scheme is called a **tile pyramid**, and it is a direct application of the [Quadtree](quadtree.md).

---

## 💡 The idea

- **z = 0:** the whole Earth is on one tile (256×256 pixels).
- **z = 1:** 2×2 = 4 tiles. **z = 2:** 4×4 = 16 tiles, and so on.
- In general, level **z** has `2^z × 2^z = 4^z` tiles.
- Each tile is identified by three numbers: **z/x/y**. `x` grows from left to right, `y` from top to bottom.
- A tile URL usually looks like this: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`.

The pyramid works because every level doubles the detail of the previous one exactly. The browser picks the z that matches the zoom ([LOD](lod_frustum.md)) and loads only the visible tiles ([culling](lod_frustum.md#frustum_culling)).

---

## 🎮 Try it yourself

Move the mouse over the map: you can see which tile you are in, what its quadkey is, and how many metres one pixel covers. The territory of Georgia is highlighted in red: see how many tiles it takes to cover it at each zoom.

<iframe src="../widgets/tiles.html" title="XYZ tiles interactive demo" style="width:100%;height:640px;border:0" loading="lazy"></iframe>

!!! tip "Observation"
    - The lines of latitude move apart towards the poles. **Web Mercator** preserves angles but distorts areas.
    - The number of tiles grows **4 times** with each z, but a single pixel shrinks only **2 times**.
    - The map is cut off at latitude 85.05° so that it comes out square.

---

## 📐 Formulas

```text
n = 2^z

x = floor( (lon + 180) / 360 * n )
y = floor( (1 - asinh(tan(lat)) / π) / 2 * n )          # lat in radians

lon = x / n * 360 - 180
lat = atan( sinh( π * (1 - 2 * y / n) ) )               # result in radians

metres/pixel = 2π · R · cos(lat) / (256 · 2^z)          # R = 6 378 137 m
```

---

## 🐍 Implementation in pure Python

```python title="tiles.py" linenums="1"
import math

MAX_LAT = 85.0511287798          # Web Mercator cut-off latitude
EARTH_R = 6378137                # metres (WGS84 semi-major axis)


def lonlat_to_tile(lon, lat, z):
    """WGS84 -> XYZ tile (x from the left, y from the top)."""
    lat = max(-MAX_LAT, min(MAX_LAT, lat))
    n = 2 ** z
    x = int((lon + 180) / 360 * n)
    y = int((1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n)
    return min(x, n - 1), min(y, n - 1)


def tile_bounds(x, y, z):
    """Tile bounds in degrees: (west, south, east, north)."""
    n = 2 ** z
    west = x / n * 360 - 180
    east = (x + 1) / n * 360 - 180
    north = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y / n))))
    south = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * (y + 1) / n))))
    return west, south, east, north


def resolution(lat, z, tile_px=256):
    """Metres per pixel at a given latitude and zoom."""
    return 2 * math.pi * EARTH_R * math.cos(math.radians(lat)) / (tile_px * 2 ** z)


def tiles_for_bbox(west, south, east, north, z):
    """All tiles that cover the bbox."""
    x0, y1 = lonlat_to_tile(west, south, z)      # bottom-left
    x1, y0 = lonlat_to_tile(east, north, z)      # top-right
    return [(x, y, z) for x in range(x0, x1 + 1) for y in range(y0, y1 + 1)]


def xyz_to_tms(y, z):
    """XYZ <-> TMS: flip the y axis."""
    return 2 ** z - 1 - y
```

### Usage

```python
GEORGIA = (40.0, 41.05, 46.75, 43.6)    # west, south, east, north

x, y = lonlat_to_tile(44.8, 41.7, 10)
print(x, y, tile_bounds(x, y, 10))

for z in (5, 8, 10, 12):
    print(z, len(tiles_for_bbox(*GEORGIA, z)), round(resolution(42, z), 1), 'm/pixel')
```

```text
639 381 (44.6484375, 41.50857729743934, 45.0, 41.77131167976406)
5 2 3635.4 m/pixel
8 18 454.4 m/pixel
10 220 113.6 m/pixel
12 3080 28.4 m/pixel
```

!!! info "XYZ and TMS"
    In some systems (TMS, MBTiles) `y` is counted from the bottom up. The conversion is simple: `y_tms = 2^z - 1 - y_xyz` (`xyz_to_tms`). If your tiles show up "upside down", this is the first thing to suspect.

---

## 🧰 The same with PyQGIS

Adding an XYZ layer in QGIS takes one line:

```python
url = 'type=xyz&url=https://tile.openstreetmap.org/{z}/{x}/{y}.png&zmax=19&zmin=0'
layer = QgsRasterLayer(url, 'OpenStreetMap', 'wms')
QgsProject.instance().addMapLayer(layer)
```

!!! warning "OSM tile usage policy"
    `tile.openstreetmap.org` is a public server and bulk downloading is forbidden. Downloading a few tiles for learning purposes is acceptable if the request has a `User-Agent` and you do not overload the server. For large volumes, use your own tile server or MBTiles.

---

## 📝 Exercises

!!! question "Exercise 1"
    Write `lonlat_to_pixel(lon, lat, z)` that returns the point's **pixel coordinate inside the tile** (0–255) and the tile's `(x, y)`. Compute the pixel for Tbilisi (41.6938, 44.8015) at level 12.

    ??? success "Solution"
        ```python
        import math

        def lonlat_to_pixel(lon, lat, z, tile_px=256):
            lat = max(-MAX_LAT, min(MAX_LAT, lat))
            n = 2 ** z
            fx = (lon + 180) / 360 * n
            fy = (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n
            x, y = int(fx), int(fy)
            return (x, y), (int((fx - x) * tile_px), int((fy - y) * tile_px))

        print(lonlat_to_pixel(44.8015, 41.6938, 12))
        ```

!!! question "Exercise 2"
    Compute how many tiles the territory of Georgia needs in total across all levels from 0 to 14. If one tile is 15 KB on average, how many megabytes is that?

    ??? success "Solution"
        ```python
        total = sum(len(tiles_for_bbox(*GEORGIA, z)) for z in range(0, 15))
        print(total, 'tiles', round(total * 15 / 1024), 'MB')
        ```
        Result: about 65,050 tiles, ~950 MB.

        The last level makes up almost the whole total: at z=14 there are roughly 4 times as many tiles as at z=13, so the total is roughly 4/3 of z=14.

!!! question "Exercise 3"
    Create a memory layer in QGIS and draw the tiles covering Georgia at z=8 (in EPSG:3857). Check by hand that the Tbilisi point falls inside one of the tiles.

    ??? success "Solution"
        ```python
        import math
        ORIGIN = math.pi * EARTH_R                     # 20037508.34 m

        def tile_bounds_3857(x, y, z):
            size = 2 * ORIGIN / 2 ** z
            minx = -ORIGIN + x * size
            maxy = ORIGIN - y * size
            return minx, maxy - size, minx + size, maxy

        layer = QgsVectorLayer('Polygon?crs=EPSG:3857&field=zxy:string', 'tiles_z8', 'memory')
        pr = layer.dataProvider()
        for x, y, z in tiles_for_bbox(*GEORGIA, 8):
            f = QgsFeature(layer.fields())
            f.setGeometry(QgsGeometry.fromRect(QgsRectangle(*tile_bounds_3857(x, y, z))))
            f['zxy'] = f'{z}/{x}/{y}'
            pr.addFeature(f)
        QgsProject.instance().addMapLayer(layer)

        # check: Tbilisi
        tr = QgsCoordinateTransform(QgsCoordinateReferenceSystem('EPSG:4326'),
                                    QgsCoordinateReferenceSystem('EPSG:3857'), QgsProject.instance())
        p = tr.transform(QgsPointXY(44.8015, 41.6938))
        print(any(f.geometry().contains(QgsGeometry.fromPointXY(p)) for f in layer.getFeatures()))
        ```
