# 🗺️ KML / KMZ — a format for exchanging spatial data

## KML (Keyhole Markup Language)

**KML stands for** *Keyhole Markup Language*. It was originally created by **Keyhole Inc.**, which **Google** acquired in 2004.

It is an **XML-based file format** designed for displaying geographic data in programs such as **Google Earth** and **Google Maps**.

---

 **KML files** can contain: <br>
   - points (placemarks), <br>
   - lines and polygons (paths, areas), <br>
   - images and text — to describe locations or layers. <br>

---

 **The file extension is** `.kml`, and the compressed variant is `.kmz` — it contains one or more KML files and accompanying data in ZIP format.

 📌 **Common use cases:** <br>
   - planning and visualizing routes <br>
   - analysing GPS tracks <br>
   - geo-overlaying photos <br>
   - creating tours in Google Earth <br>

---

**KML files also support time data**, which lets you create **animations of changes over time** — for example:
   - traffic movement
   - climate events

---

**Coordinates in KML** are written in this order: <br>
   - **longitude**, <br>
   - **latitude**, <br>
   - **and altitude.** <br>

---

KML is supported by many platforms:
   - Google Earth <br>
   - ArcGIS / QGIS <br>
   - NASA World Wind <br>
   - CesiumJS and other web applications <br>

---

KML can use **network links (NetworkLinks)**, which let you **bring in dynamic content from the internet.** <br>
— ideal for real-time data (live GPS, sensors).

---

KML is an **OGC (Open Geospatial Consortium) standard**, which means it is officially recognized for exchanging geographic data.

---

📦 **KMZ** is a compressed KML file that stores every needed element in one file (including layers, photos, styles and coordinates) — convenient for sharing and for use in Google Earth.

---
