"use client";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import de from 'date-fns/locale/de';
import zhCN from 'date-fns/locale/zh-CN';
import { useLocale } from "next-intl";
import { useMemo } from "react";

export default function MuiPickerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const local = useLocale();
  const type = useMemo(() => {
    return local === 'zh' ? zhCN : de
  }, [local])

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={type}>
      {children}
    </LocalizationProvider>
  );
}
