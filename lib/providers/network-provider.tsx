"use client";

import { createContext,  useEffect, useState } from "react";
import useSWR from "swr";

import { INetwork, NetworkChainType } from "@/lib/types/network";
import fetcher from "@/lib/fetcher";
import { isProduction, SystemEndPointPathMap } from "../end-point";

interface INetworkContext {
  network: INetwork | null;
  networkId: number | undefined,
  networkName: NetworkChainType | undefined,
  networkList: Array<INetwork>;
  onNetworkChange: (
    value: INetwork
  ) => void;
}

export const NetworkContext = createContext<INetworkContext>({
  network: null,
  networkId: undefined,
  networkName: undefined,
  networkList: [],
  onNetworkChange: () => {}
});

export default function NetworkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [network, setNetwork] = useState<INetwork | null>(null);
  const networkId = network?.chain_id;
  const networkName = network?.currency_name as NetworkChainType;

  const { data: resNetworks = [] }: { data: Array<INetwork> } = useSWR(
    SystemEndPointPathMap.networks,
    fetcher,
  );
  
  const networks = isProduction ? (resNetworks || []).filter((item: INetwork) => { 
    return !["11155111", "903"].includes(String(item.chain_id || "")) }) : resNetworks;
  const networkDefault = networks?.[0];

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
        networkId,
        networkName,
        networkList: networks,
        onNetworkChange
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}
