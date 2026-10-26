# 🔭 LOD და Frustum culling

3D რუკაზე ეკრანზე ყოველთვის გაცილებით ნაკლები გვჭირდება, ვიდრე მონაცემებშია. ორი ტექნიკა ამ მიზანს ემსახურება:

- **Frustum culling** გამორიცხავს იმას, რაც კამერის ხედვის არეში **საერთოდ არ ხვდება**.
- **LOD** (Level of Detail) იმას, რაც ხვდება, სხვადასხვა დეტალიზაციით ხატავს: ახლოს მაღალით, შორს დაბალით.

ორივე **Quadtree**-ს ეყრდნობა: [Quadtree-ს გვერდი](quadtree.md) წინასწარ წაიკითხეთ.

---

## 🎮 სცადეთ თქვენც

ზემოდან ხედია: კამერა ლურჯი წერტილია, წითელი წყვეტილი სამკუთხედი მისი ხედვის არეა. ფერი გვიჩვენებს ტაილის დონეს. გადაათრიეთ კამერა, შეცვალეთ მიმართულება და სიმაღლე, გამორთეთ LOD ან culling და შეადარეთ არჩეული ტაილების რაოდენობა.

<iframe src="../widgets/lod.html" title="LOD და Frustum culling-ის ინტერაქტიული დემო" style="width:100%;height:780px;border:0" loading="lazy"></iframe>

!!! tip "დაკვირვება"
    - კამერასთან ახლოს ტაილები წვრილია, შორს მსხვილი, მაგრამ ეკრანზე ყველა დაახლოებით ერთი ზომისაა.
    - ხედვის არის მიღმა დარჩენილი ტერიტორია მთლიანად ქრება: ხის მთელი ტოტები არ განიხილება.
    - „ზღვრის" შემცირება დეტალიზაციას ზრდის და ტაილების რაოდენობაც სწრაფად იზრდება.
    - კამერის სიმაღლის გაზრდა დეტალიზაციას ამცირებს: კამერა შორსაა.

---

## 📏 LOD: როდის გავყოთ ტაილი?

თითო ტაილს აქვს **გეომეტრიული შეცდომა** `ε`: რა სიდიდის სხვაობაა ტაილსა და სრულ დეტალიზაციას შორის რეალურ მეტრებში. 256×256 ტექსტურიან ტაილზე ის დაახლოებით ერთი პიქსელის ზომაა: `ε = ზომა / 256`.

რაც უფრო შორსაა კამერა, მით პატარად ჩანს ეს შეცდომა. ეკრანზე მისი ზომა (**screen-space error**, SSE):

```text
ρ = ε · W / (2 · d · tan(FOV / 2))
```

სადაც `W` ეკრანის სიგანე პიქსელებშია, `d` მანძილი კამერიდან ტაილამდე, `FOV` ხედვის კუთხე.

**წესი:** თუ `ρ ≤ ზღვარი` (მაგ. 8 პიქსელი), ტაილი საკმარისად კარგია და ვხატავთ. თუ არა, ვყოფთ 4 შვილად და იგივეს თითოეულისთვის ვამოწმებთ.

---

## ✂️ Frustum culling

**Frustum** არის კამერის ხედვის ამოკვეთილი პირამიდა. ტაილი უნდა გამოვრიცხოთ, თუ ის მთლიანად პირამიდის გარეთაა.

- **2D (ზემოდან):** ხედვის არე სამკუთხედია. ვამოწმებთ, კვეთს თუ არა ის ტაილის მართკუთხედს. ამისთვის ვიყენებთ **გამყოფი ღერძის თეორემას (SAT)**: თუ რომელიმე წრფეზე პროექციები არ გადაიფარება, ფიგურები არ იკვეთება.
- **3D:** პირამიდა 6 სიბრტყეა. ტაილის ყუთს (AABB) თითო სიბრტყესთან ვამოწმებთ: თუ ყუთი ერთ-ერთის გარეთ მთლიანად არის, ის ხილული არ არის.

---

## 🐍 რეალიზაცია სუფთა Python-ით

