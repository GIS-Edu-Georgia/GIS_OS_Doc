# Dev Ops: სასწავლო ტრეკები

Dev Ops სექციას ორი ერთმანეთისგან **განცალკევებული** ტრეკი აქვს. ისინი სხვადასხვა სისტემას ეფუძნება, ამიტომ მათი ბრძანებები ერთმანეთში არ უნდა აურიოთ.

| | **ტრეკი A: DevOps საფუძვლები** | **ტრეკი B: GIS ინფრასტრუქტურა** |
|---|---|---|
| სისტემა | Ubuntu Server | Fedora Server |
| კონტეინერები | Docker, Docker Compose | Podman (rootless), Podman-Compose |
| პაკეტები | `apt` | `dnf` |
| Firewall | `ufw` | `firewalld` |
| უსაფრთხოება | SSH key, `fail2ban`, `ufw` | SELinux, `firewalld`, `fail2ban` |
| ფოკუსი | ზოგადი Linux და DevOps გზა: ვირტუალური მანქანა, Nginx, Docker, Git, backup | GIS სერვისები: GeoServer, PostGIS, MapStore |
| წყარო | MyDevOps ლაბორატორია | OSDoc-ის არსებული მასალები |

## ტრეკი A: DevOps საფუძვლები (Ubuntu / Docker)

ზოგადი გზა ნულიდან: Linux, ქსელი, Bash, Git, Nginx, Docker, CI/CD, მონიტორინგი, backup და production არქიტექტურა. შეიცავს 27 პრაქტიკულ ამოცანას, გაკვეთილებს, ბრძანებების ცნობარს და ქვიზებს.

- [ტრეკი A: მთავარი გვერდი](Fundamentals/index.md)
- [ქვიზები (DevOps)](Fundamentals/quiz.md)

## ტრეკი B: GIS ინფრასტრუქტურა (Fedora / Podman)

არსებული Dev Ops მასალები GIS სერვერებისთვის. მათი შინაარსი უცვლელია:

- [მოდულების გეგმა (Fedora Server, Podman, PostGIS, GeoServer)](Other/Steps.md)
- [GeoServer: Java Heap და Dump](GeoServer/Theory/Java_Heap_and_Dump_GeoServer.md)
- [HTTP მეთოდები GIS სტეკში](Web_server/http.md)
- [curl](Other/curl.md)
- [ღრუბლოვანი გამოთვლები GIS-ში](Cloud/cloud-computing-gis.md)

## დაკავშირებული მასალა

- [Linux გეოგრაფებისთვის](../Linux/intro.md)
- [ქვიზების მთავარი გვერდი](../Quiz/index.md)

!!! warning "ტრეკების არევა"
    ტრეკი A-ს ინსტრუქციები (`apt`, `ufw`, Docker) **არ არის** მისადაგებული Fedora-სთვის, ხოლო ტრეკი B-ს (`dnf`, `firewalld`, SELinux, Podman) Ubuntu-სთვის. აირჩიეთ ერთი ტრეკი და მიჰყევით მის ბრძანებებს ბოლომდე.
