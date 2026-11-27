# 🗻 Contours: Marching squares

An isoline (contour) is a line that joins points of equal value: equal elevation on terrain, equal temperature on a weather map. Extracting them from a raster is one of the most common GIS operations, and in QGIS `gdal:contour` does exactly this. Under the hood, the **Marching squares** algorithm is at work.

---

## 💡 The idea

A raster is a set of values arranged on a grid. Take one **cell**, formed by four neighbouring pixels, and suppose we want to draw the contour for level `L`:

1. At each corner we check whether its value is **above** `L`. The result is 4 bits, i.e. **16 possible cases**.
2. The case tells us which **edges** the contour crosses. For example, if only the bottom-left corner is high, the line crosses the left and bottom edges.
3. We find the crossing point by **linear interpolation** between the two ends of the edge: `t = (L − a) / (b − a)`.
4. We join the segments of all cells into polylines.

---

## 🎮 Try it yourself

Change the interval and hover over a grid cell: you can see its 4 corners, the case number (e.g. `0101 = 5`) and the segment drawn through this cell. Turn on "Grid" to see the cells clearly.

<iframe src="../widgets/contours.html" title="Marching squares interactive demo" style="width:100%;height:700px;border:0" loading="lazy"></iframe>

!!! tip "Observation"
    - Reducing the interval packs the lines closer together, and the number of segments grows quickly.
    - Contours never cross: one point cannot have two different levels.
    - Lines either **close** or reach the edge of the grid.

---

## ⚠️ Saddle ambiguity

If two **diagonal** corners are high (cases `0101` and `1010`), the two high areas may either **connect** or **stay separate**. Both interpretations agree with the corner data. The choice is based on the value at the **centre of the cell**, which the grid does not have, so we estimate it as the mean of the four corners. If it is above `L`, the high corners are connected.

!!! warning "Level exactly equal to a value"
    If `L` is exactly equal to some pixel's value, the contour passes through a grid vertex and you get duplicated points in neighbouring cells. On a floating-point grid this is rare, but on an integer DEM (in metres) it is common. That is why levels are often shifted slightly (e.g. `+0.01`).

---

## 🐍 Implementation in pure Python

```python title="contours.py" linenums="1"
import math

# Edges of a grid cell: T = top, R = right, B = bottom, L = left
# index = TL*8 + TR*4 + BR*2 + BL*1 (1 if the value >= level)
CASES = {
    0: [], 15: [],
    1: [('L', 'B')], 14: [('L', 'B')],
    2: [('B', 'R')], 13: [('B', 'R')],
    3: [('L', 'R')], 12: [('L', 'R')],
    4: [('T', 'R')], 11: [('T', 'R')],
    6: [('T', 'B')], 9: [('T', 'B')],
    7: [('L', 'T')], 8: [('L', 'T')],
}


def _edge_point(edge, r, c, tl, tr, br, bl, level):
    """A point on the cell edge by linear interpolation."""
    def lerp(a, b):
        return (level - a) / (b - a)

    if edge == 'T':
        return (c + lerp(tl, tr), r)
    if edge == 'B':
        return (c + lerp(bl, br), r + 1)
    if edge == 'L':
        return (c, r + lerp(tl, bl))
    return (c + 1, r + lerp(tr, br))             # 'R'


def marching_squares(grid, level):
    """Returns a list of segments [((x1, y1), (x2, y2)), ...] (x = column, y = row)."""
    segments = []
    for r in range(len(grid) - 1):
        for c in range(len(grid[0]) - 1):
            tl, tr = grid[r][c], grid[r][c + 1]
            bl, br = grid[r + 1][c], grid[r + 1][c + 1]
            case = (tl >= level) * 8 + (tr >= level) * 4 + (br >= level) * 2 + (bl >= level)
            if case in (5, 10):                  # saddle: two options, decided by the centre
                center_high = (tl + tr + bl + br) / 4 >= level
                if (case == 5) == center_high:
                    pairs = [('L', 'T'), ('B', 'R')]
                else:
                    pairs = [('L', 'B'), ('T', 'R')]
            else:
                pairs = CASES[case]
            for e1, e2 in pairs:
                p1 = _edge_point(e1, r, c, tl, tr, br, bl, level)
                p2 = _edge_point(e2, r, c, tl, tr, br, bl, level)
                segments.append((p1, p2))
    return segments


def join_segments(segments, ndigits=9):
    """Joins segments into polylines (via shared end points)."""
    key = lambda p: (round(p[0], ndigits), round(p[1], ndigits))
    ends = {}
    for i, (a, b) in enumerate(segments):
        ends.setdefault(key(a), []).append(i)
        ends.setdefault(key(b), []).append(i)
    used = [False] * len(segments)
    lines = []
    for i in range(len(segments)):
        if used[i]:
            continue
        used[i] = True
        line = [segments[i][0], segments[i][1]]
        for forward in (True, False):            # extend in both directions
            while True:
                tip = line[-1] if forward else line[0]
                nxt = next((j for j in ends[key(tip)] if not used[j]), None)
                if nxt is None:
                    break
                used[nxt] = True
                a, b = segments[nxt]
                other = b if key(a) == key(tip) else a
                if forward:
                    line.append(other)
                else:
                    line.insert(0, other)
        lines.append(line)
    return lines


def contour_levels(zmin, zmax, interval, base=0):
    """Levels base + k * interval that fall within [zmin, zmax]."""
    first = math.ceil((zmin - base) / interval)
    last = math.floor((zmax - base) / interval)
    return [base + k * interval for k in range(first, last + 1)]
```

