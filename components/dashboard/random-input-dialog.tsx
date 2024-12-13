import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import CandleOpRow from "./candle-op-row";
import { replaceStrNum } from "@/lib/hooks/use-str-num";
import RandomInput from "./random-input";
import { useTranslations } from "next-intl";

export default function RandomInputDialog(props: {
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
      props.setAccValue("0");
    } else {
      props.setMinValue("0");
      props.setMaxValue("0");
      props.setAccValue(accValue);
    }
    setOpen(false);
  };

  const handleAccValueChange = (val: string) => {
    let newV = replaceStrNum(val);

    if (Number(newV) > 10000) {
      newV = "10000";
    }

    setAccValue(newV);
  };

  const handleMinValueChange = (val: string) => {
    let newV = replaceStrNum(val);

    if (Number(newV) < 0) {
      newV = "0";
    }
    if (Number(newV) > 10000) {
      newV = "10000";
    }

    setMinValue(newV);
  };

  const handleMaxValueChange = (val: string) => {
    let newV = replaceStrNum(val);

    if (Number(newV) > 10000) {
      newV = "10000";
    }

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
      const accPercent = Number(props.accValue) / 100;
      return `${accPercent}%`;
    } else {
      if (!props.minValue || !props.maxValue) return "";
      const minPercent = Number(props.minValue) / 100;
      const maxPercent = Number(props.maxValue) / 100;

      return `${minPercent}%~${maxPercent}%`;
    }
  }, [props]);

  const btnDisabled =
    (isRandom && (!minValue || !maxValue)) || (!isRandom && !accValue);

  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogTrigger>
        <CandleOpRow text={nowShowText} />
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
