# 🛣️ Graphs and shortest paths: Dijkstra and A*

A navigation app, route calculation in QGIS, network analysis: in every case we are finding the shortest path on a **graph**. A graph is a set of **nodes** (intersections, cities, cells) and **edges** (road segments), where each edge has a **weight** (distance, time, cost).

---

## 🎮 Try it yourself

Drag the mouse to draw walls, move the start and goal points, turn on "Terrain" (some cells are expensive) and compare the three algorithms. The blue cells are what the algorithm **explored**, and the red line is the path it found.

<iframe src="../widgets/pathfinding.html" title="Dijkstra, A* and Greedy interactive demo" style="width:100%;height:700px;border:0" loading="lazy"></iframe>

!!! tip "Observation"
    - **Dijkstra** expands equally in every direction and explores many cells.
    - **A\*** "senses" the direction of the goal and explores far fewer, yet finds the same exact, optimal path.
    - **Greedy** (using only the remaining distance to the goal) is fast, but the path **may not be the shortest**: build a "pocket" of walls and see.
    - Turn on "Terrain": the path goes around the dark (expensive) cells, and A*'s advantage shrinks, because the heuristic cannot account for cost.

---

## ⚙️ The algorithms

### Dijkstra

1. The start node has distance `0`, all others `∞`.
2. Take the node with the **smallest distance** from the priority queue.
3. For each of its neighbours, check whether the path through this node is shorter (**relaxation**). If it is, update it and add it to the queue.
4. Repeat until the goal is taken off the queue. At that moment its distance is **final** (weights must not be negative).

### A*

The same, but the queue is ordered by `f(v) = g(v) + h(v)`:

- `g(v)` — the path already travelled from the start to `v`.
- `h(v)` — the **heuristic**: an estimate of how much remains from `v` to the goal (e.g. the straight-line distance).

!!! warning "The heuristic must not overestimate the real distance"
    A* gives the optimal path if `h` is **admissible**: it never exceeds the real remaining cost. The straight-line distance always satisfies this (a straight line is the shortest path), which makes A* the natural choice for geographic networks. If we inflate `h` (e.g. ×3), A* becomes faster, but the path may no longer be optimal.

!!! info "Complexity"
    With a binary heap (`heapq`), Dijkstra is `O((V + E) log V)`. A* is the same in the worst case, but in practice the heuristic shrinks the search considerably. On real road networks (millions of nodes) more refined techniques are built on top of this, e.g. Contraction Hierarchies.

---

## 🐍 Implementation in pure Python

```python title="graphs.py" linenums="1"
import heapq
import math


def dijkstra(graph, start, goal=None):
    """graph = {node: [(neighbour, weight), ...]}.
    Returns (dist, prev, expanded)."""
    dist = {start: 0}
    prev = {}
    heap = [(0, start)]
    done = set()
    while heap:
        d, u = heapq.heappop(heap)
        if u in done:
            continue                               # stale entry
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
    """A*: the same, but the queue is ordered by f = g + h(v)."""
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
        return None                                # unreachable
    path = [goal]
    while path[-1] != start:
        path.append(prev[path[-1]])
    return path[::-1]


def haversine(a, b):
    """Distance in km between two (lat, lon) points."""
    la1, lo1, la2, lo2 = map(math.radians, (*a, *b))
    x = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 2 * 6371.0088 * math.asin(math.sqrt(x))


def grid_graph(cost):
    """Cost grid (None = obstacle) -> graph with 8 neighbours."""
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
                            continue                  # cutting a corner through a wall is not allowed
                        step = math.sqrt(2) if dr and dc else 1
                        nbrs.append(((rr, cc), step * (cost[r][c] + cost[rr][cc]) / 2))
            graph[(r, c)] = nbrs
    return graph
```

### Usage: cities of Georgia

!!! note "Illustrative data"
    The city coordinates are approximate, and the edges are a **simplified network** that does not reflect the exact road map. Each road length equals the straight-line distance multiplied by 1.3 (an approximate road-winding factor).

```python
cities = {
    'Tbilisi': (41.7151, 44.8271), 'Rustavi': (41.5495, 45.0069), 'Gori': (41.9842, 44.1158),
    'Khashuri': (41.9944, 43.5983), 'Borjomi': (41.8396, 43.3892), 'Akhaltsikhe': (41.6392, 42.9822),
    'Kutaisi': (42.2679, 42.6946), 'Samtredia': (42.1544, 42.3350), 'Poti': (42.1462, 41.6719),
    'Zugdidi': (42.5088, 41.8709), 'Batumi': (41.6168, 41.6367), 'Telavi': (41.9198, 45.4735),
}
roads = [('Tbilisi', 'Rustavi'), ('Tbilisi', 'Gori'), ('Gori', 'Khashuri'), ('Khashuri', 'Kutaisi'),
         ('Khashuri', 'Borjomi'), ('Borjomi', 'Akhaltsikhe'), ('Kutaisi', 'Samtredia'),
         ('Samtredia', 'Poti'), ('Samtredia', 'Zugdidi'), ('Poti', 'Zugdidi'),
         ('Samtredia', 'Batumi'), ('Poti', 'Batumi'), ('Tbilisi', 'Telavi'), ('Akhaltsikhe', 'Batumi')]

def build_graph(roads):
    graph = {c: [] for c in cities}
    for a, b in roads:
        w = 1.3 * haversine(cities[a], cities[b])
        graph[a].append((b, w))
        graph[b].append((a, w))
    return graph

graph = build_graph(roads)
goal = 'Batumi'
h = lambda n: 1.3 * haversine(cities[n], cities[goal])

dist, prev, expanded = dijkstra(graph, 'Tbilisi', goal)
print('Dijkstra:', round(dist[goal], 1), 'km,', len(expanded), 'nodes explored')
print(' -> '.join(path_to(prev, 'Tbilisi', goal)))

g, prev2, expanded2 = astar(graph, 'Tbilisi', goal, h)
print('A*:      ', round(g[goal], 1), 'km,', len(expanded2), 'nodes explored')
```

