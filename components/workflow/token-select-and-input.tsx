import TokenSelect from "@/components/workflow/token-select";
import { Input } from "@/components/ui/input";
import { replaceStrNum } from "@/lib/hooks/use-str-num";
import { IToken } from "@/lib/types/token";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

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
      <div className="LabelText mb-1">{label}</div>
      <TokenSelect
        tokens={tokens}
        token={token}
        handleTokenSelect={(e) => handleTokenSelect(e)}
      />
      <div className="ml-2 h-3 border-l border-border-color" />
      <Input
        value={num}
        onChange={(e) => handleNumChange(e.target.value)}
        className="rounded-md border-border-color"
        placeholder="0"
      />
    </div>
  );
}
