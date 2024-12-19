import { ArrowBigRight } from "lucide-react";
import TokenSelectAndInput, { ITokenNumDesc } from "./token-select-and-input";
import { useTokenSwap } from "@/lib/hooks/use-tokenswap";
import { useContext, useEffect, useMemo } from "react";
import { TokenContext } from "@/lib/providers/token-provider";

export default function SelectSwapToken({
  token0,
  token1,
  setToken0,
  setToken1,
  swapRouter,
}: {
  swapRouter: string;
  token0: ITokenNumDesc;
  token1: ITokenNumDesc;
  setToken0: (_t: ITokenNumDesc | any) => void;
  setToken1: (_t: ITokenNumDesc | any) => void;
}) {
  const { token: userToken, gasToken, stableToken } = useContext(TokenContext);

  const tokens = useMemo(() => {
    const ts = [];
    if (gasToken) {
      ts.push(gasToken);
    }
    if (userToken) {
      ts.push(userToken);
    }
    if (stableToken) {
      ts.push(stableToken);
    }
    return ts;
  }, [userToken, gasToken, stableToken]);

  useEffect(() => {
    if (gasToken && !token0.token) {
      setToken0((prev: ITokenNumDesc) => ({
        ...prev,
        token: gasToken,
      }));
    }
  }, [gasToken, token0.token, setToken0]);

  useEffect(() => {
    if (stableToken && !token1.token) {
      setToken1((prev: ITokenNumDesc) => ({
        ...prev,
        token: stableToken,
      }));
    }
  }, [stableToken, token1.token, setToken1]);

  const {
    handleToken0Change,
    handleToken0NumChange,
    handleToken1Change,
    handleToken1NumChange,
  } = useTokenSwap(swapRouter, token0, token1, setToken0, setToken1);

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
