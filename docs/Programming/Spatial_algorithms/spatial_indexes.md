# 🗂️ სივრცითი ინდექსები: k-d tree, R-tree, Geohash

[Quadtree](quadtree.md) სივრცითი ინდექსის ერთადერთი ვარიანტი არ არის. თითოეული სტრუქტურა სხვადასხვა ამოცანას უკეთ ერგება, ამიტომ GIS-ში რამდენიმე მათგანს ხვდებით.

| სტრუქტურა | ინახავს | ძირითადი ძალა | სად გვხვდება |
|---|---|---|---|
| **Quadtree** | წერტილებს, უჯრებს | მარტივია, ტაილებს უკავშირდება | ვებ-რუკები, რასტრები |
| **k-d tree** | წერტილებს | უახლოესი მეზობელი | scikit-learn, KDTree |
| **R-tree** | მართკუთხედებს (ხაზებს, პოლიგონებს) | ობიექტების bbox-ებზე ძებნა | PostGIS (GiST), QGIS, GeoPackage |
| **Geohash** | წერტილებს (სტრიქონი) | სტრიქონული პრეფიქსი, ბაზა-მეგობრული | Redis, Elasticsearch, MongoDB |

---

## 🎮 სცადეთ თქვენც

**k-d tree:** დაამატეთ წერტილები და გადაატარეთ მაუსი: წითელი ხაზი უახლოეს წერტილზე მიდის, ქვემოთ კი ჩანს, რამდენი კვანძი შეამოწმა ხემ. **Geohash:** გადართეთ რეჟიმი, გადაატარეთ მაუსი საქართველოზე და შეცვალეთ კოდის სიგრძე.

<iframe src="../widgets/indexes.html" title="k-d tree და Geohash-ის ინტერაქტიული დემო" style="width:100%;height:700px;border:0" loading="lazy"></iframe>

---

## 🔹 k-d tree

**იდეა:** ყოველ დონეზე ერთი კოორდინატის მედიანით ვყოფთ წერტილებს: ერთხელ x-ით, შემდეგ y-ით, შემდეგ ისევ x-ით და ა.შ. ხე **დაბალანსებულია** და წერტილის ჩასმას არ საჭიროებს, ამიტომ მხოლოდ **სტატიკური** მონაცემებისთვის კარგია.

**უახლოესი მეზობელი:** ჯერ იმ მხარეს ჩავდივართ, სადაც სამიზნე წერტილია. შემდეგ ვამოწმებთ: ამ წერტილიდან **გამყოფ წრფემდე** მანძილი მიღებულ საუკეთესო მანძილზე მცირეა თუ არა. თუ მცირეა, მეორე ტოტიც უნდა შევამოწმოთ. თუ არა, მთელ ტოტს სრულად ვტოვებთ.

## 🔹 R-tree

**იდეა:** Quadtree და k-d tree წერტილებს ინახავენ. ხაზი და პოლიგონი კი წერტილი არ არის, ამიტომ R-tree ობიექტებს **მათი bbox-ით** ინახავს. ახლო ობიექტები ერთ ჯგუფში ხვდება, ჯგუფს თავისი გარსშემოსაზღვრავი მართკუთხედი აქვს და ჯგუფები ხის მომდევნო დონეზე კვლავ ჯგუფდება. ძებნისას ის ტოტი, რომლის მართკუთხედი საძიებელს არ კვეთს, გამოიტოვება.

ქვემოთ **STR** (Sort-Tile-Recursive) გზით აგებული ხეა: მონაცემებს x-ით ვახარისხებთ, ვჭრით ვერტიკალურ ზოლებად, ზოლს y-ით ვახარისხებთ და თითო 8 ობიექტს ვაჯგუფებთ.

!!! info "R-tree გრძელვადიანი ინდექსია"
    ეს რეალიზაცია მთლიანად მონაცემთა აგების ბოლოს იშენება. რეალური სისტემები (PostGIS, QGIS) R-tree-ს დინამიურად ავსებენ და ამისთვის უფრო რთულ ალგორითმებს იყენებენ, თუმცა დაძებნის პრინციპი იგივეა.

## 🔹 Geohash

**იდეა:** დედამიწა იყოფა ბადედ, რომლის ყოველი უჯრა **სტრიქონით** აღინიშნება. კოდის თითო სიმბოლო უჯრას 32 ნაწილად ყოფს. ორი წერტილი, რომელთა გეოჰეშებს **საერთო პრეფიქსი** აქვს, ახლოს არიან. ამიტომ ახლო წერტილების ძებნა ჩვეულებრივ ტექსტურ ინდექსზე `LIKE 'szrv%'` ძიებად იქცევა.

