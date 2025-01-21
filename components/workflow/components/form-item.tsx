import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import useSWR from "swr";
import { setHours, setMinutes, setSeconds, addDays, subDays } from "date-fns";
import { DatePicker } from "@mui/x-date-pickers";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Empty from "@/components/shared/empty";
import LoadingIcon from "@/components/shared/loading-icon";
import SwapHistoryItem from "./swap-history-item";

import { ITask } from "@/lib/types/task";
import fetcher from "@/lib/fetcher";
import useIndexStore from "@/lib/state";
import { useParseTasks } from "@/lib/hooks/use-parse-task";
import { useTranslations } from "next-intl";
import { NetworkContext } from "@/lib/providers/network-provider";
import { replaceStrNum, replaceStrNumNoDecimal } from "@/lib/hooks/use-str-num";

type FormItemProps = {
  className?: string;
  title: React.ReactNode;
  children: React.ReactNode;
}
export const FormItem = ({
 title,
 children,
 className = ''
}: FormItemProps) => {
  return (
    <div className={`col mt-3 flex flex-col ${className}`}>
      <div className="LabelText mb-1">{title}</div>
      {children}
    </div>
  )
}
