import { IKeyStoreAccount } from "@/lib/types/keystore";
import { useContext } from "react";
import useEffectStore from "@/lib/state/use-store";
import useIndexStore from "@/lib/state";
import { NetworkContext } from "../providers/network-provider";
import { useWorkflowParams } from "./use-workflow-params";
import { UNIT256_MAX } from "../constants/global";
import { IToken } from "../types/token";
import fetcher from "../fetcher";
import { IAdvanceOptions } from "@/components/workflow/op-advance-options";
import { TokenContext } from "../providers/token-provider";


export function useWorkflow({
  params,
  keyStores,
  gasPrice,
  priorityFee,
  fromAddress,
  toAddress,
  advanceOptions,
  transferAmount
}: {
  keyStores: Array<IKeyStoreAccount>;
  params: Record<string, any>;
  gasPrice: string;
  priorityFee: string;
  fromAddress: string;
  toAddress: string;
  advanceOptions: IAdvanceOptions;
  transferAmount: string;
}) {
  const { networkId } = useContext(NetworkContext);
  const { gasToken } = useContext(TokenContext);
  const activeUser = useEffectStore(useIndexStore, (state) =>
    state.activeUser(),
  );

  const {
      maxMinimum,
      opSignUrl,
      opSendUrl,
      isTransferOp,
      isSwapOp,
      opApproveSendUrl,
    } = useWorkflowParams(params);

  const getCommonParams = () => {
    
    const account = fromAddress;
    const kStore = keyStores.find((ks) =>
      ks.accounts.some((a) => a.account === account),
    );

    const chain_id = networkId || "";
    const keystore = kStore?.name || "";
   
    const paramsAfter = {
      user_name: activeUser?.email,
      chain_id: chain_id + "",
      account,
      keystore,
      op_name: params?.op?.op_name,
      ...(advanceOptions || {}),
      minimum_received: advanceOptions?.minimum_received ||  maxMinimum + "",
      gas: advanceOptions?.gas
        ? (Number(advanceOptions.gas) * 10 ** 9).toFixed()
        : (Number(gasPrice) * 10 ** 9).toFixed(),
      priority_fee: advanceOptions?.priority_fee
        ? (Number(advanceOptions?.priority_fee)).toFixed()
        : (Number(priorityFee)).toFixed(),
    };

    if (!advanceOptions?.nonce) {
      delete paramsAfter.nonce;
    }

    return paramsAfter;
  };


    const getTransferParams = () => {
      const commonParams = getCommonParams();
      if (!commonParams) return null;
  
      const paramsAfter = {
        ...commonParams,
        token: gasToken?.token_address || "",
        amount: transferAmount || UNIT256_MAX,
        recipient: toAddress,
      };
  
      if (!paramsAfter.token || !paramsAfter.amount || !paramsAfter.recipient) return null;
      return paramsAfter;
    };
  
    const getSwapParams = () => {
      const commonParams = getCommonParams();
      if (!commonParams) return null;
      const { token0, token1, token0Num } = params;
      const afterParams = {
        ...commonParams,
        recipient: toAddress,
        token_in: token0?.token_address || "",
        token_out: token1?.token_address || "",
        token_in_name: token0?.token_symbol || "",
        token_out_name: token1?.token_symbol || "",
        amount: token0Num,
        is_exact_input: true,
      };
  
      if (
        !afterParams.keystore ||
        !afterParams.recipient ||
        !afterParams.token_in ||
        !afterParams.token_out ||
        !afterParams.amount
      ) {
        return null;
      }
      return afterParams;
    };
  
    function getTxParams() {
      if (isTransferOp) return getTransferParams();
      if (isSwapOp) return getSwapParams();
    }
  
    const getApproveParams = (inToken: IToken | null) => {
      const commonParams = getCommonParams();
      if (!commonParams) return null;
      const afterParams = {
        ...commonParams,
        token: inToken?.token_address || "",
        token_name: inToken?.token_symbol || "",
        amount: UNIT256_MAX,
        spender: params.spender
      };
  
      if (!afterParams.token || !afterParams.amount) return null;
      return afterParams;
    };

    async function signAction() {
      const params = getTxParams();
      console.log(params, opSignUrl, "test 测试中")
      if (!opSignUrl || !params) return;
  
      const res = await fetcher(opSignUrl, {
        method: "POST",
        body: JSON.stringify(params),
      });
  
      return res;
    }

    async function sendAction() {
      const params = getTxParams();
      if (!opSendUrl || !params) return;

      return fetcher(opSendUrl, {
        method: "POST",
        body: JSON.stringify(params),
      });
    }

    async function approveAction() {
      const afterParams = getApproveParams(params?.token0);
      if (!opApproveSendUrl || !afterParams) return;
  
      await fetcher(opApproveSendUrl, {
        method: "POST",
        body: JSON.stringify(params),
      });
    }

    return {
      signAction,
      sendAction,
      approveAction
    }
}