| სიგრძე | უჯრის ზომა (დაახლოებით) |
|---|---|
| 3 | 156 × 156 კმ |
| 4 | 39 × 19.5 კმ |
| 5 | 4.9 × 4.9 კმ |
| 6 | 1.2 × 0.6 კმ |
| 8 | 38 × 19 მ |

!!! warning "საზღვრის პრობლემა"
    ორი წერტილი შეიძლება ფიზიკურად ერთმანეთის გვერდით იყოს, მაგრამ უჯრის საზღვრის სხვადასხვა მხარეს და სრულიად განსხვავებული გეოჰეში ჰქონდეს. ამიტომ ახლო წერტილებისთვის ყოველთვის საჭიროა **8 მეზობელი უჯრის** შემოწმება (`gh_neighbors`).

---

## 🐍 რეალიზაცია სუფთა Python-ით

```python title="spatial_indexes.py" linenums="1"
import math

# ---------- k-d tree ----------
class KDNode:
    __slots__ = ('point', 'axis', 'left', 'right')
    def __init__(self, point, axis, left, right):
        self.point, self.axis, self.left, self.right = point, axis, left, right


def build_kdtree(points, depth=0):
    """წერტილების სია [(x, y), ...] -> k-d ხე (მედიანით გაყოფა)."""
    if not points:
        return None
    axis = depth % 2                              # 0 = x, 1 = y
    points = sorted(points, key=lambda p: p[axis])
    mid = len(points) // 2
    return KDNode(points[mid], axis,
                  build_kdtree(points[:mid], depth + 1),
                  build_kdtree(points[mid + 1:], depth + 1))


def kd_nearest(node, target, best=None):
    """უახლოესი წერტილი; ტოტს ვტოვებთ, თუ გამყოფი წრფე best-ზე შორსაა."""
    if node is None:
        return best
    d = (node.point[0] - target[0]) ** 2 + (node.point[1] - target[1]) ** 2
    if best is None or d < best[1]:
        best = (node.point, d)
    diff = target[node.axis] - node.point[node.axis]
    near, far = (node.left, node.right) if diff < 0 else (node.right, node.left)
    best = kd_nearest(near, target, best)
    if diff * diff < best[1]:                     # გამყოფი წრფე საკმარისად ახლოსაა
        best = kd_nearest(far, target, best)
    return best


def kd_range(node, rect, found=None):
    """წერტილები მართკუთხედში rect = (minx, miny, maxx, maxy)."""
    found = [] if found is None else found
    if node is None:
        return found
    x, y = node.point
    if rect[0] <= x <= rect[2] and rect[1] <= y <= rect[3]:
        found.append(node.point)
    lo, hi = (rect[0], rect[2]) if node.axis == 0 else (rect[1], rect[3])
    v = node.point[node.axis]
    if lo <= v:
        kd_range(node.left, rect, found)
    if hi >= v:
        kd_range(node.right, rect, found)
    return found


# ---------- R-tree (STR bulk loading) ----------
class RNode:
    def __init__(self, bbox, children=None, items=None):
        self.bbox, self.children, self.items = bbox, children, items


def union(boxes):
    return (min(b[0] for b in boxes), min(b[1] for b in boxes),
            max(b[2] for b in boxes), max(b[3] for b in boxes))


def str_pack(boxes, capacity=8):
    """boxes = [(minx, miny, maxx, maxy, data), ...] -> R-tree-ს ძირი."""
    def pack(entries, key_box, make):
        n = len(entries)
        slices = math.ceil(math.sqrt(math.ceil(n / capacity)))
        per_slice = slices * capacity
        entries = sorted(entries, key=lambda e: key_box(e)[0] + key_box(e)[2])
        nodes = []
        for i in range(0, n, per_slice):
            strip = sorted(entries[i:i + per_slice],
                           key=lambda e: key_box(e)[1] + key_box(e)[3])
            for j in range(0, len(strip), capacity):
                nodes.append(make(strip[j:j + capacity]))
        return nodes

    level = pack(boxes, lambda b: b,
                 lambda grp: RNode(union(grp), items=grp))
    while len(level) > 1:
        level = pack(level, lambda n: n.bbox,
                     lambda grp: RNode(union([n.bbox for n in grp]), children=grp))
    return level[0]


def r_query(node, rect, found=None):
    found = [] if found is None else found
    b = node.bbox
    if b[0] > rect[2] or b[2] < rect[0] or b[1] > rect[3] or b[3] < rect[1]:
        return found
    if node.items is not None:
        for it in node.items:
            if not (it[0] > rect[2] or it[2] < rect[0] or it[1] > rect[3] or it[3] < rect[1]):
                found.append(it)
    else:
        for c in node.children:
            r_query(c, rect, found)
    return found


# ---------- Geohash ----------
BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz'


def gh_encode(lat, lon, precision=8):
    lat_r, lon_r = [-90.0, 90.0], [-180.0, 180.0]
    code, bits, ch, even = '', 0, 0, True
    while len(code) < precision:
        r, v = (lon_r, lon) if even else (lat_r, lat)
        mid = (r[0] + r[1]) / 2
        ch <<= 1
        if v >= mid:
            ch |= 1
            r[0] = mid
        else:
            r[1] = mid
        even = not even
        bits += 1
        if bits == 5:
            code += BASE32[ch]
            bits, ch = 0, 0
    return code


def gh_bounds(code):
    """გეოჰეში -> (south, west, north, east)."""
    lat_r, lon_r, even = [-90.0, 90.0], [-180.0, 180.0], True
    for c in code:
        v = BASE32.index(c)
        for i in range(4, -1, -1):
            r = lon_r if even else lat_r
            mid = (r[0] + r[1]) / 2
            if (v >> i) & 1:
                r[0] = mid
            else:
                r[1] = mid
            even = not even
    return lat_r[0], lon_r[0], lat_r[1], lon_r[1]


def gh_neighbors(code):
    """8 მეზობელი უჯრა (კიდეზე მყოფისთვის ნაკლები)."""
    s, w, n, e = gh_bounds(code)
    dlat, dlon = n - s, e - w
    clat, clon = (s + n) / 2, (w + e) / 2
    out = []
    for di in (-1, 0, 1):
        for dj in (-1, 0, 1):
            if di == dj == 0:
                continue
            lat, lon = clat + di * dlat, clon + dj * dlon
            if -90 <= lat <= 90:
                out.append(gh_encode(lat, ((lon + 180) % 360) - 180, len(code)))
    return out
```

