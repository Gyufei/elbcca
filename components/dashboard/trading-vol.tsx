import Image from "next/image";
import numbro from "numbro";

import { useMemo, useState } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { replaceStrNum } from "@/lib/hooks/use-str-num";
import useIndexStore from "@/lib/state";
import RandomInput from "./random-input";
import { useTranslations } from "next-intl";

export default function TradingVol() {
  const T = useTranslations("Common");
  const totalTradingRandom = useIndexStore((state) => state.totalTradingRandom);
  const totalTradingVolumeAcc = useIndexStore(
    (state) => state.totalTradingVolumeAcc,
  );
  const totalTradingVolumeMax = useIndexStore(
    (state) => state.totalTradingVolumeMax,
  );
  const totalTradingVolumeMin = useIndexStore(
    (state) => state.totalTradingVolumeMin,
  );
  const setTotalTradingRandom = useIndexStore(
    (state) => state.setTotalTradingRandom,
  );
  const setTotalTradingVolumeAcc = useIndexStore(
    (state) => state.setTotalTradingVolumeAcc,
  );
  const setTotalTradingVolumeMax = useIndexStore(
    (state) => state.setTotalTradingVolumeMax,
  );
  const setTotalTradingVolumeMin = useIndexStore(
    (state) => state.setTotalTradingVolumeMin,
  );

  return (
    <div className="flex flex-col rounded-md border border-[#bfbfbf]  bg-[#f6f7f8] p-3">
      <div className="LabelText">{T("TotalTradingVol")}</div>
      <VolDialog
        isRandom={totalTradingRandom}
        accValue={totalTradingVolumeAcc}
        minValue={totalTradingVolumeMin}
        maxValue={totalTradingVolumeMax}
        setIsRandom={setTotalTradingRandom}
        setMinValue={setTotalTradingVolumeMin}
        setAccValue={setTotalTradingVolumeAcc}
        setMaxValue={setTotalTradingVolumeMax}
      />
    </div>
  );
}

function VolDialog(props: {
  isRandom: boolean;
  accValue: string;
  minValue: string;
  maxValue: string;
  setIsRandom: (val: boolean) => void;
  setMinValue: (val: string) => void;
  setAccValue: (val: string) => void;
  setMaxValue: (val: string) => void;
}) {
  const T = useTranslations("Common");
  const [open, setOpen] = useState(false);
  const [isRandom, setIsRandom] = useState(props.isRandom);
  const [minValue, setMinValue] = useState(props.minValue);
  const [maxValue, setMaxValue] = useState(props.maxValue);
  const [accValue, setAccValue] = useState(props.accValue);

  const handleConfirm = () => {
    props.setIsRandom(isRandom);
    if (isRandom) {
      props.setMinValue(minValue);
      props.setMaxValue(maxValue);
      props.setAccValue("");
    } else {
      props.setMinValue("");
      props.setMaxValue("");
      props.setAccValue(accValue);
    }
    setOpen(false);
  };

  const handleAccValueChange = (val: string) => {
    let newV = replaceStrNum(val);

    if (Number(newV) > 100) {
      newV = "100";
    }

    setAccValue(newV);
  };

  const handleMinValueChange = (val: string) => {
    const newV = replaceStrNum(val);

    setMinValue(newV);
  };

  const handleMaxValueChange = (val: string) => {
    const newV = replaceStrNum(val);

    setMaxValue(newV);
  };

  const handleMinBlur = () => {
    if (!maxValue || !minValue) return;
    if (Number(minValue) > Number(maxValue)) {
      setMinValue(maxValue);
    }
  };

  const handleMaxBlur = () => {
    if (!maxValue || !minValue) return;
    if (Number(maxValue) < Number(minValue)) {
      setMaxValue(minValue);
    }
  };

  const nowShowText = useMemo(() => {
    if (!props.isRandom) {
      if (!props.accValue) return "";

      const display = numbro(props.accValue).format({
        thousandSeparated: true,
      });
      return display;
    } else {
      const min = props.minValue
        ? numbro(props.minValue || "").format({
            thousandSeparated: true,
          })
        : "";
      const max = props.maxValue
        ? numbro(props.maxValue || "").format({
            thousandSeparated: true,
          })
        : "";

      if (!min && !max) return "";
      return `${min}~${max}`;
    }
  }, [props]);

  const btnDisabled =
    (isRandom && (!minValue || !maxValue)) || (!isRandom && !accValue);

  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogTrigger>
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
      <DialogContent title={T("Title")} className="w-[320px]" showClose={T("Cancel")}>
        <RandomInput
          isRandom={isRandom}
          accValue={accValue}
          minValue={minValue}
          maxValue={maxValue}
          setIsRandom={setIsRandom}
          setMinValue={handleMinValueChange}
          handleMinBlur={handleMinBlur}
          setAccValue={handleAccValueChange}
          setMaxValue={handleMaxValueChange}
          handleMaxBlur={handleMaxBlur}
          btnDisabled={btnDisabled}
          onConfirm={handleConfirm}
        />
      </DialogContent>
    </Dialog>
  );
}
