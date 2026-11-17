/* DevOps quiz: ტრეკი A (Ubuntu / Docker). წყარო: MyDevOps-ის ქვიზის ბანკი (git).
   კითხვა: [ka, en|null, [პასუხები], სწორის ინდექსი, განმარტება?]
   en = null: ინგლისური თარგმანი ჯერ არ არსებობს; ინტერფეისი აჩვენებს ქართულს.
   Option strings: "ka|en" (ან ერთი სტრიქონი). ამ ფაილში პასუხები "|"-ს არ შეიცავს. */
(window.QUIZ_SUBJECTS = window.QUIZ_SUBJECTS || []).push({
  id: "devops-git",
  icon: "🌿",
  title: { ka: "Git და Workflow" },
  desc: { ka: "commit, branch, merge, remote, deploy key" },
  quizzes: [
    {
      id: "v1",
      title: { ka: "ტესტი" },
      questions: [
          ["რას აკეთებს `git add`?",null,["ფაილებს staging area-ში ამატებს","ასუფთავებს repo-ს","ზეცას გზავნის","branch-ს ქმნის"],0],
          ["რა არის commit?",null,["ცვლილებების შენახული snapshot","remote","branch","tag"],0],
          ["რომელი ბრძანება ქმნის ახალ branch-ს და გადადის მასზე?",null,["git checkout -b feature","git new feature","git branch -d feature","git switch -x"],0,"`git switch -c feature` ასევე."],
          ["რას აკეთებს `git pull --ff-only`?",null,["მხოლოდ fast-forward განახლებას, merge commit-ის გარეშე","ყველაფერს წერს თავზე","branch-ს შლის","push-ს აკეთებს"],0],
          ["`git status` რას გვიჩვენებს?",null,["working tree და staging მდგომარეობას","ისტორიას","remote-ებს","tag-ებს"],0],
          ["როგორ ვნახოთ ისტორია ერთ ხაზად?",null,["git log --oneline","git show-all","git diff --log","git history"],0],
          ["რისთვისაა deploy key GitHub-ზე?",null,["სერვერს repo-ზე წვდომას აძლევს ერთი key-ით","მომხმარებლის შესასვლელად","ბილინგისთვის","CI ტოკენი"],0,"ჩვენთან: ssh alias `github-docker-app`."],
          ["`Author identity unknown` შეცდომის გამოსწორება:",null,["git config user.name / user.email","git reset","git init","git clean"],0],
          ["რატომ ჯობს noreply email commit-ებში?",null,["რეალური email არ ქვეყნდება","სიჩქარე","ფორმატი","აუცილებელია GitHub-ზე"],0],
          ["რას აკეთებს `git tag v1.0.0`?",null,["commit-ს release სახელს არქმევს","branch-ს შლის","remote-ს ქმნის","ფაილს ამატებს"],0],
          ["`git revert` განსხვავდება `git reset`-ისგან იმით, რომ:",null,["ქმნის ახალ commit-ს ისტორიის გადაწერის გარეშე","ისტორიას წერს გადაწერით","ფაილებს შლის","remote-ს ცვლის"],0],
          ["main branch-ზე ინიციალიზაციის შემდეგ ჩანს `master`. გასასწორებლად:",null,["git branch -m main","git remote rename","git rm master","git merge main"],0]
      ],
    },
  ],
});