### გამოყენება

```python
import random

random.seed(3)
pts = [(random.random() * 100, random.random() * 100) for _ in range(3000)]

# k-d tree
tree = build_kdtree(pts)
print(kd_nearest(tree, (50, 50)))
print(len(kd_range(tree, (20, 30, 45, 50))))

# R-tree: 2000 პატარა მართკუთხედი
boxes = []
for i in range(2000):
    x, y = random.random() * 100, random.random() * 100
    boxes.append((x, y, x + random.random() * 2, y + random.random() * 2, i))
root = str_pack(boxes, capacity=8)
print(len(r_query(root, (10, 10, 18, 18))))

# Geohash
print(gh_encode(57.64911, 10.40744, 11))     # u4pruydqqvj
print(gh_encode(41.6938, 44.8015, 6))        # თბილისი: szrv5q
print(gh_bounds('szrv5q'))
print(gh_neighbors('szrv5q'))
```

!!! info "სირთულე"
    | სტრუქტურა | აგება | ძებნა (საშუალოდ) |
    |---|---|---|
    | k-d tree | `O(n log n)` | `O(log n)` უახლოესი მეზობელი |
    | R-tree (STR) | `O(n log n)` | `O(log n + k)` |
    | Geohash | `O(1)` თითო წერტილზე | ინდექსის ძიება პრეფიქსზე |

---

## 🧰 იგივე ბიბლიოთეკებით

=== "PyQGIS (R-tree)"

    `QgsSpatialIndex` R-tree-ს იყენებს:

    ```python
    layer = iface.activeLayer()
    index = QgsSpatialIndex(layer.getFeatures())

    ids = index.intersects(QgsRectangle(44.7, 41.6, 44.9, 41.8))   # bbox-ით
    near = index.nearestNeighbor(QgsPointXY(44.8, 41.7), 3)        # 3 უახლოესი
    ```

=== "Shapely (STRtree)"

    ```python
    from shapely.geometry import Point, box
    from shapely.strtree import STRtree

    points = [Point(x, y) for x, y in pts]
    tree = STRtree(points)
    idx = tree.query(box(20, 30, 45, 50))        # ინდექსები
    near = tree.nearest(Point(50, 50))           # უახლოესის ინდექსი
    ```

=== "SciPy (k-d tree)"

    ```python
    from scipy.spatial import cKDTree

    kd = cKDTree(pts)
    dist, i = kd.query((50, 50))                 # უახლოესი მეზობელი
    ```

=== "PostGIS"

    ```sql
    CREATE INDEX idx_points_geom ON points USING GIST (geom);   -- R-tree-ის ტიპის ინდექსი
    SELECT ST_GeoHash(geom, 6) FROM points;                     -- გეოჰეში
    ```

---

## 📝 დავალებები

