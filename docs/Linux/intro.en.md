# Linux for geographers

This is not just another Linux tutorial. The internet has thousands of those, and many of them
are excellent. This is something else: **Linux through the lens of a geographer's tasks.**

A simple example shows the difference. A typical tutorial teaches `find` like this:

```bash
find /path -name "*.txt"
```

Here, it is taught like this:

```bash
# out of 1,200 orthophotos, find the ones taken in 2024
# and move them into one folder — you won't drag 1,200 files by hand
find /data/ortho -name "*_2024*.tif" -exec mv {} /data/ortho_2024/ \;
```

It is the same command. You will remember the second one, because it solves a pain you have actually had.

---

## Why a geographer needs Linux

!!! question "\"QGIS runs on Windows too — so what?\""

    True. You don't need Linux for QGIS. But:

    - **Servers run Linux.** GeoServer, PostGIS, MapProxy, GeoNode — if you ever want
      your map to go on the web instead of staying on your laptop, you will be dealing with a server.
    - **GDAL is built on the command line.** QGIS's buttons are a shell around GDAL commands.
      When you need to process 300 rasters, you won't click a button 300 times.
    - **Remote sensing and ML tools** — almost all of them come out on Linux first.
    - **It is free and transparent.** That is as much a value as QGIS being open source.

## Who it is for

For geographers, GIS specialists and students who have never touched Linux.
No prior knowledge is needed — we start from what a terminal is.

It helps if you already know QGIS — then the GIS examples will be more useful to you.
If not, [GIS Basic](../GIS_Basic/Software/QGIS.md) is a good place to start.

## How to learn

!!! danger "The only rule"
    **You cannot learn Linux by reading.** Type every command by hand. Not by copying — **type it.**
    The mistakes you make while typing are exactly the places where your knowledge gets stuck.

**You need a practice system.** Do not use your work computer. The options
are in the [00 — Setup](00_Setup/index.md) chapter: a virtual machine (recommended),
dual-boot, or WSL.

The chapters are written in order — from 01 to 12. Each one builds on the previous one.

## The certification path

This documentation covers the objectives of three exams:

| Exam | Type | What it gives you |
|---------|------|-------------|
| **LPIC-1 101** | Test (multiple choice) | Linux fundamentals, distribution-independent |
| **LPIC-1 102** | Test (multiple choice) | Scripting, networking, security, administration |
| **RHCSA (EX200)** | **Practical** — a live system, a timer | Red Hat Enterprise Linux 9 administration |

The chapters are organized **by topic**, not by exam — LPI's numbering
is exam logistics, not a learning order. At the bottom of each page it says
which objective it corresponds to.

[:material-checkbox-marked-outline: Full matrix of certification objectives](objectives.md){ .md-button .md-button--primary }

In that matrix you also mark your progress — which objectives you have covered and which remain.

!!! warning "RHCSA is a different genre"
    LPIC-1 is a test — reading notes and memorizing works.
    In RHCSA you are given a system and you **do** the tasks. For that you need
    [labs](Lab/index.md), not notes.

---

## Chapters

<div class="grid cards" markdown>

- :material-rocket-launch: **[00 — Setup](00_Setup/index.md)**
  Distribution, virtual machine, first boot

- :material-console: **[01 — The command line](01_Shell/index.md)**
  Terminal, shell, paths, `man`

- :material-folder: **[02 — Files](02_Files/index.md)**
  FHS, navigation, `find`, archives

- :material-text: **[03 — Text](03_Text/index.md)**
  pipes, `grep`, `sed`, `awk`, `vi`

- :material-account-group: **[04 — Users](04_Users/index.md)**
  Groups, `chmod`, `sudo`

- :material-package-variant: **[05 — Packages](05_Packages/index.md)**
  `dnf`, `apt`, libraries

- :material-cog: **[06 — The system](06_System/index.md)**
  boot, `systemd`, processes, logs

- :material-harddisk: **[07 — Disks](07_Storage/index.md)**
  Partitions, `mount`, LVM

- :material-lan: **[08 — Networking](08_Network/index.md)**
  IP, DNS, `ssh`, `rsync`, firewall

- :material-script-text: **[09 — Scripting](09_Scripting/index.md)**
  bash, `cron`, timers

- :material-shield-lock: **[10 — Security](10_Security/index.md)**
  ssh keys, encryption, SELinux

- :material-cube-outline: **[11 — Containers](11_Containers/index.md)**
  Podman, volumes, quadlets

- :material-map: **[12 — The GIS last mile](12_GIS/index.md)**
  GDAL/OGR CLI, batch processing

</div>

---

## Resources

- [LPI — official exam objectives](https://www.lpi.org/our-certifications/lpic-1-overview/) — free, public
- [Red Hat — RHCSA EX200 objectives](https://www.redhat.com/en/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam)
- [Red Hat Developer Subscription](https://developers.redhat.com/products/rhel/download) — RHEL free for individuals
- [GDAL — command documentation](https://gdal.org/programs/index.html)

!!! note "About the material"
    These notes are written while learning. If you spot a mistake or something is unclear —
    [send it to us](https://github.com/GIS-Edu-Georgia/GIS_OS_Doc/issues).
