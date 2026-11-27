# QGIS: absolute vs relative paths

When working in QGIS, choosing the right type of file path matters for the project's portability and for opening it correctly on other devices.

QGIS official [documentation:](https://docs.qgis.org/3.40/en/docs/user_manual/introduction/project_files.html#handling-broken-file-paths)

---

## 🧾 Terms and descriptions

| Term       | Description |
|---------------|--------|
| **Absolute** | Gives the full path of the file in the computer's file system. For example: `C:/Users/ezdanapak/Documents/GIS/data/roads.shp`. This path only works on a device with exactly the same structure. |
| **Relative** | Gives the file's location relative to the current QGIS project file (`.qgz` or `.qgs`). For example: `./data/roads.shp`. This path is portable and ideal when moving the project to another computer. |

---

## 📁 An example project structure

The QGIS project sits in one shared folder together with the data:

```
Chiatura_project/             ← the project's main folder
├── project.qgz              ← the QGIS project file
├── data/                    ← the data folder
│   ├── roads.shp            ← layer: roads
│   ├── buildings.shp        ← layer: buildings
│   └── rivers.shp           ← layer: rivers
```

---

## 📌 Relative paths

In QGIS, relative to the project.qgz file, the file paths will be:

```
./data/roads.shp
./data/buildings.shp
./data/rivers.shp
```

✅ **Recommended** when the project is kept in one folder and you plan to move or share it.

---

## 📌 Absolute paths

The full address of the file on the computer:

```
C:/Users/ezdanapak/Documents/Chiatura_project/data/roads.shp
C:/Users/ezdanapak/Documents/Chiatura_project/data/buildings.shp
C:/Users/ezdanapak/Documents/Chiatura_project/data/rivers.shp
```

⚠️ **Not portable**. It works only on the same device, with the same path structure.

---

## ⚙️ How do you change the path type in QGIS?

1. Open the QGIS project.
2. Go to the menu: `Project` → `Properties` → `General`
3. Find the **Store paths** setting.
4. Choose one:
   - `Relative` – for relative paths
   - `Absolute` – for absolute paths

---

## ✅ Recommended practice

- Keep the QGIS project and all its data in one shared folder.
- Use **relative paths** if:
  - you need to share the project with someone.
  - you need to move the project to another computer.
  - you use Git or a ZIP archive.

---

## 📝 Summary

| Property             | Absolute path                         | Relative path                      |
|----------------------|--------------------------------------------|----------------------------------------|
| Portability         | ❌ no                                      | ✅ yes                                   |
| Works only on one computer | ✅ yes                                   | ❌ no                                  |
| Recommended for team work | ❌ no                                  | ✅ yes                                   |
| Path example     | `C:/Users/ezdanapak/data/roads.shp`             | `./data/roads.shp`                     |

---

📌 **Tip**: always use relative paths when you keep the project files together in one folder and know the project may be opened somewhere else.
