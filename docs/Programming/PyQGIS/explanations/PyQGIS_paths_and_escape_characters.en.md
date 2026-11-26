# 📂 Writing directory paths correctly in Python

When writing file and directory paths in Python, it is important to tell the **backslash (\\)** and the **forward slash (/)** apart correctly.  

---

## ✅ Valid ways to write directory paths

Python has more than one way to write a path correctly:

- a double backslash (**\\**)  
- a forward slash (**/**)  
- the **raw string** syntax (r"...")  

> If you use `/` or `\\`, the **r prefix is no longer required**.

### Examples:
```py
r"C:\Lessons\Georgia.gpkg\ambulances"
"C:/Lessons/Georgia.gpkg/ambulances"
"C:\\Lessons\\Georgia.gpkg\\ambulances"
```

All of these are correct and **interchangeable**.

---

## 🔹 Paths in code

In Python a single backslash **(\)** is used as the **escape character**.  
Because of this, in paths it is recommended to use a double backslash (\\), a raw string (r"...") or a forward slash (/).

Examples:

```py
r"C:\QGIS\PyQGIS\database.gpkg"
"C:/QGIS/PyQGIS/database.gpkg"
"C:\\QGIS\\PyQGIS\\database.gpkg"
```

---

# 🔑 The escape character in Python

The escape character is the **backslash ( \ )**, which is used to output special characters.  

---

## 📍 Inserting special characters

### Quotes inside a string
```py title="Special characters" linenums="1"
City = "My city is \"Chiatura!\""
print(City)
# output: My city is "Chiatura!"
```

### New line `\n`
```py title="New line" linenums="1"
City = "My city is \nChiatura"
print(City)
# output:
# My city is
# Chiatura
```

### Tab `\t`
```py title="Tab character" linenums="1"
City = "My city is \tChiatura"
print(City)
# output: My city is   Chiatura
```

### Backslash `\\`
If we need the backslash itself to appear, we write it twice:

```py title="Backslash" linenums="1"
path = "C:\\QGIS\\PyQGIS\\database.gpkg"
print(path)
# output: C:\QGIS\PyQGIS\database.gpkg
```

---

## 🖼️ Path examples at a glance

Examples of Windows and Linux paths:

```
Windows:   C:\Users\Student\Documents\project\data.csv
Linux:     /home/student/project/data.csv
Raw string: r"C:\Users\Student\Documents\project\data.csv"
```


---

## 📌 Summary
- **\** → the escape character (for special characters).  
- **\\** → a real backslash in a path.  
- **/** → can be used on Windows too.  
- **r"..."** → raw string, removes the need for escape characters.  

👉 All of this is essential in Python for writing correct paths and keeping text accurate.
