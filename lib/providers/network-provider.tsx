"use client";

import { createContext, useEffect, useState } from "react";
import useSWR from "swr";

import { INetwork } from "@/lib/types/network";
import fetcher from "@/lib/fetcher";
import { SystemEndPointPathMap } from "../end-point";
import useIndexStore from "../state";

interface INetworkContext {
  network: INetwork | null;
  onNetworkChange: (
    value: INetwork
  ) => void;
}

export const NetworkContext = createContext<INetworkContext>({
  network: null,
  onNetworkChange: () => {}
});

export default function NetworkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [network, setNetwork] = useState<INetwork | null>(null);
  const userPathMap = useIndexStore((state) => state.userPathMap());

  const { data: userWeb3Info } = useSWR(
    () => userPathMap.web3Info || null,
    fetcher,
  );
  const { data: networks }: { data: Array<INetwork> } = useSWR(
    SystemEndPointPathMap.networks,
    fetcher,
  );

  const networkDefault =
    (networks || []).find(
      (n) => String(n.chain_id) === String(userWeb3Info?.chain_id),
    ) || null;


    useEffect(() => {
      setNetwork(networkDefault)
    }, [networkDefault])

  
  const onNetworkChange = (value: INetwork) => {
    setNetwork(value)
  }

  return (
    <NetworkContext.Provider
      value={{
        network,
        onNetworkChange
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}
