# 🔷 Voronoi და Thiessen-ის პოლიგონები

**Voronoi-ს დიაგრამა** სიბრტყეს ყოფს უჯრებად ისე, რომ ყოველი უჯრის ყველა წერტილი **თავისი საიტის უფრო ახლოსაა, ვიდრე სხვა ნებისმიერი საიტის**. გეოგრაფიაში მას **Thiessen-ის პოლიგონებს** ეძახიან: ნალექის სადგურის „გავლენის ზონა", უახლოესი საავადმყოფოს მომსახურების არეალი, უახლოესი სკოლის ტერიტორია.

---

## 💡 იდეა და კავშირი Delaunay-სთან

- ორ საიტს შორის საზღვარი მათი **შუამართობია** (წრფე, რომელიც ორივესგან თანაბრად დაშორებულია).
- უჯრა არის ყველა ასეთი „მე უფრო ახლოს ვარ" ნახევარსიბრტყის **თანაკვეთა**.
- უჯრის წვერო არის ადგილი, სადაც **სამი საიტი თანაბრადაა დაშორებული**: ეს ზუსტად შემოხაზული წრის ცენტრია.

სწორედ ამიტომ Voronoi და [Delaunay-ს ტრიანგულაცია](tin_delaunay.md) **ორმაგებია (dual)**:

| Delaunay | Voronoi |
|---|---|
| სამკუთხედი | უჯრის წვერო (სამკუთხედის შემოხაზული წრის ცენტრი) |
| წიბო ორ საიტს შორის | ორი უჯრის საერთო საზღვარი |
| საიტი | უჯრა |

---

## 🎮 სცადეთ თქვენც

დააჭირეთ რუკას საიტების დასამატებლად. ფერი და რიცხვი ამ საიტზე გაზომილი მნიშვნელობაა (მაგ. ნალექი მმ-ში). ჩართეთ **Delaunay** და **შემოხაზული წრე**: იხილავთ, რომ წრეების ცენტრები უჯრების წვეროებია.

<iframe src="../widgets/voronoi.html" title="Voronoi-ს ინტერაქტიული დემო" style="width:100%;height:700px;border:0" loading="lazy"></iframe>

!!! tip "დაკვირვება"
    - **უბრალო** საშუალო ყველა სადგურს ერთნაირ წონას აძლევს. **ფართობით შეწონილი** (Thiessen) საშუალო მათ აძლევს იმდენ წონას, რამდენ ტერიტორიას წარმოადგენენ. თუ სადგურები ერთ ადგილას დაჯგუფდა, ორი რიცხვი ერთმანეთისგან შესამჩნევად განსხვავდება.
    - უკიდურესი სადგურების უჯრები დიდია: მათ გარეთ სხვა საიტი არ არის.

---

## ⚙️ ალგორითმი: ნახევარსიბრტყეების მოჭრა

ყოველი საიტისთვის:

1. ვიწყებთ მთელი არეით (bbox).
2. ყოველ სხვა საიტზე ვჭრით უჯრას შუამართობით და ვტოვებთ მხოლოდ მხარეს, რომელიც ჩვენს საიტთანაა.
3. შედეგი ამოზნექილი პოლიგონია.

მოჭრისთვის ვიყენებთ **Sutherland–Hodgman**-ს: პოლიგონის ყოველ წიბოს ვამოწმებთ ზღვართან (ორივე ბოლო შიგნითაა, ერთია გარეთ და ა.შ.) და ვაგროვებთ შედეგს.

!!! info "სირთულე"
    ეს ვერსია `O(n²·k)`-ია (`k` არის უჯრის საშუალო წვეროების რაოდენობა). **Fortune-ის ალგორითმი** იგივეს `O(n log n)`-ში აკეთებს ხაზის მოძრაობით (sweep line). პრაქტიკაში ის ბიბლიოთეკებშია (Qhull, GEOS), ჩვენი მარტივი ვერსია კი კარგია სასწავლო მიზნებისთვის და რამდენიმე ასეულ საიტამდე.

