/* DevOps quiz: ტრეკი A (Ubuntu / Docker). თემა: Vim, ტექსტური რედაქტორი სერვერზე.
   წყარო: ბრძანებების ცნობარი, სექცია 4a (Dev_ops/Fundamentals/commands.md).
   კითხვა: [ka, en|null, [პასუხები], სწორის ინდექსი, განმარტება?]
   en: ინგლისური თარგმანი; განმარტება {ka, en} ობიექტია.
   Option strings: "ka|en" (ან ერთი სტრიქონი). ამ ფაილში პასუხები "|"-ს არ შეიცავს. */
(window.QUIZ_SUBJECTS = window.QUIZ_SUBJECTS || []).push({
  id: "devops-vim",
  icon: "📝",
  title: { ka: "Vim რედაქტორი", en: "Vim editor" },
  desc: { ka: "რეჟიმები, შენახვა და გასვლა, ნავიგაცია, ძებნა და ჩანაცვლება", en: "Modes, saving and quitting, navigation, search and replace" },
  quizzes: [
    {
      id: "v1",
      title: { ka: "საბაზისო", en: "Basics" },
      questions: [
          ["რატომ ღირს Vim-ის ცოდნა, თუ nano გვაქვს?", "Why is it worth knowing Vim if we have nano?", ["`vi` თითქმის ყველა სერვერზეა, nano კი ზოგჯერ არ არის დაყენებული|`vi` is on almost every server, while nano is sometimes not installed", "Vim მხოლოდ Windows-ზე მუშაობს|Vim only works on Windows", "nano ფაილებს ვერ ინახავს|nano cannot save files", "Vim ავტომატურად ასწორებს კონფიგის შეცდომებს|Vim fixes config errors automatically"], 0, {"ka": "მინიმალურ კონტეინერში, recovery რეჟიმში ან ძველ სერვერზე ხშირად მხოლოდ `vi` გხვდება.", "en": "In a minimal container, recovery mode or an old server you often find only `vi`."}],
          ["რომელ რეჟიმში ხარ Vim-ის გახსნისთანავე?", "Which mode are you in right after opening Vim?", ["Normal", "Insert", "Visual", "Replace"], 0, {"ka": "Normal რეჟიმში კლავიშები ბრძანებებია; ტექსტის საწერად `i` უნდა დააჭირო.", "en": "In Normal mode keys are commands; to type text press `i`."}],
          ["რომელი კლავიში გადაგიყვანს Insert რეჟიმიდან Normal-ში?", "Which key takes you from Insert mode back to Normal?", ["Esc", "Enter", "Tab", "Ctrl+s"], 0, {"ka": "როცა დაიბენი, `Esc` რამდენჯერმე: ყოველთვის Normal-ში დაბრუნდები.", "en": "When lost, press `Esc` a few times: you always end up in Normal mode."}],
          ["როგორ შეინახო ფაილი და გახვიდე Vim-იდან?", "How do you save the file and quit Vim?", [":wq", ":q!", "Ctrl+x", "exit"], 0, {"ka": "`:x` და `ZZ` იგივეს აკეთებს.", "en": "`:x` and `ZZ` do the same."}],
          ["როგორ გახვიდე Vim-იდან ცვლილებების შენახვის გარეშე?", "How do you quit Vim without saving changes?", [":q!", ":wq", ":w", ":save"], 0, {"ka": "`!` აიძულებს გასვლას შეუნახავი ცვლილებების მიუხედავად.", "en": "`!` forces quitting despite unsaved changes."}],
          ["`:q`-ზე ჩანს `E37: No write since last change`. რას ნიშნავს?", "`:q` shows `E37: No write since last change`. What does it mean?", ["ფაილში ცვლილებაა და ჯერ არ შეგინახავს|The file has changes you have not saved", "ფაილი წაშლილია|The file was deleted", "დისკი სავსეა|The disk is full", "Vim-ის ვერსია ძველია|Vim is outdated"], 0, {"ka": "აირჩიე: `:wq` (შენახვა და გასვლა) ან `:q!` (გაუქმება და გასვლა).", "en": "Choose: `:wq` (save and quit) or `:q!` (discard and quit)."}],
          ["`sudo`-ს გარეშე გახსენი `/etc/nginx/nginx.conf` და შენახვა ვერ ხერხდება. რომელი ბრძანება შეინახავს root-ით ხელახლა გახსნის გარეშე?", "You opened `/etc/nginx/nginx.conf` without `sudo` and cannot save. Which command saves as root without reopening?", [":w !sudo tee %", ":wq!", ":sudo w", ":w root"], 0, {"ka": "`%` მიმდინარე ფაილის სახელია, `tee` კი root-ით წერს.", "en": "`%` is the current file name, and `tee` writes as root."}],
          ["რას აკეთებს `o` Normal რეჟიმში?", "What does `o` do in Normal mode?", ["ქვემოთ ქმნის ახალ ხაზს და Insert-ში გადადის|Opens a new line below and enters Insert mode", "ხაზს შლის|Deletes the line", "ფაილს ხსნის|Opens a file", "ბოლო ცვლილებას აუქმებს|Undoes the last change"], 0, {"ka": "`O` (დიდი) იგივეს აკეთებს ზემოთ.", "en": "`O` (capital) does the same above."}],
          ["რომელი ბრძანება გადაგიყვანს Insert რეჟიმში ხაზის ბოლოს?", "Which command enters Insert mode at the end of the line?", ["A", "I", "a", "$"], 0, {"ka": "`I` ხაზის დასაწყისია; `$` მხოლოდ კურსორს გადაადგილებს რეჟიმის შეცვლის გარეშე.", "en": "`I` is the start of the line; `$` only moves the cursor without changing mode."}],
          ["რას აკეთებს `dd`?", "What does `dd` do?", ["მიმდინარე ხაზს შლის (cut)|Deletes (cuts) the current line", "ხაზს აკოპირებს|Copies the line", "ფაილს ინახავს|Saves the file", "სიტყვას შლის|Deletes a word"], 0, {"ka": "წაშლილი ხაზი ბუფერში რჩება და `p`-ით ჩაისმება.", "en": "The deleted line stays in the buffer and can be pasted with `p`."}],
          ["როგორ დააკოპირო 5 ხაზი მიმდინარედან დაწყებული?", "How do you copy 5 lines starting from the current one?", ["5yy", "5dd", "y5p", "5p"], 0, {"ka": "`yy` = yank (კოპირება); რიცხვი წინ ნიშნავს რაოდენობას.", "en": "`yy` = yank (copy); a number in front is the count."}],
          ["შემთხვევით 3 ხაზი წაშალე. როგორ დააბრუნო?", "You deleted 3 lines by mistake. How do you get them back?", ["u", "Ctrl+z", "p3", "r"], 0, {"ka": "`u` = undo, `Ctrl+r` = redo.", "en": "`u` = undo, `Ctrl+r` = redo."}],
          ["რომელი ბრძანება გადაგიყვანს ფაილის ბოლოს?", "Which command jumps to the end of the file?", ["G", "gg", "$", "0"], 0, {"ka": "`gg` დასაწყისია, `$` და `0` ხაზის ბოლო და დასაწყისი.", "en": "`gg` is the start; `$` and `0` are the end and start of the line."}],
          ["`nginx -t` ამბობს: შეცდომა 44-ე ხაზზე. როგორ გახსნა ფაილი პირდაპირ ამ ხაზზე?", "`nginx -t` reports an error on line 44. How do you open the file directly at that line?", ["vim +44 ფაილი|vim +44 file", "vim -44 ფაილი|vim -44 file", "vim ფაილი:44|vim file:44", "vim --line 44 ფაილი|vim --line 44 file"], 0, {"ka": "ფაილში უკვე თუ ხარ: `:44` ან `44G`.", "en": "If you are already in the file: `:44` or `44G`."}],
          ["როგორ მოძებნო `listen` ფაილში ქვემოთ?", "How do you search forward for `listen` in the file?", ["/listen", "?listen", ":find listen", "Ctrl+f listen"], 0, {"ka": "`?listen` ზემოთ ეძებს; `n` შემდეგ დამთხვევაზე გადადის.", "en": "`?listen` searches backward; `n` jumps to the next match."}],
          ["რომელი ბრძანება ანაცვლებს `8080`-ს `8081`-ით მთელ ფაილში?", "Which command replaces `8080` with `8081` in the whole file?", [":%s/8080/8081/g", ":s/8080/8081/", ":replace 8080 8081", "/8080/8081/g"], 0, {"ka": "`%` = ყველა ხაზი, `g` = ხაზში ყველა დამთხვევა; `c`-ს დამატებით (`gc`) თითოეულს გეკითხება.", "en": "`%` = all lines, `g` = every match in a line; adding `c` (`gc`) asks for each one."}],
          ["რას აკეთებს `.` Normal რეჟიმში?", "What does `.` do in Normal mode?", ["ბოლო ცვლილებას იმეორებს|Repeats the last change", "კურსორს ხაზის ბოლოს გადაიტანს|Moves the cursor to the end of the line", "ფაილს ინახავს|Saves the file", "ძებნას აგრძელებს|Continues the search"], 0],
          ["როგორ ჩართო ხაზების ნომრები Vim-ში?", "How do you turn on line numbers in Vim?", [":set number", ":numbers on", ":show lines", "Ctrl+n"], 0, {"ka": "რედაქტორში `cat -n`-ის ანალოგი.", "en": "The editor's equivalent of `cat -n`."}],
          ["რომელი ბრძანება აწევს ხაზს (indent) მარჯვნივ? მნიშვნელოვანია YAML-ში.", "Which command indents a line to the right? Important in YAML.", [">>", "<<", "==", "tt"], 0, {"ka": "netplan და docker compose-ის YAML-ში შეწევა სინტაქსის ნაწილია.", "en": "In netplan and docker compose YAML, indentation is part of the syntax."}],
          ["`crontab -e` Vim-ს ხსნის, შენ კი nano გინდა. რა უნდა გააკეთო?", "`crontab -e` opens Vim, but you want nano. What do you do?", ["export EDITOR=nano (მუდმივად ~/.bashrc-ში)|export EDITOR=nano (permanently in ~/.bashrc)", "sudo apt remove vim", "crontab -nano", "chmod +x nano"], 0, {"ka": "`sudo update-alternatives --config editor` სისტემურ ნაგულისხმევს ცვლის.", "en": "`sudo update-alternatives --config editor` changes the system default."}],
          ["რომელი ბრძანება ხსნის Vim-ის ჩაშენებულ ინტერაქტიულ გაკვეთილს?", "Which command opens Vim's built-in interactive tutorial?", ["vimtutor", "vim --help", "man vimlearn", "vim -tutorial"], 0]
      ],
    },
  ],
});
