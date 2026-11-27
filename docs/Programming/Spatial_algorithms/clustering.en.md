# 🧩 Clustering: DBSCAN and k-means

**Clustering** divides a set of points into groups so that members of one group are closer to each other than to other groups. In GIS it is used to find crime "hot spots", accident clusters, the stopping places of moving animals, to merge thousands of markers on a map (groups by zoom level), and to divide customers into service zones.

Two main ideas answer two different questions:

| | **k-means** | **DBSCAN** |
|---|---|---|
| Question | "Split the data into `k` groups" | "Where are the points **dense**?" |
| Number of clusters | Must be known in advance (`k`) | Found by the algorithm |
| Shape | Round, around a centre | Any |
| Noise | Puts every point into some group | Marks it as noise |
| Parameters | `k` | `ε` (radius) and `minPts` |

---

## 🎮 Try it yourself

Switch the data to **"Moons"** and try both algorithms: instead of two crescents, k-means "cuts the space in two", while DBSCAN finds both moons exactly. **"Cities + noise"** contains three groups of different density plus scattered points.

<iframe src="../widgets/clustering.html" title="Clustering interactive demo" style="width:100%;height:760px;border:0" loading="lazy"></iframe>

!!! tip "Observation"
    - **DBSCAN, small ε**: everything is noise, or there are many tiny groups. **Large ε**: nearby groups merge.
    - **k-means, "New centres"**: on the same data, different starting centres can give different results (a local minimum). That is why k-means is run several times and the best result is kept.
    - k-means is excellent on **"Blobs"** but cannot work on **"Moons"**: its groups are always convex.

---

## ⚙️ DBSCAN: density-connected points

Two parameters: the radius `ε` and `minPts`. Each point gets one of three roles:

- **Core**: its `ε`-neighbourhood (including itself) contains at least `minPts` points.
- **Border**: not core, but inside the `ε`-neighbourhood of some core point.
- **Noise**: neither.

A cluster forms as a **chain of core points**: from a core point we expand to all its neighbours, and if a neighbour is also core, its neighbours are added too.

The most expensive part is finding neighbours. Naively that is `O(n)` per point, i.e. `O(n²)` in total. We use a [grid](grids_hex.md) (cell size `ε`): a point's neighbours can only be in its own cell and the 8 surrounding cells. This is the same idea as in [spatial indexes](spatial_indexes.md), and it brings the search down to `O(n)` on average when the points are spread evenly over the grid.

## ⚙️ k-means: the centroid approach

1. Choose `k` starting centres.
2. **Assignment**: assign every point to its nearest centre (this is a [Voronoi](voronoi.md) partition of the plane).
3. **Update**: move each centre to the mean of its members.
4. Repeat until the assignment stops changing.

Each step **decreases** `inertia = Σ d²` (the sum of squared distances from the points to their centres), so the algorithm is guaranteed to stop, but only at a **local** minimum. **k-means++** initialization picks each new centre with probability proportional to the squared distance from the centres already chosen, which spreads the centres apart and reduces the chance of a bad result.

---

## 🐍 Implementation in pure Python

```python title="clus.py" linenums="1"
import math
import random
from collections import defaultdict, deque

NOISE = -1


def dbscan(points, eps, min_pts):
    """DBSCAN. Returns a list of labels: 0, 1, 2, ... or NOISE (-1)."""
    grid = defaultdict(list)                       # grid with cell size eps: neighbours are searched only in 3x3 cells
    for i, (x, y) in enumerate(points):
        grid[(int(x // eps), int(y // eps))].append(i)

    def neighbors(i):
        x, y = points[i]
        gx, gy = int(x // eps), int(y // eps)
        found = []
        for cx in (gx - 1, gx, gx + 1):
            for cy in (gy - 1, gy, gy + 1):
                for j in grid.get((cx, cy), ()):
                    if (points[j][0] - x) ** 2 + (points[j][1] - y) ** 2 <= eps * eps:
                        found.append(j)
        return sorted(found)

    labels = [None] * len(points)                  # None = not visited yet
    cluster = -1
    for i in range(len(points)):
        if labels[i] is not None:
            continue
        nb = neighbors(i)
        if len(nb) < min_pts:
            labels[i] = NOISE                      # may later become a border point
            continue
        cluster += 1
        labels[i] = cluster
        queue = deque(nb)
        while queue:
            j = queue.popleft()
            if labels[j] == NOISE:
                labels[j] = cluster                # border point
            if labels[j] is not None:
                continue
            labels[j] = cluster
            nb_j = neighbors(j)
            if len(nb_j) >= min_pts:               # j is core: keep expanding
                queue.extend(nb_j)
    return labels


def kmeans(points, k, centers=None, seed=0, max_iter=100):
    """Lloyd's algorithm with k-means++ initialization. Returns (labels, centers, inertia)."""
    rnd = random.Random(seed)
    d2 = lambda a, b: (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2
    if centers is None:                            # k-means++: new centre with probability proportional to d²
        centers = [rnd.choice(points)]
        while len(centers) < k:
            w = [min(d2(p, c) for c in centers) for p in points]
            centers.append(rnd.choices(points, weights=w)[0])
    centers = [tuple(c) for c in centers]
    labels = None
    for _ in range(max_iter):
        new = [min(range(k), key=lambda c: d2(p, centers[c])) for p in points]
        if new == labels:
            break
        labels = new
        for c in range(k):
            members = [p for p, l in zip(points, labels) if l == c]
            if members:
                centers[c] = (sum(p[0] for p in members) / len(members), sum(p[1] for p in members) / len(members))
    inertia = sum(d2(p, centers[l]) for p, l in zip(points, labels))
    return labels, centers, inertia
```

