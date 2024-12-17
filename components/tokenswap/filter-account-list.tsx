import { useContext, useMemo, useState } from "react";
import useSWRMutation from "swr/mutation";
import { uniqBy } from "lodash";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import TokenSelect from "@/components/tokenswap/token-select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useStrNum } from "@/lib/hooks/use-str-num";
import fetcher from "@/lib/fetcher";
import { IToken } from "@/lib/types/token";
import { NetworkContext } from "@/lib/providers/network-provider";
import { GAS_TOKEN_ADDRESS, UNIT256_MAX } from "@/lib/constants/global";
import { TokenContext } from "@/lib/providers/token-provider";
import useIndexStore from "@/lib/state";
import { IKeyStoreAccount } from "@/lib/types/keystore";
import { useTranslations } from "next-intl";
import TruncateText from "../shared/trunc-text";
import LoadingIcon from "../shared/loading-icon";

export default function FilterAccountList({
  keyStores,
}: {
  keyStores: Array<IKeyStoreAccount>;
}) {
  const T = useTranslations("Common");
  const userPathMap = useIndexStore((state) => state.userPathMap());
  const { network } = useContext(NetworkContext);
  const networkId = network?.chain_id;

  const { token: userToken, gasToken, stableToken } = useContext(TokenContext);
  const tokens = useMemo(() => {
    const ts = [];
    if (gasToken) {
      ts.push(gasToken);
    }
    if (userToken) {
      ts.push(userToken);
    }
    if (stableToken) {
      ts.push(stableToken);
    }
    return ts;
  }, [userToken, gasToken, stableToken]);

  const setFromAddress = useIndexStore((state) => state.setFromAddress);

  const [token, setToken] = useState<IToken | null>(gasToken);
  const [tokenMin, setTokenMin] = useStrNum("");
  const [tokenMax, setTokenMax] = useStrNum("");

  if (gasToken && !token) {
    setToken(gasToken);
  }

  function handleTokenSelect(token: IToken | null) {
    setToken(token);
    filterResultReset();
  }

  const isFilterGasToken = token?.address === GAS_TOKEN_ADDRESS;

  const {
    data: accounts,
    isMutating: filtering,
    trigger: filterTrigger,
    reset: filterResultReset,
  } = useSWRMutation(
    `${userPathMap.filterAccount}?${getFilterQuery()}`,
    fetcher as any,
  );

  const uniqAccounts = useMemo<Array<Record<string, any>>>(() => {
    if (!Array.isArray(accounts)) {
      return [];
    }

    const filteredAccounts = accounts.filter((acc) => {
      const allAccounts = keyStores.reduce((acs, ks) => {
        return [...acs, ...ks.accounts];
      }, [] as Array<any>);

      for (const ksAcc of allAccounts) {
        if (ksAcc.account === acc.account) {
          return true;
        }
      }

      return false;
    });

    const newAccount = uniqBy(filteredAccounts, "account");

    return newAccount;
  }, [accounts, keyStores]);

  function getFilterQuery() {
    const queryParams = new URLSearchParams();

    if (networkId) {
      queryParams.set("chain_id", networkId.toString());
    }

    if (keyStores.length) {
      queryParams.set(
        "keystore",
        keyStores.map((ks: any) => ks.name).join(","),
      );
    }

    if (token?.address) {
      queryParams.set("token_address", token.address);
    }

    let min = tokenMin || "0";
    let max = tokenMax || UNIT256_MAX;

    if (tokenMin && tokenMax && Number(tokenMin) > Number(tokenMax)) {
      min = tokenMax;
      max = tokenMin;
    }

    queryParams.set("token_amount_minimum", min);
    queryParams.set("token_amount_maximum", max);

    const query = queryParams.toString();

    return query;
  }

  function handleFilter() {
    if (!token?.address) {
      return;
    }

    if (!keyStores.length) {
      return;
    }

    filterResultReset();
    filterTrigger();
  }

  function handleClickAcc(addr: string) {
    setFromAddress(addr);
  }

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleFilter();
    }
  };

  return (
    <div className="flex flex-col justify-stretch">
      <div className="flex flex-col px-4">
        <div className="LabelText mb-1">Token</div>
        <div className="mb-3">
          <TokenSelect
            tokens={tokens}
            token={token || null}
            handleTokenSelect={handleTokenSelect}
          />
        </div>
        <div className="flex items-center">
          <Input
            value={tokenMin || ""}
            onChange={(e) => setTokenMin(e.target.value)}
            className="border-border-color bg-white"
            placeholder={T("Min")}
            onKeyDown={handleKeyDown}
          />
          <div className="mx-2">-</div>
          <Input
            value={tokenMax || ""}
            onChange={(e) => setTokenMax(e.target.value)}
            className="border-border-color bg-white"
            placeholder={T("Max")}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      <div className="relative mt-8 flex flex-col border-t border-shadow-color pt-5">
        <Button
          disabled={(!tokenMin && !tokenMax) || filtering}
          onClick={handleFilter}
          className="disabled:opacity-1 absolute top-[-20px] mx-3 flex w-[95%] items-center justify-center rounded border bg-white py-2 hover:bg-custom-bg-white disabled:cursor-not-allowed disabled:contrast-[0.9]"
        >
          <LoadingIcon isLoading={filtering} />
          <span className="text-title-color">{T("FilterAccount")}</span>
        </Button>
        <ScrollArea
          className="pb-2"
          style={{
            height: "calc(100vh - 430px)",
          }}
        >
          {uniqAccounts.map((acc, index) => (
            <div
              key={acc.account}
              className="flex h-[73px] items-center justify-between border-b bg-custom-bg-white p-4"
            >
              <div className="pl-2 pr-5 text-lg leading-none text-content-color">
                {index + 1}
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-center text-lg font-medium text-title-color">
                  <TruncateText text={acc.account}>
                    <span
                      className="ml-1 cursor-pointer text-content-color"
                      onClick={() => handleClickAcc(acc.account)}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </TruncateText>
                  <div className="ml-4 flex h-4 w-4 items-center justify-center rounded-sm bg-[#707070] text-xs text-white">
                    {acc.nonce}
                  </div>
                </div>
                <div className="LabelText flex">
                  <div className="mr-6 flex items-center gap-x-1">
                    <span>{gasToken?.symbol}</span>
                    <AmountTooltipDisplay amount={acc.gas_token_amount} />
                  </div>

                  {!isFilterGasToken && (
                    <div className="flex items-center gap-x-1">
                      <span>{token?.symbol}</span>
                      <AmountTooltipDisplay amount={acc.quote_token_amount} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}

function AmountTooltipDisplay({ amount }: { amount: string }) {
  const isLong = amount.length > 8;
  const amountFmt = isLong ? amount.slice(0, 8) + "..." : amount;
  return isLong ? (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="TruncateSingleLine">{amountFmt}</div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center">
            <p className="text-sm text-content-color">{amount}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <div>{amount}</div>
  );
}
