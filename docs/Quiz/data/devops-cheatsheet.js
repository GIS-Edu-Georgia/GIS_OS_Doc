/* DevOps quiz: ტრეკი A (Ubuntu / Docker). წყარო: MyDevOps-ის ქვიზის ბანკი (cheatsheet).
   კითხვა: [ka, en|null, [პასუხები], სწორის ინდექსი, განმარტება?]
   en: ინგლისური თარგმანი; განმარტება {ka, en} ობიექტია.
   Option strings: "ka|en" (ან ერთი სტრიქონი). ამ ფაილში პასუხები "|"-ს არ შეიცავს. */
(window.QUIZ_SUBJECTS = window.QUIZ_SUBJECTS || []).push({
  id: "devops-cheatsheet",
  icon: "⌨️",
  title: { ka: "ბრძანებები (Cheat Sheet)", en: "Commands (cheat sheet)" },
  desc: { ka: "ყოველდღიური Linux ბრძანებები და სიტუაციები", en: "Everyday Linux commands and situations" },
  quizzes: [
    {
      id: "v1",
      title: { ka: "ტესტი", en: "Test" },
      questions: [
          ["რით ვნახოთ, რა იკავებს დისკის ადგილს საქაღალდეებში?", "How do we see what takes up disk space in directories?", ["du -h --max-depth=1 /", "df -i", "lsblk", "free -h"], 0, {"ka": "`du` ჯამავს საქაღალდეებს; `df` ფაილურ სისტემას.", "en": "`du` sums directories; `df` shows the file system."}],
          ["რომელი ბრძანება აჩვენებს მოსმენილ TCP პორტებს პროცესებით?", "Which command shows listening TCP ports with their processes?", ["ss -tlnp", "ping -c 4", "ip r", "dig"], 0],
          ["`>` და `>>` განსხვავება:", "Difference between `>` and `>>`:", ["`>` ანაცვლებს ფაილს, `>>` ბოლოში ამატებს|`>` overwrites the file, `>>` appends to the end", "იგივეა|They are the same", "`>>` შლის|`>>` deletes", "`>` მხოლოდ stderr-ია|`>` is stderr only"], 0],
          ["`2>&1` ნიშნავს:", "`2>&1` means:", ["stderr იგივე ადგილას, სადაც stdout|stderr goes to the same place as stdout", "ორი ფაილი|Two files", "ბრძანების ორჯერ გაშვება|Running the command twice", "ფონური გაშვება|Running in the background"], 0],
          ["`usermod -G docker k` (`-a`-ს გარეშე) რას გამოიწვევს?", "What does `usermod -G docker k` (without `-a`) cause?", ["k-ს ამოიღებს სხვა დამატებით ჯგუფებიდან|Removes k from its other supplementary groups", "არაფერს|Nothing", "მომხმარებელს წაშლის|Deletes the user", "პაროლს შეცვლის|Changes the password"], 0, {"ka": "ყოველთვის `usermod -aG`.", "en": "Always use `usermod -aG`."}],
          ["`chmod 600` ვის რას აძლევს?", "What does `chmod 600` give, and to whom?", ["მხოლოდ მფლობელს rw-|Owner only: rw-", "ყველას rw-|Everyone: rw-", "მფლობელს rwx|Owner: rwx", "ჯგუფს r--|Group: r--"], 0, {"ka": "SSH key-ებისთვის სწორი უფლებაა.", "en": "The correct permission for SSH keys."}],
          ["რა უფრო უსაფრთხო პროცესის შესაწყვეტად?", "What is the safer way to stop a process?", ["kill -15 (SIGTERM)", "kill -9 (SIGKILL) პირველად|kill -9 (SIGKILL) first", "reboot", "rm"], 0, {"ka": "`-9` პროცესს გასუფთავების საშუალებას არ აძლევს.", "en": "`-9` gives the process no chance to clean up."}],
          ["`systemctl reload` და `restart` განსხვავება:", "Difference between `systemctl reload` and `restart`:", ["reload კონფიგს ხელახლა კითხულობს გაჩერების გარეშე|reload re-reads the config without stopping", "იგივეა|They are the same", "restart მხოლოდ ბაზებზეა|restart is for databases only", "reload გამორთავს სერვისს|reload stops the service"], 0],
          ["სერვისის ბოლო 50 ხაზი ლოგში:", "Last 50 log lines of a service:", ["journalctl -u nginx -n 50", "systemctl logs nginx", "cat nginx", "ls /var/nginx"], 0],
          ["რით შევამოწმოთ არქივის მთლიანობა გახსნის გარეშე?", "How do we check an archive's integrity without extracting it?", ["tar -tzf", "tar -czf", "gzip -x", "ls -a"], 0, {"ka": "ჯამისთვის: `sha256sum -c`.", "en": "For checksums: `sha256sum -c`."}],
          ["`crontab -r` რას აკეთებს?", "What does `crontab -r` do?", ["წაშლის ყველა cron სამუშაოს|Deletes all cron jobs", "აჩვენებს სიას|Shows the list", "ხსნის რედაქტორს|Opens the editor", "გადატვირთავს cron-ს|Restarts cron"], 0, {"ka": "ჯერ `crontab -l > backup.cron`.", "en": "First run `crontab -l > backup.cron`."}],
          ["`0 2 * * 0` ნიშნავს:", "`0 2 * * 0` means:", ["კვირას 02:00-ზე|Sunday at 02:00", "ყოველ 2 საათში|Every 2 hours", "2 რიცხვში|On the 2nd of the month", "ორშაბათს 00:02-ზე|Monday at 00:02"], 0],
          ["`sudo !!` რას აკეთებს?", "What does `sudo !!` do?", ["წინა ბრძანებას sudo-თი იმეორებს|Repeats the previous command with sudo", "ისტორიას წმენდს|Clears the history", "ახალ მომხმარებელს ქმნის|Creates a new user", "ბოლო ფაილს შლის|Deletes the last file"], 0],
          ["სკრიპტში `$?` რას აჩვენებს?", "In a script, what does `$?` show?", ["წინა ბრძანების exit code-ს|The exit code of the previous command", "PID-ს|The PID", "არგუმენტებს|The arguments", "სახელს|The name"], 0],
          ["`rm -rf $DIR/*` საშიშია, როცა:", "`rm -rf $DIR/*` is dangerous when:", ["`$DIR` ცარიელია, გზა `/*` ხდება|`$DIR` is empty, so the path becomes `/*`", "ფაილი დიდია|The file is large", "cron-შია|It runs in cron", "ტერმინალი ძველია|The terminal is old"], 0, {"ka": "დესტრუქციულ ბრძანებამდე გამოიყენე `ls` ან `echo`.", "en": "Before a destructive command, check with `ls` or `echo`."}]
      ],
    },
  ],
});
