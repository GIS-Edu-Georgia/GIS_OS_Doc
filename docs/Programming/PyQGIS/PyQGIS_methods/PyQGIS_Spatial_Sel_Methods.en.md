# Spatial selection methods

### 📋 Methods summary

| Method | Use |
|--------|-----------|
| `processing.run("native:selectbylocation", {...})` | Spatial selection |
| `QgsProcessingFeatureSourceDefinition(path, selectedFeaturesOnly=True)` | Use the selected features as a mask |
| `iface.addVectorLayer(path, name, 'ogr')` | Load a layer onto the map |
| `layer.selectedFeatureCount()` | Number of selected features |
| `layer.selectedFeatures()` | Iterate over the selected features |
| `layer.selectByExpression("\"field\" = 'value'")` | Select by expression |

---
