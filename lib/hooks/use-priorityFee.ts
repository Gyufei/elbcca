import useSWR from "swr";
import { useContext } from "react";

import fetcher from "../fetcher";
import { NetworkContext } from "../providers/network-provider";
import { SystemEndPointPathMap } from "../end-point";

export function usePriorityFee() {
  const { network } = useContext(NetworkContext);

  const chainId = network?.chain_id || "";

  const res = useSWR(
    () => {
      if (chainId) {
        return `${SystemEndPointPathMap.priorityFee}?chain_id=${chainId}`;
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
    data: res.data?.priority_fee
      ? (Number(res.data.priority_fee) / 10 ** 9).toFixed(9)
      : "",
  };
}
