/* DevOps quiz: ტრეკი A (Ubuntu / Docker). წყარო: MyDevOps-ის ქვიზის ბანკი (nginx).
   კითხვა: [ka, en|null, [პასუხები], სწორის ინდექსი, განმარტება?]
   en: ინგლისური თარგმანი; განმარტება {ka, en} ობიექტია.
   Option strings: "ka|en" (ან ერთი სტრიქონი). ამ ფაილში პასუხები "|"-ს არ შეიცავს. */
(window.QUIZ_SUBJECTS = window.QUIZ_SUBJECTS || []).push({
  id: "devops-nginx",
  icon: "🧱",
  title: { ka: "Nginx და Web Server", en: "Nginx and the web server" },
  desc: { ka: "virtual host, reverse proxy, SSL", en: "Virtual host, reverse proxy, SSL" },
  quizzes: [
    {
      id: "v1",
      title: { ka: "ტესტი", en: "Test" },
      questions: [
          ["სად ინახება Ubuntu-ზე Nginx-ის საიტების კონფიგურაცია?", "Where is Nginx site configuration stored on Ubuntu?", ["/etc/nginx/sites-available", "/var/nginx", "/usr/nginx", "/opt/sites"], 0, {"ka": "ჩასართავად symlink `sites-enabled`-ში.", "en": "To enable it, create a symlink in `sites-enabled`."}],
          ["რომელი ბრძანება ამოწმებს Nginx კონფიგს?", "Which command checks the Nginx config?", ["nginx -t", "nginx --lint", "systemctl check nginx", "nginx -v"], 0],
          ["კონფიგის შეცვლის შემდეგ დროს გაუჩერებლად გადასატვირთად:", "To reload after a config change without downtime:", ["systemctl reload nginx", "reboot", "nginx --kill", "apt remove nginx"], 0],
          ["რა არის virtual host?", "What is a virtual host?", ["ერთ სერვერზე რამდენიმე საიტის სხვადასხვა `server_name`-ით მომსახურება|Serving several sites on one server by different `server_name`", "ვირტუალური მანქანა|A virtual machine", "პროქსი|A proxy", "DNS ჩანაწერი|A DNS record"], 0],
          ["რას აკეთებს `proxy_pass`?", "What does `proxy_pass` do?", ["მოთხოვნას სხვა სერვისზე გადასცემს (reverse proxy)|Forwards the request to another service (reverse proxy)", "ფაილს ანაწილებს|Distributes a file", "ქეშს ასუფთავებს|Clears the cache", "SSL-ს რთავს|Enables SSL"], 0],
          ["რა განსხვავებაა forward და reverse proxy-ს შორის?", "What is the difference between a forward and a reverse proxy?", ["reverse proxy სერვერების წინ დგას, კლიენტებისგან მალავს backend-ს|A reverse proxy sits in front of servers and hides the backend from clients", "არაფერი|None", "forward სერვერშია|A forward proxy is on the server", "reverse მხოლოდ DNS-ია|A reverse proxy is only DNS"], 0],
          ["`unknown directive \"sudo\"` Nginx კონფიგში ნიშნავს:", "`unknown directive \"sudo\"` in an Nginx config means:", ["ტერმინალის ბრძანება შემთხვევით ფაილში ჩაიწერა|A terminal command was written into the file by mistake", "Nginx root-ს ითხოვს|Nginx asks for root", "პორტი დაკავებულია|The port is in use", "SSL არაა|There is no SSL"], 0],
          ["რატომ არ ისმენს 443-ს სერვერი, თუ `ssl` ხაზები არასწორ server block-შია?", "Why is the server not listening on 443 if the `ssl` lines are in the wrong server block?", ["listen 443 ssl სხვა block-ში არ არის|listen 443 ssl is not in the other block", "firewall-ის გამო|Because of the firewall", "Docker-ის გამო|Because of Docker", "cron-ის გამო|Because of cron"], 0, {"ka": "ვამოწმებთ `ss -tlnp | grep 443`.", "en": "We check with `ss -tlnp | grep 443`."}],
          ["self-signed სერტიფიკატზე ბრაუზერი გვაფრთხილებს, რადგან:", "With a self-signed certificate the browser warns us because:", ["სანდო CA-ს არ გაუცია|It was not issued by a trusted CA", "ძველია|It is old", "პორტი არასწორია|The port is wrong", "Nginx-ის ბრალია|It is Nginx's fault"], 0],
          ["რომელი ფაილი აჩვენებს Nginx შეცდომებს?", "Which file shows Nginx errors?", ["/var/log/nginx/error.log", "/etc/nginx/error", "/tmp/nginx.err", "/home/nginx.log"], 0],
          ["Docker-ის `web` კონტეინერი `127.0.0.1:8080:80`-ზეა. გარედან როგორ ვხედავთ?", "The Docker `web` container is bound to `127.0.0.1:8080:80`. How do we see it from outside?", ["Nginx reverse proxy-ით host-ზე|Through the Nginx reverse proxy on the host", "პირდაპირ 8080-ით ნებისმიერი IP-დან|Directly on 8080 from any IP", "ვერ ვხედავთ ვერასდროს|We can never see it", "მხოლოდ SSH-ით|Only via SSH"], 0, {"ka": "127.0.0.1 მიბმა გარედან პირდაპირ წვდომას კრძალავს.", "en": "Binding to 127.0.0.1 blocks direct access from outside."}],
          ["`server_name app.test 100.120.57.75;` რას ნიშნავს?", "What does `server_name app.test 100.120.57.75;` mean?", ["ორივე სახელზე/IP-ზე იმავე ბლოკით მომსახურება|The same block serves both the name and the IP", "ორი სერვერი|Two servers", "DNS შექმნა|Creates DNS", "SSL გამორთვა|Disables SSL"], 0]
      ],
    },
  ],
});
