# QgsExpressionContext in PyQGIS

**QgsExpressionContext** is the PyQGIS class that defines the **context in which expressions run**, i.e. it answers the question: "when this expression runs, which variables and values should be available?"

---

## 🔑 The main idea

`QgsExpressionContext` contains a stack of **scopes** (`QgsExpressionContextScope`), where each scope defines a set of variables.

This class is used:

- when running a `QgsExpression`: the context "tells" the expression which values to use
- to access feature attributes in an expression
- to access project, layer or feature variables
- to pass custom variables to an expression

---

## 📦 Import

```python
from qgis.core import (
    QgsExpressionContext,
    QgsExpressionContextScope,
    QgsExpressionContextUtils,
    QgsExpression,
    QgsFeatureRequest
)
```

---

## 🧱 Structure of the context

`QgsExpressionContext` is a stack: scopes are placed on top of each other:

```
┌─────────────────────────────────────────┐
│  QgsExpressionContext (stack)           │
├─────────────────────────────────────────┤
│  scope 3 → custom variables             │  ← highest priority
│  scope 2 → feature attributes           │
│  scope 1 → layer variables              │
│  scope 0 → project variables            │  ← lowest priority
└─────────────────────────────────────────┘
```

📌 If a variable with the same name is in several scopes, the **topmost scope** "wins".

---

## ▶️ Simple use — `QgsExpressionContextUtils`

`QgsExpressionContextUtils` gives us ready-made helper methods that create the standard scopes:

```python
from qgis.core import QgsExpressionContext, QgsExpressionContextUtils, QgsProject

# project context
context = QgsExpressionContextUtils.projectScope(QgsProject.instance())

# layer context
layer = iface.activeLayer()
context = QgsExpressionContextUtils.layerScope(layer)

# global context (QGIS global variables)
context = QgsExpressionContextUtils.globalScope()
```

---

## 🔗 The full context — all scopes together

In practice all scopes are combined into one context:

```python
from qgis.core import (
    QgsExpressionContext,
    QgsExpressionContextUtils,
    QgsProject
)

layer = iface.activeLayer()

context = QgsExpressionContext()
context.appendScopes(
    QgsExpressionContextUtils.globalProjectLayerScopes(layer)
)

# or by hand:
context.appendScope(QgsExpressionContextUtils.globalScope())
context.appendScope(QgsExpressionContextUtils.projectScope(QgsProject.instance()))
context.appendScope(QgsExpressionContextUtils.layerScope(layer))
```

📌 `globalProjectLayerScopes()` is a convenient shortcut that adds all standard scopes at once.

---

## ➕ Attaching a feature to the context

To access `@feature` or field names in an expression:

```python
from qgis.core import QgsExpression, QgsExpressionContext, QgsExpressionContextUtils

layer = iface.activeLayer()

context = QgsExpressionContext()
context.appendScopes(
    QgsExpressionContextUtils.globalProjectLayerScopes(layer)
)

expr = QgsExpression('"area" * 2')  # a field named "area"

for feature in layer.getFeatures():
    context.setFeature(feature)     # ← attach the feature to the context
    result = expr.evaluate(context)
    print(f"Feature {feature.id()}: {result}")
```

---

## 🔧 Adding custom variables

```python
from qgis.core import (
    QgsExpressionContext,
    QgsExpressionContextScope,
    QgsExpressionContextUtils
)

# a new scope
custom_scope = QgsExpressionContextScope()

# add variables
custom_scope.setVariable('my_city',     'Tbilisi')
custom_scope.setVariable('my_factor',   1.5)
custom_scope.setVariable('project_year', 2025)

# add it to the context
context = QgsExpressionContext()
context.appendScope(custom_scope)

# use in an expression: @my_city, @my_factor
expr = QgsExpression("@my_factor * 100")
result = expr.evaluate(context)
print(result)  # → 150.0
```

📌 In an expression you refer to custom variables with the `@` prefix: `@my_city`.

---

## 🔍 Looking up a variable in the context

```python
# read a variable's value
value = context.variable('my_city')
print(value)  # → 'Tbilisi'

# all available variables
all_vars = context.variableNames()
print(all_vars)
# → ['my_city', 'my_factor', 'project_year', 'layer_name', ...]
```