### Usage

```python
import math

# an artificial hill: z = distance from the centre (a cone)
n, cx, cy = 61, 30, 30
grid = [[math.hypot(c - cx, r - cy) for c in range(n)] for r in range(n)]

for level in (5.3, 12.5, 20.3):
    segments = marching_squares(grid, level)
    lines = join_segments(segments)
    closed = len(lines) == 1 and lines[0][0] == lines[0][-1]
    err = max(abs(math.hypot(x - cx, y - cy) - level) for s in segments for (x, y) in s)
    print(level, len(segments), 'segments,', len(lines), 'line,', 'closed' if closed else 'open', f'deviation {err:.3f}')

print(contour_levels(3.2, 47.9, 10))      # [10, 20, 30, 40]
```

```text
5.3 44 segments, 1 line, closed deviation 0.018
12.5 100 segments, 1 line, closed deviation 0.009
20.3 164 segments, 1 line, closed deviation 0.006
[10, 20, 30, 40]
```

On a cone every contour is a circle and the deviation is less than 2% of a cell: interpolation works very well.

---

## 🧰 The same with libraries

=== "PyQGIS / GDAL"

    ```python
    processing.run('gdal:contour', {
        'INPUT': r'C:/Users/Public/Documents/practice/Raster/srtm_45_04.tif',
        'BAND': 1,
        'INTERVAL': 200,
        'FIELD_NAME': 'ELEV',
        'OUTPUT': r'C:/Users/Public/Documents/practice/shp/contours_200.shp',
    })
    ```

=== "Matplotlib"

    ```python
    import matplotlib.pyplot as plt
    import numpy as np

    z = np.array(grid)
    cs = plt.contour(z, levels=[5.3, 12.5, 20.3])
    plt.gca().set_aspect('equal'); plt.show()
    ```

=== "scikit-image"

    ```python
    from skimage import measure

    lines = measure.find_contours(np.array(grid), 12.5)   # list of (row, col) coordinates
    ```

---

## 📝 Exercises

!!! question "Exercise 1"
    Check that the number of segments per cell is 0, 1 or 2, and separately count how many cells fell into each of the 16 cases for a different field.

    ??? success "Solution"
        ```python
        from collections import Counter
        import random

        random.seed(1)
        field = [[math.sin(c / 6) + math.cos(r / 5) + 0.3 * math.sin((c + r) / 3) + 0.2 * random.random()
                  for c in range(80)] for r in range(60)]

        level = 0.4
        counts = Counter()
        per_cell = Counter()
        for r in range(59):
            for c in range(79):
                tl, tr = field[r][c], field[r][c + 1]
                bl, br = field[r + 1][c], field[r + 1][c + 1]
                case = (tl >= level) * 8 + (tr >= level) * 4 + (br >= level) * 2 + (bl >= level)
                counts[case] += 1
                per_cell[2 if case in (5, 10) else len(CASES[case])] += 1

        print(sorted(counts.items()))
        print(per_cell)        # Counter({0: 4126, 1: 522, 2: 13})
        ```
        Most cells are not crossed by the contour at all, and two segments occur only in saddle cells (13 of them).