```text
Dijkstra: 371.3 km, 12 nodes explored
Tbilisi -> Gori -> Khashuri -> Borjomi -> Akhaltsikhe -> Batumi
A*:       371.3 km, 6 nodes explored
```

---

## 🧰 The same with PyQGIS

In QGIS the shortest path over a road layer can also be found with a single command (internally it uses these same algorithms):

```python
result = processing.run('native:shortestpathpointtopoint', {
    'INPUT': roads_layer,                       # line layer
    'STRATEGY': 0,                              # 0 = shortest, 1 = fastest
    'DEFAULT_DIRECTION': 2,                     # 2 = both directions
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
    print(nx.shortest_path(G, 'Tbilisi', 'Batumi', weight='weight'))
    print(nx.astar_path(G, 'Tbilisi', 'Batumi', heuristic=lambda a, b: 1.3 * haversine(cities[a], cities[b]), weight='weight'))
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

## 📝 Exercises

!!! question "Exercise 1"
    Compare Dijkstra and A* for every pair "Tbilisi → another city": how many nodes each one explores, and whether the path lengths match.

    ??? success "Solution"
        ```python
        print('goal          Dijkstra  A*   length matches')
        for goal in cities:
            if goal == 'Tbilisi':
                continue
            d, _, e1 = dijkstra(graph, 'Tbilisi', goal)
            hh = lambda n, goal=goal: 1.3 * haversine(cities[n], cities[goal])
            g, _, e2 = astar(graph, 'Tbilisi', goal, hh)
            print(f'{goal:<12} {len(e1):>8} {len(e2):>4}   {abs(d[goal] - g[goal]) < 1e-9}')
        ```
        The length always matches, and A* explores either the same number of nodes or, often, far fewer (6 instead of 12 for Batumi).

!!! question "Exercise 2"
    Close the Akhaltsikhe–Batumi road and compute the new path from Tbilisi to Batumi. By how much did the length grow?

    ??? success "Solution"
        ```python
        closed = [r for r in roads if set(r) != {'Akhaltsikhe', 'Batumi'}]
        graph2 = build_graph(closed)
        d2, p2, _ = dijkstra(graph2, 'Tbilisi', 'Batumi')
        print(' -> '.join(path_to(p2, 'Tbilisi', 'Batumi')))
        print(round(d2['Batumi'], 1), 'km, increase:', round(d2['Batumi'] - dist['Batumi'], 1), 'km')
        ```
        The new path goes through Kutaisi and Samtredia.

!!! question "Exercise 3"
    Build a 30×30 "cost raster" (cost 1–9, 20% of the cells are walls) and find the cheapest path from corner to corner with `grid_graph`. Compare the number of cells explored by Dijkstra and A*. Why is the difference small?

    ??? success "Solution"
        ```python
        import random

        random.seed(2)
        cost = [[None if random.random() < 0.2 else random.randint(1, 9) for _ in range(30)] for _ in range(30)]
        cost[0][0] = cost[29][29] = 1
        gr = grid_graph(cost)
        goal = (29, 29)

        d, p, e1 = dijkstra(gr, (0, 0), goal)
        h = lambda n: math.hypot(n[0] - 29, n[1] - 29)        # minimum cost per step is 1
        g, p2, e2 = astar(gr, (0, 0), goal, h)
        print(round(d[goal], 1), round(g[goal], 1), len(e1), len(e2))
        ```
        The difference is small because the costs range from 1 to 9, while the heuristic values every step at only `1`. The closer `h` is to the real cost, the stronger A* becomes.

!!! question "Exercise 4"
    Try **weighted A\***: replace `h` with `3 * h`. On 50 random rasters, count how many times the path was not optimal and by what percentage it was more expensive on average.

    ??? success "Solution"
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
        print('not optimal:', worse, 'paths of 50, average increase:', round(100 * extra / max(worse, 1), 1), '%')
        print('total explored cells saved:', saved)
        ```
        On our run, 20 of the 50 paths were not optimal (on average ~0.7% more expensive), while ~9000 cell explorations were saved. This is the typical trade-off between accuracy and speed.
