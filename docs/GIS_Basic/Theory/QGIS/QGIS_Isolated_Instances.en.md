# Isolated QGIS processes

## Why is this critically important?

With QGIS, independent processes matter a lot: when working with large vector layers, complex geoprocessing or heavy rasters, one project freezing (for example, a crash while rendering) can take a whole day's work in other windows down with it.

By default, when you open a new window, the operating system often attaches it to the main process that is already running — on both Windows and Linux.

---

## Windows

### Method 1: modifying the shortcut — the most reliable

QGIS has a built-in option `--no-version-check` that makes the program bypass the Windows registry and start a completely clean, isolated new session.

**Step 1 — open the shortcut's properties**

On the Desktop or in the Start menu, find the QGIS icon, right-click it and choose **Properties**.

**Step 2 — find the Target field**

In the window that opens, make sure you are on the **Shortcut** tab and find the field named **Target**:

```
"C:\Program Files\QGIS 3.xx.x\bin\qgis-bin.exe"
```

**Step 3 — add the argument**

Move the cursor to the very end of the text, add one space and type:

```
"C:\Program Files\QGIS 3.xx.x\bin\qgis-bin.exe" --no-version-check
```

**Step 4 — save the change**

Click **Apply** → **OK**. If the system asks for administrator permission, confirm.

From now on, every launch will be a completely independent process.

---

### Method 2: Project → New Window

If you are already working in QGIS and want to open a second project in parallel:

1. In the top menu click **Project**
2. Choose **New Window** (not **New**, which clears the current window)

With this command QGIS automatically creates a new isolated **PID (Process ID)**.

---

### Method 3: a .bat file

```bat
@echo off
start "" "C:\Program Files\QGIS 3.xx.x\bin\qgis-bin.exe" --no-version-check
```

> The `start ""` command tells Windows to start the program in a completely new process. The two empty quotes (`""`) are the title parameter — they cannot be left out.

Save the file with a `.bat` extension and double-click it — QGIS opens as a new, isolated process.

---

### Closing a frozen QGIS on Windows

1. Open Task Manager: **Ctrl + Shift + Esc**
2. Go to the **Details** tab
3. Find **`qgis-bin.exe`** — you will see several identical entries
4. Use the CPU/Memory columns to identify the frozen process
5. Right-click **only that one** process → **End task**

> ⚠️ **Do not use the Processes tab** — clicking "End Task" there can close every open QGIS at once. From the **Details** tab, only the one selected process is closed.

---

## Linux (Fedora)

### Method 1: modifying the .desktop file — the most reliable

On Linux, application launchers are `.desktop` files — the equivalent of a Windows shortcut.

**Step 1 — create a personal .desktop file**

Instead of changing the system file directly, copy it into your personal folder:

```bash
cp /usr/share/applications/qgis.desktop ~/.local/share/applications/qgis.desktop
```

**Step 2 — edit the file**

```bash
nano ~/.local/share/applications/qgis.desktop
```

Find the `Exec=` line. It looks roughly like this:

```
Exec=qgis %F
```

Change it to:

```
Exec=qgis --no-version-check %F
```

**Step 3 — activate the change**

```bash
update-desktop-database ~/.local/share/applications/
```

From now on, launching QGIS from its icon always creates a new, isolated process.

---

### Method 2: launching from the terminal

The fastest way — directly from the terminal:

```bash
qgis --no-version-check &
```

> The `&` symbol runs the command in the background, so the terminal stays free. Each such launch creates a new, independent PID.

To open several QGIS windows in parallel, simply repeat the command:

```bash
qgis --no-version-check &
qgis --no-version-check &
```

---

### Method 3: a .sh script

```bash
#!/bin/bash
qgis --no-version-check &
```

**Usage:**

```bash
# save the file, e.g.: ~/qgis_isolated.sh
# make it executable
chmod +x ~/qgis_isolated.sh

# run it
~/qgis_isolated.sh
```

To put it on the Desktop, create a `.desktop` file:

```ini
[Desktop Entry]
Name=QGIS (Isolated)
Exec=/home/USERNAME/qgis_isolated.sh
Icon=qgis
Type=Application
Terminal=false
```

Save it as `~/Desktop/qgis_isolated.desktop` and make it executable:

```bash
chmod +x ~/Desktop/qgis_isolated.desktop
```

---

### Closing a frozen QGIS on Fedora

**The graphical way — System Monitor:**

1. Open **System Monitor** (Activities → System Monitor)
2. Go to the **Processes** tab
3. Find **`qgis`** — you will see several entries
4. Use CPU/Memory to identify the frozen process
5. Right-click → **Kill Process**

**From the terminal — by PID:**

```bash
# show the PIDs of all QGIS processes
pgrep -a qgis

# close a specific PID (e.g. 12345)
kill 12345
```

**From the terminal — by CPU:**

```bash
# an interactive list with CPU load
top -p $(pgrep -d',' qgis)
```

> ⚠️ **Do not use `pkill qgis`** — this command closes every open QGIS process at once. `kill <PID>` closes only one specific process.

---

## Comparing the methods

| Method | Windows | Linux (Fedora) | Difficulty |
|--------|---------|----------------|---------|
| Modifying the icon | Shortcut → Target | .desktop → Exec= | Low |
| Quick launch | — | `qgis --no-version-check &` | Easiest |
| From the menu | Project → New Window | Project → New Window | Easiest |
| Script | .bat file | .sh file | Low |
| Closing a frozen one | Task Manager → Details | `kill <PID>` / System Monitor | Medium |
