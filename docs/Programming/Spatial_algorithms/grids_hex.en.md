# 🧮 Spatial grids: Z-order, Hilbert and hexagons

[Geohash](spatial_indexes.md#geohash) divides the Earth into a grid and labels the cells with strings. On this page we find out **why it works** and what the alternatives are: how to turn the cells of a two-dimensional grid into **a single number** so that nearby cells get nearby numbers, and **why hexagons are used** (H3).

---

## 💡 The problem

In a database (or a file) data is stored **one-dimensionally**: an index sorts records by a single key. But our data is 2D. So we need a **space-filling curve** that gives every cell one number, and along this curve nearby cells must stay **close**. There are two main options:

| Curve | Idea | Where it is used |
|---|---|---|
| **Z-order** (Morton) | Interleaving the bits of `x` and `y` | Geohash, many columnar databases |
| **Hilbert** | A continuous curve that visits the cells without jumps | Google S2, some spatial indexes |

**Hexagons** are another route: the shape of the grid changes so that adjacency becomes uniform (**H3**).

---

## 🎮 Try it yourself

There are three modes: **Z-order**, **Hilbert** and **Hexagons**. For the first two, drag a rectangle and see how many **continuous index ranges** it turns into (the fewer, the fewer database queries we need).

<iframe src="../widgets/grids.html" title="Z-order, Hilbert and hexagons interactive demo" style="width:100%;height:860px;border:0" loading="lazy"></iframe>

!!! tip "Observation"
    - In **Hilbert**, every pair of adjacent indices is a pair of adjacent cells (`255 / 255` on a 16×16 grid). In **Z-order** only about half are (`128 / 255`): in the remaining cases the curve "jumps".
    - The same rectangle usually needs fewer ranges with Hilbert.
    - A hexagon's 6 neighbours are all the same distance from the centre. A square has two kinds of neighbours: side (`1`) and diagonal (`√2`).

---

## 🔹 Z-order (Morton code)

`x = 5 (0101)` and `y = 9 (1001)`. We write the bits alternately: `y₃x₃y₂x₂y₁x₁y₀x₀ = 10 01 00 11 = 147`. As a result, nearby cells often get nearby numbers, but **at boundaries** the numbers change abruptly.

!!! info "Geohash is Z-order"
    Geohash is this same curve: the longitude and latitude bits are merged alternately (starting with longitude), then stored as base32 characters in groups of 5 bits. In Exercise 1 we confirm this with code.

## 🔹 The Hilbert curve

It visits the cells so that **every next cell touches the previous one**. The price is a slightly more complex calculation (rotating and reflecting quadrants). Google's **S2** splits the Earth into the six faces of a cube and uses a Hilbert curve on each.

## 🔹 Hexagons and H3

A square grid has "two kinds of neighbours" (side and diagonal), so distances are not uniform. **A hexagon has all 6 neighbours at the same distance**, which makes it the natural choice for proximity analysis, density maps and spread models. **H3** (Uber) covers the Earth with hexagons at 16 resolutions. 12 cells are pentagons (a well-known geometric limitation).

Hexagons are often described with **axial** coordinates `(q, r)`: two axes 60° apart, with the third (`s = −q − r`) computed. This simplifies distance: `(|Δq| + |Δr| + |Δq + Δr|) / 2`.

---

## 🐍 Implementation in pure Python

```python title="grids.py" linenums="1"
import math

# ---------- Z-order (Morton) ----------
def morton_encode(x, y, bits=16):
    """Interleave the bits of x and y."""
    d = 0
    for i in range(bits):
        d |= ((x >> i) & 1) << (2 * i)
        d |= ((y >> i) & 1) << (2 * i + 1)
    return d


def morton_decode(d, bits=16):
    x = y = 0
    for i in range(bits):
        x |= ((d >> (2 * i)) & 1) << i
        y |= ((d >> (2 * i + 1)) & 1) << i
    return x, y


# ---------- Hilbert curve ----------
def hilbert_xy2d(n, x, y):
    """(x, y) -> curve index d, grid n×n, n = 2^k."""
    d = 0
    s = n // 2
    while s > 0:
        rx = 1 if (x & s) else 0
        ry = 1 if (y & s) else 0
        d += s * s * ((3 * rx) ^ ry)
        if ry == 0:                       # rotate/reflect the quadrant
            if rx == 1:
                x, y = s - 1 - x, s - 1 - y
            x, y = y, x
        s //= 2
    return d


def hilbert_d2xy(n, d):
    x = y = 0
    s = 1
    while s < n:
        rx = 1 & (d // 2)
        ry = 1 & (d ^ rx)
        if ry == 0:
            if rx == 1:
                x, y = s - 1 - x, s - 1 - y
            x, y = y, x
        x += s * rx
        y += s * ry
        d //= 4
        s *= 2
    return x, y


def index_ranges(rect, index):
    """Indices of a rectangle's cells as continuous ranges: how many queries we would need."""
    x0, y0, x1, y1 = rect
    ids = sorted(index(x, y) for x in range(x0, x1 + 1) for y in range(y0, y1 + 1))
    ranges = 1
    for a, b in zip(ids, ids[1:]):
        if b != a + 1:
            ranges += 1
    return ranges


# ---------- Hexagonal grid (axial coordinates, "pointy-top") ----------
HEX_DIRS = [(1, 0), (1, -1), (0, -1), (-1, 0), (-1, 1), (0, 1)]


def hex_to_pixel(q, r, size=1.0):
    x = size * math.sqrt(3) * (q + r / 2)
    y = size * 1.5 * r
    return x, y


def hex_round(fq, fr):
    """Fractional (q, r) -> nearest cell (rounding in cube coordinates)."""
    fs = -fq - fr
    q, r, s = round(fq), round(fr), round(fs)
    dq, dr, ds = abs(q - fq), abs(r - fr), abs(s - fs)
    if dq > dr and dq > ds:
        q = -r - s
    elif dr > ds:
        r = -q - s
    return q, r


def pixel_to_hex(x, y, size=1.0):
    fq = (math.sqrt(3) / 3 * x - y / 3) / size
    fr = (2 / 3 * y) / size
    return hex_round(fq, fr)


def hex_distance(a, b):
    dq, dr = a[0] - b[0], a[1] - b[1]
    return (abs(dq) + abs(dr) + abs(dq + dr)) // 2


def hex_neighbors(q, r):
    return [(q + dq, r + dr) for dq, dr in HEX_DIRS]


def hex_ring(center, k):
    """All cells exactly k steps away."""
    if k == 0:
        return [center]
    q, r = center[0] + HEX_DIRS[4][0] * k, center[1] + HEX_DIRS[4][1] * k
    ring = []
    for dq, dr in HEX_DIRS:
        for _ in range(k):
            ring.append((q, r))
            q, r = q + dq, r + dr
    return ring
```

### Usage

```python
n = 16
print(morton_encode(5, 9, 4))                      # 147
print(hilbert_xy2d(n, 5, 9))                       # 120
print(hilbert_d2xy(n, 120))                        # (5, 9)

# are adjacent indices adjacent cells?
z_pts = [morton_decode(d, 4) for d in range(n * n)]
h_pts = [hilbert_d2xy(n, d) for d in range(n * n)]
adjacent = lambda pts: sum(abs(a[0] - b[0]) + abs(a[1] - b[1]) == 1 for a, b in zip(pts, pts[1:]))
print('Z:', adjacent(z_pts), 'Hilbert:', adjacent(h_pts), 'total:', n * n - 1)

# hexagons
print(hex_neighbors(0, 0))
print(len(hex_ring((0, 0), 3)), hex_distance((0, 0), (2, -3)))
print(pixel_to_hex(*hex_to_pixel(3, -2)))          # (3, -2)
```

```text
147
120
(5, 9)
Z: 128 Hilbert: 255 total: 255
[(1, 0), (1, -1), (0, -1), (-1, 0), (-1, 1), (0, 1)]
18 3
(3, -2)
```

---

## 🧰 The same with libraries

=== "H3"

    ```python
    import h3

    cell = h3.latlng_to_cell(41.7151, 44.8271, 8)      # Tbilisi, resolution 8 (~0.7 km²)
    print(cell, h3.cell_area(cell, 'km^2'))
    print(h3.grid_disk(cell, 1))                       # cell + 6 neighbours
    print(h3.cell_to_boundary(cell))                   # vertices (lat, lng)
    ```

=== "S2"

    ```python
    import s2sphere

    ll = s2sphere.LatLng.from_degrees(41.7151, 44.8271)
    cell = s2sphere.CellId.from_lat_lng(ll).parent(14)  # level-14 cell
    print(cell.to_token())
    ```

=== "PyQGIS"

    ```python
    # hexagonal grid via processing
    processing.run('native:creategrid', {
        'TYPE': 4,                                      # 4 = hexagon
        'EXTENT': '40.0,46.7,41.0,43.6 [EPSG:4326]',
        'HSPACING': 0.1, 'VSPACING': 0.1,
        'CRS': 'EPSG:4326',
        'OUTPUT': 'memory:hexgrid',
    })
    ```

=== "PostGIS"

    ```sql
    -- hexagonal grid (PostGIS 3.1+)
    SELECT (ST_HexagonGrid(10000, ST_SetSRID(ST_Extent(geom), 32638))).* FROM points;
    ```

---

## 📝 Exercises

!!! question "Exercise 1"
    Confirm that **Geohash is Z-order**: write a function that converts a point into `lon` and `lat` bits (on a `2^b` grid), interleaves them (starting with longitude) and turns them into base32 in groups of 5 bits. Compare it with `gh_encode` on 1000 random points.

    ??? success "Solution"
        ```python
        import random

        BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz'      # the same alphabet as in spatial_indexes.md

        def geohash_via_zorder(lat, lon, chars=8):
            bits = chars * 5
            lon_bits, lat_bits = (bits + 1) // 2, bits // 2          # lon gets one more if bits is odd
            xi = min(int((lon + 180) / 360 * 2 ** lon_bits), 2 ** lon_bits - 1)
            yi = min(int((lat + 90) / 180 * 2 ** lat_bits), 2 ** lat_bits - 1)
            seq = []                                                # bit sequence lon, lat, lon, lat...
            for i in range(bits):
                if i % 2 == 0:
                    seq.append((xi >> (lon_bits - 1 - i // 2)) & 1)
                else:
                    seq.append((yi >> (lat_bits - 1 - i // 2)) & 1)
            return ''.join(BASE32[int(''.join(map(str, seq[k:k + 5])), 2)] for k in range(0, bits, 5))

        def gh_encode(lat, lon, precision=8):                     # from spatial_indexes.md
            lat_r, lon_r = [-90.0, 90.0], [-180.0, 180.0]
            code, bits, ch, even = '', 0, 0, True
            while len(code) < precision:
                r, v = (lon_r, lon) if even else (lat_r, lat)
                mid = (r[0] + r[1]) / 2
                ch <<= 1
                if v >= mid:
                    ch |= 1
                    r[0] = mid
                else:
                    r[1] = mid
                even = not even
                bits += 1
                if bits == 5:
                    code += BASE32[ch]
                    bits, ch = 0, 0
            return code

        random.seed(1)
        pts = [(random.uniform(-85, 85), random.uniform(-180, 180)) for _ in range(1000)]
        print(all(geohash_via_zorder(la, lo) == gh_encode(la, lo) for la, lo in pts))
        ```

!!! question "Exercise 2"
    On 200 random rectangles (64×64 grid), compute how many continuous index ranges are needed on average for Z-order and for Hilbert. What ratio do you get?

    ??? success "Solution"
        ```python
        random.seed(1)
        zs = hs = 0
        for _ in range(200):
            x0, y0 = random.randint(0, 40), random.randint(0, 40)
            w, h = random.randint(2, 20), random.randint(2, 20)
            rect = (x0, y0, x0 + w, y0 + h)
            zs += index_ranges(rect, lambda x, y: morton_encode(x, y, 6))
            hs += index_ranges(rect, lambda x, y: hilbert_xy2d(64, x, y))
        print('Z-order:', zs / 200, 'Hilbert:', hs / 200)
        ```
        Result: roughly `21.0` and `11.7`, i.e. Hilbert needs **~45% fewer** ranges than Z-order. That makes it convenient for wide queries, although Z-order is obtained with simpler bit operations.

!!! question "Exercise 3"
    Compare the "roundness" of square and hexagonal grids: for rings k=1..6 around the central cell, compute the ratio of the distances to the farthest and the nearest cell centre. On the square grid use a Chebyshev ring (`max(|dx|,|dy|) = k`).

    ??? success "Solution"
        ```python
        print('k   square     hexagon')
        for k in range(1, 7):
            sq = [math.hypot(dx, dy) for dx in range(-k, k + 1) for dy in range(-k, k + 1)
                  if max(abs(dx), abs(dy)) == k]
            hx = [math.dist(hex_to_pixel(0, 0), hex_to_pixel(*c)) for c in hex_ring((0, 0), k)]
            print(f'{k}   {max(sq) / min(sq):8.3f}   {max(hx) / min(hx):10.3f}')
        ```
        On a square ring the ratio is always `√2 ≈ 1.414`, while for hexagons it never exceeds `2/√3 ≈ 1.155`, i.e. it is much closer to a circle (1.0).

!!! question "Exercise 4"
    Bin 5000 random points into hexagonal cells (`pixel_to_hex`, `size = 5`) and find the 5 busiest cells. Check that the total equals 5000.

    ??? success "Solution"
        ```python
        from collections import Counter

        random.seed(4)
        pts = [(random.gauss(0, 30), random.gauss(0, 20)) for _ in range(5000)]
        bins = Counter(pixel_to_hex(x, y, size=5) for x, y in pts)
        print(sum(bins.values()), len(bins), 'cells')
        print(bins.most_common(5))
        ```
        Result: `5000 295 cells`. The busiest cells hold roughly 85–91 points each.
