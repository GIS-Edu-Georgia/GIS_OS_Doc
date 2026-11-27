# Finding files — `find`

!!! abstract "Goal"
    You will learn to find what you need among thousands of files — by name, size,
    date — and to run a command directly on what you find.

    **Prerequisite:** [01 — The command line](../01_Shell/index.md) · **Time:** ~40 minutes

---

## The problem

You have a folder with 1,200 orthophotos. You need only the 2024 ones, in another folder.
In Windows Explorer you start a search, wait, then hold Ctrl and select
300 files by hand — and one wrong click undoes everything.

On Linux this is one line. And most importantly, you can **save** that line and run it
again tomorrow on the 2025 data.

## The concept

`find` is not a "search box". It is a **pipeline for processing files**.
Its logic has three parts, always in this order:

```
find  [where to look]  [by what criteria]  [what to do with the results]
```

```bash
find /data/ortho -name "*.tif" -exec gdalinfo {} \;
```

| Part | Role |
|--------|------|
| `/data/ortho` | **Where** to look |
| `-name "*.tif"` | **By what criteria** |
| `-exec gdalinfo {} \;` | **What to do** with the results |

!!! warning "The most common beginner mistake"
    `find` is **recursive by default** — it goes into every subfolder.
    `find /` scans the whole system and takes minutes. Always start
    from a specific folder, not from `/`.

## Commands

### Where to look

```bash
find .              # the current folder and all subfolders
find /data/ortho    # a specific path
find . -maxdepth 1  # only the current folder, don't go into subfolders
```

### Criteria

| Criterion | Meaning | Example |
|------------|-------------|----------|
| `-name` | Name (case-sensitive) | `-name "*.shp"` |
| `-iname` | Name (case-insensitive) | `-iname "*.TIF"` |
| `-type f` | Files only | |
| `-type d` | Folders only | |
| `-size +100M` | Larger than 100 MB | `+` more, `-` less |
| `-mtime -7` | Changed in the last 7 days | |
| `-empty` | Empty | |

!!! danger "Quotes are required"
    `find . -name *.tif` **will not work correctly.** The shell expands the asterisk before
    handing it to `find`. Always write `-name "*.tif"` — in quotes.

### Combining criteria

```bash
# TIF files larger than 100 MB — both conditions at once (AND is the default)
find /data -name "*.tif" -size +100M

# TIF or TIFF (OR)
find /data \( -name "*.tif" -o -name "*.tiff" \)

# everything except TIF
find /data ! -name "*.tif"
```

### What to do with the results

```bash
find . -name "*.tif" -print            # print the path (the default)
find . -name "*.tif" -delete           # delete  ⚠️
find . -name "*.tif" -exec ls -lh {} \;   # run a command on each one
```

In `-exec`, `{}` is "the path of the found file", and `\;` marks the end of the command.

!!! tip "Look first, then act"
    `-delete` and `-exec` are irreversible. **Always** look at the list with a plain `find` first:

    ```bash
    find /data/ortho -name "*_2024*.tif"        # 1. see what it finds
    find /data/ortho -name "*_2024*.tif" -delete # 2. only then act
    ```

---

## GIS example

!!! example "Separating the 2024 photos out of 1,200 orthophotos"

    ```bash
    # 1. first, see how many there are
    find /data/ortho -name "*_2024*.tif" | wc -l
    # 312

    # 2. create the target folder
    mkdir -p /data/ortho_2024

    # 3. move them
    find /data/ortho -name "*_2024*.tif" -exec mv {} /data/ortho_2024/ \;
    ```

!!! example "The disk is full — what is eating the space?"

    ```bash
    # files larger than 500 MB, sorted by size
    find /data -type f -size +500M -exec du -h {} + | sort -rh | head -20
    ```

    A geographer's disk is usually filled by two things: uncompressed GeoTIFFs and
    QGIS temporary files. This command finds both.

!!! example "Batch reprojection with GDAL"

    ```bash
    # every shapefile from WGS84 → UTM 38N
    find /data/vector -name "*.shp" -exec ogr2ogr -t_srs EPSG:32638 \
        /data/vector_utm/{} {} \;
    ```

    This is exactly where the difference shows. In QGIS this would take an hour of clicking
    for 40 files. Here — one command, which you can save and repeat.

!!! example "Finding the leftover companion files of a .shp"

    A shapefile is really 4–7 files. Often the `.shp` has been deleted, but the `.dbf` and `.shx` remain:

    ```bash
    find /data/vector -name "*.dbf" | while read f; do
        [ -f "${f%.dbf}.shp" ] || echo "orphan: $f"
    done
    ```

    This is already a preview of [09 — Scripting](../09_Scripting/index.md).

---

## Exercise

!!! question "1. Practice data"
    Create a test structure:

    ```bash
    mkdir -p ~/lab/ortho/{2023,2024,2025}
    cd ~/lab/ortho
    touch 2023/tbilisi_2023_01.tif 2023/tbilisi_2023_02.tif
    touch 2024/tbilisi_2024_01.tif 2024/rustavi_2024_01.tif 2024/rustavi_2024_02.TIF
    touch 2025/batumi_2025_01.tif
    touch 2024/notes.txt 2024/tbilisi_2024_01.tfw
    ```

!!! question "2. Find"
    - all `.tif` files (files only, not folders)
    - all `.tif` **and** `.TIF` — with one command
    - only the files whose name contains `rustavi`
    - everything that is **not** `.tif`
    - only folders

!!! question "3. Act"
    Move all the 2024 files (case-insensitive!) into a new folder
    `~/lab/ortho_2024/`. Check with `-print` first, then `-exec`.

??? example "Answers"

    ```bash
    # 2
    find . -name "*.tif" -type f
    find . \( -iname "*.tif" \)                  # -iname catches both
    find . -name "*rustavi*"
    find . -type f ! -name "*.tif"
    find . -type d

    # 3
    mkdir -p ~/lab/ortho_2024
    find . -iname "*_2024_*" -type f -print                        # look first
    find . -iname "*_2024_*" -type f -exec mv {} ~/lab/ortho_2024/ \;
    ```

    !!! note "Did you notice?"
        In task 2, `-iname "*.tif"` is simpler than
        `\( -name "*.tif" -o -name "*.TIF" \)`. On Linux there is almost always
        a shorter way — but you should still know `-o`, because when
        combining different criteria there is no other way.

---

## To remember

```bash
find [where] [criterion] [action]
```

- quotes on `-name` — **always**
- first `-print`, then `-delete` / `-exec`
- searching from `/` is slow — start from a specific folder
- `-iname` ignores case, `-name` does not

## Related

- [`grep` — searching for text **inside** files](../03_Text/index.md)
- [`locate` — fast search with an index](index.md)
- [09 — batch processing with scripts](../09_Scripting/index.md)
- [GDAL — official command documentation](https://gdal.org/programs/index.html)

---

!!! info "Certification mapping"
    **LPIC-1:** 103.3 (basic file management, weight 4) · 104.7 (finding system files, weight 2)
    **RHCSA:** essential tools

    Full matrix — [certification objectives](../objectives.md)
