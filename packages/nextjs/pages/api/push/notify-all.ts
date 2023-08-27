import { NextApiRequest, NextApiResponse } from "next";
import webpush from "web-push";
import { getAllSubsriptionsFromDb } from "~~/database/firebase/utils";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  try {
    const subscriptions = await getAllSubsriptionsFromDb();

    subscriptions?.forEach(s => {
      const payload = JSON.stringify({
        title: "Greetings changed!",
        body: "greetings has been changed!",
      });
      webpush.sendNotification(s, payload);
    });

    res.status(200).json({ message: `${subscriptions?.length ?? 0} messages sent!` });
  } catch (e) {
    console.log("Error :", e);
    res.status(500).json({ error: "Error occurred" });
  }
}
