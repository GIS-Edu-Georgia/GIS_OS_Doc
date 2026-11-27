# 📐 Datum

A **datum** is a mathematical model that defines the shape, size and orientation of the Earth's surface. The Earth is not a perfect sphere — it is an oblate ellipsoid, a slightly flattened sphere.

Datums are essential for representing spatial data correctly and are used in geodesy — the science of measuring and modelling the Earth's surface.

### 📌 Kinds of reference surfaces

- **Ellipsoid** – a smooth surface that approximates the shape of the Earth.
- **Geoid** – an irregular surface that reflects the Earth's gravity field.

### 🌍 Two main types of datum:

1. **Geographic datum**  
   Used to define the geometry of the Earth's surface.  
   Usually based on an ellipsoid.

   #### Main geographic datums:
   - **WGS84** – the most common; used by GPS.
   - **NAD83** – for North America.
   - **ETRF89** – for European territories.

2. **Projected datum**  
   Used to project the Earth's 3D surface into 2D space.  
   Often represented by a cylindrical or flat (planar) system.

   #### Main projected systems:
   - **UTM (Universal Transverse Mercator)** – for large-scale maps.
   - **SPCS (State Plane Coordinate System)** – for maps of small areas.

---

## 🗺️ Projection

A **projection** is a method of representing the Earth's three-dimensional surface on a two-dimensional map.

The Earth is a 3D object and a map is 2D. That is why a projection is needed to create an accurate, readable map.

### 📊 The difference between a datum and a projection

- A **datum** defines the size, shape and orientation of the Earth's surface.
- A **projection** transforms that surface onto a flat 2D map.

### 📌 Why do we need projections?

- Maps are easier to read than a globe.
- Maps allow accurate measurements (distance, area, angle).
- Maps are essential for visualizing and analysing spatial data.

---

## 🧭 Types of projection (examples):

### 🌐 Mercator Projection
- A cylindrical projection.
- Preserves direction (True North).
- Used for navigation.
- Distorts the size of objects near the poles (e.g. Greenland looks bigger than it really is).

### 🌐 Lambert Conformal Conic
- Preserves shape and size near the standard parallels.
- Often used for the USA and Canada.

### 🌐 Albers Equal Area
- Preserves area.
- Suitable for comparing the size of regions.
- Popular on maps of the USA.

### 🌐 Robinson Projection
- A compromise projection.
- Balances shape, size and distance.
- Widely used on world maps — visually appealing.

---

## 🔚 Summary

- A **datum** defines the model of the Earth (ellipsoid or geoid).
- A **projection** transforms the 3D surface onto a 2D map.
- Both are essential for the accuracy and usability of spatial data.
- The choice depends on the map's purpose and the area it covers.
