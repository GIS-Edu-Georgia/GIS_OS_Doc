# Using the XML format in QGIS

**QGIS (Quantum GIS)** uses the **XML format** in many places, mainly for configuration and for describing data. Below is a list of the main cases.

---

## 🔧 1. Project files (.qgs / .qgz)

- `.qgs` is an XML file that stores the whole project configuration:
  - layer sources
  - styles (symbology)
  - projection (CRS)
  - print layouts
  - labelling and more

- `.qgz` is a compressed version that contains the `.qgs` XML file inside.

**Example:**
```xml
<qgis projectname="MyProject" version="3.40">
  <layer-tree-group name="Layers">
    <layer-tree-layer id="roads2020" name="Roads" ... />
  </layer-tree-group>
</qgis>
```

---

## 🗺️ 2. SLD (Styled Layer Descriptor)

- **SLD** is an OGC standard that describes layer styles in XML.
- It is used to transfer styles to other platforms, e.g. GeoServer.

---

## 🖼️ 3. QML files (QGIS Layer Style)

- **QML** is QGIS's own XML style format.
- It stores:
  - symbology
  - colour classification
  - labelling settings
- It is not the same as SLD, but both are XML formats.

---

## 🖨️ 4. Print templates (.qpt)

- `.qpt` files store map print templates in XML.
- They include elements such as the map, legend, logo, scale, etc.

---

## 📦 5. Processing models (.model3)

- `.model3` is a model saved in XML, used in the QGIS Processing Toolbox.
- It describes:
  - the tools
  - the parameters
  - how they connect

**Example:**
```xml
<model>
  <algorithm id="native:buffer">
    <parameter name="DISTANCE" value="10"/>
  </algorithm>
</model>
```

---

## 🔌 6. Plugin metadata

- QGIS plugins sometimes use a `metadata.xml` file for detailed information.
- This XML is used when registering a plugin in the QGIS Plugin Repository.

---

## 🧩 7. UI form templates (.ui)

- Forms created with Qt Designer are stored in XML files with the `.ui` extension.
- They are used to design QGIS attribute forms.

---

## 📝 Summary

| Use                      | Extension       | Format | Description |
|-------------------------------|------------------|---------|---------|
| Project                       | `.qgs`, `.qgz`   | XML     | All project settings |
| Layer style (QGIS standard)  | `.qml`           | XML     | Symbols, labels |
| Layer style (OGC standard)   | `.sld`           | XML     | Styled Layer Descriptor |
| Print template              | `.qpt`           | XML     | Map print design |
| Processing Toolbox model     | `.model3`        | XML     | A visual analytical model |
| Form design (Qt Designer)   | `.ui`            | XML     | Attribute form template |

---

If you have more questions, write to me with specific examples or use cases.
