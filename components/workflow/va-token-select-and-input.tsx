import Input from "./components/input";
import { replaceStrNum } from "@/lib/hooks/use-str-num";
import { IToken } from "@/lib/types/token";
import { useContext, useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormItem } from "./components/form-item";
import { useGetVa } from "@/lib/hooks/use-get-va";
import { useGetSubVa } from "@/lib/hooks/use-get-sub-va";
import { TokenContext } from "@/lib/providers/token-provider";
import AmountTooltipDisplay from "./amount-tooltip-display";

export interface ITokenNumDesc {
  token: IToken | null;
  num: string;
  allowance: string | null;
}

export default function VaTokenSelectAndInput({
  label,
  tokens,
  token,
  tokenNum,
  handleTokenChange,
  handleTokenNumChange,
  vaName,
}: {
  label: string;
  tokens: Array<IToken>;
  token: IToken | null;
  tokenNum: string;
  handleTokenChange: (_t: IToken | null) => void;
  handleTokenNumChange: (_t: string) => void;
  vaName: string;
}) {
  const handleTokenSelect = (token: IToken | null) => {
    handleTokenChange(token);
  };

  const { gasToken } = useContext(TokenContext);

  const [num, setNum] = useState(tokenNum);
  const [debouncedNum] = useDebounce(num, 500);

  const { data: vaData } = useGetVa();

  const isGasToken = useMemo(() => {
    return token?.token_address === gasToken?.token_address;
  }, [token?.token_address, gasToken?.token_address]);

  const vaItem = useMemo(() => {
    return vaData?.find((item) => item.va_name === vaName);
  }, [vaData, vaName]);

  const { data: subVaData } = useGetSubVa({
    tokenAddr: token?.token_address || "",
    accounts: vaItem?.wallet_list || [],
  });

  const tokenBalance = useMemo(() => {
    if (!subVaData) return 0;

    if (isGasToken) {
      return subVaData?.reduce(
        (acc: number, curr: any) => acc + Number(curr.gas_token_amount),
        0,
      );
    } else {
      return subVaData.reduce(
        (acc: number, curr: any) => acc + Number(curr.quote_token_amount),
        0,
      );
    }
  }, [subVaData, token?.token_address]);

  useEffect(() => {
    setNum(tokenNum);
  }, [tokenNum]);

  useEffect(() => {
    handleTokenNumChange(debouncedNum);
  }, [debouncedNum]);

  const handleNumChange = (e: string) => {
    const reNum = replaceStrNum(e);
    setNum(reNum);
  };

  return (
    <div className="flex flex-1 flex-col">
      <FormItem title={label}>
        <Select
          value={token?.token_address}
          onValueChange={(e) =>
            handleTokenSelect(
              tokens.find((item) => item.token_address === e) || null,
            )
          }
        >
          <SelectTrigger className="h-[50px]">
            <SelectValue placeholder="">
              {token && (
                <div className="flex flex-col items-start">
                  <div className="flex items-center">
                    <span className="ml-1 text-xs text-[#333]">{token?.token_symbol}</span>
                  </div>
                  <AmountTooltipDisplay textClx="!text-base ml-1" amount={String(tokenBalance || 0)} />
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {(tokens || []).map((item) => (
              <SelectItem
                showIndicator={false}
                key={item.token_address}
                value={item.token_address}
              >
                <div className="flex items-center">
                  <span className="ml-1">{item.token_symbol}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-2 h-3 border-l border-border-color" />
        <Input
          value={num}
          onChange={handleNumChange}
          placeholder="0"
          type="number"
        />
      </FormItem>
    </div>
  );
}
