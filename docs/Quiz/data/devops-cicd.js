/* DevOps quiz: ტრეკი A (Ubuntu / Docker). წყარო: MyDevOps-ის ქვიზის ბანკი (cicd).
   კითხვა: [ka, en|null, [პასუხები], სწორის ინდექსი, განმარტება?]
   en: ინგლისური თარგმანი; განმარტება {ka, en} ობიექტია.
   Option strings: "ka|en" (ან ერთი სტრიქონი). ამ ფაილში პასუხები "|"-ს არ შეიცავს. */
(window.QUIZ_SUBJECTS = window.QUIZ_SUBJECTS || []).push({
  id: "devops-cicd",
  icon: "🔁",
  title: { ka: "GitLab CI/CD", en: "GitLab CI/CD" },
  desc: { ka: "pipeline, rules, artifacts, cache, tags", en: "Pipeline, rules, artifacts, cache, tags" },
  quizzes: [
    {
      id: "v1",
      title: { ka: "ტესტი", en: "Test" },
      questions: [
          ["რა არის Runner?", "What is a Runner?", ["პროცესი, რომელიც job-ებს ასრულებს|The process that executes jobs", "branch|A branch", "ტოკენი|A token", "ბრაუზერი|A browser"], 0],
          ["Pipeline-ის სტრუქტურა:", "Pipeline structure:", ["stages → jobs → script", "jobs → branches", "tags → stages", "script → runner → repo"], 0],
          ["რა განსხვავებაა artifact-სა და cache-ს შორის?", "What is the difference between an artifact and a cache?", ["artifact შედეგია შესანახად, cache დროის დასაზოგად|An artifact is a result to keep, a cache saves time", "იგივეა|They are the same", "cache ჩამოსატვირთია|A cache is for download", "artifact არასდროს გადაეცემა job-ს|An artifact is never passed to a job"], 0, {"ka": "Artifact = ამანათი, cache = მაცივარი.", "en": "Artifact = a parcel, cache = a fridge."}],
          ["რატომ `when: always` debug artifact-ზე?", "Why `when: always` on a debug artifact?", ["job ჩავარდნისასაც შეინახოს|So it is kept even when the job fails", "სიჩქარისთვის|For speed", "სისუფთავისთვის|For cleanliness", "ტოკენისთვის|For the token"], 0],
          ["`needs` რას აკეთებს?", "What does `needs` do?", ["job-ს კონკრეტულ job-ს ამოწმებინებს და artifact-ს გადასცემს|Makes a job wait for a specific job and passes its artifacts", "stage-ს შლის|Deletes a stage", "Runner-ს ცვლის|Changes the Runner", "cache-ს ასუფთავებს|Clears the cache"], 0],
          ["`CI_PIPELINE_IID` რა არის?", "What is `CI_PIPELINE_IID`?", ["პროექტის pipeline-ის ნომერი 1,2,3...|The project's pipeline number 1, 2, 3...", "commit hash|The commit hash", "branch სახელი|The branch name", "runner ID|The runner ID"], 0, {"ka": "`snapshot-$CI_PIPELINE_IID`.", "en": "`snapshot-$CI_PIPELINE_IID`."}],
          ["`workflow: rules` რას წყვეტს?", "What does `workflow: rules` decide?", ["pipeline საერთოდ შეიქმნას თუ არა|Whether the pipeline is created at all", "job-ის script-ს|A job's script", "cache key-ს|The cache key", "Docker tag-ს|The Docker tag"], 0],
          ["rules ითვლება:", "Rules are evaluated:", ["ზემოდან ქვემოთ, პირველი დამთხვევა იგებს|Top to bottom, the first match wins", "ქვემოდან ზემოთ|Bottom to top", "შემთხვევით|Randomly", "ყველა ერთად|All at once"], 0],
          ["`when: manual` job-ისთვის ნიშნავს:", "`when: manual` on a job means:", ["Play ღილაკს ელოდება|It waits for the Play button", "ავტომატურად ეშვება|It runs automatically", "არ ეშვება|It never runs", "ორჯერ ეშვება|It runs twice"], 0],
          ["რატომ არ ვწერთ token-ს YAML-ში?", "Why don't we put a token in the YAML?", ["repo-ს ყველა ხედავს; ვინახავთ masked CI/CD Variable-ში|Everyone with repo access sees it; we store it in a masked CI/CD variable", "YAML არ იღებს|YAML does not accept it", "გრძელია|It is long", "კოდი ნელდება|The code gets slower"], 0],
          ["`include` და `trigger` განსხვავება:", "Difference between `include` and `trigger`:", ["include ფაილს კითხულობს, trigger სხვა pipeline-ს უშვებს|include reads a file, trigger starts another pipeline", "იგივეა|They are the same", "include pipeline-ს უშვებს|include starts a pipeline", "trigger ფაილს კითხულობს|trigger reads a file"], 0],
          ["Dind-ის (`docker:27-dind`) მიზანი CI-ში:", "Purpose of DinD (`docker:27-dind`) in CI:", ["Docker daemon სერვისი build-ისთვის|A Docker daemon service for builds", "ბაზა|A database", "cache|A cache", "linter|A linter"], 0],
          ["Pipeline წითლდება — ლოგში რას ვეძებთ?", "A pipeline turns red. What do we look for in the log?", ["პირველ ნამდვილ failed command-ს|The first real failed command", "ბოლო ხაზს მხოლოდ|Only the last line", "ფერებს|Colours", "ავტორს|The author"], 0]
      ],
    },
  ],
});
