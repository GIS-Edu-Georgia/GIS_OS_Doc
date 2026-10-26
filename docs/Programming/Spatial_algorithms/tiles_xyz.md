# 🧱 ტაილების პირამიდა (XYZ)

ვებ-რუკები (Google Maps, OpenStreetMap, Mapbox) მთელ დედამიწას არასოდეს ტვირთავენ. რუკა წინასწარ დაჭრილია ათასობით პატარა კვადრატულ სურათად, **ტაილად**, და ბრაუზერი მხოლოდ ეკრანზე ხილულებს ითხოვს. ამ სქემას **ტაილების პირამიდა** ჰქვია და ის [Quadtree](quadtree.md)-ის პირდაპირი გამოყენებაა.

---

## 💡 იდეა

- **z = 0:** მთელი დედამიწა ერთ ტაილზეა (256×256 პიქსელი).
- **z = 1:** 2×2 = 4 ტაილი. **z = 2:** 4×4 = 16 ტაილი და ასე შემდეგ.
- ზოგადად **z** დონეზე `2^z × 2^z = 4^z` ტაილია.
- თითო ტაილს სამი რიცხვი განსაზღვრავს: **z/x/y**. `x` მარცხნიდან მარჯვნივ, `y` ზემოდან ქვემოთ იზრდება.
- ტაილის URL ჩვეულებრივ ასეთია: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`.

ეს პირამიდა იმიტომ მუშაობს, რომ ყოველი დონე წინა დონის დეტალიზაციას ზუსტად 2-ჯერ ზრდის. ბრაუზერი ზუმის შესაბამის z-ს არჩევს ([LOD](lod_frustum.md)) და მხოლოდ ხილულ ტაილებს იტვირთავს ([culling](lod_frustum.md#frustum-culling)).

---

## 🎮 სცადეთ თქვენც

გადაატარეთ მაუსი რუკაზე: ჩანს, რომელ ტაილში ხართ, რა არის მისი quadkey და რამდენ მეტრს ფარავს ერთი პიქსელი. წითლად გამოკვეთილია საქართველოს ტერიტორია: ნახეთ, რამდენი ტაილი სჭირდება მის დასაფარად თითო zoom-ზე.

<iframe src="../widgets/tiles.html" title="XYZ ტაილების ინტერაქტიული დემო" style="width:100%;height:640px;border:0" loading="lazy"></iframe>

!!! tip "დაკვირვება"
    - განედების ხაზები პოლუსებთან ერთმანეთს შორდება. **Web Mercator** კუთხეებს ინახავს, ფართობებს კი ამახინჯებს.
    - ტაილების რაოდენობა ყოველ z-ზე **4-ჯერ** იზრდება, მაგრამ ერთი პიქსელი **2-ჯერ** მცირდება.
    - რუკა 85.05° განედზე წყდება, რათა ის კვადრატი გამოვიდეს.

---

## 📐 ფორმულები

```text
n = 2^z

x = floor( (lon + 180) / 360 * n )
y = floor( (1 - asinh(tan(lat)) / π) / 2 * n )          # lat რადიანებში

lon = x / n * 360 - 180
lat = atan( sinh( π * (1 - 2 * y / n) ) )               # შედეგი რადიანებში

მეტრი/პიქსელი = 2π · R · cos(lat) / (256 · 2^z)       # R = 6 378 137 მ
```

---

## 🐍 რეალიზაცია სუფთა Python-ით

```python title="tiles.py" linenums="1"
import math

MAX_LAT = 85.0511287798          # Web Mercator-ის ჩამოჭრის განედი
EARTH_R = 6378137                # მეტრი (WGS84 ნახევარღერძი)


def lonlat_to_tile(lon, lat, z):
    """WGS84 -> XYZ ტაილი (x მარცხნიდან, y ზემოდან)."""
    lat = max(-MAX_LAT, min(MAX_LAT, lat))
    n = 2 ** z
    x = int((lon + 180) / 360 * n)
    y = int((1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n)
    return min(x, n - 1), min(y, n - 1)


def tile_bounds(x, y, z):
    """ტაილის საზღვრები გრადუსებში: (west, south, east, north)."""
    n = 2 ** z
    west = x / n * 360 - 180
    east = (x + 1) / n * 360 - 180
    north = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y / n))))
    south = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * (y + 1) / n))))
    return west, south, east, north


def resolution(lat, z, tile_px=256):
    """მეტრი ერთ პიქსელზე მოცემულ განედზე და zoom-ზე."""
    return 2 * math.pi * EARTH_R * math.cos(math.radians(lat)) / (tile_px * 2 ** z)


