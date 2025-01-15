import { useState } from "react";

export function replaceStrNum(str: string) {
  return str.replace(/[^0-9.]|(?<=\..*)\./g, "");
}

export function replaceStrNumNoDecimal(str: string) {
  return str.replace(/[^0-9]/g, "");
}

export const useStrNum = (
  defaultVal?: string,
  noDecimals?: boolean,
): [string | undefined, (_val: string) => void] => {
  const [numVal, setNumVal] = useState(defaultVal);

  const handleChange = (val: string | null) => {
    if (!val) {
      setNumVal(undefined);
      return;
    }

    val = noDecimals ? replaceStrNumNoDecimal(val) : replaceStrNum(val);

    setNumVal(val);
    return val;
  };

  return [numVal, handleChange];
};
