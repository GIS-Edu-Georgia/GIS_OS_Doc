# 🗻 კონტურები: Marching squares

იზოხაზი (კონტური) არის ხაზი, რომელიც ერთნაირი მნიშვნელობის წერტილებს აერთებს: რელიეფზე ერთნაირი სიმაღლისას, ამინდის რუკაზე ერთნაირი ტემპერატურისას. რასტრიდან მათი ამოღება ერთ-ერთი ყველაზე ხშირი GIS ოპერაციაა და QGIS-ში `gdal:contour` სწორედ ამას აკეთებს. შიგნით კი **Marching squares** ალგორითმი მუშაობს.

---

## 💡 იდეა

რასტრი ბადისებრ დალაგებული მნიშვნელობებია. ავიღოთ ერთი **უჯრა**, რომელიც ოთხი მეზობელი პიქსელით იქმნება და გვინდა დონე `L`-ის კონტურის გავლება:

1. ყოველ კუთხეზე ვამოწმებთ: მისი მნიშვნელობა `L`-ზე **მაღალია** თუ არა. შედეგი 4 ბიტია, ანუ **16 შესაძლო შემთხვევა**.
2. შემთხვევა გვეუბნება, რომელ **წიბოებს** კვეთს კონტური. მაგალითად, თუ მხოლოდ ქვედა-მარცხენა კუთხეა მაღალი, ხაზი მარცხენა და ქვედა წიბოს გადაკვეთს.
3. გადაკვეთის ადგილს ვპოულობთ **წრფივი ინტერპოლაციით** წიბოს ორ ბოლოს შორის: `t = (L − a) / (b − a)`.
4. ყველა უჯრის მონაკვეთებს ვაერთებთ პოლილაინებად.

---

## 🎮 სცადეთ თქვენც

შეცვალეთ ინტერვალი და გადაატარეთ მაუსი ბადის უჯრაზე: ჩანს მისი 4 კუთხე, შემთხვევის ნომერი (მაგ. `0101 = 5`) და ამ უჯრაში გატარებული მონაკვეთი. ჩართეთ „ბადე", რომ უჯრები კარგად დაინახოთ.

<iframe src="../widgets/contours.html" title="Marching squares-ის ინტერაქტიული დემო" style="width:100%;height:700px;border:0" loading="lazy"></iframe>

!!! tip "დაკვირვება"
    - ინტერვალის შემცირებით ხაზები ჭედდება, მონაკვეთების რაოდენობა კი სწრაფად იზრდება.
    - კონტურები არასოდეს იკვეთება: ორი სხვადასხვა დონე ერთსა და იმავე წერტილში ვერ ექნება.
    - ხაზები ან **იხურება**, ან ბადის საზღვარს აღწევს.

---

## ⚠️ უნაგირას (saddle) ორაზროვნება

თუ ორი **დიაგონალური** კუთხეა მაღალი (შემთხვევები `0101` და `1010`), ორი მაღალი უბანი შეიძლება ან **ერთმანეთს უკავშირდებოდეს**, ან **გამოყოფილი იყოს**. ორივე ინტერპრეტაცია შეესაბამება კუთხეების მონაცემებს. არჩევანი **უჯრის ცენტრის** მნიშვნელობას ეფუძნება, რომელიც ბადეში არ გვაქვს და შევაფასებთ: ვიღებთ ოთხი კუთხის საშუალოს. თუ ის `L`-ზე მაღალია, მაღალი კუთხეები ერთმანეთს უკავშირდება.

!!! warning "დონე ზუსტად მნიშვნელობის ტოლი"
    თუ `L` ზუსტად ტოლია რომელიმე პიქსელის მნიშვნელობისა, კონტური ბადის წვეროზე გაივლის და მეზობელ უჯრებში დუბლირებულ წერტილებს მიიღებთ. ათწილადებიან ბადეზე ეს იშვიათია, მაგრამ მთელრიცხვა DEM-ზე (მეტრებში) ხშირია. ამიტომ ხშირად დონეებს ოდნავ (მაგ. `+0.01`) ანაცვლებენ.

---

## 🐍 რეალიზაცია სუფთა Python-ით

```python title="contours.py" linenums="1"
import math

# ბადის უჯრის წიბოები: T = ზედა, R = მარჯვენა, B = ქვედა, L = მარცხენა
# ინდექსი = TL*8 + TR*4 + BR*2 + BL*1 (1 თუ მნიშვნელობა >= level)
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
    """წერტილი უჯრის წიბოზე წრფივი ინტერპოლაციით."""
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
    """აბრუნებს მონაკვეთების სიას [((x1, y1), (x2, y2)), ...] (x = სვეტი, y = სტრიქონი)."""
    segments = []
    for r in range(len(grid) - 1):
        for c in range(len(grid[0]) - 1):
            tl, tr = grid[r][c], grid[r][c + 1]
            bl, br = grid[r + 1][c], grid[r + 1][c + 1]
            case = (tl >= level) * 8 + (tr >= level) * 4 + (br >= level) * 2 + (bl >= level)
            if case in (5, 10):                  # უნაგირა: ორი ვარიანტი, ცენტრით ვწყვეტთ
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
    """მონაკვეთებს პოლილაინებად აერთიანებს (საერთო ბოლოებით)."""
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
        for forward in (True, False):            # ორივე მხარეს ვაგრძელებთ
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
    """დონეები: base + k * interval, რომლებიც [zmin, zmax]-ში ხვდება."""
    first = math.ceil((zmin - base) / interval)
    last = math.floor((zmax - base) / interval)
    return [base + k * interval for k in range(first, last + 1)]
```

