# 🏋️ პრაქტიკა: პროექტები

წინა გვერდებზე ალგორითმები ცალ-ცალკე განვიხილეთ. რეალურ ამოცანაში კი ისინი ერთმანეთს ერწყმის: ტაილები ინდექსს, გრაფი გეომეტრიას. ქვემოთ **ოთხი მინი-პროექტია**, თითოეული რამდენიმე ალგორითმს აერთიანებს. ყველა კოდი სუფთა Python-ია (მხოლოდ სტანდარტული ბიბლიოთეკა) და მონაცემები თავად იქმნება, ამიტომ არაფრის ჩამოტვირთვა არ გჭირდებათ.

!!! tip "როგორ ვიმუშაოთ"
    1. წაიკითხეთ პროექტის აღწერა და ნაბიჯები.
    2. სცადეთ თავად, დახმარებისთვის გახსენით შესაბამისი თემის გვერდი.
    3. მხოლოდ ამის შემდეგ გახსენით „ამოხსნა". ის სრული, გასაშვები პროგრამაა.

    თუ თქვენი შედეგი რიცხვებში განსხვავდება, პირველ რიგში შეამოწმეთ `random.seed(...)`: ის განსაზღვრავს, რომ მონაცემები ყოველ ჯერზე ერთნაირი იყოს.

| პროექტი | ალგორითმები | გვერდები |
|---|---|---|
| 1. შენობების სიმჭიდროვის რუკა | XYZ ტაილები, quadkey, იერარქია | [ტაილები](tiles_xyz.md), [Quadtree](quadtree.md) |
| 2. უახლოესი სადგური | k-d tree, brute force | [ინდექსები](spatial_indexes.md) |
| 3. მინი-ნავიგატორი | A*, Douglas–Peucker | [გრაფები](graph_algorithms.md), [გეომეტრია](geometry_algorithms.md) |
| 4. მისაწვდომობის ზონა | Dijkstra, Convex hull, ფართობი | [გრაფები](graph_algorithms.md), [გეომეტრია](geometry_algorithms.md) |

---

## 🗺️ პროექტი 1. შენობების სიმჭიდროვის რუკა

**ამოცანა.** გვაქვს 3 500 წერტილი (შენობა) საქართველოს ტერიტორიაზე, სამ ქალაქთან დაჯგუფებული, და ფონური გაფანტული წერტილები. ვებ-რუკისთვის სიმჭიდროვე ტაილებად უნდა დავთვალოთ ყველა zoom-ზე.

!!! question "ნაბიჯები"
    1. ყოველი წერტილი გადაიყვანეთ **z=12** ტაილის quadkey-ად.
    2. quadkey-ის პრეფიქსებით დათვალეთ წერტილები z=8, 10 და 12 დონეზე (`Counter`). რომელია ყველაზე დატვირთული ტაილი თითოეულ დონეზე?
    3. შეამოწმეთ, რომ ყოველი z=8 ტაილის მნიშვნელობა მისი z=10 შვილების ჯამის ტოლია.
    4. გაიგეთ, რამდენი პროცენტია დაკავებული z=12 ტაილი ტერიტორიის ბადეში.

