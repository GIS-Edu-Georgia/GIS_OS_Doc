# 🛣️ გრაფები და უმოკლესი გზა: Dijkstra და A*

ნავიგაციის აპლიკაცია, მარშრუტის გამოთვლა QGIS-ში, ქსელური ანალიზი: ყველგან **გრაფზე** უმოკლესი გზის პოვნას ვაკეთებთ. გრაფი არის **კვანძების** (გზაჯვარედინები, ქალაქები, უჯრები) და **წიბოების** (გზის მონაკვეთები) სიმრავლე, სადაც თითო წიბოს აქვს **წონა** (მანძილი, დრო, ხარჯი).

---

## 🎮 სცადეთ თქვენც

გადაათრიეთ მაუსი კედლების დასახატად, გადაიტანეთ საწყისი და მიზანი წერტილები, ჩართეთ „რელიეფი" (ზოგი უჯრა ძვირია) და შეადარეთ სამი ალგორითმი. ლურჯი უჯრები ის არის, რასაც ალგორითმმა **შეამოწმა**, წითელი ხაზი კი ნაპოვნი გზაა.

<iframe src="../widgets/pathfinding.html" title="Dijkstra, A* და Greedy-ს ინტერაქტიული დემო" style="width:100%;height:700px;border:0" loading="lazy"></iframe>

!!! tip "დაკვირვება"
    - **Dijkstra** ყველა მიმართულებით თანაბრად ფართოვდება და ბევრ უჯრას ამოწმებს.
    - **A\*** „გრძნობს" მიზნის მიმართულებას და გაცილებით ნაკლებს ამოწმებს, თუმცა იგივე ზუსტ, ოპტიმალურ გზას პოულობს.
    - **Greedy** (მხოლოდ მიზნამდე დარჩენილი მანძილით) სწრაფია, მაგრამ გზა **შეიძლება არ იყოს უმოკლესი**: ააგეთ „ჯიბე" კედლებისგან და ნახეთ.
    - ჩართეთ „რელიეფი": გზა მუქ (ძვირ) უჯრებს გვერდს უვლის, A*-ის უპირატესობა კი მცირდება, რადგან ევრისტიკა ხარჯს ვერ ითვალისწინებს.

---

## ⚙️ ალგორითმები

### Dijkstra

1. საწყის კვანძს მანძილი `0` აქვს, ყველა დანარჩენს `∞`.
2. პრიორიტეტული რიგიდან ვიღებთ კვანძს **ყველაზე მცირე მანძილით**.
3. მის ყოველ მეზობელზე ვამოწმებთ, ხომ არ გაგვიმოკლდა გზა ამ კვანძის გავლით (**relaxation**). თუ გაგვიმოკლდა, ვანახლებთ და რიგში ვამატებთ.
4. ვიმეორებთ, სანამ მიზანს არ ამოვიღებთ რიგიდან. ამ მომენტში მისი მანძილი **საბოლოოა** (წონები უარყოფითი არ უნდა იყოს).

### A*

იგივეა, მაგრამ რიგში კვანძებს ვალაგებთ `f(v) = g(v) + h(v)`-ით:

- `g(v)` — უკვე გავლილი გზა საწყისიდან `v`-მდე.
- `h(v)` — **ევრისტიკა**: შეფასება, რამდენი დარჩა `v`-დან მიზნამდე (მაგ. პირდაპირი მანძილი).

!!! warning "ევრისტიკა არ უნდა გადააჭარბოს რეალურ მანძილს"
    A* ოპტიმალურ გზას იძლევა, თუ `h` **დასაშვებია (admissible)**: ის არასოდეს აჭარბებს რეალურ დარჩენილ ხარჯს. პირდაპირი მანძილი ამ პირობას ყოველთვის აკმაყოფილებს (პირდაპირი გზა ყველაზე მოკლეა), ამიტომ A* გეოგრაფიულ ქსელებში ბუნებრივი არჩევანია. თუ `h`-ს გავზრდით (მაგ. ×3), A* უფრო სწრაფი ხდება, მაგრამ გზა შეიძლება აღარ იყოს ოპტიმალური.

