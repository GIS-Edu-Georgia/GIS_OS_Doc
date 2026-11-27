# 🔷 Voronoi and Thiessen polygons

A **Voronoi diagram** divides the plane into cells so that every point of a cell is **closer to its own site than to any other site**. In geography these are called **Thiessen polygons**: the "zone of influence" of a rain gauge, the service area of the nearest hospital, the catchment of the nearest school.

---

## 💡 The idea and the link with Delaunay

- The boundary between two sites is their **perpendicular bisector** (the line equidistant from both).
- A cell is the **intersection** of all such "I am closer" half-planes.
- A vertex of a cell is a place where **three sites are equidistant**: exactly the centre of a circumcircle.

That is why Voronoi and the [Delaunay triangulation](tin_delaunay.md) are **duals**:

| Delaunay | Voronoi |
|---|---|
| Triangle | Cell vertex (centre of the triangle's circumcircle) |
| Edge between two sites | Shared boundary of two cells |
| Site | Cell |

---

## 🎮 Try it yourself

Click on the map to add sites. The colour and number are the value measured at that site (e.g. precipitation in mm). Turn on **Delaunay** and **Circumcircle**: you will see that the circle centres are the cell vertices.

<iframe src="../widgets/voronoi.html" title="Voronoi interactive demo" style="width:100%;height:700px;border:0" loading="lazy"></iframe>

!!! tip "Observation"
    - A **simple** mean gives every station the same weight. An **area-weighted** (Thiessen) mean weights each station by how much territory it represents. If the stations are clustered in one place, the two numbers differ noticeably.
    - The cells of the outermost stations are large: there are no other sites beyond them.

---

## ⚙️ The algorithm: clipping by half-planes

For each site:

1. Start with the whole area (bbox).
2. For every other site, clip the cell by the perpendicular bisector and keep only the side nearer to our site.
3. The result is a convex polygon.

For the clipping we use **Sutherland–Hodgman**: we test each edge of the polygon against the clipping line (both ends inside, one outside, and so on) and collect the result.

!!! info "Complexity"
    This version is `O(n²·k)` (`k` is the average number of vertices per cell). **Fortune's algorithm** does the same in `O(n log n)` with a sweep line. In practice it lives in libraries (Qhull, GEOS); our simple version is fine for learning and for up to a few hundred sites.

---

## 🐍 Implementation in pure Python

```python title="voronoi.py" linenums="1"
import math


def clip_halfplane(poly, a, b, c):
    """Sutherland–Hodgman: the part of the polygon where a*x + b*y <= c."""
    out = []
    n = len(poly)
    for i in range(n):
        p, q = poly[i], poly[(i + 1) % n]
        fp, fq = a * p[0] + b * p[1] - c, a * q[0] + b * q[1] - c
        if fp <= 0:
            out.append(p)
        if (fp < 0 < fq) or (fq < 0 < fp):           # the edge crosses the line
            t = fp / (fp - fq)
            out.append((p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])))
    return out


def voronoi_cells(sites, bbox):
    """The Voronoi cell of each site within bbox = (minx, miny, maxx, maxy).
    Cell = intersection of all half-planes 'I am closer than j'."""
    minx, miny, maxx, maxy = bbox
    cells = []
    for i, (xi, yi) in enumerate(sites):
        cell = [(minx, miny), (maxx, miny), (maxx, maxy), (minx, maxy)]
        for j, (xj, yj) in enumerate(sites):
            if i == j or not cell:
                continue
            # (x-xi)² + (y-yi)² <= (x-xj)² + (y-yj)²   <=>   a*x + b*y <= c
            a, b = 2 * (xj - xi), 2 * (yj - yi)
            c = xj * xj + yj * yj - xi * xi - yi * yi
            cell = clip_halfplane(cell, a, b, c)
        cells.append(cell)
    return cells


def area(poly):
    return abs(sum(poly[i][0] * poly[(i + 1) % len(poly)][1] -
                   poly[(i + 1) % len(poly)][0] * poly[i][1] for i in range(len(poly)))) / 2


def thiessen_mean(values, cells):
    """Area-weighted mean (e.g. average precipitation from stations)."""
    areas = [area(c) for c in cells]
    return sum(v * a for v, a in zip(values, areas)) / sum(areas)


def nearest_site(p, sites):
    return min(range(len(sites)), key=lambda i: (sites[i][0] - p[0]) ** 2 + (sites[i][1] - p[1]) ** 2)
```

### Usage and verification

```python
import random

random.seed(3)
sites = [(random.random() * 60 + 20, random.random() * 60 + 20) for _ in range(40)]

cells = voronoi_cells(sites, (0, 0, 100, 100))
print('sum of cell areas:', round(sum(area(c) for c in cells), 6))    # 10000.0

values = [0.3 * x + 0.1 * y for x, y in sites]            # station values
print('simple mean:   ', round(sum(values) / len(values), 3))
print('Thiessen mean: ', round(thiessen_mean(values, cells), 3))
```

```text
sum of cell areas: 10000.0
simple mean:    21.702
Thiessen mean:  20.161
```

---

## 🧰 The same with libraries

=== "PyQGIS"

    ```python
    # with processing: one command, attributes are kept
    result = processing.run('native:voronoipolygons', {
        'INPUT': points_layer,
        'BUFFER': 10,                   # buffer around the bbox (%)
        'OUTPUT': 'memory:thiessen',
    })
    QgsProject.instance().addMapLayer(result['OUTPUT'])

    # with geometry
    mp = QgsGeometry.fromMultiPointXY([QgsPointXY(x, y) for x, y in sites])
    voronoi = mp.voronoiDiagram()
    ```

=== "SciPy"

    ```python
    import numpy as np
    from scipy.spatial import Voronoi

    vor = Voronoi(np.array(sites))
    print(vor.vertices[:3])           # cell vertices
    print(vor.regions[:3])            # -1 means an infinite cell
    ```

=== "Shapely"

    ```python
    from shapely import voronoi_polygons, MultiPoint

    cells = voronoi_polygons(MultiPoint(sites))
    ```

---

## ⚠️ Geographic caveats

- **Euclidean distance.** Voronoi is built on "as the crow flies" distance. On a real network (roads, rivers) the nearest site may be a different one. In that case a service area based on [graphs](graph_algorithms.md) is used.
- **Projection.** Transform the points to a projected CRS: in degrees the perpendicular bisector is not Euclidean.
- **Boundaries.** The outermost cells are infinite, so they must be clipped by the territory's outline (e.g. the country border).
- **Thiessen for precipitation** is the simplest method, but on complex terrain interpolation (IDW, Kriging) usually gives better results.

---

## 📝 Exercises

!!! question "Exercise 1"
    Check three Voronoi properties: (a) the sum of the cell areas equals the area of the bbox; (b) each of 3000 random points lies in the cell of its nearest site; (c) every vertex of a cell is **equidistant** from at least two different sites.

    ??? success "Solution"
        ```python
        def inside_convex(poly, p, eps=1e-7):
            s = [(poly[(k + 1) % len(poly)][0] - poly[k][0]) * (p[1] - poly[k][1]) -
                 (poly[(k + 1) % len(poly)][1] - poly[k][1]) * (p[0] - poly[k][0])
                 for k in range(len(poly))]
            return all(x >= -eps for x in s) or all(x <= eps for x in s)

        bbox = (0, 0, 100, 100)
        cells = voronoi_cells(sites, bbox)

        print('a)', abs(sum(area(c) for c in cells) - 100 * 100) < 1e-6)

        ok = all(inside_convex(cells[nearest_site(p, sites)], p)
                 for p in ((random.uniform(0, 100), random.uniform(0, 100)) for _ in range(3000)))
        print('b)', ok)

        def equidistant_count(v):
            d = sorted(math.dist(v, s) for s in sites)
            return sum(1 for x in d if abs(x - d[0]) < 1e-6)

        interior = [v for c in cells for v in c if 1e-6 < v[0] < 100 - 1e-6 and 1e-6 < v[1] < 100 - 1e-6]
        print('c)', all(equidistant_count(v) >= 3 for v in interior))
        ```
        In c) we check the **interior** vertices (vertices on the bbox boundary come from the clipping): they are equidistant from 3 sites.

