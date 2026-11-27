# 📁 QGIS project files: `.qgs` vs `.qgz`

QGIS (Quantum GIS) uses two main formats for saving project files: **`.qgs`** and **`.qgz`**. 
The difference between them concerns how the data is stored and archived. 
Below is a detailed overview of their characteristics and uses.

---

## 🔹 `.qgs` — XML format

- **Description**: `.qgs` is a **standard XML file** that stores the project data as text.
- **Characteristics**:
  - **Easy to read**: the file can be opened and edited with any text editor (e.g. Notepad++, VS Code).
  - **Version control**: ideal for working with Git or other version control systems, because the XML format makes changes easy to track.
  - **A standalone file**: often accompanied by other related files/folders (e.g. `project.gpkg`, possibly other data files).
- **When to use it**:
  - active development of the project.
  - editing by hand or tracking changes.

📌 **Example**:
```bash
my_project.qgs
```

---

## 🔹 `.qgz` — a compressed project

- **Description**: `.qgz` is a ZIP-compressed archive that contains the `.qgs` file and other data related to the project.
- **Characteristics**:
  - **Compact**: all the needed data is packed into one file, which makes sharing easier.
  - **Hidden structure**: it is not directly readable, but QGIS handles it automatically.
  - **Convenient for sharing**: ideal for handing over the project as a single file.
- **When to use it**:
  - final distribution of the project.
  - creating a backup.

📌 **Example**:
```bash
my_project.qgz
```

---

## ⚖️ Comparison

| Characteristic           | `.qgs`                | `.qgz`                       |
|------------------------|-----------------------|------------------------------|
| Format                | Text (XML)        | Compressed (ZIP)              |
| Readability           | Easy to read    | Not directly readable |
| Git support         | ✔️ suitable         | ❌ less convenient     |
| Sharing              | Related files are needed too | Just one file       |
| When to use   | Development, version control | Final distribution, backup |

---

## ✅ Recommendations

**Use `.qgs` if**:
- you are actively working on the project.
- you need to edit the file by hand or use version control (e.g. with Git).

**Use `.qgz` if**:
- you want to package the project and share it as a single file.
- you are making a backup or sending the project to another user.

📌 **Tip**: in QGIS you can freely switch between the formats with **File > Save As**, 
which lets you choose whichever format suits you best!
