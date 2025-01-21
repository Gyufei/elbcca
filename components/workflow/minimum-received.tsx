import { FormItem } from "./components/form-item";
import { useTranslations } from "next-intl";
import Input from "./components/input";
import { IToken } from "@/lib/types/token";
import { MinimumTip } from "./minimum-tip";

export default function MinimumReceived({
  value,
  onChange,
  maxMinimum,
  tokenInfo 
}: {
  value: string | null;
  onChange: (_t: string | null) => void;
  maxMinimum: number;
  tokenInfo: {
    token0: IToken | null;
    token1: IToken | null;
    token0Num: string;
    token1Num: string;
  }
  
}) {
   const T = useTranslations("Common");
   const {
    token0,
    token1,
    token0Num,
    token1Num
   } = tokenInfo || {};
  
  return (
    <FormItem title={T("MinimumReceived")} className="w-[45%]">
      <div className="relative">
        <Input
          placeholder={(maxMinimum || "0") + ""}
          value={value || ""}
          type={"number"}
          onChange={onChange}
        />
        <MinimumTip
          token0={token0}
          token1={token1}
          token0Num={token0Num}
          token1Num={token1Num}
        />
      </div>
    </FormItem>
  );
}
