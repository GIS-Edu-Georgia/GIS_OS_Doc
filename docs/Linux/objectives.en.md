# Certification objectives

This page does two things:

1. **Coverage map** — which official objective is explained in which chapter.
2. **Progress tracker** — tick a box when you finish a topic. Your whole preparation is visible on one page.

!!! tip "How to tick a box"
    The boxes are written in the text. To tick one, change `- [ ]` to `- [x]` in the file
    and push the change. That way your progress is also recorded in the Git history.

**Weight** = how many questions to expect in the exam. Each LPIC-1 exam has a total weight of 60.
Spend more time on high-weight topics.

=== "LPIC-1 · 101"

    **Exam:** 101-500 · test, 60 questions, 90 minutes · total weight 60

    ### 101 — System architecture *(weight 8)*

    - [ ] **101.1** Determine and configure hardware settings · *2* → [06 — The system](06_System/index.md)
    - [ ] **101.2** Boot the system · *3* → [06 — The system](06_System/index.md)
    - [ ] **101.3** Change boot targets and shut down or reboot the system · *3* → [06 — The system](06_System/index.md)

    ### 102 — Linux installation and package management *(weight 12)*

    - [ ] **102.1** Design hard disk layout · *2* → [07 — Disks](07_Storage/index.md)
    - [ ] **102.2** Install a boot manager (GRUB) · *2* → [07 — Disks](07_Storage/index.md)
    - [ ] **102.3** Manage shared libraries · *1* → [05 — Packages](05_Packages/index.md)
    - [ ] **102.4** Use Debian package management (`apt`, `dpkg`) · *3* → [05 — Packages](05_Packages/index.md)
    - [ ] **102.5** Use RPM and YUM/DNF package management · *3* → [05 — Packages](05_Packages/index.md)
    - [ ] **102.6** Linux as a virtualization guest · *1* → [00 — Setup](00_Setup/index.md)

    ### 103 — GNU and Unix commands *(weight 26 — the heaviest)*

    - [ ] **103.1** Work on the command line · *4* → [01 — The command line](01_Shell/index.md)
    - [ ] **103.2** Process text streams using filters · *2* → [03 — Text](03_Text/index.md)
    - [ ] **103.3** Perform basic file management · *4* → [02 — Files](02_Files/index.md)
    - [ ] **103.4** Use streams, pipes and redirects · *4* → [03 — Text](03_Text/index.md)
    - [ ] **103.5** Create, monitor and kill processes · *4* → [06 — The system](06_System/index.md)
    - [ ] **103.6** Modify process execution priorities (`nice`) · *2* → [06 — The system](06_System/index.md)
    - [ ] **103.7** Search text files using regular expressions · *3* → [03 — Text](03_Text/index.md)
    - [ ] **103.8** Basic file editing (`vi`) · *3* → [03 — Text](03_Text/index.md)

    ### 104 — Devices, Linux filesystems, FHS *(weight 14)*

    - [ ] **104.1** Create partitions and filesystems · *2* → [07 — Disks](07_Storage/index.md)
    - [ ] **104.2** Maintain the integrity of filesystems · *2* → [07 — Disks](07_Storage/index.md)
    - [ ] **104.3** Control mounting and unmounting of filesystems · *3* → [07 — Disks](07_Storage/index.md)
    - [ ] **104.5** Manage file permissions and ownership · *3* → [04 — Users](04_Users/index.md)
    - [ ] **104.6** Create and change hard and symbolic links · *2* → [02 — Files](02_Files/index.md)
    - [ ] **104.7** Find system files and place files in the correct location (FHS) · *2* → [02 — Files](02_Files/index.md)

    !!! note
        104.4 (disk quotas) was removed in version 5.0.

