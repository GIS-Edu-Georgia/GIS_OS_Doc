/* DevOps quiz: ტრეკი A (Ubuntu / Docker). წყარო: MyDevOps-ის ქვიზის ბანკი (backup).
   კითხვა: [ka, en|null, [პასუხები], სწორის ინდექსი, განმარტება?]
   en: ინგლისური თარგმანი; განმარტება {ka, en} ობიექტია.
   Option strings: "ka|en" (ან ერთი სტრიქონი). ამ ფაილში პასუხები "|"-ს არ შეიცავს. */
(window.QUIZ_SUBJECTS = window.QUIZ_SUBJECTS || []).push({
  id: "devops-backup",
  icon: "💾",
  title: { ka: "Backup, მონიტორინგი, DR", en: "Backup, monitoring, DR" },
  desc: { ka: "ბექაპი, აღდგენა, logrotate, მონიტორინგი", en: "Backups, restore, logrotate, monitoring" },
  quizzes: [
    {
      id: "v1",
      title: { ka: "ტესტი", en: "Test" },
      questions: [
          ["რა უნდა იყოს სრულ backup-ში (ჩვენს Task 24-ზე)?", "What should a full backup contain (in our Task 24)?", ["კონფიგები + ბაზა + ფაილები|Configs + database + files", "მხოლოდ ბაზა|Database only", "მხოლოდ /home|Only /home", "მხოლოდ ლოგები|Logs only"], 0],
          ["რისთვისაა `pg_dumpall`?", "What is `pg_dumpall` for?", ["PostgreSQL-ის ყველა ბაზისა და როლის დამპი|Dumping all PostgreSQL databases and roles", "ბაზის წაშლა|Deleting a database", "ინდექსაცია|Indexing", "ბექაპის დაშიფვრა|Encrypting the backup"], 0],
          ["backup-ს რატომ ვამოწმებთ `sha256sum -c`-ით?", "Why do we check a backup with `sha256sum -c`?", ["მთლიანობის დასადასტურებლად|To verify integrity", "ზომის შესამცირებლად|To reduce size", "დაშიფვრისთვის|For encryption", "სახელის შესაცვლელად|To rename it"], 0],
          ["backup-ის ერთადერთი ნამდვილი გამოცდა:", "The only real test of a backup is:", ["სუფთა მანქანაზე აღდგენა|Restoring it on a clean machine", "ფაილის ზომა|The file size", "ls -l", "ლოგში წარმატება|A success line in the log"], 0],
          ["რატომ არ ინახება backup იმავე დისკზე მხოლოდ?", "Why should a backup not live only on the same disk?", ["დისკის ჩავარდნისას ორივე დაიკარგება|If the disk fails, both are lost", "ნელია|It is slow", "აკრძალულია|It is forbidden", "ადგილი ბევრია|There is plenty of space"], 0],
          ["`iostat`-ის პირველი ბლოკი აჩვენებს:", "The first block of `iostat` output shows:", ["საშუალოს ჩატვირთვიდან|The average since boot", "მიმდინარე წამს|The current second", "ბოლო საათს|The last hour", "მხოლოდ დისკს|Only the disk"], 0],
          ["30 დღის ძველი ფაილი ავტომატურად უსაფრთხოა წასაშლელად?", "Is a 30-day-old file automatically safe to delete?", ["არა — უნდა შევამოწმოთ რა არის და რა სჭირდება|No, check what it is and whether it is needed", "დიახ|Yes", "მხოლოდ /tmp-ში|Only in /tmp", "მხოლოდ ლოგები|Only logs"], 0],
          ["logrotate რისთვისაა?", "What is logrotate for?", ["ლოგების ბრუნვა/შეკუმშვა, დისკის გადავსების თავიდან ასაცილებლად|Rotating and compressing logs so the disk does not fill up", "ბექაპი|Backups", "SSH", "DNS"], 0],
          ["`ps`-ში საკუთარი %CPU ხშირად მაღალია. ეს:", "In `ps`, its own %CPU is often high. This is:", ["ზომვის არტეფაქტია|A measurement artifact", "ვირუსია|A virus", "cron-ია|cron", "ბირთვის ბაგია|A kernel bug"], 0],
          ["backup არქივში საიდუმლოებია (key, .pgpass). რა ვქნათ?", "A backup archive contains secrets (keys, .pgpass). What should we do?", ["დავშიფროთ (gpg) და უფლებები 600/700|Encrypt it (gpg) and set permissions 600/700", "დავტოვოთ ღია|Leave it open", "დავდოთ GitHub-ზე|Put it on GitHub", "გავაგზავნოთ email-ით|Send it by email"], 0],
          ["reboot-ის შემდეგ სერვისები თვითონ უნდა ამოვიდეს. ჩვენ ამას ვამოწმებთ:", "Services must come back on their own after a reboot. We check this:", ["ნამდვილი reboot ტესტით|With a real reboot test", "ვფიქრობთ რომ ამოვა|By assuming they will", "systemctl status-ით მხოლოდ|Only with systemctl status", "ლოგის წაშლით|By deleting the log"], 0],
          ["config გამოტანა (მაგ. fail2ban `Journal matches`) არის:", "Config output (e.g. fail2ban `Journal matches`) is:", ["არა მტკიცებულება — უნდა გავტესტოთ რეალურად|Not proof: it must be tested for real", "სრული მტკიცებულება|Full proof", "ერორი|An error", "აუდიტის ბოლო|The end of the audit"], 0]
      ],
    },
  ],
});
