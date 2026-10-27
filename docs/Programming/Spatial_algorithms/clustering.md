# 🧩 კლასტერიზაცია: DBSCAN და k-means

**კლასტერიზაცია** წერტილთა სიმრავლეს ჯგუფებად ყოფს ისე, რომ ერთი ჯგუფის წევრები ერთმანეთთან უფრო ახლოა, ვიდრე სხვა ჯგუფებთან. GIS-ში ამას იყენებენ დანაშაულის „ცხელი წერტილების" პოვნაში, ავარიების ჯგუფებში, ცხოველთა მოძრაობის გაჩერების ადგილების გამოყოფაში, რუკაზე ათასობით მარკერის გაერთიანებაში (ზომის მიხედვით ჯგუფები) და მომხმარებელთა სერვისის ზონებად დაყოფაში.

ორი ძირითადი იდეა ორ სხვადასხვა კითხვას პასუხობს:

| | **k-means** | **DBSCAN** |
|---|---|---|
| კითხვა | „დავყოთ მონაცემები `k` ჯგუფად" | „სად არის წერტილები **მჭიდროდ**?" |
| კლასტერების რაოდენობა | წინასწარ უნდა ვიცოდეთ (`k`) | თავად პოულობს |
| ფორმა | მრგვალი, ცენტრის გარშემო | ნებისმიერი |
| ხმაური | ყოველ წერტილს რომელიმე ჯგუფში აგდებს | გამოყოფს ხმაურად |
| პარამეტრი | `k` | `ε` (რადიუსი) და `minPts` |

---

## 🎮 სცადეთ თქვენც

გადართეთ მონაცემები **„მთვარეებზე"** და ორივე ალგორითმი სცადეთ: k-means ორი ნახევარმთვარის ნაცვლად სივრცეს „ორად ჭრის", DBSCAN კი ორივე მთვარეს ზუსტად პოულობს. **„ქალაქები + ხმაური"** სხვადასხვა სიმჭიდროვის სამ ჯგუფს და გაფანტულ წერტილებს შეიცავს.

<iframe src="../widgets/clustering.html" title="კლასტერიზაციის ინტერაქტიული დემო" style="width:100%;height:760px;border:0" loading="lazy"></iframe>

!!! tip "დაკვირვება"
    - **DBSCAN, ε მცირეა**: ყველაფერი ხმაურია, ან ბევრი წვრილი ჯგუფი. **ε დიდია**: ახლო ჯგუფები ერთიანდება.
    - **k-means, „ახალი ცენტრები"**: ერთსა და იმავე მონაცემებზე სხვადასხვა საწყისი ცენტრიდან განსხვავებული შედეგი შეიძლება მიიღოთ (ლოკალური მინიმუმი). ამიტომ k-means-ს რამდენჯერმე უშვებენ და საუკეთესოს ირჩევენ.
    - **„ბლობებზე"** k-means შესანიშნავია, **„მთვარეებზე"** კი ვერ იმუშავებს: მისი ჯგუფები ყოველთვის ამოზნექილია.

---

## ⚙️ DBSCAN: სიმჭიდროვით დაკავშირებული წერტილები

ორი პარამეტრი: რადიუსი `ε` და `minPts`. ყოველ წერტილს ერთ-ერთ სამ როლს ვანიჭებთ:

- **ბირთვული**: მისი `ε`-მეზობლობაში (თავის ჩათვლით) მინიმუმ `minPts` წერტილია.
- **საზღვრის**: ბირთვული არ არის, მაგრამ რომელიმე ბირთვულის `ε`-მეზობლობაშია.
- **ხმაური**: არც ერთი.

კლასტერი ყალიბდება **ბირთვული წერტილების ჯაჭვით**: ბირთვულიდან ვფართოვდებით ყველა მეზობელზე და თუ ის ისევ ბირთვულია, მისი მეზობლებიც ემატება.

ყველაზე ხარჯიანი ნაწილი მეზობლების პოვნაა. გულუბრყვილოდ `O(n)` ყოველი წერტილისთვის, ანუ `O(n²)` სულ. ჩვენ [ბადეს](grids_hex.md) (უჯრის ზომა `ε`) ვიყენებთ: წერტილის მეზობლები მხოლოდ მის უჯრასა და 8 მეზობელ უჯრაშია. ეს იგივე იდეაა, რაც [სივრცით ინდექსებში](spatial_indexes.md), და საშუალოდ `O(n)`-მდე ამცირებს ძებნას, როცა წერტილები ბადეზე თანაბრად არის განაწილებული.

