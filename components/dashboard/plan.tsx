import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  IUpDownValue,
  UpDownLabelOptions,
} from "@/lib/constants/dashboard-const";
import useIndexStore from "@/lib/state";
import { Label } from "../ui/label";
import Candle from "./candle";
import RandomBtnDialog from "./random-btn-dialog";
import TradingTx from "./trading-tx";
import TradingVol from "./trading-vol";
import { useTranslations } from "next-intl";

export default function Plan() {
  const T = useTranslations("Common");
  const upOrDown = useIndexStore((state) => state.upOrDown);
  const setUpOrDown = useIndexStore((state) => state.setUpOrDown);

  return (
    <div className="mb-[17px]">
      <div className="LabelText mb-1">{T("Plan")}</div>
      <div className="flex gap-x-3">
        <div className="w-[182px] rounded-md border border-[#bfbfbf] bg-[#f6f7f8] p-3">
          <LabelRadio
            options={UpDownLabelOptions}
            value={upOrDown}
            onChange={setUpOrDown}
          />
          <div className="mt-4 flex">
            <Candle up={upOrDown === UpDownLabelOptions[0]} />
            <div className="ml-5 flex flex-col justify-between">
              <RandomBtnDialog up="top" />
              <RandomBtnDialog up="mid" />
              <RandomBtnDialog up="bottom" />
            </div>
          </div>
        </div>

        <div className="flex w-[182px] flex-col items-stretch gap-y-3">
          <TradingVol />
          <TradingTx />
        </div>
      </div>
    </div>
  );
}

function LabelRadio({
  options,
  value,
  onChange,
}: {
  options: typeof UpDownLabelOptions;
  value: IUpDownValue;
  onChange: (value: IUpDownValue) => void;
}) {
  const T = useTranslations("Common");
  return (
    <RadioGroup
      className="flex items-center"
      value={value}
      onValueChange={onChange}
    >
      {options.map((opt) => (
        <div key={opt} className="flex items-center space-x-2">
          <RadioGroupItem className="h-[14px] w-[14px]" value={opt} id={opt} />
          <Label htmlFor={opt} className="text-sm text-[#333]">
            {T(opt)}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
