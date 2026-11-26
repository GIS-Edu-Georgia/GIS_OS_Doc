# ESRI Shapefile — technical specification

> **Source:** ESRI White Paper — July 1998  
> **This page:** a structured summary for the documentation

---

## Contents

1. [Why Shapefile?](#why_shapefile)
2. [Technical description](#technical_description)
   - [File structure](#file_structure)
   - [Naming conventions](#naming_conventions)
   - [Numeric types](#numeric_types)
3. [Organization of the main file (.shp)](#organization_of_the_main_file_shp)
   - [Byte order](#byte_order)
   - [File header](#file_header)
   - [Record header](#record_header)
4. [Record contents: geometry types](#record_contents_geometry_types)
   - [Null Shape](#null_shape)
   - [Point](#point)
   - [MultiPoint](#multipoint)
   - [PolyLine](#polyline)
   - [Polygon](#polygon)
   - [Measured types (M)](#measured_types_m)
   - [Three-dimensional types (Z)](#three_dimensional_types_z)
   - [MultiPatch](#multipatch)
5. [Organization of the index file (.shx)](#organization_of_the_index_file_shx)
6. [Organization of the dBASE file (.dbf)](#organization_of_the_dbase_file_dbf)
7. [Glossary](#glossary)

---

## Why Shapefile?

A **shapefile** stores **non-topological geometry** and attribute information for spatial features. The geometry of each feature is stored as a set of vector coordinates.

### Advantages

- **Fast drawing**: there is no processing overhead for a topological data structure
- **Simple editing**: data is easy to change
- **Flexibility**: overlapping and non-contiguous features are supported
- **Compactness**: it usually needs less disk space
- **Accessibility**: easy to read and write

Shapefiles support **point**, **line** and **area** features. Area features are represented as **closed-loop, double-digitized** polygons. Attributes are kept in a **dBASE** format file, where each attribute record has a one-to-one relationship with the associated shape record.

### Ways to create a shapefile

| Method | Description |
|--------|---------|
| **Export** | Convert any data source using ARC/INFO, ArcView GIS, SDE or BusinessMAP |
| **Digitizing** | Draw directly with ArcView GIS tools |
| **Programming** | Use Avenue, MapObjects, AML or SML scripts |
| **Direct writing** | Write your own program following the specification |

---

## Technical description

### File structure

An ESRI shapefile consists of **three files**:

```
counties.shp   ← main file (geometry)
counties.shx   ← index file (offsets)
counties.dbf   ← dBASE table (attributes)
```

| File | Extension | Contents |
|-------|-----------|---------|
| Main file | `.shp` | Geometry — vector coordinates |
| Index file | `.shx` | Offsets of the records in the main file |
| dBASE table | `.dbf` | Attribute data |

**The main file** is a direct-access, variable-record-length file in which each record describes a shape with a list of its vertices.  
**The index file**: each record contains the offset of the corresponding main-file record from the beginning of the file.  
**The dBASE table** contains the attributes, one record per feature.

> ⚠️ The attribute records in the dBASE file **must be in the same order** as the shape records in the main file.

### Naming conventions

All file names follow the **8.3** format:

- the prefix is **the same** for all three files
- the prefix starts with an alphanumeric character (`a–Z`, `0–9`)
- followed by 0 to 7 characters (`a–Z`, `0–9`, `_`, `-`)
- on case-sensitive systems the file names are **lowercase**

### Numeric types

A shapefile uses two main numeric types:

| Type | Definition | Size |
|------|-----------|------|
| `Integer` | Signed 32-bit integer | 4 bytes |
| `Double` | Signed 64-bit IEEE double-precision floating point | 8 bytes |

> **"No data" value:** any floating-point number **smaller than –10³⁸** is treated as "no data". A shapefile does **not** store `+∞`, `–∞` or `NaN` values.

---

## Organization of the main file (.shp)

```
┌─────────────────────┐
│     File header     │  (100 bytes, fixed)
├─────────────────────┤
│    Record header    │  (8 bytes)
│   Record contents   │  (variable)
├─────────────────────┤
│    Record header    │
│   Record contents   │
├─────────────────────┤
│         ...         │
└─────────────────────┘
```

### Byte order

A shapefile uses **two** byte orders:

| Type | Order | Used for |
|------|--------|------------|
| **Big Endian** (Motorola / Sun) | Left to right | File management fields (length, offsets) |
| **Little Endian** (Intel / PC) | Right to left | Data fields (coordinates, shape type) |

### File header

The main file header is **100 bytes**. Positions are from the start of the file:

| Byte | Field | Value | Type | Order |
|-------|------|------------|------|--------|
| 0 | File Code | 9994 | Integer | Big |
| 4–20 | Unused | 0 | Integer | Big |
| 24 | File Length | File length (in 16-bit words) | Integer | Big |
| 28 | Version | 1000 | Integer | Little |
| 32 | Shape Type | Shape type | Integer | Little |
| 36 | Bounding Box Xmin | Double | Little | |
| 44 | Bounding Box Ymin | Double | Little | |
| 52 | Bounding Box Xmax | Double | Little | |
| 60 | Bounding Box Ymax | Double | Little | |
| 68* | Bounding Box Zmin | Double | Little | |
| 76* | Bounding Box Zmax | Double | Little | |
| 84* | Bounding Box Mmin | Double | Little | |
| 92* | Bounding Box Mmax | Double | Little | |

> \* 0.0 if the type is not Measured or Z

**File Length** = the total length of the file in 16-bit words (including the 50 words of the header).

#### Shape types

| Code | Type |
|------|------|
| 0 | Null Shape |
| 1 | Point |
| 3 | PolyLine |
| 5 | Polygon |
| 8 | MultiPoint |
| 11 | PointZ |
| 13 | PolyLineZ |
| 15 | PolygonZ |
| 18 | MultiPointZ |
| 21 | PointM |
| 23 | PolyLineM |
| 25 | PolygonM |
| 28 | MultiPointM |
| 31 | MultiPatch |

> ✏️ Currently all shapes in a file must be **of the same type**. Mixed types may be allowed in the future.

### Record header

Each record header is **8 bytes** (fixed):

| Byte | Field | Value | Type | Order |
|-------|------|------------|------|--------|
| 0 | Record Number | Record number (starts at 1) | Integer | Big |
| 4 | Content Length | Content length (in 16-bit words) | Integer | Big |

---

## Record contents: geometry types

### Null Shape

A null shape has no geometric data. It is used as a placeholder when creating a file.

| Byte | Field | Value | Type |
|-------|------|------------|------|
| 0 | Shape Type | 0 | Integer |

---

### Point

A point consists of a pair of double-precision **X, Y** coordinates.

```c
Point {
    Double X  // X coordinate
    Double Y  // Y coordinate
}
```

| Byte | Field | Type |
|-------|------|------|
| 0 | Shape Type (1) | Integer |
| 4 | X | Double |
| 12 | Y | Double |

---

### MultiPoint

Represents a set of points.

```c
MultiPoint {
    Double[4] Box        // Bounding Box (Xmin, Ymin, Xmax, Ymax)
    Integer   NumPoints  // number of points
    Point[NumPoints] Points  // the points
}
```

| Byte | Field | Type | Count |
|-------|------|------|----------|
| 0 | Shape Type (8) | Integer | 1 |
| 4 | Box | Double | 4 |
| 36 | NumPoints | Integer | 1 |
| 40 | Points | Point | NumPoints |

---

### PolyLine

A polyline is an **ordered set of vertices** consisting of one or more **parts**. A part is a connected sequence of two or more vertices. Parts may or may not be connected to one another.

```c
PolyLine {
    Double[4]        Box        // Bounding Box
    Integer          NumParts   // number of parts
    Integer          NumPoints  // total number of vertices
    Integer[NumParts] Parts     // index of the first vertex of each part
    Point[NumPoints] Points     // vertices of all parts
}
```

| Byte | Field | Type | Count |
|-------|------|------|----------|
| 0 | Shape Type (3) | Integer | 1 |
| 4 | Box | Double | 4 |
| 36 | NumParts | Integer | 1 |
| 40 | NumPoints | Integer | 1 |
| 44 | Parts | Integer | NumParts |
| X* | Points | Point | NumPoints |

> \* X = 44 + 4 × NumParts

**Field definitions:**
- **Box**: the bounding box in the order Xmin, Ymin, Xmax, Ymax
- **Parts**: an array (length = NumParts) holding, for each part, the index of its first vertex in the `Points` array (0-based)
- **Points**: the vertices of all parts in sequence; there is **no** delimiter between parts

---

### Polygon

A polygon consists of one or more **rings**. A ring is a **closed, non-self-intersecting** loop of four or more vertices. A polygon may have several outer rings.

```c
Polygon {
    Double[4]         Box        // Bounding Box
    Integer           NumParts   // number of rings
    Integer           NumPoints  // total number of vertices
    Integer[NumParts] Parts      // index of the first vertex of each ring
    Point[NumPoints]  Points     // vertices of all rings
}
```

| Byte | Field | Type | Count |
|-------|------|------|----------|
| 0 | Shape Type (5) | Integer | 1 |
| 4 | Box | Double | 4 |
| 36 | NumParts | Integer | 1 |
| 40 | NumPoints | Integer | 1 |
| 44 | Parts | Integer | NumParts |
| X* | Points | Point | NumPoints |

> \* X = 44 + 4 × NumParts

#### ⚠️ Important rules for polygons

1. **Rings are closed**: the first and last vertex must be **the same** point.
2. **Vertex order:**
   - **outer (solid) rings**: vertices in **clockwise** order
   - **hole rings**: vertices in **counterclockwise** order
3. **A "clean" polygon:**
   - must not **self-intersect**
   - segments of different rings must **not** cross (touching only at vertices is allowed)
4. The **order of the rings** in the Points array **does not matter**

**Example (NumParts=2, NumPoints=10 — a polygon with a hole):**
```
Parts:  [0, 5]
Points: [v1, v2, v3, v4, v1,  v5, v8, v7, v6, v5]
         ← outer ring →       ← hole (CCW) →
```

---

## Measured types (M)

M-type shapes have an extra **measure coordinate (M)**. A "no data" value may be given for M.

### PointM

```c
PointM {
    Double X  // X coordinate
    Double Y  // Y coordinate
    Double M  // measure
}
```

| Byte | Field | Type |
|-------|------|------|
| 0 | Shape Type (21) | Integer |
| 4 | X | Double |
| 12 | Y | Double |
| 20 | M | Double |

### MultiPointM

```c
MultiPointM {
    Double[4]        Box       // Bounding Box
    Integer          NumPoints // number of points
    Point[NumPoints] Points    // the points
    Double[2]        M Range   // Mmin, Mmax
    Double[NumPoints] M Array  // M values
}
```

| Byte | Field | Type | Count |
|-------|------|------|----------|
| 0 | Shape Type (28) | Integer | 1 |
| 4 | Box | Double | 4 |
| 36 | NumPoints | Integer | 1 |
| 40 | Points | Point | NumPoints |
| X* | Mmin | Double | 1 |
| X+8* | Mmax | Double | 1 |
| X+16* | Marray | Double | NumPoints |

> \* X = 40 + 16 × NumPoints · (\* optional)

### PolyLineM

```c
PolyLineM {
    Double[4]         Box
    Integer           NumParts
    Integer           NumPoints
    Integer[NumParts] Parts
    Point[NumPoints]  Points
    Double[2]         M Range   // Mmin, Mmax
    Double[NumPoints] M Array
}
```

| Byte | Field | Type | Count |
|-------|------|------|----------|
| 0 | Shape Type (23) | Integer | 1 |
| 4 | Box | Double | 4 |
| 36 | NumParts | Integer | 1 |
| 40 | NumPoints | Integer | 1 |
| 44 | Parts | Integer | NumParts |
| X | Points | Point | NumPoints |
| Y* | Mmin | Double | 1 |
| Y+8* | Mmax | Double | 1 |
| Y+16* | Marray | Double | NumPoints |

> X = 44 + 4×NumParts · Y = X + 16×NumPoints · (\* optional)

### PolygonM

The structure is **identical to PolyLineM** (Shape Type = 25). The rules are the same as for Polygon:
- rings are closed
- the order of the rings in Points does not matter

---

## Three-dimensional types (Z)

Z-type shapes have a **Z coordinate** and an **optional M measure**.

### PointZ

```c
PointZ {
    Double X
    Double Y
    Double Z
    Double M  // measure
}
```

| Byte | Field | Type |
|-------|------|------|
| 0 | Shape Type (11) | Integer |
| 4 | X | Double |
| 12 | Y | Double |
| 20 | Z | Double |
| 28 | M | Double |

### MultiPointZ

```c
MultiPointZ {
    Double[4]         Box
    Integer           NumPoints
    Point[NumPoints]  Points
    Double[2]         Z Range    // Zmin, Zmax
    Double[NumPoints] Z Array
    Double[2]         M Range    // Mmin, Mmax  (optional)
    Double[NumPoints] M Array    // (optional)
}
```

| Byte | Field | Type | Count |
|-------|------|------|------|
| 0 | Shape Type (18) | Integer | 1 |
| 4 | Box | Double | 4 |
| 36 | NumPoints | Integer | 1 |
| 40 | Points | Point | NumPoints |
| X | Zmin | Double | 1 |
| X+8 | Zmax | Double | 1 |
| X+16 | Zarray | Double | NumPoints |
| Y* | Mmin | Double | 1 |
| Y+8* | Mmax | Double | 1 |
| Y+16* | Marray | Double | NumPoints |

> X = 40 + 16×NumPoints · Y = X + 16 + 8×NumPoints

### PolyLineZ

```c
PolyLineZ {
    Double[4]         Box
    Integer           NumParts
    Integer           NumPoints
    Integer[NumParts] Parts
    Point[NumPoints]  Points
    Double[2]         Z Range
    Double[NumPoints] Z Array
    Double[2]         M Range    // optional
    Double[NumPoints] M Array    // optional
}
```

| Byte | Field | Type | Count |
|-------|------|------|------|
| 0 | Shape Type (13) | Integer | 1 |
| 4 | Box | Double | 4 |
| 36 | NumParts | Integer | 1 |
| 40 | NumPoints | Integer | 1 |
| 44 | Parts | Integer | NumParts |
| X | Points | Point | NumPoints |
| Y | Zmin | Double | 1 |
| Y+8 | Zmax | Double | 1 |
| Y+16 | Zarray | Double | NumPoints |
| Z* | Mmin | Double | 1 |
| Z+8* | Mmax | Double | 1 |
| Z+16* | Marray | Double | NumPoints |

> X = 44 + 4×NumParts · Y = X + 16×NumPoints · Z = Y + 16 + 8×NumPoints

### PolygonZ

The structure is **identical to PolyLineZ** (Shape Type = 15). The rules are the same as for Polygon:
- rings are closed
- Z values are stored end to end, with no delimiter between parts

---

## MultiPatch

A MultiPatch consists of a number of **surface patches**. Each patch describes a surface. The patch type determines how the order of the vertices is interpreted.

### Part types

| Code | Type | Description |
|------|------|---------|
| 0 | Triangle Strip | A chain of triangles — each new vertex forms a new triangle with the two previous vertices |
| 1 | Triangle Fan | A fan of triangles — each new vertex forms a triangle with the previous vertex and the first vertex |
| 2 | Outer Ring | The outer ring of a polygon |
| 3 | Inner Ring | A hole ring of a polygon |
| 4 | First Ring | The first ring of a polygon (type unspecified) |
| 5 | Ring | A ring of a polygon (type unspecified) |

```c
MultiPatch {
    Double[4]         Box
    Integer           NumParts
    Integer           NumPoints
    Integer[NumParts] Parts
    Integer[NumParts] PartTypes   // ← not present in PolyLine!
    Point[NumPoints]  Points
    Double[2]         Z Range
    Double[NumPoints] Z Array
    Double[2]         M Range     // optional
    Double[NumPoints] M Array     // optional
}
```

| Byte | Field | Type | Count |
|-------|------|------|------|
| 0 | Shape Type (31) | Integer | 1 |
| 4 | Box | Double | 4 |
| 36 | NumParts | Integer | 1 |
| 40 | NumPoints | Integer | 1 |
| 44 | Parts | Integer | NumParts |
| W | PartTypes | Integer | NumParts |
| X | Points | Point | NumPoints |
| Y | Zmin | Double | 1 |
| Y+8 | Zmax | Double | 1 |
| Y+16 | Zarray | Double | NumPoints |
| Z* | Mmin | Double | 1 |
| Z+8* | Mmax | Double | 1 |
| Z+16* | Marray | Double | NumPoints |

> W = 44 + 4×NumParts · X = W + 4×NumParts · Y = X + 16×NumPoints · Z = Y + 16 + 8×NumPoints

#### ⚠️ Important rules for MultiPatch

- **Ring-type parts** must be closed (first = last vertex)
- **The order of rings matters:** an Inner Ring must follow its Outer Ring
- A sequence of rings describing one surface patch must start with a First Ring
- Parts may **share boundaries**, but they **must not** intersect each other

---

## Organization of the index file (.shx)

```
┌─────────────────────┐
│     File header     │  (100 bytes — identical to the main file)
├─────────────────────┤
│       Record        │  (8 bytes, fixed)
├─────────────────────┤
│       Record        │
├─────────────────────┤
│         ...         │
└─────────────────────┘
```

**The header** is a **full copy** of the main file header (100 bytes). The difference: `File Length` is the total length of the index file in 16-bit words (50 words of header + 4 × number of records).

### Index record

**The I-th record** stores the offset and content length of the I-th record of the main file:

| Byte | Field | Type | Order |
|-------|------|------|--------|
| 0 | Offset | Integer | Big |
| 4 | Content Length | Integer | Big |

- **Offset**: the number of 16-bit words from the start of the file to the first byte of the record header
- The **offset of the first record = 50** (100-byte header ÷ 2)
- **Content Length** in the index record is **identical** to the value stored in the main file's record header

---

## Organization of the dBASE file (.dbf)

The `.dbf` file contains the **attributes**, or attribute keys that can be joined to other tables. It is the standard **DBF** format used by many Windows and DOS applications.

### Mandatory requirements

1. **File name**: the **same prefix** as the `.shp` and `.shx` files (extension: `.dbf`)
2. **Number of records**: **one record** per shape
3. **Record order**: **the same order** as the shapes in the main file
4. **Year value in the dBASE header**: the number of years since 1900

> 💡 Any combination of fields can be in the table; there are no restrictions on field names or types.

---

## Glossary

| Term | Definition |
|---------|-----------|
| **big endian** | A byte order where the "most significant" byte is on the left (first). UNIX systems: Sun, HP, IBM |
| **little endian** | A byte order where the "least significant" byte is on the left (first). PC/Windows systems |
| **Bounding Box** | A rectangle that exactly encloses a shape. Defined by: Xmin, Ymin, Xmax, Ymax |
| **coverage** | An ARC/INFO unit of vector data; stores geographic features with a topological structure |
| **feature** | A representation of a geographic object — geometry + a set of attributes |
| **index file** | The shapefile's index file — gives direct access to the main file's records |
| **MultiPoint** | A cluster of points linked to one attribute record |
| **NumPoints** | The total number of X,Y vertices in a shape |
| **PolyLine** | An ordered set of X,Y vertices representing a line or boundary |
| **ring** | A closed sequence of X,Y vertices (first = last vertex); a closed PolyLine or Polygon |
| **shapefile** | ArcView GIS data format that represents geographic features (point, line, area) |
| **theme** | A user-defined set of geographic features in ArcView GIS |
| **topology** | Spatial relationships between adjacent or connected features. **A shapefile does not store topology** |
| **vector** | A data structure for geographic features based on Cartesian (X,Y) coordinates |
| **vertex** | One pair of X,Y coordinates that makes up a line |

---
