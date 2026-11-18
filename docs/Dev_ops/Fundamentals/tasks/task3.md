#Task 3 — Static IP Configuration

## Check Network Interfaces

პირველ რიგში, ვამოწმებთ ინტერფეისების სახელებს:

```bash
ip a
```
ვპოულობთ Host-Only ინტერფეისს (მაგ: enp0s3 ან enp0s8).

!!! info 
    თუ ხედავ 10.0.2.15 — ეს ინტერნეტის (NAT) ადაპტერია. <br>
    თუ ხედავ 192.168.56.101 — ეს Host-Only ადაპტერია. <br>
    
ვხსნით Netplan კონფიგურაციის ფაილს:

```bash
sudo nano /etc/netplan/00-installer-config.yaml
```

## network Configuration
- კონფიგურაციის ფაილი:
```yaml
network:
  version: 2
  ethernets:
    enp0s3:
      dhcp4: no
      addresses:
        - 192.168.56.101/24
    enp0s8:
      dhcp4: true
      nameservers:
        addresses: [1.1.1.1, 8.8.8.8]
```
!!! tip
    ++ctrl+x++ დაგეხმარება გახსნილი ფაილის დახურვაში <br>
    ++ctrl+y++ დაგეხმარება დასტურში ფაილის სახელზე <br>
    ++enter++ უბრალოდ თანხმობა და ფაილი დაიხურება <br>
    
## Secure File Permissions

Netplan-ის ფაილს ვუწერთ უსაფრთხო უფლებებს:
```bash
sudo chmod 600 /etc/netplan/00-installer-config.yaml
```

## Apply Configuration

ცვლილებების გამოყენება:
```bash
sudo netplan apply
```

## Test

მისამართების ნახვა: ip a (ნახე, გაუჩნდა თუ არა enp0s8-ს IP 
მისამართი, მაგალითად 10.0.2.15). <br>

გარე კავშირის შემოწმება (IP-ით): ping -c 4 8.8.8.8 (თუ პინგები გადის, ე.ი. ინტერნეტი არის, მაგრამ სახელს ვერ ხსნის). <br>

DNS-ის შემოწმება (სახელით): ping -c 4 google.com <br>