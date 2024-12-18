
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

const list: TokenItem[] = [
  {
      symbol: "BTC",
      name: "Bitcoin",
      address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      index: 0
  },
  {
      symbol: "ETH",
      name: "Ethereum",
      address: "0x5AEDA5626294BE852C00FD6603ESCUE263D37B1f",
      index: 1
  },
  {
      symbol: "USDT",
      name: "Tether",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      index: 2
  },
  {
      symbol: "BNB",
      name: "Binance Coin",
      address: "bnb1y7t6d8lq8xv46w35mzjg8c66xk54j89h86x74s",
      index: 3
  },
  {
      symbol: "ADA",
      name: "Cardano",
      address: "addr1q9p84r79q9r8q9r8q9r8q9r8q9r8q9r8q9r8q9",
      index: 4
  }
];

export default function TokenList() {
  const {data,  mutate } = useSWR(SystemEndPointPathMap.allPages, fetcher);

  const onRefresh = () => {
    mutate()
  }
  return (
    <div className="flex flex-1 flex-col justify-stretch">
      <AddTokenTnput onRefresh={onRefresh} />
      <TokenTable 
        list={list}
        onRefresh={onRefresh}
      />
     </div>
  );
}


function AddTokenTnput({ onRefresh }: { onRefresh: () => void}) {
  const T = useTranslations("Common");
  const [errorMsg, setErrorMsg] = useState("");

  const [inputValue, setInputValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false)

  const onChange = (val: string) => {
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
      address: inputValue,
    };

    try {
      await fetcher(SystemEndPointPathMap.keyStoreAddPage, {
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