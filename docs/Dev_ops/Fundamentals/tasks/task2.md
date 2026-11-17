# Task 2 — Network Setup

## Network Configuration Overview

- VM-ში ორი ადაპტერია ჩართული:
  1. Adapter 1: NAT
  2. Adapter 2: Host-Only

- Ubuntu ინტერფეისები:
  - `lo` — loopback
  - `enp0s3` — NAT
  - `enp0s8` — Host-Only

## VirtualBox Network Configuration

გახსენით VirtualBox და მიჰყევით შემდეგ ნაბიჯებს:

1. დააჭირეთ: **Machine → Settings → Network**

2. მოარგეთ ადაპტერები:

  Adapter 1
   - ✅ Enable Network Adapter  
   - 🌐 Attached to: **Host-Only Adapter**

  Adapter 2
   - ✅ Enable Network Adapter  
   - 🌐 Attached to: **NAT**

---

!!! note "**Note:**""
    Host-Only Adapter გამოიყენება ლოკალური კომუნიკაციისთვის, ხოლო NAT — ინტერნეტთან წვდომისთვის.



## **Useful Bash Commands**

```bash
# შემოწმება IP და ინტერფეისების
ip a
ip link
```

!!! warning
    ქსელის კონფიგურაციის ფაილის ცვლილება შეიძლება დაგჭირდეს <br>
    ფაილის წვდომა უნდა იყოს უსაფრთხოდ! <br>
    და არ დაგავიწყდეს გაფრთხილებები Netplan - ისგან <br>

```bash
sudo chmod 600 /etc/netplan/00-installer-config.yaml
```
```bash
WARNING: Permissions for /etc/netplan/00-installer-config.yaml are too open
```