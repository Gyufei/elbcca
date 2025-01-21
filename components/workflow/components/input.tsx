
import { Input } from "@/components/ui/input";

import { replaceStrNum, replaceStrNumNoDecimal } from "@/lib/hooks/use-str-num";

type BasicInputProps = {
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "number";
  noDecimals?: boolean;
  onKeyDown?: (e: any) => void;
}
export default  function BasicInput({
  value,
  onChange = (v: string) => {},
  placeholder = "",
  type =  "text",
  noDecimals = false,
  onKeyDown = () => {}
}: BasicInputProps) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (type === "number") {
      if (val) {
        val = noDecimals ? replaceStrNumNoDecimal(val) : replaceStrNum(val);
      }
     
      onChange(val);
      return;
    }
    onChange(val);
  };
  return (
    <Input
      value={value}
      onChange={handleChange}
      className="rounded-md border-border-color"
      placeholder={placeholder}
      onKeyDown={onKeyDown}
    /> 
  )
}
