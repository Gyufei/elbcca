import { useContext, useMemo, useState } from "react";
import { ChevronDownCircle } from "lucide-react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Input from "./components/input";
import UnlockIcon from "@/components/icons/unlock";
import LockIcon from "@/components/icons/lock";
import NoCheckIcon from "@/components/icons/noCheck";
import { replaceStrNum, replaceStrNumNoDecimal } from "@/lib/hooks/use-str-num";
import { subMinutes } from "date-fns";
import { useGasPrice } from "@/lib/hooks/use-gas-price";
import { useNonce } from "@/lib/hooks/use-nonce";
import useIndexStore from "@/lib/state";
import useEffectStore from "@/lib/state/use-store";
import { useTranslations } from "next-intl";
import { NetworkContext } from "@/lib/providers/network-provider";
import RoutingSelect from "./select-routing";
import { NetworkChainType } from "@/lib/types/network";
import { MinimumTip } from "./minimum-tip";
import { ITokenNumDesc } from "./token-select-and-input";
import { usePriorityFee } from "@/lib/hooks/use-priorityFee";
import { FormItem } from "./components/form-item";
import Select from "./components/select";
import { routing } from "i18n/routing";
import { pick } from "lodash";
import MinimumReceived from "./minimum-received";
import { networkAdvanceKeysMap } from "@/lib/constants/network-config";

export interface IAdvanceOptions {
  schedule: string | null;
  timeout: number | null;
  slippage: string | null;
  nonce?: number | null;
  gas: number | null;
  fixed_gas: boolean;
  no_check_gas: boolean;
  routing: string | null;
  minimum_received: string | null;
  priority_fee: number | null;
}


export function minimumValueTrans(v: string | null, maxV: string): string {
  return (v &&  Number(v) > Number(maxV))? (maxV + "") : v || "";
}