---

## 🐍 რეალიზაცია სუფთა Python-ით

```python title="voronoi.py" linenums="1"
import math


def clip_halfplane(poly, a, b, c):
    """Sutherland–Hodgman: პოლიგონის ნაწილი, სადაც a*x + b*y <= c."""
    out = []
    n = len(poly)
    for i in range(n):
        p, q = poly[i], poly[(i + 1) % n]
        fp, fq = a * p[0] + b * p[1] - c, a * q[0] + b * q[1] - c
        if fp <= 0:
            out.append(p)
        if (fp < 0 < fq) or (fq < 0 < fp):           # წიბო ზღვარს კვეთს
            t = fp / (fp - fq)
            out.append((p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])))
    return out


def voronoi_cells(sites, bbox):
    """თითო საიტის Voronoi უჯრა bbox = (minx, miny, maxx, maxy)-ში.
    უჯრა = ყველა ნახევარსიბრტყის თანაკვეთა: 'მე უფრო ახლოს ვარ, ვიდრე j'."""
    minx, miny, maxx, maxy = bbox
    cells = []
    for i, (xi, yi) in enumerate(sites):
        cell = [(minx, miny), (maxx, miny), (maxx, maxy), (minx, maxy)]
        for j, (xj, yj) in enumerate(sites):
            if i == j or not cell:
                continue
            # (x-xi)² + (y-yi)² <= (x-xj)² + (y-yj)²   <=>   a*x + b*y <= c
            a, b = 2 * (xj - xi), 2 * (yj - yi)
            c = xj * xj + yj * yj - xi * xi - yi * yi
            cell = clip_halfplane(cell, a, b, c)
        cells.append(cell)
    return cells


def area(poly):
    return abs(sum(poly[i][0] * poly[(i + 1) % len(poly)][1] -
                   poly[(i + 1) % len(poly)][0] * poly[i][1] for i in range(len(poly)))) / 2


def thiessen_mean(values, cells):
    """ფართობით შეწონილი საშუალო (მაგ. ნალექების საშუალო სადგურებით)."""
    areas = [area(c) for c in cells]
    return sum(v * a for v, a in zip(values, areas)) / sum(areas)


def nearest_site(p, sites):
    return min(range(len(sites)), key=lambda i: (sites[i][0] - p[0]) ** 2 + (sites[i][1] - p[1]) ** 2)
```

### გამოყენება და შემოწმება

```python
import random

random.seed(3)
sites = [(random.random() * 60 + 20, random.random() * 60 + 20) for _ in range(40)]

cells = voronoi_cells(sites, (0, 0, 100, 100))
print('უჯრების ფართობების ჯამი:', round(sum(area(c) for c in cells), 6))    # 10000.0

values = [0.3 * x + 0.1 * y for x, y in sites]            # სადგურების მნიშვნელობები
print('უბრალო საშუალო:   ', round(sum(values) / len(values), 3))
print('Thiessen საშუალო: ', round(thiessen_mean(values, cells), 3))
```

```text
უჯრების ფართობების ჯამი: 10000.0
უბრალო საშუალო:    21.702
Thiessen საშუალო:  20.161
```

---

## 🧰 იგივე ბიბლიოთეკებით

=== "PyQGIS"

    ```python
    # პროცესინგით: ერთ ბრძანებაში, ატრიბუტების შენახვით
    result = processing.run('native:voronoipolygons', {
        'INPUT': points_layer,
        'BUFFER': 10,                   # ბუფერი bbox-ის გარშემო (%)
        'OUTPUT': 'memory:thiessen',
    })
    QgsProject.instance().addMapLayer(result['OUTPUT'])

    # გეომეტრიით
    mp = QgsGeometry.fromMultiPointXY([QgsPointXY(x, y) for x, y in sites])
    voronoi = mp.voronoiDiagram()
    ```

