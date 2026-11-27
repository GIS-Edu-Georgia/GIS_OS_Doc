# 🔭 LOD and Frustum culling

On a 3D map the screen always needs far less than what the data contains. Two techniques serve this purpose:

- **Frustum culling** discards whatever **does not fall at all** within the camera's field of view.
- **LOD** (Level of Detail) draws what does fall within it at different levels of detail: high nearby, low far away.

Both rely on a **Quadtree**: read the [Quadtree page](quadtree.md) first.

---

## 🎮 Try it yourself

This is a top-down view: the camera is the blue dot, the red dashed triangle is its field of view. Colour shows the tile level. Drag the camera, change the heading and height, turn LOD or culling off, and compare the number of selected tiles.

<iframe src="../widgets/lod.html" title="LOD and Frustum culling interactive demo" style="width:100%;height:780px;border:0" loading="lazy"></iframe>

!!! tip "Observation"
    - Near the camera the tiles are small and far away they are large, but on screen they are all roughly the same size.
    - The territory outside the field of view disappears entirely: whole branches of the tree are not considered.
    - Lowering the "threshold" increases detail, and the number of tiles grows quickly.
    - Raising the camera height reduces detail: the camera is farther away.

---

## 📏 LOD: when should a tile be split?

Each tile has a **geometric error** `ε`: how large the difference is between the tile and full detail, in real metres. For a tile with a 256×256 texture it is roughly the size of one pixel: `ε = size / 256`.

The farther away the camera, the smaller this error looks. Its size on screen (**screen-space error**, SSE):

```text
ρ = ε · W / (2 · d · tan(FOV / 2))
```

where `W` is the screen width in pixels, `d` the distance from the camera to the tile, and `FOV` the field-of-view angle.

**Rule:** if `ρ ≤ threshold` (e.g. 8 pixels), the tile is good enough and we draw it. If not, we split it into 4 children and check the same thing for each of them.

---

## ✂️ Frustum culling

The **frustum** is the truncated pyramid of the camera's view. A tile should be discarded if it lies entirely outside the pyramid.

- **2D (top-down):** the field of view is a triangle. We check whether it intersects the tile's rectangle. For this we use the **separating axis theorem (SAT)**: if the projections onto some line do not overlap, the shapes do not intersect.
- **3D:** the pyramid is 6 planes. We test the tile's box (AABB) against each plane: if the box lies entirely outside any one of them, it is not visible.

---

## 🐍 Implementation in pure Python

```python title="lod.py" linenums="1"
import math


def sse(geometric_error, distance, viewport_px=1080, fov_deg=60):
    """Screen-space error in pixels."""
    return geometric_error * viewport_px / (2 * distance * math.tan(math.radians(fov_deg) / 2))


class Camera:
    def __init__(self, x, y, height, heading_deg, fov_deg=60, far=600):
        self.x, self.y, self.height = x, y, height
        self.heading = math.radians(heading_deg)
        self.fov = fov_deg
        self.far = far

    def frustum_polygon(self):
        """Field of view from above: a triangle (camera + two far points)."""
        half = math.radians(self.fov) / 2
        pts = [(self.x, self.y)]
        for a in (self.heading - half, self.heading + half):
            pts.append((self.x + self.far * math.cos(a), self.y + self.far * math.sin(a)))
        return pts


def rect_hits_polygon(rect, poly):
    """Whether a rectangle and a convex polygon intersect (SAT)."""
    minx, miny, maxx, maxy = rect
    corners = [(minx, miny), (maxx, miny), (maxx, maxy), (minx, maxy)]
    axes = [(1, 0), (0, 1)]
    for i in range(len(poly)):
        (x1, y1), (x2, y2) = poly[i], poly[(i + 1) % len(poly)]
        axes.append((y1 - y2, x2 - x1))          # edge normal
    for ax, ay in axes:
        a = [ax * x + ay * y for x, y in corners]
        b = [ax * x + ay * y for x, y in poly]
        if max(a) < min(b) or max(b) < min(a):
            return False                          # separating axis found
    return True


def distance_to_tile(cam, rect):
    minx, miny, maxx, maxy = rect
    dx = max(minx - cam.x, 0, cam.x - maxx)
    dy = max(miny - cam.y, 0, cam.y - maxy)
    return math.sqrt(dx * dx + dy * dy + cam.height ** 2)


def select_tiles(cam, rect, level=0, max_level=8, threshold=8, tex=256,
                 viewport_px=1080, out=None, stats=None):
    """Selects tiles top-down: culling + LOD."""
    out = [] if out is None else out
    stats = {'culled': 0} if stats is None else stats
    if not rect_hits_polygon(rect, cam.frustum_polygon()):
        stats['culled'] += 1
        return out, stats
    size = rect[2] - rect[0]
    err = size / tex                              # geometric error of the tile
    if level == max_level or sse(err, distance_to_tile(cam, rect), viewport_px, cam.fov) <= threshold:
        out.append((rect, level))
        return out, stats
    minx, miny, maxx, maxy = rect
    mx, my = (minx + maxx) / 2, (miny + maxy) / 2
    for r in ((minx, miny, mx, my), (mx, miny, maxx, my),
              (minx, my, mx, maxy), (mx, my, maxx, maxy)):
        select_tiles(cam, r, level + 1, max_level, threshold, tex, viewport_px, out, stats)
    return out, stats
```

### Usage