??? success "ამოხსნა"
    ```python title="density.py" linenums="1"
    import math
    import random
    from collections import Counter

    random.seed(7)
    centers = [(44.80, 41.72, 0.05), (41.64, 41.65, 0.04), (43.58, 42.25, 0.03)]   # თბილისი, ბათუმი, ქუთაისი (მიახლოებით)
    pts = [(random.gauss(cx, s), random.gauss(cy, s))
           for cx, cy, s in (random.choice(centers) for _ in range(3000))]
    pts += [(random.uniform(40.0, 46.7), random.uniform(41.0, 43.6)) for _ in range(500)]


    def lonlat_to_tile(lon, lat, z):
        n = 2 ** z
        x = int((lon + 180) / 360 * n)
        y = int((1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n)
        return min(x, n - 1), min(y, n - 1)


    def quadkey(x, y, z):
        key = ''
        for i in range(z, 0, -1):
            mask = 1 << (i - 1)
            key += str((1 if x & mask else 0) + (2 if y & mask else 0))
        return key


    keys = [quadkey(*lonlat_to_tile(lon, lat, 12), 12) for lon, lat in pts]

    for z in (8, 10, 12):
        cnt = Counter(k[:z] for k in keys)
        key, n = cnt.most_common(1)[0]
        print(f'z={z:2}: დაკავებული ტაილი {len(cnt):3}, ყველაზე დატვირთული {key} -> {n}')

    # იერარქია: მშობლის მნიშვნელობა = შვილების ჯამი
    c8, c10 = Counter(k[:8] for k in keys), Counter(k[:10] for k in keys)
    ok = all(c8[p] == sum(v for k, v in c10.items() if k.startswith(p)) for p in c8)
    print('მშობელი = შვილების ჯამი:', ok)

    # ცარიელი ტაილების წილი z=12-ზე ამ ფართობში
    x0, y1 = lonlat_to_tile(40.0, 41.0, 12)
    x1, y0 = lonlat_to_tile(46.7, 43.6, 12)
    total = (x1 - x0 + 1) * (y1 - y0 + 1)
    print(f'z=12 ბადეში {total} ტაილია, დაკავებულია {len(set(keys))} ({100 * len(set(keys)) / total:.1f}%)')
    ```
    ```text
    z= 8: დაკავებული ტაილი  18, ყველაზე დატვირთული 12033323 -> 1048
    z=10: დაკავებული ტაილი 184, ყველაზე დატვირთული 1203332312 -> 1011
    z=12: დაკავებული ტაილი 489, ყველაზე დატვირთული 120333303311 -> 452
    მშობელი = შვილების ჯამი: True
    z=12 ბადეში 3157 ტაილია, დაკავებულია 489 (15.5%)
    ```
    **რას ვხედავთ.** quadkey-ის პრეფიქსი სწორედ მშობელი ტაილია, ამიტომ ერთი დათვლა (z=12) საკმარისია, დანარჩენი დონეები მისგან პრეფიქსის შეკვეცით მიიღება. ბადის მხოლოდ 15.5% არის დაკავებული, ამიტომ ცარიელ ტაილებს საერთოდ არ ვინახავთ (ეს არის quadtree-ის უპირატესობა: **მეხსიერება მონაცემებზეა დამოკიდებული, ფართობზე კი არა**).

!!! question "გაგრძელება"
    დაამატეთ ფუნქცია, რომელიც მოცემული ტაილისთვის (მაგ. `12033323`) აბრუნებს 4 შვილისა და მშობლის quadkey-ს, და გამოიყენეთ ის „ყველაზე დატვირთული ტაილის" ირგვლივ მეზობელი ტაილების სიმჭიდროვის გამოსაჩენად.

---

## 📍 პროექტი 2. უახლოესი სადგური

**ამოცანა.** 2 000 სადგურია და 2 000 მისამართისთვის უნდა ვიპოვოთ უახლოესი სადგური. პირდაპირი ძებნა თითო მოთხოვნაზე ყველა სადგურს ამოწმებს; k-d tree ამას უმეტეს ტოტს არ სწავლობს.

!!! question "ნაბიჯები"
    1. დაწერეთ `brute(q)`: `min` ყველა სადგურზე.
    2. ააგეთ k-d tree და `nearest` ([ინდექსები](spatial_indexes.md)).
    3. დარწმუნდით, რომ ორივე მეთოდი ყველა მისამართისთვის ერთსა და იმავე სადგურს აბრუნებს.
    4. გაზომეთ დრო `time.perf_counter()`-ით და გამოთვალეთ დაჩქარება.

??? success "ამოხსნა"
    ```python title="nearest_station.py" linenums="1"
    import random
    import time

    random.seed(3)
    stations = [(random.uniform(0, 100), random.uniform(0, 100)) for _ in range(2000)]
    queries = [(random.uniform(0, 100), random.uniform(0, 100)) for _ in range(2000)]


    def brute(q):
        return min(stations, key=lambda s: (s[0] - q[0]) ** 2 + (s[1] - q[1]) ** 2)


    def build(points, depth=0):
        if not points:
            return None
        axis = depth % 2
        points = sorted(points, key=lambda p: p[axis])
        mid = len(points) // 2
        return (points[mid], axis, build(points[:mid], depth + 1), build(points[mid + 1:], depth + 1))


    def nearest(node, t, best=None):
        if node is None:
            return best
        p, axis, left, right = node
        d = (p[0] - t[0]) ** 2 + (p[1] - t[1]) ** 2
        if best is None or d < best[1]:
            best = (p, d)
        diff = t[axis] - p[axis]
        near, far = (left, right) if diff < 0 else (right, left)
        best = nearest(near, t, best)
        if diff * diff < best[1]:
            best = nearest(far, t, best)
        return best


    tree = build(stations)
    t0 = time.perf_counter()
    a = [brute(q) for q in queries]
    t1 = time.perf_counter()
    b = [nearest(tree, q)[0] for q in queries]
    t2 = time.perf_counter()
    print('ერთნაირია:', a == b)
    print(f'დაჩქარება ≈ {(t1 - t0) / (t2 - t1):.0f}-ჯერ')
    ```
    ```text
    ერთნაირია: True
    დაჩქარება ≈ 70-ჯერ
    ```
    დაჩქარება თქვენს კომპიუტერზე განსხვავებული იქნება, თუმცა რიგით (ათეულობით ჯერ) მსგავსი. შეამჩნიეთ, რომ ხის აგების დრო ჩვენ **არ** გავითვალისწინეთ: ის ერთხელ იხარჯება და შემდეგ ყველა მოთხოვნას ემსახურება.

