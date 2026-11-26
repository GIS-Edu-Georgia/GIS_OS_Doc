/* DevOps quiz: ტრეკი A (Ubuntu / Docker). წყარო: MyDevOps-ის ქვიზის ბანკი (docker).
   კითხვა: [ka, en|null, [პასუხები], სწორის ინდექსი, განმარტება?]
   en: ინგლისური თარგმანი; განმარტება {ka, en} ობიექტია.
   Option strings: "ka|en" (ან ერთი სტრიქონი). ამ ფაილში პასუხები "|"-ს არ შეიცავს. */
(window.QUIZ_SUBJECTS = window.QUIZ_SUBJECTS || []).push({
  id: "devops-docker",
  icon: "🐳",
  title: { ka: "Docker და Compose", en: "Docker and Compose" },
  desc: { ka: "image, container, volume, compose, network", en: "Image, container, volume, compose, network" },
  quizzes: [
    {
      id: "v1",
      title: { ka: "ტესტი", en: "Test" },
      questions: [
          ["რა განსხვავებაა image-სა და container-ს შორის?", "What is the difference between an image and a container?", ["image შაბლონია, container მისი გაშვებული ეგზემპლარი|An image is a template, a container is a running instance of it", "იგივეა|They are the same", "container ფაილია მხოლოდ|A container is only a file", "image გაშვებული პროცესია|An image is a running process"], 0],
          ["რას აკეთებს `docker run -d -p 8080:80 nginx`?", "What does `docker run -d -p 8080:80 nginx` do?", ["გაშვებს ფონში და host 8080-ს container 80-ზე აკავშირებს|Runs it in the background and maps host port 8080 to container port 80", "აშენებს image-ს|Builds an image", "წაშლის container-ს|Deletes the container", "პორტს ხურავს|Closes the port"], 0],
          ["პირველი ბრძანება გატეხილი container-ის დიაგნოსტიკისთვის:", "First command to diagnose a broken container:", ["docker ps -a", "docker prune", "docker rmi", "docker login"], 0, {"ka": "შემდეგ `docker logs`, `inspect`.", "en": "Then `docker logs`, `inspect`."}],
          ["`Exited (127)` ხშირად ნიშნავს:", "`Exited (127)` often means:", ["ბრძანება ვერ მოიძებნა|Command not found", "OOM kill", "წარმატება|Success", "პორტი დაკავებულია|Port in use"], 0, {"ka": "137 ხშირად OOM kill-ია.", "en": "137 is often an OOM kill."}],
          ["როგორ ვინახავთ მონაცემებს container-ის წაშლის შემდეგ?", "How do we keep data after the container is removed?", ["volume|A volume", "writable layer|The writable layer", "tag|A tag", "alias|An alias"], 0],
          ["რისთვისაა `restart: unless-stopped`?", "What is `restart: unless-stopped` for?", ["reboot-ის შემდეგ container-ი ავტომატურად დგება|The container comes back automatically after a reboot", "ყოველ წუთს რესტარტი|Restart every minute", "არასდროს რესტარტი|Never restart", "image-ის განახლება|Update the image"], 0],
          ["Compose-ში `localhost` container-ის შიგნით:", "In Compose, `localhost` inside a container means:", ["თვით იმ container-ს ნიშნავს|That container itself", "სხვა service-ს|Another service", "host-ს|The host", "DNS-ს|DNS"], 0, {"ka": "სხვა service-თან დასაკავშირებლად გამოიყენე service-ის სახელი.", "en": "To reach another service, use the service name."}],
          ["რას აკეთებს `docker compose up -d`?", "What does `docker compose up -d` do?", ["სერვისებს ფონში აგებს/უშვებს|Builds and starts the services in the background", "შლის ყველაფერს|Deletes everything", "image-ს აქვეყნებს|Publishes the image", "ქსელს ხურავს|Closes the network"], 0],
          ["რატომ არ გვინდა ბრმად `latest` tag?", "Why not blindly use the `latest` tag?", ["არ არის ვერსიის გარანტია, ხვალ სხვა image იქნება|It does not pin a version; tomorrow it may be a different image", "ნელია|It is slow", "აკრძალულია|It is forbidden", "ფასიანია|It costs money"], 0],
          ["Docker Hub-ზე ასატვირთი image-ის სახელი:", "Image name for pushing to Docker Hub:", ["username/repo:tag", "repo.tag", "tag/repo", "hub/latest"], 0],
          ["ვერ ვშლით Postgres-ის volume-ს და პაროლი არ იცვლება `POSTGRES_PASSWORD`-ის შეცვლით, რადგან:", "We don't delete the Postgres volume, and changing `POSTGRES_PASSWORD` does not change the password, because:", ["ინიციალიზაცია მხოლოდ ცარიელ volume-ზე ხდება|Initialisation only happens on an empty volume", "Docker-ის ბაგია|It is a Docker bug", "პორტია დაკავებული|The port is in use", "cron ცვლის|cron changes it"], 0],
          ["multi-stage build-ის მიზანი:", "Goal of a multi-stage build:", ["საბოლოო image-ის ზომის შემცირება|A smaller final image", "სიჩქარე ქსელში|Network speed", "ლოგები|Logs", "უფლებები|Permissions"], 0]
      ],
    },
  ],
});
