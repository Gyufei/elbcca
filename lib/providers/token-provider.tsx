"use client";

import { createContext, useContext, useMemo, useState } from "react";
import useSWR from "swr";

import fetcher from "@/lib/fetcher";
import { IToken } from "@/lib/types/token";
import { NetworkContext } from "./network-provider";
import { uniqBy } from "lodash";
import { GAS_TOKEN_ADDRESS } from "../constants/global";
import useIndexStore from "../state";
import { SystemEndPointPathMap } from "../end-point";

interface ITokenContext {
  tokens: Array<IToken>;
  token: IToken | null;
  gasToken: IToken | null;
  currencyToken: IToken | null;
  stableTokens: Array<IToken>;
  stableToken: IToken | null;
  setStableToken: (_t: IToken | null) => void;
}

export const TokenContext = createContext<ITokenContext>({
  token: null,
  tokens: [],
  gasToken: null,
  currencyToken: null,
  stableTokens: [],
  stableToken: null,
  setStableToken: () => {},
});

export default function TokenProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const userPathMap = useIndexStore((state) => state.userPathMap());
  const { network, networkId } = useContext(NetworkContext);

  const { data: userWeb3Info } = useSWR(
    () => userPathMap.web3Info || null,
    fetcher,
  );

  const tokenFetcher = async (url: string): Promise<Array<IToken>> => {
    if (!networkId) return [];

    const resTokens = await fetcher(url);
    const uniqueT = uniqBy(resTokens || [], "token_address") as any;
    return uniqueT;
  };

  const { data: tokens } = useSWR(() => {
    if (!networkId) return null;
    return `${SystemEndPointPathMap.getTokenList}?chain_id=${networkId}`;
  }, tokenFetcher);

  const token = useMemo(() => {
    if (tokens && userWeb3Info?.token_address) {
      const curToken = tokens.find(
        (t) => t.token_address === userWeb3Info?.token_address,
      );
      return curToken || null;
    }
    return null;
  }, [tokens, userWeb3Info]);

  const currencySymbol =
    network?.currency_symbol === "SEP" ? "ETH" : network?.currency_symbol;

  const gasToken = useMemo(() => {
    return (
      (tokens || []).find(
        (t: IToken) =>
          t.token_symbol === currencySymbol && t.token_address === GAS_TOKEN_ADDRESS,
      ) || null
    );
  }, [tokens, currencySymbol]);

  const stableTokens = useMemo(
    () => (tokens || []).filter((t: IToken) => t.is_stable_token),
    [tokens],
  );

  const [stableToken, setStableToken] = useState<IToken | null>(null);

  const currencyToken = useMemo(() => {
    return (
      (tokens || []).find(
        (t: IToken) =>
          t.token_symbol === currencySymbol && t.token_address !== GAS_TOKEN_ADDRESS,
      ) || null
    );
  }, [tokens, currencySymbol]);

  if (stableTokens.length > 0 && !stableToken) {
    const st = stableTokens.find((t) => t.token_symbol === "USDT") || null;
    setStableToken(st);
  }

  return (
    <TokenContext.Provider
      value={{
        tokens: tokens || [],
        token,
        gasToken,
        currencyToken,
        stableTokens: stableTokens || [],
        stableToken,
        setStableToken,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
}