## ⚙️ k-means: ცენტრების მიდგომა

1. აირჩიეთ `k` საწყისი ცენტრი.
2. **მინიჭება**: ყოველი წერტილი მიაკუთვნეთ უახლოეს ცენტრს (ეს სიბრტყის [Voronoi](voronoi.md)-ზე დაყოფაა).
3. **განახლება**: ყოველი ცენტრი გადაიტანეთ მისი წევრების საშუალოში.
4. გაიმეორეთ, სანამ მინიჭება არ შეწყდება ცვლილებით.

ყოველი ბიჯი **ამცირებს** `inertia = Σ d²`-ს (წერტილებიდან თავიანთ ცენტრებამდე მანძილების კვადრატთა ჯამს), ამიტომ ალგორითმი აუცილებლად ჩერდება, თუმცა მხოლოდ **ლოკალურ** მინიმუმზე. **k-means++** ინიციალიზაცია ახალ ცენტრს ირჩევს უკვე არჩეულებიდან მანძილის კვადრატის პროპორციული ალბათობით, რაც ცენტრებს ერთმანეთისგან შორს ამყარებს და ცუდი შედეგის შანსს ამცირებს.

---

## 🐍 რეალიზაცია სუფთა Python-ით

```python title="clus.py" linenums="1"
import math
import random
from collections import defaultdict, deque

NOISE = -1


def dbscan(points, eps, min_pts):
    """DBSCAN. აბრუნებს ეტიკეტების სიას: 0, 1, 2, ... ან NOISE (-1)."""
    grid = defaultdict(list)                       # ბადე უჯრით eps: მეზობლებს მხოლოდ 3x3 უჯრაში ვეძებთ
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

    labels = [None] * len(points)                  # None = ჯერ არ ვნახეთ
    cluster = -1
    for i in range(len(points)):
        if labels[i] is not None:
            continue
        nb = neighbors(i)
        if len(nb) < min_pts:
            labels[i] = NOISE                      # შეიძლება მოგვიანებით საზღვრად იქცეს
            continue
        cluster += 1
        labels[i] = cluster
        queue = deque(nb)
        while queue:
            j = queue.popleft()
            if labels[j] == NOISE:
                labels[j] = cluster                # საზღვრის წერტილი
            if labels[j] is not None:
                continue
            labels[j] = cluster
            nb_j = neighbors(j)
            if len(nb_j) >= min_pts:               # j ბირთვია: გავაგრძელოთ გაფართოება
                queue.extend(nb_j)
    return labels


def kmeans(points, k, centers=None, seed=0, max_iter=100):
    """Lloyd-ის ალგორითმი k-means++ ინიციალიზაციით. აბრუნებს (ეტიკეტები, ცენტრები, inertia)."""
    rnd = random.Random(seed)
    d2 = lambda a, b: (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2
    if centers is None:                            # k-means++: ახალი ცენტრი d²-ის პროპორციული ალბათობით
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

### გამოყენება

```python
import math
import random
from clus import *

