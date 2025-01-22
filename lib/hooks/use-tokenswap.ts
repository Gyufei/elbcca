import { useContext, useEffect } from "react";
import useSWRMutation from "swr/mutation";

import fetcher from "@/lib/fetcher";
import useIndexStore from "@/lib/state";
import { NetworkContext } from "@/lib/providers/network-provider";
import { IToken } from "../types/token";

export type SwapTokenType = {
  token0: IToken | null,
  token1: IToken | null,
  token0Num: string;
  token1Num: string;
  spender: string | null;
}

export function useTokenSwap(
  routing: string,
  value: SwapTokenType,
  onChange: (v: Partial<SwapTokenType>) => void
) {
  const userPathMap  = useIndexStore((state) => state.userPathMap());
  const { networkId } = useContext(NetworkContext);
  const {
    token0,
    token1,
    token0Num,
    token1Num
  } = value || {};

  const estimateAction = async (
    t0Addr?: string,
    t1Addr?: string,
    amount?: string,
    exactInput?: boolean,
  ) => {
    const changeKey = exactInput ? "token1Num" : "token0Num";
    if (!t0Addr || !t1Addr) return;

    const amountNum = Number(amount);
    if (!amountNum || !(amountNum > 0)) return;

    try {
      const result = await triggerEstimate({
        token0Addr: t0Addr,
        token1Addr: t1Addr,
        amount: String(amountNum),
        exactInput: exactInput === true,
      });
      const amount = result?.amount;
      const spender = result?.swap_address || "";

      onChange({
        [changeKey]: amount,
        spender: spender
      })

    } catch (e) {
      onChange({
        [changeKey]: "",
        spender: ""
      })
    }
  };

  const fetchEstimate = async (
    url: string,
    {
      arg,
    }: {
      arg: {
        token0Addr: string | undefined;
        token1Addr: string | undefined;
        amount: string | undefined;
        exactInput: boolean;
      };
    },
  ) => {
    if (!routing) return null;

    const { token0Addr, token1Addr, amount, exactInput } = arg;
    if (!token0Addr || !token1Addr || !amount) return null;

    const query = new URLSearchParams();
    query.set("chain_id", networkId + "" || "");
    query.set("token_in", token0Addr || "");
    query.set("token_out", token1Addr || "");
    query.set("token_amount", String(amount) || "");
    query.set("is_exact_input", exactInput ? "true" : "false");
    query.set("routing", routing || "");

    const queryStr = query.toString();
    const res = await fetcher(`${url}?${queryStr}`);

    return {
      amount: res?.amount,
      swap_address: res?.swap_address
    };
  };

  const { trigger: triggerEstimate } = useSWRMutation(
    `${userPathMap.estimateToken}`,
    fetchEstimate,
  );

  const handleTokenChange = async (t: IToken | null, type: 'token0' | 'token1') => {
    const diretion = type === 'token0';
    const tokenKey = type;
    const oldTokenNum = diretion ? token0Num : token1Num;
    const anotherToken = diretion ? token1 : token0;
    const anotherTokenNum = diretion ? token1Num : token0Num;

    if (!t || !anotherToken) {
      onChange({
        [tokenKey]: t
      })
      return;
    }
    
    const isSameToken = t && t?.token_address === anotherToken?.token_address;

    if (isSameToken) {
      onChange(diretion ? {
        token0: t,
        token1: null,
      } : {
        token0: null,
        token1: t,
      })
      return;
    }
    onChange({
      [tokenKey]: t
    })
    if (oldTokenNum) {
      estimateAction(t?.token_address, anotherToken?.token_address, oldTokenNum, diretion);
    } else {
      estimateAction(anotherToken?.token_address, t?.token_address, anotherTokenNum, !diretion);
    }
  };

  const handleTokenNumChange = (n: string, type: 'token0' | 'token1') => {
    const diretion = type === 'token0';
    const changeKey = diretion ? "token0Num" : "token1Num";
    const oldTokenNum = diretion ? token0Num : token1Num;
    const token = diretion ? token0 : token1;
    const anotherToken = diretion ? token1 : token0;
    if (n === oldTokenNum) return;
    onChange({
      [changeKey]: n
    })
    estimateAction(token?.token_address, anotherToken?.token_address, n, diretion);
  };

  useEffect(() => {
    if (!token0Num && !token1Num) return;
    if (!token0 || !token1) return;
    estimateAction(token0.token_address, token1.token_address, token0Num, true);
  }, [routing])

  return {
    handleTokenChange,
    handleTokenNumChange,
  };
}
