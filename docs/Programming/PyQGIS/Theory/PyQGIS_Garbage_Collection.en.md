# 📌 PyQGIS: creating a Shapefile and garbage collection

> **QGIS 3.22 – 3.44+ | modern API | technical guide**

The classic `QgsVectorFileWriter` + `del writer` approach **still works**, but modern QGIS has safer and more elegant ways.

---

## 📋 Contents

1. [Example code — the old, reliable style](#example_code)
2. [What is the garbage collector?](#what_is_the_garbage_collector)
3. [The lifecycle of QgsVectorFileWriter](#lifecycle)
4. [Without del writer — what happens?](#without_del_writer_what_happens)
5. [The modern approach (QGIS 3.22+)](#modern_approach)
6. [try / finally — best practice](#try_finally_best_practice)
7. [Context manager — `with` style](#context_manager_with_style)
8. [Full example — writing features](#full_example_writing_features)
9. [TL;DR — quick decision table](#tldr)

---

## 🧾 Example code

### The old (but reliable) style

```python
from qgis.core import (
    QgsVectorFileWriter,
    QgsFields,
    QgsField,
    QgsWkbTypes,
    QgsCoordinateReferenceSystem
)
from PyQt5.QtCore import QVariant

shapefile_path = r'C:\Users\Public\Documents\GIS\shapefile\saxli.shp'

# define the fields
fields = QgsFields()
fields.append(QgsField('ID',      QVariant.Int))
fields.append(QgsField('Field_1', QVariant.String))
fields.append(QgsField('Field_2', QVariant.Double))

# create the writer
writer = QgsVectorFileWriter(
    shapefile_path,
    'UTF-8',
    fields,
    QgsWkbTypes.Point,
    QgsCoordinateReferenceSystem('EPSG:32638'),
    'ESRI Shapefile'
)

# ... write features here ...

del writer  # ⚠️ this line is required!
```

> ⚠️ **Warning:** without `del writer` the file may stay **incomplete** or **locked**!

---

## ♻️ What is the garbage collector?

Python manages memory automatically: when there are no more **references** to an object, the GC deletes it.

**The problem in PyQGIS** is its two-layer architecture:

```
┌─────────────────────────────┐
│   Python (SIP wrapper)      │  ← the GC sees this layer
├─────────────────────────────┤
│   C++ (file, buffer, lock)  │  ← the GC does not always see this layer
└─────────────────────────────┘
```

👉 **Result:** Python's GC may "remember" to delete the object but not call the C++ destructor, and the file is left open and unflushed.

---

## 🔄 Lifecycle

```
writer = QgsVectorFileWriter(...)   →   ✅ the file is opened + locked
          ↓
addFeature(feat)                    →   📦 data in the buffer
          ↓
del writer  (or GC)                 →   🔧 the C++ destructor is called
          ↓
file closed + last data written     →   ✅ done
```

---

## ❌ Without `del writer` — what happens?

| Problem | Result | Where it often happens |
|----------|--------|-----------------|
| 🔒 The file stays **locked** | `"File in use"` — cannot delete/move it | Always on Windows |
| 💾 The last features are **not written** | The `.shp` file is incomplete, sometimes 0 KB | On any OS |
| 🧠 **Memory leak** in a loop | `Out of Memory` / QGIS freezes | In large loops |

---

## 🚀 Modern approach

### `create()` + `SaveVectorOptions` (QGIS 3.22+)

```python
from qgis.core import (
    QgsVectorFileWriter,
    QgsCoordinateTransformContext,
    QgsProject
)

options = QgsVectorFileWriter.SaveVectorOptions()
options.driverName   = "ESRI Shapefile"
options.fileEncoding = "UTF-8"
# options.actionOnExistingFile = QgsVectorFileWriter.CreateOrOverwriteFile

transform_context = QgsProject.instance().transformContext()

writer = QgsVectorFileWriter.create(
    shapefile_path,
    fields,
    QgsWkbTypes.Point,
    QgsCoordinateReferenceSystem('EPSG:32638'),
    transform_context,
    options
)

if writer.hasError() != QgsVectorFileWriter.NoError:
    print("❌ Error:", writer.errorMessage())
else:
    # ... addFeature(feat) ...
    del writer
    print("✅ File created successfully")
```

### Exporting a layer directly

```python
# if you have an existing QgsVectorLayer
error, new_file, _, _ = QgsVectorFileWriter.writeAsVectorFormatV3(
    layer,
    shapefile_path,
    transform_context,
    options
)

if error == QgsVectorFileWriter.NoError:
    print("✅ Export finished — no del needed!")
```

> ✅ With `writeAsVectorFormatV3` you **don't need `del`**, because the writer lives in an internal scope.

---

## 🛡️ `try / finally` — best practice

```python
writer = QgsVectorFileWriter.create(
    shapefile_path,
    fields,
    QgsWkbTypes.Point,
    QgsCoordinateReferenceSystem('EPSG:32638'),
    QgsProject.instance().transformContext(),
    options
)

try:
    for feature in features:
        writer.addFeature(feature)
    print(f"✅ {len(features)} features written")

except Exception as e:
    print(f"❌ Error: {e}")

finally:
    del writer  # guaranteed cleanup — even on error!
    print("🔒 File closed safely")
```

> 💡 The `finally` block **always** runs — even when an exception occurs — which guarantees the cleanup.

---

## 🧩 Context manager — `with` style

### The problem: `QgsVectorFileWriter` has no built-in `with`

`QgsVectorFileWriter` is **not** a native context manager — it has no `__enter__` / `__exit__` methods. So you **cannot** use it directly like this:

```python
# ❌ this does not work!
with QgsVectorFileWriter(...) as writer:
    writer.addFeature(feat)
```

### Solution 1 — `contextlib.contextmanager` (simple)

```python
from contextlib import contextmanager
from qgis.core import QgsVectorFileWriter, QgsProject

@contextmanager
def vector_writer(path, fields, geom_type, crs, options):
    """
    A context manager wrapper for QgsVectorFileWriter.
    Cleans up automatically at the end of the with block.
    """
    writer = QgsVectorFileWriter.create(
        path, fields, geom_type, crs,
        QgsProject.instance().transformContext(),
        options
    )
    if writer.hasError() != QgsVectorFileWriter.NoError:
        raise RuntimeError(f"Writer error: {writer.errorMessage()}")
    try:
        yield writer          # ← this "writer" is what you get in "as"
    finally:
        del writer            # ← always runs at the end of the with block
        print("✅ File closed")


# usage:
with vector_writer(shapefile_path, fields, QgsWkbTypes.Point, crs, options) as writer:
    for feat in features:
        writer.addFeature(feat)
# ← here del has already happened automatically
```

> ✅ **Advantage:** you no longer have to think about `del` — the `finally` block always takes care of it.

---

### Solution 2 — a wrapper class with `__enter__` / `__exit__` (object-oriented)

```python
from qgis.core import (
    QgsVectorFileWriter, QgsFields, QgsWkbTypes,
    QgsCoordinateReferenceSystem, QgsProject
)

class ShapefileWriter:
    """
    An OOP wrapper for QgsVectorFileWriter with context manager support.

    Usage:
        with ShapefileWriter(path, fields, geom_type, crs) as writer:
            writer.addFeature(feat)
    """

    def __init__(self, path, fields, geom_type, crs, options=None):
        self.path      = path
        self.fields    = fields
        self.geom_type = geom_type
        self.crs       = crs
        self.options   = options or self._default_options()
        self._writer   = None

    @staticmethod
    def _default_options():
        opts = QgsVectorFileWriter.SaveVectorOptions()
        opts.driverName   = "ESRI Shapefile"
        opts.fileEncoding = "UTF-8"
        return opts

    def __enter__(self):
        self._writer = QgsVectorFileWriter.create(
            self.path, self.fields, self.geom_type, self.crs,
            QgsProject.instance().transformContext(),
            self.options
        )
        if self._writer.hasError() != QgsVectorFileWriter.NoError:
            raise RuntimeError(self._writer.errorMessage())
        return self._writer    # ← this is what you get in "as writer"

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self._writer is not None:
            del self._writer   # ← guaranteed cleanup
            self._writer = None
        if exc_type:
            print(f"❌ Exception: {exc_val}")
        else:
            print(f"✅ '{self.path}' — created successfully")
        return False           # ← False = the exception is passed on


# usage:
with ShapefileWriter(shapefile_path, fields, QgsWkbTypes.Point, crs) as writer:
    for feat in features:
        writer.addFeature(feat)
```

> 💡 **Why `return False`?** In `__exit__`, `False` means the exception is **not suppressed** — it "bubbles up" again. `True` would suppress it, which is usually undesirable.

---

### Comparing the approaches

```
┌──────────────────┬───────────────────┬──────────────────┬──────────────────┐
│ Approach         │ Auto cleanup      │ Code simplicity  │ Recommendation   │
├──────────────────┼───────────────────┼──────────────────┼──────────────────┤
│ del writer       │ ❌ by hand        │ ✅ simple        │ old code         │
│ try / finally    │ ✅ guaranteed     │ 🔶 medium        │ ✅ good          │
│ contextmanager   │ ✅ guaranteed     │ ✅ simple        │ ✅ good          │
│ wrapper class    │ ✅ guaranteed     │ ✅ elegant       │ ⭐ best          │
└──────────────────┴───────────────────┴──────────────────┴──────────────────┘
```

---

## 📝 Full example — writing features

Below is an **end-to-end** example: from defining the fields to creating the features and writing them to a Shapefile. Coordinates are in **EPSG:32638** (UTM Zone 38N, Georgia).

```python
from qgis.core import (
    QgsVectorFileWriter,
    QgsFields,
    QgsField,
    QgsFeature,
    QgsGeometry,
    QgsPointXY,
    QgsWkbTypes,
    QgsCoordinateReferenceSystem,
    QgsProject
)
from PyQt5.QtCore import QVariant
from contextlib import contextmanager

# ──────────────────────────────────────────────
# 1. Configuration
# ──────────────────────────────────────────────
OUTPUT_PATH = r'C:\Users\Public\Documents\GIS\shapefile\houses.shp'
CRS         = QgsCoordinateReferenceSystem('EPSG:32638')  # UTM 38N — Georgia

# ──────────────────────────────────────────────
# 2. Defining the fields (columns)
# ──────────────────────────────────────────────
fields = QgsFields()
fields.append(QgsField('id',        QVariant.Int))
fields.append(QgsField('name',      QVariant.String, len=100))
fields.append(QgsField('area',      QVariant.Double, prec=2))
fields.append(QgsField('residents', QVariant.Int))

# ──────────────────────────────────────────────
# 3. Sample data (a list of houses)
# ──────────────────────────────────────────────
houses_data = [
    # (id,  name,                     area,  residents, x_utm,     y_utm     )
    (1,  'House N1 — Tbilisi',      120.5,   4,        490230.0,  4741850.0),
    (2,  'House N2 — Rustavi',       85.0,   2,        501100.0,  4732400.0),
    (3,  'House N3 — Gori',         210.0,   6,        432700.0,  4740600.0),
    (4,  'House N4 — Kutaisi',       95.5,   3,        340850.0,  4738200.0),
    (5,  'House N5 — Batumi',       175.0,   5,        241950.0,  4616300.0),
]

# ──────────────────────────────────────────────
# 4. Context manager (contextlib style)
# ──────────────────────────────────────────────
@contextmanager
def vector_writer(path, fields, geom_type, crs):
    options = QgsVectorFileWriter.SaveVectorOptions()
    options.driverName   = "ESRI Shapefile"
    options.fileEncoding = "UTF-8"
    options.actionOnExistingFile = QgsVectorFileWriter.CreateOrOverwriteFile

    writer = QgsVectorFileWriter.create(
        path, fields, geom_type, crs,
        QgsProject.instance().transformContext(),
        options
    )
    if writer.hasError() != QgsVectorFileWriter.NoError:
        raise RuntimeError(f"❌ Could not create the writer: {writer.errorMessage()}")
    try:
        yield writer
    finally:
        del writer   # C++ destructor → file closed + flushed

# ──────────────────────────────────────────────
# 5. Creating and writing the features
# ──────────────────────────────────────────────
written_count = 0

with vector_writer(OUTPUT_PATH, fields, QgsWkbTypes.Point, CRS) as writer:

    for row in houses_data:
        feat_id, name, area, residents, x, y = row

        # 5a. create the feature object
        feat = QgsFeature(fields)

        # 5b. geometry — Point
        feat.setGeometry(QgsGeometry.fromPointXY(QgsPointXY(x, y)))

        # 5c. fill in the attributes
        feat['id']        = feat_id
        feat['name']      = name
        feat['area']      = area
        feat['residents'] = residents

        # 5d. write the feature
        if writer.addFeature(feat):
            written_count += 1
            print(f"  ✅ [{feat_id}] {name}")
        else:
            print(f"  ❌ [{feat_id}] writing failed!")

# ── the with block ended → del happened automatically ──
print(f"\n📊 Total written: {written_count} / {len(houses_data)} features")
print(f"📁 File: {OUTPUT_PATH}")
```

### Expected output

```
  ✅ [1] House N1 — Tbilisi
  ✅ [2] House N2 — Rustavi
  ✅ [3] House N3 — Gori
  ✅ [4] House N4 — Kutaisi
  ✅ [5] House N5 — Batumi

📊 Total written: 5 / 5 features
📁 File: C:\Users\Public\Documents\GIS\shapefile\houses.shp
```

---

### 🗺️ How the features are written

```
houses_data (list of tuples)
        │
        ▼
  for row in houses_data:
        │
        ├── QgsFeature(fields)            ← frame/template
        │
        ├── setGeometry(QgsPointXY(x,y))  ← coordinate
        │
        ├── feat['name'] = value          ← attributes
        │
        └── writer.addFeature(feat)       ← written to the buffer
                                                 │
                                    del writer  (with __exit__)
                                                 │
                                    C++ flush → disk ✅
```

> 💡 **A note on field length:** `QgsField('name', QVariant.String, len=100)` — in an ESRI Shapefile the maximum string length is **254 characters**. For Georgian Unicode characters, **100–150** is a good limit.

---

## ⭐ TL;DR

### Quick decision table (2025–2026)

| Situation | Recommendation | Is `del` required? |
|----------|-------------|-------------------|
| A simple one-off writer | `create()` + `del writer` | ✅ by hand |
| Exporting a layer | `writeAsVectorFormatV3()` | ❌ no |
| Writing many files in a loop | `try / finally` + `del writer` | ✅ by hand |
| Clean, modular code | `contextmanager` wrapper | ✅ automatic |
| OOP / a reusable class | `ShapefileWriter` (`__exit__`) | ✅ automatic |
| Maximum stability | any `with` approach | ✅ guaranteed |

---

### 💎 The key message

```
PyQGIS  =  Python  +  C++
GC      ≠  enough
```

- **`del writer`**: always use it with writers you create by hand
- **`try / finally`**: guaranteed cleanup in any scenario
- **`contextmanager`**: a clean `with` style with minimal code
- **The `ShapefileWriter` class**: an OOP approach, reusable across the project
- **`writeAsVectorFormatV3`**: the cleanest way to export layers

---

*API used: QGIS 3.22–3.44+ | PyQGIS | SIP wrapper | C++ destructor pattern*

## The C++ destructor in the PyQGIS context

> **C++ | Python | SIP Wrapper | PyQGIS | memory management**

A **destructor** is a special method of a C++ class that is called **automatically** when an object is destroyed. It releases resources: closes files, frees memory, closes connections.

---

## 📋 Contents (destructor)

1. [What is a destructor?](#what_is_a_destructor)
2. [C++ vs Python — lifecycle](#c_vs_python_lifecycle)
3. [SIP wrapper — two-layer architecture](#sip_wrapper_two_layer_architecture)
4. [The problem in PyQGIS](#the_problem_in_pyqgis)
5. [`del` — calling the C++ destructor by hand](#del_calling_the_c_destructor_by_hand)
6. [QgsVectorFileWriter — full lifecycle](#qgsvectorfilewriter_full_lifecycle)
7. [Cleanup patterns](#cleanup_patterns)
8. [Other PyQGIS classes that need cleanup](#other_pyqgis_classes_that_need_cleanup)

---

## 🔧 What is a destructor?

In C++ every class can have a **constructor** and a **destructor**:

```cpp
class QgsVectorFileWriter {
public:
    // constructor — the object is created
    QgsVectorFileWriter(const QString& path, ...) {
        // ✅ the file is opened
        // ✅ a buffer is allocated
        // ✅ a lock is taken
    }

    // destructor — the object is destroyed
    ~QgsVectorFileWriter() {
        // ✅ the buffer is written to disk (flush)
        // ✅ the file is closed
        // ✅ the lock is released
        // ✅ the memory is freed
    }
};
```

### Properties of a destructor

```
✅ automatic      — C++ calls it itself when the object leaves its scope
✅ only one       — a class can have only one destructor
✅ no parameters  — ~ClassName() — takes no arguments
✅ guaranteed     — in C++ it is always called for stack objects
```

### Automatic call in C++

```cpp
void someFunction() {
    QgsVectorFileWriter writer("output.shp", ...);  // constructor

    writer.addFeature(feat1);
    writer.addFeature(feat2);

}   // ← the function ends → ~QgsVectorFileWriter() automatically!
    //   the file is closed, the buffer is written
```

---

## ⚖️ C++ vs Python — lifecycle

C++ and Python manage object lifetimes **completely differently**:

### C++ — deterministic destruction

```cpp
// C++ — we know exactly where the object is destroyed
{
    Writer w("file.shp");   // constructor — exactly here
    w.addFeature(f);
}                           // destructor — exactly here, at the end of the scope
                            // "deterministic" — predictable in advance
```

### Python — non-deterministic GC

```python
# Python — we cannot know exactly where it is cleaned up
writer = SomePythonObject()
writer.do_something()
writer = None    # the reference is gone... but when will the GC clean up?
                 # maybe now, maybe later — "non-deterministic"
```

### The main difference

```
┌──────────────────────┬──────────────────────────────────────────────┐
│ C++                  │ Python                                       │
├──────────────────────┼──────────────────────────────────────────────┤
│ The destructor runs  │ __del__ is called... sometime, somewhere     │
│ at an exact moment   │                                              │
├──────────────────────┼──────────────────────────────────────────────┤
│ Stack object →       │ Reference count = 0 →                        │
│ scope exit = destroy │ the GC decides when to clean up              │
├──────────────────────┼──────────────────────────────────────────────┤
│ "I control memory"   │ "GC controls memory"                         │
└──────────────────────┴──────────────────────────────────────────────┘
```

---

## 🔗 SIP wrapper — two-layer architecture

QGIS is written in **C++**. PyQGIS gives us access from Python using **SIP** (SIP Interface for Python):

```
┌─────────────────────────────────────────────────┐
│  The Python world                               │
│  ┌───────────────────────────────────────────┐  │
│  │  writer = QgsVectorFileWriter(...)        │  │
│  │  (Python object — SIP wrapper)            │  │
│  └──────────────────────┬────────────────────┘  │
│                         │ SIP Bridge             │
├─────────────────────────▼────────────────────────┤
│  The C++ world                                  │
│  ┌───────────────────────────────────────────┐  │
│  │  QgsVectorFileWriter* ptr                 │  │
│  │  (C++ object — the real resources)        │  │
│  │  → the file is open                       │  │
│  │  → buffer in memory                       │  │
│  │  → OS lock                                │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### How the SIP wrapper behaves

```python
writer = QgsVectorFileWriter(...)
# ↑ this creates:
#   1. a Python wrapper object (small, on Python's heap)
#   2. a C++ QgsVectorFileWriter object (with the file resources)
#   The Python wrapper "owns" the C++ object — it stores a pointer

del writer
# ↑ this:
#   1. drops the Python wrapper
#   2. SIP notices: the Python side is gone → call the C++ destructor!
#   3. ~QgsVectorFileWriter() → flush + close + unlock
```

---

## ⚠️ The problem in PyQGIS

Python's GC **does not** call the C++ destructor **at an exact moment**. This leads to:

### Problem 1 — the file stays locked

```python
writer = QgsVectorFileWriter("output.shp", ...)
writer.addFeature(feat)

# writer = None ← the reference is gone, but the GC has not run yet

# the next code cannot touch this file:
os.remove("output.shp")   # ❌ PermissionError: file is in use!
shutil.move("output.shp", "backup/")  # ❌ WinError 32
```

### Problem 2 — the data is not written

```python
writer = QgsVectorFileWriter("output.shp", ...)

for feat in features:
    writer.addFeature(feat)
    # ↑ the features are in the buffer, not on disk yet!

# the GC has not cleaned up yet → ~QgsVectorFileWriter() not called yet
# → flush() has not happened → the last features are lost!

layer = QgsVectorLayer("output.shp", "Layer", "ogr")
# the .shp file may be:
# → empty (0 features)
# → incomplete (the last batch is lost)
# → corrupted (header ≠ content)
```

### Problem 3 — a memory leak in a loop

```python
for i in range(10000):
    writer = QgsVectorFileWriter(f"layer_{i}.shp", ...)
    writer.addFeature(feat)
    # del writer ← this line is missing!
    # the GC cannot keep up → C++ objects pile up → RAM fills up
    # → QGIS freezes / slows down / crashes
```

---

## 🗑️ `del` — calling the C++ destructor by hand

Python's `del` removes a **reference**. When the last reference is removed, Python frees the object right away → it calls the **SIP destructor**:

```python
writer = QgsVectorFileWriter("output.shp", ...)

writer.addFeature(feat1)
writer.addFeature(feat2)

del writer
# ↑ exactly on this line:
#   Python: reference_count(writer) → 0
#   SIP:    "Python no longer needs it" → C++ destructor!
#   C++:    ~QgsVectorFileWriter()
#             → buffer → disk (flush)
#             → file.close()
#             → release the OS lock
#             → C++ object memory → free()
```

### `del` vs `= None`

```python
# ✅ both work — the reference count drops to 0
del writer       # ← the most explicit, clear in the code
writer = None    # ← the same effect, less readable

# ⚠️ this does not work — a reference still exists!
backup = writer  # another variable holds a reference
del writer       # ← Python: reference_count = 1 (backup still exists!)
                 # → the C++ destructor is not called yet!
```

### Visualizing the reference count

```
writer = QgsVectorFileWriter(...)
  → Python object: ref_count = 1

backup = writer
  → Python object: ref_count = 2

del writer
  → Python object: ref_count = 1  ← still alive!

del backup
  → Python object: ref_count = 0  ← now: C++ destructor!
```

---

## 🔄 QgsVectorFileWriter — full lifecycle

```
QgsVectorFileWriter(path, encoding, fields, geomType, crs, driver)
         │
         │  constructor
         ▼
┌──────────────────────────────┐
│  the C++ object is "alive"   │
│  ✅ output.shp is open       │
│  ✅ OS lock taken            │
│  ✅ buffer ready             │
└──────────────────────────────┘
         │
         │  addFeature(feat) — into the buffer
         ▼
┌──────────────────────────────┐
│  features are in the buffer  │
│  ⚠️ not on disk yet          │
│  ⚠️ the file is not complete │
└──────────────────────────────┘
         │
         │  del writer  ←── this line!
         ▼
┌──────────────────────────────┐
│  ~QgsVectorFileWriter()      │  C++ destructor
│  ✅ flush() — buffer → disk  │
│  ✅ file.close()             │
│  ✅ OS lock released         │
│  ✅ memory freed             │
└──────────────────────────────┘
         │
         ▼
   output.shp — complete and readable ✅
```

---

## 🛡️ Cleanup patterns

### Pattern 1 — `del` (minimal)

```python
writer = QgsVectorFileWriter(
    shapefile_path, 'UTF-8', fields,
    QgsWkbTypes.Point, crs, 'ESRI Shapefile'
)

writer.addFeature(feat)

del writer   # C++ destructor → flush + close
```

> ⚠️ **Weak point:** if an exception occurs, the code stops before `del` and `del` **does not run**.

---

### Pattern 2 — `try / finally` (guaranteed)

```python
writer = QgsVectorFileWriter.create(
    shapefile_path, fields, QgsWkbTypes.Point, crs,
    QgsProject.instance().transformContext(), options
)

try:
    for feat in features:
        writer.addFeature(feat)
    print(f"✅ {len(features)} features written")

except Exception as e:
    print(f"❌ Error: {e}")

finally:
    del writer          # ← always runs — even on an exception!
    print("🔒 C++ destructor called — file closed")
```

> ✅ `finally` is Python's guarantee: it **always** runs, regardless of exceptions.

---

### Pattern 3 — `contextmanager` (with style)

```python
from contextlib import contextmanager
from qgis.core import QgsVectorFileWriter, QgsProject

@contextmanager
def vector_writer(path, fields, geom_type, crs):
    options = QgsVectorFileWriter.SaveVectorOptions()
    options.driverName   = "ESRI Shapefile"
    options.fileEncoding = "UTF-8"

    writer = QgsVectorFileWriter.create(
        path, fields, geom_type, crs,
        QgsProject.instance().transformContext(), options
    )

    if writer.hasError() != QgsVectorFileWriter.NoError:
        raise RuntimeError(writer.errorMessage())
    try:
        yield writer                    # hands the writer to Python
    finally:
        del writer                      # C++ destructor — guaranteed!

# usage:
with vector_writer(path, fields, QgsWkbTypes.Point, crs) as writer:
    for feat in features:
        writer.addFeature(feat)
# ← the with block ended → del automatically
```

---

### Pattern 4 — `writeAsVectorFormatV3` (no del needed)

```python
# here the writer lives in the internal scope of a C++ function
# → C++'s automatic destructor does the work → we don't need del

error, _, _, _ = QgsVectorFileWriter.writeAsVectorFormatV3(
    layer, path,
    QgsProject.instance().transformContext(),
    options
)

if error == QgsVectorFileWriter.NoError:
    print("✅ Export — del was not needed")
```

---

### Comparing the patterns

```
┌──────────────────┬───────────────┬──────────────┬──────────────────┐
│ Pattern          │ Cleanup       │ Code clarity │ Who calls it     │
├──────────────────┼───────────────┼──────────────┼──────────────────┤
│ del writer       │ ❌ without try│ ✅ simple    │ by hand          │
│ try / finally    │ ✅ guaranteed │ 🔶 medium    │ by hand, finally │
│ contextmanager   │ ✅ guaranteed │ ✅ clean     │ automatic        │
│ writeAsVectorV3  │ ✅ C++ auto   │ ✅ clean     │ C++ automatic    │
└──────────────────┴───────────────┴──────────────┴──────────────────┘
```

---

## 🔍 Other PyQGIS classes that need cleanup

`QgsVectorFileWriter` is not the only class where releasing C++ resources by hand matters:

### QgsDataProvider — the data source

```python
# ✅ removing a QgsVectorLayer also closes its provider
layer = QgsVectorLayer(path, "Layer", "ogr")
QgsProject.instance().removeMapLayer(layer.id())
# ← C++ QgsOgrProvider destructor → the OGR file handle is closed
```

### QgsFeatureIterator — closing the iterator

```python
# ⚠️ on large layers the iterator keeps a C++ connection open
it = layer.getFeatures()

for feat in it:
    if feat['ID'] == target_id:
        break       # ← the iterator stopped, but the C++ connection is still open!

# ✅ close it by hand
it.close()          # ← C++ destructor → DB cursor / file handle closed
```

### QgsRasterLayer — a raster file

```python
raster = QgsRasterLayer(tiff_path, "DEM", "gdal")

# the GDAL dataset is open at the C++ level
# removing it from QgsProject → C++ GDAL destructor
QgsProject.instance().removeMapLayer(raster.id())
```

### QgsTransaction — a database transaction

```python
from qgis.core import QgsTransaction

transaction = QgsTransaction.create(layer)
transaction.begin()

try:
    layer.startEditing()
    # ... changes ...
    transaction.commit()
except:
    transaction.rollback()   # ← release the C++ connection
finally:
    del transaction          # ← C++ destructor → DB connection cleanup
```

---

## 📌 Summary

```
C++ destructor
      │
      ├── automatic in C++ — at the end of the scope
      │
      └── in PyQGIS — not automatic because of the SIP wrapper
                │
                ├── del writer    → Python ref=0 → SIP → C++ destructor
                ├── try/finally   → guaranteed even on exceptions
                ├── contextmanager → with block → automatic del
                └── writeAsVectorFormatV3 → C++ scope → automatic
```

| Python statement | C++ effect |
|----------------|-----------|
| `writer = QgsVectorFileWriter(...)` | `QgsVectorFileWriter()` constructor — the file is opened |
| `writer.addFeature(feat)` | Written to the buffer — not on disk yet |
| `del writer` | `~QgsVectorFileWriter()` — flush + close + unlock |

- **C++ destructor** = the class's cleanup method, with the `~ClassName()` syntax
- **SIP wrapper** = Python's "shell" around a C++ object — a two-layer world
- **`del`** = removes the Python reference → SIP → the C++ destructor is called
- **`try/finally`** = guaranteed cleanup, even on errors
- **Python GC ≠ C++ destructor**: the GC is non-deterministic, the destructor is deterministic
