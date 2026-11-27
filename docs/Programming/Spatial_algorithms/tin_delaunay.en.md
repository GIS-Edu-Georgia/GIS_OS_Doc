# 🔺 TIN and Delaunay triangulation

Terrain can be represented in two ways:

- **Raster (DEM):** elevations on a regular grid. Simple, but the accuracy is the same everywhere.
- **TIN** (Triangulated Irregular Network): elevation points are joined into **triangles**. The triangles are flat, and their surface approximates the terrain. Complex areas get more points and flat areas fewer, so memory is used economically.

On this page we learn **how** a TIN is built (Delaunay triangulation) and how we use it to interpolate elevation.

---

## 💡 Why Delaunay?

The same points can be joined into triangles in many ways. **Delaunay triangulation** is the one that satisfies this property:

> No other point falls inside the **circumcircle** of any triangle.

As a result it **avoids very narrow, "needle-like" triangles as much as possible**, because they make interpolation worse. This property is also **dual** to the **Voronoi diagram**: Voronoi cells are the areas closer to one point than to any other, and a Delaunay edge joins two points if their cells touch.

---

## 🎮 Try it yourself

Click on the map to add points: the triangulation is rebuilt on every addition. Hover over a triangle: you can see its circumcircle (no other point falls inside it), the interpolated elevation compared with the true elevation, and the triangle's slope and aspect.

<iframe src="../widgets/tin.html" title="TIN and Delaunay interactive demo" style="width:100%;height:720px;border:0" loading="lazy"></iframe>

!!! tip "Observation"
    - A triangle's colour is the average elevation of its vertices; the exact value is known only **at the points**. Inside a triangle the elevation changes linearly, so the interpolated and true values differ slightly.
    - Adding points reduces the difference.
    - Slope in this demo is nominal (pixels and elevation units differ), so the number shows a trend rather than a real value.

---

## ⚙️ The algorithm: Bowyer–Watson

We add the points one at a time:

1. Start with a **super-triangle** that contains all the points.
2. For a new point `p`, find all triangles whose circumcircle contains `p`. These are the "bad" triangles.
3. Together the "bad" triangles form a **hole**. Its boundary consists of the edges that belong to only one bad triangle.
4. Delete the bad triangles and join each edge of the hole to `p`: this gives the new triangles.
5. Finally, delete the triangles that contain a vertex of the super-triangle.

!!! info "Complexity"
    This simple version is `O(n²)` (for every point we check all triangles). With a spatial index ([Quadtree](quadtree.md), [R-tree](spatial_indexes.md)) it drops to `O(n log n)` on average. Professional libraries (Qhull, CGAL, GEOS) use such optimized algorithms.

---

## 🐍 Implementation in pure Python

```python title="tin.py" linenums="1"
import math


def circumcircle(a, b, c):
    """Circumcircle of a triangle: (cx, cy, r^2)."""
    ax, ay = a
    bx, by = b
    cx, cy = c
    d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
    if d == 0:
        return None                                # collinear points
    a2, b2, c2 = ax * ax + ay * ay, bx * bx + by * by, cx * cx + cy * cy
    ux = (a2 * (by - cy) + b2 * (cy - ay) + c2 * (ay - by)) / d
    uy = (a2 * (cx - bx) + b2 * (ax - cx) + c2 * (bx - ax)) / d
    return ux, uy, (ax - ux) ** 2 + (ay - uy) ** 2


def delaunay(points):
    """Bowyer-Watson. Returns triangles as triples of point indices."""
    n = len(points)
    xs, ys = [p[0] for p in points], [p[1] for p in points]
    mx, my = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
    d = max(max(xs) - min(xs), max(ys) - min(ys)) * 1000 or 1
    pts = list(points) + [(mx - d, my - d), (mx, my + d), (mx + d, my - d)]  # super-triangle
    tris = {(n, n + 1, n + 2): circumcircle(pts[n], pts[n + 1], pts[n + 2])}

    for i in range(n):
        px, py = pts[i]
        bad = [t for t, cc in tris.items()
               if (px - cc[0]) ** 2 + (py - cc[1]) ** 2 < cc[2]]
        edges = {}
        for t in bad:
            for e in ((t[0], t[1]), (t[1], t[2]), (t[2], t[0])):
                key = tuple(sorted(e))
                edges[key] = edges.get(key, 0) + 1
        for t in bad:
            del tris[t]
        for (a, b), cnt in edges.items():
            if cnt == 1:                           # boundary of the hole
                t = (a, b, i)
                cc = circumcircle(pts[a], pts[b], pts[i])
                if cc:
                    tris[t] = cc
    return [t for t in tris if max(t) < n]


def barycentric(p, a, b, c):
    """Barycentric coordinates of point p in triangle ABC."""
    det = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1])
    l1 = ((b[1] - c[1]) * (p[0] - c[0]) + (c[0] - b[0]) * (p[1] - c[1])) / det
    l2 = ((c[1] - a[1]) * (p[0] - c[0]) + (a[0] - c[0]) * (p[1] - c[1])) / det
    return l1, l2, 1 - l1 - l2


def interpolate(p, tin_pts, z, triangles):
    """Elevation at point p by linear TIN interpolation (or None)."""
    for i, j, k in triangles:
        l1, l2, l3 = barycentric(p, tin_pts[i], tin_pts[j], tin_pts[k])
        if min(l1, l2, l3) >= -1e-12:
            return l1 * z[i] + l2 * z[j] + l3 * z[k]
    return None


def slope_aspect(a, b, c, za, zb, zc):
    """Slope and aspect of a triangle in degrees."""
    ux, uy, uz = b[0] - a[0], b[1] - a[1], zb - za
    vx, vy, vz = c[0] - a[0], c[1] - a[1], zc - za
    nx, ny, nz = uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx
    if nz < 0:
        nx, ny, nz = -nx, -ny, -nz
    slope = math.degrees(math.atan2(math.hypot(nx, ny), nz))
    aspect = (math.degrees(math.atan2(nx, ny)) + 360) % 360   # 0 = north, clockwise
    return slope, aspect
```

