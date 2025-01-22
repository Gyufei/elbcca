import Image from "next/image";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo } from "react";

type BasicSelectProps = {
  labelKey?: string;
  valueKey?: string;
  options: Record<string, any>[];
  value:  Record<string, any> | string | null;
  onChange: (v: Record<string, any> | string|undefined) => void;
  placeholder?: string;
  labelInValue?: boolean;
}

export default function BasicSelect({
  labelKey = 'label',
  valueKey = 'value',
  options = [],
  value = null,
  onChange,
  placeholder = '',
  labelInValue = false
}: BasicSelectProps) {
  const handleSelect = (v: string) => {
    if (labelInValue) {
      const op = options.find((item: Record<string, any>) => item[valueKey] === v);
      if (op) onChange({ ...op });
      return;
    }
    onChange(v);
  };

  const selectedOp = useMemo(() => {
    if (labelInValue) return value;
    if (!value) return null;
    return options.find((item: Record<string, any>) => item[valueKey] === value)
  }, [value, options, labelInValue]);

  return (
    <Select value={(value as Record<string, any>)?.[valueKey] || value} onValueChange={(e) => handleSelect(e)}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder}>
          {value && (
            <div className="flex items-center">
              {(selectedOp as Record<string, any>)?.['logo'] && (<Image src={(selectedOp as Record<string, any>)?.['logo']} width={20} height={20} alt="logo" />)}
              <span className="ml-1">{(selectedOp as Record<string, any>)?.[labelKey]}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {(options || []).map((item) => (
          <SelectItem showIndicator={false} key={item[labelKey]} value={item[valueKey]}>
            <div className="flex items-center">
              {item['logo'] && (<Image src={item['logo']} width={20} height={20} alt="logo" />)}
              <span className="ml-1">{item[labelKey]}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
