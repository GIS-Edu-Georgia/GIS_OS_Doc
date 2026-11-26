# 🧩 PyQGIS — Raster & Vector Operations

This page contains several practical PyQGIS examples:
- reclassifying raster data  
- raster symbology (colour display)  
- calculating volume on a DEM  
- selecting neighbouring features  
- generating a map automatically in a Layout  
- using the `with...as` construct to work with files  

---





---

## 🗺️ **QGIS Layout Export — creating and exporting a map automatically**

👉 An example of how to create a map layout in code and export it to PDF.

```python
from qgis.PyQt import QtGui

layers = QgsProject.instance().mapLayersByName('stream_order')
layer = layers[0]

project = QgsProject.instance()
manager = project.layoutManager()
layoutName = 'Layout1'
layouts_list = manager.printLayouts()

# remove the old layout if it already exists
for layout in layouts_list:
    if layout.name() == layoutName:
        manager.removeLayout(layout)

layout = QgsPrintLayout(project)
layout.initializeDefaults()
layout.setName(layoutName)
manager.addLayout(layout)

# create the map item
map = QgsLayoutItemMap(layout)
map.setRect(20, 20, 20, 20)

ms = QgsMapSettings()
ms.setLayers([layer])
rect = QgsRectangle(ms.fullExtent())
rect.scale(1.0)
ms.setExtent(rect)
map.setExtent(rect)
map.setBackgroundColor(QColor(255, 255, 255, 0))
layout.addLayoutItem(map)

map.attemptMove(QgsLayoutPoint(5, 20, QgsUnitTypes.LayoutMillimeters))
map.attemptResize(QgsLayoutSize(180, 180, QgsUnitTypes.LayoutMillimeters))

# legend
legend = QgsLayoutItemLegend(layout)
legend.setTitle("Legend")
layerTree = QgsLayerTree()
layerTree.addLayer(layer)
legend.model().setRootGroup(layerTree)
layout.addLayoutItem(legend)
legend.attemptMove(QgsLayoutPoint(230, 15, QgsUnitTypes.LayoutMillimeters))

# scale bar
scalebar = QgsLayoutItemScaleBar(layout)
scalebar.setStyle('Line Ticks Up')
scalebar.setUnits(QgsUnitTypes.DistanceKilometers)
scalebar.setNumberOfSegments(4)
scalebar.setNumberOfSegmentsLeft(0)
scalebar.setUnitsPerSegment(0.5)
scalebar.setLinkedMap(map)
scalebar.setUnitLabel('km')
scalebar.setFont(QFont('Arial', 14))
scalebar.update()
layout.addLayoutItem(scalebar)
scalebar.attemptMove(QgsLayoutPoint(220, 190, QgsUnitTypes.LayoutMillimeters))

# title
title = QgsLayoutItemLabel(layout)
title.setText("My Title")
title.setFont(QFont('Arial', 24))
title.adjustSizeToText()
layout.addLayoutItem(title)
title.attemptMove(QgsLayoutPoint(10, 5, QgsUnitTypes.LayoutMillimeters))

layout = manager.layoutByName(layoutName)
exporter = QgsLayoutExporter(layout)

fn = 'C:/temp/layout_export.pdf'
exporter.exportToPdf(fn, QgsLayoutExporter.PdfExportSettings())
```

---

## 📘 **The with…as construct**

👉 `with` is used when opening files and other resources — it closes the file automatically after use.

```python
with open(r'C:\Users\kapo\Desktop\koordinatebi.txt') as X:
    a = X.read()
    print(a)
```

---

✅ **Conclusion:**  
PyQGIS lets you automate both raster and vector operations — from processing data to generating maps.

---