!!! info "სირთულე"
    ბინარული გროვით (`heapq`) Dijkstra არის `O((V + E) log V)`. A* უარეს შემთხვევაში იგივეა, პრაქტიკაში კი ევრისტიკა ძებნას მნიშვნელოვნად ამცირებს. რეალურ საგზაო ქსელებზე (მილიონობით კვანძი) ამ ბაზაზე იყენებენ უფრო დახვეწილ ტექნიკებს, მაგ. Contraction Hierarchies.

---

## 🐍 რეალიზაცია სუფთა Python-ით

```python title="graphs.py" linenums="1"
import heapq
import math


def dijkstra(graph, start, goal=None):
    """graph = {კვანძი: [(მეზობელი, წონა), ...]}.
    აბრუნებს (dist, prev, expanded)."""
    dist = {start: 0}
    prev = {}
    heap = [(0, start)]
    done = set()
    while heap:
        d, u = heapq.heappop(heap)
        if u in done:
            continue                               # მოძველებული ჩანაწერი
        done.add(u)
        if u == goal:
            break
        for v, w in graph[u]:
            nd = d + w
            if nd < dist.get(v, math.inf):
                dist[v] = nd
                prev[v] = u
                heapq.heappush(heap, (nd, v))
    return dist, prev, done


def astar(graph, start, goal, h):
    """A*: იგივეა, მაგრამ რიგში f = g + h(v) მიხედვით ვალაგებთ."""
    g = {start: 0}
    prev = {}
    heap = [(h(start), start)]
    done = set()
    while heap:
        _, u = heapq.heappop(heap)
        if u in done:
            continue
        done.add(u)
        if u == goal:
            break
        for v, w in graph[u]:
            ng = g[u] + w
            if ng < g.get(v, math.inf):
                g[v] = ng
                prev[v] = u
                heapq.heappush(heap, (ng + h(v), v))
    return g, prev, done


def path_to(prev, start, goal):
    if goal != start and goal not in prev:
        return None                                # მიუწვდომელია
    path = [goal]
    while path[-1] != start:
        path.append(prev[path[-1]])
    return path[::-1]


def haversine(a, b):
    """მანძილი კმ-ში ორ (lat, lon) წერტილს შორის."""
    la1, lo1, la2, lo2 = map(math.radians, (*a, *b))
    x = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 2 * 6371.0088 * math.asin(math.sqrt(x))


def grid_graph(cost):
    """ხარჯების ბადე (None = დაბრკოლება) -> გრაფი 8 მეზობლით."""
    rows, cols = len(cost), len(cost[0])
    graph = {}
    for r in range(rows):
        for c in range(cols):
            if cost[r][c] is None:
                continue
            nbrs = []
            for dr in (-1, 0, 1):
                for dc in (-1, 0, 1):
                    if dr == dc == 0:
                        continue
                    rr, cc = r + dr, c + dc
                    if 0 <= rr < rows and 0 <= cc < cols and cost[rr][cc] is not None:
                        if dr and dc and (cost[r][cc] is None or cost[rr][c] is None):
                            continue                  # კუთხის გადაჭრა კედლის გავლით აკრძალულია
                        step = math.sqrt(2) if dr and dc else 1
                        nbrs.append(((rr, cc), step * (cost[r][c] + cost[rr][cc]) / 2))
            graph[(r, c)] = nbrs
    return graph
```

### გამოყენება: საქართველოს ქალაქები

!!! note "ილუსტრაციული მონაცემი"
    ქალაქების კოორდინატები მიახლოებითია, წიბოები კი **გამარტივებული ქსელია** და ზუსტ საგზაო რუკას არ ასახავს. გზის სიგრძე ტოლია პირდაპირი მანძილისა გამრავლებული 1.3-ზე (გზის დახვეულობის მიახლოებითი კოეფიციენტი).

