# 🌡️ Interpolation: IDW and Kriging

We have measurements at **individual points** (temperature at weather stations, elevation at GPS points, pollution at sampling sites), but we need the value **at any other point**, or a whole raster. Interpolation solves this. All its methods rest on one assumption: **nearby points are more alike than distant ones** (Tobler's first law). The methods differ in **how much** and **how** they take this into account.

| Method | Idea | Strength | Weakness |
|---|---|---|---|
| Nearest neighbour | Value = that of the nearest sample ([Voronoi](voronoi.md)) | Simplest, does not alter the data | Stepped surface |
| **IDW** | Weighted mean of all samples, weight decreases with distance | Simple, fast | Between samples the surface cannot leave their range; "bull's-eyes" appear around them |
| **Kriging** | Weights are set by the data's spatial correlation (variogram) | Also gives an **error estimate** | More complex, needs a variogram to be chosen |

---

## 🎮 Try it yourself

Click on the map to add a sample. The table below shows each method's error against a hidden "true" surface. Switch methods and try the sliders.

<iframe src="../widgets/interpolation.html" title="Interpolation interactive demo" style="width:100%;height:760px;border:0" loading="lazy"></iframe>

!!! tip "Observation"
    - **IDW power `p`**: with a large `p` the surface tends towards nearest neighbour (steps); with a small one it is overly smoothed. `p = 2` is the traditional starting value.
    - **Kriging variance** (the yellow map): light (low) near the samples, dark (high) far from them. IDW does not tell us this: it is equally confident everywhere.
    - With few samples and a small range, Kriging can even be worse than IDW. The variogram has to fit the data.

---

## ⚙️ IDW: inverse distance weighted mean

For the point `P` being estimated, we give each sample `i` the weight `wᵢ = 1 / dᵢᵖ`, where `dᵢ` is the distance from `P` to `i`:

```text
z(P) = Σ wᵢ · zᵢ  /  Σ wᵢ
```

- Exactly at a sample point `d = 0`, so we return the sample's value directly.
- The weights are normalized, so the result **always lies between the minimum and maximum of the samples**: IDW cannot predict a peak that has not been sampled.

---

## ⚙️ Kriging: weights from the structure of the data

In IDW the weight depends only on distance. Kriging takes two things into account:

1. **How much values differ as distance grows**: this is described by the **variogram** `γ(h)`. It grows with `h` and levels off into a plateau at the **range** `a`: points farther apart than that no longer influence each other.
2. **How the samples overlap each other**: two samples close together tell us the same thing, so each gets less weight (**correction for clustering**, as in the Thiessen mean).

In **ordinary kriging** the weights come from a linear system:

```text
| γ(xᵢ,xⱼ)  1 |   | w |   | γ(xᵢ,P) |
|   1ᵀ      0 | · | μ | = |    1    |
```

The last row says `Σ w = 1`; `μ` is the Lagrange multiplier. Result: `z(P) = Σ wᵢ zᵢ` and the **variance** `σ²(P) = Σ wᵢ γ(xᵢ,P) + μ`.

Our demo uses an **exponential variogram** `γ(h) = 1 − e^(−3h/a)` with no nugget. In that case the size of the sill does not affect the weights, so only `a` remains as a parameter. On real data the variogram is **fitted to empirical data**: `γ` is computed for pairs of points in distance bins, and a model is fitted to it (spherical, exponential, gaussian).

!!! info "Complexity"
    At a single point, Kriging needs to solve a system of `n+1` equations, `O(n³)`. We invert the matrix once and then, for each cell, only multiply by a vector, `O(n²)`. So for large rasters often only the **k nearest samples** are used (a "moving neighborhood"), for which a [k-d tree](spatial_indexes.md) is used.

---

## 🐍 Implementation in pure Python

```python title="interp.py" linenums="1"
import math


def nearest_value(samples, x, y):
    """Nearest neighbour = the value of the Voronoi cell."""
    return min(samples, key=lambda s: (s[0] - x) ** 2 + (s[1] - y) ** 2)[2]


def idw(samples, x, y, power=2.0):
    """Inverse Distance Weighting. samples = [(x, y, value), ...]."""
    num = den = 0.0
    for sx, sy, v in samples:
        d2 = (sx - x) ** 2 + (sy - y) ** 2
        if d2 == 0:
            return v                           # exactly at a sample point
        w = d2 ** (-power / 2)                 # 1 / d^power
        num += w * v
        den += w
    return num / den


def exp_variogram(h, rng):
    """Exponential variogram (nugget 0, sill 1)."""
    return 1 - math.exp(-3 * h / rng)


def solve(A, b):
    """Gaussian elimination with partial pivoting."""
    n = len(A)
    M = [row[:] + [b[i]] for i, row in enumerate(A)]
    for c in range(n):
        p = max(range(c, n), key=lambda r: abs(M[r][c]))
        M[c], M[p] = M[p], M[c]
        for r in range(c + 1, n):
            f = M[r][c] / M[c][c]
            for k in range(c, n + 1):
                M[r][k] -= f * M[c][k]
    x = [0.0] * n
    for r in range(n - 1, -1, -1):
        x[r] = (M[r][n] - sum(M[r][k] * x[k] for k in range(r + 1, n))) / M[r][r]
    return x


def ordinary_kriging(samples, x, y, rng):
    """Ordinary kriging: returns (estimate, variance)."""
    n = len(samples)
    A = [[exp_variogram(math.hypot(a[0] - b[0], a[1] - b[1]), rng) for b in samples] + [1.0] for a in samples]
    A.append([1.0] * n + [0.0])
    g0 = [exp_variogram(math.hypot(s[0] - x, s[1] - y), rng) for s in samples] + [1.0]
    sol = solve(A, g0)
    w, mu = sol[:n], sol[n]
    z = sum(wi * s[2] for wi, s in zip(w, samples))
    var = sum(wi * gi for wi, gi in zip(w, g0[:n])) + mu
    return z, var
```

### Usage

```python
import math
import random
from interp import *

random.seed(5)


def truth(x, y):
    return 20 + 16 * math.sin(x / 17) * math.cos(y / 11) + 10 * math.sin((x + y) / 26)


samples = [(x, y, truth(x, y)) for x, y in ((random.uniform(0, 100), random.uniform(0, 50)) for _ in range(25))]

q = (40, 20)
print('true:     ', round(truth(*q), 2))
print('nearest:  ', round(nearest_value(samples, *q), 2))
print('IDW p=2:  ', round(idw(samples, *q, power=2), 2))
z, var = ordinary_kriging(samples, *q, rng=30)
print('Kriging:  ', round(z, 2), f'(variance {var:.2f})')
```

```text
true:      24.63
nearest:   30.2
IDW p=2:   25.08
Kriging:   25.66 (variance 0.79)
```

!!! success "Verification"
    Our Kriging weights are the same as those obtained by solving the same system with `numpy.linalg.solve` (difference ~10⁻¹⁵), the weights sum to 1, and at a sample point the result is exactly the sample's value. The JavaScript version used in the demo gives the same numbers.

---

## 📚 The same with libraries

=== "SciPy"

    ```python
    import numpy as np
    from scipy.interpolate import griddata

    xy = np.array([(s[0], s[1]) for s in samples])
    v = np.array([s[2] for s in samples])

    nearest = griddata(xy, v, [(40, 20)], method='nearest')
    linear = griddata(xy, v, [(40, 20)], method='linear')   # TIN + barycentric
    ```

    `method='nearest'` is identical to our `nearest_value` (verified). `'linear'` builds a [Delaunay](tin_delaunay.md) triangulation and interpolates barycentrically within the triangles, but **returns `nan` outside the convex hull**.

=== "PyKrige"

    ```python
    from pykrige.ok import OrdinaryKriging

    ok = OrdinaryKriging(xs, ys, vs, variogram_model='exponential')
    z, variance = ok.execute('grid', grid_x, grid_y)
    ```

    PyKrige fits the variogram parameters (nugget, sill, range) from the data itself.

=== "QGIS"

    ```python
    import processing

    processing.run('gdal:gridinversedistance', {
        'INPUT': points_layer, 'Z_FIELD': 'value', 'POWER': 2,
        'OUTPUT': 'idw.tif'})
    ```

!!! warning "What has been verified"
    The SciPy `nearest` and `linear` methods were run. The PyKrige and QGIS snippets were **not run** in this environment, so check the parameter names against their documentation.

---

## ✍️ Exercises

!!! question "Exercise 1: which one is better?"
    Use **leave-one-out** cross-validation: remove each sample in turn, estimate it from the rest, and compute the root mean square error (RMSE). Compare nearest neighbour, IDW (`p = 1…4`) and Kriging (`a = 10, 20, 40, 80`).

    ??? success "Solution"
        ```python
        def loo(fn):
            err = []
            for i, s in enumerate(samples):
                rest = samples[:i] + samples[i + 1:]
                err.append(fn(rest, s[0], s[1]) - s[2])
            return math.sqrt(sum(e * e for e in err) / len(err))

        print('nearest', round(loo(nearest_value), 2))
        for p in (1, 2, 3, 4):
            print('IDW p =', p, round(loo(lambda T, x, y: idw(T, x, y, p)), 2))
        for a in (10, 20, 40, 80):
            print('Kriging a =', a, round(loo(lambda T, x, y: ordinary_kriging(T, x, y, a)[0]), 2))
        ```
        ```text
        nearest 4.46
        IDW p = 1 7.41
        IDW p = 2 5.16
        IDW p = 3 4.15
        IDW p = 4 3.75
        Kriging a = 10 8.77
        Kriging a = 20 6.59
        Kriging a = 40 4.83
        Kriging a = 80 4.27
        ```
        **Conclusion.** There is no "most correct method". Our surface changes slowly (wavelength ~100 units), so a large range (`a = 80`) is far better than a small one, and here IDW with `p = 4` even beats Kriging. The variogram range **must fit the nature of the surface**: `a = 10` is very poor because it gives the samples almost no influence on each other. That is why on real data `a` is chosen from the empirical variogram, not by guessing.

!!! question "Exercise 2: extrapolation"
    What does each method return very far from the samples, at the point `(300, 300)`? Compare with the mean of the samples.

    ??? success "Solution"
        ```python
        q = (300, 300)
        print(round(sum(s[2] for s in samples) / len(samples), 2),
              round(nearest_value(samples, *q), 2),
              round(idw(samples, *q, power=2), 2),
              round(ordinary_kriging(samples, *q, rng=30)[0], 2))
        ```
        ```text
        20.43 17.89 19.7 21.21
        ```
        (Mean, nearest, IDW, Kriging.) Far away, IDW and Kriging pull the value towards a kind of "mean", while nearest neighbour simply repeats the closest sample. The Kriging result is a **declustered** mean, so it does not exactly match the simple mean. The main point is that far from the samples any method rests **on an assumption, not on data**, so such points cannot be trusted. The next exercise shows exactly this.

!!! question "Exercise 3: variance as confidence"
    Compute the Kriging variance (a) very close to a sample, (b) in the middle of the map `(50, 25)`, (c) far away `(300, 300)`.

    ??? success "Solution"
        ```python
        s0 = samples[0]
        for q in [(s0[0] + 1, s0[1]), (50, 25), (300, 300)]:
            print(q, round(ordinary_kriging(samples, *q, rng=30)[1], 3))
        ```
        ```text
        (63.29016948897019, 37.08934946303647) 0.179
        (50, 25) 0.644
        (300, 300) 1.092
        ```
        The variance is small near a sample, medium between samples, and approaches the sill (≈1) far away: there, no information from the samples is left. Using this map you can decide **where an additional measurement is worth taking**.

!!! question "Exercise 4: SciPy `linear` versus our methods"
    On the grid `x = 0, 4, …, 100`, `y = 0, 4, …, 50` use `griddata(method='linear')` and check at how many points it returns `nan`. Why?

    ??? success "Solution"
        ```python
        import numpy as np
        from scipy.interpolate import griddata

        grid = [(x, y) for x in range(0, 101, 4) for y in range(0, 51, 4)]
        lin = griddata(xy, v, np.array(grid), method='linear')
        print(int(np.isnan(lin).sum()), 'of', len(grid))
        ```
        ```text
        92 of 338
        ```
        27% of the points lie outside the samples' **convex hull**, and no triangle covers them. IDW and Kriging still return a value at such points, but it is extrapolation (see Exercise 2). So the edges of the map should be read with caution.
