# 🔺 TIN და Delaunay-ს ტრიანგულაცია

რელიეფი შეიძლება ორი გზით წარმოვადგინოთ:

- **რასტრი (DEM):** სიმაღლეები რეგულარულ ბადეში. მარტივია, მაგრამ ყველგან ერთნაირი სიზუსტეა.
- **TIN** (Triangulated Irregular Network): სიმაღლის წერტილები **სამკუთხედებად** არის გაერთიანებული. სამკუთხედები ბრტყელია და მათი ზედაპირი რელიეფს მიახლოებით აღწერს. რთულ უბნებზე წერტილი მეტია, ბრტყელზე ნაკლები, ამიტომ მეხსიერებას ეკონომიურად ვხარჯავთ.

ამ გვერდზე ვიგებთ, **როგორ** აგებენ TIN-ს (Delaunay-ს ტრიანგულაცია) და როგორ ვიყენებთ მას სიმაღლის ინტერპოლაციისთვის.

---

## 💡 რატომ Delaunay?

ერთი და იგივე წერტილების გაერთიანება სამკუთხედებად ბევრი გზით შეიძლება. **Delaunay-ს ტრიანგულაცია** ერთადერთია, რომელიც ამ თვისებას აკმაყოფილებს:

> ყოველი სამკუთხედის **შემოხაზულ წრეში** სხვა წერტილი არ ხვდება.

შედეგად ის **მაქსიმალურად გაურბის ძალიან ვიწრო, „ნემსივით" სამკუთხედებს**, რადგან ისინი ინტერპოლაციას აუარესებენ. ეს თვისება **Voronoi-ს დიაგრამასთანაც** ორმაგად (dual) არის დაკავშირებული: Voronoi-ს უჯრები ის არეებია, რომლებიც თითოეულ წერტილთან უფრო ახლოსაა, ვიდრე სხვასთან, ხოლო Delaunay-ს წიბო ორ წერტილს აერთებს, თუ მათი უჯრები ერთმანეთს ეხება.

---

## 🎮 სცადეთ თქვენც

დააჭირეთ რუკაზე წერტილების დასამატებლად: ტრიანგულაცია ყოველ დამატებაზე თავიდან აიგება. გადაატარეთ მაუსი სამკუთხედზე: ჩანს მისი შემოხაზული წრე (სხვა წერტილი მასში არ ხვდება), ინტერპოლირებული სიმაღლე ნამდვილ სიმაღლესთან შედარებით, ასევე სამკუთხედის დახრილობა და ექსპოზიცია.

<iframe src="../widgets/tin.html" title="TIN და Delaunay-ს ინტერაქტიული დემო" style="width:100%;height:720px;border:0" loading="lazy"></iframe>

!!! tip "დაკვირვება"
    - სამკუთხედის ფერი მისი წვეროების საშუალო სიმაღლეა, ზუსტი მნიშვნელობა კი მხოლოდ **წერტილებზე** გვაქვს. სამკუთხედის შიგნით სიმაღლე წრფივად იცვლება, ამიტომ ინტერპოლირებული და ნამდვილი მნიშვნელობა ოდნავ განსხვავდება.
    - წერტილების დამატებით განსხვავება მცირდება.
    - დახრილობა ამ დემოში პირობითია (პიქსელები და სიმაღლის ერთეულები სხვადასხვაა), ამიტომ რიცხვი უფრო ტენდენციას აჩვენებს.

---

## ⚙️ ალგორითმი: Bowyer–Watson

წერტილებს სათითაოდ ვამატებთ:

1. დასაწყისში ავიღოთ **სუპერ-სამკუთხედი**, რომელიც ყველა წერტილს შეიცავს.
2. ახალი წერტილი `p`-სთვის ვიპოვოთ ყველა სამკუთხედი, რომლის შემოხაზულ წრეშიც `p` ხვდება. ეს „ცუდი" სამკუთხედებია.
3. „ცუდი" სამკუთხედები ერთად ქმნიან **ხვრელს**. მისი საზღვარი ის წიბოებია, რომლებიც მხოლოდ ერთ ცუდ სამკუთხედს ეკუთვნის.
4. ცუდ სამკუთხედებს ვშლით და ხვრელის თითოეულ წიბოს `p`-სთან ვაერთებთ: ახალი სამკუთხედები მიიღება.
5. ბოლოს იმ სამკუთხედებს ვშლით, რომლებიც სუპერ-სამკუთხედის წვეროს შეიცავს.

!!! info "სირთულე"
    ეს მარტივი ვერსია `O(n²)`-ია (ყოველ წერტილზე ყველა სამკუთხედს ვამოწმებთ). სივრცითი ინდექსით ([Quadtree](quadtree.md), [R-tree](spatial_indexes.md)) ის საშუალოდ `O(n log n)`-მდე იაფდება. პროფესიონალური ბიბლიოთეკები (Qhull, CGAL, GEOS) ასეთ ოპტიმიზებულ ალგორითმებს იყენებენ.

