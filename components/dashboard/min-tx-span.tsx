import Image from "next/image";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useMemo, useState } from "react";
import useIndexStore from "@/lib/state";
import { replaceStrNum } from "@/lib/hooks/use-str-num";
import { TxSpanUnitOptions } from "@/lib/constants/dashboard-const";
import { useTranslations } from "next-intl";

export function MinTxSpan() {
  const T = useTranslations("Common");
  const minTxSpanValue = useIndexStore((state) => state.minTxSpanValue);
  const minTxSpanUnit = useIndexStore((state) => state.minTxSpanUnit);
  const setMinTxSpanValue = useIndexStore((state) => state.setMinTxSpanValue);
  const setMinTxSpanUnit = useIndexStore((state) => state.setMinTxSpanUnit);

  return (
    <div className="flex flex-1 flex-col rounded-md border border-[#bfbfbf] p-3">
      <div className="LabelText">{T("MinTxSpan")}</div>
      <BaseDialog
        minTxSpanValue={minTxSpanValue}
        minTxSpanUnit={minTxSpanUnit}
        setMinTxSpanValue={setMinTxSpanValue}
        setMinTxSpanUnit={setMinTxSpanUnit}
      />
    </div>
  );
}

function BaseDialog(props: {
  minTxSpanValue: string;
  setMinTxSpanValue: (val: string) => void;
  minTxSpanUnit: string;
  setMinTxSpanUnit: (val: string) => void;
}) {
  const T = useTranslations("Common");
  const [open, setOpen] = useState(false);
  const [minTxSpanValue, setMinTxSpanValue] = useState(props.minTxSpanValue);
  const [minTxSpanUnit, setMinTxSpanUnit] = useState(props.minTxSpanUnit);

  const handleConfirm = () => {
    props.setMinTxSpanValue(minTxSpanValue);
    props.setMinTxSpanUnit(minTxSpanUnit);
    setOpen(false);
  };

  const handleSpanChange = (val: string) => {
    let newV = replaceStrNum(val);

    if (Number(newV) < 0) {
      newV = "0";
    }

    setMinTxSpanValue(newV);
  };

  const nowShowText = useMemo(() => {
    const value = props.minTxSpanValue;
    if (!value) return "";

    const label = TxSpanUnitOptions.find(
      (unit) => String(unit.value) === props.minTxSpanUnit,
    )?.label;

    return `${props.minTxSpanValue} ${label}`;
  }, [props]);

  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogTrigger asChild>
        <div className="flex items-center outline-none">
          <span className="mr-1 h-7 text-lg text-[#333]">{nowShowText}</span>
          <Image
            className="cursor-pointer"
            src="/icons/edit.svg"
            width={20}
            height={20}
            alt="edit"
          />
        </div>
      </DialogTrigger>
      <DialogContent title={T("MinTxSpan")} className="w-[320px]" showClose={T("Cancel")}>
        <div className="flex flex-col gap-y-[10px] px-4">
          <div className="flex w-[280px] items-center justify-between gap-3">
            <Input
              value={minTxSpanValue}
              onChange={(e) => handleSpanChange(e.target.value)}
              className="w-[188px] flex-1 rounded-md border-border-color"
              placeholder="0"
            />
            <Select
              value={minTxSpanUnit}
              onValueChange={(e) => setMinTxSpanUnit(e)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select span"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                {TxSpanUnitOptions.map((unit) => (
                  <SelectItem key={unit.value} value={String(unit.value)}>
                    <span>{unit.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            disabled={!minTxSpanValue || !minTxSpanUnit}
            onClick={handleConfirm}
            className="mt-[10px] w-full rounded-full bg-primary text-white disabled:border disabled:border-[#bfbfbf] disabled:bg-[#F6F7F8] disabled:text-[#999]"
          >
            {T("Confirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
