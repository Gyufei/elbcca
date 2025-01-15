import { useContext, useEffect } from "react";

import { cn, isAddress, parseToAddress } from "@/lib/utils";
import { NetworkContext } from "@/lib/providers/network-provider";

import { Input } from "../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { TokenContext } from "@/lib/providers/token-provider";
import useIndexStore from "@/lib/state";
import { useAccountBalance } from "@/lib/hooks/use-account-balance";
import { useGasPrice } from "@/lib/hooks/use-gas-price";
import { useNonce } from "@/lib/hooks/use-nonce";
import { useTranslations } from "next-intl";
import { IToken } from "@/lib/types/token";
import { NetworkChainType } from "@/lib/types/network";

export default function QueryAccountBalance({
  token0,
  token1,
  gas,
  setGas,
}: {
  gas: number | null;
  setGas: (_gas: number) => void;
  token0: IToken | null;
  token1: IToken | null;
}) {
  const T = useTranslations("Common");
  const { network, networkName } = useContext(NetworkContext);

  const {
    gasToken
  } = useContext(TokenContext);

  const fromAddress = useIndexStore((state) => state.fromAddress);
  const setFromAddress = useIndexStore((state) => state.setFromAddress);
  const toAddress = useIndexStore((state) => state.toAddress);
  const setToAddress = useIndexStore((state) => state.setToAddress);

  const handleAccountChange = (v: string) => {
    if (networkName ===  NetworkChainType.SOLANA) {
      setFromAddress(v);
    } else {
      const addrV = parseToAddress(v);
      setFromAddress(addrV);
    }
  };

  const { mutate: getGas } = useGasPrice();
  const { mutate: getNonce } = useNonce(fromAddress);

  const {
    balances,
    handleBalanceQuery,
    gasBalanceRes,
    triggerGasBalance,
    resetGasBalance,
  } = useAccountBalance(fromAddress, token0, token1);

  useEffect(() => {
    if (networkName) {
      setFromAddress?.("");
      setToAddress?.("")
    }
  }, [networkName])

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
      token0 &&
      token1 &&
      fromAddress &&
      isAddress(fromAddress, networkName || "")
    ) {
      handleBalanceQuery();
      triggerGasBalance();
    }

    if (fromAddress) {
      getGas();
      getNonce();
    }

    if (!toAddress) {
      setToAddress?.(fromAddress);
    }
  };

  useEffect(() => {
    resetGasBalance();
  }, [network?.chain_id, resetGasBalance]);

  useEffect(() => {
    handleQuery();
  }, [token0?.token_id, token1?.token_id])

  return (
    <>
      <div className="p-3 pt-0">
        <div className="LabelText mb-1">{T("FromAddress")}</div>
        <div className="flex justify-between">
          <Input
            value={fromAddress}
            onChange={(e: any) => handleAccountChange(e.target.value)}
            className="mr-3 border-border-color bg-white"
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
      </div>

      <div className="mt-1 grid grid-cols-3 gap-x-3 px-3">
        <SmallTokenCard name={gasToken?.token_symbol || 'ETH'} num={gas || 0} />
        <SmallTokenCard name={token0?.token_symbol} num={balances[0] || 0} />
        <SmallTokenCard name={token1?.token_symbol} num={balances[1] || 0} />
        {/* <div className="flex flex-col rounded-md border bg-custom-bg-white px-4 pb-[7px] pt-[9px]">
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
        </div> */}
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
