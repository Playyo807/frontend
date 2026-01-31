console.log("Service Worker: Script loaded and executing");

self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(clients.claim());
});

self.addEventListener("push", (event) => {
  console.log("🔔 Service Worker: Push event received!", event);

  let data = {};

  if (event.data) {
    try {
      data = event.data.json();
      console.log("✅ Service Worker: Push data parsed:", data);
    } catch (e) {
      console.error("❌ Service Worker: Failed to parse push data:", e);
      console.log("Raw data:", event.data.text());
      data = {
        title: "Notification",
        body: event.data.text(),
      };
    }
  } else {
    console.warn("⚠️ Service Worker: No data in push event");
  }

  const title = data.title || "New Notification";
  const options = {
    body: data.body || data.message || "You have a new notification",
    icon: data.icon || "/icon.png",
    badge: data.badge || "/badge.png",
    data: data.data || data.meta || { url: "/" },
    tag: data.tag || "default",
    requireInteraction: data.requireInteraction || false,
  };

  console.log("📢 Service Worker: Showing notification with:", {
    title,
    options,
  });

  event.waitUntil(
    self.registration
      .showNotification(title, options)
      .then(() => {
        console.log("✅ Service Worker: Notification shown successfully!");
      })
      .catch((err) => {
        console.error("❌ Service Worker: Failed to show notification:", err);
      }),
  );
});

self.addEventListener("notificationclick", (event) => {
  console.log("👆 Service Worker: Notification clicked!", event);
  event.notification.close();

  const url = event.notification.data?.url || "/";
  console.log("Opening URL:", url);

  event.waitUntil(clients.openWindow(url));
});
