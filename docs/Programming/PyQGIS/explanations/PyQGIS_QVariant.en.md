# QVariant in PyQGIS

## What is QVariant?

**QVariant** is a universal container in the Qt Framework that can hold data of different types.  
It is a "generic container" object used to pass data **between Qt components**.

For example, a `QVariant` can hold:
- integers (int)
- decimal numbers (float, double)
- strings (QString / Python str)
- boolean values (bool)
- dates and times (QDate, QTime, QDateTime)
- other Qt types or user-defined objects.

This variety lets us work with different data types through one interface.

---

## Why is QVariant used in PyQGIS?

In PyQGIS, `QVariant` often appears in these scenarios:

1. **Storing attributes in vector layers**  
   The fields of QGIS vector layers make up the table columns, and each attribute is stored in a `QVariant` object.

2. **QgsField field types**  
   When we create a new layer, a field is described by a `QgsField` object, where the data type is given with `QVariant`.

3. **Greater flexibility**  
   The same API can work with different data types; PyQGIS uses `QVariant` as a kind of "backbone".

---

## Main examples

### 1. QVariant in attributes

```python
from qgis.PyQt.QtCore import QVariant
from qgis.core import QgsField

# create a field that stores integers
field_id = QgsField("ID", QVariant.Int)

# create a field that stores text
field_name = QgsField("Name", QVariant.String)
```

In this example:
- `QVariant.Int` -> integer  
- `QVariant.String` -> text  

---

### 2. QVariant with different types

```python
from qgis.PyQt.QtCore import QVariant

# store as an integer
val_int = QVariant(42)
print(val_int.toInt())

# store as a string
val_str = QVariant("Tbilisi")
print(val_str.toString())

# store as a decimal number
val_float = QVariant(3.14)
print(val_float.toDouble())
```

**Note:** in PyQGIS/PyQt, `QVariant` objects have methods (`toInt()`, `toString()`, `toDouble()`) that can convert the value to the required type.

---

### 3. QVariant in vector layers

```python
from qgis.core import QgsVectorLayer, QgsField, QgsFields
from qgis.PyQt.QtCore import QVariant

# create a new layer in memory
layer = QgsVectorLayer("Point?crs=epsg:4326", "Cities", "memory")

# add fields
pr = layer.dataProvider()
fields = QgsFields()
fields.append(QgsField("ID", QVariant.Int))
fields.append(QgsField("Name", QVariant.String))

pr.addAttributes(fields)
layer.updateFields()
```

Here the field types are defined with the `QVariant` class.

---

## QVariant types in Qt/PyQGIS

The most frequently used `QVariant` types are:

| QVariant type | Description |
|---------------|---------|
| `QVariant.Int` | Integer |
| `QVariant.Double` | Decimal number |
| `QVariant.String` | Text |
| `QVariant.Bool` | Boolean value (True/False) |
| `QVariant.Date` | Date |
| `QVariant.Time` | Time |
| `QVariant.DateTime` | Date and time |
| `QVariant.LongLong` | Long integer |
| `QVariant.ByteArray` | Binary data |

---

## Practical tasks for students

1. Create a new Point layer with the fields:
   - ID (Int)
   - Name (String)
   - Population (Int)

2. Add at least 3 records (for example, about Tbilisi, Kutaisi and Batumi).

3. Save the layer in `GeoPackage` format.  
   Check in the file that the field types are set correctly.

---

## Conclusion

- `QVariant` is a universal container used in Qt and PyQGIS to store and pass data of different types.  
- It often appears in **QgsField**, in **attribute management** and in data **conversion**.  
- To use PyQGIS effectively, it is important to understand how `QVariant` works and how it converts to the required data type.
