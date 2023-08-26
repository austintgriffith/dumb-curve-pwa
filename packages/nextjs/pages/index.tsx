import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { PWANotificationHinter } from "~~/components/PWANotificationHinter";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 flex flex-col items-center">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2 PWA 📱</span>
          </h1>
          <PWANotificationHinter />
        </div>
      </div>
    </>
  );
};

export default Home;
