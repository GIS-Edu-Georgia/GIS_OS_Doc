# QGIS — Layer Tools

## 1. Export layer(s) information

**Purpose:**
This tool produces a polygon for the extent of each layer, together with additional metadata.

**Parameters:**
- `LAYERS` — list of layers
- `OUTPUT` — the output polygon file

**Python example:**

```python
import processing

params = {
    'LAYERS': ['layer1', 'layer2'],
    'OUTPUT': 'TEMPORARY_OUTPUT'
}
processing.run('native:exportlayersinformation', params)
```

---

## 2. Export to spreadsheet

**Purpose:**
Exports the attribute tables of one or more layers to a spreadsheet (xlsx/ods). Each layer becomes a separate sheet.

**Python example:**

```python
import processing

params = {
    'LAYERS': ['layerA', 'layerB'],
    'USE_ALIAS': False,
    'FORMATTED_VALUES': True,
    'OVERWRITE': True,
    'OUTPUT': '/tmp/layers.xlsx'
}
processing.run('native:exporttospreadsheet', params)
```

---

```python
processing.run("native:exporttospreadsheet", {'LAYERS':['C:/Users/Public/GIS/PyQGIS2025_2/tema9/shp/contour.shp','Polygon?crs=EPSG:32638&field=MINX:double(0,0)&field=MINY:double(0,0)&field=MAXX:double(0,0)&field=MAXY:double(0,0)&field=CNTX:double(0,0)&field=CNTY:double(0,0)&field=AREA:double(0,0)&field=PERIM:double(0,0)&field=HEIGHT:double(0,0)&field=WIDTH:double(0,0)&uid={9e97cf70-2bcc-4e3a-b879-0bc4087c93c9}','C:/Users/Public/GIS/PyGK/Tema_9/shp/Georgia_municipalitetebi.shp','C:/Users/Public/GIS/PyGK/Tema_9/shp/Georgia_regionebi.shp','C:/Users/Public/GIS/PyGK/Tema_9/shp/Georgia_sazRvari.shp'],'USE_ALIAS':True,'FORMATTED_VALUES':True,'OUTPUT':'TEMPORARY_OUTPUT','OVERWRITE':True})
```

---

## 3. Extract layer extent

**Purpose:**
Generates a polygon that represents the layer's minimum bounding rectangle.

**Python example:**

```python
import processing

params = {
    'INPUT': 'my_layer',
    'OUTPUT': '/tmp/extent.gpkg'
}
processing.run('qgis:polygonfromlayerextent', params)
```

---

```python
contour = r'C:\Users\Public\GIS\PyQGIS2025_2\tema9\shp\contour.shp'
ext = r'C:\Users\Public\GIS\PyQGIS2025_2\tema9\shp\contour_extent_polygon.shp'

processing.run("native:polygonfromlayerextent",
       {'INPUT': contour, 'ROUND_TO': 0, 'OUTPUT': ext})

iface.addVectorLayer(ext, '', 'ogr')
```

---

## A real scenario — documenting a GIS project automatically

```python
import processing

# 1. export the layers' metadata
processing.run('native:exportlayersinformation', {
    'LAYERS': ['roads', 'buildings', 'rivers'],
    'OUTPUT': '/tmp/layers_info.gpkg'
})

# 2. export the attributes of all layers to Excel
processing.run('native:exporttospreadsheet', {
    'LAYERS': ['roads', 'buildings', 'rivers'],
    'USE_ALIAS': True,
    'FORMATTED_VALUES': True,
    'OVERWRITE': True,
    'OUTPUT': '/tmp/project_data.xlsx'
})

# 3. create an extent for each layer
for lyr in ['roads', 'buildings', 'rivers']:
    processing.run('qgis:polygonfromlayerextent', {
        'INPUT': lyr,
        'OUTPUT': f'/tmp/{lyr}_extent.gpkg'
    })
```

---

This page gives short but practical examples of the QGIS Layer Tools.