!!! question "დავალება 1"
    შეადარეთ k-d tree-ის უახლოესი მეზობლის ძებნა სრულ გადარჩევას: რამდენ კვანძს ამოწმებს ხე 100 შემთხვევით მოთხოვნაზე 3000 წერტილში? დაამატეთ მრიცხველი `kd_nearest`-ში.

    ??? success "ამოხსნა"
        ```python
        def kd_nearest_counted(node, target, best=None, counter=None):
            if node is None:
                return best
            counter[0] += 1
            d = (node.point[0] - target[0]) ** 2 + (node.point[1] - target[1]) ** 2
            if best is None or d < best[1]:
                best = (node.point, d)
            diff = target[node.axis] - node.point[node.axis]
            near, far = (node.left, node.right) if diff < 0 else (node.right, node.left)
            best = kd_nearest_counted(near, target, best, counter)
            if diff * diff < best[1]:
                best = kd_nearest_counted(far, target, best, counter)
            return best

        total = 0
        for _ in range(100):
            q = (random.random() * 100, random.random() * 100)
            c = [0]
            kd_nearest_counted(tree, q, None, c)
            total += c[0]
        print('საშუალოდ', total / 100, 'კვანძი 3000-დან')
        ```

!!! question "დავალება 2"
    გეოჰეშით იპოვეთ თბილისის ცენტრიდან 1 კმ-ში მყოფი წერტილები: ჯერ 5-სიმბოლოიანი უჯრებით (ცენტრალური უჯრა და 8 მეზობელი) კანდიდატები აარჩიეთ, შემდეგ ზუსტი მანძილით გაფილტრეთ (ჰავერსინი).

    ??? success "ამოხსნა"
        ```python
        import math, random

        def haversine(lat1, lon1, lat2, lon2):
            r = 6371000
            p1, p2 = math.radians(lat1), math.radians(lat2)
            a = (math.sin((p2 - p1) / 2) ** 2 +
                 math.cos(p1) * math.cos(p2) * math.sin(math.radians(lon2 - lon1) / 2) ** 2)
            return 2 * r * math.asin(math.sqrt(a))

        random.seed(5)
        center = (41.6938, 44.8015)
        points = [(center[0] + random.uniform(-0.3, 0.3),
                   center[1] + random.uniform(-0.3, 0.3)) for _ in range(20000)]

        # 1) გეოჰეშით კანდიდატები
        index = {}
        for p in points:
            index.setdefault(gh_encode(*p, 5), []).append(p)
        cells = [gh_encode(*center, 5)]
        cells += gh_neighbors(cells[0])
        candidates = [p for c in cells for p in index.get(c, [])]

        # 2) ზუსტი ფილტრი
        result = [p for p in candidates if haversine(*center, *p) <= 1000]
        brute = [p for p in points if haversine(*center, *p) <= 1000]
        print(len(candidates), len(result), len(brute), len(result) == len(brute))
        ```
        ბოლო სტრიქონი `True` უნდა იყოს: მეზობელი უჯრების გარეშე ზოგი წერტილი გამოგვრჩებოდა.

        !!! warning "უჯრის ზომა რადიუსზე დიდი უნდა იყოს"
            6-სიმბოლოიანი უჯრა დაახლოებით 1.2 × 0.6 კმ-ია. 3×3 უჯრა ცენტრიდან მხოლოდ ~0.9 კმ-ს აფარებს ჩრდილოეთ-სამხრეთით, ამიტომ 1 კმ რადიუსისთვის 6 სიმბოლო გამოგვრჩენდა ნაწილს (შეამოწმეთ: ამ მონაცემებზე 6 სიმბოლოთი `16` წერტილი მოიძებნება `17`-ის ნაცვლად). ზოგადი წესი: ავირჩიოთ ისეთი სიგრძე, რომ უჯრის ყველაზე მოკლე გვერდი ≥ რადიუსი.

!!! question "დავალება 3"
    გაზომეთ დრო: 20 000 პატარა მართკუთხედზე (a) სრული გადარჩევა, (ბ) `str_pack` + `r_query`. რამდენჯერ სწრაფია ძებნა და რამდენი დრო მიდის ხის აგებაზე?

    ??? success "ამოხსნა"
        ```python
        import time

        boxes = []
        for i in range(20000):
            x, y = random.random() * 1000, random.random() * 1000
            boxes.append((x, y, x + random.random() * 3, y + random.random() * 3, i))

        t = time.perf_counter()
        root = str_pack(boxes, 8)
        build_time = time.perf_counter() - t

        queries = [(x, y, x + 20, y + 20) for x, y in
                   ((random.random() * 980, random.random() * 980) for _ in range(500))]

        def hit(b, q):
            return not (b[0] > q[2] or b[2] < q[0] or b[1] > q[3] or b[3] < q[1])

        t = time.perf_counter()
        for q in queries:
            [b for b in boxes if hit(b, q)]
        brute = time.perf_counter() - t

        t = time.perf_counter()
        for q in queries:
            r_query(root, q)
        tree_t = time.perf_counter() - t
        print(f'აგება {build_time:.3f}წმ, სრული {brute:.3f}წმ, R-tree {tree_t:.3f}წმ')
        ```
