# 📐 Geometric algorithms

In GIS we use operations such as "is the point inside the polygon?", "simplify the line" or "draw a hull around the points" every day. On this page we look at **how** they work inside. `QgsGeometry`, Shapely and the PostGIS functions are built on these algorithms.

| Task | Algorithm | Complexity |
|---|---|---|
| Point in polygon | Ray casting / Winding number | `O(n)` |
| Area and centroid | Shoelace formula | `O(n)` |
| Convex hull | Andrew's monotone chain | `O(n log n)` |
| Line simplification | Douglas–Peucker | `O(n log n)` on average, `O(n²)` worst case |
| Segment intersection | Orientation test (`cross`) | `O(1)` |

---

## 🎮 Try it yourself

There are three modes: **Point in polygon** (the ray and its crossings are shown under the mouse), **Douglas–Peucker** (changing ε simplifies the line) and **Convex hull** (add points).

<iframe src="../widgets/geometry.html" title="Geometric algorithms interactive demo" style="width:100%;height:700px;border:0" loading="lazy"></iframe>

---

## 🧭 The foundation: `cross` (orientation)

Almost every algorithm relies on one small function: for three points, `cross(o, a, b)` tells us whether point `b` is to the **left** of the vector `o→a` (`> 0`), to the **right** (`< 0`), or **on the same line** (`= 0`). It is the 2D cross product of the vectors.

---

## 🔹 Point in polygon

**Ray casting:** from the point we cast a horizontal ray to the right and count how many edges it crosses. An **odd** number means "inside", an **even** one means "outside".

**Winding number:** we count how many times the polygon winds around the point (counter-clockwise `+1`, clockwise `−1`). `0` means outside.

!!! warning "An interesting difference"
    For a **simple** polygon both give the same answer. For a **self-intersecting** polygon (e.g. a five-pointed star) they differ: ray casting counts the central pentagon as "outside", while the winding number counts it as "inside" (`2`). Different GIS software uses different rules, so polygons should be valid first ([`isValid`](../PyQGIS/PyQGIS_methods/PyQGIS_isValid.md)).

## 🔹 Area and centroid

The **shoelace formula** computes a polygon's area from the coordinates of its vertices. The sign shows the winding direction (`+` for counter-clockwise).

## 🔹 Convex hull

Imagine a rubber band stretched tightly around all the points. **Andrew's algorithm** sorts the points and builds the hull in two parts (lower and upper hull): for each new point we remove the last points if they make a "right turn".

## 🔹 Douglas–Peucker (line simplification)

We join the first and last points of the line. We find the point that is farthest from this segment. If it is closer than `ε`, **we drop all the intermediate points**. If not, we split the line at that point and repeat the same thing recursively on both parts.

!!! warning "The unit of ε"
    `ε` is in coordinate units. On data in degrees, `ε = 0.001` is roughly 100 metres, so transform the data to a projected CRS before simplifying.

!!! warning "Topology"
    Douglas–Peucker simplifies each line separately and **can create self-intersections or gaps between neighbouring polygons**. For shared polygon boundaries use topology-preserving variants (e.g. `mapshaper`, PostGIS `ST_SimplifyPreserveTopology`).

---

## 🐍 Implementation in pure Python

