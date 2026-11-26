# 🌍 OOP examples with geographic objects and their use in PyQGIS

## Introduction
Object-Oriented Programming (OOP) is a programming paradigm that helps us organize code and model it closely on the real world.  
In GIS (Geographic Information Systems) this is especially important, because geographic objects can naturally be described as **classes** and **objects**.

---

## 🎯 Core principles of OOP

- **Class** — a template that describes an object (e.g. "Point", "Polygon").  
- **Object** — a concrete instance of a class (e.g. `Tbilisi = Point(41.7, 44.8)`).  
- **Attributes** — the object's characteristics (e.g. coordinates, colour, name).  
- **Methods** — actions the object performs (e.g. "calculate the length", "draw on the map").  
- **Inheritance** — a structure where classes inherit from each other (e.g. `Geometry` → `Point`, `Line`, `Polygon`).  
- **Polymorphism** — different implementations of the same method for different classes.

---

## 📌 Example: a point as an object

```python
class Point:
    def __init__(self, x, y, name=""):
        self.x = x
        self.y = y
        self.name = name

    def __repr__(self):
        return f"Point({self.name}: {self.x}, {self.y})"
    
    def distance_to(self, other):
        return ((self.x - other.x)**2 + (self.y - other.y)**2)**0.5

# objects
tbilisi = Point(44.8, 41.7, "Tbilisi")
batumi = Point(41.6, 41.65, "Batumi")

print(tbilisi)
print("Distance:", tbilisi.distance_to(batumi))
```

📍 Result: describing the objects and calculating the distance between them.

---

## 📌 Example: a line and its length

```python
class Line:
    def __init__(self, points):
        self.points = points
    
    def length(self):
        length = 0
        for i in range(len(self.points)-1):
            length += self.points[i].distance_to(self.points[i+1])
        return length

# objects
p1 = Point(0, 0)
p2 = Point(3, 4)
p3 = Point(6, 8)

line = Line([p1, p2, p3])
print("Line length:", line.length())
```

📏 Result: line length = the sum of the distances between the points.

---

## 📌 Example: a polygon and its area

```python
class Polygon:
    def __init__(self, points):
        self.points = points
    
    def area(self):
        # Shoelace formula
        n = len(self.points)
        area = 0
        for i in range(n):
            j = (i + 1) % n
            area += self.points[i].x * self.points[j].y
            area -= self.points[j].x * self.points[i].y
        return abs(area) / 2

# a triangle
triangle = Polygon([Point(0,0), Point(4,0), Point(4,3)])
print("Area:", triangle.area())
```

📐 Result: calculating the polygon's area.

---

## 🌐 Use in PyQGIS

PyQGIS is the Python API for QGIS. Here the classes already exist:  
- `QgsPointXY` — a point  
- `QgsGeometry` — a geometry  
- `QgsFeature` — an object with attributes  
- `QgsVectorLayer` — a layer

### 📌 PyQGIS example: creating a point and adding it to the map

```python
from qgis.core import QgsProject, QgsPointXY, QgsGeometry, QgsFeature, QgsVectorLayer

# create the layer
layer = QgsVectorLayer("Point?crs=EPSG:4326", "Cities", "memory")
prov = layer.dataProvider()

# add attributes
layer.startEditing()
prov.addAttributes([QgsField("Name", QVariant.String)])
layer.updateFields()

# create the object
feat = QgsFeature()
feat.setGeometry(QgsGeometry.fromPointXY(QgsPointXY(44.8, 41.7)))
feat.setAttributes(["Tbilisi"])
prov.addFeatures([feat])
layer.commitChanges()

# add the layer to the project
QgsProject.instance().addMapLayer(layer)
```

📍 Result: a point (Tbilisi) is added to the map.

---

## 📌 PyQGIS example: calculating a line's length

```python
from qgis.core import QgsGeometry, QgsPointXY

line = QgsGeometry.fromPolylineXY([
    QgsPointXY(0,0), QgsPointXY(3,4), QgsPointXY(6,8)
])

print("Line length:", line.length())
```

📏 Result: the length is calculated in the CRS units.

---

## 📌 PyQGIS example: calculating a polygon's area

```python
from qgis.core import QgsGeometry, QgsPointXY

polygon = QgsGeometry.fromPolygonXY([[
    QgsPointXY(0,0),
    QgsPointXY(4,0),
    QgsPointXY(4,3),
    QgsPointXY(0,0)
]])

print("Polygon area:", polygon.area())
```

📐 Result: calculating the polygon's area.

---

## 🚀 Best practices for OOP in GIS

1. **Describe geographic objects with classes** — this makes the code understandable and reusable.  
2. **Use inheritance** — create a parent `Geometry` class and children (`Point`, `Line`, `Polygon`).  
3. **Connect Python classes to the PyQGIS API** — as in the example, your classes can have a method that returns a `QgsGeometry` object.  
4. **Use attributes in classes** — GIS objects often have a name, category, colour.  
5. **Documentation** — for students it is very important to explain what each class and method does.

---

## Conclusion

OOP is a powerful approach in GIS projects.  
- Geographic objects can easily be described with classes.  
- PyQGIS already provides implementations of many classes.  
- Used correctly, it lets you write structured, understandable and reusable code.

➡️ **Next step for students:** try to create your own `Geometry` class that works with PyQGIS and has methods for calculating area, length and distance.
