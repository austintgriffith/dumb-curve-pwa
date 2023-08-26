import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { NextApiRequest, NextApiResponse } from "next";
import { join } from "node:path";
import webpush, { PushSubscription } from "web-push";

type Data = {
  subscriptions: PushSubscription[];
};

const PUBLIC_KEY_VAPID = process.env.PUBLIC_KEY ?? "";
const PRIVATE_KEY_VAPID = process.env.PRIVATE_KEY ?? "";
webpush.setVapidDetails("mailto:shivbhonde04@gmail.com", PUBLIC_KEY_VAPID, PRIVATE_KEY_VAPID);
const file = join(process.cwd(), "db.json");
const adapter = new JSONFile<Data>(file);
const defaultData = { subscriptions: [] };

export const getSubscriptionsFromDb = async () => {
  const db = new Low<Data>(adapter, defaultData);
  await db.read();
  return db.data.subscriptions;
};
export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  try {
    const subscriptions = await getSubscriptionsFromDb();

    subscriptions.forEach(s => {
      const payload = JSON.stringify({
        title: "Greetings changed!",
        body: "greetings has been changed!",
      });
      webpush.sendNotification(s, payload);
    });

    res.status(200).json({ message: `${subscriptions.length} messages sent!` });
  } catch (e) {
    console.log("Error :", e);
    res.status(500).json({ error: "Error occurred" });
  }
}
