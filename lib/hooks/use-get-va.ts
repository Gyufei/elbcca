import useSWR from "swr";
import fetcher from "../fetcher";
import useIndexStore from "../state";
import useEffectStore from "../state/use-store";
import { SystemEndPointPathMap } from "../end-point";
import { useContext } from "react";
import { NetworkContext } from "../providers/network-provider";

export interface IVaData {
  va_name: string;
  wallet_list: string[];
}

export function useGetVa() {
  const activeUser = useEffectStore(useIndexStore, (state) =>
    state.activeUser(),
  );

  const { network } = useContext(NetworkContext);
  const networkId = network?.chain_id;

  const queryResult = useSWR<IVaData[]>(
    activeUser && networkId
      ? `${SystemEndPointPathMap.vaQuery}?chain_id=${networkId}&user_name=${activeUser?.email}`
      : null,
    fetcher,
  );

  return queryResult;
}
