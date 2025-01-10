import { useContext, useState } from "react";
import { NetworkContext } from "../providers/network-provider";
import { IToken } from "../types/token";
import useSWRMutation from "swr/mutation";
import fetcher from "../fetcher";
import useIndexStore from "../state";
import { GAS_TOKEN_ADDRESS } from "../constants/global";

type BalanceType = number;
export function useAccountBalance(
  fromAddress: string,
  token0: IToken | null,
  token1: IToken | null,
) {
  const [balances, setBalances] = useState<BalanceType[]>([0, 0]);
  const userPathMap = useIndexStore((state) => state.userPathMap());
  const { network } = useContext(NetworkContext);

  const getAccountBalanceQuery = (queryTokens: string[]) => {
    const queryParams = new URLSearchParams();

    if (!network || !fromAddress) {
      return;
    }

    queryParams.set("chain_id", network?.chain_id.toString());
    queryParams.set("account", fromAddress);

    queryParams.set("tokens", queryTokens.join(","));

    const query = queryParams.toString();

    return query;
  };

  const getGasBalanceQuery = () => {
    const queryParams = new URLSearchParams();

    if (!network || !fromAddress) {
      return;
    }

    queryParams.set("chain_id", network?.chain_id.toString());
    queryParams.set("account", fromAddress);

    const query = queryParams.toString();

    return query;
  };

  const accountBalanceFetch = async (queryTokens: string[]) => {
    const res = await fetcher(`${userPathMap.accountTokensBalance}?${getAccountBalanceQuery(queryTokens)}`, {
      method: "GET",
    });
    return res.batch_balance_of || queryTokens.map(() => 0);
  }

  const gasBalanceFetch = async () => {
    const res = await fetcher( `${userPathMap.accountTokenBalance}?${getGasBalanceQuery()}`, {
      method: "GET",
    });
    return [res.balance_of || 0];
  }


  const {
    data: gasBalanceRes,
    trigger: triggerGasBalance,
    reset: resetGasBalance,
  } = useSWRMutation(
    `${userPathMap.accountTokenBalance}?${getGasBalanceQuery()}`,
    fetcher as any,
  );

  const handleBalanceQuery = async () => {
    const tokenAddressList = [token0?.token_address, token1?.token_address];
    let result = [0, 0];
    if (!tokenAddressList.includes(GAS_TOKEN_ADDRESS)) {
      const res = await Promise.all(tokenAddressList.map((key) => {
        if (!key) return null;
        if (key === GAS_TOKEN_ADDRESS) {
          return gasBalanceFetch()
        } else {
          return accountBalanceFetch([key])
        }
      }))
      res.map((item, index) => result[index] = item[0] || 0)
    } else {
      result = await accountBalanceFetch(tokenAddressList as string[])
    }
   
    setBalances(result)
  }

  return {
    balances,
    handleBalanceQuery,
    gasBalanceRes,
    triggerGasBalance,
    resetGasBalance,
  };
}
