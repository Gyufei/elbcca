import { useContext, useEffect, useMemo, useState } from "react";
import useSWRMutation from "swr/mutation";
import { uniqBy } from "lodash";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import TokenSelect from "@/components/workflow/token-select";
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
import { Checkbox } from "../ui/checkbox";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BasicButton } from "./components/button";
import { NoteBtnDialog } from "./note-btn-dialog";

export default function FilterAccountList({
  keyStores,
  showFilter,
  className,
}: {
  keyStores: Array<IKeyStoreAccount>;
  showFilter: boolean;
  className?: string;
}) {
  const T = useTranslations("Common");
  const userPathMap = useIndexStore((state) => state.userPathMap());
  const { network } = useContext(NetworkContext);
  const networkId = network?.chain_id;

  const { tokens, gasToken } = useContext(TokenContext);

  const setFromAddress = useIndexStore((state) => state.setFromAddress);

  const [token, setToken] = useState<IToken | null>(gasToken);
  const [tokenMin, setTokenMin] = useStrNum("");
  const [tokenMax, setTokenMax] = useStrNum("");

  const isFilterGasToken = token?.token_address === GAS_TOKEN_ADDRESS;
  const [selectedWallets, setSelectedWallets] = useState<Array<string>>([]);

  const {
    data: accounts,
    isMutating: filtering,
    trigger: filterTrigger,
    reset: filterResultReset,
  } = useSWRMutation(
    `${userPathMap.filterAccount}?${getFilterQuery()}`,
    fetcher as any,
  );

  useEffect(() => {
    if (tokens && !token) {
      setToken(tokens[0]);
    }
  }, [tokens]);

  function handleTokenSelect(token: IToken | null) {
    setToken(token);
    filterResultReset();
  }

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

    if (token?.token_address) {
      queryParams.set("token_address", token.token_address);
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
    if (!token?.token_address) {
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
      if (
        (!tokenMin && !tokenMax) ||
        (tokenMin && tokenMax && tokenMin > tokenMax) ||
        filtering
      )
        return;
      handleFilter();
    }
  };

  function handleCreateVa() {
    console.log("create va", selectedWallets);
  }

  function handleSelectWallet(account: string, checked: boolean) {
    if (checked) {
      setSelectedWallets([...selectedWallets, account]);
    } else {
      setSelectedWallets(selectedWallets.filter((acc) => acc !== account));
    }
  }

  function handleSelectAll(checked: boolean) {
    if (checked) {
      setSelectedWallets(uniqAccounts.map((acc) => acc.account));
    } else {
      setSelectedWallets([]);
    }
  }

  return (
    <div className={cn("flex flex-col justify-stretch", className)}>
      {showFilter && (
        <div className="flex flex-col p-3">
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

          <Button
            disabled={
              (!tokenMin && !tokenMax) ||
              (tokenMin && tokenMax && tokenMin > tokenMax) ||
              filtering
            }
            onClick={handleFilter}
            className="disabled:opacity-1 mt-3 flex items-center justify-center rounded border bg-white py-2 hover:bg-custom-bg-white disabled:cursor-not-allowed disabled:contrast-[0.9]"
          >
            <LoadingIcon isLoading={filtering} />
            <span className="text-title-color">{T("FilterAccount")}</span>
          </Button>
        </div>
      )}

      <div className="relative flex flex-col border-t border-shadow-color bg-[#fafafa]">
        <ScrollArea
          className="h-auto pb-2"
          style={{
            height: showFilter ? "calc(100vh - 536px)" : "calc(100vh - 342px)",
          }}
        >
          {uniqAccounts.map((acc: any, index: number) => (
            <div
              key={acc.account}
              className="flex h-[73px] items-center justify-between border-b bg-custom-bg-white p-3"
            >
              <div className="flex flex-1 flex-col gap-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="pl-1 pr-5 text-left text-lg leading-none text-content-color">
                      {index + 1}
                    </div>
                    <TruncateText text={acc.account}>
                      <span
                        className="ml-1 cursor-pointer text-lg font-medium text-title-color"
                        onClick={() => handleClickAcc(acc.account)}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </TruncateText>
                    <NonceFlag className="ml-4" nonce={acc.nonce} />
                  </div>
                  <NoteBtnDialog walletAddr={acc.account} />
                </div>
                <div className="LabelText flex">
                  <Checkbox
                    className="ml-1 mr-3"
                    checked={selectedWallets.includes(acc.account)}
                    onCheckedChange={(checked) =>
                      handleSelectWallet(acc.account, checked as boolean)
                    }
                  />
                  <div className="mr-20 flex items-center gap-x-1">
                    <span>{gasToken?.token_symbol}</span>
                    <AmountTooltipDisplay amount={acc.gas_token_amount} />
                  </div>

                  {!isFilterGasToken && (
                    <div className="flex items-center gap-x-1">
                      <span>{token?.token_symbol}</span>
                      <AmountTooltipDisplay amount={acc.quote_token_amount} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      <div className="flex justify-between px-3 py-2">
        <div className="flex items-center gap-x-2">
          <Checkbox
            disabled={uniqAccounts.length === 0}
            checked={
              selectedWallets.length > 0 &&
              selectedWallets.length === uniqAccounts.length
            }
            onCheckedChange={handleSelectAll}
          />
          <span>{T("SelectAll")}</span>
        </div>

        <BasicButton
          loading={false}
          disabled={false}
          onClick={() => handleCreateVa()}
        >
          <span>{T("CreateVirtualAccount")}</span>
        </BasicButton>
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

function NonceFlag({
  className,
  nonce,
}: {
  className?: string;
  nonce: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center rounded border border-[#707070] bg-[#fff]",
        className,
      )}
    >
      <div className="flex h-5 w-5 items-center justify-center bg-[#707070]">
        <Image
          src="/icons/path-flag.svg"
          alt="path-flag"
          width={16}
          height={16}
        />
      </div>
      <div className="flex h-5 w-5 items-center justify-center text-xs text-[#707070]">
        {nonce}
      </div>
    </div>
  );
}
