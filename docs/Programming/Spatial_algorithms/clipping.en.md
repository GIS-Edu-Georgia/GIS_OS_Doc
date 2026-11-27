# ✂️ Polygon clipping and overlay

One of the most common GIS operations is **overlay**: the union, intersection or difference of two polygon layers. For example: "which part falls within the flood zone **and** a cadastral parcel?", "what area of the parcel is left after subtracting the protected area?" QGIS's Clip, Intersection, Union and Difference are built on exactly these algorithms.

| Operation | Notation | Result |
|---|---|---|
| Intersection | `A ∩ B` | What is in both at once |
| Union | `A ∪ B` | What is in at least one |
| Difference | `A − B` | The part of A that is not in B |

---

## 🎮 Try it yourself

Drag the vertices and switch between operations. Blue is A, orange is B, and red is the **result**.

<iframe src="../widgets/clipping.html" title="Polygon overlay interactive demo" style="width:100%;height:690px;border:0" loading="lazy"></iframe>

!!! tip "Observation"
    - A polygon can split into **two or more parts** (two "crescents" crossing each other in two places), so the result is always **a list of rings**.
    - If A lies entirely inside B, there are no intersection points, and the algorithm has to handle this as a separate case.
    - When one polygon lies entirely inside the other, `A − B` gives a **hole**. Our version returns the hole as a separate ring and does not mark it as a hole, so the demo computes the area from how the rings are nested (see Exercise 2).

---

## ⚙️ Two algorithms

### Sutherland–Hodgman: clipping with a convex "window"

The simplest algorithm: for **each side** of the convex `clipper`, in turn, we clip the `subject` by a half-plane ([the same idea](voronoi.md) we used to build Voronoi cells). For each edge there are four cases: both ends inside (keep), both outside (drop), one inside and one outside (keep the intersection point).

**Limitation:** the `clipper` must be convex, and if the result has two parts, the algorithm returns them as **one polygon**, joined by a "zero-width" edge (see Exercise 3).

### Greiner–Hormann: any two polygons

1. **Find all intersections.** Compare every edge of one polygon with every edge of the other (`O(n·m)`) and insert the intersection points into both polygons' vertex lists, ordered by their position on the edge (`alpha`).
2. **Entry/exit.** Moving along a polygon, the intersection points alternate between **entering** the other polygon and **exiting** it (the status of the first one is found by checking whether the first vertex lies inside the other polygon).
3. **Trace the path.** Start from an intersection point: if it is an entry, move forward; if an exit, move backward, until the next intersection, where we **switch to the other polygon**, and continue like this until the path closes.

The **entry/exit** flags decide which operation we get: for intersection leave them as they are; for **union** flip the flags in both polygons (i.e. we walk along the outer outline); for **difference `A − B`** flip only those of A.

!!! info "Complexity and real libraries"
    Our version is `O(n·m)`. GEOS, which sits under Shapely, PostGIS and QGIS, finds intersections with [spatial indexes](spatial_indexes.md) and resolves degenerate cases with **exact predicates and snapping** (see Exercise 4). Vatti, Martinez–Rueda and Weiler–Atherton are other variants for the same problem.

---

## 🐍 Implementation in pure Python

