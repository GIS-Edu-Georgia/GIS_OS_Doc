/* DevOps quiz: ტრეკი A (Ubuntu / Docker). წყარო: MyDevOps-ის ქვიზის ბანკი (nginx).
   კითხვა: [ka, en|null, [პასუხები], სწორის ინდექსი, განმარტება?]
   en = null: ინგლისური თარგმანი ჯერ არ არსებობს; ინტერფეისი აჩვენებს ქართულს.
   Option strings: "ka|en" (ან ერთი სტრიქონი). ამ ფაილში პასუხები "|"-ს არ შეიცავს. */
(window.QUIZ_SUBJECTS = window.QUIZ_SUBJECTS || []).push({
  id: "devops-nginx",
  icon: "🧱",
  title: { ka: "Nginx და Web Server" },
  desc: { ka: "virtual host, reverse proxy, SSL" },
  quizzes: [
    {
      id: "v1",
      title: { ka: "ტესტი" },
      questions: [
          ["სად ინახება Ubuntu-ზე Nginx-ის საიტების კონფიგურაცია?",null,["/etc/nginx/sites-available","/var/nginx","/usr/nginx","/opt/sites"],0,"ჩასართავად symlink `sites-enabled`-ში."],
          ["რომელი ბრძანება ამოწმებს Nginx კონფიგს?",null,["nginx -t","nginx --lint","systemctl check nginx","nginx -v"],0],
          ["კონფიგის შეცვლის შემდეგ დროს გაუჩერებლად გადასატვირთად:",null,["systemctl reload nginx","reboot","nginx --kill","apt remove nginx"],0],
          ["რა არის virtual host?",null,["ერთ სერვერზე რამდენიმე საიტის სხვადასხვა `server_name`-ით მომსახურება","ვირტუალური მანქანა","პროქსი","DNS ჩანაწერი"],0],
          ["რას აკეთებს `proxy_pass`?",null,["მოთხოვნას სხვა სერვისზე გადასცემს (reverse proxy)","ფაილს ანაწილებს","ქეშს ასუფთავებს","SSL-ს რთავს"],0],
          ["რა განსხვავებაა forward და reverse proxy-ს შორის?",null,["reverse proxy სერვერების წინ დგას, კლიენტებისგან მალავს backend-ს","არაფერი","forward სერვერშია","reverse მხოლოდ DNS-ია"],0],
          ["`unknown directive \"sudo\"` Nginx კონფიგში ნიშნავს:",null,["ტერმინალის ბრძანება შემთხვევით ფაილში ჩაიწერა","Nginx root-ს ითხოვს","პორტი დაკავებულია","SSL არაა"],0],
          ["რატომ არ ისმენს 443-ს სერვერი, თუ `ssl` ხაზები არასწორ server block-შია?",null,["listen 443 ssl სხვა block-ში არ არის","firewall-ის გამო","Docker-ის გამო","cron-ის გამო"],0,"ვამოწმებთ `ss -tlnp | grep 443`."],
          ["self-signed სერტიფიკატზე ბრაუზერი გვაფრთხილებს, რადგან:",null,["სანდო CA-ს არ გაუცია","ძველია","პორტი არასწორია","Nginx-ის ბრალია"],0],
          ["რომელი ფაილი აჩვენებს Nginx შეცდომებს?",null,["/var/log/nginx/error.log","/etc/nginx/error","/tmp/nginx.err","/home/nginx.log"],0],
          ["Docker-ის `web` კონტეინერი `127.0.0.1:8080:80`-ზეა. გარედან როგორ ვხედავთ?",null,["Nginx reverse proxy-ით host-ზე","პირდაპირ 8080-ით ნებისმიერი IP-დან","ვერ ვხედავთ ვერასდროს","მხოლოდ SSH-ით"],0,"127.0.0.1 მიბმა გარედან პირდაპირ წვდომას კრძალავს."],
          ["`server_name app.test 100.120.57.75;` რას ნიშნავს?",null,["ორივე სახელზე/IP-ზე იმავე ბლოკით მომსახურება","ორი სერვერი","DNS შექმნა","SSL გამორთვა"],0]
      ],
    },
  ],
});
