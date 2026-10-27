# ✂️ პოლიგონების გადაკვეთა და overlay

GIS-ის ერთ-ერთი ყველაზე ხშირი ოპერაციაა **overlay**: ორი პოლიგონური ფენის გაერთიანება, გადაკვეთა ან გამოკლება. მაგალითად: „რომელი ნაწილი მოხვდა წყალდიდობის ზონაში **და** საკადასტრო ნაკვეთში?", „რა ფართობი დარჩა ნაკვეთიდან დაცული ტერიტორიის გამოკლების შემდეგ?" QGIS-ის Clip, Intersection, Union და Difference სწორედ ამ ალგორითმებზე დგას.

| ოპერაცია | აღნიშვნა | შედეგი |
|---|---|---|
| გადაკვეთა | `A ∩ B` | რაც ერთდროულად ორივეშია |
| გაერთიანება | `A ∪ B` | რაც ერთშია მაინც |
| სხვაობა | `A − B` | A-ს ის ნაწილი, რაც B-ში არ არის |

---

## 🎮 სცადეთ თქვენც

გადაიტანეთ წვეროები და გადართეთ ოპერაციები. ლურჯი არის A, ნარინჯისფერი B, ხოლო წითელი **შედეგი**.

<iframe src="../widgets/clipping.html" title="პოლიგონების გადაკვეთის ინტერაქტიული დემო" style="width:100%;height:690px;border:0" loading="lazy"></iframe>