!!! question "გაგრძელება"
    გაზარდეთ სადგურების რიცხვი 200-დან 20 000-მდე და ააგეთ დაჩქარების დამოკიდებულება `n`-ზე. რატომ იზრდება დაჩქარება `n`-თან ერთად? (მინიშნება: `O(n)` vs `O(log n)`.)

---

## 🧭 პროექტი 3. მინი-ნავიგატორი

**ამოცანა.** 40×60 უჯრის რუკაზე დაბრკოლებებია (შენობები, კედლები). უნდა ვიპოვოთ უმოკლესი გზა `(2,2)`-დან `(37,57)`-მდე და ის გავამარტივოთ, რომ მხოლოდ მთავარი შემობრუნების წერტილები დარჩეს.

!!! question "ნაბიჯები"
    1. ააგეთ 8-მეზობლიანი გრაფი ისე, რომ **დიაგონალზე კუთხის გადაჭრა დაბრკოლებას გვერდით არ შეიძლებოდეს**.
    2. იპოვეთ გზა A*-ით ოქტილური ევრისტიკით. რამდენი უჯრა გაიხსნა?
    3. გაამარტივეთ გზა Douglas–Peucker-ით `ε=1`-ზე.
    4. შეამოწმეთ, არ კვეთს თუ არა გამარტივებული ხაზი დაბრკოლებას. სცადეთ `ε = 0.5, 1, 2, 3`.

