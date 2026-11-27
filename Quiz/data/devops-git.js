/* DevOps quiz: ტრეკი A (Ubuntu / Docker). წყარო: MyDevOps-ის ქვიზის ბანკი (git).
   კითხვა: [ka, en|null, [პასუხები], სწორის ინდექსი, განმარტება?]
   en: ინგლისური თარგმანი; განმარტება {ka, en} ობიექტია.
   Option strings: "ka|en" (ან ერთი სტრიქონი). ამ ფაილში პასუხები "|"-ს არ შეიცავს. */
(window.QUIZ_SUBJECTS = window.QUIZ_SUBJECTS || []).push({
  id: "devops-git",
  icon: "🌿",
  title: { ka: "Git და Workflow", en: "Git and workflow" },
  desc: { ka: "commit, branch, merge, remote, deploy key", en: "Commit, branch, merge, remote, deploy key" },
  quizzes: [
    {
      id: "v1",
      title: { ka: "ტესტი", en: "Test" },
      questions: [
          ["რას აკეთებს `git add`?", "What does `git add` do?", ["ფაილებს staging area-ში ამატებს|Adds files to the staging area", "ასუფთავებს repo-ს|Cleans the repo", "ზეცას გზავნის|Sends to the cloud", "branch-ს ქმნის|Creates a branch"], 0],
          ["რა არის commit?", "What is a commit?", ["ცვლილებების შენახული snapshot|A saved snapshot of changes", "remote|A remote", "branch|A branch", "tag|A tag"], 0],
          ["რომელი ბრძანება ქმნის ახალ branch-ს და გადადის მასზე?", "Which command creates a new branch and switches to it?", ["git checkout -b feature", "git new feature", "git branch -d feature", "git switch -x"], 0, {"ka": "`git switch -c feature` ასევე.", "en": "`git switch -c feature` also works."}],
          ["რას აკეთებს `git pull --ff-only`?", "What does `git pull --ff-only` do?", ["მხოლოდ fast-forward განახლებას, merge commit-ის გარეშე|Only a fast-forward update, without a merge commit", "ყველაფერს წერს თავზე|Overwrites everything", "branch-ს შლის|Deletes the branch", "push-ს აკეთებს|Pushes"], 0],
          ["`git status` რას გვიჩვენებს?", "What does `git status` show?", ["working tree და staging მდგომარეობას|The state of the working tree and staging area", "ისტორიას|The history", "remote-ებს|The remotes", "tag-ებს|The tags"], 0],
          ["როგორ ვნახოთ ისტორია ერთ ხაზად?", "How do we view history one line per commit?", ["git log --oneline", "git show-all", "git diff --log", "git history"], 0],
          ["რისთვისაა deploy key GitHub-ზე?", "What is a deploy key on GitHub for?", ["სერვერს repo-ზე წვდომას აძლევს ერთი key-ით|Gives a server access to one repo with a single key", "მომხმარებლის შესასვლელად|User login", "ბილინგისთვის|Billing", "CI ტოკენი|A CI token"], 0, {"ka": "ჩვენთან: ssh alias `github-docker-app`.", "en": "In our setup: the ssh alias `github-docker-app`."}],
          ["`Author identity unknown` შეცდომის გამოსწორება:", "Fixing the `Author identity unknown` error:", ["git config user.name / user.email", "git reset", "git init", "git clean"], 0],
          ["რატომ ჯობს noreply email commit-ებში?", "Why use a noreply email in commits?", ["რეალური email არ ქვეყნდება|Your real email is not published", "სიჩქარე|Speed", "ფორმატი|Format", "აუცილებელია GitHub-ზე|GitHub requires it"], 0],
          ["რას აკეთებს `git tag v1.0.0`?", "What does `git tag v1.0.0` do?", ["commit-ს release სახელს არქმევს|Gives a commit a release name", "branch-ს შლის|Deletes a branch", "remote-ს ქმნის|Creates a remote", "ფაილს ამატებს|Adds a file"], 0],
          ["`git revert` განსხვავდება `git reset`-ისგან იმით, რომ:", "`git revert` differs from `git reset` in that it:", ["ქმნის ახალ commit-ს ისტორიის გადაწერის გარეშე|Creates a new commit without rewriting history", "ისტორიას წერს გადაწერით|Rewrites history", "ფაილებს შლის|Deletes files", "remote-ს ცვლის|Changes the remote"], 0],
          ["main branch-ზე ინიციალიზაციის შემდეგ ჩანს `master`. გასასწორებლად:", "After init, `master` shows up instead of `main`. To fix it:", ["git branch -m main", "git remote rename", "git rm master", "git merge main"], 0]
      ],
    },
  ],
});