```python title="lod.py" linenums="1"
import math


def sse(geometric_error, distance, viewport_px=1080, fov_deg=60):
    """ეკრანული შეცდომა პიქსელებში (screen-space error)."""
    return geometric_error * viewport_px / (2 * distance * math.tan(math.radians(fov_deg) / 2))


class Camera:
    def __init__(self, x, y, height, heading_deg, fov_deg=60, far=600):
        self.x, self.y, self.height = x, y, height
        self.heading = math.radians(heading_deg)
        self.fov = fov_deg
        self.far = far

    def frustum_polygon(self):
        """ხედვის არე ზემოდან: სამკუთხედი (კამერა + ორი შორეული წერტილი)."""
        half = math.radians(self.fov) / 2
        pts = [(self.x, self.y)]
        for a in (self.heading - half, self.heading + half):
            pts.append((self.x + self.far * math.cos(a), self.y + self.far * math.sin(a)))
        return pts


def rect_hits_polygon(rect, poly):
    """მართკუთხედი და ამოზნექილი მრავალკუთხედი იკვეთება თუ არა (SAT)."""
    minx, miny, maxx, maxy = rect
    corners = [(minx, miny), (maxx, miny), (maxx, maxy), (minx, maxy)]
    axes = [(1, 0), (0, 1)]
    for i in range(len(poly)):
        (x1, y1), (x2, y2) = poly[i], poly[(i + 1) % len(poly)]
        axes.append((y1 - y2, x2 - x1))          # წიბოს ნორმალი
    for ax, ay in axes:
        a = [ax * x + ay * y for x, y in corners]
        b = [ax * x + ay * y for x, y in poly]
        if max(a) < min(b) or max(b) < min(a):
            return False                          # გამყოფი ღერძი ნაპოვნია
    return True


def distance_to_tile(cam, rect):
    minx, miny, maxx, maxy = rect
    dx = max(minx - cam.x, 0, cam.x - maxx)
    dy = max(miny - cam.y, 0, cam.y - maxy)
    return math.sqrt(dx * dx + dy * dy + cam.height ** 2)


def select_tiles(cam, rect, level=0, max_level=8, threshold=8, tex=256,
                 viewport_px=1080, out=None, stats=None):
    """ზევიდან ქვევით ირჩევს ტაილებს: culling + LOD."""
    out = [] if out is None else out
    stats = {'culled': 0} if stats is None else stats
    if not rect_hits_polygon(rect, cam.frustum_polygon()):
        stats['culled'] += 1
        return out, stats
    size = rect[2] - rect[0]
    err = size / tex                              # ტაილის გეომეტრიული შეცდომა
    if level == max_level or sse(err, distance_to_tile(cam, rect), viewport_px, cam.fov) <= threshold:
        out.append((rect, level))
        return out, stats
    minx, miny, maxx, maxy = rect
    mx, my = (minx + maxx) / 2, (miny + maxy) / 2
    for r in ((minx, miny, mx, my), (mx, miny, maxx, my),
              (minx, my, mx, maxy), (mx, my, maxx, maxy)):
        select_tiles(cam, r, level + 1, max_level, threshold, tex, viewport_px, out, stats)
    return out, stats
```

### გამოყენება

```python
world = (0, 0, 1000, 1000)
cam = Camera(x=500, y=100, height=40, heading_deg=90, fov_deg=60, far=600)

for threshold in (32, 8, 2):
    tiles, stats = select_tiles(cam, world, threshold=threshold, max_level=9)
    print(f"ზღვარი {threshold:>2}px: {len(tiles):>3} ტაილი, გამორიცხული ტოტი: {stats['culled']}")
```

```text
ზღვარი 32px:   6 ტაილი, გამორიცხული ტოტი: 4
ზღვარი  8px:  12 ტაილი, გამორიცხული ტოტი: 16
ზღვარი  2px:  48 ტაილი, გამორიცხული ტოტი: 46
```

### 3D: სიბრტყე და AABB

```python title="frustum3d.py"
def box_outside_plane(box, plane):
    """ყუთი სიბრტყის გარეთაა? plane = (a, b, c, d), შიგნით: a*x+b*y+c*z+d >= 0."""
    minx, miny, minz, maxx, maxy, maxz = box
    a, b, c, d = plane
    # სიბრტყის ნორმალისკენ ყველაზე წინ წასული წვერო (p-vertex)
    px = maxx if a >= 0 else minx
    py = maxy if b >= 0 else miny
    pz = maxz if c >= 0 else minz
    return a * px + b * py + c * pz + d < 0


def box_in_frustum(box, planes):
    return not any(box_outside_plane(box, p) for p in planes)
```

საკმარისია ყველაზე „შორს წასული" წვეროს შემოწმება: თუ ისიც გარეთაა, მთელი ყუთი გარეთაა. ეს მხოლოდ 1 წერტილია 8-ის ნაცვლად.

---

## 🧰 იგივე PyQGIS-ით

არჩეული ტაილები QGIS-ში პოლიგონებად დავხატოთ, `level` ატრიბუტით:

```python
layer = QgsVectorLayer('Polygon?crs=EPSG:3857&field=level:integer', 'selected_tiles', 'memory')
pr = layer.dataProvider()

for (minx, miny, maxx, maxy), level in tiles:
    f = QgsFeature(layer.fields())
    f.setGeometry(QgsGeometry.fromRect(QgsRectangle(minx, miny, maxx, maxy)))
    f['level'] = level
    pr.addFeature(f)

QgsProject.instance().addMapLayer(layer)
```

შემდეგ `level`-ის მიხედვით კატეგორიზებული სიმბოლოგია ამოატრიალებს იმავე სურათს, რასაც ზემოთ დემო აჩვენებს. `world` და კამერის კოორდინატები ამ მაგალითში პირობითი ერთეულებია. რეალური რუკისთვის ისინი EPSG:3857-ის მეტრებში უნდა მიუთითოთ.

