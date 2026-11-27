# 🎨 The QGIS QML and SLD formats

---

## 🧾 What is QML?

**QML (QGIS Markup Language)** is the file format QGIS uses to store **styling settings**.

QML files store how a layer should look in QGIS:
- the colour scheme
- symbols and strokes
- label styles
- size, transparency, shadows and other visual effects

---

## 📁 What does a QML file look like?

QML is a **text file in XML format**, so it can be read with any text editor (e.g. Notepad, VS Code).

For example:
```xml
<qgis>
  <renderer-v2 type="singleSymbol">
    <symbol alpha="1" type="marker">
      <layer pass="0" class="SimpleMarker" locked="0">
        <prop k="color" v="255,0,0,255"/>
      </layer>
    </symbol>
  </renderer-v2>
</qgis>
```

---

## 🖌️ What does a QML file store?

| Component         | Description |
|--------------------|--------|
| Renderer           | Which kind of styling it is (e.g. single symbol, categorized, graduated) |
| Symbol or Rule     | The specific style rules and settings |
| Labels             | Label settings |
| Transparency       | Transparency |
| Geometry Generator | Extra visualization of the geometry |

---

## 📦 Where is QML used?

- ✅ saving a layer style and reusing it
- ✅ sharing the same design between projects
- ✅ standardizing lab assignments
- ✅ quickly applying a style to many layers

---

## 🧭 How do you save and load QML?

### ➕ Saving QML:
1. Right-click the layer
2. Choose **Properties**
3. Go to **Symbology**
4. At the bottom choose **Style → Save Style → As QML...**

### 📂 Loading QML:
1. Properties → Symbology
2. Style → **Load Style...**
3. Choose the saved `.qml` file

---

## 🧪 Usage examples

- saving the styling of a lab assignment
- using the same style on different layers
- agreeing on colour codes in group work
- colour classes (graduated symbology)

---

## 🎓 Tips:

- Always save a QML style as a separate file so that you can reuse it.
- Use a naming system (e.g. `roads_symbology.qml`, `population_label.qml`)
- You can export and import it on another computer or share it with a friend.

---

## 📎 More links:

- [QGIS Documentation: Saving and loading styles](https://docs.qgis.org/3.40/en/docs/user_manual/working_with_vector/vector_properties.html#saving-and-loading-styles)
- [QGIS Style Sharing](https://plugins.qgis.org/styles/)


---


# 🧾 The QGIS SLD format and how it compares with QML

## 🌐 What is SLD?

**SLD (Styled Layer Descriptor)** is an open-standard XML file format used to define the styling of geographic layers. It was developed by the OGC (Open Geospatial Consortium) so that different GIS systems can share style information.

---

## 📁 What does an SLD file look like?

SLD is an XML text file. For example:

```xml
<StyledLayerDescriptor version="1.0.0">
  <NamedLayer>
    <Name>MyLayer</Name>
    <UserStyle>
      <Title>Red Points</Title>
      <FeatureTypeStyle>
        <Rule>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#FF0000</CssParameter>
                </Fill>
              </Mark>
              <Size>6</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
```

# 📦 Where SLD is used

**Styled Layer Descriptor (SLD)** is an **OGC** standard used in **GIS** systems to style maps. The main areas of use:

- 🌍 **GeoServer**, **MapServer**, **Web Map Services (WMS)**: **SLD** is the standard on these platforms.
- 🔄 **Transferring styles**: sharing styles between **QGIS** and other GIS servers.
- 🌐 **Styling internet maps**: the visual design of web maps.

---

## 📂 Using **SLD** in **QGIS**

### **Export**
1. Go to: **Properties → Symbology → Style → Save Style...**
2. Choose the **.sld** format.

### **Import**
1. Go to: **Properties → Symbology → Style → Load Style...**
2. Choose the **.sld** file.

---

## 🔄 **QML** vs **SLD**: comparison

| **Characteristic**       | **QML**                              | **SLD**                              |
|--------------------------|--------------------------------------|--------------------------------------|
| **Format**             | **XML** (QGIS's internal style)        | **XML** (OGC standard)             |
| **Support**          | **QGIS** only                     | **QGIS**, **GeoServer**, **MapServer** |
| **Use**         | Local projects                 | Web maps, **GIS** servers      |
| **Functionality**         | Broad, flexible                    | Standardized, sometimes limited  |
| **Area of use**   | Labs, fieldwork   | Web maps, **GeoServer** publishing |

---

## 🎓 **Recommendations**

| **Situation**                        | **Use QML** | **Use SLD** |
|--------------------------------------|:-----------------:|:-----------------:|
| Working on local projects         | ✅                | ❌                |
| Sharing a style from **QGIS** to **QGIS** | ✅         | ❌                |
| Working with **GeoServer**           | ❌                | ✅                |
| Styling **WMS** maps          | ❌                | ✅                |
| Full control over the style              | ✅                | ❌                |

---

## 📎 **Additional resources**
- 📖 [QGIS Documentation: SLD Support](https://docs.qgis.org/latest/en/docs/user_manual/working_with_vector/vector_properties.html#style-menu)
- 📜 [OGC Styled Layer Descriptor Specification](https://www.ogc.org/standards/sld)