```python
world = (0, 0, 1000, 1000)
cam = Camera(x=500, y=100, height=40, heading_deg=90, fov_deg=60, far=600)

for threshold in (32, 8, 2):
    tiles, stats = select_tiles(cam, world, threshold=threshold, max_level=9)
    print(f"threshold {threshold:>2}px: {len(tiles):>3} tiles, culled branches: {stats['culled']}")
```

```text
threshold 32px:   6 tiles, culled branches: 4
threshold  8px:  12 tiles, culled branches: 16
threshold  2px:  48 tiles, culled branches: 46
```

### 3D: plane and AABB

```python title="frustum3d.py"
def box_outside_plane(box, plane):
    """Is the box outside the plane? plane = (a, b, c, d), inside: a*x+b*y+c*z+d >= 0."""
    minx, miny, minz, maxx, maxy, maxz = box
    a, b, c, d = plane
    # the vertex furthest along the plane normal (p-vertex)
    px = maxx if a >= 0 else minx
    py = maxy if b >= 0 else miny
    pz = maxz if c >= 0 else minz
    return a * px + b * py + c * pz + d < 0


def box_in_frustum(box, planes):
    return not any(box_outside_plane(box, p) for p in planes)
```

It is enough to check the vertex that is "furthest along": if even it is outside, the whole box is outside. That is only 1 point instead of 8.

---

## 🧰 The same with PyQGIS

Let's draw the selected tiles in QGIS as polygons with a `level` attribute:

```python
layer = QgsVectorLayer('Polygon?crs=EPSG:3857&field=level:integer', 'selected_tiles', 'memory')
pr = layer.dataProvider()

for (minx, miny, maxx, maxy), level in tiles:
    f = QgsFeature(layer.fields())
    f.setGeometry(QgsGeometry.fromRect(QgsRectangle(minx, miny, maxx, maxy)))
    f['level'] = level
    pr.addFeature(f)

QgsProject.instance().addMapLayer(layer)
```

Then categorized symbology by `level` reproduces the same picture the demo above shows. In this example `world` and the camera coordinates are arbitrary units. For a real map you should give them in EPSG:3857 metres.

---

## ⚠️ Additional problems in real systems

- **Cracks:** if neighbouring tiles have different levels, their meshes do not match along the shared border. This is solved with a "skirt" (a vertical strip hanging down from the tile's edge) or by stitching the meshes.
- **Popping:** when the level changes, the frame can change abruptly. That is why a smooth transition between two levels (blending/morphing) is often used.
- **Asynchronous loading:** a new tile must first arrive over the network. Until it does, the parent tile stays on screen.
- **Caching:** tiles that have been loaded once are kept in a cache so that they are not reloaded when the camera moves slightly.

---

## 📝 Exercises

!!! question "Exercise 1"
    Print a table showing how the number of selected tiles changes with the threshold (`1, 2, 4, 8, 16, 32` pixels), with and without `culling`. To turn culling off, temporarily replace the function `lod.rect_hits_polygon` with one that always returns `True`.

    ??? success "Solution"
        ```python
        import lod

        original = lod.rect_hits_polygon
        world = (0, 0, 1000, 1000)
        cam = lod.Camera(500, 100, 40, 90, 60, 600)

        print('threshold | with culling | without culling')
        for thr in (1, 2, 4, 8, 16, 32):
            lod.rect_hits_polygon = original
            a = len(lod.select_tiles(cam, world, threshold=thr, max_level=9)[0])
            lod.rect_hits_polygon = lambda r, p: True      # culling off
            b = len(lod.select_tiles(cam, world, threshold=thr, max_level=9)[0])
            print(f'{thr:>9} | {a:>12} | {b:>15}')
        lod.rect_hits_polygon = original
        ```
        Notice that without culling there are far more tiles, because the territory behind the camera is loaded too.

!!! question "Exercise 2"
    Build the 6 planes of a 3D view volume for an orthographic (box-shaped) camera with `x ∈ [0, 10]`, `y ∈ [0, 10]`, `z ∈ [0, 100]`, and test `box_in_frustum` on four boxes: inside, outside, partially overlapping and touching the edge.

    ??? success "Solution"
        ```python
        planes = [
            ( 1, 0, 0,   0),   # x >= 0
            (-1, 0, 0,  10),   # x <= 10
            ( 0, 1, 0,   0),   # y >= 0
            ( 0,-1, 0,  10),   # y <= 10
            ( 0, 0, 1,   0),   # z >= 0
            ( 0, 0,-1, 100),   # z <= 100
        ]
        tests = {
            'inside':     (2, 2, 2, 4, 4, 4),
            'outside':    (20, 2, 2, 25, 4, 4),
            'partial':    (8, 2, 2, 14, 4, 4),
            'edge':       (10, 2, 2, 12, 4, 4),
        }
        for name, box in tests.items():
            print(name, box_in_frustum(box, planes))
        ```
        Result: `True`, `False`, `True`, `True`. Importantly, the "partial" box is **not** discarded.

!!! question "Exercise 3"
    Try changing the `tex` parameter in `select_tiles` (128, 256, 512). What happens to the number of selected tiles, and why?

    ??? success "Solution"
        ```python
        for tex in (128, 256, 512):
            tiles, _ = select_tiles(cam, world, threshold=8, tex=tex, max_level=9)
            print(tex, len(tiles))
        ```
        Larger `tex` → the tile's geometric error `ε = size / tex` is smaller → a tile becomes "good enough" sooner → fewer tiles are needed. That is why 512-pixel tiles are needed in smaller numbers, although each one is heavier.
