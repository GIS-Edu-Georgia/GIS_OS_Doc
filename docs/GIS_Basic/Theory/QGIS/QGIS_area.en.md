# 🗺️ QGIS – calculating area, and coordinate systems

## `$area` vs. `area($geometry)` · CRS vs. SRS

This page combines two important topics for working in QGIS:

1. **Methods for calculating area** (`$area` and `area($geometry)`)
2. **Coordinate reference systems** — **CRS** and **SRS**

---

## 📐 Calculating area in the QGIS Field Calculator

Calculating the area of polygons is one of the most common tasks in GIS.
The QGIS **Field Calculator** offers two main functions for this:

* **`$area`**
* **`area($geometry)`**

Which to choose depends on the **scale**, the **accuracy** you need and the **project settings**.

---

## 🔹 `$area`

> calculates the area of the current feature **taking the project settings into account**

**Characteristics:**

* uses the **Project CRS**
* if an **ellipsoid** is set in the project, the area is calculated **ellipsoidally**
* without an ellipsoid it works **planimetrically**
* the area units are set in
  **Project Properties → Measurements**

✔️ recommended for **national or regional scale** data
✔️ gives **high accuracy**

---

## 🔹 `area($geometry)`

> calculates only the area of the polygon geometry

**Characteristics:**

* the calculation is always **planimetric**
* it is based directly on the **CRS/SRS of the geometry**
* the area units depend on the CRS units (meter, degree, etc.)
* it **does not take into account**:

  * the project ellipsoid
  * custom area units

✔️ ideal for analysis at **city or local scale**
✔️ fast and simple to use

---

## 🌍 Ellipsoidal vs. planimetric calculation

### 🌐 Ellipsoidal

**Country / region**

* takes the Earth's curvature into account
* essential for large areas
* more accurate, but a heavier calculation

---

### 🗺️ Planimetric

**City / town**

* the Earth is treated as a flat plane
* effective for small areas
* fast and practical

---

## 🧭 CRS and SRS — coordinate systems

How accurate an area calculation is depends directly on **which coordinate system (CRS/SRS)** your data is in.

---

## 🔹 CRS — *Coordinate Reference System*

**CRS** is the **modern, standard term** used in QGIS and other GIS programs.

A CRS includes:

* the coordinate type (geographic or projected)
* the Earth model (ellipsoid)
* the projection method
* the units of measure
* the origin and orientation of the coordinates

**Examples:**

* `EPSG:4326` — WGS 84 (degrees)
* `EPSG:32638` — UTM Zone 38N (meters)

✔️ In QGIS, **Project CRS** and **Layer CRS** always mean CRS

---

## 🔹 SRS — *Spatial Reference System*

**SRS** is an **older, more general term**.

* it was used in older GIS documentation
* it often appears in databases (e.g. PostGIS)
* it is sometimes used as a synonym for CRS
* it is less precise as a term

---

## 🔍 CRS vs. SRS — comparison

| Aspect                   | CRS                   | SRS              |
| ------------------------- | --------------------- | ---------------- |
| Status                   | Modern standard | Old / general   |
| Precision of the term          | High                | Relatively low |
| Use in QGIS        | ✔️ main           | ⚠️ rare       |
| Use in documentation | Modern           | Legacy   |

---

## ✅ Practical recommendations

* ✔️ always use the term **CRS**
* ✔️ for the area of large territories — **`$area` with an ellipsoid**
* ✔️ in local analysis — **`area($geometry)`**
* ⚠️ check:

  * **Layer CRS**
  * **Project CRS**
  * **Project Properties → Measurements**

---

### ✨ Summary

> **The right CRS + the right area method = accurate GIS analysis**

These two factors are decisive, especially when the data is used for making decisions.