### Usage and verification

```python
import random

random.seed(7)
pts = [(random.random() * 100, random.random() * 100) for _ in range(300)]
triangles = delaunay(pts)
print(len(pts), 'points ->', len(triangles), 'triangles')

# elevations: the plane z = 0.5x + 0.2y, so interpolation must be exact
z = [0.5 * x + 0.2 * y for x, y in pts]
print(interpolate((50, 50), pts, z, triangles))        # 35.0 (+ rounding)
print(slope_aspect((0, 0), (1, 0), (0, 1), 0, 0, 1))   # (45.0, 180.0)
```

!!! info "Number of triangles"
    For `n` points with `h` convex-hull vertices, a Delaunay triangulation contains exactly `2n - 2 - h` triangles. This formula is a good check: on 20 random sets our code always gives this number.

---

## 🧰 The same with libraries

=== "PyQGIS"

    ```python
    from qgis.core import QgsGeometry, QgsPointXY

    pts = [QgsPointXY(x, y) for x, y in points]
    mp = QgsGeometry.fromMultiPointXY(pts)
    tin = mp.delaunayTriangulation(0.0, False)     # a multipolygon of triangles
    voronoi = mp.voronoiDiagram()                  # the dual diagram
    print(tin.asGeometryCollection().__len__())
    ```

=== "SciPy"

    ```python
    import numpy as np
    from scipy.spatial import Delaunay

    tri = Delaunay(np.array(pts))
    print(len(tri.simplices))        # number of triangles
    ```

=== "GEOS / Shapely"

    ```python
    from shapely import delaunay_triangles, MultiPoint

    tin = delaunay_triangles(MultiPoint(pts))
    ```

---

## 📝 Exercises

!!! question "Exercise 1"
    Write a function that checks that the result of `delaunay()` really satisfies the Delaunay property: no point falls inside the circumcircle of any triangle. Test it on 10 random sets.

    ??? success "Solution"
        ```python
        def is_delaunay(pts, triangles, eps=1e-9):
            for t in triangles:
                cx, cy, r2 = circumcircle(*(pts[i] for i in t))
                for j, p in enumerate(pts):
                    if j not in t and (p[0] - cx) ** 2 + (p[1] - cy) ** 2 < r2 - eps:
                        return False
            return True

        for seed in range(10):
            random.seed(seed)
            P = [(random.random() * 100, random.random() * 100) for _ in range(150)]
            print(seed, is_delaunay(P, delaunay(P)))
        ```

!!! question "Exercise 2"
    Build a 50×50 cell raster from a TIN (by interpolation) over the terrain `z = 50 + 20·sin(x/15) + 15·cos(y/12)` and compute the **root mean square error** (RMSE) against the true surface for 30, 100 and 400 points.

    ??? success "Solution"
        ```python
        import math

        def surface(x, y):
            return 50 + 20 * math.sin(x / 15) + 15 * math.cos(y / 12)

        def rmse(n_points):
            random.seed(1)
            P = [(random.random() * 100, random.random() * 100) for _ in range(n_points)]
            Z = [surface(*p) for p in P]
            T = delaunay(P)
            errs = []
            for i in range(50):
                for j in range(50):
                    q = (10 + i * 80 / 49, 10 + j * 80 / 49)     # central part
                    v = interpolate(q, P, Z, T)
                    if v is not None:
                        errs.append((v - surface(*q)) ** 2)
            return math.sqrt(sum(errs) / len(errs))

        for n in (30, 100, 400):
            print(n, round(rmse(n), 3))
        ```
        As the number of points grows, the RMSE decreases.

!!! question "Exercise 3"
    For the plane `z = 0.5x + 0.2y`, compute the slope and aspect of every triangle. What value should you get, and why is it the same for every triangle?

    ??? success "Solution"
        ```python
        random.seed(2)
        P = [(random.random() * 100, random.random() * 100) for _ in range(100)]
        Z = [0.5 * x + 0.2 * y for x, y in P]
        results = {(round(s, 3), round(a, 3))
                   for i, j, k in delaunay(P)
                   for s, a in [slope_aspect(P[i], P[j], P[k], Z[i], Z[j], Z[k])]}
        print(results)
        print(math.degrees(math.atan(math.hypot(0.5, 0.2))))
        ```
        All the triangles lie on one plane, so the slope everywhere is `atan(√(0.5²+0.2²)) ≈ 28.3°` and the aspect is ≈ 248° (south-west, i.e. the surface faces away from the `+x, +y` gradient).
