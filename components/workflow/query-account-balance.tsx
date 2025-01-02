import { useContext, useEffect, useMemo } from "react";

import { cn, isAddress, parseToAddress } from "@/lib/utils";
import { NetworkContext } from "@/lib/providers/network-provider";

import { Input } from "../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TokenContext } from "@/lib/providers/token-provider";
import useIndexStore from "@/lib/state";
import { useAccountBalance } from "@/lib/hooks/use-account-balance";
import { useGasPrice } from "@/lib/hooks/use-gas-price";
import { useNonce } from "@/lib/hooks/use-nonce";
import { useTranslations } from "next-intl";

export default function QueryAccountBalance({
  gas,
  setGas,
}: {
  gas: number | null;
  setGas: (_gas: number) => void;
}) {
  const T = useTranslations("Common");
  const { network } = useContext(NetworkContext);
  const {
    token: userToken,
    gasToken,
    stableTokens,
    stableToken,
    setStableToken,
  } = useContext(TokenContext);

  const fromAddress = useIndexStore((state) => state.fromAddress);
  const setFromAddress = useIndexStore((state) => state.setFromAddress);
  const toAddress = useIndexStore((state) => state.toAddress);
  const setToAddress = useIndexStore((state) => state.setToAddress);

  const handleAccountChange = (v: string) => {
    const addrV = parseToAddress(v);
    setFromAddress(addrV);
  };

  const handleStableTokenSelect = (add: string) => {
    const selected = stableTokens.find(
      (token: Record<string, any>) => token.address === add,
    );
    setStableToken(selected || null);
  };

  const { mutate: getGas } = useGasPrice();
  const { mutate: getNonce } = useNonce(fromAddress);

  const {
    accountBalanceRes,
    triggerAccountBalance,
    resetAccountBalance,
    gasBalanceRes,
    triggerGasBalance,
    resetGasBalance,
  } = useAccountBalance(fromAddress, userToken, stableToken);

  useEffect(() => {
    if (gasBalanceRes) {
      setGas(gasBalanceRes?.balance_of || 0);
    }
  }, [gasBalanceRes, setGas]);

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleQuery();
    }
  };

  const handleQuery = () => {
    if (
      gasToken &&
      userToken &&
      stableToken &&
      fromAddress &&
      isAddress(fromAddress)
    ) {
      triggerGasBalance();
      triggerAccountBalance();
    }

    if (fromAddress) {
      getGas();
      getNonce();
    }

    if (!toAddress) {
      setToAddress(fromAddress);
    }
  };

  useEffect(() => {
    resetAccountBalance();
    resetGasBalance();
  }, [network?.chain_id, resetAccountBalance, resetGasBalance]);

  const accountBalances = useMemo(
    () => accountBalanceRes?.batch_balance_of || [0, 0],
    [accountBalanceRes],
  );

  return (
    <>
      <div className="p-3 pt-0">
        <div className="LabelText mb-1">{T("FromAddress")}</div>
        <div className="flex justify-between">
          <Input
            value={fromAddress}
            onChange={(e: any) => handleAccountChange(e.target.value)}
            className="mr-3 border-border-color bg-white"
            placeholder="0x11111111111"
            onKeyDown={handleKeyDown}
          />
          <button
            disabled={!fromAddress || !isAddress(fromAddress)}
            onClick={() => handleQuery()}
            className="w-[64px] rounded-md border border-border-color bg-white px-3 text-sm font-bold text-title-color hover:bg-custom-bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {T("Query")}
          </button>
        </div>
      </div>

      <div className="mt-1 grid grid-cols-3 gap-x-3 px-3">
        <SmallTokenCard name={gasToken?.symbol} num={gas || 0} />
        <SmallTokenCard name={userToken?.symbol} num={accountBalances[0]} />
        <div className="flex flex-col rounded-md border bg-custom-bg-white px-4 pb-[7px] pt-[9px]">
          <Select
            value={stableToken?.address || undefined}
            onValueChange={(e: string) => handleStableTokenSelect(e)}
          >
            <SelectTrigger
              style={{
                boxShadow: "none !important",
              }}
              className="LabelText h-[20px] max-w-[60px] border-0 bg-transparent p-0 shadow-none outline-none focus:shadow-none"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(stableTokens || []).map((t) => (
                <SelectItem key={t.address} value={t.address}>
                  {t.symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {accountBalances[1]?.length > 5 ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="TruncateSingleLine text-lg font-medium text-title-color">
                    {accountBalances[1]}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex items-center">
                    <p className="text-sm text-content-color">
                      {accountBalances[1]}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <div className="TruncateSingleLine text-lg font-medium text-title-color">
              {accountBalances[1]}
            </div>
          )}
        </div>
      </div>
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
