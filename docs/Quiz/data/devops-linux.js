/* DevOps quiz: ტრეკი A (Ubuntu / Docker). წყარო: MyDevOps-ის ქვიზის ბანკი (linux).
   კითხვა: [ka, en|null, [პასუხები], სწორის ინდექსი, განმარტება?]
   en: ინგლისური თარგმანი; განმარტება {ka, en} ობიექტია.
   Option strings: "ka|en" (ან ერთი სტრიქონი). ამ ფაილში პასუხები "|"-ს არ შეიცავს. */
(window.QUIZ_SUBJECTS = window.QUIZ_SUBJECTS || []).push({
  id: "devops-linux",
  icon: "🐧",
  title: { ka: "Linux და ფაილური სისტემა", en: "Linux and the file system" },
  desc: { ka: "FHS, ბრძანებები, უფლებები, მომხმარებლები", en: "FHS, commands, permissions, users" },
  quizzes: [
    {
      id: "v1",
      title: { ka: "ტესტი", en: "Test" },
      questions: [
          ["რომელ საქაღალდეში ინახება სისტემის კონფიგურაციის ფაილები?", "Which directory holds system configuration files?", ["/var", "/etc", "/opt", "/srv"], 1, {"ka": "`/etc` არის კონფიგურაცია (nginx, ssh, fstab...).", "en": "`/etc` is configuration (nginx, ssh, fstab...)."}],
          ["რას შეიცავს `/var/log`?", "What does `/var/log` contain?", ["პროგრამებს|Programs", "ლოგ-ფაილებს|Log files", "მომხმარებლების ფაილებს|User files", "ბირთვს|The kernel"], 1, {"ka": "`/var` ცვალებადი მონაცემებია: ლოგები, ქეში, რიგები.", "en": "`/var` is variable data: logs, caches, queues."}],
          ["რას აჩვენებს `ls -l`-ში პირველი სიმბოლო `d`?", "What does the first character `d` in `ls -l` mean?", ["ფაილი წაშლილია|The file is deleted", "დირექტორიაა|It is a directory", "მოწყობილობაა|It is a device", "ბმულია|It is a link"], 1, {"ka": "`-` ფაილი, `d` დირექტორია, `l` სიმბოლური ბმული, `c`/`b` მოწყობილობა.", "en": "`-` file, `d` directory, `l` symbolic link, `c`/`b` device."}],
          ["რას ნიშნავს უფლება `chmod 755`?", "What does `chmod 755` mean?", ["rwxr-xr-x", "rw-r--r--", "rwx------", "rwxrwxrwx"], 0, {"ka": "7=rwx მფლობელს, 5=r-x ჯგუფს და სხვებს.", "en": "7=rwx for the owner, 5=r-x for group and others."}],
          ["რა ხდება `/proc` და `/sys`-ში?", "What is in `/proc` and `/sys`?", ["ისინი დისკზე ფაილებია|Files on disk", "ვირტუალური ფაილური სისტემებია ბირთვის ინფორმაციით|Virtual file systems with kernel information", "ბექაპებია|Backups", "დროებითი საქაღალდეებია|Temporary directories"], 1, {"ka": "ისინი მეხსიერებაში არსებობს და ბირთვის მდგომარეობას აჩვენებს.", "en": "They exist in memory and show the kernel's state."}],
          ["`/bin` თანამედროვე Ubuntu-ზე ფაქტობრივად არის:", "On modern Ubuntu, `/bin` is actually:", ["ცალკე დისკი|A separate disk", "ბმული `/usr/bin`-ზე (usr-merge)|A link to `/usr/bin` (usr-merge)", "ცარიელი საქაღალდე|An empty directory", "სერვისების საქაღალდე|A directory for services"], 1, {"ka": "`ls -la /` აჩვენებს `bin -> usr/bin`.", "en": "`ls -la /` shows `bin -> usr/bin`."}],
          ["რომელი ბრძანება ცვლის ფაილის მფლობელს?", "Which command changes a file's owner?", ["chmod", "chown", "chgrp -R", "umask"], 1, {"ka": "`chown user:group file`.", "en": "`chown user:group file`."}],
          ["`sudo` რისთვისაა?", "What is `sudo` for?", ["ბრძანების root-ის უფლებებით გასაშვებად|Running a command with root privileges", "პაროლის შესაცვლელად|Changing a password", "ფაილის წასაშლელად|Deleting a file", "ქსელის გასაჭრელად|Cutting the network"], 0],
          ["რომელი ბრძანება აჩვენებს დისკის თავისუფალ ადგილს?", "Which command shows free disk space?", ["du -sh", "df -h", "ls -s", "free -h"], 1, {"ka": "`df` ფაილურ სისტემებს, `du` საქაღალდეების ზომას ითვლის.", "en": "`df` reports file systems, `du` measures directory sizes."}],
          ["რას აკეთებს `grep -r \"error\" /var/log`?", "What does `grep -r \"error\" /var/log` do?", ["ქმნის ფაილს|Creates a file", "რეკურსიულად ეძებს სიტყვას ლოგებში|Searches the logs recursively for the word", "შლის ლოგებს|Deletes the logs", "ამატებს მომხმარებელს|Adds a user"], 1],
          ["სად ინახება მომხმარებლების ჩანაწერები?", "Where are user accounts stored?", ["/etc/passwd", "/etc/hosts", "/var/users", "/home/list"], 0, {"ka": "პაროლის ჰეშები `/etc/shadow`-შია.", "en": "Password hashes are in `/etc/shadow`."}],
          ["რას აკეთებს `|` (pipe)?", "What does `|` (pipe) do?", ["ერთი ბრძანების გამოტანას მეორეს შესატანად აძლევს|Passes one command's output as input to another", "ფაილს წერს|Writes a file", "ბრძანებას ფონში უშვებს|Runs a command in the background", "ბრძანებას წყვეტს|Stops a command"], 0]
      ],
    },
  ],
});