```python
cities = {
    'თბილისი': (41.7151, 44.8271), 'რუსთავი': (41.5495, 45.0069), 'გორი': (41.9842, 44.1158),
    'ხაშური': (41.9944, 43.5983), 'ბორჯომი': (41.8396, 43.3892), 'ახალციხე': (41.6392, 42.9822),
    'ქუთაისი': (42.2679, 42.6946), 'სამტრედია': (42.1544, 42.3350), 'ფოთი': (42.1462, 41.6719),
    'ზუგდიდი': (42.5088, 41.8709), 'ბათუმი': (41.6168, 41.6367), 'თელავი': (41.9198, 45.4735),
}
roads = [('თბილისი', 'რუსთავი'), ('თბილისი', 'გორი'), ('გორი', 'ხაშური'), ('ხაშური', 'ქუთაისი'),
         ('ხაშური', 'ბორჯომი'), ('ბორჯომი', 'ახალციხე'), ('ქუთაისი', 'სამტრედია'),
         ('სამტრედია', 'ფოთი'), ('სამტრედია', 'ზუგდიდი'), ('ფოთი', 'ზუგდიდი'),
         ('სამტრედია', 'ბათუმი'), ('ფოთი', 'ბათუმი'), ('თბილისი', 'თელავი'), ('ახალციხე', 'ბათუმი')]

def build_graph(roads):
    graph = {c: [] for c in cities}
    for a, b in roads:
        w = 1.3 * haversine(cities[a], cities[b])
        graph[a].append((b, w))
        graph[b].append((a, w))
    return graph

graph = build_graph(roads)
goal = 'ბათუმი'
h = lambda n: 1.3 * haversine(cities[n], cities[goal])

dist, prev, expanded = dijkstra(graph, 'თბილისი', goal)
print('Dijkstra:', round(dist[goal], 1), 'კმ,', len(expanded), 'კვანძი შემოწმდა')
print(' -> '.join(path_to(prev, 'თბილისი', goal)))

g, prev2, expanded2 = astar(graph, 'თბილისი', goal, h)
print('A*:      ', round(g[goal], 1), 'კმ,', len(expanded2), 'კვანძი შემოწმდა')
```

```text
Dijkstra: 371.3 კმ, 12 კვანძი შემოწმდა
თბილისი -> გორი -> ხაშური -> ბორჯომი -> ახალციხე -> ბათუმი
A*:       371.3 კმ, 6 კვანძი შემოწმდა
```

---

## 🧰 იგივე PyQGIS-ით

QGIS-ში გზების შრიდან უმოკლესი გზა ერთი ბრძანებითაც იძებნება (იგი შიგნით ამავე ალგორითმებს იყენებს):

```python
result = processing.run('native:shortestpathpointtopoint', {
    'INPUT': roads_layer,                       # ხაზოვანი შრე
    'STRATEGY': 0,                              # 0 = უმოკლესი, 1 = უსწრაფესი
    'DEFAULT_DIRECTION': 2,                     # 2 = ორმხრივი
    'START_POINT': '44.8271,41.7151 [EPSG:4326]',
    'END_POINT': '41.6367,41.6168 [EPSG:4326]',
    'TOLERANCE': 0.001,
    'OUTPUT': 'memory:route',
})
QgsProject.instance().addMapLayer(result['OUTPUT'])
```

=== "NetworkX"

    ```python
    import networkx as nx

    G = nx.Graph()
    for a, b in roads:
        G.add_edge(a, b, weight=1.3 * haversine(cities[a], cities[b]))
    print(nx.shortest_path(G, 'თბილისი', 'ბათუმი', weight='weight'))
    print(nx.astar_path(G, 'თბილისი', 'ბათუმი', heuristic=lambda a, b: 1.3 * haversine(cities[a], cities[b]), weight='weight'))
    ```

=== "OSMnx"

    ```python
    import osmnx as ox

    G = ox.graph_from_place('Tbilisi, Georgia', network_type='drive')
    orig = ox.nearest_nodes(G, 44.80, 41.71)
    dest = ox.nearest_nodes(G, 44.78, 41.73)
    route = ox.shortest_path(G, orig, dest, weight='length')
    ```

---

## 📝 დავალებები

!!! question "დავალება 1"
    შეადარეთ Dijkstra და A* ყველა წყვილზე „თბილისი → სხვა ქალაქი": რამდენ კვანძს ამოწმებს თითოეული და ემთხვევა თუ არა ბილიკის სიგრძე.

    ??? success "ამოხსნა"
        ```python
        print('მიზანი        Dijkstra  A*   სიგრძე ემთხვევა')
        for goal in cities:
            if goal == 'თბილისი':
                continue
            d, _, e1 = dijkstra(graph, 'თბილისი', goal)
            hh = lambda n, goal=goal: 1.3 * haversine(cities[n], cities[goal])
            g, _, e2 = astar(graph, 'თბილისი', goal, hh)
            print(f'{goal:<12} {len(e1):>8} {len(e2):>4}   {abs(d[goal] - g[goal]) < 1e-9}')
        ```
        სიგრძე ყოველთვის ემთხვევა, A* კი ან იმავეს, ან ხშირად გაცილებით ნაკლებ კვანძს ამოწმებს (ბათუმისთვის 12-ის ნაცვლად 6-ს).

