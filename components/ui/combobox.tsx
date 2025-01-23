"use client"

import React, { useState, useMemo } from "react"
import { ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "./input"
import Empty from "../shared/empty"

type ComboboxProps = {
  labelKey?: string;
  valueKey?: string;
  options: Record<string, any>[];
  value:  Record<string, any> | string | null;
  onChange: (v: Record<string, any> | string| undefined) => void;
  placeholder?: string;
  labelInValue?: boolean;
  searchPlaceholder?: string;
  className?: string;
}
export function Combobox({
  labelKey = 'label',
  valueKey = 'value',
  options = [],
  value = null,
  placeholder = '',
  searchPlaceholder = '搜索',
  labelInValue,
  className = '',
  onChange
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [searchKey, setSearchKey] = useState("");

  const filterOptions = useMemo(() => {
    const _v = (searchKey || "").trim();
    if (!_v || _v === '') return options || [];
    // || item[valueKey].includes(_v)
    if (_v) return options.filter((item) => item[labelKey].includes(_v)) || []
  }, [searchKey, options])

  const selectedOp = useMemo(() => {
    if (labelInValue) return value as Record<string, any>;
    if (!value) return null;
    return options.find((item: Record<string, any>) => item[valueKey] === value)
  }, [value, options, labelInValue]);


  const handleSelect = (v: string) => {
    setOpen(false);
    if (labelInValue) {
      const op = options.find((item: Record<string, any>) => item[valueKey] === v);
      onChange(op);
      return;
    }
    onChange(v);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`justify-between ${className}`}
          onClick={() => setOpen(!open)}
        >
          {selectedOp
            ? selectedOp?.[labelKey]
            : <span className="text-[#707070]">{placeholder}</span>}
          <ChevronsUpDown className="opacity-50 font-normal" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0">
        <div className="rounded-md bg-white">
          <div className="p-1">
            <Input placeholder={searchPlaceholder} value={searchKey} onChange={(e) => setSearchKey(e.target.value)}/>
          </div>
    
          <div className="flex flex-col max-h-[200px] overflow-y-auto">
            {
              filterOptions?.length === 0 && (
                <div className="pb-8"><Empty /></div>
              )
            }
            {(filterOptions|| []).map((option: Record<string, any>) => (
              <div
                key={option[valueKey]}
                className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50`}
                onClick={() => handleSelect(option[valueKey])}
              >
                {option[labelKey]}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
