# 👁️ Viewshed

A **viewshed** is every place on the map that can be seen from a given point. It is used for placing mobile-phone masts, planning fire lookout towers, assessing the visual impact of wind turbines, and analysing scenic views. Everything rests on one question: **can point `A` see point `B`, or is the terrain in the way?**

---

## 💡 The idea: line of sight

Draw a straight line from `A` to `B` and check whether **the terrain rises above this line at any point**. For this we compute, for every terrain cell, the **slope** from the observer's eye:

```text
slope(cell) = (cell elevation − eye elevation) / distance
```

The target is visible if and only if **its slope is not less than the slope of every intermediate cell**. So we keep just one number, a running maximum (`max_slope`), and make one comparison per cell.

The cells along the line are chosen by **Bresenham's algorithm**: it returns the raster cells closest to a straight line using only integers.

---

## 🎮 Try it yourself

Click on the map to move the observer. A line of sight is drawn to the point under the cursor, and the terrain profile appears below.

<iframe src="../widgets/viewshed.html" title="Viewshed interactive demo" style="width:100%;height:880px;border:0" loading="lazy"></iframe>

!!! tip "Observation"
    - Raising the observer (a tower, a mast) increases the viewshed, but **not at a constant rate**: the first ten metres are more effective than the next forty (see Exercise 1).
    - Target height helps: a building or mast can be visible even when its base is in shadow.

---

## 🐍 Implementation in pure Python

```python title="view.py" linenums="1"
import math


def bresenham(r0, c0, r1, c1):
    """Cells on the straight line from (r0,c0) to (r1,c1), including both ends."""
    cells = []
    dr, dc = abs(r1 - r0), abs(c1 - c0)
    sr = 1 if r1 > r0 else -1
    sc = 1 if c1 > c0 else -1
    err = dc - dr
    r, c = r0, c0
    while True:
        cells.append((r, c))
        if (r, c) == (r1, c1):
            return cells
        e2 = 2 * err
        if e2 > -dr:
            err -= dr
            c += sc
        if e2 < dc:
            err += dc
            r += sr


def line_of_sight(dem, obs, target, h_obs=1.7, h_target=0.0, cell=30.0):
    """Whether the observer obs=(r,c) can see the target target=(r,c).
    cell = cell size in metres, elevations in metres."""
    (r0, c0), (r1, c1) = obs, target
    z0 = dem[r0][c0] + h_obs
    max_slope = -math.inf
    path = bresenham(r0, c0, r1, c1)[1:]
    for r, c in path:
        d = math.hypot(r - r0, c - c0) * cell
        if (r, c) == target:
            return (dem[r][c] + h_target - z0) / d >= max_slope
        max_slope = max(max_slope, (dem[r][c] - z0) / d)   # the line touches this cell's surface
    return True                                            # obs == target


def viewshed(dem, obs, h_obs=1.7, h_target=0.0, cell=30.0):
    """Boolean matrix: True = the cell is visible."""
    rows, cols = len(dem), len(dem[0])
    return [[line_of_sight(dem, obs, (r, c), h_obs, h_target, cell) for c in range(cols)] for r in range(rows)]
```

### Usage

```python
import math
from view import *


def terr(r, c):
    return 120 + 60 * math.sin(c / 9) * math.cos(r / 7) + 35 * math.sin((r + c) / 13) + 25 * math.cos(c / 4.5) * math.sin(r / 5)


dem = [[terr(r, c) for c in range(60)] for r in range(40)]     # 40 x 60, 30 m cells
vs = viewshed(dem, (20, 30), h_obs=10)
print('visible:', sum(map(sum, vs)), 'cells of 2400')
print(bresenham(0, 0, 3, 7))
```

```text
visible: 1091 cells of 2400
[(0, 0), (0, 1), (1, 2), (1, 3), (2, 4), (2, 5), (3, 6), (3, 7)]
```

!!! success "Verification"
    Three simple cases behave as they should: on **completely flat terrain** every cell is visible; with **a single wall** (height 100) the wall itself is visible, the cells behind it are not, and everything in front of the wall is visible. The JavaScript version used in the demo gives the same numbers (1000, 1091, 1385 cells at 1.7, 10 and 50 m).

