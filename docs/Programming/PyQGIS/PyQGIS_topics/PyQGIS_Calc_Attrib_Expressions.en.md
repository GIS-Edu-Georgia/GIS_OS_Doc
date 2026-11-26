---
title: "PyQGIS scripts for geospatial calculations"
author: "GK"
date: "2025-10-26"
description: "A collection of QGIS Python (PyQGIS) scripts for geospatial calculations — length, area, perimeter and population density."
---

# 🗺️ PyQGIS scripts for geospatial calculations

This page contains Python scripts for geospatial calculations in QGIS, including:

- calculating the length of a line layer  
- calculating the area and perimeter of a polygon layer  
- calculating population density in the table  
- creating new fields and writing constant values  

All scripts use the QGIS Python API (**PyQGIS**) and assume the relevant layers exist in the QGIS project.

---

## 1️⃣ Calculating the length of a line layer

This script calculates the length of the features of a line layer (e.g. *Rivers*) and stores the result in a new field **`Len_M`**.

### 📜 Code

```python
# get the layer named 'Rivers'
layers = QgsProject.instance().mapLayersByName('Rivers')
layer = layers[0]

# access the data provider
pv = layer.dataProvider()

# add a new field 'Len_M' for the length (double type)
pv.addAttributes([QgsField('Len_M', QVariant.Double)])
layer.updateFields()

# define the calculation expression
expr1 = QgsExpression('length($geometry)')

# create the expression context
cntx = QgsExpressionContext()
cntx.appendScopes(QgsExpressionContextUtils.globalProjectLayerScopes(layer))

# edit the layer and calculate the length
with edit(layer):
    for i in layer.getFeatures():
        cntx.setFeature(i)
        i['Len_M'] = expr1.evaluate(cntx)
        layer.updateFeature(i)
```

### 💡 Explanation

- **Choosing the layer:** gets the layer named `'Rivers'` from the QGIS project.  
- **Field:** creates a new field `Len_M` to store each feature's length.  
- **Expression:** `length($geometry)` is used to calculate the length of each feature's geometry.  
- **Update:** the expression is evaluated for each feature and the `Len_M` field is updated.

---

## 2️⃣ Calculating the area and perimeter of a polygon layer

This script calculates the area and perimeter of the features of a polygon layer (e.g. *nakveti*, land parcels) and stores the results in new fields **`Area_sq_m`** and **`Perimeter`**.

### 📜 Code

```python
# get the layer named 'nakveti'
layers = QgsProject.instance().mapLayersByName('nakveti')
layer = layers[0]

# access the data provider
pv = layer.dataProvider()

# add new fields for area and perimeter
pv.addAttributes([QgsField('Area_sq_m', QVariant.Double)])
pv.addAttributes([QgsField('Perimeter', QVariant.Double)])
layer.updateFields()

# define the calculation expressions
expr1 = QgsExpression('area($geometry)')
expr2 = QgsExpression('perimeter($geometry)')

# create the expression context
cntx = QgsExpressionContext()
cntx.appendScopes(QgsExpressionContextUtils.globalProjectLayerScopes(layer))

# edit the layer and calculate area and perimeter
with edit(layer):
    for i in layer.getFeatures():
        cntx.setFeature(i)
        i['Area_sq_m'] = expr1.evaluate(cntx)
        i['Perimeter'] = expr2.evaluate(cntx)
        layer.updateFeature(i)
```

### 💡 Explanation

- **Choosing the layer:** gets the layer named `'nakveti'`.  
- **Fields:** creates two new fields: `Area_sq_m` for area and `Perimeter` for perimeter.  
- **Expressions:**  
  - `area($geometry)` — calculates the area  
  - `perimeter($geometry)` — calculates the perimeter  
- **Update:** both expressions are evaluated for each feature and the fields are updated.

---

## 3️⃣ Calculating population density in the table

This script calculates population density in a layer (e.g. *Municipalitys*) with the formula:

\[
D = \frac{P}{A}
\]

where:

- **D** — population density  
- **P** — population (the `Mosaxl_200` field)  
- **A** — area (in square meters or square kilometers)

### 📜 Code

```python
# get the layer named 'Municipalitys'
layers = QgsProject.instance().mapLayersByName('Municipalitys')
layer = layers[0]

# access the data provider
pv = layer.dataProvider()

# add new fields for area, area in km² and density
pv.addAttributes([
    QgsField('area', QVariant.Double),
    QgsField('area_km', QVariant.Double),
    QgsField('simwidrove', QVariant.Double)
])
layer.updateFields()

# define the calculation expressions
expr1 = QgsExpression('$area')                 # area in square meters
expr2 = QgsExpression('"area"/1000000')        # area in square kilometers
expr3 = QgsExpression('"Mosaxl_200"/area_km')  # population density

# create the expression context
cntx = QgsExpressionContext()
cntx.appendScopes(QgsExpressionContextUtils.globalProjectLayerScopes(layer))

# calculate the area
with edit(layer):
    for i in layer.getFeatures():
        cntx.setFeature(i)
        i['area'] = expr1.evaluate(cntx)
        layer.updateFeature(i)

# convert the area to square kilometers
with edit(layer):
    for i in layer.getFeatures():
        cntx.setFeature(i)
        i['area_km'] = expr2.evaluate(cntx)
        layer.updateFeature(i)

# calculate the population density
with edit(layer):
    for i in layer.getFeatures():
        cntx.setFeature(i)
        i['simwidrove'] = expr3.evaluate(cntx)
        layer.updateFeature(i)
```

### 💡 Explanation

- **Choosing the layer:** gets the layer named `'Municipalitys'`.  
- **Fields:** creates three new fields —  
  `area` (m²), `area_km` (km²), `simwidrove` (density).  
- **Expressions:**  
  - `expr1`: `$area` — calculates the area in square meters  
  - `expr2`: `"area"/1000000` — converts the area to square kilometers  
  - `expr3`: `"Mosaxl_200"/area_km` — calculates the population density  
- **Update:** the calculations run in three separate loops so the dependencies are built correctly (`area` → `area_km` → `simwidrove`).

---

## 4️⃣ Creating new fields and writing constant values

If we don't need an expression and every feature should get the same text/number, we add the field and write the value directly.

### 📜 Code

```python
layers = QgsProject.instance().mapLayersByName('Rivers')
layer = layers[0]

pv = layer.dataProvider()
pv.addAttributes([
    QgsField('Type', QVariant.String),
    QgsField('Type_Eng', QVariant.String)
])
layer.updateFields()

# if we use QVariant.Int instead of QVariant.String,
# the value must be a number and the quotes are no longer needed

with edit(layer):
    for i in layer.getFeatures():
        i['Type'] = 'mdinare'
        i['Type_Eng'] = 'River'
        layer.updateFeature(i)
```

### 💡 Explanation

- **`with edit(layer)`** opens edit mode and saves the changes at the end of the block.
- **`QgsExpressionContext`** is not needed here, because we are not evaluating an expression. It is only required when `QgsExpression.evaluate()` is used (see items 1–3).

---

## ⚙️ Notes

- **Prerequisites:** make sure the layers (`Rivers`, `nakveti`, `Municipalitys`) exist in the QGIS project and contain the required fields (e.g. `Mosaxl_200` for population).  
- **Running:** the scripts should be run in the QGIS Python console or inside a QGIS plugin.  
- **Error handling:** checking that the layer exists and the fields are available is recommended.  
- **Efficiency:** for large datasets, consider optimization (e.g. a single editing session).

---

📘 *Autogenerated educational resource for QGIS scripting with PyQGIS.*