```python title="clip.py" linenums="1"
class Node:
    __slots__ = ('x', 'y', 'next', 'prev', 'is_x', 'alpha', 'neighbor', 'entry', 'visited')

    def __init__(self, x, y, alpha=0.0, is_x=False):
        self.x, self.y, self.alpha, self.is_x = x, y, alpha, is_x
        self.next = self.prev = self.neighbor = None
        self.entry = False
        self.visited = False


def point_in_polygon(p, poly):
    """Ray casting (see Geometric algorithms)."""
    x, y = p
    inside = False
    n = len(poly)
    for i in range(n):
        (x1, y1), (x2, y2) = poly[i], poly[(i + 1) % n]
        if (y1 > y) != (y2 > y) and x < x1 + (y - y1) * (x2 - x1) / (y2 - y1):
            inside = not inside
    return inside


def polygon_area(poly):
    """Signed area (shoelace): + if counter-clockwise."""
    n = len(poly)
    return sum(poly[i][0] * poly[(i + 1) % n][1] - poly[(i + 1) % n][0] * poly[i][1] for i in range(n)) / 2


def _segment_hit(p1, p2, q1, q2):
    """(t, u) if [p1,p2] and [q1,q2] intersect strictly inside both, otherwise None."""
    rx, ry = p2[0] - p1[0], p2[1] - p1[1]
    sx, sy = q2[0] - q1[0], q2[1] - q1[1]
    den = rx * sy - ry * sx
    if den == 0:
        return None                                    # parallel
    t = ((q1[0] - p1[0]) * sy - (q1[1] - p1[1]) * sx) / den
    u = ((q1[0] - p1[0]) * ry - (q1[1] - p1[1]) * rx) / den
    return (t, u) if 0 < t < 1 and 0 < u < 1 else None


def _build(poly):
    nodes = [Node(x, y) for x, y in poly]
    for i, nd in enumerate(nodes):
        nd.next, nd.prev = nodes[(i + 1) % len(nodes)], nodes[i - 1]
    return nodes


def _insert(a, b, alpha, x, y):
    """A new intersection node between a and b (on the edge from a to b), ordered by alpha."""
    node = Node(x, y, alpha, True)
    cur = a
    while cur.next is not b and cur.next.is_x and cur.next.alpha < alpha:
        cur = cur.next
    node.next, node.prev = cur.next, cur
    cur.next.prev = node
    cur.next = node
    return node


def clip(subject, clipper, op='intersection'):
    """Greiner–Hormann. op: 'intersection' | 'union' | 'difference' (subject − clipper).
    Result: a list of rings. Limitations: vertices in general position, holes are not returned."""
    S, C = _build(subject), _build(clipper)
    found = 0
    for i, a in enumerate(S):
        a2 = S[(i + 1) % len(S)]
        for j, b in enumerate(C):
            b2 = C[(j + 1) % len(C)]
            hit = _segment_hit((a.x, a.y), (a2.x, a2.y), (b.x, b.y), (b2.x, b2.y))
            if hit:
                t, u = hit
                x, y = a.x + t * (a2.x - a.x), a.y + t * (a2.y - a.y)
                ns = _insert(a, a2, t, x, y)
                nc = _insert(b, b2, u, x, y)
                ns.neighbor, nc.neighbor = nc, ns
                found += 1

    if not found:                                       # no crossings: containment or disjoint
        a_in_b = point_in_polygon(subject[0], clipper)
        b_in_a = point_in_polygon(clipper[0], subject)
        if op == 'intersection':
            return [subject] if a_in_b else [clipper] if b_in_a else []
        if op == 'union':
            return [clipper] if a_in_b else [subject] if b_in_a else [subject, clipper]
        return [] if a_in_b else [subject] + ([clipper] if b_in_a else [])   # b_in_a: a hole

    # mark entry/exit
    flip_s = op in ('union', 'difference')              # intersection: both as usual
    flip_c = op == 'union'
    for head, poly_other, flip in ((S[0], clipper, flip_s), (C[0], subject, flip_c)):
        entry = not point_in_polygon((head.x, head.y), poly_other)
        if flip:
            entry = not entry
        cur = head
        while True:
            if cur.is_x:
                cur.entry = entry
                entry = not entry
            cur = cur.next
            if cur is head:
                break

    # trace the paths
    result = []
    for start in _intersections(S):
        if start.visited:
            continue
        ring = []
        cur = start
        while True:
            cur.visited = cur.neighbor.visited = True
            forward = cur.entry
            while True:
                cur = cur.next if forward else cur.prev
                ring.append((cur.x, cur.y))
                if cur.is_x:
                    break
            cur = cur.neighbor
            if cur.visited:
                break
        result.append(ring)
    return result


def _intersections(head):
    out, cur = [], head[0]
    while True:
        if cur.is_x:
            out.append(cur)
        cur = cur.next
        if cur is head[0]:
            return out
```

```python title="sh.py" linenums="1"
from clip import polygon_area


def sutherland_hodgman(subject, clipper):
    """Any subject polygon, clipper must be convex."""
    if polygon_area(clipper) < 0:
        clipper = clipper[::-1]                       # counter-clockwise direction
    out = subject
    for i in range(len(clipper)):
        a, b = clipper[i], clipper[(i + 1) % len(clipper)]

        def inside(p):                                # to the left of the line a->b
            return (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]) >= 0

        def cross_point(p, q):                        # intersection of edge [p,q] with the line a-b
            x1, y1, x2, y2, x3, y3, x4, y4 = *p, *q, *a, *b
            d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
            t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d
            return (x1 + t * (x2 - x1), y1 + t * (y2 - y1))

        inp, out = out, []
        for j in range(len(inp)):
            p, q = inp[j], inp[(j + 1) % len(inp)]
            if inside(q):
                if not inside(p):
                    out.append(cross_point(p, q))
                out.append(q)
            elif inside(p):
                out.append(cross_point(p, q))
        if not out:
            return []
    return out
```