!!! tip "დაკვირვება"
    - ერთი პოლიგონი შეიძლება **ორ ან მეტ ნაწილად** დაიყოს (ორი „მთვარე" ერთმანეთს ორ ადგილას კვეთს), ამიტომ შედეგი ყოველთვის **რგოლების სიაა**.
    - თუ A მთლიანად B-შია, გადაკვეთის წერტილები არ არსებობს და ალგორითმს ცალკე შემთხვევად უნდა დავამუშაოთ.
    - როცა ერთი პოლიგონი მეორეში მთლიანად ექცევა, `A − B` **ხვრელს** იძლევა. ჩვენი ვერსია ხვრელს ცალკე რგოლად აბრუნებს და ხვრელად არ აღნიშნავს, ამიტომ დემოში ფართობს რგოლების ჩადგმულობით ვთვლით (იხ. დავალება 2).

---

## ⚙️ ორი ალგორითმი

### Sutherland–Hodgman: გაჭრა ამოზნექილი „ფანჯრით"

უმარტივესი ალგორითმია: ამოზნექილი `clipper`-ის **ყოველი გვერდისთვის** სათითაოდ ვჭრით `subject`-ს ნახევარსიბრტყით ([იგივე იდეა](voronoi.md), რომლითაც Voronoi-ს უჯრები ავაგეთ). ყოველი წიბოსთვის ოთხი შემთხვევა: ორივე ბოლო შიგნით (დავტოვოთ), ორივე გარეთ (გამოვტოვოთ), ერთი შიგნით, ერთი გარეთ (დავტოვოთ გადაკვეთის წერტილი).

**შეზღუდვა:** `clipper` აუცილებლად ამოზნექილი უნდა იყოს, ხოლო თუ შედეგი ორი ნაწილია, ალგორითმი მათ **ერთ პოლიგონად** აბრუნებს ორივეს დამაკავშირებელი „უსიგანო" წიბოთი (იხ. დავალება 3).

### Greiner–Hormann: ნებისმიერი ორი პოლიგონი

1. **ყველა გადაკვეთის პოვნა.** ერთი პოლიგონის ყოველი წიბო შევადაროთ მეორის ყოველ წიბოს (`O(n·m)`) და გადაკვეთის წერტილები ჩავსვათ ორივე პოლიგონის წვეროთა სიაში, წიბოზე პოზიციის (`alpha`) მიხედვით.
2. **შესვლა/გამოსვლა.** პოლიგონის გასწვრივ მოძრაობისას გადაკვეთის წერტილები მონაცვლეობით ან **შესვლაა** მეორე პოლიგონში, ან **გამოსვლა** (პირველის სტატუსს ვიგებთ იმით, პირველი წვერო მეორეშია თუ არა).
3. **ბილიკის აგება.** გადაკვეთის წერტილიდან ვიწყებთ: თუ ის შესვლაა, მივდივართ წინ, თუ გამოსვლა, უკან, სანამ შემდეგ გადაკვეთას არ შევხვდებით, იქ **მეორე პოლიგონზე გადავდივართ** და ასე ვაგრძელებთ, სანამ ბილიკი არ დაიხურება.

რა ოპერაცია გვინდა, იმას **შესვლა/გამოსვლა** განსაზღვრავს: გადაკვეთისთვის დავტოვოთ ისე, როგორც არის; **გაერთიანებისთვის** ორივე პოლიგონში ეს მონიშვნები შევაბრუნოთ (ე.ი. ვმოძრაობთ გარე კონტურზე); **სხვაობისთვის `A − B`** შევაბრუნოთ მხოლოდ A-სი.

!!! info "სირთულე და რეალური ბიბლიოთეკები"
    ჩვენი ვერსია `O(n·m)`-ია. GEOS, რომელიც Shapely-ს, PostGIS-სა და QGIS-ს უდგას ქვეშ, გადაკვეთებს [სივრცითი ინდექსებით](spatial_indexes.md) ეძებს და გადაგვარებულ შემთხვევებს **ზუსტი პრედიკატებითა და snapping-ით** წყვეტს (იხ. დავალება 4). Vatti, Martinez–Rueda და Weiler–Atherton იგივე ამოცანის სხვა ვარიანტებია.

---

## 🐍 რეალიზაცია სუფთა Python-ით

```python title="clip.py" linenums="1"
class Node:
    __slots__ = ('x', 'y', 'next', 'prev', 'is_x', 'alpha', 'neighbor', 'entry', 'visited')

    def __init__(self, x, y, alpha=0.0, is_x=False):
        self.x, self.y, self.alpha, self.is_x = x, y, alpha, is_x
        self.next = self.prev = self.neighbor = None
        self.entry = False
        self.visited = False


def point_in_polygon(p, poly):
    """Ray casting (იხ. გეომეტრიული ალგორითმები)."""
    x, y = p
    inside = False
    n = len(poly)
    for i in range(n):
        (x1, y1), (x2, y2) = poly[i], poly[(i + 1) % n]
        if (y1 > y) != (y2 > y) and x < x1 + (y - y1) * (x2 - x1) / (y2 - y1):
            inside = not inside
    return inside


def polygon_area(poly):
    """ნიშნიანი ფართობი (შულეისი): + თუ საათის ისრის საწინააღმდეგოა."""
    n = len(poly)
    return sum(poly[i][0] * poly[(i + 1) % n][1] - poly[(i + 1) % n][0] * poly[i][1] for i in range(n)) / 2


def _segment_hit(p1, p2, q1, q2):
    """(t, u) თუ [p1,p2] და [q1,q2] იკვეთება მათ შიგნით, სხვა შემთხვევაში None."""
    rx, ry = p2[0] - p1[0], p2[1] - p1[1]
    sx, sy = q2[0] - q1[0], q2[1] - q1[1]
    den = rx * sy - ry * sx
    if den == 0:
        return None                                    # პარალელურია
    t = ((q1[0] - p1[0]) * sy - (q1[1] - p1[1]) * sx) / den
    u = ((q1[0] - p1[0]) * ry - (q1[1] - p1[1]) * rx) / den
    return (t, u) if 0 < t < 1 and 0 < u < 1 else None


def _build(poly):
    nodes = [Node(x, y) for x, y in poly]
    for i, nd in enumerate(nodes):
        nd.next, nd.prev = nodes[(i + 1) % len(nodes)], nodes[i - 1]
    return nodes


def _insert(a, b, alpha, x, y):
    """ახალი კვეთის კვანძი a-სა და b-ს შორის (a-დან b-მდე წიბოზე), alpha-ს მიხედვით დალაგებით."""
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
    შედეგი: რგოლების სია. შეზღუდვა: წვეროები ზოგად მდებარეობაში, ხვრელები არ ბრუნდება."""
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

    if not found:                                       # კვეთა არ არის: შეიცავს ან განცალკევებულია
        a_in_b = point_in_polygon(subject[0], clipper)
        b_in_a = point_in_polygon(clipper[0], subject)
        if op == 'intersection':
            return [subject] if a_in_b else [clipper] if b_in_a else []
        if op == 'union':
            return [clipper] if a_in_b else [subject] if b_in_a else [subject, clipper]
        return [] if a_in_b else [subject] + ([clipper] if b_in_a else [])   # b_in_a: ხვრელი

    # შესვლა/გამოსვლის მონიშვნა
    flip_s = op in ('union', 'difference')              # intersection: ორივე ჩვეულებრივია
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

    # ბილიკების აგება
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
    """subject-ის ნებისმიერი პოლიგონი, clipper მხოლოდ ამოზნექილი."""
    if polygon_area(clipper) < 0:
        clipper = clipper[::-1]                       # საათის ისრის საწინააღმდეგო მიმართულება
    out = subject
    for i in range(len(clipper)):
        a, b = clipper[i], clipper[(i + 1) % len(clipper)]

        def inside(p):                                # მარცხნივ a->b წრფიდან
            return (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]) >= 0

        def cross_point(p, q):                        # [p,q] წიბოს გადაკვეთა წრფე a-b-სთან
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

### გამოყენება

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

!!! success "შემოწმება"
    ჩვენი `clip` შედარებულია **Shapely 2.0.6**-თან (GEOS) 3 000 შემთხვევით წყვილზე (ვარსკვლავისებრი პოლიგონები, 4–12 წვერო) ყველა სამ ოპერაციაზე: **8 514 შემთხვევაში ფართობი ემთხვევა, 0 შემთხვევაში არ ემთხვევა**. 72 შემთხვევა გამოვტოვე, რადგან შედეგი ხვრელს შეიცავდა. JavaScript-ის ვერსია, რომელიც დემოშია, Python-ისგან იდენტურ რგოლებს აბრუნებს 900 შემთხვევაზე.

---

## 📚 იგივე ბიბლიოთეკით

=== "Shapely"

    ```python
    from shapely.geometry import Polygon

    a, b = Polygon(A), Polygon(B)
    a.intersection(b)     # ან a & b
    a.union(b)            # ან a | b
    a.difference(b)       # ან a - b
    ```

=== "QGIS (PyQGIS)"

    ```python
    import processing

    processing.run('native:intersection', {'INPUT': layer_a, 'OVERLAY': layer_b, 'OUTPUT': 'intersection.gpkg'})
    processing.run('native:union', {'INPUT': layer_a, 'OVERLAY': layer_b, 'OUTPUT': 'union.gpkg'})
    processing.run('native:difference', {'INPUT': layer_a, 'OVERLAY': layer_b, 'OUTPUT': 'difference.gpkg'})
    ```

!!! warning "რა არის შემოწმებული"
    Shapely-ის შედარება გავუშვი. QGIS-ის ფრაგმენტები **არ გამიშვია** (QGIS არ არის დაყენებული).

---

## ✍️ დავალებები

!!! question "დავალება 1: შემოწმება ეტალონთან"
    დაწერეთ შემთხვევითი ტესტი: 3 000 წყვილი შემთხვევითი პოლიგონის ფართობები შეადარეთ Shapely-ს. დაგენერირება: `star()` ქვემოთაა.

    ??? success "ამოხსნა"
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
                    skipped += 1                       # შედეგს ხვრელი აქვს, ჩვენი ვერსია ვერ აბრუნებს
                    continue
                area = sum(abs(polygon_area(r)) for r in clip(A, B, op))
                if abs(area - ref.area) < 1e-6:
                    ok += 1
                else:
                    bad += 1
        print('სწორი:', ok, ', არასწორი:', bad, ', გამოტოვებული (ხვრელი):', skipped)
        ```
        ```text
        სწორი: 8514 , არასწორი: 0 , გამოტოვებული (ხვრელი): 72
        ```
        ტესტში `is_valid` გამოტოვებს თვითკვეთად პოლიგონებს (`star()` მათ ზოგჯერ იძლევა), ვინაიდან გადაკვეთის ალგორითმები მხოლოდ **სწორი (valid)** პოლიგონებზე გარანტირებულად მუშაობს.

!!! question "დავალება 2: ინკლუზია–ექსკლუზია და ხვრელები"
    თეორიულად `area(A ∪ B) = area(A) + area(B) − area(A ∩ B)`. შეამოწმეთ ეს იგივე ტიპის 500 წყვილზე. რა შემთხვევაში არ სრულდება და რატომ?

    ??? success "ამოხსნა"
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
        ტოლობა 13 შემთხვევაში დაირღვა, და **ყველა მათგანში გაერთიანებას ხვრელი აქვს** (ორი ვარსკვლავი ერთმანეთს გარს ეხვევა და შიგნით ცარიელი ადგილი რჩება). ჩვენი ფუნქცია გარე კონტურსაც და ხვრელსაც ორივეს დადებით ფართობად ითვლის. გამოსწორება: რგოლებს ორიენტაციით (ნიშნიანი ფართობით) გავარჩევთ ან GeoJSON-ის წესს ვიყენებთ (გარე რგოლი საათის ისრის საწინააღმდეგოდ, ხვრელი საათის ისრის მიმართულებით).

!!! question "დავალება 3: რატომ არ ვიყენებთ Sutherland–Hodgman-ს ყველგან?"
    U-ს ფორმის პოლიგონი `U = [(0,0), (9,0), (9,8), (6,8), (6,3), (3,3), (3,8), (0,8)]` გაჭერით მართკუთხედით `R = [(-1,5), (10,5), (10,9), (-1,9)]`, რომელიც ორივე „ყურს" კვეთს. შეადარეთ Greiner–Hormann-ს და Shapely-ს.

    ??? success "ამოხსნა"
        ```python
        from sh import sutherland_hodgman

        U = [(0, 0), (9, 0), (9, 8), (6, 8), (6, 3), (3, 3), (3, 8), (0, 8)]
        R = [(-1, 5), (10, 5), (10, 9), (-1, 9)]
        print('GH:', [round(abs(polygon_area(r)), 1) for r in clip(U, R, 'intersection')])
        res = sutherland_hodgman(U, R)
        print('S-H:', len(res), 'წვერო, ფართობი', round(abs(polygon_area(res)), 1), ', ვალიდურია:', Polygon(res).is_valid)
        ref = Polygon(U).intersection(Polygon(R))
        print('ნამდვილი:', ref.area, ref.geom_type)
        print(res)
        ```
        ```text
        GH: [9.0, 9.0]
        S-H: 8 წვერო, ფართობი 18.0 , ვალიდურია: False
        ნამდვილი: 18.0 MultiPolygon
        [(6.0, 5.0), (3.0, 5.0), (3, 8), (0, 8), (0.0, 5.0), (9.0, 5.0), (9, 8), (6, 8)]
        ```
        ორი „ყურის" ნაცვლად S-H ერთ პოლიგონს აბრუნებს, რომლის ორი ნაწილი `(3,5)–(0,5)–(9,5)–(6,5)` სეგმენტით არის დაკავშირებული, რომელიც ორჯერ გადის ერთსა და იმავე წიბოზე. **ფართობი სწორია** (18), მაგრამ პოლიგონი **არასწორია** (Shapely-ს არავალიდურად ითვლის). Greiner–Hormann ორ ცალკე რგოლს იძლევა.

!!! question "დავალება 4: გადაგვარებული შემთხვევები"
    გადაკვეთეთ კვადრატები `[(0,0),(4,0),(4,4),(0,4)]` და `[(2,0),(6,0),(6,4),(2,4)]`: მათი ორი გვერდი **ერთ წრფეზეა** (`y = 0` და `y = 4`). რა ფართობს აბრუნებს `clip` და რა უნდა იყოს? როგორ გავასწოროთ?

    ??? success "ამოხსნა"
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
        ნამდვილი ფართობი 8-ია (მართკუთხედი `2 ≤ x ≤ 4`). ჩვენი ალგორითმი გადაკვეთებს მხოლოდ წიბოების **შიგნით** ეძებს (`0 < t < 1`), ამიტომ ამ შემთხვევაში არც ერთ გადაკვეთას ვერ პოულობს, წვერო `(2, 0)` კი ზუსტად სხვა პოლიგონის გვერდზე დევს და „შიგნით" ითვლება. შედეგი: მთლიანი `B` (16). **ფართოდ გავრცელებული გამოსწორება** არის კოორდინატების ძალიან მცირე შემთხვევითი „ტრიალი" (1e-7), რაც გადაგვარებას გამორიცხავს. ეს ხშირად გამოყენებული გზაა Greiner–Hormann-ის ტიპის ალგორითმებში. პროფესიული ბიბლიოთეკები კი უფრო მყარ **ზუსტ არითმეტიკასა და snapping**-ს იყენებენ ისე, რომ კოორდინატები არ შეიცვალოს.