---

## 🐍 რეალიზაცია სუფთა Python-ით

```python title="tin.py" linenums="1"
import math


def circumcircle(a, b, c):
    """სამკუთხედის შემოხაზული წრე: (cx, cy, r^2)."""
    ax, ay = a
    bx, by = b
    cx, cy = c
    d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
    if d == 0:
        return None                                # კოლინეარული წერტილები
    a2, b2, c2 = ax * ax + ay * ay, bx * bx + by * by, cx * cx + cy * cy
    ux = (a2 * (by - cy) + b2 * (cy - ay) + c2 * (ay - by)) / d
    uy = (a2 * (cx - bx) + b2 * (ax - cx) + c2 * (bx - ax)) / d
    return ux, uy, (ax - ux) ** 2 + (ay - uy) ** 2


def delaunay(points):
    """Bowyer-Watson. აბრუნებს სამკუთხედებს წერტილთა ინდექსების სამეულებად."""
    n = len(points)
    xs, ys = [p[0] for p in points], [p[1] for p in points]
    mx, my = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
    d = max(max(xs) - min(xs), max(ys) - min(ys)) * 1000 or 1
    pts = list(points) + [(mx - d, my - d), (mx, my + d), (mx + d, my - d)]  # სუპერ-სამკუთხედი
    tris = {(n, n + 1, n + 2): circumcircle(pts[n], pts[n + 1], pts[n + 2])}

    for i in range(n):
        px, py = pts[i]
        bad = [t for t, cc in tris.items()
               if (px - cc[0]) ** 2 + (py - cc[1]) ** 2 < cc[2]]
        edges = {}
        for t in bad:
            for e in ((t[0], t[1]), (t[1], t[2]), (t[2], t[0])):
                key = tuple(sorted(e))
                edges[key] = edges.get(key, 0) + 1
        for t in bad:
            del tris[t]
        for (a, b), cnt in edges.items():
            if cnt == 1:                           # ხვრელის საზღვარი
                t = (a, b, i)
                cc = circumcircle(pts[a], pts[b], pts[i])
                if cc:
                    tris[t] = cc
    return [t for t in tris if max(t) < n]


def barycentric(p, a, b, c):
    """p წერტილის ბარიცენტრული კოორდინატები ABC სამკუთხედში."""
    det = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1])
    l1 = ((b[1] - c[1]) * (p[0] - c[0]) + (c[0] - b[0]) * (p[1] - c[1])) / det
    l2 = ((c[1] - a[1]) * (p[0] - c[0]) + (a[0] - c[0]) * (p[1] - c[1])) / det
    return l1, l2, 1 - l1 - l2


def interpolate(p, tin_pts, z, triangles):
    """სიმაღლე p წერტილში TIN-ის წრფივი ინტერპოლაციით (ან None)."""
    for i, j, k in triangles:
        l1, l2, l3 = barycentric(p, tin_pts[i], tin_pts[j], tin_pts[k])
        if min(l1, l2, l3) >= -1e-12:
            return l1 * z[i] + l2 * z[j] + l3 * z[k]
    return None


def slope_aspect(a, b, c, za, zb, zc):
    """სამკუთხედის დახრილობა და ექსპოზიცია გრადუსებში."""
    ux, uy, uz = b[0] - a[0], b[1] - a[1], zb - za
    vx, vy, vz = c[0] - a[0], c[1] - a[1], zc - za
    nx, ny, nz = uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx
    if nz < 0:
        nx, ny, nz = -nx, -ny, -nz
    slope = math.degrees(math.atan2(math.hypot(nx, ny), nz))
    aspect = (math.degrees(math.atan2(nx, ny)) + 360) % 360   # 0 = ჩრდილოეთი, საათის ისრის მიმართულებით
    return slope, aspect
```

### გამოყენება და შემოწმება

```python
import random

random.seed(7)
pts = [(random.random() * 100, random.random() * 100) for _ in range(300)]
triangles = delaunay(pts)
print(len(pts), 'წერტილი ->', len(triangles), 'სამკუთხედი')

# სიმაღლეები: სიბრტყე z = 0.5x + 0.2y, ამიტომ ინტერპოლაცია ზუსტი უნდა იყოს
z = [0.5 * x + 0.2 * y for x, y in pts]
print(interpolate((50, 50), pts, z, triangles))        # 35.0 (+ დამრგვალება)
print(slope_aspect((0, 0), (1, 0), (0, 1), 0, 0, 1))   # (45.0, 180.0)
```

