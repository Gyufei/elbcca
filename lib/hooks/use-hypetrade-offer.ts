import useSWR from "swr";
import { useContext } from "react";

import fetcher from "../fetcher";
import { NetworkContext } from "../providers/network-provider";
import { isAddress } from "../utils";
import useIndexStore from "../state";
import { USDCOpType } from "../types/network";

export function useHypeTradeOffer(params: Record<string, any>, queryAccount: string) {
  const { network, networkName } = useContext(NetworkContext);
  const chain_id = network?.chain_id || "";
  const userPathMap = useIndexStore((state) => state.userPathMap());
  const {
    op,
    marketToken
  } = params;
  const opId = op?.op_id;
  const res = useSWR(
    () => {
      if (opId && chain_id && marketToken?.token_name) {
        const url = `${userPathMap.hypeTradeGetOffer}?chain_id=${chain_id}&market_symbol=${marketToken?.token_name || ""}`;
        if (opId === USDCOpType.TAKEOFFER) return url;
        if (opId === USDCOpType.CANCELOFFER && queryAccount && isAddress(queryAccount, networkName || "")) return `${url}&account=${queryAccount}`;
        return null;
      } else {
        return null;
      }
    },
    fetcher
  );

  return {
    ...res,
    data: res.data || []
  };
}