### Usage

```python
import math
import random
from clus import *

random.seed(4)
# two "moons" + 30 random points as noise
moons, truth = [], []
for _ in range(150):
    t = random.uniform(0, math.pi)
    moons.append((math.cos(t) * 10 + random.gauss(0, 0.6), math.sin(t) * 10 + random.gauss(0, 0.6)))
    truth.append(0)
    moons.append((10 - math.cos(t) * 10 + random.gauss(0, 0.6), 4 - math.sin(t) * 10 + random.gauss(0, 0.6)))
    truth.append(1)
noise = [(random.uniform(-5, 15), random.uniform(-8, 14)) for _ in range(30)]
points = moons + noise

db = dbscan(points, eps=1.8, min_pts=6)
print('DBSCAN clusters:', len(set(db) - {NOISE}), ', noise:', db.count(NOISE))
km, centers, inertia = kmeans(points, k=2, seed=1)
print('k-means centres:', [tuple(round(v, 1) for v in c) for c in centers])
```

```text
DBSCAN clusters: 2 , noise: 14
k-means centres: [(12.1, -0.8), (-1.3, 5.0)]
```

!!! success "Verification"
    Our DBSCAN and k-means were compared with **scikit-learn 1.6**. The DBSCAN labels match completely on three different `(ε, minPts)` pairs (adjusted Rand index = 1.0, and the noise points are the same). From the same starting centres, k-means gives the same centres and inertia (1743.2 on this page's 4-blob data). The best inertia over ten runs matches `KMeans(n_init=10)` for `k = 1…6`, while for `k = 7` and `8` scikit-learn is slightly better (1188.6 vs 1228.9 and 1073.4 vs 1106.0), because the local minima differ depending on the starting centres. The JavaScript version used in the demo returns the same labels as the Python one.

---

## 📚 The same with libraries

=== "scikit-learn"

    ```python
    import numpy as np
    from sklearn.cluster import DBSCAN, KMeans

    X = np.array(points)
    db_labels = DBSCAN(eps=1.8, min_samples=6).fit_predict(X)      # -1 = noise
    km = KMeans(n_clusters=2, n_init=10, random_state=0).fit(X)
    ```

    `min_samples` is the same as our `min_pts` (a point counts itself).

=== "QGIS (PyQGIS)"

    ```python
    import processing

    processing.run('native:dbscanclustering', {
        'INPUT': points_layer, 'MIN_SIZE': 6, 'EPS': 250,
        'DBSCAN*': False, 'FIELD_NAME': 'CLUSTER_ID', 'SIZE_FIELD_NAME': 'CLUSTER_SIZE',
        'OUTPUT': 'clusters.gpkg'})
    ```

!!! warning "What has been verified"
    The comparison with scikit-learn was run. The QGIS snippet was **not run** (QGIS is not installed), so check the parameter names against the documentation. In QGIS `EPS` is in the units of the layer's coordinate system, so for a geographic (degree-based) layer see Exercise 4.

---

## ✍️ Exercises

!!! question "Exercise 1: which algorithm is more accurate on the moons?"
    Compute the **purity** of both methods: for each cluster take its majority true class and count how many points match. Count noise as an error. Use only the 300 "moon" points (no noise).

    ??? success "Solution"
        ```python
        from collections import Counter


        def purity(truth, labels):
            ok = 0
            for l in set(labels) - {NOISE}:
                ok += Counter(t for t, x in zip(truth, labels) if x == l).most_common(1)[0][1]
            return ok / len(truth)


        db = dbscan(moons, 1.8, 6)
        km, _, _ = kmeans(moons, 2, seed=1)
        print('DBSCAN purity', round(purity(truth, db), 3), '| k-means', round(purity(truth, km), 3))
        ```
        ```text
        DBSCAN purity 1.0 | k-means 0.733
        ```
        k-means "slices through" the moons with a straight boundary, because it defines clusters by distance to a centre. 27% of the points end up in the wrong group. DBSCAN does not care about shape, only about density.

!!! question "Exercise 2: how many groups? (the idea of the inertia "elbow")"
    Compute the best inertia (over ten runs) for `k = 1…8` on 4-blob data (generated below) and find the `k` after which the drop slows down sharply (the **"elbow"** rule).

    ??? success "Solution"
        ```python
        random.seed(9)
        blobs = [(random.gauss(cx, 1.5), random.gauss(cy, 1.5)) for cx, cy in [(0, 0), (12, 2), (6, 11), (-4, 9)] for _ in range(100)]
        for k in range(1, 9):
            best = min(kmeans(blobs, k, seed=s)[2] for s in range(10))
            print(f'k={k}: inertia {best:8.0f}')
        ```
        ```text
        k=1: inertia    25612
        k=2: inertia    12461
        k=3: inertia     6455
        k=4: inertia     1743
        k=5: inertia     1542
        k=6: inertia     1356
        k=7: inertia     1229
        k=8: inertia     1106
        ```
        From `k = 3` to `4` the inertia falls from 6455 to 1743 (−73%), while `4 → 5` goes only from 1743 to 1542 (−12%). The elbow is at `k = 4`, which is exactly the true number of blobs. It is not always this clear: on real data the elbow is often vague, and people additionally rely on the **silhouette** or on the logic of the task.

!!! question "Exercise 3: how sensitive is DBSCAN to ε?"
    Run DBSCAN on the moons (`min_pts = 6`) with `ε = 0.4, 0.8, 1.2, 1.8, 3.0` and count the clusters and the noise.

    ??? success "Solution"
        ```python
        for eps in (0.4, 0.8, 1.2, 1.8, 3.0):
            lab = dbscan(moons, eps, 6)
            print(f'eps={eps}: clusters {len(set(lab) - {NOISE})}, noise {lab.count(NOISE)}')
        ```
        ```text
        eps=0.4: clusters 0, noise 300
        eps=0.8: clusters 17, noise 93
        eps=1.2: clusters 8, noise 9
        eps=1.8: clusters 2, noise 0
        eps=3.0: clusters 2, noise 0
        ```
        With a very small `ε` everything is noise, with a small one the moons break into pieces, and within a reasonable range (1.8–3.0) the result is stable. `ε` is often chosen with a **k-distance plot**: for each point, take the distance to its `minPts`-th nearest neighbour, sort these distances in increasing order, and take `ε` at the "knee".

        This is DBSCAN's well-known weakness: **one `ε` for every cluster**. If the groups have different densities (as in the demo's "Cities" data), a single `ε` either splits the dense one or declares the sparse one noise. For this case there are **HDBSCAN**/**OPTICS**.

!!! question "Exercise 4: degrees or metres?"
    We have points around Tbilisi (`lon, lat` in degrees). `ε = 0.003°` looks like an ordinary choice, but how many metres is it in different directions? Compare `ε = 0.003°` (in degrees) and `ε = 250 m` (after converting to metres): how many pairs of points count as neighbours?

    ??? success "Solution"
        ```python
        import math

        random.seed(21)
        lon0, lat0 = 44.80, 41.72
        M_LAT, M_LON = 110574, 111320 * math.cos(math.radians(lat0))      # metres per degree
        centers_m = [(0, 0), (1800, 600), (-1200, 1500)]
        geo = [(lon0 + (cx + random.gauss(0, 120)) / M_LON, lat0 + (cy + random.gauss(0, 120)) / M_LAT)
               for cx, cy in centers_m for _ in range(120)]
        geo += [(lon0 + random.uniform(-0.04, 0.05), lat0 + random.uniform(-0.02, 0.03)) for _ in range(40)]
        proj = [((x - lon0) * M_LON, (y - lat0) * M_LAT) for x, y in geo]

        print('0.003° =', round(0.003 * M_LON), 'm (east) and', round(0.003 * M_LAT), 'm (north)')
        n = len(geo)
        pd_ = pm = 0
        for i in range(n):
            for j in range(i + 1, n):
                pd_ += math.dist(geo[i], geo[j]) <= 0.003
                pm += math.dist(proj[i], proj[j]) <= 250
        print('pairs within ε:', pd_, '(degrees),', pm, '(metres)')
        ```
        ```text
        0.003° = 249 m (east) and 332 m (north)
        pairs within ε: 16431 (degrees), 14320 (metres)
        ```
        In degrees, `ε` is really an **ellipse** (249 × 332 m) and counts 15% more pairs as neighbours than a circular 250 metres. On this data the number of clusters came out as 3 in both cases, but in a dense city the directional difference will have an effect. The rule: **transform the coordinates to a metric system** (UTM, or EPSG:32638 for Georgia), or use the haversine distance.
