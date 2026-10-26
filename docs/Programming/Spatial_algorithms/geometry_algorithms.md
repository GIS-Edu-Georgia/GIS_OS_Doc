# 📐 გეომეტრიული ალგორითმები

GIS-ში ყოველდღე ვიყენებთ ოპერაციებს, როგორიცაა „წერტილი პოლიგონშია?", „გავამარტივოთ ხაზი" ან „გარს შემოვავლოთ წერტილები". ამ გვერდზე ვნახავთ, **როგორ** მუშაობს ისინი შიგნიდან. ამ ალგორითმებზეა აგებული `QgsGeometry`, Shapely და PostGIS-ის ფუნქციები.

| ამოცანა | ალგორითმი | სირთულე |
|---|---|---|
| წერტილი პოლიგონში | Ray casting / Winding number | `O(n)` |
| ფართობი და ცენტროიდი | Shoelace ფორმულა | `O(n)` |
| ამოზნექილი გარსი | Andrew-ის monotone chain | `O(n log n)` |
| ხაზის გამარტივება | Douglas–Peucker | `O(n log n)` საშუალოდ, `O(n²)` უარეს შემთხვევაში |
| მონაკვეთების გადაკვეთა | ორიენტაციის ტესტი (`cross`) | `O(1)` |

---

## 🎮 სცადეთ თქვენც

სამი რეჟიმია: **წერტილი პოლიგონში** (მაუსის ქვეშ ჩანს სხივი და გადაკვეთები), **Douglas–Peucker** (ε-ს ცვლილებით ხაზი მარტივდება) და **ამოზნექილი გარსი** (დაამატეთ წერტილები).

<iframe src="../widgets/geometry.html" title="გეომეტრიული ალგორითმების ინტერაქტიული დემო" style="width:100%;height:700px;border:0" loading="lazy"></iframe>

---

## 🧭 საფუძველი: `cross` (ორიენტაცია)

თითქმის ყველა ალგორითმი ერთ პატარა ფუნქციას ეყრდნობა: სამი წერტილისთვის `cross(o, a, b)` გვეუბნება, `b` წერტილი `o→a` ვექტორის **მარცხნივაა** (`> 0`), **მარჯვნივ** (`< 0`) თუ **ერთ წრფეზე** (`= 0`). ის ვექტორების სიბრტყული ნამრავლია.

---

## 🔹 წერტილი პოლიგონში

**Ray casting:** წერტილიდან მარჯვნივ ჰორიზონტალურ სხივს ვატარებთ და ვითვლით, რამდენ წიბოს კვეთს. **კენტი** რაოდენობა ნიშნავს „შიგნით", **ლუწი** კი „გარეთ".

**Winding number:** ვითვლით, პოლიგონი წერტილს რამდენჯერ შემოუვლის (საათის ისრის საწინააღმდეგოდ `+1`, საათის ისრისა `−1`). `0` ნიშნავს გარეთ.

!!! warning "საინტერესო განსხვავება"
    **მარტივი** პოლიგონისთვის ორივე ერთნაირ პასუხს იძლევა. **თვითგადამკვეთი** პოლიგონისთვის (მაგ. ხუთქიმიანი ვარსკვლავი) ისინი განსხვავდება: ray casting ცენტრალურ ხუთკუთხედს „გარეთ" თვლის, winding number კი „შიგნით" (`2`). სხვადასხვა GIS სხვადასხვა წესს იყენებს, ამიტომ პოლიგონები ჯერ ვალიდური უნდა იყოს ([`isValid`](../PyQGIS/PyQGIS_methods/PyQGIS_isValid.md)).

## 🔹 ფართობი და ცენტროიდი

**Shoelace ფორმულა** პოლიგონის ფართობს წვეროების კოორდინატებით ითვლის. ნიშანი ბრუნვის მიმართულებას გვიჩვენებს (`+` საათის ისრის საწინააღმდეგოდ).

## 🔹 ამოზნექილი გარსი (Convex Hull)

წარმოიდგინეთ ყველა წერტილზე მჭიდროდ დაჭიმული რეზინის ზონარი. **Andrew-ის ალგორითმი** წერტილებს ალაგებს და ორ ნაწილად (ქვედა და ზედა გარსი) აგებს: ყოველ ახალ წერტილზე ვშლით ბოლო წერტილებს, თუ ისინი „მარჯვნივ მოხვევას" ქმნიან.

## 🔹 Douglas–Peucker (ხაზის გამარტივება)

