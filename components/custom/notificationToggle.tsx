"use client";

import { usePushNotifications } from "@/hooks/usePushNotifications";

export default function NotificationToggle() {
  const { isSupported, isSubscribed, subscribeToPush, unsubscribeFromPush } =
    usePushNotifications();

  if (!isSupported) {
    return <p>Push notifications are not supported in your browser.</p>;
  }

  return (
    <div>
      <button
        onClick={isSubscribed ? unsubscribeFromPush : subscribeToPush}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isSubscribed ? "Disable Notifications" : "Enable Notifications"}
      </button>
    </div>
  );
}
