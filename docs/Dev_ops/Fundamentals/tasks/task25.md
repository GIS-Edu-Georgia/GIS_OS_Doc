Task 25 — Performance Optimization



 გამოააშკარავე "რესურსების მჭამელები"
სანამ რამეს გამორთავ, ნახე, რომელი სერვისები იტვირთება სისტემის ჩართვისას და რამდენი დრო მიაქვს თითოეულს:

Bash
# ნახე რომელი სერვისი რამდენ ხანს ანდომებს ჩართვას
systemd-analyze blame
თუ ხედავ სერვისებს, რომლებიც არ გჭირდება (მაგალითად, apache2, თუ მხოლოდ nginx-ს იყენებ, ან snapd), შეგიძლია ისინი გამორთო.

2. ზედმეტი სერვისების გათიშვა (Systemd)
თუ იპოვე სერვისი, რომელიც არ გჭირდება, გამოიყენე disable (რომ ჩართვისას აღარ გაეშვას) და stop (რომ ახლავე გაჩერდეს):

Bash
# მაგალითად, თუ გაქვს bluetooth სერვერზე (რაც არ გჭირდება)
```bash
sudo systemctl stop bluetooth
```

```bash
sudo systemctl disable bluetooth
```

# თუ არ იყენებ Snap პაკეტებს (Snap ხშირად ანელებს სისტემას)
```bash
sudo systemctl stop snapd
```
```bash
sudo systemctl disable snapd
```
3. მეხსიერების (RAM) ოპტიმიზაცია: "Swappiness"
Linux იყენებს Swap-ს (მყარ დისკს), როცა RAM ივსება. ნაგულისხმევად, Ubuntu ნაადრევად იწყებს Swap-ის გამოყენებას, რაც სისტემას ანელებს. შეამოწმე მიმდინარე მნიშვნელობა:

Bash
cat /proc/sys/vm/swappiness
თუ 60-ია, შეცვალე 10-ზე (რაც ნიშნავს, რომ Swap-ს მხოლოდ უკიდურეს შემთხვევაში გამოიყენებს):

Bash
sudo sysctl vm.swappiness=10
(რომ შენარჩუნდეს გადატვირთვის შემდეგ, ჩაწერე /etc/sysctl.conf ფაილში).

4. PostgreSQL-ის ოპტიმიზაცია (რადგან გიყენია)
ნაგულისხმევი PostgreSQL კონფიგურაცია გათვლილია ძალიან სუსტ მანქანებზე. მისი აჩქარება შეგიძლია ფაილში: /etc/postgresql/XX/main/postgresql.conf

შეცვალე ეს პარამეტრები (შენი RAM-ის მიხედვით):

shared_buffers: მიეცი RAM-ის დაახლოებით 25% (მაგ. თუ 2GB გაქვს, დააყენე 512MB).

effective_cache_size: მიეცი RAM-ის 50-75%.

work_mem: გაზარდე 4MB-დან 16MB-მდე (რთული ქუერებისთვის).

5. ქსელური ოპტიმიზაცია (Limits)
გაზარდე მაქსიმალური გახსნილი ფაილების რაოდენობა, რომ სერვერმა მეტი კავშირი გაატაროს: გახსენი /etc/security/limits.conf და ბოლოში დაამატე:

Plaintext
* soft nofile 65535
* hard nofile 65535
შედეგის შემოწმება
ოპტიმიზაციის შემდეგ გაუშვი htop ან glances (რაც წინა დავალებებში დავაყენეთ) და ნახე:

Tasks: შემცირდა თუ არა გაშვებული პროცესების რაოდენობა?

Load Average: დაიკლო თუ არა დატვირთვამ?

RAM: რამდენად ნაკლები მეხსიერებაა გამოყენებული "IDLE" (დასვენების) რეჟიმში?

