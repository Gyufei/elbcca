import { useMemo, useState } from "react";
import Image from "next/image";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { replaceStrNum } from "@/lib/hooks/use-str-num";
import useIndexStore from "@/lib/state";
import { useTranslations } from "next-intl";

export function GasPrice() {
  const T = useTranslations("Common");
  const isAvgGas = useIndexStore((state) => state.isAvgGas);
  const setIsAvgGas = useIndexStore((state) => state.setIsAvgGas);
  const gasValue = useIndexStore((state) => state.gasValue);
  const setGasValue = useIndexStore((state) => state.setGasValue);

  return (
    <div className="flex flex-1 flex-col rounded-md border border-[#bfbfbf] p-3">
      <div className="LabelText">{T("GasPrice")}</div>
      <BaseDialog
        isAvgGas={isAvgGas}
        setIsAvgGas={setIsAvgGas}
        gasValue={gasValue}
        setGasValue={setGasValue}
      />
    </div>
  );
}

function BaseDialog(props: {
  isAvgGas: boolean;
  setIsAvgGas: (val: boolean) => void;
  gasValue: string;
  setGasValue: (val: string) => void;
}) {
  const T = useTranslations("Common");
  const [open, setOpen] = useState(false);
  const [isAvgGas, setIsAvgGas] = useState(props.isAvgGas);
  const [gasValue, setGasValue] = useState(props.gasValue);

  const handleConfirm = () => {
    props.setIsAvgGas(isAvgGas);
    props.setGasValue(gasValue);
    setOpen(false);
  };

  const handleGasValueChange = (val: string) => {
    let newV = replaceStrNum(val);

    if (Number(newV) < 0) {
      newV = "0";
    }

    setGasValue(newV);
  };

  const nowShowText = useMemo(() => {
    if (props.isAvgGas) return "Online Average";
    if (!props.gasValue) return "";

    return `Max:${props.gasValue} Gwei`;
  }, [props]);

  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogTrigger asChild>
        <div className="flex items-center">
          <span className="mr-1 whitespace-nowrap text-lg text-[#333]">
            {nowShowText}
          </span>
          <Image
            className="cursor-pointer"
            src="/icons/edit.svg"
            width={20}
            height={20}
            alt="edit"
          />
        </div>
      </DialogTrigger>
      <DialogContent
        title={T("GasPriceThreshold")}
        className="w-[320px]"
        showClose={T("Cancel")}
      >
        <div className="flex flex-col gap-y-[10px] px-4">
          <div className="flex items-center">
            <Checkbox
              checked={isAvgGas}
              onCheckedChange={() => setIsAvgGas(!isAvgGas)}
              id="online"
            />
            <label className="LabelText ml-2 cursor-pointer" htmlFor="online">
              {T("OnchainAverage")}
            </label>
          </div>

          {!isAvgGas && (
            <>
              <div className="flex items-center">
                <div className="h-[1px] flex-1 bg-[#99999966]" />
                <div className="LabelText mx-1">{T("OR")}</div>
                <div className="h-[1px] flex-1 bg-[#99999966]" />
              </div>

              <div>
                <div className="LabelText mb-1">{T("CustomizeMaxValue")}</div>
                <div className="flex items-center justify-between">
                  <Input
                    value={gasValue}
                    onChange={(e) => handleGasValueChange(e.target.value)}
                    className="flex-1 rounded-md border-border-color"
                    placeholder="0"
                  />
                </div>
              </div>
            </>
          )}

          <Button
            disabled={!isAvgGas && !gasValue}
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