ხაზის პირველ და ბოლო წერტილს ვაერთებთ. ვპოულობთ წერტილს, რომელიც ამ მონაკვეთიდან ყველაზე შორსაა. თუ ის `ε`-ზე ახლოსაა, **ყველა შუალედური წერტილი ამოვაგდოთ**. თუ არა, ხაზს ამ წერტილზე ვყოფთ და ორივე ნაწილზე იგივეს რეკურსიულად ვიმეორებთ.

!!! warning "ε-ს ერთეული"
    `ε` კოორდინატების ერთეულშია. გრადუსებში მოცემულ მონაცემზე `ε = 0.001` დაახლოებით 100 მეტრია, ამიტომ გამარტივებამდე მონაცემები პროექციულ CRS-ში გადაიყვანეთ.

!!! warning "ტოპოლოგია"
    Douglas–Peucker ხაზს ცალკე ამარტივებს და **შეიძლება თვითგადაკვეთა ან მეზობელ პოლიგონთა შორის ხვრელი** შექმნას. პოლიგონების საერთო საზღვრებისთვის გამოიყენეთ ტოპოლოგიის მაქსიმალური დაცვის ვარიანტები (მაგ. `mapshaper`, PostGIS `ST_SimplifyPreserveTopology`).

---

## 🐍 რეალიზაცია სუფთა Python-ით

```python title="geometry_algorithms.py" linenums="1"
import math


def cross(o, a, b):
    """(a-o) × (b-o): >0 მარცხნივ, <0 მარჯვნივ, 0 ერთ წრფეზე."""
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])


def on_segment(p, a, b, eps=1e-12):
    return abs(cross(a, b, p)) <= eps and \
        min(a[0], b[0]) - eps <= p[0] <= max(a[0], b[0]) + eps and \
        min(a[1], b[1]) - eps <= p[1] <= max(a[1], b[1]) + eps


def point_in_polygon(p, poly):
    """Ray casting: 'inside', 'boundary' ან 'outside'."""
    inside = False
    n = len(poly)
    for i in range(n):
        a, b = poly[i], poly[(i + 1) % n]
        if on_segment(p, a, b):
            return 'boundary'
        if (a[1] > p[1]) != (b[1] > p[1]):              # წიბო ჰორიზონტალურ სხივს კვეთს?
            x = a[0] + (p[1] - a[1]) * (b[0] - a[0]) / (b[1] - a[1])
            if x > p[0]:
                inside = not inside
    return 'inside' if inside else 'outside'


def winding_number(p, poly):
    """Winding number: 0 = გარეთ; ≠0 = შიგნით (თვითგადამკვეთი პოლიგონებისთვისაც)."""
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
    """Shoelace: ნიშნიანი ფართობი (+ საათის ისრის საწინააღმდეგოდ)."""
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
    """Andrew-ის monotone chain: O(n log n). აბრუნებს საათის ისრის საწინააღმდეგოდ."""
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
    """მანძილი p-დან AB წრფემდე."""
    if a == b:
        return math.dist(p, a)
    return abs(cross(a, b, p)) / math.dist(a, b)


def douglas_peucker(points, epsilon):
    """ხაზის გამარტივება: ინახავს წვეროებს, რომლებიც epsilon-ზე მეტადაა გადახრილი."""
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
    """ორი მონაკვეთი იკვეთება თუ არა (შეხებაც ითვლება)."""
    d1, d2 = cross(p3, p4, p1), cross(p3, p4, p2)
    d3, d4 = cross(p1, p2, p3), cross(p1, p2, p4)
    if ((d1 > 0) != (d2 > 0)) and ((d3 > 0) != (d4 > 0)) and 0 not in (d1, d2, d3, d4):
        return True
    return (on_segment(p1, p3, p4) or on_segment(p2, p3, p4) or
            on_segment(p3, p1, p2) or on_segment(p4, p1, p2))
```

### გამოყენება

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
print(len(convex_hull(pts)), 'წვერო 500 წერტილიდან')

line = [(i, 10 * math.sin(i / 7) + random.uniform(-1, 1)) for i in range(200)]
for eps in (0.5, 2, 5):
    print(eps, len(douglas_peucker(line, eps)))
