# 🐍 Using classes in PyQGIS  

## 🔹 Introduction  
PyQGIS is the Python API of QGIS. It lets us write scripts and plugins for processing and visualizing GIS data.  
Using Python **classes** in PyQGIS gives us:  
- structured code  
- reusable functionality  
- a way to model complex GIS processes  

👉 How to use OOP (object-oriented programming) in PyQGIS.  

---

## 🔹 Why use classes in PyQGIS?  

- ✅ **Modularity** – the code is split into small, manageable parts  
- ✅ **Reuse** – the same logic is used in different projects  
- ✅ **Clarity** – large QGIS scripts become easier to understand  
- ✅ **Plugin development** – QGIS plugins are mostly built on classes  

---

## 🔹 Preparing the PyQGIS environment  

```python
from qgis.core import (
    QgsProject, QgsVectorLayer, QgsGeometry, QgsPointXY,
    QgsFeature, QgsField, QgsFields, QgsVectorFileWriter
)
from PyQt5.QtCore import QVariant
import os
```

👉 These libraries give us access to QGIS objects (layers, features, geometry).  

---

## 🔹 Creating a class: a simple example  

Let's create a class that works with points (`Point`).  

```python
class MyPoint:
    def __init__(self, x, y, name=""):
        self.x = x
        self.y = y
        self.name = name
    
    def to_qgspoint(self):
        return QgsPointXY(self.x, self.y)
    
    def describe(self):
        return f"Point {self.name} ({self.x}, {self.y})"
```

**Usage:**  
```python
tbilisi = MyPoint(44.8, 41.7, "Tbilisi")
print(tbilisi.describe())  
# result: Point Tbilisi (44.8, 41.7)
```

👉 Here the class provided **attributes (x, y, name)** and methods (`to_qgspoint`, `describe`).  

---

## 🔹 Using a PyQGIS class to add a point to a layer  

```python
class PointLayerManager:
    def __init__(self, layer_name="MyPoints"):
        self.layer = QgsVectorLayer("Point?crs=EPSG:4326", layer_name, "memory")
        provider = self.layer.dataProvider()
        provider.addAttributes([QgsField("Name", QVariant.String)])
        self.layer.updateFields()
        QgsProject.instance().addMapLayer(self.layer)
    
    def add_point(self, my_point: MyPoint):
        feat = QgsFeature()
        feat.setGeometry(QgsGeometry.fromPointXY(my_point.to_qgspoint()))
        feat.setAttributes([my_point.name])
        self.layer.dataProvider().addFeature(feat)
        self.layer.updateExtents()
```

**Usage:**  
```python
manager = PointLayerManager()
tbilisi = MyPoint(44.8, 41.7, "Tbilisi")
manager.add_point(tbilisi)
```

👉 Here the class created an **in-memory layer** and added features to it.  

---

## 🔹 Inheritance in PyQGIS  

We can create a general `GeometryObject` class and derive `PointObject`, `LineObject`, `PolygonObject` from it.  

```python
class GeometryObject:
    def __init__(self, name):
        self.name = name

    def describe(self):
        return f"Geometry: {self.name}"

class PointObject(GeometryObject):
    def __init__(self, x, y, name=""):
        super().__init__(name)
        self.point = QgsPointXY(x, y)
    
    def get_geometry(self):
        return QgsGeometry.fromPointXY(self.point)

class LineObject(GeometryObject):
    def __init__(self, points, name=""):
        super().__init__(name)
        self.points = [QgsPointXY(x, y) for x, y in points]
    
    def get_geometry(self):
        return QgsGeometry.fromPolylineXY(self.points)
```

👉 This approach makes it easy to add different types of objects.  

---

## 🔹 Adding different kinds of objects to a layer  

```python
class LayerManager:
    def __init__(self, geom_type="Point", layer_name="MyLayer"):
        self.layer = QgsVectorLayer(f"{geom_type}?crs=EPSG:4326", layer_name, "memory")
        self.provider = self.layer.dataProvider()
        self.provider.addAttributes([QgsField("Name", QVariant.String)])
        self.layer.updateFields()
        QgsProject.instance().addMapLayer(self.layer)
    
    def add_geometry(self, geom_object: GeometryObject):
        feat = QgsFeature()
        feat.setGeometry(geom_object.get_geometry())
        feat.setAttributes([geom_object.name])
        self.provider.addFeature(feat)
        self.layer.updateExtents()
```

**Usage:**  
```python
point = PointObject(44.8, 41.7, "Tbilisi")
line = LineObject([(44.8, 41.7), (41.6, 41.6)], "Tbilisi-Batumi")

manager = LayerManager("Point", "Cities")
manager.add_geometry(point)

line_manager = LayerManager("LineString", "Roads")
line_manager.add_geometry(line)
```

👉 Now we have a general class that works with both points and lines.  

---

## 🔹 PyQGIS classes in plugins  

QGIS plugins mainly use:  
- a **main class** (e.g. `MyPlugin`)  
- **GUI classes** (forms with PyQt)  
- **data classes** (spatial objects)  

👉 That is why knowing classes is essential for PyQGIS development.  

---

## 🔹 Best practices for PyQGIS classes  

- Use **modularity** (one class = one responsibility)  
- Class names should be descriptive (`PointLayerManager`, `RoadLine`)  
- Use **inheritance** to share common properties  
- Add **docstrings** and comments  
- Make testing easier with small classes  

---

## 🔹 Conclusion  

Python classes in PyQGIS:  
- keep the code organized  
- simplify working with layers, features and attributes  
- are essential for building plugins  

👉 Start with simple classes (e.g. Point + Layer Manager) and build more complex structures step by step. This way you can build professional GIS tools in QGIS. 🚀
