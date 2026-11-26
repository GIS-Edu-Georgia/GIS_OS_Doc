# PyQGIS class hierarchy

---

## Inheritance

```
QObject  (Qt — base class, external library)
├── QgsMapLayer
│   ├── QgsVectorLayer
│   └── QgsRasterLayer
├── QgsProject
└── QgisInterface  (iface)
```

| Class | Parent | File |
|-------|---------|-------|
| `QgsVectorLayer` | `QgsMapLayer` | [PyQGIS_QgsVectorLayer.md](PyQGIS_QgsVectorLayer.md) |
| `QgsRasterLayer` | `QgsMapLayer` | [PyQGIS_QgsRasterLayer.md](PyQGIS_QgsRasterLayer.md) |
| `QgsProject` | `QObject` | [PyQGIS_QgsProject.md](PyQGIS_QgsProject.md) |
| `QgisInterface` (iface) | `QObject` | [PyQGIS_iface.md](PyQGIS_iface.md) |

---

## Composition ("has a" relationship)

```
QgsVectorLayer
└── contains QgsFeatures
    ├── .geometry()  →  QgsGeometry
    │                   └── uses  QgsPointXY
    │                   └── uses  QgsWkbTypes  (enum)
    └── .fields()    →  QgsFields
```

| Class | Contained by | File |
|-------|------------|-------|
| `QgsFeature` | `QgsVectorLayer` (its features) | [PyQGIS_QgsFeature.md](PyQGIS_QgsFeature.md) |
| `QgsGeometry` | `QgsFeature.geometry()` | [PyQGIS_QgsGeometry.md](PyQGIS_QgsGeometry.md) |
| `QgsPointXY` | `QgsGeometry` (point geometry) | [PyQGIS_QgsPointXY.md](PyQGIS_QgsPointXY.md) |
| `QgsWkbTypes` | `QgsGeometry` (defines the type) | [PyQGIS_QgsWkbTypes.md](PyQGIS_QgsWkbTypes.md) |
| `QgsFields` | `QgsFeature.fields()` | [PyQGIS_QgsFields.md](PyQGIS_QgsFields.md) |

---

## Helper / utility classes

Independent classes that do not inherit from the classes above:

| Class | Purpose | File |
|-------|------------|-------|
| `QgsCoordinateReferenceSystem` | Coordinate reference system (CRS) | [PyQGIS_QgsCoordinateReferenceSystem.md](PyQGIS_QgsCoordinateReferenceSystem.md) |
| `QgsExpressionContext` | Expression context | [PyQGIS_QgsExpressionContext.md](PyQGIS_QgsExpressionContext.md) |
| `QgsVectorFileWriter` | Writing vector files | [PyQGIS_QgsVectorFileWriter.md](PyQGIS_QgsVectorFileWriter.md) |
| `QVariant` | Qt's universal type | [PyQGIS_QVariant.md](PyQGIS_QVariant.md) |

---

## External libraries

| Library | Purpose | File |
|------------|------------|-------|
| OGR (GDAL) | Reading/writing vector data | [PyQGIS_OGR_Library.md](PyQGIS_OGR_Library.md) |

---

## Additional

| Name | Kind | File |
|--------|--------|-------|
| Shapefile structure | Concept | [PyQGIS_shapefile.md](PyQGIS_shapefile.md) |
| Paths and escape characters | Concept | [PyQGIS_paths_and_escape_characters.md](PyQGIS_paths_and_escape_characters.md) |