=== "SciPy"

    ```python
    import numpy as np
    from scipy.spatial import Voronoi

    vor = Voronoi(np.array(sites))
    print(vor.vertices[:3])           # უჯრების წვეროები
    print(vor.regions[:3])            # -1 ნიშნავს უსასრულო უჯრას
    ```

=== "Shapely"

    ```python
    from shapely import voronoi_polygons, MultiPoint

    cells = voronoi_polygons(MultiPoint(sites))
    ```

---

## ⚠️ გეოგრაფიული გაფრთხილებები

- **ევკლიდური მანძილი.** Voronoi „ჩიტის ფრენის" მანძილზეა აგებული. რეალურ ქსელზე (გზები, მდინარეები) უახლოესი საიტი სხვა შეიძლება იყოს. მაშინ გამოიყენება [გრაფებზე](graph_algorithms.md) დაფუძნებული service area.
- **პროექცია.** წერტილები პროექციულ CRS-ში გადაიყვანეთ: გრადუსებში შუამართობი ევკლიდური არ არის.
- **საზღვრები.** უკიდურესი უჯრები უსასრულოა, ამიტომ ისინი ტერიტორიის კონტურით (მაგ. ქვეყნის საზღვრით) უნდა მოიჭრას.
- **Thiessen-ი ნალექისთვის** უმარტივესი მეთოდია, მაგრამ რთულ რელიეფზე ჩვეულებრივ უკეთეს შედეგს იძლევა ინტერპოლაცია (IDW, Kriging).

---

## 📝 დავალებები

!!! question "დავალება 1"
    შეამოწმეთ Voronoi-ს სამი თვისება: (ა) უჯრების ფართობების ჯამი bbox-ის ფართობს უდრის; (ბ) 3000 შემთხვევითი წერტილიდან ყოველი იმ უჯრაშია, რომლის საიტიც ყველაზე ახლოსაა; (გ) უჯრის ყოველი წვერო მინიმუმ ორი სხვადასხვა საიტიდან **თანაბრადაა** დაშორებული.

    ??? success "ამოხსნა"
        ```python
        def inside_convex(poly, p, eps=1e-7):
            s = [(poly[(k + 1) % len(poly)][0] - poly[k][0]) * (p[1] - poly[k][1]) -
                 (poly[(k + 1) % len(poly)][1] - poly[k][1]) * (p[0] - poly[k][0])
                 for k in range(len(poly))]
            return all(x >= -eps for x in s) or all(x <= eps for x in s)

        bbox = (0, 0, 100, 100)
        cells = voronoi_cells(sites, bbox)

        print('ა)', abs(sum(area(c) for c in cells) - 100 * 100) < 1e-6)

        ok = all(inside_convex(cells[nearest_site(p, sites)], p)
                 for p in ((random.uniform(0, 100), random.uniform(0, 100)) for _ in range(3000)))
        print('ბ)', ok)

        def equidistant_count(v):
            d = sorted(math.dist(v, s) for s in sites)
            return sum(1 for x in d if abs(x - d[0]) < 1e-6)

        interior = [v for c in cells for v in c if 1e-6 < v[0] < 100 - 1e-6 and 1e-6 < v[1] < 100 - 1e-6]
        print('გ)', all(equidistant_count(v) >= 3 for v in interior))
        ```
        გ)-ში ვამოწმებთ **შიდა** წვეროებს (bbox-ის საზღვარზე მყოფი წვეროები სხვა წარმოშობისაა): ისინი 3 საიტიდან თანაბრადაა დაშორებული.