!!! info "Complexity"
    For each cell the line takes `O(L)` steps (`L` is the raster's length), so the whole viewshed is `O(N·L)`. This is the simple **"every line separately"** version. **R2/R3 and sweep-line** algorithms (e.g. in GRASS) compute the viewshed much faster, reusing some information between lines.

---

## 📚 The same with libraries

=== "GDAL"

    ```bash
    gdal_viewshed -ox 44.80 -oy 41.72 -oz 10 -tz 0 -md 20000 dem.tif viewshed.tif
    ```

    `-oz` is the observer height, `-tz` the target height, `-md` the maximum distance. By default GDAL also accounts for the Earth's curvature (the `-cc` coefficient).

=== "QGIS (PyQGIS)"

    ```python
    import processing

    processing.run('gdal:viewshed', {
        'INPUT': 'dem.tif', 'BAND': 1,
        'OBSERVER': '44.80,41.72 [EPSG:4326]',
        'OBSERVER_HEIGHT': 10, 'TARGET_HEIGHT': 0,
        'MAX_DISTANCE': 20000, 'OUTPUT': 'viewshed.tif'})
    ```

!!! warning "What has been verified"
    The library snippets were **not run** in this environment (GDAL and QGIS are not installed). Check the parameter names against the documentation, especially for your GDAL version, since `gdal_viewshed` is a relatively new command.

---

## ✍️ Exercises

!!! question "Exercise 1: the effect of height"
    Compute the share of visible cells from `(20, 30)` for observer heights `0, 2, 10, 50` metres.

    ??? success "Solution"
        ```python
        total = 60 * 40
        for h in (0, 2, 10, 50):
            n = sum(map(sum, viewshed(dem, (20, 30), h)))
            print(f'height {h:2} m: {n:4} cells ({100 * n / total:.1f}%)')
        ```
        ```text
        height  0 m:  958 cells (39.9%)
        height  2 m: 1001 cells (41.7%)
        height 10 m: 1091 cells (45.5%)
        height 50 m: 1385 cells (57.7%)
        ```
        The growth is non-linear: from 0 to 10 metres +5.6 percentage points, from 10 to 50 +12.2, but each metre gives less (effect per metre of height: ~0.56 pp over the first 10 m, ~0.31 over the next 40 m). So "one more metre" is worth less the higher you already are.

!!! question "Exercise 2: is visibility symmetric?"
    If `A` sees `B`, does `B` see `A`? Check on 2,000 random pairs (both heights 0).

    ??? success "Solution"
        ```python
        import random
        random.seed(1)
        asym = 0
        N = 2000
        for _ in range(N):
            a = (random.randrange(40), random.randrange(60))
            b = (random.randrange(40), random.randrange(60))
            if line_of_sight(dem, a, b, 0, 0) != line_of_sight(dem, b, a, 0, 0):
                asym += 1
        print('asymmetric pairs:', asym, 'of', N)
        ```
        ```text
        asymmetric pairs: 28 of 2000
        ```
        In theory visibility is symmetric (the same line in both directions), but **not on a raster**: from `A` to `B` and from `B` to `A`, Bresenham picks different cells, so in 1.4% of the pairs the answer differs. If you need symmetry (e.g. a two-way radio link), check both directions and combine them with "and". **Different heights** for the observer and the target also introduce asymmetry.

!!! question "Exercise 3: the Earth's curvature"
    Add a version of `line_of_sight` that lowers the elevation at distance `d` by `(1 − k)·d² / (2R)` (`R = 6,371 km`, refraction `k = 0.13`). Compare the visible cells for cell sizes of 30, 300 and 1000 m (with the same terrain elevations).

    ??? success "Solution"
        ```python
        R_EARTH = 6371000.0
        K_REFR = 0.13


        def los_curved(dem, obs, target, h_obs, h_target=0.0, cell=30.0):
            (r0, c0), (r1, c1) = obs, target
            z0 = dem[r0][c0] + h_obs
            drop = lambda d: (1 - K_REFR) * d * d / (2 * R_EARTH)
            max_slope = -math.inf
            for r, c in bresenham(r0, c0, r1, c1)[1:]:
                d = math.hypot(r - r0, c - c0) * cell
                if (r, c) == target:
                    return (dem[r][c] + h_target - drop(d) - z0) / d >= max_slope
                max_slope = max(max_slope, (dem[r][c] - drop(d) - z0) / d)
            return True


        obs = (20, 30)
        for cell in (30, 300, 1000):
            flat = sum(sum(line_of_sight(dem, obs, (r, c), 10, 0, cell) for c in range(60)) for r in range(40))
            curv = sum(sum(los_curved(dem, obs, (r, c), 10, 0, cell) for c in range(60)) for r in range(40))
            print(f'cell {cell:4} m: without curvature {flat}, with curvature {curv}')
        ```
        ```text
        cell   30 m: without curvature 1091, with curvature 1090
        cell  300 m: without curvature 1091, with curvature 1076
        cell 1000 m: without curvature 1091, with curvature 870
        ```
        Two interesting conclusions. On a **flat Earth**, visibility does not depend on scale (all distances grow equally, so the comparison of slopes does not change). **Curvature**, however, makes scale matter: with 30-metre cells (a 1.8 km map) its effect is negligible, while with 1 km cells (a 60 km map) the viewshed shrinks by ~20%. So over long distances curvature must be taken into account.

!!! question "Exercise 4: where should the towers go?"
    Choose 4 points (on a grid every 5 cells, height 10 m) so that together they cover as much territory as possible. Use a **greedy algorithm**: at each step pick the point that adds the most not-yet-covered cells.

    ??? success "Solution"
        ```python
        def greedy(dem, k, h=10, step=5):
            cands = [(r, c) for r in range(0, 40, step) for c in range(0, 60, step)]
            vs = {p: {(r, c) for r in range(40) for c in range(60) if line_of_sight(dem, p, (r, c), h)} for p in cands}
            chosen, covered = [], set()
            for _ in range(k):
                best = max(cands, key=lambda p: len(vs[p] - covered))
                chosen.append(best)
                covered |= vs[best]
                print(f'  + {best}: total coverage {100 * len(covered) / total:.1f}%')
            return chosen


        greedy(dem, 4)
        ```
        ```text
          + (20, 40): total coverage 64.9%
          + (35, 55): total coverage 84.1%
          + (0, 15): total coverage 93.7%
          + (10, 55): total coverage 96.5%
        ```
        This is the **maximum coverage** problem: the exact solution is NP-hard, while the greedy one is guaranteed to reach ≥ 63% of the optimum and in practice is often much better. The first tower covers the best area, and each subsequent one covers less: the classic picture of **diminishing returns**.