### Usage

```python
from clip import *

A = [(0, 0), (6, 0), (6, 6), (0, 6)]
B = [(3, 3), (9, 3), (9, 9), (3, 9)]
for op in ('intersection', 'union', 'difference'):
    rings = clip(A, B, op)
    print(op, [round(abs(polygon_area(r)), 1) for r in rings])
```

```text
intersection [9.0]
union [63.0]
difference [27.0]
```

!!! success "Verification"
    Our `clip` was compared with **Shapely 2.0.6** (GEOS) on 3,000 random pairs (star-shaped polygons, 4–12 vertices) for all three operations: **the area matches in 8,514 cases and fails in 0**. 72 cases were skipped because the result contained a hole. The JavaScript version used in the demo returns rings identical to the Python ones in 900 cases.

---

## 📚 The same with libraries

=== "Shapely"

    ```python
    from shapely.geometry import Polygon

    a, b = Polygon(A), Polygon(B)
    a.intersection(b)     # or a & b
    a.union(b)            # or a | b
    a.difference(b)       # or a - b
    ```

=== "QGIS (PyQGIS)"

    ```python
    import processing

    processing.run('native:intersection', {'INPUT': layer_a, 'OVERLAY': layer_b, 'OUTPUT': 'intersection.gpkg'})
    processing.run('native:union', {'INPUT': layer_a, 'OVERLAY': layer_b, 'OUTPUT': 'union.gpkg'})
    processing.run('native:difference', {'INPUT': layer_a, 'OVERLAY': layer_b, 'OUTPUT': 'difference.gpkg'})
    ```

!!! warning "What has been verified"
    The Shapely comparison was run. The QGIS snippets were **not run** (QGIS is not installed).

---

## ✍️ Exercises

!!! question "Exercise 1: checking against a reference"
    Write a randomized test: compare the areas for 3,000 pairs of random polygons with Shapely. The generator, `star()`, is below.

    ??? success "Solution"
        ```python
        import math
        import random
        from shapely.geometry import Polygon


        def star(cx, cy, n, r0, r1, rnd):
            angs = sorted(rnd.uniform(0, 2 * math.pi) for _ in range(n))
            return [(cx + r * math.cos(a), cy + r * math.sin(a)) for a in angs for r in [rnd.uniform(r0, r1)]]


        def random_pair(rnd):
            A = star(0, 0, rnd.randint(4, 12), 3, 10, rnd)
            B = star(rnd.uniform(-6, 6), rnd.uniform(-6, 6), rnd.randint(4, 12), 3, 10, rnd)
            return A, B


        rnd = random.Random(1)
        ok = bad = skipped = 0
        for _ in range(3000):
            A, B = random_pair(rnd)
            pa, pb = Polygon(A), Polygon(B)
            if not (pa.is_valid and pb.is_valid):
                continue
            for op, ref in (('intersection', pa.intersection(pb)), ('union', pa.union(pb)), ('difference', pa.difference(pb))):
                if any(len(g.interiors) for g in getattr(ref, 'geoms', [ref])):
                    skipped += 1                       # the result has a hole; our version cannot return it
                    continue
                area = sum(abs(polygon_area(r)) for r in clip(A, B, op))
                if abs(area - ref.area) < 1e-6:
                    ok += 1
                else:
                    bad += 1
        print('correct:', ok, ', wrong:', bad, ', skipped (hole):', skipped)
        ```
        ```text
        correct: 8514 , wrong: 0 , skipped (hole): 72
        ```
        In the test, `is_valid` skips self-intersecting polygons (`star()` sometimes produces them), since clipping algorithms are guaranteed to work only on **valid** polygons.

