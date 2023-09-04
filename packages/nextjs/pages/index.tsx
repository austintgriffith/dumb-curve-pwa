import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { formatEther, parseEther } from "viem";
import { useAccount, useBalance } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { PWANotificationHinter } from "~~/components/PWANotificationHinter";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address } = useAccount();

  const { data: yourContractData } = useDeployedContractInfo("YourContract");

  const { data: balance } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "balanceOf",
    args: [address],
  });
  const { data: price } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "price",
  });

  const [dumbPriceAsString, setDumbPriceAsString] = useState("");

  const { writeAsync: buy } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "buy",
    value: dumbPriceAsString,
  });

  const { writeAsync: sell } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "sell",
  });

  useEffect(() => {
    if (price) {
      setDumbPriceAsString(formatEther(price));
    }
  }, [price]);

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 flex flex-col items-center">
          <span className="block text-2xl mb-2">contract:</span>
          <div className="flex flex-row">
            <div>
              <Address address={yourContractData?.address} />
            </div>
            <div>
              <Balance address={yourContractData?.address} />
            </div>
          </div>
          <h1 className="text-center mb-8 p-4">
            <div className="p-1">price:</div>
            <div className="p-1">{dumbPriceAsString}</div>
          </h1>

          <div className="flex flex-row justify-between w-full px-5 py-10">
            <div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  buy();
                }}
              >
                BUY
              </button>
            </div>
            <div className="text-4xl px-4 py-1">{balance?.toString()}</div>
            <div>
              {" "}
              <button
                className="btn btn-primary"
                onClick={() => {
                  sell();
                }}
              >
                SELL
              </button>
            </div>
          </div>

          <PWANotificationHinter />

          <button
            className="btn m-8"
            onClick={async () => {
              window.location.href = window.location.href;
            }}
          >
            reload
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
