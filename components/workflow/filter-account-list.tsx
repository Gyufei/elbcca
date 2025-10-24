import { useContext, useEffect, useMemo, useState } from "react";
import useSWRMutation from "swr/mutation";
import { uniqBy } from "lodash";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import TokenSelect from "@/components/workflow/token-select";
import { useStrNum } from "@/lib/hooks/use-str-num";
import fetcher from "@/lib/fetcher";
import { IToken } from "@/lib/types/token";
import { NetworkContext } from "@/lib/providers/network-provider";
import { GAS_TOKEN_ADDRESS, UNIT256_MAX } from "@/lib/constants/global";
import { TokenContext } from "@/lib/providers/token-provider";
import useIndexStore from "@/lib/state";
import { IKeyStoreAccount } from "@/lib/types/keystore";
import { useTranslations } from "next-intl";
import LoadingIcon from "../shared/loading-icon";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { BasicButton } from "./components/button";
import WalletRow from "./wallet-row";

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
            <WalletRow
              key={acc.account}
              index={index}
              accData={acc}
              handleClickAcc={handleClickAcc}
              isFilterGasToken={isFilterGasToken}
              gasToken={gasToken || undefined}
              token={token || undefined}
            >
              <Checkbox
                className="ml-1 mr-3"
                checked={selectedWallets.includes(acc.account)}
                onCheckedChange={(checked) =>
                  handleSelectWallet(acc.account, checked as boolean)
                }
              />
            </WalletRow>
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
