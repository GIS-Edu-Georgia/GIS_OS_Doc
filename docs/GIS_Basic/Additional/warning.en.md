# Warning


!!!danger 
    Georgian letters and any symbols other than the underscore _ are not allowed in the names of archives, folders, files, table columns, variables, functions, classes, arrays, tuples, etc. ❌

    Only latin_letters_and_underscores; letter case does not matter much.

!!!Tip
    Georgian text can be written into table cells following UTF-8 encoding rules, and data written in the Latin alphabet can be converted for display with Georgian fonts.


## Transliterator

If table columns already contain entries in Georgian letters, you can easily convert them to Latin letters with PyQGIS code, so that they work with a Georgian font.



Python code
![Transliter](/docs/images/PyQGIS_transliter_code_geo_to_eng.gif)

```py title="transliteration.py" linenums="1"
# the header part can be skipped if we use the QGIS console.
# from qgis.core import (
#     QgsProject,
#     QgsVectorLayer,
#     QgsField
# )
# from PyQt5.QtCore import QVariant

# function for converting Georgian letters to Latin letters
def georgian_to_latin(text):
    transliteration_map = {
        'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v', 'ზ': 'z', 
        'თ': 'T', 'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm', 'ნ': 'n', 'ო': 'o', 
        'პ': 'p', 'ჟ': 'J', 'რ': 'r', 'ს': 's', 'ტ': "t", 'უ': 'u', 
        'ფ': "f", 'ქ': "q", 'ღ': 'R', 'ყ': "y", 'შ': 'S', 'ჩ': 'C', 
        'ც': 'c', 'ძ': 'Z', 'წ': "w", 'ჭ': "W", 'ხ': 'x', 'ჯ': 'j', 
        'ჰ': 'h'
    }
    return ''.join(transliteration_map.get(char, char) for char in text)

# parameters
# the database
layer_path = "D:/GIS/werili/Geodatabase/bagdati.gdb"  
# the name of the layer in the database
layer_name = "Layer_name"  
# the column whose values are written in Georgian letters
input_field = "Layer_name"  
# the new column the information is copied into
output_field = "Layer_name"  

# load the vector layer
layer = QgsVectorLayer(f"{layer_path}|layername={layer_name}", layer_name, "ogr")

if not layer.isValid():
    print("Layer failed to load!")
else:
    print("Layer loaded successfully!")

# check whether the new column exists, add it, update
if output_field not in [field.name() for field in layer.fields()]:
    layer.dataProvider().addAttributes([QgsField(output_field, QVariant.String)])
    layer.updateFields()

# fill the column with the new values
with edit(layer):
    for feature in layer.getFeatures():
        georgian_text = feature[input_field]
        if georgian_text:  
            feature[output_field] = georgian_to_latin(georgian_text)
            layer.updateFeature(feature)

print("Transliteration complete.")

```

## Transliterator plugin

Search for Transliterator in the QGIS plugin repository

Author: Giorgi Kapanadze <br>
Author's email: g.kapanadze1908@gmail.com <br>
Maintainer: kapanadze <br>
Plugin home [page](https://ezdanapak.github.io/transliterator/) <br>
Tracker: Browse and report [bugs](https://github.com/ezdanapak/transliterator/issues) <br>
Code [repository](https://github.com/ezdanapak/transliterator) <br>
