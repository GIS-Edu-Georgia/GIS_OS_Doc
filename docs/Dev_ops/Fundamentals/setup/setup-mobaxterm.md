    ┌──────────────────────────────────────────────────────────────────────┐
    │                 • MobaXterm Personal Edition v26.0 •           │
    │               (SSH client, X server and network tools)         │
    │                                                                │
    │ ⮞ SSH session to k@192.168.56.101                              │
    │   • Direct SSH      :  ✓                                       │
    │   • SSH compression :  ✓                                       │
    │   • SSH-browser     :  ✓                                       │
    │   • X11-forwarding  :  ✓                                       │
    │                                                                │
    │ ⮞ For more info, ctrl+click on help or visit our website.      │
    └──────────────────────────────────────────────────────────────────────┘


# MobaXterm Initial Terminal Setup

ეს არის MobaXterm Personal Edition v26.0-ის პირველი გახსნა და Ubuntu სერვერზე ლოგინი.

---

## Session to `k@192.168.56.101`

- **Features enabled:**
  - Direct SSH: ✓
  - SSH compression: ✓
  - SSH-browser: ✓
  - X11-forwarding: ✓ (remote display forwarded through SSH)

- **Ubuntu Login Message:**
Welcome to Ubuntu 24.04.3 LTS (GNU/Linux 6.8.0-100-generic x86_64)

[Documentation:](https://help.ubuntu.com)

[Management:](https://landscape.canonical.com)

[Support:](https://ubuntu.com/pro)

System information: <br>
- System load: 0.37 <br>
- Memory usage: 3% <br>
- Processes: 171 <br>
- Usage of /: 27.9% of 23.44GB <br>
- Swap usage: 0% <br>
- Users logged in: 1 <br>


!!! note "**Notes:**"
    Expanded Security Maintenance (ESM) is not enabled. <br>
    68 updates available immediately. <br>
    `/usr/bin/xauth: file /home/k/.Xauthority does not exist` <br>

---

## Recovery Session `k@192.168.56.102`

- **Features enabled:** იგივე როგორც ზემოთ
- **Ubuntu Login Message:**
Welcome to Ubuntu 24.04.3 LTS (GNU/Linux 6.8.0-100-generic x86_64)

System information:
- System load: 0.22
- Memory usage: 2%
- Processes: 144
- Usage of /: 13.5% of 48.91GB
- Swap usage: 0%
- Users logged in: 1


!!! note "**Notes:**"
    - 67 updates available immediately.
    - `/usr/bin/xauth: file /home/k/.Xauthority does not exist`
    - Root commands require `sudo`.