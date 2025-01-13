import { ArrowBigRight } from "lucide-react";
import TokenSelectAndInput, { ITokenNumDesc } from "./token-select-and-input";
import { useTokenSwap } from "@/lib/hooks/use-tokenswap";
import { useContext, useEffect } from "react";
import { TokenContext } from "@/lib/providers/token-provider";
import { IToken } from "@/lib/types/token";

function hasToken(list: IToken[], token: IToken | null): boolean {
  if (!token) return false;
  return list.findIndex((item) => {
    return item.token_address === token?.token_address && item.token_symbol === token?.token_symbol
  }) > -1;

}
export default function SelectSwapToken({
  token0,
  token1,
  setToken0,
  setToken1,
  routing,
  setSpender
}: {
  routing: string;
  token0: ITokenNumDesc;
  token1: ITokenNumDesc;
  setToken0: (_t: ITokenNumDesc | any) => void;
  setToken1: (_t: ITokenNumDesc | any) => void;
  setSpender: (_t: string) => void
}) {
  const { tokens } = useContext(TokenContext);
  useEffect(() => {
    if (tokens?.[0] && !hasToken(tokens, token0?.token)) {
      setToken0((prev: ITokenNumDesc) => ({
        ...prev,
        token: {
          ...tokens?.[0]
        },
      }));
    }
  }, [tokens, token0.token, setToken0]);

  useEffect(() => {
    if (tokens?.[1] && !hasToken(tokens, token1?.token)) {
      setToken1((prev: ITokenNumDesc) => ({
        ...prev,
        token: {
          ...tokens?.[1]
        },
      }));
    }
  }, [tokens, token1.token, setToken1]);

  const {
    handleToken0Change,
    handleToken0NumChange,
    handleToken1Change,
    handleToken1NumChange,
  } = useTokenSwap(routing, token0, token1, setToken0, setToken1, setSpender);

  return (
    <div className="mt-3 flex items-center justify-between px-3">
      <TokenSelectAndInput
        label="Token0"
        tokens={tokens}
        token={token0.token}
        tokenNum={token0.num}
        handleTokenChange={handleToken0Change}
        handleTokenNumChange={handleToken0NumChange}
      />
      <ArrowBigRight
        className="mx-1 mt-1 h-5 w-5 text-[#7d8998]"
        style={{
          transform: "translateY(10px)",
        }}
      />
      <TokenSelectAndInput
        label="Token1"
        tokens={tokens}
        token={token1.token}
        tokenNum={token1.num}
        handleTokenChange={handleToken1Change}
        handleTokenNumChange={handleToken1NumChange}
      />
    </div>
  );
}
