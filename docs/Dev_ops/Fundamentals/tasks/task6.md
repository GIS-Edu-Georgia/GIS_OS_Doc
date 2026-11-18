Task 6 — User and Permission Management

## მომხმარებლების შექმნა

Developer-ის შექმნა: 
```bash
sudo adduser developer
```

Deploy-ის შექმნა: 
```bash
sudo adduser deploy
```

!!! tip "მომხმარებლის პარამეტრები"
        დამატების დროს კონსოლშივე გაძლევს ახალ დეტალებს შესავსებად
        შეგიძლია გამოტოვო თამამად


```console
k@devserver:~$ sudo adduser developer
info: Adding user `developer' ...
info: Selecting UID/GID from range 1000 to 59999 ...
info: Adding new group `developer' (1001) ...
info: Adding new user `developer' (1001) with group `developer (1001)' ...
info: Creating home directory `/home/developer' ...
info: Copying files from `/etc/skel' ...
New password:
Retype new password:
passwd: password updated successfully
Changing the user information for developer
Enter the new value, or press ENTER for the default
        Full Name []:
        Room Number []:
        Work Phone []:
        Home Phone []:
        Other []:
Is the information correct? [Y/n] Y
info: Adding new user `developer' to supplemental / extra groups `users' ...
info: Adding user `developer' to group `users' ...


k@devserver:~$ sudo adduser deploy
info: Adding user `deploy' ...
info: Selecting UID/GID from range 1000 to 59999 ...
info: Adding new group `deploy' (1002) ...
info: Adding new user `deploy' (1002) with group `deploy (1002)' ...
info: Creating home directory `/home/deploy' ...
info: Copying files from `/etc/skel' ...
New password:
Retype new password:
passwd: password updated successfully
Changing the user information for deploy
Enter the new value, or press ENTER for the default
        Full Name []:
        Room Number []:
        Work Phone []:
        Home Phone []:
        Other []:
Is the information correct? [Y/n]
info: Adding new user `deploy' to supplemental / extra groups `users' ...
info: Adding user `deploy' to group `users' ...
```

## უფლებების განსაზღვრა

!!! info "Sudo ჯგუფი"
        Ubuntu-ში მომხმარებელს sudo უფლება ეძლევა მისი დამატებით sudo ჯგუფში.

მიეცი უფლება developer-ს (აქ -aG ნიშნავს "Add to Group").
```bash
sudo usermod -aG sudo developer
``` 
!!! warning "Sudo - ს გარეშე"
        deploy მომხმარებელს არაფერს ვუშვებით, ის ავტომატურად დარჩება ჩვეულებრივ მომხმარებლად sudo-ს გარეშე.

## გატესტვა

დეველოპერის გატესტვა SUDO - ზე <br>

შეცვალე მომხმარებელი ბაშში
```bash
su - developer
```
კონსოლში ასე უნდა გამოიყურებოდეს დეველოპერის მომხმარებელი <br>
რომელიც @ განთავსებულია devserver - ზე <br>
developer@devserver:~$ 
```console
Password:
To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.
```

ბრძანება გაუშვი ისეთი რომელიც root უფლებებს მოითხოვს
```bash
sudo apt update
```
```console
[sudo] password for developer:
Hit:1 http://security.ubuntu.com/ubuntu noble-security InRelease
Hit:2 http://ge.archive.ubuntu.com/ubuntu noble InRelease
Hit:3 http://ge.archive.ubuntu.com/ubuntu noble-updates InRelease
Hit:4 http://ge.archive.ubuntu.com/ubuntu noble-backports InRelease
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
2 packages can be upgraded. Run 'apt list --upgradable' to see them.
developer@devserver:~$

```

!!! warning "deploy მომხმარებელი"
        deploy  - ს არ აქვს უფლება

გადაანაცვლე მომხმარებელი
```bash
k@devserver:~$ su - deploy
```
```console
Password:
```

გატესტე 
```bash
sudo apt update
```

```bash
[sudo] password for deploy:
deploy is not in the sudoers file.
```
!!! tip "მაგიური სიტყვა"
        სტანდარტულ მომხმარებელზე დასაბრუნებლად გამოიყენე exit



