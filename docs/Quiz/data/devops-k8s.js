/* DevOps quiz: ტრეკი A (Ubuntu / Docker). წყარო: MyDevOps-ის ქვიზის ბანკი (k8s).
   კითხვა: [ka, en|null, [პასუხები], სწორის ინდექსი, განმარტება?]
   en: ინგლისური თარგმანი; განმარტება {ka, en} ობიექტია.
   Option strings: "ka|en" (ან ერთი სტრიქონი). ამ ფაილში პასუხები "|"-ს არ შეიცავს. */
(window.QUIZ_SUBJECTS = window.QUIZ_SUBJECTS || []).push({
  id: "devops-k8s",
  icon: "☸️",
  title: { ka: "Kubernetes", en: "Kubernetes" },
  desc: { ka: "Pod, ReplicaSet, Deployment, kubectl", en: "Pod, ReplicaSet, Deployment, kubectl" },
  quizzes: [
    {
      id: "v1",
      title: { ka: "ტესტი", en: "Test" },
      questions: [
          ["რა არის Pod?", "What is a Pod?", ["ერთი ან მეტი container-ის runtime გარემო|A runtime environment for one or more containers", "node|A node", "ქსელი|A network", "image|An image"], 0],
          ["ReplicaSet-ის საქმე:", "A ReplicaSet's job:", ["Pod-ების რაოდენობის შენარჩუნება|Keeping the desired number of Pods running", "image-ის აგება|Building images", "DNS", "secret-ები|Secrets"], 0],
          ["Deployment რას მართავს?", "What does a Deployment manage?", ["ReplicaSet-ებს, rollout/rollback-ით|ReplicaSets, with rollout/rollback", "node-ებს|Nodes", "ქსელს|The network", "დისკებს|Disks"], 0],
          ["მოკვდა Pod, რომელიც Deployment-ს ეკუთვნის. რა ხდება?", "A Pod that belongs to a Deployment dies. What happens?", ["ახალი Pod შეიქმნება|A new Pod is created", "არაფერი|Nothing", "Deployment წაიშლება|The Deployment is deleted", "node გაითიშება|The node shuts down"], 0],
          ["პირდაპირ შექმნილი Pod-ის წაშლის შემდეგ:", "After deleting a Pod created directly:", ["აღარ დაბრუნდება|It does not come back", "დაბრუნდება|It comes back", "ReplicaSet შექმნის|A ReplicaSet recreates it", "node გადაიტვირთება|The node reboots"], 0],
          ["selector და template labels უნდა:", "The selector and the template labels must:", ["ემთხვეოდეს|Match", "განსხვავდებოდეს|Differ", "ცარიელი იყოს|Be empty", "იყოს მხოლოდ app|Only be app"], 0],
          ["rolling update-ზე image ცვლილება:", "Changing the image in a rolling update:", ["ახალ ReplicaSet-ს ქმნის, ძველს ამცირებს|Creates a new ReplicaSet and scales the old one down", "ყველა Pod-ს ერთდროულად შლის|Deletes all Pods at once", "node-ს ცვლის|Changes the node", "Secret-ს ცვლის|Changes the Secret"], 0],
          ["უკან დასაბრუნებლად:", "To roll back:", ["kubectl rollout undo deployment/web", "kubectl delete node", "kubectl scale 0", "kubectl logs"], 0],
          ["`ImagePullBackOff`-ის სავარაუდო მიზეზი:", "Likely cause of `ImagePullBackOff`:", ["არასწორი image/tag ან registry წვდომა|Wrong image/tag or no registry access", "CPU ლიმიტი|CPU limit", "ქსელი გამორთულია|Network is down", "cron"], 0],
          ["Pod-ის დეტალური დიაგნოსტიკა (Events):", "Detailed Pod diagnostics (Events):", ["kubectl describe pod", "kubectl get nodes", "kubectl top", "kubectl config"], 0],
          ["scale-ზე იცვლება:", "When scaling, what changes?", ["replicas რაოდენობა, template იგივე რჩება|The number of replicas; the template stays the same", "image|The image", "labels|The labels", "namespace|The namespace"], 0],
          ["Secret და ConfigMap-ის განსხვავება:", "Difference between a Secret and a ConfigMap:", ["Secret მგრძნობიარე მონაცემებისთვისაა, ConfigMap ჩვეულებრივი კონფიგისთვის|A Secret is for sensitive data, a ConfigMap for ordinary config", "იგივეა|They are the same", "ConfigMap დაშიფრულია|A ConfigMap is encrypted", "Secret მხოლოდ ფაილია|A Secret is only a file"], 0]
      ],
    },
  ],
});
