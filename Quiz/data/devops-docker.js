/* DevOps quiz: ტრეკი A (Ubuntu / Docker). წყარო: MyDevOps-ის ქვიზის ბანკი (docker).
   კითხვა: [ka, en|null, [პასუხები], სწორის ინდექსი, განმარტება?]
   en = null: ინგლისური თარგმანი ჯერ არ არსებობს; ინტერფეისი აჩვენებს ქართულს.
   Option strings: "ka|en" (ან ერთი სტრიქონი). ამ ფაილში პასუხები "|"-ს არ შეიცავს. */
(window.QUIZ_SUBJECTS = window.QUIZ_SUBJECTS || []).push({
  id: "devops-docker",
  icon: "🐳",
  title: { ka: "Docker და Compose" },
  desc: { ka: "image, container, volume, compose, network" },
  quizzes: [
    {
      id: "v1",
      title: { ka: "ტესტი" },
      questions: [
          ["რა განსხვავებაა image-სა და container-ს შორის?",null,["image შაბლონია, container მისი გაშვებული ეგზემპლარი","იგივეა","container ფაილია მხოლოდ","image გაშვებული პროცესია"],0],
          ["რას აკეთებს `docker run -d -p 8080:80 nginx`?",null,["გაშვებს ფონში და host 8080-ს container 80-ზე აკავშირებს","აშენებს image-ს","წაშლის container-ს","პორტს ხურავს"],0],
          ["პირველი ბრძანება გატეხილი container-ის დიაგნოსტიკისთვის:",null,["docker ps -a","docker prune","docker rmi","docker login"],0,"შემდეგ `docker logs`, `inspect`."],
          ["`Exited (127)` ხშირად ნიშნავს:",null,["ბრძანება ვერ მოიძებნა","OOM kill","წარმატება","პორტი დაკავებულია"],0,"137 ხშირად OOM kill-ია."],
          ["როგორ ვინახავთ მონაცემებს container-ის წაშლის შემდეგ?",null,["volume","writable layer","tag","alias"],0],
          ["რისთვისაა `restart: unless-stopped`?",null,["reboot-ის შემდეგ container-ი ავტომატურად დგება","ყოველ წუთს რესტარტი","არასდროს რესტარტი","image-ის განახლება"],0],
          ["Compose-ში `localhost` container-ის შიგნით:",null,["თვით იმ container-ს ნიშნავს","სხვა service-ს","host-ს","DNS-ს"],0,"სხვა service-თან დასაკავშირებლად გამოიყენე service-ის სახელი."],
          ["რას აკეთებს `docker compose up -d`?",null,["სერვისებს ფონში აგებს/უშვებს","შლის ყველაფერს","image-ს აქვეყნებს","ქსელს ხურავს"],0],
          ["რატომ არ გვინდა ბრმად `latest` tag?",null,["არ არის ვერსიის გარანტია, ხვალ სხვა image იქნება","ნელია","აკრძალულია","ფასიანია"],0],
          ["Docker Hub-ზე ასატვირთი image-ის სახელი:",null,["username/repo:tag","repo.tag","tag/repo","hub/latest"],0],
          ["ვერ ვშლით Postgres-ის volume-ს და პაროლი არ იცვლება `POSTGRES_PASSWORD`-ის შეცვლით, რადგან:",null,["ინიციალიზაცია მხოლოდ ცარიელ volume-ზე ხდება","Docker-ის ბაგია","პორტია დაკავებული","cron ცვლის"],0],
          ["multi-stage build-ის მიზანი:",null,["საბოლოო image-ის ზომის შემცირება","სიჩქარე ქსელში","ლოგები","უფლებები"],0]
      ],
    },
  ],
});
