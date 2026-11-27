# 💻 The Windows environment and configuring GeoServer

---

## 🧭 What is the **Windows environment**?

The **Windows environment** means the operating system the user works in (e.g. Windows 10, 11), together with its environment variables, programs, libraries and file structure.

**Main components:**
- 📂 the file system (C:\, D:\, etc.)
- ⚙️ environment variables
- 🧩 installed programs (.exe)
- 🔁 processes and services (Services, Startup apps)

* The Windows environment is the computer's working environment where every program runs, including Java, Python, QGIS and GeoServer.

---

## 🌍 GeoServer in the Windows environment

GeoServer is open-source server software that runs on the Java platform. GeoServer needs:

- ✅ a correctly configured **Java environment** (JDK or JRE)
- ✅ server space (folders, libraries)
- ✅ the ability of Windows **to run scripts (BAT)**

### On Windows, GeoServer can be started in two ways:
1. **ZIP version** – started with the `startup.bat` file  
2. **Windows Installer (EXE)** – installed automatically as a service

---

## ⚙️ Configuring the Java environment (for GeoServer)

1. Download Temurin OpenJDK:  
   🔗 https://adoptium.net/en-GB/temurin/releases

2. Install the JDK (JDK 17 is recommended)

3. Set the environment variable:

   - Variable Name: `JAVA_HOME`  
   - Variable Value: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x`

4. Add this path to the system **Path** variable:
   ```
   %JAVA_HOME%\bin
   ```

5. Check it in `cmd`:

   ```bash
   java -version
   ```

---

## 🚀 Starting GeoServer on Windows

### Option 1: the ZIP version

1. Download the GeoServer ZIP archive:  
   🔗 https://geoserver.org/download

2. Extract it to a folder (e.g. `C:\geoserver`)

3. Run the `startup.bat` file from the `bin` folder

---

## 📌 Example: what happens in the Windows environment

| Element | Description |
|----------|--------|
| `JAVA_HOME` | An environment variable that points to where Java is |
| `startup.bat` | A Windows script that starts GeoServer |
| `%PATH%` | A system variable that gives access to `java.exe` |
| `C:\geoserver\data_dir` | GeoServer's data directory |
| `localhost:8080/geoserver` | The address of the GeoServer UI in the browser |

---

## 🧠 Why does this matter?

- The correct configuration of the Windows environment decides whether GeoServer will work.
- GeoServer will not start without a Java environment.
- Students should know how to start server applications and how to work with system variables.

---

## 📚 Additional resources

- [GeoServer User Guide](https://docs.geoserver.org)
- [JAVA_HOME – official explanation](https://learn.microsoft.com/en-us/java/openjdk/install)
- [Adoptium Temurin](https://adoptium.net)
