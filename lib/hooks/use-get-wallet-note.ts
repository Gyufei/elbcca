import useSWR from "swr";
import fetcher from "../fetcher";
import useIndexStore from "../state";
import useEffectStore from "../state/use-store";

export function useGetWalletNote({ wallet }: { wallet: string }) {
  const userPathMap = useIndexStore((state) => state.userPathMap());
  const activeUser = useEffectStore(useIndexStore, (state) =>
    state.activeUser(),
  );

  const queryResult = useSWR(
    activeUser
      ? `${userPathMap.getWalletNote}?wallet=${wallet}&user_name=${activeUser?.email}`
      : null,
    fetcher,
  );

  return queryResult;
}