!!! info "სამკუთხედების რაოდენობა"
    `n` წერტილისა და `h` ამოზნექილი გარსის წვეროსთვის Delaunay-ს ტრიანგულაცია ზუსტად `2n - 2 - h` სამკუთხედს შეიცავს. ეს ფორმულა კარგი შემოწმებაა: ჩვენი კოდი 20 შემთხვევით ნაკრებზე ყოველთვის ამ რიცხვს იძლევა.

---

## 🧰 იგივე ბიბლიოთეკებით

=== "PyQGIS"

    ```python
    from qgis.core import QgsGeometry, QgsPointXY

    pts = [QgsPointXY(x, y) for x, y in points]
    mp = QgsGeometry.fromMultiPointXY(pts)
    tin = mp.delaunayTriangulation(0.0, False)     # მულტიპოლიგონი სამკუთხედებით
    voronoi = mp.voronoiDiagram()                  # ორმაგი დიაგრამა
    print(tin.asGeometryCollection().__len__())
    ```

=== "SciPy"

    ```python
    import numpy as np
    from scipy.spatial import Delaunay

    tri = Delaunay(np.array(pts))
    print(len(tri.simplices))        # სამკუთხედების რაოდენობა
    ```

=== "GEOS / Shapely"

    ```python
    from shapely import delaunay_triangles, MultiPoint

    tin = delaunay_triangles(MultiPoint(pts))
    ```

---

## 📝 დავალებები

!!! question "დავალება 1"
    დაწერეთ ფუნქცია, რომელიც ამოწმებს, რომ `delaunay()`-ის შედეგი ნამდვილად აკმაყოფილებს Delaunay-ს თვისებას: არც ერთი წერტილი არც ერთი სამკუთხედის შემოხაზულ წრეში არ ხვდება. შეამოწმეთ ის 10 შემთხვევით ნაკრებზე.

    ??? success "ამოხსნა"
        ```python
        def is_delaunay(pts, triangles, eps=1e-9):
            for t in triangles:
                cx, cy, r2 = circumcircle(*(pts[i] for i in t))
                for j, p in enumerate(pts):
                    if j not in t and (p[0] - cx) ** 2 + (p[1] - cy) ** 2 < r2 - eps:
                        return False
            return True

        for seed in range(10):
            random.seed(seed)
            P = [(random.random() * 100, random.random() * 100) for _ in range(150)]
            print(seed, is_delaunay(P, delaunay(P)))
        ```

!!! question "დავალება 2"
    ააგეთ 50×50 უჯრიანი რასტრი TIN-იდან (ინტერპოლაციით) რელიეფზე `z = 50 + 20·sin(x/15) + 15·cos(y/12)` და გამოთვალეთ ნამდვილთან **საშუალო კვადრატული გადახრა** (RMSE) 30, 100 და 400 წერტილის შემთხვევაში.

    ??? success "ამოხსნა"
        ```python
        import math

        def surface(x, y):
            return 50 + 20 * math.sin(x / 15) + 15 * math.cos(y / 12)

        def rmse(n_points):
            random.seed(1)
            P = [(random.random() * 100, random.random() * 100) for _ in range(n_points)]
            Z = [surface(*p) for p in P]
            T = delaunay(P)
            errs = []
            for i in range(50):
                for j in range(50):
                    q = (10 + i * 80 / 49, 10 + j * 80 / 49)     # ცენტრალური ნაწილი
                    v = interpolate(q, P, Z, T)
                    if v is not None:
                        errs.append((v - surface(*q)) ** 2)
            return math.sqrt(sum(errs) / len(errs))

        for n in (30, 100, 400):
            print(n, round(rmse(n), 3))
        ```
        წერტილების რაოდენობის ზრდასთან ერთად RMSE მცირდება.

!!! question "დავალება 3"
    სიბრტყისთვის `z = 0.5x + 0.2y` გამოთვალეთ ყველა სამკუთხედის დახრილობა და ექსპოზიცია. რა მნიშვნელობა უნდა მიიღოთ და რატომ ერთნაირია ყველა სამკუთხედზე?

    ??? success "ამოხსნა"
        ```python
        random.seed(2)
        P = [(random.random() * 100, random.random() * 100) for _ in range(100)]
        Z = [0.5 * x + 0.2 * y for x, y in P]
        results = {(round(s, 3), round(a, 3))
                   for i, j, k in delaunay(P)
                   for s, a in [slope_aspect(P[i], P[j], P[k], Z[i], Z[j], Z[k])]}
        print(results)
        print(math.degrees(math.atan(math.hypot(0.5, 0.2))))
        ```
        ყველა სამკუთხედი ერთ სიბრტყეზე დევს, ამიტომ დახრილობა ყველგან `atan(√(0.5²+0.2²)) ≈ 28.3°`-ია, ექსპოზიცია კი ≈ 248° (სამხრეთ-დასავლეთი, ანუ დაქანება `+x, +y` გრადიენტის საპირისპირო მხარეს არის).
