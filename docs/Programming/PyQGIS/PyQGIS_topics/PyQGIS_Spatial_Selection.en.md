# Spatial selection of features — Select By Location

Spatial selection lets us find features by their spatial relationship to the geometry of **another layer** — e.g. "select all settlements that intersect the outline of the city of Sokhumi".

---

### Parameters used

| Parameter | Description |
|-----------|--------|
| `INPUT` | The layer in which the selection is made |
| `PREDICATE` | The spatial condition (see below) |
| `INTERSECT` | The "mask" layer — the selection is made relative to it |
| `METHOD` | The selection mode (new / add / remove) |

**`PREDICATE` values:**

| Code | Spatial condition |
|------|----------------|
| `0` | intersects |
| `1` | contains |
| `2` | disjoint — does not intersect |
| `3` | equals |
| `4` | touches |
| `5` | overlaps |
| `6` | within — is inside |
| `7` | crosses |

**`METHOD` values:**

| Code | Mode |
|------|--------|
| `0` | New selection |
| `1` | Add to the current selection |
| `2` | Remove from the current selection |
| `3` | Select within the current selection |

---

### Variation 1 — a simple selection with the whole layer

```py title="select_by_location_simple.py" linenums="1"
# file paths
fn_settlements = r'D:\Location\Settlements.shp'  # INPUT — where we make the selection
fn_sokhumi     = r'D:\Location\Sokhumi.shp'      # INTERSECT — the "mask"

# selection: all settlements that intersect the Sokhumi outline
processing.run(
    "native:selectbylocation",
    {
        'INPUT'    : fn_settlements,
        'PREDICATE': [0],            # 0 = intersects
        'INTERSECT': fn_sokhumi,
        'METHOD'   : 0               # 0 = new selection
    }
)
```

> 💡 **The simple case**: the **whole layer** is passed to `INTERSECT`.
> Every feature of the layer acts as the "mask".

---

### Variation 2 — selection with **selected features** (`selectedFeaturesOnly`)

```py title="select_by_location_selected.py" linenums="1"
from qgis.core import QgsProcessingFeatureSourceDefinition, QgsFeatureRequest

# file paths
fn_municipalities = r'D:\Location\Municipalitys.shp'  # INTERSECT — the "mask" (selected)
fn_settlements    = r'D:\Location\Settlements.shp'    # INPUT — where we make the selection

# selection: only settlements inside the selected municipality(ies)
processing.run(
    "native:selectbylocation",
    {
        'INPUT'    : fn_settlements,
        'PREDICATE': [0],            # 0 = intersects
        'INTERSECT': QgsProcessingFeatureSourceDefinition(
            fn_municipalities,
            selectedFeaturesOnly = True,   # selected features only
            featureLimit         = -1,     # no limit (-1 = all)
            geometryCheck        = QgsFeatureRequest.GeometryAbortOnInvalid
        ),
        'METHOD'   : 0
    }
)
```

> 💡 **`selectedFeaturesOnly=True`**: the "mask" is not the whole layer,
> but **only the features selected beforehand** (by hand or in code).
>
> ⚠️ **`GeometryAbortOnInvalid`**: the process stops on an invalid geometry.
> Alternative: `GeometrySkipInvalid` — the invalid feature is skipped (with a warning).

---

### Variation 3 — a full workflow (pipeline)

```py title="select_by_location_pipeline.py" linenums="1"
from qgis.core import QgsProcessingFeatureSourceDefinition, QgsFeatureRequest

# ---- 1. define the files ----
fn_municipalities = r'C:\Users\Public\GIS\PyGK\tema_3\Georgia_municipalities.shp'
fn_settlements    = r'C:\Users\Public\GIS\PyGK\tema_3\settlement.shp'

# ---- 2. spatial selection — by the selected municipality(ies) ----
processing.run(
    "native:selectbylocation",
    {
        'INPUT'    : fn_settlements,
        'PREDICATE': [0],
        'INTERSECT': QgsProcessingFeatureSourceDefinition(
            fn_municipalities,
            selectedFeaturesOnly = True,
            featureLimit         = -1,
            geometryCheck        = QgsFeatureRequest.GeometryAbortOnInvalid
        ),
        'METHOD'   : 0
    }
)

# ---- 3. load the layer onto the map ----
layer = iface.addVectorLayer(fn_settlements, 'Settlements', 'ogr')

if layer and layer.isValid():
    print(f"Layer loaded: {layer.name()}")
    print(f"Selected features: {layer.selectedFeatureCount()}")
else:
    print("⚠ Error: the layer failed to load")
```

> 💡 `iface.addVectorLayer(path, name, 'ogr')` adds the layer to the **Layers Panel**.
> The second argument (`'Settlements'`) is the layer name in QGIS.
> Passing an empty string (`''`) is allowed, but giving a name is recommended.

---

### Variation 4 — selection in code + printing the selected features

```py title="select_by_location_export.py" linenums="1"
from qgis.core import (
    QgsProcessingFeatureSourceDefinition,
    QgsFeatureRequest,
    QgsVectorLayer
)

fn_municipalities = r'C:\Users\Public\GIS\PyGK\tema_3\Georgia_municipalities.shp'
fn_settlements    = r'C:\Users\Public\GIS\PyGK\tema_3\settlement.shp'

# ---- 1. load the municipalities layer ----
muni_layer = QgsVectorLayer(fn_municipalities, 'Municipalities', 'ogr')

# ---- 2. select in code — e.g. the Tbilisi municipality ('თბილისი' as stored in the data) ----
muni_layer.selectByExpression('"name_ka" = \'თბილისი\'')

print(f"Selected municipality: {muni_layer.selectedFeatureCount()}")

# ---- 3. spatial selection ----
processing.run(
    "native:selectbylocation",
    {
        'INPUT'    : fn_settlements,
        'PREDICATE': [0],
        'INTERSECT': QgsProcessingFeatureSourceDefinition(
            fn_municipalities,
            selectedFeaturesOnly = True,
            featureLimit         = -1,
            geometryCheck        = QgsFeatureRequest.GeometryAbortOnInvalid
        ),
        'METHOD'   : 0
    }
)

# ---- 4. print the names of the selected settlements ----
sett_layer = iface.addVectorLayer(fn_settlements, 'Settlements', 'ogr')

for feat in sett_layer.selectedFeatures():
    print(f"  → {feat['name_ka']}")
```

---

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

> **Next topic:** `processing.run("native:saveselectedfeatures", {...})` — saving the selected features to a new file.
