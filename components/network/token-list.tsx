"use client";
import { useRef, useState } from "react";

import { Input } from "@/components/ui/input";

import { TokenTable } from "./token-table";
import useSWR from "swr";
import { SystemEndPointPathMap } from "@/lib/end-point";
import fetcher from "@/lib/fetcher";
import DetailItem from "../shared/detail-item";
import { isTokenAddress } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { NetworkChainType } from "@/lib/types/network";

export interface IAccountGas {
  account: string;
  gas: string;
  tx: number;
  index: number;
}

interface TokenListProps {
  chainId: string;
  networkName: string;
}

export default function TokenList({ chainId, networkName }: TokenListProps) {
  const { data: list, mutate } = useSWR(
    SystemEndPointPathMap.getTokenList + `?chain_id=${chainId}`,
    fetcher,
  );

  const onRefresh = () => {
    mutate();
  };
  return (
    <div className="flex flex-1 flex-col justify-stretch">
      <AddTokenTnput
        networkName={networkName}
        onRefresh={onRefresh}
        chainId={chainId}
      />
      <TokenTable list={list} onRefresh={onRefresh} chainId={chainId} />
    </div>
  );
}

function AddTokenTnput({
  onRefresh,
  chainId,
  networkName,
}: {
  onRefresh: () => void;
  chainId: string;
  networkName: string;
}) {
  const T = useTranslations("Common");
  const [errorMsg, setErrorMsg] = useState("");

  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onChange = (val: string) => {
    if (val && !isTokenAddress(val, networkName)) {
      setErrorMsg(T("AddressError"));
    } else {
      setErrorMsg("");
    }
    setInputValue(val);
  };

  const onBlur = () => {
    if (inputValue && !isTokenAddress(inputValue, networkName)) {
      setErrorMsg(T("AddressError"));
      return;
    }
    setErrorMsg("");
  };

  const handleAdd = async () => {
    if (loading) return;
    if (errorMsg) return;
    setLoading(true);
    const params = {
      token_address: inputValue,
    };

    try {
      await fetcher(SystemEndPointPathMap.addToken + `?chain_id=${chainId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      onRefresh();
    } catch (err) {
      console.error("Error update:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DetailItem title={T("AddToken")} className={"mb-9 border-none p-0"}>
      <div className="relative flex w-full flex-col justify-center">
        <div className="flex flex-row">
          <Input
            data-state={errorMsg ? "error" : ""}
            ref={inputRef}
            type="text"
            value={inputValue || ""}
            placeholder={
              networkName === NetworkChainType.SOLANA ? "" : "0x11111111111"
            }
            onBlur={onBlur}
            onChange={(e) => onChange(e.target.value)}
            className="w-[400px] focus-visible:ring-0 data-[state=error]:border-destructive"
          />
          <button
            disabled={!isTokenAddress(inputValue, networkName)}
            onClick={handleAdd}
            className="ml-[10px] rounded-md border border-border-color bg-white px-3 text-sm font-bold text-title-color hover:bg-custom-bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {T("Save")}
          </button>
        </div>
        {errorMsg && (
          <div className="mt-2 text-sm text-destructive">{errorMsg}</div>
        )}
      </div>
    </DetailItem>
  );
}