!!! question "Exercise 2"
    The precipitation field `v(x, y) = 20 + 16·sin(x/17)·cos(y/11) + 10·sin((x+y)/26)` is known over the area `[0,100]×[0,50]`. The stations are **clustered in one corner**: 15 random points in `[0,40]×[0,25]` and 3 in `[0,100]×[0,50]`. Compare the simple mean, the Thiessen mean and the true mean (computed on a dense grid).

    ??? success "Solution"
        ```python
        def v(x, y):
            return 20 + 16 * math.sin(x / 17) * math.cos(y / 11) + 10 * math.sin((x + y) / 26)

        random.seed(21)
        st = [(random.uniform(0, 40), random.uniform(0, 25)) for _ in range(15)]
        st += [(random.uniform(0, 100), random.uniform(0, 50)) for _ in range(3)]
        vals = [v(*p) for p in st]
        bb = (0, 0, 100, 50)
        cl = voronoi_cells(st, bb)

        N = 200
        truth = sum(v((i + .5) * 100 / N, (j + .5) * 50 / N) for i in range(N) for j in range(N)) / N ** 2
        print('true:    ', round(truth, 2))
        print('simple:  ', round(sum(vals) / len(vals), 2))
        print('Thiessen:', round(thiessen_mean(vals, cl), 2))
        ```
        Result: true ≈ 21.0, simple ≈ 31.2, Thiessen ≈ 23.3. Stations clustered in a corner "pull" the simple mean off, while the Thiessen weights are much closer to the truth. This is not always so (for example, if the field changes quickly between stations), but it is the typical result for clustered stations.

