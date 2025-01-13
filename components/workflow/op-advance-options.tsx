import { useContext, useMemo, useState } from "react";
import { ChevronDownCircle } from "lucide-react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
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

export default function OpAdvanceOptions({
  options,
  onChange,
  account,
  token0,
  token1
}: {
  options: IAdvanceOptions;
  onChange: (_o: IAdvanceOptions) => void;
  account: string;
  token0: ITokenNumDesc;
  token1: ITokenNumDesc;
}) {
  const { networkName } = useContext(NetworkContext);

  const T = useTranslations("Common");
  const { data: gasPrice } = useGasPrice();
  const { data: priorityFee } = usePriorityFee();
  const { data: nonce } = useNonce(account);

  const timezone = useEffectStore(useIndexStore, (state) => state.timezone);

  function handleAdvanceOptionsChange(key: string, value: any) {
    if (key === "slippage" || key === "gas" || key === "minimum_received") {
      value = value ? replaceStrNum(value) : null;
    }

    if (key === "nonce" || key === "timeout") {
      value = value ? Number(replaceStrNumNoDecimal(value)) : null;
    }

    if (key === "schedule") {
      const offset = -(new Date().getTimezoneOffset() / 60);
      const offsetToTimezone = offset - Number(timezone) || 0;
      value = (value / 1000 + offsetToTimezone * 60 * 60).toFixed();
    }

    onChange({
      ...options,
      [key]: value,
    });
  }

  const setNow = () => {
    onChange({
      ...options,
      schedule: (new Date().getTime() / 1000).toFixed(),
    });
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

  return (
    <AdvanceCollapsible>
      <div className="flex flex-col gap-y-3 px-3">
      <div className="flex justify-between gap-x-3">
          <div className="flex flex-1 flex-col">
            <div className="LabelText mb-1">{T("Routing")}</div>
            <RoutingSelect 
              value={options.routing}
              onChange={(v: string | null) => {
                handleAdvanceOptionsChange("routing", v)
              }}
            />
          </div>
          <div className="flex flex-1 flex-col">
            <div className="LabelText mb-1">{T("MinimumReceived")}</div>
            <div className="relative">
              <Input
                className="rounded-md border-border-color"
                placeholder="0"
                value={options.minimum_received || ""}
                onChange={(e) =>
                  handleAdvanceOptionsChange("minimum_received", e.target.value)
                }
              />
              <MinimumTip
                token0={token0}
                token1={token1}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-x-3">
          {
            networkName !==  NetworkChainType.SOLANA && (
              <div className="flex flex-1 flex-col">
                <div className="LabelText mb-1">{T("Timeout(s)")}</div>
                <Input
                  value={options.timeout || ""}
                  onChange={(e) =>
                    handleAdvanceOptionsChange("timeout", e.target.value)
                  }
                  className="rounded-md border-border-color"
                  placeholder="0"
                />
              </div>
            )
          }
          {
            networkName ===  NetworkChainType.SOLANA && (
              <div className="flex flex-1 flex-col">
                <div className="LabelText mb-1">{T("PriorityFee")}</div>
                <Input
                  value={options.priority_fee != null ? options.priority_fee : ""}
                  onChange={(e) =>
                    handleAdvanceOptionsChange("priority_fee", e.target.value)
                  }
                  className="rounded-md border-border-color"
                  placeholder={String(priorityFee) || "0"}
                />
              </div>
            )
          }
          
          <div className="flex flex-1 flex-col">
            <div className="LabelText mb-1">{T("Slippage")}</div>
            <div className="relative">
              <Input
                className="rounded-md border-border-color"
                placeholder="0"
                value={options.slippage || ""}
                onChange={(e) =>
                  handleAdvanceOptionsChange("slippage", e.target.value)
                }
              />
              <div className="absolute right-2 top-[7px] select-none text-title-color">
                %
              </div>
            </div>
          </div>
        </div>
        {
          networkName !==  NetworkChainType.SOLANA && (
          <div className="flex items-end justify-between gap-x-3">
            <div className="flex flex-1 justify-between gap-x-3">
              <div className="flex-1">
                <div className="LabelText mb-1">{T("Nonce")}</div>
                <Input
                  value={options.nonce != null ? options.nonce : ""}
                  onChange={(e) =>
                    handleAdvanceOptionsChange("nonce", e.target.value)
                  }
                  className="rounded-md border-border-color"
                  placeholder={String(nonce) || "0"}
                />
              </div>
              <div className="flex-1">
                <div className="LabelText mb-1">Gas(gwei)</div>
                <Input
                  value={options.gas || ""}
                  onChange={(e) =>
                    handleAdvanceOptionsChange("gas", e.target.value)
                  }
                  className="rounded-md border-border-color"
                  placeholder={String(gasPrice)}
                />
              </div>
            </div>
            <div className="flex justify-between gap-x-3">
              <button
                title="fixed gas"
                onClick={() =>
                  handleAdvanceOptionsChange("fixed_gas", !options.fixed_gas)
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
                  handleAdvanceOptionsChange(
                    "no_check_gas",
                    !options.no_check_gas,
                  )
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
          </div>)
        }
        <div className="flex flex-col">
          <div className="LabelText mb-1">{T("ScheduleTime")}</div>
          <div className="flex justify-between gap-x-3">
            <DateTimePicker
              ampm={false}
              closeOnSelect={true}
              minDateTime={pastTime}
              timeSteps={{ hours: 1, minutes: 1 }}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
              value={displayDate}
              onChange={(e: Date | null) =>
                handleAdvanceOptionsChange("schedule", e)
              }
              format="yyyy-MM-dd HH:mm"
            />
            <button
              onClick={() => setNow()}
              className="w-[72px] flex h-10 cursor-pointer items-center justify-center rounded-md border text-sm hover:bg-custom-bg-white"
            >
              {T("Now")}
            </button>
          </div>
        </div>
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