---

## 📋 Practical example — filtering with an expression

```python
from qgis.core import (
    QgsExpression,
    QgsExpressionContext,
    QgsExpressionContextUtils,
    QgsFeatureRequest
)

layer = iface.activeLayer()

# context
context = QgsExpressionContext()
context.appendScopes(
    QgsExpressionContextUtils.globalProjectLayerScopes(layer)
)

# expression ('კახეთი' = Kakheti, as stored in the data)
expr = QgsExpression('"population" > 50000 AND "region" = \'კახეთი\'')

if expr.hasParserError():
    print("❌ Expression error:", expr.parserErrorString())
else:
    for feature in layer.getFeatures():
        context.setFeature(feature)
        if expr.evaluate(context):
            print(f"✅ {feature['name']} — {feature['population']}")
```

---

## 📋 Practical example — calculating a new field

```python
from qgis.core import (
    QgsExpression,
    QgsExpressionContext,
    QgsExpressionContextUtils
)

layer = iface.activeLayer()

context = QgsExpressionContext()
context.appendScopes(
    QgsExpressionContextUtils.globalProjectLayerScopes(layer)
)

# area in square meters → hectares
expr = QgsExpression('$area / 10000')

layer.startEditing()
for feature in layer.getFeatures():
    context.setFeature(feature)
    hectares = expr.evaluate(context)
    layer.changeAttributeValue(feature.id(), layer.fields().indexFromName('area_ha'), round(hectares, 4))

layer.commitChanges()
print("✅ Field updated")
```

---

## 🌐 Setting/reading project variables

```python
from qgis.core import QgsExpressionContextUtils, QgsProject

project = QgsProject.instance()

# set a variable on the project
QgsExpressionContextUtils.setProjectVariable(project, 'company_name', 'GGTC')
QgsExpressionContextUtils.setProjectVariable(project, 'year',         2025)

# read it back
val = QgsExpressionContextUtils.projectScope(project).variable('company_name')
print(val)  # → 'GGTC'

# in a QGIS expression: @company_name, @year
```

---

## 🛠 Setting layer variables

```python
from qgis.core import QgsExpressionContextUtils

layer = iface.activeLayer()

# attach a variable to the layer
QgsExpressionContextUtils.setLayerVariable(layer, 'layer_source', 'PostGIS')
QgsExpressionContextUtils.setLayerVariable(layer, 'update_date',  '2025-01-15')

# read it back
val = QgsExpressionContextUtils.layerScope(layer).variable('layer_source')
print(val)  # → 'PostGIS'
```

---

## ⚡ Error handling

```python
expr = QgsExpression('"nonexistent_field" + 1')

# parser error (syntax)
if expr.hasParserError():
    print("❌ Parser error:", expr.parserErrorString())

# eval error (at run time)
result = expr.evaluate(context)
if expr.hasEvalError():
    print("❌ Eval error:", expr.evalErrorString())
else:
    print("✅ Result:", result)
```

---

## 📊 `QgsExpressionContextUtils` — methods summary

| Method | Purpose |
|--------|------------|
| `globalScope()` | QGIS global variables |
| `projectScope(project)` | Project variables |
| `layerScope(layer)` | Layer variables |
| `featureBasedContext(feat, fields)` | Feature-based context |
| `globalProjectLayerScopes(layer)` | All three together (shortcut) |
| `setProjectVariable(project, name, value)` | Set a project variable |
| `setLayerVariable(layer, name, value)` | Set a layer variable |

---

## 📌 Summary

- **`QgsExpressionContext`** is a stack of scopes that "tells" an expression which variables to use
- **`QgsExpressionContextScope`** is one set of variables
- **`QgsExpressionContextUtils`** is a helper class for creating ready-made scopes
- `context.setFeature(feat)` attaches a feature to the context for field access
- `context.variable('name')` reads a variable
- In an expression you refer to custom variables with the `@` prefix

👉 Whenever you need not just a `QgsExpression` but its **results**, `QgsExpressionContext` is your essential tool.
