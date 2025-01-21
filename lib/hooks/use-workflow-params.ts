import { useContext, useEffect, useMemo, useState } from "react";
import { IOp } from "../types/op";
import useIndexStore from "../state";
import { NetworkContext } from "../providers/network-provider";
import { NetworkChainType } from "../types/network";
import { networkRouting } from "../constants/network-config";
import { GAS_TOKEN_ADDRESS } from "../constants/global";
import { useTokenAllowance } from "./use-token-allowance";

export function useWorkflowParams(params: Record<string, any>) {
  const userPathMap = useIndexStore((state) => state.userPathMap());
  const { network, networkId, networkName } = useContext(NetworkContext);
  const [allowance, setAllowance] = useState<string | null>(null);
  const op = params.op;
  
  const isApproveOp = useMemo(() => op?.op_id === 3, [op]);
  const isTransferOp = useMemo(() => op?.op_id === 2, [op]);
  const isSwapOp = useMemo(() => op?.op_id === 1, [op]);


  const opSignUrl = useMemo(() => getSignUrl(), [op]);
  const opSendUrl = useMemo(() => getSendUrl(), [op]);
  const opApproveSendUrl = useMemo(
    () => userPathMap.sendApprove,
    [userPathMap],
  );

  function getSignUrl() {
    if (isApproveOp) return userPathMap.signApprove;
    if (isTransferOp) return userPathMap.signTransfer;
    if (isSwapOp) return userPathMap.signSwap;
  }

  function getSendUrl() {
    if (isApproveOp) return userPathMap.sendApprove;
    if (isTransferOp) return userPathMap.sendTransfer;
    if (isSwapOp) return userPathMap.sendSwap;
  }

  const routings = useMemo(() => {
    if (!networkId) return [];
    return networkRouting[networkName as  NetworkChainType]
  }, [networkId, networkName])

  const maxMinimum = useMemo(() => {
    if (!params.token0Num || !params.token1Num) return 0;
    if (params.token1Num) {
      return Number(params.token1Num)*0.95;
    } 
    return 0;
  }, [params.token1Num])

  const { data: token0Allowance, mutate: trigger0Allowance } =
      useTokenAllowance(
        params.token0?.token_address || null,
        params.spender || "",
        params.fromAddress,
      );

  useEffect(() => {
    setAllowance(token0Allowance)
  }, [token0Allowance])


  const shouldApproveToken0 = useMemo(() => {
    if (networkName === NetworkChainType.SOLANA) return false;
    if (params.token0?.token_address === GAS_TOKEN_ADDRESS) return false;
    return params.token0 && allowance === "0";
  }, [params.token0, networkName]);

  return {
    opSignUrl,
    opSendUrl,
    opApproveSendUrl,
    isApproveOp,
    isTransferOp,
    isSwapOp,
    routings,
    maxMinimum,
    shouldApproveToken0,
    trigger0Allowance
  };
}
