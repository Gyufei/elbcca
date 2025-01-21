import Input from "./components/input";
import { replaceStrNum } from "@/lib/hooks/use-str-num";
import { IToken } from "@/lib/types/token";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import Select from "./components/select";
import { FormItem } from "./components/form-item";

export interface ITokenNumDesc {
  token: IToken | null;
  num: string;
  allowance: string | null;
}

export default function TokenSelectAndInput({
  label,
  tokens,
  token,
  tokenNum,
  handleTokenChange,
  handleTokenNumChange,
}: {
  label: string;
  tokens: Array<IToken>;
  token: IToken | null;
  tokenNum: string;
  handleTokenChange: (_t: IToken | null) => void;
  handleTokenNumChange: (_t: string) => void;
}) {
  const handleTokenSelect = (token: IToken | null) => {
    handleTokenChange(token);
  };

  const [num, setNum] = useState(tokenNum);
  const [debouncedNum] = useDebounce(num, 500);

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
          labelInValue
          options={tokens}
          valueKey={'token_address'}
          labelKey={'token_symbol'}
          value={token}
          onChange={(e) => handleTokenSelect(e as IToken)}
        />
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
