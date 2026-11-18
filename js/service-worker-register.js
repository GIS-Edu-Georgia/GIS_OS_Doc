// Service Worker-ის რეგისტრაცია PWA ოფლაინ მხარდაჭერისთვის
if ('serviceWorker' in navigator) {
  // currentScript აქ უნდა ვიჭიდოთ — load event-ში null ხდება
  var _script = document.currentScript;

  window.addEventListener('load', function () {
    var swUrl;

    if (_script && _script.src) {
      // ყველაზე სანდო მეთოდი: ამ ფაილის URL-დან ვიანგარიშებთ SW-ის მისამართს
      // მაგ: https://osdoc.qgis.ge/js/service-worker-register.js
      //   → https://osdoc.qgis.ge/service-worker.js
      swUrl = _script.src.replace(/js\/service-worker-register\.js.*$/, 'service-worker.js');
    } else {
      // fallback: base href-ზე დაყრდნობა
      var base = document.querySelector('base');
      swUrl = base
        ? new URL('service-worker.js', base.href).href
        : location.origin + '/service-worker.js';
    }

    navigator.serviceWorker
      .register(swUrl)
      .then(function (registration) {
        console.log('Service Worker დარეგისტრირდა:', registration.scope);
      })
      .catch(function (error) {
        console.error('Service Worker-ის შეცდომა:', error);
      });
  });
}