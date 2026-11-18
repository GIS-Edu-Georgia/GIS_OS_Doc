/* DevOps quiz: ტრეკი A (Ubuntu / Docker). წყარო: MyDevOps-ის ქვიზის ბანკი (k8s).
   კითხვა: [ka, en|null, [პასუხები], სწორის ინდექსი, განმარტება?]
   en = null: ინგლისური თარგმანი ჯერ არ არსებობს; ინტერფეისი აჩვენებს ქართულს.
   Option strings: "ka|en" (ან ერთი სტრიქონი). ამ ფაილში პასუხები "|"-ს არ შეიცავს. */
(window.QUIZ_SUBJECTS = window.QUIZ_SUBJECTS || []).push({
  id: "devops-k8s",
  icon: "☸️",
  title: { ka: "Kubernetes" },
  desc: { ka: "Pod, ReplicaSet, Deployment, kubectl" },
  quizzes: [
    {
      id: "v1",
      title: { ka: "ტესტი" },
      questions: [
          ["რა არის Pod?",null,["ერთი ან მეტი container-ის runtime გარემო","node","ქსელი","image"],0],
          ["ReplicaSet-ის საქმე:",null,["Pod-ების რაოდენობის შენარჩუნება","image-ის აგება","DNS","secret-ები"],0],
          ["Deployment რას მართავს?",null,["ReplicaSet-ებს, rollout/rollback-ით","node-ებს","ქსელს","დისკებს"],0],
          ["მოკვდა Pod, რომელიც Deployment-ს ეკუთვნის. რა ხდება?",null,["ახალი Pod შეიქმნება","არაფერი","Deployment წაიშლება","node გაითიშება"],0],
          ["პირდაპირ შექმნილი Pod-ის წაშლის შემდეგ:",null,["აღარ დაბრუნდება","დაბრუნდება","ReplicaSet შექმნის","node გადაიტვირთება"],0],
          ["selector და template labels უნდა:",null,["ემთხვეოდეს","განსხვავდებოდეს","ცარიელი იყოს","იყოს მხოლოდ app"],0],
          ["rolling update-ზე image ცვლილება:",null,["ახალ ReplicaSet-ს ქმნის, ძველს ამცირებს","ყველა Pod-ს ერთდროულად შლის","node-ს ცვლის","Secret-ს ცვლის"],0],
          ["უკან დასაბრუნებლად:",null,["kubectl rollout undo deployment/web","kubectl delete node","kubectl scale 0","kubectl logs"],0],
          ["`ImagePullBackOff`-ის სავარაუდო მიზეზი:",null,["არასწორი image/tag ან registry წვდომა","CPU ლიმიტი","ქსელი გამორთულია","cron"],0],
          ["Pod-ის დეტალური დიაგნოსტიკა (Events):",null,["kubectl describe pod","kubectl get nodes","kubectl top","kubectl config"],0],
          ["scale-ზე იცვლება:",null,["replicas რაოდენობა, template იგივე რჩება","image","labels","namespace"],0],
          ["Secret და ConfigMap-ის განსხვავება:",null,["Secret მგრძნობიარე მონაცემებისთვისაა, ConfigMap ჩვეულებრივი კონფიგისთვის","იგივეა","ConfigMap დაშიფრულია","Secret მხოლოდ ფაილია"],0]
      ],
    },
  ],
});
