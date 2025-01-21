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
    if (_v) return options.filter((item) => item[labelKey].includes(_v) || item[valueKey].includes(_v)) || []
  }, [value, options])


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
          {value
            ? options.find((item: Record<string, any>) => item[valueKey] === value)?.[labelKey]
            : <span className="text-[#707070]">{placeholder}</span>}
          <ChevronsUpDown className="opacity-50 font-normal" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <div className="rounded-md bg-white">
          <div className="p-1">
            <Input placeholder={searchPlaceholder} value={searchKey} onChange={(e) => setSearchKey(e.target.value)}/>
          </div>
    
          <div className="flex flex-col">
            {
              filterOptions?.length === 0 && (
                <div className="text-[#707070] p-1">什么都没有</div>
              )
            }
            {(filterOptions|| []).map((option: Record<string, any>) => (
              <div
                key={option[valueKey]}
                className={`flex cursor-pointer items-center h-10 pl-3 hover:bg-[#F6F7F8] text-[16px] align-items`}
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
