# 🌳 Quadtree — ოთხობითი ხე

**Quadtree** არის სივრცითი ინდექსი, რომელიც ბრტყელ არეს რეკურსიულად 4 ტოლ ნაწილად ყოფს. ძალიან დატვირთული ადგილი იყოფა უფრო წვრილად, ცარიელი ადგილი კი დიდ ბლოკად რჩება.

---

## 💡 იდეა

1. ვიწყებთ ერთი კვანძით, რომელიც მთელ არეს მოიცავს.
2. კვანძი ინახავს წერტილებს, სანამ მათი რაოდენობა `capacity`-ს (მაგ. 4) არ გადააჭარბებს.
3. გადაჭარბებისას კვანძი იყოფა 4 შვილად (ჩრდ-დას, ჩრდ-აღმ, სამხ-დას, სამხ-აღმ) და წერტილები მათ შორის ნაწილდება.
4. ძებნისას კვანძს, რომლის არეც საძიებელს არ კვეთს, **მთლიანად გამოვტოვებთ**.

---

## 🎮 სცადეთ თქვენც

აირჩიეთ რეჟიმი: დაამატეთ წერტილები, გაავლეთ მართკუთხედი ძებნისთვის, ან იპოვეთ უახლოესი წერტილი. ქვემოთ ჩანს, რამდენი წერტილი შეამოწმა Quadtree-მ და რამდენი დასჭირდებოდა სრულ გადარჩევას.

<iframe src="../widgets/quadtree.html" title="Quadtree-ის ინტერაქტიული დემო" style="width:100%;height:640px;border:0" loading="lazy"></iframe>

!!! tip "დაკვირვება"
    დააჭირეთ „შემთხვევითი 200"-ს და მოძებნეთ პატარა მართკუთხედი: Quadtree ათეულ წერტილს ამოწმებს 200-ის ნაცვლად. `capacity`-ს ცვლილება აჩვენებს კომპრომისს: მცირე მნიშვნელობა ღრმა ხეს, დიდი კი ბრტყელ ხეს ქმნის.

---

## 🐍 რეალიზაცია სუფთა Python-ით

```python title="quadtree.py" linenums="1"
import math


class Rect:
    """მართკუთხედი (minx, miny, maxx, maxy)."""
    def __init__(self, minx, miny, maxx, maxy):
        self.minx, self.miny, self.maxx, self.maxy = minx, miny, maxx, maxy

    def contains(self, x, y):
        return self.minx <= x <= self.maxx and self.miny <= y <= self.maxy

    def intersects(self, o):
        return not (o.minx > self.maxx or o.maxx < self.minx or
                    o.miny > self.maxy or o.maxy < self.miny)

    def dist2(self, x, y):
        """კვადრატული მანძილი წერტილიდან მართკუთხედამდე."""
        dx = max(self.minx - x, 0, x - self.maxx)
        dy = max(self.miny - y, 0, y - self.maxy)
        return dx * dx + dy * dy


class Quadtree:
    def __init__(self, bounds, capacity=4, depth=0, max_depth=12):
        self.bounds = bounds
        self.capacity = capacity
        self.depth = depth
        self.max_depth = max_depth
        self.points = []
        self.children = None

    def insert(self, x, y, data=None):
        if not self.bounds.contains(x, y):
            return False
        if self.children is None:
            if len(self.points) < self.capacity or self.depth == self.max_depth:
                self.points.append((x, y, data))
                return True
            self._split()
        return any(c.insert(x, y, data) for c in self.children)

    def _split(self):
        b = self.bounds
        mx, my = (b.minx + b.maxx) / 2, (b.miny + b.maxy) / 2
        d = self.depth + 1
        self.children = [
            Quadtree(Rect(b.minx, my, mx, b.maxy), self.capacity, d, self.max_depth),  # NW
            Quadtree(Rect(mx, my, b.maxx, b.maxy), self.capacity, d, self.max_depth),  # NE
            Quadtree(Rect(b.minx, b.miny, mx, my), self.capacity, d, self.max_depth),  # SW
            Quadtree(Rect(mx, b.miny, b.maxx, my), self.capacity, d, self.max_depth),  # SE
        ]
        old, self.points = self.points, []
        for p in old:
            any(c.insert(*p) for c in self.children)

    def query(self, rect, found=None):
        """აბრუნებს ყველა წერტილს მართკუთხედში."""
        found = [] if found is None else found
        if not self.bounds.intersects(rect):
            return found                      # მთლიანი ტოტის გამოტოვება
        for p in self.points:
            if rect.contains(p[0], p[1]):
                found.append(p)
        if self.children:
            for c in self.children:
                c.query(rect, found)
        return found

    def nearest(self, x, y):
        """უახლოესი წერტილი (branch-and-bound)."""
        best = [None, math.inf]

        def visit(node):
            if node.bounds.dist2(x, y) >= best[1]:
                return                        # ამ ტოტში უკეთესი ვერ იქნება
            for p in node.points:
                d = (p[0] - x) ** 2 + (p[1] - y) ** 2
                if d < best[1]:
                    best[:] = [p, d]
            if node.children:
                for c in sorted(node.children, key=lambda c: c.bounds.dist2(x, y)):
                    visit(c)

        visit(self)
        return best[0]
```