!!! question "Exercise 2: inclusion–exclusion and holes"
    In theory `area(A ∪ B) = area(A) + area(B) − area(A ∩ B)`. Check this on 500 pairs of the same kind. In which cases does it fail, and why?

    ??? success "Solution"
        ```python
        rnd = random.Random(2)
        n = fail = fail_with_hole = 0
        for _ in range(500):
            A, B = random_pair(rnd)
            pa, pb = Polygon(A), Polygon(B)
            if not (pa.is_valid and pb.is_valid):
                continue
            ai = sum(abs(polygon_area(r)) for r in clip(A, B, 'intersection'))
            au = sum(abs(polygon_area(r)) for r in clip(A, B, 'union'))
            n += 1
            if abs(au - (abs(polygon_area(A)) + abs(polygon_area(B)) - ai)) > 1e-6:
                fail += 1
                fail_with_hole += any(len(g.interiors) for g in getattr(pa.union(pb), 'geoms', [pa.union(pb)]))
        print(n, fail, fail_with_hole)
        ```
        ```text
        478 13 13
        ```
        The equality failed in 13 cases, and **in every one of them the union has a hole** (the two stars wrap around each other, leaving an empty space inside). Our function counts both the outer outline and the hole as positive area. The fix: distinguish rings by orientation (signed area), or use the GeoJSON rule (outer ring counter-clockwise, hole clockwise).

!!! question "Exercise 3: why not use Sutherland–Hodgman everywhere?"
    Clip the U-shaped polygon `U = [(0,0), (9,0), (9,8), (6,8), (6,3), (3,3), (3,8), (0,8)]` with the rectangle `R = [(-1,5), (10,5), (10,9), (-1,9)]`, which crosses both "arms". Compare with Greiner–Hormann and Shapely.

    ??? success "Solution"
        ```python
        from sh import sutherland_hodgman

        U = [(0, 0), (9, 0), (9, 8), (6, 8), (6, 3), (3, 3), (3, 8), (0, 8)]
        R = [(-1, 5), (10, 5), (10, 9), (-1, 9)]
        print('GH:', [round(abs(polygon_area(r)), 1) for r in clip(U, R, 'intersection')])
        res = sutherland_hodgman(U, R)
        print('S-H:', len(res), 'vertices, area', round(abs(polygon_area(res)), 1), ', valid:', Polygon(res).is_valid)
        ref = Polygon(U).intersection(Polygon(R))
        print('true:', ref.area, ref.geom_type)
        print(res)
        ```
        ```text
        GH: [9.0, 9.0]
        S-H: 8 vertices, area 18.0 , valid: False
        true: 18.0 MultiPolygon
        [(6.0, 5.0), (3.0, 5.0), (3, 8), (0, 8), (0.0, 5.0), (9.0, 5.0), (9, 8), (6, 8)]
        ```
        Instead of two "arms", S-H returns one polygon whose two parts are joined by the segment `(3,5)–(0,5)–(9,5)–(6,5)`, which runs over the same edge twice. **The area is correct** (18), but the polygon is **invalid** (Shapely considers it invalid). Greiner–Hormann gives two separate rings.

!!! question "Exercise 4: degenerate cases"
    Intersect the squares `[(0,0),(4,0),(4,4),(0,4)]` and `[(2,0),(6,0),(6,4),(2,4)]`: two of their sides are **collinear** (`y = 0` and `y = 4`). What area does `clip` return, and what should it be? How can it be fixed?

    ??? success "Solution"
        ```python
        sq1 = [(0, 0), (4, 0), (4, 4), (0, 4)]
        sq3 = [(2, 0), (6, 0), (6, 4), (2, 4)]
        print(round(sum(abs(polygon_area(r)) for r in clip(sq1, sq3, 'intersection')), 3))

        rnd = random.Random(0)
        jit = lambda poly: [(x + rnd.uniform(-1e-7, 1e-7), y + rnd.uniform(-1e-7, 1e-7)) for x, y in poly]
        print(round(sum(abs(polygon_area(r)) for r in clip(jit(sq1), jit(sq3), 'intersection')), 3))
        ```
        ```text
        16.0
        8.0
        ```
        The true area is 8 (the rectangle `2 ≤ x ≤ 4`). Our algorithm looks for intersections only **strictly inside** edges (`0 < t < 1`), so in this case it finds none, and the vertex `(2, 0)` lies exactly on the other polygon's side and counts as "inside". Result: the whole of `B` (16). **A widespread fix** is a tiny random "jitter" of the coordinates (1e-7), which removes the degeneracy. This is a common approach in Greiner–Hormann-type algorithms. Professional libraries instead use more robust **exact arithmetic and snapping**, so that the coordinates do not change.