```

```text
inside
boundary
outside
12.0 (2.0, 1.5)
18 წვერო 500 წერტილიდან
0.5 92
2 20
5 11
```

---

## 🧰 იგივე ბიბლიოთეკებით

=== "PyQGIS"

    ```python
    poly = QgsGeometry.fromPolygonXY([[QgsPointXY(x, y) for x, y in square]])
    pt = QgsGeometry.fromPointXY(QgsPointXY(1, 1))

    print(poly.contains(pt))                       # წერტილი პოლიგონში
    print(poly.area(), poly.centroid().asPoint())  # ფართობი, ცენტროიდი

    multi = QgsGeometry.fromMultiPointXY([QgsPointXY(x, y) for x, y in pts])
    print(multi.convexHull().asWkt())              # ამოზნექილი გარსი

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
    SELECT ST_SimplifyPreserveTopology(geom, 2) FROM lines;  -- ტოპოლოგიის დაცვით
    ```

---

## 📝 დავალებები

!!! question "დავალება 1"
    ააგეთ ხუთქიმიანი ვარსკვლავი (პენტაგრამა), ხუთივე წვეროს ერთმანეთისგან ერთი ნაბიჯით გამოტოვებით. შეამოწმეთ ცენტრალური წერტილი `point_in_polygon`-ითა და `winding_number`-ით. რატომ განსხვავდება პასუხი?

    ??? success "ამოხსნა"
        ```python
        penta = [(50 + 40 * math.cos(math.radians(90 + 144 * i)),
                  50 + 40 * math.sin(math.radians(90 + 144 * i))) for i in range(5)]

        print(point_in_polygon((50, 50), penta))     # outside
        print(winding_number((50, 50), penta))       # 2
        ```
        ცენტრალური ხუთკუთხედი ორჯერ არის შემოვლილი: ray casting-ის სხივი ორ წიბოს კვეთს (ლუწი → გარეთ), winding number კი ბრუნვას ითვლის (`2 ≠ 0` → შიგნით).

!!! question "დავალება 2"
    10 000 შემთხვევითი წერტილიდან რამდენი ხვდება ზემოთ აგებულ `star` პოლიგონში? შეადარეთ შედეგი მონტე-კარლოთი გამოთვლილ ფართობს და `polygon_area(star)`-ს (წერტილები არეში `[0,100]×[0,100]`).

    ??? success "ამოხსნა"
        ```python
        random.seed(11)
        N = 10_000
        inside = sum(point_in_polygon((random.random() * 100, random.random() * 100), star) != 'outside'
                     for _ in range(N))
        print(inside, 'წერტილი შიგნით')
        print('მონტე-კარლო ფართობი:', inside / N * 100 * 100)
        print('Shoelace ფართობი:   ', abs(polygon_area(star)))
        ```
        ორი მნიშვნელობა ახლოსაა (განსხვავება ~1–2%), `N`-ის გაზრდით ის მცირდება.

!!! question "დავალება 3"
    ზედა `line`-ისთვის ააგეთ ცხრილი: `ε = 0.5, 1, 2, 5` და თითოეულისთვის წვეროების რაოდენობა და გამარტივებული ხაზის სიგრძე. რა პროცენტით იკლებს სიგრძე?

    ??? success "ამოხსნა"
        ```python
        def length(pts):
            return sum(math.dist(pts[i], pts[i + 1]) for i in range(len(pts) - 1))

        L0 = length(line)
        print('ε     წვეროები   სიგრძე   დანაკარგი')
        for eps in (0.5, 1, 2, 5):
            s = douglas_peucker(line, eps)
            print(f'{eps:<5} {len(s):>8} {length(s):>9.1f} {100 * (1 - length(s) / L0):>8.1f}%')
        ```
        გამარტივება ყოველთვის ამცირებს სიგრძეს: კვეთს „კუთხეებს". ამიტომ შედეგი სიგრძეების გამოთვლისთვის (მაგ. სანაპირო ზოლის) არ გამოდგება.

!!! question "დავალება 4"
    იპოვეთ წერტილთა სიმრავლის **დიამეტრი** (ერთმანეთისგან ყველაზე დაშორებული ორი წერტილი). `O(n²)`-ის ნაცვლად გამოიყენეთ მხოლოდ ამოზნექილი გარსის წვეროები და შეამოწმეთ სრული გადარჩევით.

    ??? success "ამოხსნა"
        ```python
        import itertools

        h = convex_hull(pts)
        fast = max(itertools.combinations(h, 2), key=lambda ab: math.dist(*ab))
        brute = max(itertools.combinations(pts, 2), key=lambda ab: math.dist(*ab))
        print(math.dist(*fast), math.dist(*brute), math.isclose(math.dist(*fast), math.dist(*brute)))
        ```
        ყველაზე დაშორებული წყვილი ყოველთვის გარსის წვეროებია, ამიტომ 500 წერტილის ნაცვლად მხოლოდ ~18-ს ვამოწმებთ.
