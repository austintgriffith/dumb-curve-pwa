import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { NextApiRequest, NextApiResponse } from "next";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import webpush, { PushSubscription } from "web-push";

type Data = {
  subscriptions: PushSubscription[];
};

const PUBLIC_KEY_VAPID = process.env.PUBLIC_KEY ?? "";
const PRIVATE_KEY_VAPID = process.env.PRIVATE_KEY ?? "";
webpush.setVapidDetails("mailto:shivbhonde04@gmail.com", PUBLIC_KEY_VAPID, PRIVATE_KEY_VAPID);
// db.json file path
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "..", "..", "..", "db.json");
const adapter = new JSONFile<Data>(file);
const defaultData = { subscriptions: [] };

export const saveSubscriptionToDb = async (subscription: PushSubscription) => {
  const db = new Low<Data>(adapter, defaultData);
  db.data.subscriptions.push(subscription);
  await db.write();
  return;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.body || !req.body.endpoint) {
    // Not a valid subscription.
    res.status(400);
    res.setHeader("Content-Type", "application/json");
    res.send(
      JSON.stringify({
        error: {
          id: "no-endpoint",
          message: "Subscription must have an endpoint.",
        },
      }),
    );
    return res;
  }
  const subscription = req.body as PushSubscription;

  try {
    await saveSubscriptionToDb(subscription);
    res.status(200).json({ message: "Subscription added." });
  } catch (e) {
    console.log("Error :", e);
    res.status(500);
    res.setHeader("Content-Type", "application/json");
    res.send(
      JSON.stringify({
        error: {
          id: "unable-to-save-subscription",
          message: "The subscription was received but we were unable to save it to our database.",
        },
      }),
    );
  }
}
