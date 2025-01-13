

import { useContext } from "react";
import { useTranslations } from "next-intl";
import { NetworkContext } from "@/lib/providers/network-provider";
import { NetworkChainType } from "@/lib/types/network";
import { IAdvanceOptions } from "./op-advance-options";
import numbro from "numbro";
import { useGasPrice } from "@/lib/hooks/use-gas-price";
import { usePriorityFee } from "@/lib/hooks/use-priorityFee";



export function TransferMax({
  advanceOptions,
  gasBalance,
  handleTransferAmountChange
}: {
  gasBalance: number | null;
  advanceOptions: IAdvanceOptions;
  handleTransferAmountChange: (v: string) => void;
}) {
  const T = useTranslations("Common");
  const { data: gasPrice } = useGasPrice();
  const { data: priorityFee } = usePriorityFee();

  const { networkName } = useContext(NetworkContext);
  return (
    <div 
      className="cursor-pointer absolute leading-[40px] top-0 right-[12px] text-[#0572EC] font-base"
      onClick={() => {
        if (networkName === NetworkChainType.SOLANA) {
          const pf = advanceOptions?.priority_fee ? advanceOptions.priority_fee : priorityFee;
          if (!gasBalance || !pf) return;
          const pfFee = ( 540 * Number(pf)) / 10 ** 15;
          handleTransferAmountChange(
            numbro((Number(gasBalance) - pfFee)).format({
              mantissa: 18,
            })
          )
        } else {
          const gp = advanceOptions?.gas ? advanceOptions.gas : gasPrice;
          if (!gasBalance || !gp) return;
          const gaslimit = 21000;
          const gasFee = (gaslimit * Number(gp)) / 10 ** 9;
          handleTransferAmountChange(
            numbro((Number(gasBalance) - gasFee)).format({
              mantissa: 18,
            })
          )
        }
      }}
    >
      {T("TransferMAX")}
    </div> 
  )
}
