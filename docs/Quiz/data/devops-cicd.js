/* DevOps quiz: ტრეკი A (Ubuntu / Docker). წყარო: MyDevOps-ის ქვიზის ბანკი (cicd).
   კითხვა: [ka, en|null, [პასუხები], სწორის ინდექსი, განმარტება?]
   en = null: ინგლისური თარგმანი ჯერ არ არსებობს; ინტერფეისი აჩვენებს ქართულს.
   Option strings: "ka|en" (ან ერთი სტრიქონი). ამ ფაილში პასუხები "|"-ს არ შეიცავს. */
(window.QUIZ_SUBJECTS = window.QUIZ_SUBJECTS || []).push({
  id: "devops-cicd",
  icon: "🔁",
  title: { ka: "GitLab CI/CD" },
  desc: { ka: "pipeline, rules, artifacts, cache, tags" },
  quizzes: [
    {
      id: "v1",
      title: { ka: "ტესტი" },
      questions: [
          ["რა არის Runner?",null,["პროცესი, რომელიც job-ებს ასრულებს","branch","ტოკენი","ბრაუზერი"],0],
          ["Pipeline-ის სტრუქტურა:",null,["stages → jobs → script","jobs → branches","tags → stages","script → runner → repo"],0],
          ["რა განსხვავებაა artifact-სა და cache-ს შორის?",null,["artifact შედეგია შესანახად, cache დროის დასაზოგად","იგივეა","cache ჩამოსატვირთია","artifact არასდროს გადაეცემა job-ს"],0,"Artifact = ამანათი, cache = მაცივარი."],
          ["რატომ `when: always` debug artifact-ზე?",null,["job ჩავარდნისასაც შეინახოს","სიჩქარისთვის","სისუფთავისთვის","ტოკენისთვის"],0],
          ["`needs` რას აკეთებს?",null,["job-ს კონკრეტულ job-ს ამოწმებინებს და artifact-ს გადასცემს","stage-ს შლის","Runner-ს ცვლის","cache-ს ასუფთავებს"],0],
          ["`CI_PIPELINE_IID` რა არის?",null,["პროექტის pipeline-ის ნომერი 1,2,3...","commit hash","branch სახელი","runner ID"],0,"`snapshot-$CI_PIPELINE_IID`."],
          ["`workflow: rules` რას წყვეტს?",null,["pipeline საერთოდ შეიქმნას თუ არა","job-ის script-ს","cache key-ს","Docker tag-ს"],0],
          ["rules ითვლება:",null,["ზემოდან ქვემოთ, პირველი დამთხვევა იგებს","ქვემოდან ზემოთ","შემთხვევით","ყველა ერთად"],0],
          ["`when: manual` job-ისთვის ნიშნავს:",null,["Play ღილაკს ელოდება","ავტომატურად ეშვება","არ ეშვება","ორჯერ ეშვება"],0],
          ["რატომ არ ვწერთ token-ს YAML-ში?",null,["repo-ს ყველა ხედავს; ვინახავთ masked CI/CD Variable-ში","YAML არ იღებს","გრძელია","კოდი ნელდება"],0],
          ["`include` და `trigger` განსხვავება:",null,["include ფაილს კითხულობს, trigger სხვა pipeline-ს უშვებს","იგივეა","include pipeline-ს უშვებს","trigger ფაილს კითხულობს"],0],
          ["Dind-ის (`docker:27-dind`) მიზანი CI-ში:",null,["Docker daemon სერვისი build-ისთვის","ბაზა","cache","linter"],0],
          ["Pipeline წითლდება — ლოგში რას ვეძებთ?",null,["პირველ ნამდვილ failed command-ს","ბოლო ხაზს მხოლოდ","ფერებს","ავტორს"],0]
      ],
    },
  ],
});