=== "LPIC-1 · 102"

    **Exam:** 102-500 · test, 60 questions, 90 minutes · total weight 60

    ### 105 — Shells and shell scripting *(weight 8)*

    - [ ] **105.1** Customize and use the shell environment · *4* → [01 — The command line](01_Shell/index.md)
    - [ ] **105.2** Customize or write simple scripts · *4* → [09 — Scripting](09_Scripting/index.md)

    ### 106 — User interfaces and desktops *(weight 4)*

    - [ ] **106.1** Install and configure X11 · *2* → [00 — Setup](00_Setup/index.md)
    - [ ] **106.2** Graphical desktops · *1* → [00 — Setup](00_Setup/index.md)
    - [ ] **106.3** Accessibility · *1* → [00 — Setup](00_Setup/index.md)

    ### 107 — Administrative tasks *(weight 12)*

    - [ ] **107.1** Manage user and group accounts · *5* → [04 — Users](04_Users/index.md)
    - [ ] **107.2** Automate system administration tasks (`cron`, `at`, timers) · *4* → [09 — Scripting](09_Scripting/index.md)
    - [ ] **107.3** Localization and internationalization · *3* → [06 — The system](06_System/index.md)

    !!! tip "Georgian and locale"
        107.3 is especially relevant for geographers — Georgian attributes, UTF-8
        encoding in shapefiles, `LANG` and `LC_ALL`. This is the one topic where
        an LPIC objective hits an everyday GIS pain directly.

    ### 108 — Essential system services *(weight 12)*

    - [ ] **108.1** Maintain system time (NTP) · *3* → [06 — The system](06_System/index.md)
    - [ ] **108.2** System logging (`journalctl`, syslog) · *4* → [06 — The system](06_System/index.md)
    - [ ] **108.3** Mail Transfer Agent (MTA) basics · *3* → [06 — The system](06_System/index.md)
    - [ ] **108.4** Manage printers and printing (CUPS) · *2* → [06 — The system](06_System/index.md)

    ### 109 — Networking fundamentals *(weight 14)*

    - [ ] **109.1** Fundamentals of internet protocols · *4* → [08 — Networking](08_Network/index.md)
    - [ ] **109.2** Persistent network configuration · *4* → [08 — Networking](08_Network/index.md)
    - [ ] **109.3** Basic network troubleshooting · *4* → [08 — Networking](08_Network/index.md)
    - [ ] **109.4** Configure client side DNS · *2* → [08 — Networking](08_Network/index.md)

    ### 110 — Security *(weight 10)*

    - [ ] **110.1** Perform security administration tasks · *3* → [10 — Security](10_Security/index.md)
    - [ ] **110.2** Set up host security · *3* → [10 — Security](10_Security/index.md)
    - [ ] **110.3** Securing data with encryption (SSH, GnuPG) · *4* → [10 — Security](10_Security/index.md)

