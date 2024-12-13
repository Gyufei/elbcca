import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function RandomInput({
  isRandom,
  accValue,
  minValue,
  maxValue,
  setIsRandom,
  setMinValue,
  handleMinBlur,
  setAccValue,
  setMaxValue,
  handleMaxBlur,
  btnDisabled,
  onConfirm,
}: {
  isRandom: boolean;
  accValue: string;
  minValue: string;
  maxValue: string;
  setIsRandom: (val: boolean) => void;
  setMinValue: (val: string) => void;
  setAccValue: (val: string) => void;
  setMaxValue: (val: string) => void;
  handleMinBlur: () => void;
  handleMaxBlur: () => void;
  btnDisabled: boolean;
  onConfirm: () => void;
}) {
  const T = useTranslations("Common");
  return (
    <div className="flex flex-col gap-y-[10px] px-4">
      <div className="flex items-center">
        <Checkbox
          checked={isRandom}
          onCheckedChange={() => setIsRandom(!isRandom)}
          id="random"
        />
        <label className="LabelText ml-2 cursor-pointer" htmlFor="random">
          {T("Random")}
        </label>
      </div>

      <div className="flex items-center">
        <div className="h-[1px] flex-1 bg-[#99999966]" />
      </div>

      {isRandom ? (
        <div>
          <div className="LabelText mb-1">{T("Value")}</div>
          <div className="flex items-center justify-between">
            <Input
              value={minValue}
              onChange={(e) => setMinValue(e.target.value)}
              onBlur={handleMinBlur}
              className="flex-1 rounded-md border-border-color"
              placeholder="0"
            />
            <span className="LabelText mx-1">-</span>
            <Input
              value={maxValue}
              onChange={(e) => setMaxValue(e.target.value)}
              onBlur={handleMaxBlur}
              className="flex-1 rounded-md border-border-color"
              placeholder="0"
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="LabelText mb-1">Value</div>
          <div className="flex items-center justify-between">
            <Input
              value={accValue}
              onChange={(e) => setAccValue(e.target.value)}
              className="flex-1 rounded-md border-border-color"
              placeholder="0"
            />
          </div>
        </div>
      )}

      <Button
        disabled={btnDisabled}
        onClick={onConfirm}
        className="mt-[10px] w-full rounded-full bg-primary text-white disabled:border disabled:border-[#bfbfbf] disabled:bg-[#F6F7F8] disabled:text-[#999]"
      >
        {T("Confirm")}
      </Button>
    </div>
  );
}