```console
k@devserver:~$ systemd-analyze blame
5.514s motd-news.service
4.413s dev-mapper-ubuntu\x2d\x2dvg\x2dubuntu\x2d\x2dlv.device
3.754s docker.service
2.625s postgresql@16-main.service
2.132s snapd.service
1.774s grub-common.service
1.640s man-db.service
1.440s dev-hugepages.mount
1.434s dev-mqueue.mount
1.425s sys-kernel-debug.mount
1.384s sys-kernel-tracing.mount
1.291s keyboard-setup.service
1.230s kmod-static-nodes.service
1.213s lvm2-monitor.service
1.179s apparmor.service
1.129s modprobe@configfs.service
1.075s upower.service
1.042s modprobe@dm_mod.service
1.000s systemd-udev-trigger.service
 959ms modprobe@drm.service
 901ms apport.service
 899ms modprobe@efi_pstore.service
 872ms modprobe@fuse.service
 867ms apt-daily-upgrade.service
 855ms apt-daily.service
 850ms modprobe@loop.service
 840ms systemd-logind.service
 814ms e2scrub_reap.service
 769ms dbus.service
 711ms dpkg-db-backup.service
 663ms user@1000.service
 630ms fwupd.service
 628ms systemd-modules-load.service
 578ms systemd-remount-fs.service
lines 1-34


k@devserver:~$ sudo systemctl stop snapd
Stopping 'snapd.service', but its triggering units are still active:
snapd.socket
k@devserver:~$ sudo systemctl disable snapd
Removed "/etc/systemd/system/multi-user.target.wants/snapd.service".
Disabling 'snapd.service', but its triggering units are still active:
snapd.socket
k@devserver:~$ cat /proc/sys/vm/swappiness
60
k@devserver:~$ sudo sysctl vm.swappiness=10
vm.swappiness = 10
k@devserver:~$ sudo nano /etc/sysctl.conf

```

ცვლილება ახლავე

k@devserver:~$ sudo sysctl -p
vm.swappiness = 10


ბაზის ოპტიმიზაცია
შენი PostgreSQL ვერსია
გაუშვი ეს ბრძანება, რომ გაიგო ზუსტი მისამართი:

Bash
ls /etc/postgresql/
თუ გამოგიგდო მაგალითად 14, მაშინ მისამართი იქნება /etc/postgresql/14/main/postgresql.conf.

2. პარამეტრების მოძებნა და შეცვლა
PostgreSQL-ის კონფიგურაციის ფაილი ძალიან დიდია (ასობით ხაზია). იმის ნაცვლად, რომ სათითაოდ ეძებო, გამოიყენე Nano-ს ძებნის ფუნქცია:

გახსენი ფაილი (ჩასვი შენი ვერსია XX-ს ნაცვლად):

Bash
sudo nano /etc/postgresql/XX/main/postgresql.conf
დააჭირე Ctrl + W (Where is) – ეს გახსნის ძებნას.

ჩაწერე სიტყვა (მაგალითად: shared_buffers) და დააჭირე Enter.

წაშალე ძველი მნიშვნელობა და ჩაწერე ახალი. მნიშვნელოვანია: თუ ხაზის დასაწყისში არის სიმბოლო #, წაშალე ისიც (ეს ნიშნავს, რომ პარამეტრი გააქტიურდა).

დააყენე ეს მნიშვნელობები (თუ 2GB RAM გაქვს):
shared_buffers = 512MB

effective_cache_size = 1536MB (ეს არის 2GB-ის 75%)

work_mem = 16MB

3. შენახვა და გადატვირთვა
მას შემდეგ რაც სამივე პარამეტრს შეცვლი:

Ctrl + O შემდეგ Enter (შენახვა).

Ctrl + X (გამოსვლა).

ცვლილებები ძალაში რომ შევიდეს, აუცილებლად უნდა გადატვირთო Postgres სერვისი:

Bash
sudo systemctl restart postgresql
4. როგორ შევამოწმოთ, რომ Postgres-მა "დაინახა" ცვლილება?
შეგიძლია პირდაპირ ბაზიდან ჰკითხო სისტემას:

Bash
sudo -u postgres psql -c "SHOW shared_buffers;"
თუ გამოგიტანა 512MB, ე.ი. ოპტიმიზაცია წარმატებით დასრულდა!


k@devserver:~$ ls /etc/postgresql/
16
k@devserver:~$ sudo nano /etc/postgresql/16/main/postgresql.conf
k@devserver:~$ sudo systemctl restart postgresql
k@devserver:~$ sudo -u postgres psql -c "SHOW shared_buffers;"
 shared_buffers
----------------
 512MB
(1 row)

k@devserver:~$


სისტემის ოპტიმიზაცია


sudo nano /etc/security/limits.conf
რა უნდა გააკეთო შიგნით:
ჩადი ფაილის ბოლოში (ისარი ღილაკებით).

