/* DevOps quiz: ტრეკი A (Ubuntu / Docker). წყარო: MyDevOps-ის ქვიზის ბანკი (bash).
   კითხვა: [ka, en|null, [პასუხები], სწორის ინდექსი, განმარტება?]
   en: ინგლისური თარგმანი; განმარტება {ka, en} ობიექტია.
   Option strings: "ka|en" (ან ერთი სტრიქონი). ამ ფაილში პასუხები "|"-ს არ შეიცავს. */
(window.QUIZ_SUBJECTS = window.QUIZ_SUBJECTS || []).push({
  id: "devops-bash",
  icon: "📜",
  title: { ka: "Bash და Cron", en: "Bash and Cron" },
  desc: { ka: "ცვლადები, პირობები, სკრიპტები, cron", en: "Variables, conditions, scripts, cron" },
  quizzes: [
    {
      id: "v1",
      title: { ka: "ტესტი", en: "Test" },
      questions: [
          ["როგორ სწორად ენიჭება ცვლადი Bash-ში?", "How is a variable assigned correctly in Bash?", ["name = \"Giorgi\"", "name=\"Giorgi\"", "$name=\"Giorgi\"", "set name Giorgi"], 1, {"ka": "`=`-ის გარშემო space არ უნდა იყოს.", "en": "No spaces around `=`."}],
          ["რას აკეთებს `set -euo pipefail`?", "What does `set -euo pipefail` do?", ["სკრიპტს ჩერდება შეცდომაზე, გაუცხადებელ ცვლადზე და pipe-ის შეცდომაზე|Stops the script on an error, an unset variable or a failed pipe", "ლოგებს ხურავს|Closes the logs", "სკრიპტს აჩქარებს|Speeds up the script", "root-ს რთავს|Switches to root"], 0],
          ["რას ნიშნავს `$?`?", "What does `$?` mean?", ["წინა ბრძანების exit status|The exit status of the previous command", "პროცესის ID|The process ID", "არგუმენტების რაოდენობა|The number of arguments", "სკრიპტის სახელი|The script name"], 0, {"ka": "0 = წარმატება.", "en": "0 = success."}],
          ["რას აბრუნებს `$#`?", "What does `$#` return?", ["არგუმენტების რაოდენობას|The number of arguments", "ყველა არგუმენტს|All arguments", "PID-ს|The PID", "ბოლო ბრძანებას|The last command"], 0],
          ["რით შევამოწმოთ, რომ ფაილი ჩვეულებრივი ფაილია?", "How do we check that a file is a regular file?", ["[ -d f ]", "[ -f f ]", "[ -x f ]", "[ -z f ]"], 1, {"ka": "`-d` დირექტორია, `-e` არსებობა.", "en": "`-d` is a directory, `-e` means exists."}],
          ["რატომ ვწერთ `\"$var\"` ბრჭყალებში?", "Why do we write `\"$var\"` in quotes?", ["word splitting-ისგან დასაცავად|To prevent word splitting", "სიჩქარისთვის|For speed", "ფერისთვის|For colour", "აუცილებელი არაა არასდროს|It is never needed"], 0],
          ["რას აკეთებს cron `*/5 * * * *`?", "What does the cron entry `*/5 * * * *` do?", ["ყოველ 5 წუთში|Every 5 minutes", "ყოველ 5 საათში|Every 5 hours", "ყოველ 5 დღეში|Every 5 days", "5 საათზე|At 5 o'clock"], 0],
          ["`0 2 * * *` ნიშნავს:", "`0 2 * * *` means:", ["ყოველდღე 02:00-ზე|Every day at 02:00", "ყოველ 2 წუთში|Every 2 minutes", "2 რიცხვში|On the 2nd of the month", "ორშაბათს|On Monday"], 0],
          ["რატომ არ მუშაობს ხშირად ხელით მომუშავე სკრიპტი cron-იდან?", "Why does a script that works by hand often fail from cron?", ["განსხვავებული PATH/გარემო|A different PATH/environment", "cron ნელია|cron is slow", "cron root-ია მხოლოდ|cron is root only", "ფაილი დიდია|The file is large"], 0, {"ka": "გამოიყენე სრული ბილიკები და გადაიტანე output ლოგში.", "en": "Use full paths and redirect output to a log."}],
          ["რას აკეთებს `>> log 2>&1`?", "What does `>> log 2>&1` do?", ["stdout-ს და stderr-ს ლოგში ამატებს|Appends both stdout and stderr to the log", "ფაილს ანულებს|Empties the file", "შეცდომებს მალავს|Hides errors", "ფონში უშვებს|Runs it in the background"], 0],
          ["რას აკეთებს `crontab -r`?", "What does `crontab -r` do?", ["შლის მთლიან crontab-ს|Deletes the whole crontab", "აჩვენებს სიას|Shows the list", "ხსნის რედაქტორს|Opens the editor", "გადატვირთავს cron-ს|Restarts cron"], 0],
          ["რა არის `flock` deploy სკრიპტში?", "What is `flock` used for in a deploy script?", ["ერთდროული გაშვების აკრძალვა lock-ით|Prevents concurrent runs with a lock", "ფაილის კოპირება|Copies a file", "ლოგის როტაცია|Rotates logs", "პაროლის დაშიფვრა|Encrypts a password"], 0]
      ],
    },
  ],
});