---

## ⚠️ რეალური სისტემების დამატებითი პრობლემები

- **ნაპრალები (cracks):** მეზობელ ტაილებს განსხვავებული დონე რომ ჰქონდეთ, საზღვარზე ბადეები ერთმანეთს არ ემთხვევა. ამას „skirt"-ით (ტაილის კიდეზე ჩამოშვებული ვერტიკალური ზოლი) ან ბადის შეკვრა აგვარებს.
- **ხტუნვა (popping):** დონის შეცვლისას კადრი შეიძლება მკვეთრად შეიცვალოს. ამიტომ ხშირად ორ დონეს შორის ვაკეთებთ გლუვ გადასვლას (blending/morphing).
- **ასინქრონული ჩატვირთვა:** ახალი ტაილი ჯერ ქსელიდან უნდა მოვიდეს. სანამ მოვა, მშობლის ტაილი რჩება ეკრანზე.
- **კეშირება:** ერთხელ ჩატვირთული ტაილები cache-ში ინახება, რომ კამერის უმნიშვნელო გადაადგილებისას თავიდან არ ჩაიტვირთოს.

---

## 📝 დავალებები

!!! question "დავალება 1"
    ცხრილის სახით გამოიტანეთ, როგორ იცვლება არჩეული ტაილების რაოდენობა ზღვრის (`1, 2, 4, 8, 16, 32` პიქსელი) შესაბამისად `culling`-ით და მის გარეშე. Culling-ის გამოსართავად დროებით ჩაანაცვლეთ `lod.rect_hits_polygon` ფუნქცია, რომელიც ყოველთვის `True`-ს აბრუნებს.

    ??? success "ამოხსნა"
        ```python
        import lod

        original = lod.rect_hits_polygon
        world = (0, 0, 1000, 1000)
        cam = lod.Camera(500, 100, 40, 90, 60, 600)

        print('ზღვარი | culling-ით | culling-ის გარეშე')
        for thr in (1, 2, 4, 8, 16, 32):
            lod.rect_hits_polygon = original
            a = len(lod.select_tiles(cam, world, threshold=thr, max_level=9)[0])
            lod.rect_hits_polygon = lambda r, p: True      # culling გამორთულია
            b = len(lod.select_tiles(cam, world, threshold=thr, max_level=9)[0])
            print(f'{thr:>6} | {a:>10} | {b:>17}')
        lod.rect_hits_polygon = original
        ```
        დააკვირდით: culling-ის გარეშე ტაილების რაოდენობა გაცილებით მეტია, რადგან კამერის უკან მყოფი ტერიტორიაც იტვირთება.

!!! question "დავალება 2"
    ააგეთ 3D ხედვის პირამიდის 6 სიბრტყე ორთოგრაფიული (ყუთისებრი) კამერისთვის `x ∈ [0, 10]`, `y ∈ [0, 10]`, `z ∈ [0, 100]` და შეამოწმეთ `box_in_frustum` ოთხ ყუთზე: შიგნით, გარეთ, ნაწილობრივ გადაფარული და კიდეზე მიჯრილი.

    ??? success "ამოხსნა"
        ```python
        planes = [
            ( 1, 0, 0,   0),   # x >= 0
            (-1, 0, 0,  10),   # x <= 10
            ( 0, 1, 0,   0),   # y >= 0
            ( 0,-1, 0,  10),   # y <= 10
            ( 0, 0, 1,   0),   # z >= 0
            ( 0, 0,-1, 100),   # z <= 100
        ]
        tests = {
            'შიგნით':        (2, 2, 2, 4, 4, 4),
            'გარეთ':         (20, 2, 2, 25, 4, 4),
            'ნაწილობრივ':    (8, 2, 2, 14, 4, 4),
            'კიდეზე':        (10, 2, 2, 12, 4, 4),
        }
        for name, box in tests.items():
            print(name, box_in_frustum(box, planes))
        ```
        შედეგი: `True`, `False`, `True`, `True`. მნიშვნელოვანია: „ნაწილობრივ" ყუთი **არ** გამოირიცხება.

!!! question "დავალება 3"
    სცადეთ `select_tiles`-ში `tex` პარამეტრის ცვლილება (128, 256, 512). რა მოუვა არჩეული ტაილების რაოდენობას და რატომ?

    ??? success "ამოხსნა"
        ```python
        for tex in (128, 256, 512):
            tiles, _ = select_tiles(cam, world, threshold=8, tex=tex, max_level=9)
            print(tex, len(tiles))
        ```
        `tex` მეტი → ტაილის გეომეტრიული შეცდომა `ε = ზომა / tex` მცირეა → ტაილი უფრო ადრე „საკმარისად კარგი" გამოდის → მოითხოვება ნაკლები ტაილი. ამიტომ 512 პიქსელიანი ტაილები ნაკლები რაოდენობით გვჭირდება, თუმცა თითოეული უფრო მძიმეა.