### გამოყენება

```python
import math

# ხელოვნური გორა: z = მანძილი ცენტრიდან (კონუსი)
n, cx, cy = 61, 30, 30
grid = [[math.hypot(c - cx, r - cy) for c in range(n)] for r in range(n)]

for level in (5.3, 12.5, 20.3):
    segments = marching_squares(grid, level)
    lines = join_segments(segments)
    closed = len(lines) == 1 and lines[0][0] == lines[0][-1]
    err = max(abs(math.hypot(x - cx, y - cy) - level) for s in segments for (x, y) in s)
    print(level, len(segments), 'მონაკვეთი,', len(lines), 'ხაზი,', 'დახურული' if closed else 'ღია', f'გადახრა {err:.3f}')

print(contour_levels(3.2, 47.9, 10))      # [10, 20, 30, 40]
```

```text
5.3 44 მონაკვეთი, 1 ხაზი, დახურული გადახრა 0.018
12.5 100 მონაკვეთი, 1 ხაზი, დახურული გადახრა 0.009
20.3 164 მონაკვეთი, 1 ხაზი, დახურული გადახრა 0.006
[10, 20, 30, 40]
```

კონუსზე ყველა კონტური წრეწირია და გადახრა უჯრის 2%-ზე ნაკლებია: ინტერპოლაცია ძალიან კარგად მუშაობს.

---

## 🧰 იგივე ბიბლიოთეკებით

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

    lines = measure.find_contours(np.array(grid), 12.5)   # (row, col) კოორდინატების სია
    ```

---

## 📝 დავალებები

!!! question "დავალება 1"
    შეამოწმეთ, რომ ყოველ უჯრაში მონაკვეთების რაოდენობა 0, 1 ან 2-ია და ცალკე დათვალეთ რამდენ უჯრაში მოხვდა 16-ვე შემთხვევა სხვადასხვა ველისთვის.

    ??? success "ამოხსნა"
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
        უმეტეს უჯრას კონტური საერთოდ არ კვეთს, ორი მონაკვეთი კი მხოლოდ უნაგირა უჯრებშია (13 ცალი).

!!! question "დავალება 2"
    ააგეთ 3×3 „ჭადრაკული" ბადე `[[1,0,1],[0,1,0],[1,0,1]]` და გაატარეთ კონტური დონეზე `0.5` ორი წესით: (ა) ცენტრის საშუალოთი, (ბ) ყოველთვის „არ ვაერთებთ". რამდენი პოლილაინი მიიღეთ და რატომ განსხვავდება?

    ??? success "ამოხსნა"
        ```python
        checker = [[1, 0, 1], [0, 1, 0], [1, 0, 1]]

        # (ა) სტანდარტული წესი
        a = join_segments(marching_squares(checker, 0.5))

        # (ბ) უნაგირებზე ყოველთვის ორ ცალკე ხაზს ვხატავთ (მაღალი უბნები გამოყოფილია)
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
        ორი წესი სხვადასხვა ტოპოლოგიას იძლევა: ერთ შემთხვევაში მაღალი უბნები ერთმანეთს უკავშირდება, მეორეში არა. ორივე მხარე ბადის მონაცემებს თანაბრად ემთხვევა.

!!! question "დავალება 3"
    სინთეტიკურ რელიეფზე `z = 100 + 80·sin(x/12)·cos(y/9)` (ბადე 120×80) გამოთვალეთ იზოხაზების **ჯამური სიგრძე** ინტერვალებისთვის `5, 10, 20, 40`. როგორ იცვლება სიგრძე ინტერვალის გაორმაგებისას?

    ??? success "ამოხსნა"
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
        ინტერვალის გაორმაგება სიგრძეს დაახლოებით **ნახევრამდე** ამცირებს: ორჯერ ნაკლები იზოხაზი გვაქვს.

!!! question "დავალება 4 (PyQGIS)"
    წაიკითხეთ DEM-ის ერთი ბლოკი QGIS-ში `QgsRasterBlock`-ით, გაატარეთ `marching_squares` და შედეგი მეხსიერების ხაზოვან შრედ გამოიტანეთ, ხაზების გეორეფერენციით.

    ??? success "ამოხსნა"
        ```python
        layer = iface.activeLayer()                       # DEM
        ext = layer.extent()
        w, h = layer.width(), layer.height()
        block = layer.dataProvider().block(1, ext, w, h)
        grid = [[block.value(r, c) for c in range(w)] for r in range(h)]

        px, py = ext.width() / w, ext.height() / h
        def to_map(p):                                    # (სვეტი, სტრიქონი) -> რუკის კოორდინატი
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
        დიდ DEM-ზე ეს ნელია. სახელდახელო ტესტისთვის მცირე ფრაგმენტი აიღეთ და შედეგი შეადარეთ `gdal:contour`-ს.
