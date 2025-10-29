import { useContext } from "react";
import useIndexStore from "../state";
import { NetworkContext } from "../providers/network-provider";
import fetcher from "../fetcher";
import useSWR from "swr";

export function useGetSubVa({
  tokenAddr,
  accounts,
}: {
  tokenAddr: string;
  accounts: string[];
}) {
  const userPathMap = useIndexStore((state) => state.userPathMap());
  const { network } = useContext(NetworkContext);
  const networkId = network?.chain_id;

  async function getSubVa() {
    const path = `${userPathMap.vaSubBalance}`;

    const queryPostData = {
      chain_id: String(networkId),
      token_address: tokenAddr,
      accounts: accounts,
    };

    const queryResult = await fetcher(path, {
      method: "POST",
      body: JSON.stringify(queryPostData),
    });

    return queryResult;
  }

  const queryRes = useSWR(
    networkId && tokenAddr && accounts?.length
      ? `${networkId}-${tokenAddr}-${accounts.join(",")}`
      : null,
    getSubVa,
  );

  return queryRes;
}