??? success "ამოხსნა"
    ```python title="navigator.py" linenums="1"
    import heapq
    import math
    import random

    random.seed(11)
    R, C = 40, 60
    cost = [[None if random.random() < 0.22 else 1.0 for _ in range(C)] for _ in range(R)]
    for r in range(5, 35):
        cost[r][20] = None                    # ვერტიკალური კედლები
    for r in range(0, 30):
        cost[r][40] = None
    for r, c in [(20, 20), (3, 40), (2, 2), (37, 57)]:
        cost[r][c] = 1.0                      # კარი კედელში, საწყისი და საბოლოო უჯრა


    def neighbors(r, c):
        for dr in (-1, 0, 1):
            for dc in (-1, 0, 1):
                if dr == dc == 0:
                    continue
                rr, cc = r + dr, c + dc
                if not (0 <= rr < R and 0 <= cc < C) or cost[rr][cc] is None:
                    continue
                if dr and dc and (cost[r][cc] is None or cost[rr][c] is None):
                    continue                  # კუთხის გადაჭრა დაუშვებელია
                yield (rr, cc), math.hypot(dr, dc) * cost[rr][cc]


    def octile(a, b):
        dr, dc = abs(a[0] - b[0]), abs(a[1] - b[1])
        return (dr + dc) + (math.sqrt(2) - 2) * min(dr, dc)


    def astar(start, goal):
        g = {start: 0}
        prev = {}
        heap = [(octile(start, goal), start)]
        done = set()
        while heap:
            _, u = heapq.heappop(heap)
            if u in done:
                continue
            done.add(u)
            if u == goal:
                break
            for v, w in neighbors(*u):
                ng = g[u] + w
                if ng < g.get(v, math.inf):
                    g[v] = ng
                    prev[v] = u
                    heapq.heappush(heap, (ng + octile(v, goal), v))
        if goal not in g:
            return None, None, len(done)
        path = [goal]
        while path[-1] != start:
            path.append(prev[path[-1]])
        return path[::-1], g[goal], len(done)


    def point_line_distance(p, a, b):
        (x, y), (x1, y1), (x2, y2) = p, a, b
        if a == b:
            return math.hypot(x - x1, y - y1)
        return abs((x2 - x1) * (y1 - y) - (x1 - x) * (y2 - y1)) / math.hypot(x2 - x1, y2 - y1)


    def douglas_peucker(pts, eps):
        if len(pts) < 3:
            return pts
        d, i = max((point_line_distance(pts[k], pts[0], pts[-1]), k) for k in range(1, len(pts) - 1))
        if d <= eps:
            return [pts[0], pts[-1]]
        return douglas_peucker(pts[:i + 1], eps)[:-1] + douglas_peucker(pts[i:], eps)


    def line_cells(a, b):
        n = int(max(abs(b[0] - a[0]), abs(b[1] - a[1])) * 2) + 1
        return {(round(a[0] + (b[0] - a[0]) * i / n), round(a[1] + (b[1] - a[1]) * i / n)) for i in range(n + 1)}


    path, length, expanded = astar((2, 2), (37, 57))
    print(f'გზა: {len(path)} უჯრა, სიგრძე {length:.2f}, გახსნილია {expanded} უჯრა')

    for eps in (0.5, 1, 2, 3):
        simp = douglas_peucker(path, eps)
        bad = sum(any(cost[r][c] is None for r, c in line_cells(simp[i], simp[i + 1]))
                  for i in range(len(simp) - 1))
        print(f'ε={eps}: {len(simp):2} წერტილი, დაბრკოლებას კვეთს {bad} სეგმენტი')
    ```
    ```text
    გზა: 82 უჯრა, სიგრძე 86.38, გახსნილია 580 უჯრა
    ε=0.5: 24 წერტილი, დაბრკოლებას კვეთს 0 სეგმენტი
    ε=1: 10 წერტილი, დაბრკოლებას კვეთს 1 სეგმენტი
    ε=2:  6 წერტილი, დაბრკოლებას კვეთს 3 სეგმენტი
    ε=3:  6 წერტილი, დაბრკოლებას კვეთს 3 სეგმენტი
    ```
    **მთავარი დასკვნა.** Douglas–Peucker მხოლოდ ხაზის ფორმას ითვალისწინებს და **არაფერი იცის დაბრკოლებებზე**. `ε=1`-ზე გამარტივებული ხაზი უკვე კედელს კვეთს. ნავიგაციაში გამარტივება ან უნდა შეჩერდეს პირველ დარღვევაზე (ზრდის `ε`-ს მანამ, სანამ გზა სუფთაა), ან მის შემდეგ ისევ უნდა შემოწმდეს. ეს ტიპური შემთხვევაა, როცა ორი სწორი ალგორითმი ერთად არასწორ შედეგს იძლევა.

!!! question "გაგრძელება"
    დაწერეთ ფუნქცია `simplify_safe(path, cost)`, რომელიც `ε`-ს 0.25-ის ბიჯით ზრდის და აბრუნებს ყველაზე გამარტივებულ ხაზს, რომელიც არცერთ დაბრკოლებას არ კვეთს. შეადარეთ Dijkstra-ს გახსნილი უჯრების რაოდენობას იმავე წყვილზე.

---

## ⏱️ პროექტი 4. მისაწვდომობის ზონა

**ამოცანა.** იმავე რუკაზე გვინდა ვიცოდეთ, **სად მივალთ `(10,20)` უჯრიდან `T` ხარჯით**. ზონა უნდა შემოვხაზოთ პოლიგონით და ვიპოვოთ მისი ფართობი.

!!! question "ნაბიჯები"
    1. შეცვალეთ Dijkstra ისე, რომ ხარჯი `T`-ს გადაცილებისას გაჩერდეს (ყველა უჯრა `d ≤ T`).
    2. აიღეთ ამ უჯრების `(x, y) = (სვეტი, მწკრივი)` კოორდინატები და ააგეთ **Convex hull**.
    3. გამოთვალეთ ჰალის ფართობი შულეისის ფორმულით.
    4. `T = 5, 10, 15`-ისთვის შეადარეთ ჰალის ფართობი მიღწეულ უჯრათა რაოდენობას. რას ნიშნავს ეს წილი?