ბოლო ხაზზე (სადაც წერია # End of file) ცოტა ზემოთ ან ქვემოთ ჩაამატე ეს ორი ხაზი:

Plaintext
* soft nofile 65535
* hard nofile 65535
შეინახე: Ctrl + O შემდეგ Enter.

გამოდი: Ctrl + X.

რატომ ვაკეთებთ ამას? (ოპტიმიზაციის ნაწილი)
ნაგულისხმევად, Linux-ს აქვს ლიმიტი, თუ რამდენ ფაილთან (ან ქსელურ კავშირთან) შეუძლია ერთდროულად მუშაობა ერთ მომხმარებელს (ჩვეულებრივ 1024).

თუ შენი PostgreSQL ან Nginx ბევრ მოთხოვნას მიიღებს, ეს ლიმიტი შეიძლება არ ეყოს და სისტემა შენელდეს ან ერორები ამოყაროს. ამ ცვლილებით ჩვენ სერვერს "სუნთქვის საშუალებას" ვაძლევთ.

როგორ შეამოწმო შედეგი?
იმისთვის, რომ ნახო, შეიცვალა თუ არა ლიმიტი, უნდა გამოხვიდე სესიიდან და თავიდან შეხვიდე (ან გადატვირთო სერვერი), შემდეგ კი აკრიფო:

Bash
ulimit -n
თუ დაგიწერა 65535, ე.ი. ყველაფერი იდეალურადაა!


რადგან limits.conf-ში უკვე ჩაწერე 65535, ეს ცვლილება რომ აისახოს, საჭიროა:

გამოხვიდე სესიიდან (exit) და თავიდან შეხვიდე SSH-ით.

თუ მაინც 1024-ს გიჩვენებს, მაშინ სერვერი უნდა დაარებუთო:

Bash
sudo reboot
რებუთის შემდეგ ისევ გაუშვი ulimit -n და უკვე 65535 უნდა დაგხვდეს.

რატომ არის ეს მნიშვნელოვანი ოპტიმიზაციისთვის?
წარმოიდგინე, რომ შენი PostgreSQL ბაზა ერთდროულად ბევრ კავშირს ამუშავებს, პარალელურად Nginx-იც აწვდის ფაილებს და Netdata-ც აკეთებს მონიტორინგს. თითოეული ეს მოქმედება არის "გახსნილი ფაილი". თუ ლიმიტი 1024-ია, სერვერი უბრალოდ იტყვის: "მეტი კავშირის მიღება არ μπορώ" და აპლიკაცია გაჩერდება.

✅ შეჯამება (Task 25 დასრულებულია):
Services: ზედმეტები გამორთე (systemctl disable).

Swappiness: დააყენე 10 (RAM-ის ეფექტური გამოყენება).

Postgres: მოუმატე shared_buffers და work_mem.

Limits: გაზარდე nofile 65535-მდე.

ამით შენი Ubuntu Server ახლა ბევრად უფრო "სხარტი" და მზად არის რეალური დატვირთვებისთვის.



k@devserver:~$ ulimit -n
65535




htop გადამოწმება რესურსებზე CPU

```console

 1791 netdata     20   0 99804  9304  5616 R   7.6  0.1  0:14.74 /usr/libexec/netdata/plugins.d/apps.plugin 1
   2969 k           20   0  7340  3700  3440 S   0.8  0.0  0:03.00 bash -c while true; do sleep 1;head -v -n 8 /proc/meminfo; head -v -n 2 /proc/stat /proc/version /proc/uptime /proc/loadavg /proc/sys/fs/fi
   4600 k           20   0  9740  6252  4200 R   8.0  0.1  0:01.89 htop
   1065 root        20   0 1969M 59984 35380 S   2.9  0.7  0:08.14 /usr/bin/containerd
   1157 root        20   0 2373M 99.6M 64344 R   4.6  1.3  0:11.32 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
   1747 netdata     20   0  725M 95336 26324 S   2.1  1.2  0:04.88 /usr/sbin/netdata -P /run/netdata/netdata.pid -D
   1781 netdata     20   0  4588  3444  2948 S   0.0  0.0  0:01.71 bash /usr/libexec/netdata/plugins.d/tc-qos-helper.sh 1
   1887 netdata     20   0 1322M  107M 67444 S   2.5  1.4  0:06.19 /usr/libexec/netdata/plugins.d/go.d.plugin 1
   1980 root        20   0 1204M 11460  7396 S   0.8  0.1  0:00.88 /usr/bin/containerd-shim-runc-v2 -namespace moby -id 31a8450ff79eb204df0c80f8fe4af0bcc11dd55c0ee4804e4c663a4c30119234 -address /run/contain
   2134 netdata     20   0 1322M  107M 67444 S   1.3  1.4  0:01.16 /usr/libexec/netdata/plugins.d/go.d.plugin 1
   2332 netdata     20   0 1322M  107M 67444 S   0.4  1.4  0:01.26 /usr/libexec/netdata/plugins.d/go.d.plugin 1
   1067 root        20   0 1969M 59984 35380 S   1.7  0.7  0:04.35 /usr/bin/containerd
   1154 root        20   0  466M 35776 16940 R   0.8  0.4  0:01.60 /usr/bin/python3 /usr/bin/fail2ban-server -xf start
   1362 root        20   0 2373M 99.6M 64344 S   1.3  1.3  0:03.20 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
   1658 netdata     20   0  725M 95336 26324 S   0.0  1.2  0:01.04 /usr/sbin/netdata -P /run/netdata/netdata.pid -D
   1754 netdata     20   0  725M 95336 26324 S   0.8  1.2  0:01.20 /usr/sbin/netdata -P /run/netdata/netdata.pid -D
   1764 netdata     20   0  725M 95336 26324 S   2.1  1.2  0:03.08 /usr/sbin/netdata -P /run/netdata/netdata.pid -D
   1768 netdata     20   0  725M 95336 26324 S   0.4  1.2  0:07.01 /usr/sbin/netdata -P /run/netdata/netdata.pid -D
   1979 root        20   0 1204M 11460  7396 S   0.8  0.1  0:01.54 /usr/bin/containerd-shim-runc-v2 -namespace moby -id 31a8450ff79eb204df0c80f8fe4af0bcc11dd55c0ee4804e4c663a4c30119234 -address /run/contain
   2306 netdata     20   0 1322M  107M 67444 S   0.0  1.4  0:01.84 /usr/libexec/netdata/plugins.d/go.d.plugin 1
   2315 root        20   0 2373M 99.6M 64344 S   1.3  1.3  0:03.30 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
   2966 k           20   0 15284  8100  5896 S   0.8  0.1  0:03.87 sshd: k@pts/0
    902 messagebus  20   0  9888  5632  4592 R   2.5  0.1  0:03.83 @dbus-daemon --system --address=systemd: --nofork --nopidfile --systemd-activation --syslog-only
    927 root        20   0 18168  8840  7756 S   1.3  0.1  0:01.51 /usr/lib/systemd/systemd-logind
   1144 root        20   0 1969M 59984 35380 S   2.5  0.7  0:01.30 /usr/bin/containerd
   1160 root        20   0 2373M 99.6M 64344 S   2.1  1.3  0:02.60 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
   1630 netdata     20   0  725M 95336 26324 S   0.8  1.2  0:00.81 /usr/sbin/netdata -P /run/netdata/netdata.pid -D
   1732 netdata     20   0  725M 95336 26324 S   0.8  1.2  0:01.76 /usr/sbin/netdata -P /run/netdata/netdata.pid -D
   1736 netdata     20   0  725M 95336 26324 S   0.4  1.2  0:00.37 /usr/sbin/netdata -P /run/netdata/netdata.pid -D
   1739 netdata     20   0  725M 95336 26324 S   0.0  1.2  0:00.25 /usr/sbin/netdata -P /run/netdata/netdata.pid -D
   1753 netdata     20   0  725M 95336 26324 S   0.4  1.2  0:00.22 /usr/sbin/netdata -P /run/netdata/netdata.pid -D
   1755 netdata     20   0  725M 95336 26324 S   0.4  1.2  0:00.36 /usr/sbin/netdata -P /run/netdata/netdata.pid -D
   1770 netdata     20   0  725M 95336 26324 S   0.0  1.2  0:00.30 /usr/sbin/netdata -P /run/netdata/netdata.pid -D
   1776 netdata     20   0 87984  6076  5100 S   0.0  0.1  0:00.36 /usr/libexec/netdata/plugins.d/debugfs.plugin 1
   1782 root        20   0 14124  5236  4456 S   0.0  0.1  0:00.29 /usr/libexec/netdata/plugins.d/nfacct.plugin 1
   1797 netdata     20   0  126M  5796  4888 S   0.0  0.1  0:00.34 /usr/libexec/netdata/plugins.d/network-viewer.plugin 1
   1866 netdata     20   0 87984  6076  5100 S   0.4  0.1  0:00.69 /usr/libexec/netdata/plugins.d/debugfs.plugin 1
   1888 netdata     20   0 1322M  107M 67444 S   0.8  1.4  0:01.55 /usr/libexec/netdata/plugins.d/go.d.plugin 1
```

RAM

```console
  1778 netdata     20   0 1322M  107M 67444 S   0.0  1.4  0:02.71 /usr/libexec/netdata/plugins.d/go.d.plugin 1
   1887 netdata     20   0 1322M  107M 67444 S   2.2  1.4  0:07.42 /usr/libexec/netdata/plugins.d/go.d.plugin 1
   1888 netdata     20   0 1322M  107M 67444 S   0.0  1.4  0:01.92 /usr/libexec/netdata/plugins.d/go.d.plugin 1
   1889 netdata     20   0 1322M  107M 67444 S   1.4  1.4  0:02.14 /usr/libexec/netdata/plugins.d/go.d.plugin 1
   1890 netdata     20   0 1322M  107M 67444 S   0.7  1.4  0:02.50 /usr/libexec/netdata/plugins.d/go.d.plugin 1
   2121 netdata     20   0 1322M  107M 67444 S   0.0  1.4  0:01.12 /usr/libexec/netdata/plugins.d/go.d.plugin 1
   2134 netdata     20   0 1322M  107M 67444 S   0.0  1.4  0:01.52 /usr/libexec/netdata/plugins.d/go.d.plugin 1
   2152 netdata     20   0 1322M  107M 67444 S   0.0  1.4  0:00.04 /usr/libexec/netdata/plugins.d/go.d.plugin 1
   2305 netdata     20   0 1322M  107M 67444 S   0.0  1.4  0:00.00 /usr/libexec/netdata/plugins.d/go.d.plugin 1
   2306 netdata     20   0 1322M  107M 67444 S   0.7  1.4  0:02.25 /usr/libexec/netdata/plugins.d/go.d.plugin 1
   2307 netdata     20   0 1322M  107M 67444 S   0.0  1.4  0:00.56 /usr/libexec/netdata/plugins.d/go.d.plugin 1
   2332 netdata     20   0 1322M  107M 67444 S   0.0  1.4  0:01.26 /usr/libexec/netdata/plugins.d/go.d.plugin 1
   1149 root        20   0 2373M  100M 64516 S   0.0  1.3  0:02.06 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
   1157 root        20   0 2373M  100M 64516 S   3.6  1.3  0:12.92 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
   1158 root        20   0 2373M  100M 64516 S   0.0  1.3  0:00.08 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
   1159 root        20   0 2373M  100M 64516 S   0.0  1.3  0:01.55 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
   1160 root        20   0 2373M  100M 64516 S   0.0  1.3  0:02.74 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
   1161 root        20   0 2373M  100M 64516 S   0.0  1.3  0:00.00 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
   1207 root        20   0 2373M  100M 64516 S   0.0  1.3  0:00.32 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
   1233 root        20   0 2373M  100M 64516 S   0.0  1.3  0:00.24 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
   1301 root        20   0 2373M  100M 64516 S   0.0  1.3  0:00.00 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
   1320 root        20   0 2373M  100M 64516 S   0.0  1.3  0:00.39 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
   1362 root        20   0 2373M  100M 64516 S   2.2  1.3  0:03.97 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
   1384 root        20   0 2373M  100M 64516 S   1.4  1.3  0:04.09 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
   1924 root        20   0 2373M  100M 64516 S   2.2  1.3  0:04.00 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
   1935 root        20   0 2373M  100M 64516 S   0.0  1.3  0:03.51 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
   1936 root        20   0 2373M  100M 64516 S   0.0  1.3  0:00.22 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
   2315 root        20   0 2373M  100M 64516 S   0.0  1.3  0:03.88 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
   1108 netdata     20   0  723M 95264 25952 S   0.0  1.2  0:01.97 /usr/sbin/netdata -P /run/netdata/netdata.pid -D
   1166 netdata     20   0  723M 95264 25952 S   0.0  1.2  0:00.05 /usr/sbin/netdata -P /run/netdata/netdata.pid -D
   1602 netdata     20   0  723M 95264 25952 S   0.0  1.2  0:00.00 /usr/sbin/netdata -P /run/netdata/netdata.pid -D
   1603 netdata     20   0  723M 95264 25952 S   0.0  1.2  0:00.00 /usr/sbin/netdata -P /run/netdata/netdata.pid -D
   1618 netdata     20   0  723M 95264 25952 S   0.0  1.2  0:00.00 /usr/sbin/netdata -P /run/netdata/netdata.pid -D
   1627 netdata     20   0  723M 95264 25952 S   0.0  1.2  0:00.18 /usr/sbin/netdata -P /run/netdata/netdata.pid -D
   1628 netdata     20   0  723M 95264 25952 S   0.0  1.2  0:00.06 /usr/sbin/netdata -P /run/netdata/netdata.pid -D
   1629 netdata     20   0  723M 95264 25952 S   0.7  1.2  0:00.06 /usr/sbin/netdata -P /run/netdata/netdata.pid -D
   1630 netdata     20   0  723M 95264 25952 S   0.0  1.2  0:00.91 /usr/sbin/netdata -P /run/netdata/netdata.pid -D

```