```python title="geometry_algorithms.py" linenums="1"
import math


def cross(o, a, b):
    """(a-o) × (b-o): >0 left, <0 right, 0 on the same line."""
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])


def on_segment(p, a, b, eps=1e-12):
    return abs(cross(a, b, p)) <= eps and \
        min(a[0], b[0]) - eps <= p[0] <= max(a[0], b[0]) + eps and \
        min(a[1], b[1]) - eps <= p[1] <= max(a[1], b[1]) + eps


def point_in_polygon(p, poly):
    """Ray casting: 'inside', 'boundary' or 'outside'."""
    inside = False
    n = len(poly)
    for i in range(n):
        a, b = poly[i], poly[(i + 1) % n]
        if on_segment(p, a, b):
            return 'boundary'
        if (a[1] > p[1]) != (b[1] > p[1]):              # does the edge cross the horizontal ray?
            x = a[0] + (p[1] - a[1]) * (b[0] - a[0]) / (b[1] - a[1])
            if x > p[0]:
                inside = not inside
    return 'inside' if inside else 'outside'


def winding_number(p, poly):
    """Winding number: 0 = outside; ≠0 = inside (also for self-intersecting polygons)."""
    wn = 0
    n = len(poly)
    for i in range(n):
        a, b = poly[i], poly[(i + 1) % n]
        if a[1] <= p[1]:
            if b[1] > p[1] and cross(a, b, p) > 0:
                wn += 1
        elif b[1] <= p[1] and cross(a, b, p) < 0:
            wn -= 1
    return wn


def polygon_area(poly):
    """Shoelace: signed area (+ for counter-clockwise)."""
    s = 0
    for i in range(len(poly)):
        x1, y1 = poly[i]
        x2, y2 = poly[(i + 1) % len(poly)]
        s += x1 * y2 - x2 * y1
    return s / 2


def polygon_centroid(poly):
    a = polygon_area(poly)
    cx = cy = 0
    for i in range(len(poly)):
        x1, y1 = poly[i]
        x2, y2 = poly[(i + 1) % len(poly)]
        f = x1 * y2 - x2 * y1
        cx += (x1 + x2) * f
        cy += (y1 + y2) * f
    return cx / (6 * a), cy / (6 * a)


def convex_hull(points):
    """Andrew's monotone chain: O(n log n). Returns the hull counter-clockwise."""
    pts = sorted(set(points))
    if len(pts) <= 2:
        return pts
    lower = []
    for p in pts:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    upper = []
    for p in reversed(pts):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    return lower[:-1] + upper[:-1]


def point_line_distance(p, a, b):
    """Distance from p to the line AB."""
    if a == b:
        return math.dist(p, a)
    return abs(cross(a, b, p)) / math.dist(a, b)


def douglas_peucker(points, epsilon):
    """Line simplification: keeps the vertices that deviate by more than epsilon."""
    if len(points) < 3:
        return list(points)
    a, b = points[0], points[-1]
    idx, dmax = 0, 0.0
    for i in range(1, len(points) - 1):
        d = point_line_distance(points[i], a, b)
        if d > dmax:
            idx, dmax = i, d
    if dmax <= epsilon:
        return [a, b]
    left = douglas_peucker(points[:idx + 1], epsilon)
    right = douglas_peucker(points[idx:], epsilon)
    return left[:-1] + right


def segments_intersect(p1, p2, p3, p4):
    """Whether two segments intersect (touching counts too)."""
    d1, d2 = cross(p3, p4, p1), cross(p3, p4, p2)
    d3, d4 = cross(p1, p2, p3), cross(p1, p2, p4)
    if ((d1 > 0) != (d2 > 0)) and ((d3 > 0) != (d4 > 0)) and 0 not in (d1, d2, d3, d4):
        return True
    return (on_segment(p1, p3, p4) or on_segment(p2, p3, p4) or
            on_segment(p3, p1, p2) or on_segment(p4, p1, p2))
```

### Usage

```python
import random

star = [(50 + (40 if i % 2 == 0 else 18) * math.cos(i * math.pi / 6),
         50 + (40 if i % 2 == 0 else 18) * math.sin(i * math.pi / 6)) for i in range(12)]

print(point_in_polygon((50, 50), star))        # inside
print(point_in_polygon(star[0], star))         # boundary
print(point_in_polygon((0, 0), star))          # outside

square = [(0, 0), (4, 0), (4, 3), (0, 3)]
print(polygon_area(square), polygon_centroid(square))      # 12.0 (2.0, 1.5)

random.seed(1)
pts = [(random.random() * 100, random.random() * 100) for _ in range(500)]
print(len(convex_hull(pts)), 'vertices out of 500 points')

line = [(i, 10 * math.sin(i / 7) + random.uniform(-1, 1)) for i in range(200)]
for eps in (0.5, 2, 5):
    print(eps, len(douglas_peucker(line, eps)))
```

```text
inside
boundary
outside
12.0 (2.0, 1.5)
18 vertices out of 500 points
0.5 92
2 20
5 11
```

---

## 🧰 The same with libraries