??? success "ამოხსნა"
    დაამატეთ ეს კოდი წინა პროექტის `navigator.py`-ის **ბოლოს** (იგივე `cost`, `neighbors`):

    ```python title="isochrone.py" linenums="1"
    def dijkstra_limit(start, limit):
        dist = {start: 0}
        heap = [(0, start)]
        done = set()
        while heap:
            d, u = heapq.heappop(heap)
            if u in done:
                continue
            done.add(u)
            for v, w in neighbors(*u):
                nd = d + w
                if nd <= limit and nd < dist.get(v, math.inf):
                    dist[v] = nd
                    heapq.heappush(heap, (nd, v))
        return dist


    def convex_hull(points):
        pts = sorted(set(points))

        def cross(o, a, b):
            return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

        lower, upper = [], []
        for p in pts:
            while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
                lower.pop()
            lower.append(p)
        for p in reversed(pts):
            while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
                upper.pop()
            upper.append(p)
        return lower[:-1] + upper[:-1]


    def polygon_area(poly):
        s = sum(poly[i][0] * poly[(i + 1) % len(poly)][1] - poly[(i + 1) % len(poly)][0] * poly[i][1]
                for i in range(len(poly)))
        return abs(s) / 2


    start = (20, 10)
    for limit in (5, 10, 15):
        dist = dijkstra_limit(start, limit)
        hull = convex_hull([(c, r) for r, c in dist])
        area = polygon_area(hull)
        print(f'T={limit:2}: მიღწეული {len(dist):3} უჯრა, ჰალი {len(hull):2} წვერო, ფართობი {area:.1f}, წილი {len(dist) / area:.2f}')
    ```
    ```text
    T= 5: მიღწეული  42 უჯრა, ჰალი  7 წვერო, ფართობი 46.0, წილი 0.91
    T=10: მიღწეული 170 უჯრა, ჰალი 11 წვერო, ფართობი 211.5, წილი 0.80
    T=15: მიღწეული 374 უჯრა, ჰალი 13 წვერო, ფართობი 443.0, წილი 0.84
    ```
    **რას ნიშნავს წილი.** თუ დაბრკოლებები არ იქნებოდა, ზონა წრე (ოქტილურ მეტრიკაში რვაკუთხედი) იქნებოდა და წილი დაახლოებით 1-ს უახლოვდებოდა. ის, რომ ეს რიცხვი 1-ზე ნაკლებია, ნიშნავს, რომ ჰალი მოიცავს ისეთ ადგილებსაც, სადაც რეალურად ვერ მივაღწევთ (კედლების უკან). Convex hull მარტივი, მაგრამ უხეში შემოხაზვაა: რეალური მისაწვდომობის ზონა ხშირად **არამრგვალია** და concave hull ან უჯრების გაერთიანება უკეთესია.

!!! question "გაგრძელება"
    ჰალის მაგივრად გამოთვალეთ ზონის ფართობი უჯრების რაოდენობით და შეადარეთ. შემდეგ დაამატეთ მეორე სასტარტო წერტილი და იპოვეთ უჯრები, რომლებზეც **ორივე** წერტილიდან `T`-ში მივდივართ (გადაკვეთა).

---

## 🏁 დასკვნითი პროექტი: ააგეთ საკუთარი

აირჩიეთ ერთ-ერთი და შეაერთეთ სულ მცირე სამი ალგორითმი:

| იდეა | რა გჭირდებათ |
|---|---|
| **უახლოესი სასწრაფო დახმარება** | k-d tree უახლოესი სადგურისთვის → A* გზისთვის → ზონა Voronoi-ს უჯრებით ([Voronoi](voronoi.md)) |
| **რელიეფის გზა** | სიმაღლეების ბადე ([TIN](tin_delaunay.md)) → დახრილობა როგორც ხარჯი → A* → კონტურები ([კონტურები](contours.md)) გზის ირგვლივ |
| **ტაილ-სერვერი** | წერტილების quadkey-ებად ჩაწერა → R-tree bbox მოთხოვნისთვის ([ინდექსები](spatial_indexes.md)) → ტაილების მიცემა `z/x/y`-ის მიხედვით |

შეფასების კრიტერიუმები:

- ✅ პროგრამა მეორედ გაშვებისას იგივე შედეგს იძლევა (`random.seed`)
- ✅ ყოველი ალგორითმი შემოწმებულია **ნელი, მაგრამ აშკარად სწორი** მეთოდის წინააღმდეგ (როგორც პროექტი 2-ში)
- ✅ ერთი განსაკუთრებული შემთხვევა მაინც გაანალიზებულია (როგორც პროექტი 3-ში, კედლის გადაკვეთა)
