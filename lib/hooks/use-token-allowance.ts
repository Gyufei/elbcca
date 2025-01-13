import { useContext, useMemo } from "react";
import useSWR from "swr";

import { NetworkContext } from "../providers/network-provider";
import fetcher from "../fetcher";
import { isAddress } from "../utils";
import { TokenContext } from "../providers/token-provider";
import { SystemEndPointPathMap } from "../end-point";

export function useTokenAllowance(
  tokenAddr: string | null,
  spender: string,
  account: string,
) {
  const { gasToken } = useContext(TokenContext);
  const { networkId, networkName } = useContext(NetworkContext);

  const queryStr = useMemo(() => {
    if (!tokenAddr || !account || !spender) return null;
    if (!isAddress(tokenAddr, networkName || "") || !isAddress(account, networkName || "")) return null;
    if (tokenAddr === gasToken?.token_address) return null;

    const query = new URLSearchParams();
    query.set("chain_id", networkId + '' || "");
    query.set("token", tokenAddr);
    query.set("account", account);
    query.set("spender", spender)

    const queryStr = query.toString();

    return queryStr;
  }, [tokenAddr, account, spender, networkId, gasToken?.token_address]);

  const res = useSWR(() => {
    if (!queryStr) return null;
    return `${SystemEndPointPathMap.accountTokenAllowance}?${queryStr}`;
  }, fetcher);

  return {
    ...res,
    data: res?.data?.allowance,
  };
}
