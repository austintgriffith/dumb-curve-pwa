import { COLLECTION_NAME, firebaseDB } from "./config";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { PushSubscription } from "web-push";

const subscriptionCollectionRef = collection(firebaseDB, COLLECTION_NAME);

export const saveSubscriptionToDb = async (subscription: PushSubscription) => {
  try {
    await addDoc(subscriptionCollectionRef, subscription);
  } catch (e) {
    console.log("Error while saving in DB :", e);
  }
};

export const getAllSubsriptionsFromDb = async () => {
  try {
    const querySnapshot = await getDocs(subscriptionCollectionRef);

    const subscriptions: PushSubscription[] = [];
    querySnapshot.forEach(doc => {
      subscriptions.push(doc.data() as PushSubscription);
    });

    return subscriptions;
  } catch (e) {
    console.log("Error while fetching from DB :", e);
  }
};
