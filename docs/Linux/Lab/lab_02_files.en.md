# Lab 02 — Files and folders

!!! abstract "Task"
    A colleague left you a mess — 2 years of field data in one folder.
    Sort it, clean it up and archive it. **Don't drag a single file by hand.**

| Time | Difficulty | Chapters | Exam |
|-----|---------|--------|---------|
| 25 minutes | Beginner | [02](../02_Files/index.md) · [03](../03_Text/index.md) | LPIC-1 103.3 · RHCSA |

!!! danger "Rules"
    - Start the timer **before** you begin
    - `man` and `--help` — **allowed** (they are allowed in the exam too)
    - The internet, ChatGPT, the answers on this page — **not allowed**
    - If you don't finish in 25 minutes, stop and look at the answer. Then do it again **from scratch** against the timer.

---

## Setup

Run this block to create the practice environment:

```bash
rm -rf ~/lab02 && mkdir -p ~/lab02/field_data && cd ~/lab02/field_data

# field points
for y in 2024 2025; do
  for m in 03 06 09; do
    for i in 1 2 3; do
      touch "points_${y}_${m}_0${i}.shp" "points_${y}_${m}_0${i}.dbf" \
            "points_${y}_${m}_0${i}.shx" "points_${y}_${m}_0${i}.prj"
    done
  done
done

# orthophotos — a few large ones
for i in 1 2 3 4 5; do
  head -c 12M /dev/urandom > "ortho_2024_0${i}.tif"
done
head -c 40M /dev/urandom > ortho_2025_huge.TIF

# junk
touch temp1.tmp temp2.tmp '~qgis_backup.qgz~' thumbs.db
mkdir -p empty_folder1 empty_folder2
echo "CRS: EPSG:32638, surveyor: T. Beridze" > readme.txt
echo "CRS: EPSG:32637, surveyor: N. Kapanadze" > readme_rustavi.txt

ls -la ~/lab02/field_data | head
```

---

## Tasks

!!! question "1 — Inventory *(3 min)*"
    Count and answer:

    1. How many files are in `field_data` in total?
    2. How many `.shp` files are there?
    3. Which file is the largest?
    4. How much space does the whole folder take?

!!! question "2 — Sorting by year *(6 min)*"
    Create `~/lab02/sorted/2024/` and `~/lab02/sorted/2025/`.

    Move every file into the right folder based on its name.

    ⚠️ `ortho_2025_huge.TIF` is in upper case — it must also end up in 2025.

!!! question "3 — Cleaning up the junk *(4 min)*"
    Delete from `field_data`:

    - all `.tmp` files
    - `thumbs.db`
    - all empty folders
    - all files whose name starts or ends with a tilde (`~`)

    ⚠️ **Look** at the list first, then delete. `readme.txt` must not be deleted.

!!! question "4 — Metadata *(4 min)*"
    Both `readme` files contain a CRS. Find **with one command** which
    file contains `EPSG:32638` — without opening the files.

!!! question "5 — Archive *(5 min)*"
    1. Archive the whole `~/lab02/sorted/` folder as `~/lab02/field_2024_2025.tar.gz`.
    2. Check the archive's size.
    3. List its contents — **without extracting the archive**.

!!! question "6 — Symbolic link *(3 min)*"
    Create a link `~/current_project` that points to `~/lab02/sorted/2025/`.
    Check with `ls -l` that it is a link and not a copy.

---

## Check

```bash
# run at the end of the lab
cd ~/lab02
echo "--- 2024:"; ls sorted/2024 | wc -l      # should be 41
echo "--- 2025:"; ls sorted/2025 | wc -l      # should be 37
echo "--- junk:"; find field_data -name "*.tmp" -o -name "thumbs.db" | wc -l  # 0
echo "--- empty:"; find field_data -type d -empty | wc -l   # 0
echo "--- archive:"; ls -lh field_2024_2025.tar.gz
echo "--- link:"; ls -l ~/current_project
```

---

??? example "Answers — try it yourself first"

    **1 — Inventory**

    ```bash
    ls -1 | wc -l                      # number of files
    find . -name "*.shp" | wc -l       # 18
    ls -lhS | head -3                  # sorted by size, largest at the top
    du -sh .                           # total size of the folder
    ```

    **2 — Sorting**

    ```bash
    mkdir -p ~/lab02/sorted/{2024,2025}
    cd ~/lab02/field_data
    find . -maxdepth 1 -type f -iname "*2024*" -exec mv {} ~/lab02/sorted/2024/ \;
    find . -maxdepth 1 -type f -iname "*2025*" -exec mv {} ~/lab02/sorted/2025/ \;
    ```

    `-iname` is a must — `-name "*2025*"` would also catch the upper-case `.TIF`,
    but make it a habit: you can't trust the case of file names.

    And `-maxdepth 1` is there so it doesn't go into the newly created subfolders.

    **3 — Cleaning up**

    ```bash
    find . -name "*.tmp" -o -name "thumbs.db" -o -name "~*" -o -name "*~"   # look first
    find . \( -name "*.tmp" -o -name "thumbs.db" -o -name "~*" -o -name "*~" \) -delete
    find . -type d -empty -delete
    ```

    !!! danger "The brackets are critical"
        Adding `-delete` without brackets would act only on the **last**
        condition — that is how `find` reads `-o`. Without brackets this command
        would delete something other than you think. This is exactly where
        people lose data with `find`.

    **4 — Metadata**

    ```bash
    grep -l "EPSG:32638" *.txt
    # readme.txt
    ```

    `-l` (list) shows only the file name, not its contents.

    **5 — Archive**

    ```bash
    cd ~/lab02
    tar -czf field_2024_2025.tar.gz sorted/
    ls -lh field_2024_2025.tar.gz
    tar -tzf field_2024_2025.tar.gz | head
    ```

    | Flag | Meaning |
    |-------|-------------|
    | `-c` | create |
    | `-z` | gzip compression |
    | `-f` | file — the next argument is the file name |
    | `-t` | list — just the list, without extracting |
    | `-x` | extract |

    !!! tip "Did you notice the archive barely got smaller?"
        Files created with `/dev/urandom` are random bytes and cannot be compressed.
        **Real GeoTIFFs are often like this too** — if a raster is already compressed
        (LZW, DEFLATE, JPEG), `tar -z` spends extra time with no result.
        In that case `tar -cf` (without compression) is faster.

    **6 — Link**

    ```bash
    ln -s ~/lab02/sorted/2025 ~/current_project
    ls -l ~/current_project
    # lrwxrwxrwx ... current_project -> /home/user/lab02/sorted/2025
    ```

    The first letter `l` means link. Without `-s` you would get a hard link,
    which does not work on folders at all.

---

## What you learned

- batch processing with `find` criteria and `-exec`
- why brackets are needed with `-o` — a matter of data safety
- the four `tar` flags that cover 95% of cases
- symbolic links — for keeping a stable project path in GIS

## Next

- [Lab 03 — Text and streams](index.md) *(in preparation)*
- Theory: [`find` in detail](../02_Files/find.md)

---

!!! info "Certification mapping"
    **LPIC-1:** 103.3 · 103.7 · 104.6 · 104.7
    **RHCSA:** essential tools (files, archives, `grep`)

    Full matrix — [certification objectives](../objectives.md)
