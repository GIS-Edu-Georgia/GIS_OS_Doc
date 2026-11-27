<!-- https://cloud.mail.ru/public/js3t/PQ6wiuvrC -->

# 🗺️ Georeferencing a topographic map in QGIS

Georeferencing a topographic map means placing it on geographic coordinates, so that it can be overlaid and analysed together with modern maps or in geographic information systems (GIS). The process involves assigning real coordinates to specific points on the map.

---

## 📌 Preparation

### 1. Getting a topographic map
Find a scanned or digital topographic map (JPEG, TIFF or PNG).

### 2. Required programs and data
- QGIS (version 3.x or newer)
- a scanned topographic map (a raster image)
- objects with known coordinates, or a graticule

---

## 🛠️ Step-by-step instructions

=== "Step I: loading the map in QGIS"
* Open QGIS
* In the main window, in the `Browser Panel`, right-click Favorites, choose your working directory and add it.

---

=== "Step II: starting georeferencing"
1. Go to **Layer > Georeferencer...**
2. Open the image (`File > Open Raster`)

---

=== "Step III: marking ground control points (GCPs)"
1. Mark matching points on the image and on a base map (OSM, Google Earth or another).
2. Use at least 4 well-distributed points.
3. Set the transformation method:

| Method | When to use |
|--------|--------------------------|
| Linear (1st Order) | little distortion |
| Polynomial 2/3 | medium/strong distortion |
| Thin Plate Spline | for smooth stretching (rubber sheeting) |

4. Check the RMS error (`View GCP Table`)

---

=== "Step IV: running the transformation"
- After choosing: `Raster > Georeferencer > Start Georeferencing`
- The map is stretched based on the given points.

---

=== "Step V: saving the georeferenced image"
- Use `File > Save Raster As...`
- Format: GeoTIFF (.tif) or another georeferenced format
- Make sure the saved file has the correct CRS (e.g. EPSG:32638)

---

## ✅ Checking the accuracy

* Compare it with other spatial data (e.g. buildings, roads).
* If needed, edit or add new GCPs and georeference the map again.

---

## 💡 Additional tips

* Use as many GCPs as possible for a better result.
* Choose easily recognizable objects — road intersections, river confluences, peaks.
* Make a backup copy before you finish saving.

---

🗂️ The result is a georeferenced GeoTIFF or an updated raster file, ready for analysis and for use on maps in QGIS.


# 📍 Types of georeferencing transformations

Georeferencing uses different transformation types, which differ in complexity, the number of ground control points (GCPs) needed and where they are used. Below is an overview of the main transformations, with their pros and cons.

---

## 🔹 Linear (Affine) transformation

- **Description**: used for a linear transformation of the map — translation, rotation, scaling and shear.
- **Minimum GCPs needed**: 3
- **Pros** ✅:
  - simple and fast to compute.
  - preserves straight lines and the ratios of angles.
  - ideal when the map is not distorted.
- **Cons** ❌:
  - does not account for non-linear distortion.
  - inaccurate results on heavily distorted maps.

---

## 🔸 Second Order Polynomial transformation

- **Description**: uses quadratic terms to model non-linear distortion of the map.
- **Minimum GCPs needed**: 6
- **Pros** ✅:
  - fits non-linear distortion better.
  - can straighten bent parts of the map.
- **Cons** ❌:
  - can introduce extra distortion.
  - needs more control points and more precision.
  - sometimes over-transformation damages the geometry.

---

## 🔹 Third Order Polynomial transformation

- **Description**: by including cubic terms it can correct complex distortion.
- **Minimum GCPs needed**: 10
- **Pros** ✅:
  - ideal for heavily distorted historical maps.
  - offers maximum flexibility in correcting distortion.
- **Cons** ❌:
  - very sensitive to small errors in the GCPs.
  - often causes unnatural warping at the edges of the map.
  - hard to control, with a risk of extra distortion.

---

## 🔸 Spline (Thin Plate Spline) transformation

- **Description**: a non-linear interpolation method that fits the control points as closely as possible.
- **Minimum GCPs needed**: 10+ (recommended)
- **Pros** ✅:
  - gives high accuracy at the control points.
  - ideal for strong distortion.
- **Cons** ❌:
  - unpredictable distortion can occur between control points.
  - does not preserve geometric ratios.
  - the result is hard to predict.

---

## 🔹 Projective (Perspective) transformation

- **Description**: used to correct perspective distortion, e.g. for obliquely taken photos.
- **Minimum GCPs needed**: 4
- **Pros** ✅:
  - works well for aerial photos.
  - can correctly straighten tilted elements.
- **Cons** ❌:
  - suitable only for specific situations.
  - not a universal solution.

---

## 🔚 Conclusion

| **Transformation**            | **GCPs needed** | **Advantage**                          | **Limitation**                              |
|-------------------------------|----------------|------------------------------------------|--------------------------------------------|
| **Linear (Affine)**           | 3              | fast, simple                         | does not handle non-linear distortion        |
| **2nd Order Polynomial**      | 6              | better fit to distortion          | very sensitive to errors            |
| **3rd Order Polynomial**      | 10             | maximum flexibility                  | risk of extra distortion                 |
| **Spline (Thin Plate Spline)**| 10+            | high accuracy at the GCPs                | unpredictable in other areas            |
| **Projective (Perspective)**  | 4              | ideal for correcting tilt       | limited range of use               |

---

📌 **Tip**: when choosing a transformation, consider how distorted the map is, how many GCPs are available and the accuracy you want. For example, a Linear transformation is enough for simple maps, while Spline or Third Order Polynomial suits old or heavily distorted maps better.
