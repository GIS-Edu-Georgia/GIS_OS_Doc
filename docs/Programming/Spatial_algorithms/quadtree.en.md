# 🌳 Quadtree

A **Quadtree** is a spatial index that recursively splits a flat area into 4 equal parts. A crowded place is split more finely, while an empty place stays one large block.

---

## 💡 The idea

1. We start with a single node that covers the whole area.
2. The node stores points until their number exceeds `capacity` (e.g. 4).
3. When it overflows, the node splits into 4 children (NW, NE, SW, SE) and the points are distributed among them.
4. During a search, a node whose area does not intersect the search region is **skipped entirely**.

---

## 🎮 Try it yourself

Pick a mode: add points, drag a rectangle to search, or find the nearest point. Below you can see how many points the Quadtree checked and how many a full scan would have needed.

<iframe src="../widgets/quadtree.html" title="Quadtree interactive demo" style="width:100%;height:640px;border:0" loading="lazy"></iframe>

!!! tip "Observation"
    Click "Random 200" and search with a small rectangle: the Quadtree checks a dozen or so points instead of 200. Changing `capacity` shows the trade-off: a small value makes a deep tree, a large one a flat tree.

---

## 🐍 Implementation in pure Python

```python title="quadtree.py" linenums="1"
import math


class Rect:
    """Rectangle (minx, miny, maxx, maxy)."""
    def __init__(self, minx, miny, maxx, maxy):
        self.minx, self.miny, self.maxx, self.maxy = minx, miny, maxx, maxy

    def contains(self, x, y):
        return self.minx <= x <= self.maxx and self.miny <= y <= self.maxy

    def intersects(self, o):
        return not (o.minx > self.maxx or o.maxx < self.minx or
                    o.miny > self.maxy or o.maxy < self.miny)

    def dist2(self, x, y):
        """Squared distance from a point to the rectangle."""
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
        """Returns all points inside the rectangle."""
        found = [] if found is None else found
        if not self.bounds.intersects(rect):
            return found                      # skip the whole branch
        for p in self.points:
            if rect.contains(p[0], p[1]):
                found.append(p)
        if self.children:
            for c in self.children:
                c.query(rect, found)
        return found

    def nearest(self, x, y):
        """Nearest point (branch-and-bound)."""
        best = [None, math.inf]

        def visit(node):
            if node.bounds.dist2(x, y) >= best[1]:
                return                        # nothing better can be in this branch
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

### Usage and verification

```python
import random

random.seed(1)
pts = [(random.random() * 100, random.random() * 100) for _ in range(5000)]

qt = Quadtree(Rect(0, 0, 100, 100))
for i, (x, y) in enumerate(pts):
    qt.insert(x, y, i)

r = Rect(20, 30, 40, 50)
fast = qt.query(r)
slow = [p for p in pts if r.contains(*p)]        # full scan
assert len(fast) == len(slow)

print(qt.nearest(50, 50))
```

!!! info "Complexity"
    | Operation | Average | Worst case |
    |---|---|---|
    | Insert | `O(log n)` | `O(max_depth)` |
    | Rectangle search | `O(log n + k)` | `O(n)` |
    | Nearest neighbour | `O(log n)` | `O(n)` |

    `k` is the number of points found. The worst case happens when most points are at one location or very close together. That is why we have `max_depth`.

---

## 🧰 The same with PyQGIS

QGIS offers its own spatial index, `QgsSpatialIndex`. It is based on an **R-tree** rather than a Quadtree (both serve the same purpose). In a real project, this is the one you should use.

```python
layer = iface.activeLayer()
index = QgsSpatialIndex(layer.getFeatures())

# IDs of features that fall within the rectangle
ids = index.intersects(QgsRectangle(44.7, 41.6, 44.9, 41.8))

# 5 nearest features
near = index.nearestNeighbor(QgsPointXY(44.8, 41.7), 5)
print(ids, near)
```

---

## 🧱 Quadtree for tile addresses

In web maps (Google Maps, OpenStreetMap, Bing) the Quadtree no longer stores points. Instead, **tile addressing** is built on it: at level z the map consists of `2^z × 2^z` tiles, and each tile is identified by three numbers `(z, x, y)`. Each tile splits into 4 children at the next level, which is exactly a Quadtree.

```python title="tiles.py"
import math


def lonlat_to_tile(lon, lat, z):
    """WGS84 -> XYZ tile (Web Mercator)."""
    n = 2 ** z
    x = int((lon + 180) / 360 * n)
    y = int((1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n)
    return x, y


def tile_to_quadkey(x, y, z):
    """Tile -> quadkey: each digit (0-3) is one Quadtree level."""
    key = ''
    for i in range(z, 0, -1):
        mask = 1 << (i - 1)
        key += str((1 if x & mask else 0) + (2 if y & mask else 0))
    return key


x, y = lonlat_to_tile(44.8, 41.7, 10)      # Tbilisi
print(x, y, tile_to_quadkey(x, y, 10))     # 639 381 1203333313
```

Each digit of the quadkey tells us which quadrant was chosen at each level. So a prefix of `1203333313` (`120333`) is the quadkey of a parent tile, and nearby tiles share a common prefix.

---

## 📝 Exercises

!!! question "Exercise 1"
    Add a method `count_nodes()` to `Quadtree` that returns the total number of nodes, and `depth()` that returns the depth of the tree. Compare 1000 uniformly distributed points with 1000 points heavily clustered around one point.

    ??? success "Solution"
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
        For example, on one run the uniform distribution gives ~700 nodes and depth 6, while the clustered one gives ~800 nodes and depth 11: a pile of points splits the tree deeply, while empty area stays one large block.

!!! question "Exercise 2"
    Load a point layer in QGIS (e.g. `points` from this documentation's [`sample_data/practice/task_04`](https://github.com/GIS-Edu-Georgia/GIS_OS_Doc/tree/main/docs/Programming/PyQGIS/sample_data/practice/task_04) folder). Build a `Quadtree` from its points and repeat the same rectangle search 1000 times: (a) with the `Quadtree`, (b) with a full scan, (c) with `QgsSpatialIndex`. Measure the time with `time.perf_counter()`.

    ??? success "Solution"
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

!!! question "Exercise 3"
    Write a function `tile_bounds(x, y, z)` that returns a tile's bounds in degrees `(west, south, east, north)`. Check it with `lonlat_to_tile`: the tile's centre must fall within the same tile.

    ??? success "Solution"
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
