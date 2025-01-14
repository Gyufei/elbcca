import { format, utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { useCallback, useContext } from "react";
import { TokenContext } from "../providers/token-provider";
import useIndexStore from "../state";
import useSWR from "swr";
import { NetworkContext } from "../providers/network-provider";
import { SystemEndPointPathMap } from "../end-point";
import fetcher from "../fetcher";

export function useParseTasks() {
  const { network } = useContext(NetworkContext);
  const networkId = network?.chain_id || null;
  const { tokens } = useContext(TokenContext);

  const curTimezoneStr = useIndexStore((state) => state.curTimezoneStr());
  const localTimezoneStr = useIndexStore((state) => state.localTimezoneStr());

  const { data: opList } = useSWR(() => {
    return networkId
      ? `${SystemEndPointPathMap.ops}?chain_id=${networkId}`
      : null;
  }, fetcher);

  const isCanParse = networkId && opList?.length && tokens?.length;

  const parsedTaskFunc = useCallback(
    (taskRes: Array<Record<string, any>>) =>
      taskRes
        .sort((a: Record<string, any>, b: Record<string, any>) => {
          const getTime = (t: Record<string, any>) => {
            return new Date(t.schedule * 1000).getTime();
          };

          return getTime(b) - getTime(a);
        })
        .map((t: Record<string, any>) => {
          const data = JSON.parse(t.data);
          const utcDate = zonedTimeToUtc(
            new Date(Number(t.schedule) * 1000).toISOString(),
            localTimezoneStr,
          );
          const curTimezoneDate = utcToZonedTime(utcDate, curTimezoneStr);
          const date = format(curTimezoneDate, "YYY-MM-dd HH:mm");

          const opType = opList.find((op: Record<string, any>) => {
            return op.op_id === t.op;
          })?.op_name || "";
      
          return {
            id: t.id,
            account: t.account,
            gasUsed: t.gas_used,
            status: t.status,
            txHash: t.tx_hash,
            memo: t.memo,
            op: t.op,
            opName: data?.op_name || opType || "",
            date,
            data,
          };
        }),
    [tokens, opList, curTimezoneStr, localTimezoneStr],
  );

  return {
    isCanParse,
    parsedTaskFunc,
  };
}