=== "PyQGIS"

    ```python
    poly = QgsGeometry.fromPolygonXY([[QgsPointXY(x, y) for x, y in square]])
    pt = QgsGeometry.fromPointXY(QgsPointXY(1, 1))

    print(poly.contains(pt))                       # point in polygon
    print(poly.area(), poly.centroid().asPoint())  # area, centroid

    multi = QgsGeometry.fromMultiPointXY([QgsPointXY(x, y) for x, y in pts])
    print(multi.convexHull().asWkt())              # convex hull

    ln = QgsGeometry.fromPolylineXY([QgsPointXY(x, y) for x, y in line])
    print(ln.simplify(2).constGet().numPoints())   # Douglas–Peucker
    ```

=== "Shapely"

    ```python
    from shapely.geometry import Polygon, Point, MultiPoint, LineString

    print(Polygon(square).contains(Point(1, 1)))
    print(MultiPoint(pts).convex_hull)
    print(len(LineString(line).simplify(2, preserve_topology=False).coords))
    ```

=== "PostGIS"

    ```sql
    SELECT ST_Contains(poly, pt);
    SELECT ST_ConvexHull(ST_Collect(geom)) FROM points;
    SELECT ST_Simplify(geom, 2) FROM lines;                  -- Douglas–Peucker
    SELECT ST_SimplifyPreserveTopology(geom, 2) FROM lines;  -- preserving topology
    ```

---

## 📝 Exercises

!!! question "Exercise 1"
    Build a five-pointed star (pentagram) by skipping one vertex at a time among five points. Test the central point with `point_in_polygon` and with `winding_number`. Why do the answers differ?

    ??? success "Solution"
        ```python
        penta = [(50 + 40 * math.cos(math.radians(90 + 144 * i)),
                  50 + 40 * math.sin(math.radians(90 + 144 * i))) for i in range(5)]

        print(point_in_polygon((50, 50), penta))     # outside
        print(winding_number((50, 50), penta))       # 2
        ```
        The central pentagon is wound around twice: the ray-casting ray crosses two edges (even → outside), while the winding number counts the turns (`2 ≠ 0` → inside).

!!! question "Exercise 2"
    How many of 10,000 random points fall inside the `star` polygon built above? Compare the Monte Carlo area estimate with `polygon_area(star)` (points in the area `[0,100]×[0,100]`).

    ??? success "Solution"
        ```python
        random.seed(11)
        N = 10_000
        inside = sum(point_in_polygon((random.random() * 100, random.random() * 100), star) != 'outside'
                     for _ in range(N))
        print(inside, 'points inside')
        print('Monte Carlo area:', inside / N * 100 * 100)
        print('Shoelace area:   ', abs(polygon_area(star)))
        ```
        The two values are close (a difference of ~1–2%), and it shrinks as `N` grows.

!!! question "Exercise 3"
    For the `line` above, build a table: for `ε = 0.5, 1, 2, 5`, the number of vertices and the length of the simplified line. By what percentage does the length decrease?

    ??? success "Solution"
        ```python
        def length(pts):
            return sum(math.dist(pts[i], pts[i + 1]) for i in range(len(pts) - 1))

        L0 = length(line)
        print('ε     vertices   length   loss')
        for eps in (0.5, 1, 2, 5):
            s = douglas_peucker(line, eps)
            print(f'{eps:<5} {len(s):>8} {length(s):>9.1f} {100 * (1 - length(s) / L0):>8.1f}%')
        ```
        Simplification always reduces length: it cuts "corners". So the result is not suitable for computing lengths (e.g. of a coastline).

!!! question "Exercise 4"
    Find the **diameter** of a point set (the two points farthest apart). Instead of `O(n²)`, use only the convex hull vertices, and check against a full scan.

    ??? success "Solution"
        ```python
        import itertools

        h = convex_hull(pts)
        fast = max(itertools.combinations(h, 2), key=lambda ab: math.dist(*ab))
        brute = max(itertools.combinations(pts, 2), key=lambda ab: math.dist(*ab))
        print(math.dist(*fast), math.dist(*brute), math.isclose(math.dist(*fast), math.dist(*brute)))
        ```
        The farthest pair is always made of hull vertices, so instead of 500 points we check only ~18.
