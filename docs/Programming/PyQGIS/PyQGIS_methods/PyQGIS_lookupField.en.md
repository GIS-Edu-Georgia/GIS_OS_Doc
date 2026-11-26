# `lookupField()` in PyQGIS

**`lookupField()`** finds the **index of a column (field)** in a vector layer's (`QgsVectorLayer`) attribute table by its **name**.

---

## 🔑 The main idea

When working with a field, most QGIS functions ask not for its name (e.g. `"population"`) but for its **position number** (e.g. `0`, `1`, `2`...). `lookupField()` is the "bridge" from name to index:

```
layer.lookupField("population")
        │
        ▼
    "population" ──►  2   ✅  found
    "wrong"      ──► -1   ❌  not found
```

---

## ⚙️ Main characteristics

| Characteristic | Description |
|---------------|--------|
| **What it returns** | An integer (`int`) — the field index |
| **If the field is not found** | Returns `-1` |
| **Letter case** | Not sensitive (case-insensitive) |
| **Where it is defined** | In the `QgsVectorLayer` and `QgsFields` classes |

---

## ▶️ Simple use

Suppose we have a layer and want to know the index of the column named `"population"`, so that we can then change data in that column.

```python
# assume layer is your active vector layer
layer = iface.activeLayer()

# look up the field index by name
field_name = "population"
field_index = layer.lookupField(field_name)

if field_index != -1:
    print(f"The index of field '{field_name}' is: {field_index}")

    # for example, read this value of the first feature:
    feature = next(layer.getFeatures())
    print(f"Value: {feature[field_index]}")
else:
    print(f"❌ No field named '{field_name}' was found!")
```

---

## 💡 Why use it?

If you write `feature[2]` directly, your code **breaks** as soon as someone adds or deletes a column in the table. `lookupField()` **always gives you the correct index**, no matter where that column is in the list.

```
❌ unreliable                          ✅ reliable
──────────────                         ──────────────
value = feature[2]                     idx = layer.lookupField("population")
     │                                 value = feature[idx]
     ▼                                      │
a bug when the column                       ▼
order changes                         always correct, regardless
                                      of schema changes
```

> 📌 **Rule:** always use `lookupField()`; **never** hardcode an index.

---

## 🛠 A practical example — together with `changeAttributeValues`

`lookupField()` is especially useful for **bulk updates** of attributes:

```python
from qgis.core import QgsVectorLayer

layer = iface.activeLayer()

# get the index by name
pop_idx = layer.lookupField("population")

if pop_idx == -1:
    print("❌ Field 'population' not found")
else:
    # edit mode
    layer.startEditing()

    # bulk update with changeAttributeValues
    updates = {}
    for feat in layer.getFeatures():
        # double the population of every feature
        updates[feat.id()] = {pop_idx: feat[pop_idx] * 2}

    layer.dataProvider().changeAttributeValues(updates)
    layer.commitChanges()

    print(f"✅ {len(updates)} features updated")
```

---

## 🔍 Defensive pattern

```python
def get_field_index(layer, field_name):
    """Safely returns the field index, or raises an error."""
    idx = layer.lookupField(field_name)
    if idx == -1:
        available = [f.name() for f in layer.fields()]
        raise ValueError(
            f"Field '{field_name}' not found. "
            f"Available fields: {available}"
        )
    return idx


# usage
try:
    idx = get_field_index(layer, "population")
    print(f"✅ Index: {idx}")
except ValueError as e:
    print(f"❌ {e}")
```

---

## 📌 Summary

- **`lookupField(field_name)`** returns the field **index** by name
- It returns `-1` if the field is not found, so **always check!**
- It makes code **reliable**: it does not break when the attribute schema changes
- It is used together with `changeAttributeValues()`, `updateFeature()` and other index-based operations
- Best practice: **never** use a hardcoded index; always convert from the name

👉 **Rule:** before you touch an attribute by index, the **first step** is always `lookupField()`.