random.seed(4)
# ორი „მთვარე" + 30 შემთხვევითი წერტილი ხმაურად
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
print('DBSCAN კლასტერები:', len(set(db) - {NOISE}), ', ხმაური:', db.count(NOISE))
km, centers, inertia = kmeans(points, k=2, seed=1)
print('k-means ცენტრები:', [tuple(round(v, 1) for v in c) for c in centers])
```

```text
DBSCAN კლასტერები: 2 , ხმაური: 14
k-means ცენტრები: [(12.1, -0.8), (-1.3, 5.0)]
```

!!! success "შემოწმება"
    ჩვენი DBSCAN და k-means შედარებულია **scikit-learn 1.6**-თან. DBSCAN-ის ეტიკეტები სამ განსხვავებულ `(ε, minPts)` წყვილზე სრულად ემთხვევა (კორექტირებული Rand-ის ინდექსი = 1.0, ხმაურის წერტილებიც ერთნაირია). k-means ერთნაირი საწყისი ცენტრებიდან იგივე ცენტრებსა და inertia-ს იძლევა (1743.2 ამ გვერდის 4 ბლობიან მონაცემზე). საუკეთესო inertia ათ გაშვებაში `k = 1…6`-ზე `KMeans(n_init=10)`-ს ემთხვევა, `k = 7` და `8`-ზე კი scikit-learn ოდნავ უკეთესია (1188.6 vs 1228.9 და 1073.4 vs 1106.0), რადგან ლოკალური მინიმუმები საწყისი ცენტრებიდან გამომდინარე განსხვავდება. JavaScript-ის ვერსია, რომელიც დემოშია, იგივე ეტიკეტებს აბრუნებს, რასაც Python.

---

## 📚 იგივე ბიბლიოთეკით

=== "scikit-learn"

    ```python
    import numpy as np
    from sklearn.cluster import DBSCAN, KMeans

    X = np.array(points)
    db_labels = DBSCAN(eps=1.8, min_samples=6).fit_predict(X)      # -1 = ხმაური
    km = KMeans(n_clusters=2, n_init=10, random_state=0).fit(X)
    ```

    `min_samples` იგივეა, რაც ჩვენი `min_pts` (წერტილი თავისი თავითაა გათვლილი).

=== "QGIS (PyQGIS)"

    ```python
    import processing

    processing.run('native:dbscanclustering', {
        'INPUT': points_layer, 'MIN_SIZE': 6, 'EPS': 250,
        'DBSCAN*': False, 'FIELD_NAME': 'CLUSTER_ID', 'SIZE_FIELD_NAME': 'CLUSTER_SIZE',
        'OUTPUT': 'clusters.gpkg'})
    ```

!!! warning "რა არის შემოწმებული"
    scikit-learn-თან შედარება გავუშვი. QGIS-ის ფრაგმენტი **არ გამიშვია** (QGIS არ არის დაყენებული), ამიტომ პარამეტრების სახელები დოკუმენტაციასთან შეამოწმეთ. `EPS` QGIS-ში ფენის კოორდინატთა სისტემის ერთეულებშია, ამიტომ გეოგრაფიულ (გრადუსულ) ფენაზე იხილეთ დავალება 4.

---

## ✍️ დავალებები

!!! question "დავალება 1: რომელი ალგორითმი უფრო ზუსტია მთვარეებზე?"
    გამოთვალეთ ორივე მეთოდის **სისუფთავე** (purity): ყოველი კლასტერისთვის აიღეთ მისი უმრავლესი ნამდვილი კლასი და დათვალეთ რამდენი წერტილი ემთხვევა. ხმაური შეცდომად ჩათვალეთ. გამოიყენეთ მხოლოდ 300 „მთვარის" წერტილი (ხმაურის გარეშე).

    ??? success "ამოხსნა"
        ```python
        from collections import Counter


        def purity(truth, labels):
            ok = 0
            for l in set(labels) - {NOISE}:
                ok += Counter(t for t, x in zip(truth, labels) if x == l).most_common(1)[0][1]
            return ok / len(truth)


        db = dbscan(moons, 1.8, 6)
        km, _, _ = kmeans(moons, 2, seed=1)
        print('DBSCAN სისუფთავე', round(purity(truth, db), 3), '| k-means', round(purity(truth, km), 3))
        ```
        ```text
        DBSCAN სისუფთავე 1.0 | k-means 0.733
        ```
        k-means „ხვრეტს" მთვარეებს სწორხაზოვანი საზღვრით, რადგან კლასტერებს ცენტრთან მანძილით განსაზღვრავს. 27% წერტილი არასწორ ჯგუფშია. DBSCAN-ს ფორმა არ აინტერესებს, მხოლოდ სიმჭიდროვე.

!!! question "დავალება 2: რამდენი ჯგუფია? (იდეა: inertia-ს „იდაყვი")"
    გამოთვალეთ საუკეთესო inertia (ათ გაშვებაში) `k = 1…8`-ზე 4 ბლობიან მონაცემებზე (ქვემოთაა დაგენერირება) და მოძებნეთ `k`, რომლის შემდეგაც ვარდნა მკვეთრად შენელდება (**„იდაყვის"** წესი).

    ??? success "ამოხსნა"
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
        `k = 3`-დან `4`-ზე inertia 6455-დან 1743-მდე (−73%) ეცემა, `4 → 5` კი მხოლოდ 1743-დან 1542-მდე (−12%). იდაყვი `k = 4`-ზეა, რაც ზუსტად ბლობების ნამდვილი რაოდენობაა. ყოველთვის ასე მკაფიო არ არის: რეალურ მონაცემებზე იდაყვი ხშირად გაურკვეველია და დამატებით **silhouette**-ს ან გეგმის ლოგიკას ეყრდნობიან.

!!! question "დავალება 3: რამდენად მგრძნობიარეა DBSCAN ε-ზე?"
    გაუშვით DBSCAN მთვარეებზე (`min_pts = 6`) `ε = 0.4, 0.8, 1.2, 1.8, 3.0`-ზე და დათვალეთ კლასტერები და ხმაური.

    ??? success "ამოხსნა"
        ```python
        for eps in (0.4, 0.8, 1.2, 1.8, 3.0):
            lab = dbscan(moons, eps, 6)
            print(f'eps={eps}: კლასტერი {len(set(lab) - {NOISE})}, ხმაური {lab.count(NOISE)}')
        ```
        ```text
        eps=0.4: კლასტერი 0, ხმაური 300
        eps=0.8: კლასტერი 17, ხმაური 93
        eps=1.2: კლასტერი 8, ხმაური 9
        eps=1.8: კლასტერი 2, ხმაური 0
        eps=3.0: კლასტერი 2, ხმაური 0
        ```
        ძალიან მცირე `ε`-ზე ყველაფერი ხმაურია, მცირეზე მთვარეები ნაწილებად იშლება, მისაღებ ფარგლებში (1.8–3.0) კი შედეგი სტაბილურია. `ε`-ს ხშირად ირჩევენ **k-distance გრაფიკით**: თითოეული წერტილისთვის `minPts`-ურ უახლოეს მეზობლამდე მანძილს ალაგებენ ზრდადობით და „მუხლის" ადგილას იღებენ `ε`-ს.

        ეს DBSCAN-ის ცნობილი სუსტი მხარეა: **ერთი `ε` ყველა კლასტერისთვის**. თუ ჯგუფები სხვადასხვა სიმჭიდროვისაა (როგორც დემოს „ქალაქები" მონაცემებშია), ერთი `ε` ან მკვრივს გაყოფს, ან მეჩხერს ხმაურად გამოაცხადებს. ამ შემთხვევისთვის არსებობს **HDBSCAN**/**OPTICS**.

!!! question "დავალება 4: გრადუსები თუ მეტრები?"
    გვაქვს წერტილები თბილისის ირგვლივ (`lon, lat` გრადუსებში). `ε = 0.003°` გამოიყურება ჩვეულებრივ არჩევანად, მაგრამ რამდენ მეტრს უდრის სხვადასხვა მიმართულებით? შეადარეთ `ε = 0.003°` (გრადუსებში) და `ε = 250 მ` (მეტრებში გადაყვანის შემდეგ): რამდენი წერტილის წყვილი ითვლება მეზობლად?

    ??? success "ამოხსნა"
        ```python
        import math

        random.seed(21)
        lon0, lat0 = 44.80, 41.72
        M_LAT, M_LON = 110574, 111320 * math.cos(math.radians(lat0))      # მეტრი ერთ გრადუსზე
        centers_m = [(0, 0), (1800, 600), (-1200, 1500)]
        geo = [(lon0 + (cx + random.gauss(0, 120)) / M_LON, lat0 + (cy + random.gauss(0, 120)) / M_LAT)
               for cx, cy in centers_m for _ in range(120)]
        geo += [(lon0 + random.uniform(-0.04, 0.05), lat0 + random.uniform(-0.02, 0.03)) for _ in range(40)]
        proj = [((x - lon0) * M_LON, (y - lat0) * M_LAT) for x, y in geo]

        print('0.003° =', round(0.003 * M_LON), 'მ (აღმოსავლეთით) და', round(0.003 * M_LAT), 'მ (ჩრდილოეთით)')
        n = len(geo)
        pd_ = pm = 0
        for i in range(n):
            for j in range(i + 1, n):
                pd_ += math.dist(geo[i], geo[j]) <= 0.003
                pm += math.dist(proj[i], proj[j]) <= 250
        print('წყვილები ε-ში:', pd_, '(გრადუსი),', pm, '(მეტრი)')
        ```
        ```text
        0.003° = 249 მ (აღმოსავლეთით) და 332 მ (ჩრდილოეთით)
        წყვილები ε-ში: 16431 (გრადუსი), 14320 (მეტრი)
        ```
        გრადუსებში `ε` სინამდვილეში **ელიფსია** (249 × 332 მ) და მეზობლად 15%-ით მეტ წყვილს თვლის, ვიდრე წრიული 250 მეტრი. ამ მონაცემებზე კლასტერების რაოდენობა ორივეგან 3 გამოვიდა, მაგრამ მკვრივ ქალაქში მიმართულებით სხვაობა გავლენას იქონიებს. წესი: **გარდაქმენით კოორდინატები მეტრულ სისტემაში** (UTM, ან საქართველოსთვის EPSG:32638) ან გამოიყენეთ ჰავერსინის მანძილი.
