import { useContext, useEffect } from "react";

import { cn, isAddress, parseToAddress } from "@/lib/utils";
import { NetworkContext } from "@/lib/providers/network-provider";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import useIndexStore from "@/lib/state";
import { useTranslations } from "next-intl";
import { NetworkChainType } from "@/lib/types/network";
import { FormItem } from "./components/form-item";
import Input from "./components/input";
import useSWRMutation from "swr/mutation";
import fetcher from "@/lib/fetcher";
import Select from "./components/select";
import { IToken } from "@/lib/types/token";
import { useAccountBalance } from "@/lib/hooks/use-account-balance";

export default function QueryAccountUsdcMarket({
  gas,
  setGas,
  params,
  tokens = [],
  onParamsChange
}: {
  tokens: IToken[];
  gas: number | null;
  params: Record<string, any>;
  setGas: (_gas: number) => void;
  onParamsChange: (v: Record<string, any>) => void;
}) {
  const T = useTranslations("Common");
  const { network, networkId, networkName } = useContext(NetworkContext);
  const userPathMap = useIndexStore((state) => state.userPathMap());

  const fromAddress = useIndexStore((state) => state.fromAddress);
  const setFromAddress = useIndexStore((state) => state.setFromAddress);

  const handleAccountChange = (v: string) => {
    if (networkName ===  NetworkChainType.SOLANA) {
      setFromAddress(v);
    } else {
      const addrV = parseToAddress(v);
      setFromAddress(addrV);
    }
  };

  const {
    gasBalanceRes,
    triggerGasBalance,
    resetGasBalance,
  } = useAccountBalance(fromAddress, null, null);

  const {
    data,
    trigger: userPointTrigger,
    reset: userPointReset,
  } = useSWRMutation(
    `${userPathMap.hypeTradeUserPointAmount}?chain_id=${networkId}&account=${fromAddress}&token_address=${params['marketToken']?.token_address || ""}`,
    fetcher as any,
  );

  useEffect(() => {
    if (networkName) {
      setFromAddress?.("");
    }
  }, [networkName])


  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleQuery();
    }
  };

  const handleQuery = () => {
    if (
      fromAddress &&
      isAddress(fromAddress, networkName || "")
    ) {
      userPointTrigger();
      triggerGasBalance();
    }

  };

  useEffect(() => {
    if (gasBalanceRes) {
      setGas(gasBalanceRes?.balance_of || 0);
    }
  }, [gasBalanceRes, setGas]);


  useEffect(() => {
    userPointReset();
    resetGasBalance();
  }, [network?.chain_id]);


  return (
    <>
      <FormItem title={T("FromAddress")} className="px-3">
        <div className="flex justify-between gap-x-2">
          <Input
            value={fromAddress}
            onChange={(e: any) => handleAccountChange(e.target.value)}
            placeholder={networkName ===  NetworkChainType.SOLANA ? "" : "0x11111111111"}
            onKeyDown={handleKeyDown}
          />
          <button
            disabled={!fromAddress || !isAddress(fromAddress, networkName || "")}
            onClick={() => handleQuery()}
            className="w-[72px] rounded-md border border-border-color bg-white  text-sm font-bold text-title-color hover:bg-custom-bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {T("Query")}
          </button>
        </div>
      </FormItem>
      <div className="mt-4 grid grid-cols-3 gap-x-3 px-3">
        <SmallTokenCard name={T("UsdcFreePoint")} num={data?.free_point || 0} />
        <SmallTokenCard name={T("UsdcLockedPoint")} num={data?.locked_point || 0} />
        <SmallTokenCard name={'USDC'} num={gas || 0} />
      </div>
      <FormItem title={T("UsdcTradeMarket")} className="px-3">
        <Select
          value={params['marketToken']}
          options={tokens}
          valueKey={'token_address'}
          labelKey={'token_symbol'}
          labelInValue
          onChange={(v) => onParamsChange({['marketToken']: v })}
        />
      </FormItem>
    </>
  );
}

function SmallTokenCard({
  name,
  num,
  className,
}: {
  name: string | undefined;
  num: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-md border bg-custom-bg-white px-4 pb-[7px] pt-[9px]",
        className,
      )}
    >
      <div className="LabelText h-[20px]">{name}</div>
      {String(num).length > 5 ? (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="TruncateSingleLine text-lg font-medium text-title-color">
                {num}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex items-center">
                <p className="text-sm text-content-color">{num}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div className="TruncateSingleLine text-lg font-medium text-title-color">
          {num}
        </div>
      )}
    </div>
  );
}
