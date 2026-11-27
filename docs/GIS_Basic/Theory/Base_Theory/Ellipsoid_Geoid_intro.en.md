# Geoid & ellipsoid

<!-- https://cloud.mail.ru/public/js3t/PQ6wiuvrC -->

## 📘 About the ellipsoid
🔗 See the link: > [Ellipsoid](https://en.wikipedia.org/wiki/Ellipsoid)

## 🌍 About the Earth ellipsoid
🔗 See the link: > [Earth ellipsoid](https://en.wikipedia.org/wiki/Earth_ellipsoid)

## 📏 About datums
🔗 See the link: > [Datums](https://desktop.arcgis.com/en/arcmap/latest/map/projections/datums.htm)

## 🛰️ About satellite navigation
🔗 See the link: > [Satellite navigation](https://en.wikipedia.org/wiki/Satellite_navigation)

## 🌐 About geographic coordinate systems
🔗 See the link: > [Geographic coordinate systems](https://desktop.arcgis.com/en/arcmap/latest/map/projections/about-geographic-coordinate-systems.htm)

## 🌐 Geoid, ellipsoid, spheroid and datum
🔗 See how they [relate to each other](https://desktop.arcgis.com/en/arcmap/latest/map/projections/about-the-geoid-ellipsoid-spheroid-and-datum-and-h.htm)

---



## 📌 Coordinate systems used in Georgia

### 🌐 WGS 84 [EPSG:4326](https://epsg.io/4326)
One of the most widely used global systems, used by GPS.

**The new rectangular system**  
- Ellipsoid: WGS 84  
- Projection: UTM  
  - EPSG: [32638 - UTM zone 38N](https://epsg.io/32638)  
  - EPSG: [32637 - UTM zone 37N](https://epsg.io/32637)

---

### 🗺️ Web projection (Web Mercator)
Matches Google Maps, OpenStreetMap and other web maps.

- EPSG: [3857 - Pseudo-Mercator](https://epsg.io/3857)

---

**The old rectangular system**  
- Ellipsoid: Pulkovo 1942  
- Projection: Gauss-Kruger  
  - EPSG: [28408 - zone 8](https://epsg.io/28408)  
  - EPSG: [28468 - zone 8N](https://epsg.io/28468)  
  - EPSG: [28407 - zone 7](https://epsg.io/28407)  
  - EPSG: [28467 - zone 7N](https://epsg.io/28467)

### 📐 Vertical coordinate system (heights)

**EGM96 height**  
- Unit: meter  
- Static (based on a fixed datum)  
- Celestial body: Earth  
- EPSG: [5773](https://epsg.io/5773)

## 🆔 What does an EPSG code mean?

An EPSG code is a unique identifier for a coordinate system. It defines:
- the ellipsoid model (e.g. WGS 84)
- the datum
- the projection method (e.g. UTM)
- the units (meter, degree)

---

### 🔍 Breaking down an EPSG code with examples

**EPSG:4326**  
- Name: WGS 84  
- Type: geographic system  
- Units: degrees  
- Use: GPS, global data  

**EPSG:32638**  
- Name: WGS 84 / UTM zone 38N  
- Type: projected system  
- Projection: UTM  
- Units: meter  
- Use: Georgia and neighbouring regions

---

📚 **Why does this matter?**
Using the right EPSG code ensures:
- accurate geographic alignment of data  
- correct distance and area calculations  
- compatibility between GIS programs

## 🏔️ Georgia's national height system

**📌 What is this system?**  
A single vertical system for determining heights across the whole country.

### 🧭 Reference level
It is based on the mean level of the Baltic Sea — the "Kronstadt zero".
Heights are measured relative to the geoid.

### 🏗️ Why does it matter?
- **Consistency** – standardized data
- **Infrastructure** – correct heights for projects
- **GIS and maps** – DEMs, terrain analysis
- **Hydrology** – water flow, risk assessment

### 📐 How do we use it?
GPS often gives ellipsoidal heights — a geoid model is needed to convert them to the national system.

In GIS (e.g. QGIS):
- load a DEM based on the national height system
- assign a projected CRS, e.g. EPSG:32638
- make sure the heights are given relative to the Baltic Sea level