=== "RHCSA · EX200"

    **Exam:** EX200 (RHEL 9) · **practical** — a live system, ~2.5 hours · weights are not published

    !!! danger "This is not a test"
        You do the tasks on a real system and the result is checked automatically.
        "I know how it's done" is not enough — **you have to do it by hand, fast.**
        Every item needs a [lab](Lab/index.md).

    ### Essential tools

    - [ ] working in the shell, redirection, pipes · → [01](01_Shell/index.md) · [03](03_Text/index.md)
    - [ ] creating, copying, moving files, archives (`tar`, `gzip`) · → [02](02_Files/index.md)
    - [ ] `grep` and regular expressions · → [03](03_Text/index.md)
    - [ ] editing text with `vim` · → [03](03_Text/index.md)
    - [ ] file permissions, ACL · → [04](04_Users/index.md)
    - [ ] remote access with `ssh` · → [08](08_Network/index.md)
    - [ ] finding documentation (`man`, `/usr/share/doc`) · → [01](01_Shell/index.md)

    ### Scripts

    - [ ] writing a simple bash script · → [09](09_Scripting/index.md)
    - [ ] conditions, loops, processing command output · → [09](09_Scripting/index.md)

    ### Operating running systems

    - [ ] booting, rebooting, switching to different targets · → [06](06_System/index.md)
    - [ ] interrupting the boot process and resetting the root password · → [06](06_System/index.md)
    - [ ] identifying processes, `kill`, priorities · → [06](06_System/index.md)
    - [ ] managing services with `systemctl`, autostart · → [06](06_System/index.md)
    - [ ] analysing logs with `journalctl` · → [06](06_System/index.md)
    - [ ] `tuned` profiles · → [06](06_System/index.md)

    ### Local storage and file systems

    - [ ] creating partitions (MBR / GPT) · → [07](07_Storage/index.md)
    - [ ] LVM: physical volume, volume group, logical volume, resizing · → [07](07_Storage/index.md)
    - [ ] configuring swap · → [07](07_Storage/index.md)
    - [ ] file systems: `xfs`, `ext4`, `vfat` · → [07](07_Storage/index.md)
    - [ ] `/etc/fstab` — mounting at boot, by UUID · → [07](07_Storage/index.md)
    - [ ] mounting an NFS network file system · → [07](07_Storage/index.md)
    - [ ] `autofs` · → [07](07_Storage/index.md)
    - [ ] Stratis / VDO (RHEL-specific) · → [07](07_Storage/index.md)

    ### Deploying and maintaining systems

    - [ ] `dnf`, adding repositories, updating packages · → [05](05_Packages/index.md)
    - [ ] configuring the system time · → [06](06_System/index.md)
    - [ ] scheduled tasks (`cron`, `at`, systemd timers) · → [09](09_Scripting/index.md)
    - [ ] updating the kernel, choosing the boot kernel · → [06](06_System/index.md)

    ### Networking

    - [ ] IPv4 / IPv6 static and dynamic addresses · → [08](08_Network/index.md)
    - [ ] `nmcli`, hostname, DNS resolution · → [08](08_Network/index.md)
    - [ ] `firewalld` — zones and services · → [08](08_Network/index.md)

    ### Users and groups

    - [ ] creating, changing, deleting users · → [04](04_Users/index.md)
    - [ ] password policy, expiry · → [04](04_Users/index.md)
    - [ ] groups and secondary groups · → [04](04_Users/index.md)
    - [ ] configuring `sudo` access · → [04](04_Users/index.md)
    - [ ] centralized authentication (LDAP / Kerberos client) · → [04](04_Users/index.md)

    ### Security

    - [ ] `firewalld` rules · → [10](10_Security/index.md)
    - [ ] key-based SSH authentication · → [10](10_Security/index.md)
    - [ ] **SELinux** — enforcing/permissive, file contexts, booleans · → [10](10_Security/index.md)
    - [ ] diagnosing and fixing SELinux problems · → [10](10_Security/index.md)

    !!! warning "SELinux is the most common place to fail"
        GeoServer's data folder, PostGIS data, Podman volumes —
        SELinux contexts get in your way everywhere until you understand how they work.
        `Permission denied` even when you have `chmod 777` — that's SELinux.

    ### Containers

    - [ ] finding and using containers and images (`podman`) · → [11](11_Containers/index.md)
    - [ ] running a container, ports, environment variables · → [11](11_Containers/index.md)
    - [ ] persistent storage (volumes) · → [11](11_Containers/index.md)
    - [ ] starting a container automatically with `systemd` · → [11](11_Containers/index.md)

    !!! note "Source"
        The list follows the EX200 objectives published by Red Hat and is
        grouped by the chapters of this documentation.
        **Always check the official list before the exam** — Red Hat updates it periodically:
        [redhat.com — EX200 objectives](https://www.redhat.com/en/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam).

---

## Official sources

| Exam | Objectives list |
|---------|----------------|
| LPIC-1 101-500 | [lpi.org — Exam 101 objectives](https://www.lpi.org/our-certifications/exam-101-objectives/) |
| LPIC-1 102-500 | [lpi.org — Exam 102 objectives](https://www.lpi.org/our-certifications/exam-102-objectives/) |
| RHCSA EX200 | [redhat.com — EX200](https://www.redhat.com/en/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam) |

!!! info "The objectives lists are public"
    LPI and Red Hat publish their objectives lists for free — they are the official backbone of the exams.
    On this page they are summarized and linked to the chapters of this documentation.
    The learning text itself is original.
