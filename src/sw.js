self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};
  console.log("Push event received:", data);
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/assets/logo.png",
      data: {
        url: data.data?.url, // agora pega a URL do payload
      }, // <- Corrigido: estava com parênteses errados aqui
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  console.log("⚡ notificationclick DISPARADO!");

  event.notification.close();

  const urlToOpen = event.notification.data?.url;
  console.log("Notification click event:", urlToOpen);

  if (urlToOpen) {
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then(function (clientList) {
          const isInternal = urlToOpen.startsWith(self.location.origin);

          if (isInternal) {
            // Se for URL do mesmo domínio, tenta focar ou abrir dentro do PWA
            for (const client of clientList) {
              if (client.url === urlToOpen && "focus" in client) {
                return client.focus();
              }
            }
            if (clients.openWindow) {
              return clients.openWindow(urlToOpen);
            }
          } else {
            // Se for URL externa, sempre abre no navegador
            if (clients.openWindow) {
              return clients.openWindow(urlToOpen);
            }
          }
        })
    );
  }
});

self.addEventListener("message", (event) => {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});
