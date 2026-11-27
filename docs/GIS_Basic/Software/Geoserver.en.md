# GeoServer

## We use:

- **GeoServer** | version [GeoServer 2.25.x](https://geoserver.org/download/)

- GeoServer is open-source server software built to share geographic data on the web. It uses **OGC standards** (WMS, WFS, WCS) and lets you read, serve and style spatial data from various formats, such as Shapefile, GeoTIFF, PostGIS and others.

GeoServer is actively used on web mapping platforms (e.g. Leaflet, OpenLayers), and it integrates with technologies such as QGIS, GeoNode, MapStore, Django and many more. It is available as a standalone server and is also integrated into many larger systems.

---

!!!tip  
    GeoServer runs in a Java-based environment and can be installed on Windows, Linux and macOS. Java 11 or 17 is recommended.

---

## After installation

- **Check the Java environment:**  
    The **JAVA_HOME** variable must be set correctly, and a supported version (OpenJDK or Temurin) must be used. <br>
    Java 17 or Java 21 [Adoptium](https://adoptium.net/temurin/releases) <br>

- **Access the web interface:**  
    GeoServer has a built-in web interface that you open in a browser:  
    `http://localhost:8080/geoserver`

- **Add spatial data:**  
    Start from the `Data Stores` menu – connect a data source (Shapefile, GeoPackage, PostGIS, etc.).

---

# 🧭 The history of GeoServer

GeoServer is an open-source, Java-based program created for serving geospatial data on the web according to OGC standards.

## 🕰️ The beginning — code from the community

- **2001** – the GeoServer project started as an initiative of "The Open Planning Project" and became one of the first implementations of an OGC WFS server.
- The goal was to create a widely available, standards-compliant geoserver.

## 🚀 Development and growth

- **2006** – GeoServer gains full WMS support and integrates with Google Earth.
- **2008** – active integration with PostGIS and expansion of services begins.
- **2010** – GeoServer becomes an official OSGeo project.
- **From 2020** – WPS (Web Processing Service), INSPIRE and REST API capabilities are refined.

## 🌍 GeoServer today

- ✅ supports the WMS, WFS, WCS and WMTS standards  
- ✅ combines data from many sources: Shapefile, GeoPackage, PostGIS, Oracle Spatial and others  
- ✅ has rich styling capabilities with SLD and CSS styles  
- ✅ runs in Docker, Tomcat and Spring Boot environments too  
- ✅ widely used in the public, research and commercial sectors

## 🎓 Why GeoServer?

- 💸 **Completely free, with no license restrictions**  
- 🌐 supports international standards and integrates with all leading GIS tools  
- 🧰 a powerful and flexible REST API  
- 🗺️ provides styling and presentation of data for web maps  
- 📦 available as WAR, Docker and standalone versions  

---

## 🔗 Official links

- 🌍 Main site: [https://geoserver.org](https://geoserver.org)  
- 📚 Documentation: [https://docs.geoserver.org](https://docs.geoserver.org)  
- 💻 GitHub code: [https://github.com/geoserver/geoserver](https://github.com/geoserver/geoserver)  
- 🐳 Docker version: [https://hub.docker.com/r/oscarfonts/geoserver](https://hub.docker.com/r/oscarfonts/geoserver)  
- 📜 Standards: [https://www.ogc.org/standards](https://www.ogc.org/standards)

---

📌 *GeoServer is a bridge between spatial data and the web — through it we can access, visualize and integrate open data in modern web technologies.*