def tiles_for_bbox(west, south, east, north, z):
    """ყველა ტაილი, რომელიც bbox-ს ფარავს."""
    x0, y1 = lonlat_to_tile(west, south, z)      # მარცხენა-ქვედა
    x1, y0 = lonlat_to_tile(east, north, z)      # მარჯვენა-ზედა
    return [(x, y, z) for x in range(x0, x1 + 1) for y in range(y0, y1 + 1)]


def xyz_to_tms(y, z):
    """XYZ <-> TMS: y ღერძის გადაბრუნება."""
    return 2 ** z - 1 - y
```

### გამოყენება

```python
GEORGIA = (40.0, 41.05, 46.75, 43.6)    # west, south, east, north

x, y = lonlat_to_tile(44.8, 41.7, 10)
print(x, y, tile_bounds(x, y, 10))

for z in (5, 8, 10, 12):
    print(z, len(tiles_for_bbox(*GEORGIA, z)), round(resolution(42, z), 1), 'მ/პიქსელი')
```

```text
639 381 (44.6484375, 41.50857729743934, 45.0, 41.77131167976406)
5 2 3635.4 მ/პიქსელი
8 18 454.4 მ/პიქსელი
10 220 113.6 მ/პიქსელი
12 3080 28.4 მ/პიქსელი
```

!!! info "XYZ და TMS"
    ზოგ სისტემაში (TMS, MBTiles) `y` ქვემოდან ზემოთ ითვლება. კონვერტაცია მარტივია: `y_tms = 2^z - 1 - y_xyz` (`xyz_to_tms`). თუ ტაილები „თავდაყირა" გამოჩნდა, ეს პირველი ეჭვია.

---

## 🧰 იგივე PyQGIS-ით

QGIS-ში XYZ ფენის დამატება ერთი ხაზია:

```python
url = 'type=xyz&url=https://tile.openstreetmap.org/{z}/{x}/{y}.png&zmax=19&zmin=0'
layer = QgsRasterLayer(url, 'OpenStreetMap', 'wms')
QgsProject.instance().addMapLayer(layer)
```

!!! warning "OSM ტაილების გამოყენების წესები"
    `tile.openstreetmap.org` საჯარო სერვერია და მასიური ჩამოტვირთვა აკრძალულია. სასწავლო მიზნით რამდენიმე ტაილის ჩამოტვირთვა დასაშვებია, თუ მოთხოვნას `User-Agent` აქვს და სერვერს არ ტვირთავთ. დიდი ოდენობისთვის გამოიყენეთ საკუთარი ტაილ-სერვერი ან MBTiles.

---

## 📝 დავალებები

!!! question "დავალება 1"
    დაწერეთ `lonlat_to_pixel(lon, lat, z)`, რომელიც აბრუნებს წერტილის **პიქსელურ კოორდინატს ტაილის შიგნით** (0–255) და ტაილის `(x, y)`. გამოთვალეთ თბილისის (41.6938, 44.8015) პიქსელი 12 დონეზე.

    ??? success "ამოხსნა"
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

!!! question "დავალება 2"
    გამოთვალეთ, რამდენი ტაილი სჭირდება საქართველოს ტერიტორიას 0-დან 14-მდე ყველა დონეზე ჯამში. თუ ერთი ტაილი საშუალოდ 15 KB-ია, რამდენი მეგაბაიტი გამოვა?

    ??? success "ამოხსნა"
        ```python
        total = sum(len(tiles_for_bbox(*GEORGIA, z)) for z in range(0, 15))
        print(total, 'ტაილი', round(total * 15 / 1024), 'MB')
        ```
        შედეგი: დაახლოებით 65 050 ტაილი, ~950 MB.

        ბოლო დონე თითქმის მთელ ჯამს ქმნის: z=14-ზე ტაილების რაოდენობა z=13-ის დაახლოებით 4-ჯერ მეტია, ამიტომ ჯამი z=14-ის დაახლოებით 4/3-ია.

!!! question "დავალება 3"
    QGIS-ში შექმენით მეხსიერების ფენა და დახატეთ საქართველოს დამფარავი ტაილები z=8-ზე (EPSG:3857-ში). ხელით გადაამოწმეთ, რომ თბილისის წერტილი ერთ-ერთი ტაილის შიგნით ხვდება.

    ??? success "ამოხსნა"
        ```python
        import math
        ORIGIN = math.pi * EARTH_R                     # 20037508.34 მ

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

        # შემოწმება: თბილისი
        tr = QgsCoordinateTransform(QgsCoordinateReferenceSystem('EPSG:4326'),
                                    QgsCoordinateReferenceSystem('EPSG:3857'), QgsProject.instance())
        p = tr.transform(QgsPointXY(44.8015, 41.6938))
        print(any(f.geometry().contains(QgsGeometry.fromPointXY(p)) for f in layer.getFeatures()))
        ```
