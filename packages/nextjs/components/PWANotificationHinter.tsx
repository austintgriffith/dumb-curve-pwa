import { useState } from "react";
import { useIsClient } from "usehooks-ts";
import { notificationsSupported, subscribe } from "~~/utils/service-workers";

export const PWANotificationHinter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const isClient = useIsClient();

  return isClient ? (
    <button
      className="btn btn-secondary"
      disabled={!notificationsSupported()}
      onClick={async () => {
        try {
          setIsLoading(true);
          await subscribe();
        } catch (e) {
          alert(`Error happend while subscribing`);
          console.log("Error happend:", e);
          setIsLoading(false);
        }
        setIsLoading(false);
      }}
    >
      {isLoading ? (
        <span className="loading loading-dots loading-xs"></span>
      ) : notificationsSupported() ? (
        "Allow Notifications"
      ) : (
        "Please install PWA first"
      )}
    </button>
  ) : null;
};
