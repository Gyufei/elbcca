import { ArrowUpRight } from "lucide-react";
import TruncateText from "../shared/trunc-text";
import { IToken } from "@/lib/types/token";
import { NoteBtnDialog } from "./note-btn-dialog";
import AmountTooltipDisplay from "./amount-tooltip-display";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function WalletRow({
  index,
  accData,
  handleClickAcc,
  isFilterGasToken,
  children,
  gasToken,
  token,
}: {
  index: number;
  accData: any;
  handleClickAcc: (addr: string) => void;
  isFilterGasToken: boolean;
  gasToken: IToken | undefined;
  token: IToken | undefined;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex h-[73px] items-center justify-between border-b bg-custom-bg-white p-3">
      <div className="flex flex-1 flex-col gap-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="pl-1 pr-5 text-left text-lg leading-none text-content-color">
              {index + 1}
            </div>
            <TruncateText text={accData.account}>
              <span
                className="ml-1 cursor-pointer text-lg font-medium text-title-color"
                onClick={() => handleClickAcc(accData.account)}
              >
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </TruncateText>
            <NonceFlag className="ml-4" nonce={accData.nonce} />
          </div>
          <NoteBtnDialog walletAddr={accData.account} />
        </div>
        <div className="LabelText flex">
          {children}
          <div className="mr-20 flex items-center gap-x-1">
            <span>{gasToken?.token_symbol}</span>
            <AmountTooltipDisplay amount={accData.gas_token_amount} />
          </div>

          {!isFilterGasToken && (
            <div className="flex items-center gap-x-1">
              <span>{token?.token_symbol}</span>
              <AmountTooltipDisplay amount={accData.quote_token_amount} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NonceFlag({
  className,
  nonce,
}: {
  className?: string;
  nonce: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center rounded border border-[#707070] bg-[#fff]",
        className,
      )}
    >
      <div className="flex h-5 w-5 items-center justify-center bg-[#707070]">
        <Image
          src="/icons/path-flag.svg"
          alt="path-flag"
          width={16}
          height={16}
        />
      </div>
      <div className="flex h-5 w-5 items-center justify-center text-xs text-[#707070]">
        {nonce}
      </div>
    </div>
  );
}