export default function OpAdvanceOptions({
  params,
  routings = [],
  options,
  onAdvanceOptionsChange,
  maxMinimum,
  fromAddress
}: {
  params: Record<string, any>;
  options: IAdvanceOptions;
  routings: Array<Record<string, any>>;
  onAdvanceOptionsChange: (_o: IAdvanceOptions) => void;
  maxMinimum: number;
  fromAddress: string;
}) {
  const { networkName } = useContext(NetworkContext);
  const advanceShowKey = networkAdvanceKeysMap[networkName as NetworkChainType] || [];

  const T = useTranslations("Common");
  const { data: gasPrice } = useGasPrice();
  const { data: priorityFee } = usePriorityFee();
  const { data: nonce } = useNonce(fromAddress);

  const timezone = useEffectStore(useIndexStore, (state) => state.timezone);

  const onSchedueChange = (value: Date | string) => {
    const offset = -(new Date().getTimezoneOffset() / 60);
    const offsetToTimezone = offset - Number(timezone) || 0;
    value = (Number(value) / 1000 + offsetToTimezone * 60 * 60).toFixed();
    onChange({
      "schedule": value
    })
  }
  const setNow = () => {
    onSchedueChange((new Date().getTime()/1000).toFixed())
  };

  const curTimezoneStr = useIndexStore((state) => state.curTimezoneStr());
  const localTimezoneStr = useIndexStore((state) => state.localTimezoneStr());

  const displayDate = useMemo(() => {
    if (!options.schedule) return null;
    const utcDate = zonedTimeToUtc(
      new Date(Number(options.schedule) * 1000).toISOString(),
      localTimezoneStr,
    );

    const curTimezoneDate = utcToZonedTime(utcDate, curTimezoneStr);

    return curTimezoneDate;
  }, [options.schedule, curTimezoneStr, localTimezoneStr]);

  const pastTime = (() => {
    const utcDate = zonedTimeToUtc(new Date().toISOString(), localTimezoneStr);
    const curTimezoneDate = utcToZonedTime(utcDate, curTimezoneStr);
    return subMinutes(curTimezoneDate, 10);
  })();

  const onChange = (value: Partial<IAdvanceOptions>) => {
    onAdvanceOptionsChange({
      ...options,
      ...value
    })
  }

  return (
    <AdvanceCollapsible>
      <div className="flex flex-row gap-y-3 px-3 gap-x-3 justify-between flex-wrap">
        {
          advanceShowKey.includes('routing') && (
            <FormItem title={T("Routing")} className="w-[45%]">
              <Select
                options={routings}
                value={options['routing'] || ''}
                onChange={(v) => onChange({ 'routing': v as string})}
                placeholder={""}
              />
            </FormItem>
          )
        }
        {
          advanceShowKey.includes('minimum_received') && (
            <MinimumReceived 
              value={options['minimum_received'] || ''}
              onChange={(v) => onChange({ 'minimum_received': v })}
              maxMinimum={maxMinimum}
              tokenInfo={pick(params, ["token0", "token1", "token0Num", "token1Num"])}
            />
        )}
       
        {
          advanceShowKey.includes('timeout') && (
            <FormItem title={T("Timeout(s)")} className="w-[45%]">
              <Input
                value={options.timeout || ""}
                onChange={(v) => onChange({ "timeout": Number(v) })}
                placeholder="0"
                type="number"
                noDecimals
              />
            </FormItem>
          )
        }
        {
          advanceShowKey.includes('priority_fee') &&  (
            <FormItem title={T("PriorityFee")} className="w-[45%]">
              <Input
                value={options.priority_fee || ""}
                onChange={(v) => onChange({"priority_fee": Number(v) })}
                placeholder={String(priorityFee) || "0"}
                type="number"
              />
            </FormItem>
          )
        }
        {
          advanceShowKey.includes('slippage') &&  (
            <FormItem title={T("Slippage")} className="w-[45%]">
              <div className="relative">
                <Input
                  value={options.slippage || ""}
                  onChange={(v) => onChange({"slippage": v })}
                  placeholder="0"
                  type="number"
                />
              <div className="absolute right-2 top-[7px] select-none text-title-color">
                %
                </div>
              </div>
            </FormItem>
        )}
        {advanceShowKey.includes('nonce') && (
          <FormItem title={T("Nonce")} className="w-[30%]">
            <Input
              value={options.nonce || ""}
              onChange={(v) => onChange({ "nonce": Number(v) })}
              placeholder={String(nonce) || "0"}
              type="number"
              noDecimals
            />
          </FormItem>
        )}
        {advanceShowKey.includes('gas') && (
          <div className="w-[60%] flex-row flex-nowrap items-end justify-between">
            <FormItem title={"Gas(gwei)"} className="flex-1">
              <Input
                value={options.gas || ""}
                onChange={(v) => onChange({"gas": Number(v) })}
                placeholder={String(gasPrice)}
                type="number"
              />
            </FormItem>
            <button
              title="fixed gas"
              onClick={() =>
                onChange({"fixed_gas": !options.fixed_gas })
              }
              className="flex h-10 cursor-pointer items-center justify-center rounded-md border px-[11px] hover:bg-custom-bg-white"
            >
              {options.fixed_gas ? (
                <LockIcon className="text-primary" />
              ) : (
                <UnlockIcon className="text-[#999]" />
              )}
            </button>
            <button
              title="no check gas"
              onClick={() =>
                onChange({"no_check_gas": !options.no_check_gas })
              }
              className="flex h-10 cursor-pointer items-center justify-center rounded-md border px-[11px] hover:bg-custom-bg-white"
            >
              <NoCheckIcon
                style={{
                  color: options.no_check_gas ? "#0572ec" : "#999",
                }}
              />
            </button>
            
          </div>
        )}
        
        {
          advanceShowKey.includes('schedue') && (
            <FormItem title={T("ScheduleTime")} className="w-full">
              <div className="flex justify-between gap-x-3">
                <DateTimePicker
                  ampm={false}
                  closeOnSelect={true}
                  minDateTime={pastTime}
                  timeSteps={{ hours: 1, minutes: 1 }}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                  value={displayDate}
                  onChange={(e) => onSchedueChange(e as Date)}
                  format="yyyy-MM-dd HH:mm"
                />
                <button
                  onClick={() => setNow()}
                  className="w-[72px] flex h-10 cursor-pointer items-center justify-center rounded-md border text-sm hover:bg-custom-bg-white"
                >
                  {T("Now")}
                </button>
              </div>
            </FormItem>
          )
        }
      </div>
    </AdvanceCollapsible>
  );
}

function AdvanceCollapsible({ children }: { children?: React.ReactNode }) {
  const T = useTranslations("Common");
  const [open, setOpen] = useState(true);

  return (
    <Collapsible className="mt-6 w-full" open={open} onOpenChange={setOpen}>
      <div className="mb-4 flex items-center pl-3">
        <div className="mr-3 text-xs font-medium text-title-color">{T("AdvanceParameters")}</div>
        <div className="h-[1px] flex-1 bg-shadow-color" />
        <CollapsibleTrigger asChild>
          <ChevronDownCircle
            className="mx-3 h-4 w-4 cursor-pointer text-content-color"
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </CollapsibleTrigger>
        <div className="h-[1px] w-[10px] bg-shadow-color" />
      </div>

      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
}