!!! question "Exercise 2"
    Build the 3×3 "checkerboard" grid `[[1,0,1],[0,1,0],[1,0,1]]` and draw the contour at level `0.5` with two rules: (a) by the centre mean, (b) always "do not connect". How many polylines do you get, and why do they differ?

    ??? success "Solution"
        ```python
        checker = [[1, 0, 1], [0, 1, 0], [1, 0, 1]]

        # (a) the standard rule
        a = join_segments(marching_squares(checker, 0.5))

        # (b) at saddles always draw two separate lines (high areas stay separate)
        def always_separate(grid, level):
            segs = []
            for r in range(len(grid) - 1):
                for c in range(len(grid[0]) - 1):
                    tl, tr, bl, br = grid[r][c], grid[r][c + 1], grid[r + 1][c], grid[r + 1][c + 1]
                    case = (tl >= level) * 8 + (tr >= level) * 4 + (br >= level) * 2 + (bl >= level)
                    if case in (5, 10):
                        pairs = [('L', 'B'), ('T', 'R')] if case == 5 else [('L', 'T'), ('B', 'R')]
                    else:
                        pairs = CASES[case]
                    for e1, e2 in pairs:
                        segs.append((_edge_point(e1, r, c, tl, tr, br, bl, level),
                                     _edge_point(e2, r, c, tl, tr, br, bl, level)))
            return segs

        b = join_segments(always_separate(checker, 0.5))
        print(len(a), len(b))      # 4 5
        ```
        The two rules give different topologies: in one case the high areas are connected, in the other they are not. Both agree equally well with the grid data.

!!! question "Exercise 3"
    On the synthetic terrain `z = 100 + 80·sin(x/12)·cos(y/9)` (a 120×80 grid), compute the **total length** of the isolines for intervals `5, 10, 20, 40`. How does the length change when the interval doubles?

    ??? success "Solution"
        ```python
        terrain = [[100 + 80 * math.sin(c / 12) * math.cos(r / 9) for c in range(120)] for r in range(80)]
        zmin = min(min(row) for row in terrain)
        zmax = max(max(row) for row in terrain)

        for interval in (5, 10, 20, 40):
            total = 0
            for level in contour_levels(zmin, zmax, interval):
                for a, b in marching_squares(terrain, level + 0.01):
                    total += math.dist(a, b)
            print(interval, round(total))
        ```
        Doubling the interval cuts the length roughly **in half**: we have half as many isolines.

!!! question "Exercise 4 (PyQGIS)"
    Read a block of a DEM in QGIS with `QgsRasterBlock`, run `marching_squares` on it and write the result to an in-memory line layer, with the lines georeferenced.

    ??? success "Solution"
        ```python
        layer = iface.activeLayer()                       # DEM
        ext = layer.extent()
        w, h = layer.width(), layer.height()
        block = layer.dataProvider().block(1, ext, w, h)
        grid = [[block.value(r, c) for c in range(w)] for r in range(h)]

        px, py = ext.width() / w, ext.height() / h
        def to_map(p):                                    # (column, row) -> map coordinate
            return QgsPointXY(ext.xMinimum() + (p[0] + 0.5) * px,
                              ext.yMaximum() - (p[1] + 0.5) * py)

        out = QgsVectorLayer(f'LineString?crs={layer.crs().authid()}&field=elev:double', 'my_contours', 'memory')
        for level in contour_levels(min(map(min, grid)), max(map(max, grid)), 200):
            for line in join_segments(marching_squares(grid, level + 0.01)):
                f = QgsFeature(out.fields())
                f.setGeometry(QgsGeometry.fromPolylineXY([to_map(p) for p in line]))
                f['elev'] = level
                out.dataProvider().addFeature(f)
        QgsProject.instance().addMapLayer(out)
        ```
        On a large DEM this is slow. For a quick test take a small fragment and compare the result with `gdal:contour`.
