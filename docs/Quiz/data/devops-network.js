/* DevOps quiz: ტრეკი A (Ubuntu / Docker). წყარო: MyDevOps-ის ქვიზის ბანკი (network).
   კითხვა: [ka, en|null, [პასუხები], სწორის ინდექსი, განმარტება?]
   en: ინგლისური თარგმანი; განმარტება {ka, en} ობიექტია.
   Option strings: "ka|en" (ან ერთი სტრიქონი). ამ ფაილში პასუხები "|"-ს არ შეიცავს. */
(window.QUIZ_SUBJECTS = window.QUIZ_SUBJECTS || []).push({
  id: "devops-network",
  icon: "🌐",
  title: { ka: "ქსელი და უსაფრთხოება", en: "Networking and security" },
  desc: { ka: "IP, პორტები, SSH, ufw, fail2ban", en: "IP, ports, SSH, ufw, fail2ban" },
  quizzes: [
    {
      id: "v1",
      title: { ka: "ტესტი", en: "Test" },
      questions: [
          ["რომელი პორტია SSH-ის ნაგულისხმევი?", "Which is the default SSH port?", ["21", "22", "80", "443"], 1],
          ["HTTPS-ის ნაგულისხმევი პორტი:", "The default HTTPS port:", ["8080", "25", "443", "53"], 2],
          ["რა არის VirtualBox-ში Host-Only ქსელი?", "What is a Host-Only network in VirtualBox?", ["VM-ს ინტერნეტს აძლევს NAT-ით|Gives the VM internet via NAT", "ქსელი მხოლოდ ჰოსტსა და VM-ებს შორის|A network only between the host and VMs", "ბრიჯი რაუტერთან|A bridge to the router", "VPN|A VPN"], 1, {"ka": "ჩვენთან Host-Only: `192.168.56.10`, NAT: `10.0.2.15`.", "en": "In our setup Host-Only: `192.168.56.10`, NAT: `10.0.2.15`."}],
          ["რომელი ბრძანება აჩვენებს IP მისამართებს?", "Which command shows IP addresses?", ["ip a", "ls ip", "netstat -x", "dig ip"], 0],
          ["რას ამოწმებს `ss -tlnp`?", "What does `ss -tlnp` check?", ["მოსმენილ TCP პორტებს და პროცესებს|Listening TCP ports and their processes", "დისკს|The disk", "მომხმარებლებს|Users", "cron-ს|cron"], 0],
          ["რას აკეთებს `ufw allow 22`?", "What does `ufw allow 22` do?", ["ხურავს 22-ს|Closes 22", "უშვებს 22 პორტს firewall-ში|Allows port 22 through the firewall", "ცვლის SSH პორტს|Changes the SSH port", "წყვეტს SSH-ს|Stops SSH"], 1],
          ["რატომ ვრთავთ SSH-ში key-only ავტორიზაციას?", "Why do we enable key-only authentication in SSH?", ["პაროლის brute-force-ისგან დასაცავად|To protect against password brute-force", "სიჩქარისთვის|For speed", "ლოგების შესამცირებლად|To reduce logs", "DNS-ისთვის|For DNS"], 0],
          ["რას აკეთებს fail2ban?", "What does fail2ban do?", ["ბლოკავს IP-ს განმეორებითი წარუმატებელი შესვლის გამო|Bans an IP after repeated failed logins", "ბექაპს|Backups", "ქმნის სერტიფიკატს|Creates a certificate", "ასუფთავებს დისკს|Cleans the disk"], 0],
          ["რომელი ბრძანება ამოწმებს სახელის DNS-ს?", "Which command checks a name's DNS?", ["dig / nslookup", "chmod", "tar", "mount"], 0],
          ["`curl -I` 200 OK ყოველთვის ამტკიცებს, რომ სწორი საიტი პასუხობს?", "Does `curl -I` returning 200 OK always prove the right site is answering?", ["დიახ|Yes", "არა — უნდა შევადაროთ `<title>`/Content-Length|No, compare the `<title>`/Content-Length", "მხოლოდ HTTPS-ზე|Only on HTTPS", "მხოლოდ localhost-ზე|Only on localhost"], 1, {"ka": "Task 16-ზე სხვა vhost-მა 200 დააბრუნა, მაგრამ შიგთავსი სხვა იყო.", "en": "In Task 16 another vhost returned 200, but the content was different."}],
          ["როგორ ხდება Tailscale-ით VM-ზე წვდომა?", "How do we reach the VM with Tailscale?", ["Tailscale IP-ით (100.x) VPN ქსელში|Via the Tailscale IP (100.x) in the VPN network", "მხოლოდ NAT-ით|Only via NAT", "პორტის გახსნით რაუტერზე|By opening a port on the router", "FTP-ით|Via FTP"], 0],
          ["VM-ის საათი 10 საათით ჩამორჩა და `apt` \"not valid yet\"-ს წერს. გამოსავალი:", "The VM clock is 10 hours behind and `apt` says \"not valid yet\". The fix:", ["apt clean", "chronyc makestep", "reboot -f", "ufw reset"], 1]
      ],
    },
  ],
});
