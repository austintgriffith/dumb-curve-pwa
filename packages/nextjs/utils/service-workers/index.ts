export const notificationsSupported = () => {
  if (typeof window === undefined) return false;

  if (!("Notification" in window)) alert("No Notification found on window");

  if (!("serviceWorker" in navigator)) alert("No Service worker found");

  if (!("PushManager" in window)) alert("No Service worker found");
  return "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;
};

export const subscribe = async () => {
  try {
    // Service worker is already registered by next-pwa
    const premissionResult = await window?.Notification.requestPermission();
    if (premissionResult === "denied") alert("Premisson is denied :(");
    const swRegistration = await navigator.serviceWorker.getRegistration();
    if (!swRegistration) throw new Error("Service worker not registered");

    const options = {
      applicationServerKey: process.env.NEXT_PUBLIC_PRIVATE_KEY_VAPID ?? "",
      userVisibleOnly: true,
    };
    const subscription = await swRegistration.pushManager.subscribe(options);

    await saveSubscription(subscription);

    console.log({ subscription });
  } catch (err) {
    console.error("Error", err);
  }
};

const saveSubscription = async (subscription: PushSubscription) => {
  const ORIGIN = window.location.origin;
  const BACKEND_URL = `${ORIGIN}/api/push/add-subscription`;

  const response = await fetch(BACKEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  console.log("Sever Response", response);
  return response.json();
};
