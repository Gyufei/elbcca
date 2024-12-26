
"use client";
import { useRef, useState } from "react";

import { Input } from "@/components/ui/input";

import { TokenItem, TokenTable } from "./token-table";
import useSWR from "swr";
import { SystemEndPointPathMap } from "@/lib/end-point";
import fetcher from "@/lib/fetcher";
import DetailItem from "../shared/detail-item";
import { HintTexts } from "@/lib/hint-texts";
import { isAddress } from "@/lib/utils";
import { useTranslations } from "next-intl";

export interface IAccountGas {
  account: string;
  gas: string;
  tx: number;
  index: number;
}

interface TokenListProps {
  chainId: string;
}
export default function TokenList({ chainId }: TokenListProps) {
  const {data: list,  mutate } = useSWR(SystemEndPointPathMap.getTokenList + `?chain_id=${chainId}`, fetcher);

  const onRefresh = () => {
    mutate()
  }
  return (
    <div className="flex flex-1 flex-col justify-stretch">
      <AddTokenTnput onRefresh={onRefresh} chainId={chainId}/>
      <TokenTable 
        list={list}
        onRefresh={onRefresh}
        chainId={chainId}
      />
     </div>
  );
}


function AddTokenTnput({ onRefresh, chainId }: { onRefresh: () => void; chainId: string;}) {
  const T = useTranslations("Common");
  const [errorMsg, setErrorMsg] = useState("");

  const [inputValue, setInputValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false)

  const onChange = (val: string) => {
    if (val && !isAddress(val)) {
      setErrorMsg(HintTexts.AddressError);
    } else {
      setErrorMsg("");
    }
    setInputValue(val);
  };

  const onBlur = () => {
    if (inputValue && !isAddress(inputValue)) {
      setErrorMsg(HintTexts.AddressError);
      return;
    }
    setErrorMsg("");
  };

  const handleAdd = async () => {
    if (loading) return;
    if (errorMsg) return;
    setLoading(true)
    const params = {
      token_address: inputValue,
    };

    try {
      await fetcher(SystemEndPointPathMap.addToken + `?chain_id=${chainId}`, {
        method: "POST",
        body: JSON.stringify(params),
      });
      onRefresh()
    } catch (err) {
        console.error('Error update:', err);
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <DetailItem title={"AddToken"} className={"border-none p-0 mb-9"}>
      <div className="relative flex w-full flex-col justify-center">
        <div className="flex flex-row">
          <Input
            data-state={errorMsg ? "error" : ""}
            ref={inputRef}
            type="text"
            value={inputValue || ""}
            placeholder="0x11111111111"
            onBlur={onBlur}
            onChange={(e) => onChange(e.target.value)}
            className="w-[400px] focus-visible:ring-0 data-[state=error]:border-destructive"
          />
          <button
            disabled={!isAddress(inputValue)}
            onClick={handleAdd}
            className="ml-[10px] rounded-md border border-border-color bg-white px-3 text-sm font-bold text-title-color hover:bg-custom-bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {T("Save")}
          </button>
        </div>
        {
          errorMsg && (
            <div className="mt-2 text-sm text-destructive">
              {errorMsg}
            </div>
          )
        }
    </div>
</DetailItem>
  )
}