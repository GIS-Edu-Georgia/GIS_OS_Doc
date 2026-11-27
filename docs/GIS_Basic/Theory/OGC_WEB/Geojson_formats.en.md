# GeoJSON formats from QGIS and ArcGIS

GeoJSON is a format for exchanging spatial data. It is based on the JSON structure and is widely used in web maps and GIS programs.

!!! note "Coordinate order"
    GeoJSON always lists coordinates as `[longitude, latitude]`. The examples below use approximate coordinates of Tbilisi, Kutaisi and Batumi.

## 📌 1. QGIS – Newline Delimited GeoJSON (`.geojsonl` or `.ndgeojson`)

- **Description**: each line holds one GeoJSON object (feature).
- **Use**: useful for streaming large data or for parallel processing.
- **QGIS export**: when exporting, choose _Newline delimited GeoJSON_.
- **Example**:

```
{"type":"Feature","geometry":{"type":"Point","coordinates":[44.8,41.7]},"properties":{"name":"Tbilisi"}}
{"type":"Feature","geometry":{"type":"Point","coordinates":[42.7,42.27]},"properties":{"name":"Kutaisi"}}
```

---

## 📌 2. QGIS – standard GeoJSON

- **Description**: the whole FeatureCollection is in one JSON structure.
- **Use**: for general purposes, for display on web maps.
- **QGIS export**: choose _GeoJSON_.
- **Example**:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [44.8, 41.7]
      },
      "properties": {
        "name": "Tbilisi"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [42.7, 42.27]
      },
      "properties": {
        "name": "Kutaisi"
      }
    }
  ]
}
```

---

## 📌 3. ArcGIS – Formatted GeoJSON

- **Description**: a nicely formatted JSON structure, easy for people to read.
- **ArcGIS Pro**: when exporting you can save and format the output as JSON.
- **Use**: for writing into code, for transferring through an API.

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [41.64, 41.65]
      },
      "properties": {
        "name": "Batumi"
      }
    }
  ]
}
```

---

## 📌 4. ArcGIS – Non-formatted (Minified) GeoJSON

- **Description**: all the information is on one line — a compact format.
- **Use**: when file size or transfer speed matters.
- **Example**:

```
{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[41.64,41.65]},"properties":{"name":"Batumi"}}]}
```

---

## 🔚 Summary

| Format                    | Formatted | Multi-line | Use |
|---------------------------|---------------|--------------|------------|
| QGIS – Newline delimited  | ❌             | ✅            | Data streaming |
| QGIS – Standard GeoJSON   | ✅             | ✅            | Web maps |
| ArcGIS – Formatted        | ✅             | ✅            | Reading in code |
| ArcGIS – Minified         | ❌             | ❌            | Fast transfer |
