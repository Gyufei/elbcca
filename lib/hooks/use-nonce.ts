import useSWR from "swr";
import { useContext } from "react";

import fetcher from "../fetcher";
import { NetworkContext } from "../providers/network-provider";
import { isAddress } from "../utils";
import useIndexStore from "../state";
import { SystemEndPointPathMap } from "../end-point";

export function useNonce(queryAccount: string) {
  const { network, networkName } = useContext(NetworkContext);
  const userPathMap = useIndexStore((state) => state.userPathMap());

  const chain_id = network?.chain_id || "";

  const res = useSWR(
    () => {
      if (chain_id && queryAccount && isAddress(queryAccount, networkName || "")) {
        return `${SystemEndPointPathMap.nonceNum}?chain_id=${chain_id}&account=${queryAccount}`;
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
    data: res.data?.nonce ? Number(res.data?.nonce) : "-",
  };
}