!!! question "დავალება 2"
    დახურეთ გზა ახალციხე–ბათუმი და გამოთვალეთ ახალი გზა თბილისიდან ბათუმამდე. რამდენით გაიზარდა სიგრძე?

    ??? success "ამოხსნა"
        ```python
        closed = [r for r in roads if set(r) != {'ახალციხე', 'ბათუმი'}]
        graph2 = build_graph(closed)
        d2, p2, _ = dijkstra(graph2, 'თბილისი', 'ბათუმი')
        print(' -> '.join(path_to(p2, 'თბილისი', 'ბათუმი')))
        print(round(d2['ბათუმი'], 1), 'კმ, ზრდა:', round(d2['ბათუმი'] - dist['ბათუმი'], 1), 'კმ')
        ```
        ახალი გზა ქუთაისისა და სამტრედიის გავლით მიდის.

!!! question "დავალება 3"
    ააგეთ 30×30 „ხარჯების რასტრი" (ხარჯი 1–9, 20% უჯრა კედელია) და იპოვეთ ყველაზე იაფი გზა კუთხიდან კუთხემდე `grid_graph`-ით. შეადარეთ Dijkstra და A* შემოწმებული უჯრების რაოდენობა. რატომ არის განსხვავება მცირე?

    ??? success "ამოხსნა"
        ```python
        import random

        random.seed(2)
        cost = [[None if random.random() < 0.2 else random.randint(1, 9) for _ in range(30)] for _ in range(30)]
        cost[0][0] = cost[29][29] = 1
        gr = grid_graph(cost)
        goal = (29, 29)

        d, p, e1 = dijkstra(gr, (0, 0), goal)
        h = lambda n: math.hypot(n[0] - 29, n[1] - 29)        # მინიმალური ხარჯი ერთ ნაბიჯზე 1
        g, p2, e2 = astar(gr, (0, 0), goal, h)
        print(round(d[goal], 1), round(g[goal], 1), len(e1), len(e2))
        ```
        განსხვავება მცირეა, რადგან ხარჯები 1-დან 9-მდე იცვლება, ხოლო ევრისტიკა ყოველ ნაბიჯს მხოლოდ ღირებულებით `1` აფასებს. რაც უფრო ახლოსაა `h` რეალურ ხარჯთან, მით უფრო ძლიერია A*.

!!! question "დავალება 4"
    სცადეთ **შეწონილი A\***: ჩაანაცვლეთ `h` ფუნქციით `3 * h`. 50 შემთხვევით რასტრზე გამოთვალეთ, რამდენჯერ იქნა გზა არაოპტიმალური და საშუალოდ რამდენი პროცენტით უფრო ძვირი.

    ??? success "ამოხსნა"
        ```python
        worse, extra, saved = 0, 0.0, 0
        for seed in range(50):
            random.seed(seed)
            cost = [[None if random.random() < 0.2 else random.randint(1, 9) for _ in range(30)] for _ in range(30)]
            cost[0][0] = cost[29][29] = 1
            gr = grid_graph(cost)
            d, _, e1 = dijkstra(gr, (0, 0), (29, 29))
            if (29, 29) not in d:
                continue
            g, _, e2 = astar(gr, (0, 0), (29, 29), lambda n: 3 * math.hypot(n[0] - 29, n[1] - 29))
            saved += len(e1) - len(e2)
            if g[(29, 29)] > d[(29, 29)] + 1e-9:
                worse += 1
                extra += g[(29, 29)] / d[(29, 29)] - 1
        print('არაოპტიმალური:', worse, 'გზა 50-დან, საშუალო ზრდა:', round(100 * extra / max(worse, 1), 1), '%')
        print('დაზოგილი შემოწმებული უჯრები სულ:', saved)
        ```
        ჩვენს გაშვებაზე 50-დან 20 გზა არაოპტიმალური იყო (საშუალოდ ~0.7%-ით უფრო ძვირი), სანაცვლოდ ~9000 უჯრის შემოწმება დაიზოგა. ეს ტიპური კომპრომისია სიზუსტესა და სიჩქარეს შორის.