### გამოყენება და შემოწმება

```python
import random

random.seed(1)
pts = [(random.random() * 100, random.random() * 100) for _ in range(5000)]

qt = Quadtree(Rect(0, 0, 100, 100))
for i, (x, y) in enumerate(pts):
    qt.insert(x, y, i)

r = Rect(20, 30, 40, 50)
fast = qt.query(r)
slow = [p for p in pts if r.contains(*p)]        # სრული გადარჩევა
assert len(fast) == len(slow)

print(qt.nearest(50, 50))
```

!!! info "სირთულე"
    | ოპერაცია | საშუალოდ | უარეს შემთხვევაში |
    |---|---|---|
    | ჩამატება | `O(log n)` | `O(max_depth)` |
    | მართკუთხედში ძებნა | `O(log n + k)` | `O(n)` |
    | უახლოესი მეზობელი | `O(log n)` | `O(n)` |

    `k` არის ნაპოვნი წერტილების რაოდენობა. უარესი შემთხვევა მაშინ ხდება, როცა წერტილების უმეტესობა ერთ წერტილში ან ძალიან ახლოს არის. ამიტომ გვაქვს `max_depth`.

---

## 🧰 იგივე PyQGIS-ით

QGIS საკუთარ სივრცით ინდექსს `QgsSpatialIndex` გვთავაზობს. ის **R-tree**-ს ეფუძნება და არა Quadtree-ს (ორივე ერთ მიზანს ემსახურება). რეალურ პროექტში ის უნდა გამოიყენოთ.

```python
layer = iface.activeLayer()
index = QgsSpatialIndex(layer.getFeatures())

# მართკუთხედში მოხვედრილი ობიექტების ID-ები
ids = index.intersects(QgsRectangle(44.7, 41.6, 44.9, 41.8))

# 5 უახლოესი ობიექტი
near = index.nearestNeighbor(QgsPointXY(44.8, 41.7), 5)
print(ids, near)
```

---

## 🧱 Quadtree ტაილების მისამართებისთვის

ვებ-რუკებში (Google Maps, OpenStreetMap, Bing) Quadtree აღარ ინახავს წერტილებს. მას **ტაილების ადრესაცია** ეფუძნება: z-ე დონეზე რუკა `2^z × 2^z` ტაილისგან შედგება, ხოლო ტაილს სამი რიცხვი `(z, x, y)` განსაზღვრავს. თითო ტაილი ზედა დონეზე 4 შვილად იყოფა, ანუ ეს უკვე Quadtree-ა.

```python title="tiles.py"
import math


def lonlat_to_tile(lon, lat, z):
    """WGS84 -> XYZ ტაილი (Web Mercator)."""
    n = 2 ** z
    x = int((lon + 180) / 360 * n)
    y = int((1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n)
    return x, y


def tile_to_quadkey(x, y, z):
    """ტაილი -> quadkey: ყოველი ციფრი (0-3) არის ერთი Quadtree-დონე."""
    key = ''
    for i in range(z, 0, -1):
        mask = 1 << (i - 1)
        key += str((1 if x & mask else 0) + (2 if y & mask else 0))
    return key


x, y = lonlat_to_tile(44.8, 41.7, 10)      # თბილისი
print(x, y, tile_to_quadkey(x, y, 10))     # 639 381 1203333313
```

quadkey-ის თითო ციფრი გვეუბნება, რომელი მეოთხედი ავირჩიეთ ყოველ დონეზე. ამიტომ `1203333313`-ის პრეფიქსი (`120333`) მშობელი ტაილის quadkey-ა და ახლოს მყოფ ტაილებს საერთო პრეფიქსი აქვთ.

