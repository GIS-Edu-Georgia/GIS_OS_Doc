# 🧭 Spatial algorithms

Every GIS program, from QGIS to Google Earth, rests on a handful of fundamental algorithms. This section explains **how they work**: the idea, a diagram, a pure-Python implementation, the same result with a library, and a practical exercise.

---

## 🌍 Why we need spatial algorithms

Imagine 10 million points and the question: "which points are inside this rectangle?" The naive solution checks every point (`O(n)`). A spatial index rules out most of the territory with a single comparison (`O(log n)` and similar). The same principle lets Google Earth load, for a single frame, only the part of the Earth's surface it actually needs.

---

## 🛰️ An interesting case: Terravision

In the early 1990s the ART+COM team built **Terravision**, a virtual Earth on which the user could zoom seamlessly from space down to city level. Computers of that time could not hold high-resolution Earth data in memory all at once, so the solution rested on a few ideas that still underlie every 3D map today:

| Idea | What it does |
|---|---|
| **Quadtree** | Splits the Earth into hierarchical squares (tiles) so that only what is needed is accessed |
| **LOD** (Level of Detail) | Shows distant terrain at low detail and nearby terrain at high detail |
| **Frustum culling** | Discards whatever falls outside the camera's field of view |
| **Asynchronous streaming** | Loads tiles in the background and shows low quality in the meantime |
| **Terrain mesh** | Builds a triangle mesh from elevation data and drapes the satellite image over it |

!!! note "About the sources"
    The principles listed above are techniques used universally in today's web maps and 3D globes. The specific technical details of Terravision (e.g. which hardware it ran on, which variant of which algorithm was used) are described differently in different secondary sources, so on these pages they are not attributed to that particular project but discussed in general.

---

## 🗺️ Topics

| Page | Description | Status |
|---|---|---|
| [Quadtree](quadtree.md) | Spatial index, tile addresses | ✅ |
| [LOD and Frustum culling](lod_frustum.md) | Managing detail, field of view | ✅ |
| [Tile pyramid (XYZ)](tiles_xyz.md) | Web Mercator, quadkey | ✅ |
| [Spatial indexes](spatial_indexes.md) | k-d tree, R-tree, Geohash | ✅ |
| [Grids](grids_hex.md) | Z-order, Hilbert, hexagons (H3) | ✅ |
| [S2 and H3](s2_h3.md) | Global grids, cell ID, range search | ✅ |
| [TIN and Delaunay](tin_delaunay.md) | Terrain mesh | ✅ |
| [Voronoi and Thiessen](voronoi.md) | Proximity analysis, the dual of Delaunay | ✅ |
| [Interpolation](interpolation.md) | IDW, Kriging, error estimation | ✅ |
| [Contours](contours.md) | Marching squares, isolines | ✅ |
| [Viewshed](viewshed.md) | Line of sight, Bresenham, visible area | ✅ |
| [Clustering](clustering.md) | DBSCAN, k-means, hot spots | ✅ |
| [Geometric algorithms](geometry_algorithms.md) | Point-in-polygon, Douglas–Peucker, Convex hull | ✅ |
| [Polygon overlay](clipping.md) | Sutherland–Hodgman, Greiner–Hormann, overlay | ✅ |
| [Graphs](graph_algorithms.md) | Dijkstra, A* | ✅ |
| [Practice](practice.md) | 4 mini-projects combining several algorithms | ✅ |

## 📐 Page structure

1. The idea and the problem it solves
2. Interactive visualization
3. Pure-Python implementation
4. The same with PyQGIS or a library
5. Complexity and practical use
6. Exercises with collapsible solutions