!!! question "დავალება 2"
    ნალექის ველი `v(x, y) = 20 + 16·sin(x/17)·cos(y/11) + 10·sin((x+y)/26)` არეში `[0,100]×[0,50]` ცნობილია. სადგურები **ერთ კუთხეშია დაჯგუფებული**: 15 შემთხვევითი წერტილი `[0,40]×[0,25]`-ში და 3 `[0,100]×[0,50]`-ში. შეადარეთ უბრალო საშუალო, Thiessen-ის საშუალო და ნამდვილი საშუალო (მკვრივი ბადით).

    ??? success "ამოხსნა"
        ```python
        def v(x, y):
            return 20 + 16 * math.sin(x / 17) * math.cos(y / 11) + 10 * math.sin((x + y) / 26)

        random.seed(21)
        st = [(random.uniform(0, 40), random.uniform(0, 25)) for _ in range(15)]
        st += [(random.uniform(0, 100), random.uniform(0, 50)) for _ in range(3)]
        vals = [v(*p) for p in st]
        bb = (0, 0, 100, 50)
        cl = voronoi_cells(st, bb)

        N = 200
        truth = sum(v((i + .5) * 100 / N, (j + .5) * 50 / N) for i in range(N) for j in range(N)) / N ** 2
        print('ნამდვილი:', round(truth, 2))
        print('უბრალო:  ', round(sum(vals) / len(vals), 2))
        print('Thiessen:', round(thiessen_mean(vals, cl), 2))
        ```
        შედეგი: ნამდვილი ≈ 21.0, უბრალო ≈ 31.2, Thiessen ≈ 23.3. კუთხეში დაჯგუფებული სადგურები უბრალო საშუალოს ცდომილად „იზიდავს", Thiessen-ის წონები კი ბევრად ახლოსაა ნამდვილთან. ეს ყოველთვის ასე არ არის (მაგალითად, თუ ველი სადგურებს შორის სწრაფად იცვლება), თუმცა დაჯგუფებული სადგურებისთვის ტიპური შედეგია.

!!! question "დავალება 3"
    შეადარეთ პოლიგონური Voronoi **რასტრულ მიდგომას**: არე 200×100 პიქსელად დაყავით, თითოეულ პიქსელს მიანიჭეთ უახლოესი საიტი და პიქსელების რაოდენობა გადაიყვანეთ ფართობად. რამდენად ემთხვევა პოლიგონების ფართობებს?

    ??? success "ამოხსნა"
        ```python
        W, H = 200, 100
        count = [0] * len(sites)
        for i in range(W):
            for j in range(H):
                count[nearest_site(((i + .5) * 100 / W, (j + .5) * 100 / H), sites)] += 1
        pix_area = (100 / W) * (100 / H)
        diffs = [abs(count[k] * pix_area - area(cells[k])) for k in range(len(sites))]
        print('მაქსიმალური სხვაობა:', round(max(diffs), 2), 'საშუალო უჯრის ფართობიდან', round(100 * 100 / len(sites)))
        ```
        მაქსიმალური სხვაობა ~2 ერთეულია 250-დან (<1%). რასტრული მიდგომა მარტივია და ნებისმიერ მანძილის ფუნქციაზე მუშაობს (მაგ. ხარჯების ზედაპირზე), თუმცა მხოლოდ მიახლოებით და ბევრად ნელა.

!!! question "დავალება 4"
    დაადასტურეთ ორმაგობა კოდით: [Delaunay-ს კოდით](tin_delaunay.md) ააგეთ ტრიანგულაცია და შეამოწმეთ, რომ ყოველი სამკუთხედის შემოხაზული წრის ცენტრი Voronoi-ს რომელიმე უჯრის წვეროა.

    ??? success "ამოხსნა"
        ```python
        # გამოიყენეთ delaunay() და circumcircle() tin.py-დან
        big = (-2000, -2000, 2100, 2100)
        big_cells = voronoi_cells(sites, big)
        vertices = {(round(x, 4), round(y, 4)) for c in big_cells for x, y in c}

        centers = [circumcircle(*(sites[i] for i in t))[:2] for t in delaunay(sites)]
        found = sum((round(x, 4), round(y, 4)) in vertices for x, y in centers)
        print(found, 'სამკუთხედიდან', len(centers))
        ```
        შედეგი: `71 სამკუთხედიდან 71`. ყველა ცენტრი Voronoi-ს წვეროა.
