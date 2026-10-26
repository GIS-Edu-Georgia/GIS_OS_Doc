# 🧮 სივრცითი ბადეები: Z-order, Hilbert და ექვსკუთხედები

[Geohash](spatial_indexes.md#geohash) დედამიწას ბადედ ყოფს და უჯრებს სტრიქონად აღნიშნავს. ამ გვერდზე ვიგებთ, **რატომ მუშაობს ის** და რა ალტერნატივები არსებობს: ორგანზომილებიანი ბადის უჯრები როგორ გადავაქციოთ **ერთ რიცხვად** ისე, რომ ახლო უჯრებს ახლო რიცხვები ჰქონდეს, და **რატომ იყენებენ ექვსკუთხედებს** (H3).

---

## 💡 ამოცანა

ბაზაში (ან ფაილში) მონაცემები **ერთგანზომილებიანად** ინახება: ინდექსი ახარისხებს ჩანაწერებს ერთი გასაღებით. მაგრამ ჩვენი მონაცემი 2D არის. ამიტომ გვჭირდება **სივრცის შემვსები მრუდი**, რომელიც ყოველ უჯრას ერთ ნომერს აძლევს და ამ მრუდს ახლო უჯრები **ახლოს** უნდა ჰქონდეს. ორი მთავარი ვარიანტია:

| მრუდი | იდეა | სად გამოიყენება |
|---|---|---|
| **Z-order** (Morton) | `x` და `y` ბიტების გადაჯვარედინება | Geohash, ბევრი სვეტოვანი ბაზა |
| **Hilbert** | უწყვეტი მრუდი, რომელიც ნახტომების გარეშე გადის უჯრებს | Google S2, ზოგი სივრცითი ინდექსი |

**ექვსკუთხედები** სხვა გზაა: ბადის ფორმა იცვლება, რათა მეზობლობა ერთგვაროვანი გახდეს (**H3**).

---

## 🎮 სცადეთ თქვენც

სამი რეჟიმია: **Z-order**, **Hilbert** და **ექვსკუთხედები**. ორი პირველისთვის გადაათრიეთ მართკუთხედი და ნახეთ, რამდენ **უწყვეტ ინდექსის დიაპაზონად** იქცევა ის (რაც ნაკლებია, მით ნაკლები მოთხოვნა დაგვჭირდება ბაზაში).

<iframe src="../widgets/grids.html" title="Z-order, Hilbert და ექვსკუთხედების ინტერაქტიული დემო" style="width:100%;height:860px;border:0" loading="lazy"></iframe>

!!! tip "დაკვირვება"
    - **Hilbert-ის** ყოველი მეზობელი ინდექსი მეზობელი უჯრაა (`255 / 255` 16×16 ბადეზე). **Z-order-ში** მხოლოდ დაახლოებით ნახევარია (`128 / 255`): დანარჩენ შემთხვევაში მრუდი „ხტება".
    - იგივე მართკუთხედი Hilbert-ზე ჩვეულებრივ ნაკლებ დიაპაზონს საჭიროებს.
    - ექვსკუთხედის 6 მეზობელი ცენტრიდან ერთნაირი მანძილითაა. კვადრატს ორი ტიპის მეზობელი აქვს: გვერდითი (`1`) და დიაგონალური (`√2`).

---

## 🔹 Z-order (Morton კოდი)

`x = 5 (0101)` და `y = 9 (1001)`. ბიტებს მონაცვლეობით ვწერთ: `y₃x₃y₂x₂y₁x₁y₀x₀ = 10 01 00 11 = 147`. შედეგად ახლო უჯრებს ხშირად ახლო ნომრები აქვს, მაგრამ **საზღვრებზე** ნომრები მკვეთრად იცვლება.

!!! info "Geohash არის Z-order"
    Geohash-იც ეს მრუდია: გრძედისა და განედის ბიტები მონაცვლეობით ერთიანდება (გრძედიდან იწყება), შემდეგ 5-ბიტიანი ჯგუფებით base32 სიმბოლოებად ინახება. დავალება 1-ში ამას კოდით დავადასტურებთ.

## 🔹 Hilbert-ის მრუდი

უჯრებს ისე გადის, რომ **ყოველი შემდეგი უჯრა წინას ეხება**. ამის ფასი ცოტა უფრო რთული გამოთვლაა (კვადრანტის ბრუნვა და ასახვა). Google-ის **S2** დედამიწას კუბის ექვს წახნაგად ყოფს და თითოეულზე Hilbert-ის მრუდს იყენებს.

## 🔹 ექვსკუთხედები და H3

კვადრატულ ბადეს აქვს „ორი სახის მეზობელი" (გვერდითი და დიაგონალური), ამიტომ მანძილები ერთგვაროვანი არ არის. **ექვსკუთხედს ყველა 6 მეზობელი ერთნაირ მანძილზე აქვს**, ამიტომ ის სიახლოვის ანალიზში, სიმკვრივის რუკებსა და გავრცელების მოდელებში ბუნებრივი არჩევანია. **H3** (Uber) დედამიწას ექვსკუთხედებით ფარავს 16 რეზოლუციაზე. 12 უჯრა პენტაგონია (ცნობილი გეომეტრიული შეზღუდვა).

ექვსკუთხედებს ხშირად **axial** კოორდინატებით `(q, r)` აღწერენ: ორი ღერძი 60°-ით განსხვავდება, მესამე (`s = −q − r`) გამოითვლება. ამით მანძილი გამარტივდება: `(|Δq| + |Δr| + |Δq + Δr|) / 2`.

---

## 🐍 რეალიზაცია სუფთა Python-ით

```python title="grids.py" linenums="1"
import math

# ---------- Z-order (Morton) ----------
def morton_encode(x, y, bits=16):
    """x და y ბიტების მონაცვლეობით გადაჯვარედინება."""
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


# ---------- Hilbert-ის მრუდი ----------
def hilbert_xy2d(n, x, y):
    """(x, y) -> მრუდის ინდექსი d, ბადე n×n, n = 2^k."""
    d = 0
    s = n // 2
    while s > 0:
        rx = 1 if (x & s) else 0
        ry = 1 if (y & s) else 0
        d += s * s * ((3 * rx) ^ ry)
        if ry == 0:                       # კვადრანტის მობრუნება/ასახვა
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
    """მართკუთხედის უჯრების ინდექსები უწყვეტ დიაპაზონებად: რამდენი მოთხოვნა დაგვჭირდება."""
    x0, y0, x1, y1 = rect
    ids = sorted(index(x, y) for x in range(x0, x1 + 1) for y in range(y0, y1 + 1))
    ranges = 1
    for a, b in zip(ids, ids[1:]):
        if b != a + 1:
            ranges += 1
    return ranges


# ---------- ექვსკუთხა ბადე (axial კოორდინატები, "pointy-top") ----------
HEX_DIRS = [(1, 0), (1, -1), (0, -1), (-1, 0), (-1, 1), (0, 1)]


def hex_to_pixel(q, r, size=1.0):
    x = size * math.sqrt(3) * (q + r / 2)
    y = size * 1.5 * r
    return x, y


def hex_round(fq, fr):
    """წილადი (q, r) -> უახლოესი უჯრა (cube-კოორდინატებით დამრგვალება)."""
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
    """ყველა უჯრა ზუსტად k ნაბიჯის დაშორებით."""
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

### გამოყენება

```python
n = 16
print(morton_encode(5, 9, 4))                      # 147
print(hilbert_xy2d(n, 5, 9))                       # 120
print(hilbert_d2xy(n, 120))                        # (5, 9)

# მეზობელი ინდექსები მეზობელი უჯრებია?
z_pts = [morton_decode(d, 4) for d in range(n * n)]
h_pts = [hilbert_d2xy(n, d) for d in range(n * n)]
adjacent = lambda pts: sum(abs(a[0] - b[0]) + abs(a[1] - b[1]) == 1 for a, b in zip(pts, pts[1:]))
print('Z:', adjacent(z_pts), 'Hilbert:', adjacent(h_pts), 'სულ:', n * n - 1)

# ექვსკუთხედები
print(hex_neighbors(0, 0))
print(len(hex_ring((0, 0), 3)), hex_distance((0, 0), (2, -3)))
print(pixel_to_hex(*hex_to_pixel(3, -2)))          # (3, -2)
```

```text
147
120
(5, 9)
Z: 128 Hilbert: 255 სულ: 255
[(1, 0), (1, -1), (0, -1), (-1, 0), (-1, 1), (0, 1)]
18 3
(3, -2)
```

---

## 🧰 იგივე ბიბლიოთეკებით

=== "H3"

    ```python
    import h3

    cell = h3.latlng_to_cell(41.7151, 44.8271, 8)      # თბილისი, რეზოლუცია 8 (~0.7 კმ²)
    print(cell, h3.cell_area(cell, 'km^2'))
    print(h3.grid_disk(cell, 1))                       # უჯრა + 6 მეზობელი
    print(h3.cell_to_boundary(cell))                   # წვეროები (lat, lng)
    ```

=== "S2"

    ```python
    import s2sphere

    ll = s2sphere.LatLng.from_degrees(41.7151, 44.8271)
    cell = s2sphere.CellId.from_lat_lng(ll).parent(14)  # დონე 14 უჯრა
    print(cell.to_token())
    ```

=== "PyQGIS"

    ```python
    # ექვსკუთხა ბადე პროცესინგით
    processing.run('native:creategrid', {
        'TYPE': 4,                                      # 4 = ექვსკუთხედი
        'EXTENT': '40.0,46.7,41.0,43.6 [EPSG:4326]',
        'HSPACING': 0.1, 'VSPACING': 0.1,
        'CRS': 'EPSG:4326',
        'OUTPUT': 'memory:hexgrid',
    })
    ```

=== "PostGIS"

    ```sql
    -- ექვსკუთხა ბადე (PostGIS 3.1+)
    SELECT (ST_HexagonGrid(10000, ST_SetSRID(ST_Extent(geom), 32638))).* FROM points;
    ```

---

## 📝 დავალებები

!!! question "დავალება 1"
    ადასტურეთ, რომ **Geohash არის Z-order**: დაწერეთ ფუნქცია, რომელიც წერტილს `lon` და `lat` ბიტებად გადაიყვანს (ბადე `2^b`-ზე), მათ გადაჯვარედინებს (გრძედიდან დაწყებით) და 5-ბიტიან ჯგუფებად base32-ში გადააქცევს. შეადარეთ `gh_encode`-ს 1000 შემთხვევით წერტილზე.

    ??? success "ამოხსნა"
        ```python
        import random

        BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz'      # იგივე ანბანი, რაც spatial_indexes.md-ში

        def geohash_via_zorder(lat, lon, chars=8):
            bits = chars * 5
            lon_bits, lat_bits = (bits + 1) // 2, bits // 2          # lon-ს ერთით მეტი, თუ bits კენტია
            xi = min(int((lon + 180) / 360 * 2 ** lon_bits), 2 ** lon_bits - 1)
            yi = min(int((lat + 90) / 180 * 2 ** lat_bits), 2 ** lat_bits - 1)
            seq = []                                                # ბიტების მიმდევრობა lon, lat, lon, lat...
            for i in range(bits):
                if i % 2 == 0:
                    seq.append((xi >> (lon_bits - 1 - i // 2)) & 1)
                else:
                    seq.append((yi >> (lat_bits - 1 - i // 2)) & 1)
            return ''.join(BASE32[int(''.join(map(str, seq[k:k + 5])), 2)] for k in range(0, bits, 5))

        def gh_encode(lat, lon, precision=8):                     # spatial_indexes.md-დან
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

!!! question "დავალება 2"
    200 შემთხვევით მართკუთხედზე (ბადე 64×64) გამოთვალეთ, საშუალოდ რამდენი უწყვეტი ინდექსის დიაპაზონია საჭირო Z-order-ისა და Hilbert-ისთვის. რა შეფარდება მიიღეთ?

    ??? success "ამოხსნა"
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
        შედეგი: დაახლოებით `21.0` და `11.7`, ანუ Hilbert-ს Z-order-ზე **~45%-ით ნაკლები** დიაპაზონი სჭირდება. ამიტომ ის ფართო მოთხოვნებისთვის მოხერხებულია, თუმცა Z-order-ს უფრო მარტივი ბიტური ოპერაციებით ვიღებთ.

!!! question "დავალება 3"
    შეადარეთ კვადრატული და ექვსკუთხა ბადის „წრიულობა": ცენტრალური უჯრიდან k=1..6 რგოლისთვის გამოთვალეთ ყველაზე შორეული და ყველაზე ახლო უჯრის ცენტრამდე მანძილების შეფარდება. კვადრატულ ბადეზე ვიყენებთ Chebyshev-ის რგოლს (`max(|dx|,|dy|) = k`).

    ??? success "ამოხსნა"
        ```python
        print('k   კვადრატი   ექვსკუთხედი')
        for k in range(1, 7):
            sq = [math.hypot(dx, dy) for dx in range(-k, k + 1) for dy in range(-k, k + 1)
                  if max(abs(dx), abs(dy)) == k]
            hx = [math.dist(hex_to_pixel(0, 0), hex_to_pixel(*c)) for c in hex_ring((0, 0), k)]
            print(f'{k}   {max(sq) / min(sq):8.3f}   {max(hx) / min(hx):10.3f}')
        ```
        კვადრატის რგოლზე შეფარდება ყოველთვის `√2 ≈ 1.414`-ია, ექვსკუთხედისა კი არასოდეს აღემატება `2/√3 ≈ 1.155`-ს, ანუ ბევრად ახლოსაა წრესთან (1.0).

!!! question "დავალება 4"
    დაყავით 5000 შემთხვევითი წერტილი ექვსკუთხა უჯრებად (`pixel_to_hex`, `size = 5`) და იპოვეთ 5 ყველაზე დატვირთული უჯრა. შეამოწმეთ, რომ ჯამი 5000-ს უდრის.

    ??? success "ამოხსნა"
        ```python
        from collections import Counter

        random.seed(4)
        pts = [(random.gauss(0, 30), random.gauss(0, 20)) for _ in range(5000)]
        bins = Counter(pixel_to_hex(x, y, size=5) for x, y in pts)
        print(sum(bins.values()), len(bins), 'უჯრა')
        print(bins.most_common(5))
        ```
        შედეგი: `5000 295 უჯრა`. ყველაზე დატვირთულ უჯრებში დაახლოებით 85–91 წერტილია.