!!! question "Exercise 3"
    Compare polygon Voronoi with a **raster approach**: divide the area into 200×100 pixels, assign each pixel its nearest site and convert the pixel counts into areas. How well do they match the polygon areas?

    ??? success "Solution"
        ```python
        W, H = 200, 100
        count = [0] * len(sites)
        for i in range(W):
            for j in range(H):
                count[nearest_site(((i + .5) * 100 / W, (j + .5) * 100 / H), sites)] += 1
        pix_area = (100 / W) * (100 / H)
        diffs = [abs(count[k] * pix_area - area(cells[k])) for k in range(len(sites))]
        print('maximum difference:', round(max(diffs), 2), 'vs. average cell area', round(100 * 100 / len(sites)))
        ```
        The maximum difference is ~2 units out of 250 (<1%). The raster approach is simple and works with any distance function (e.g. a cost surface), but it is only approximate and much slower.

!!! question "Exercise 4"
    Confirm the duality in code: build a triangulation with the [Delaunay code](tin_delaunay.md) and check that the centre of every triangle's circumcircle is a vertex of some Voronoi cell.

    ??? success "Solution"
        ```python
        # use delaunay() and circumcircle() from tin.py
        big = (-2000, -2000, 2100, 2100)
        big_cells = voronoi_cells(sites, big)
        vertices = {(round(x, 4), round(y, 4)) for c in big_cells for x, y in c}

        centers = [circumcircle(*(sites[i] for i in t))[:2] for t in delaunay(sites)]
        found = sum((round(x, 4), round(y, 4)) in vertices for x, y in centers)
        print(found, 'of', len(centers), 'triangles')
        ```
        Result: `71 of 71 triangles`. Every centre is a Voronoi vertex.
