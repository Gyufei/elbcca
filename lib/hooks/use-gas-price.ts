import useSWR from "swr";
import { useContext } from "react";

import fetcher from "../fetcher";
import { NetworkContext } from "../providers/network-provider";
import useIndexStore from "../state";

export function useGasPrice() {
  const { network } = useContext(NetworkContext);
  const userPathMap = useIndexStore((state) => state.userPathMap());


  const chainId = network?.chain_id || "";

  const res = useSWR(
    () => {
      if (chainId) {
        return `${userPathMap.gasPrice}?chain_id=${chainId}`;
      } else {
        return null;
      }
    },
    fetcher,
    {
      refreshInterval: 12000,
    },
  );

  return {
    ...res,
    data: res.data?.gas_price
      ? (Number(res.data.gas_price) / 10 ** 9).toFixed(9)
      : "",
  };
}