---

## 📝 დავალებები

!!! question "დავალება 1"
    დაამატეთ `Quadtree`-ს მეთოდი `count_nodes()`, რომელიც აბრუნებს კვანძების საერთო რაოდენობას, და `depth()`, რომელიც ხის სიღრმეს. შეადარეთ 1000 თანაბრად და 1000 ერთ წერტილთან გადაჭარბებით დაჯგუფებული წერტილისთვის.

    ??? success "ამოხსნა"
        ```python
        def count_nodes(self):
            return 1 + (sum(c.count_nodes() for c in self.children) if self.children else 0)

        def tree_depth(self):
            return max(c.tree_depth() for c in self.children) if self.children else self.depth

        Quadtree.count_nodes = count_nodes
        Quadtree.tree_depth = tree_depth

        import random
        uniform = Quadtree(Rect(0, 0, 100, 100))
        cluster = Quadtree(Rect(0, 0, 100, 100))
        for _ in range(1000):
            uniform.insert(random.uniform(0, 100), random.uniform(0, 100))
            cluster.insert(random.gauss(50, 1), random.gauss(50, 1))
        print(uniform.count_nodes(), uniform.tree_depth())
        print(cluster.count_nodes(), cluster.tree_depth())
        ```
        მაგალითად, ერთ გაშვებაზე თანაბარი განაწილება ~700 კვანძს და სიღრმე 6-ს გვაძლევს, დაჯგუფებული კი ~800 კვანძს და სიღრმე 11-ს: წერტილების გროვა ხეს ღრმად ყოფს, ცარიელი არე კი დიდ ბლოკად რჩება.

!!! question "დავალება 2"
    ჩატვირთეთ QGIS-ში წერტილოვანი შრე (მაგ. `points` ამ დოკუმენტაციის [`sample_data/practice/task_04`](https://github.com/GIS-Edu-Georgia/GIS_OS_Doc/tree/main/docs/Programming/PyQGIS/sample_data/practice/task_04) საქაღალდიდან). ააგეთ `Quadtree` მისი წერტილებისგან და 1000-ჯერ გაიმეორეთ ერთი და იგივე მართკუთხედში ძებნა: (ა) `Quadtree`-ით, (ბ) სრული გადარჩევით, (გ) `QgsSpatialIndex`-ით. გაზომეთ დრო `time.perf_counter()`-ით.

    ??? success "ამოხსნა"
        ```python
        import time
        layer = iface.activeLayer()
        ext = layer.extent()
        qt = Quadtree(Rect(ext.xMinimum(), ext.yMinimum(), ext.xMaximum(), ext.yMaximum()))
        pts = []
        for f in layer.getFeatures():
            p = f.geometry().asPoint()
            qt.insert(p.x(), p.y(), f.id())
            pts.append((p.x(), p.y()))
        sidx = QgsSpatialIndex(layer.getFeatures())

        cx, cy = ext.center().x(), ext.center().y()
        w = ext.width() / 50
        r = Rect(cx - w, cy - w, cx + w, cy + w)
        qr = QgsRectangle(cx - w, cy - w, cx + w, cy + w)

        def bench(fn, n=1000):
            t = time.perf_counter()
            for _ in range(n):
                fn()
            return time.perf_counter() - t

        print('quadtree  ', bench(lambda: qt.query(r)))
        print('brute     ', bench(lambda: [p for p in pts if r.contains(*p)]))
        print('QgsSpatial', bench(lambda: sidx.intersects(qr)))
        ```

!!! question "დავალება 3"
    დაწერეთ ფუნქცია `tile_bounds(x, y, z)`, რომელიც აბრუნებს ტაილის საზღვრებს გრადუსებში `(west, south, east, north)`. შეამოწმეთ `lonlat_to_tile`-ით: ტაილის ცენტრი იმავე ტაილში უნდა მოხვდეს.

    ??? success "ამოხსნა"
        ```python
        import math

        def tile_bounds(x, y, z):
            n = 2 ** z
            west = x / n * 360 - 180
            east = (x + 1) / n * 360 - 180
            north = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y / n))))
            south = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * (y + 1) / n))))
            return west, south, east, north

        w, s, e, n = tile_bounds(639, 381, 10)
        assert lonlat_to_tile((w + e) / 2, (s + n) / 2, 10) == (639, 381)
        ```
