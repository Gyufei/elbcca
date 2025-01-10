import { useContext } from "react";
import useSWRMutation from "swr/mutation";

import fetcher from "@/lib/fetcher";
import useIndexStore from "@/lib/state";
import { NetworkContext } from "@/lib/providers/network-provider";
import { IToken } from "../types/token";
import { ITokenNumDesc } from "@/components/workflow/token-select-and-input";

export function useTokenSwap(
  routing: string,
  token0: ITokenNumDesc,
  token1: ITokenNumDesc,
  setToken0: (_t: any) => void,
  setToken1: (_t: any) => void,
) {
  const userPathMap  = useIndexStore((state) => state.userPathMap());
  const { networkId } = useContext(NetworkContext);

  const estimateAction = async (
    t0Addr: string,
    t1Addr: string,
    amount: string,
    exactInput: boolean,
  ) => {
    const setTokenAction = exactInput ? setToken1 : setToken0;

    const amountNum = Number(amount);
    if (!amountNum || !(amountNum > 0)) return;

    try {
      const result = await triggerEstimate({
        token0Addr: t0Addr,
        token1Addr: t1Addr,
        amount: String(amountNum),
        exactInput: exactInput,
      });
      setTokenAction((t: any) => ({ ...t, num: String(result || "") }));
    } catch (e) {
      setTokenAction((t: any) => ({ ...t, num: "" }));
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

    return res?.amount;
  };

  const { trigger: triggerEstimate } = useSWRMutation(
    `${userPathMap.estimateToken}`,
    fetchEstimate,
  );

  const handleToken0Change = async (t: IToken | null) => {
    setToken0((prev: ITokenNumDesc) => ({ ...prev, token: t }));
    if (!token0.num && !token1.num) return;

    if (!t) return;
    if (!token1.token) {
      setToken1((prev: ITokenNumDesc) => ({ ...prev, token: t }));
      return;
    }

    const isSameToken = t?.token_address === token1.token?.token_address;
    if (isSameToken) {
      if (token1.num) {
        setToken0((prev: ITokenNumDesc) => ({ ...prev, num: token1.num }));
      } else if (token0.num) {
        setToken1((prev: ITokenNumDesc) => ({ ...prev, num: token0.num }));
      }

      return;
    }

    if (token1.num) {
      estimateAction(t.token_address, token1.token.token_address, token1.num, false);
    } else if (token0.num) {
      estimateAction(t.token_address, token1.token.token_address, token0.num, true);
    }
  };

  const handleToken0NumChange = (n: string) => {
    if (n === token0.num) return;
    setToken0((prev: ITokenNumDesc) => ({ ...prev, num: n }));

    if (!token0.token || !token1.token) {
      setToken1((prev: ITokenNumDesc) => ({ ...prev, num: "" }));
      return;
    }

    if (token0.token && token1.token) {
      const isSameToken = token0?.token?.token_address === token1.token?.token_address;

      if (isSameToken) {
        setToken1((prev: ITokenNumDesc) => ({ ...prev, num: n }));
      } else {
        estimateAction(
          token0?.token?.token_address || "",
          token1?.token?.token_address || "",
          n,
          true,
        );
      }

      return;
    }
  };

  const handleToken1Change = async (t: IToken | null) => {
    setToken1((prev: ITokenNumDesc) => ({ ...prev, token: t }));

    if (!t) return;
    if (!token0.num && !token1.num) return;

    if (!token0.token) {
      setToken0((prev: ITokenNumDesc) => ({ ...prev, num: "" }));
      return;
    }

    const isSameToken = t?.token_address === token0.token?.token_address;
    if (isSameToken) {
      if (token0.num) {
        setToken1((prev: ITokenNumDesc) => ({ ...prev, num: token0.num }));
      } else if (token1.num) {
        setToken0((prev: ITokenNumDesc) => ({ ...prev, num: token1.num }));
      }

      return;
    }

    if (token0.num) {
      estimateAction(token0.token.token_address, t?.token_address, token0.num, true);
    } else if (token1.num) {
      estimateAction(token0.token.token_address, t?.token_address || "", token1.num, false);
    }
  };

  const handleToken1NumChange = (n: string) => {
    if (n === token1.num) return;
    setToken1((prev: ITokenNumDesc) => ({ ...prev, num: n }));

    if (!token0.token || !token1.token) {
      setToken0((prev: ITokenNumDesc) => ({ ...prev, num: "" }));
      return;
    }

    if (token0.token && token1.token) {
      const isSameToken = token0?.token?.token_address === token1.token?.token_address;

      if (isSameToken) {
        setToken0((prev: ITokenNumDesc) => ({ ...prev, num: n }));
      } else {
        estimateAction(
          token0.token?.token_address || "",
          token1?.token?.token_address || "",
          n,
          false,
        );
      }

      return;
    }
  };

  return {
    handleToken0Change,
    handleToken0NumChange,
    handleToken1Change,
    handleToken1NumChange,
  };
}
