import Image from "next/image";
import {
  format,
  isBefore,
  isEqual,
  isSameMonth,
  isToday,
  startOfToday,
} from "date-fns";

import SuccessMarker from "/public/icons/success-marker.svg";
import UncertaintyMarker from "/public/icons/uncertainty-marker.svg";
import ExclamationMarker from "/public/icons/exclamation-marker.svg";
import { IDayData } from "@/lib/hooks/use-dashboard-data";
import { useMemo, useState } from "react";
import { ITask } from "@/lib/types/task";
import { formatPercentNum } from "@/lib/utils";
import numbro from "numbro";
import { useTranslations } from "next-intl";

export default function CalendarDay({
  day,
  dayData,
  selectedDay,
  onClick,
  firstDayCurrentMonth,
  tasks,
}: {
  day: Date;
  dayData: IDayData | null;
  tasks: Array<ITask>;
  selectedDay: Date;
  firstDayCurrentMonth: Date;
  onClick: () => void;
}) {
  const today = startOfToday();

  const isSelected = isEqual(day, selectedDay);
  const isBeforeDay = isBefore(day, today);
  const isThisMonth = isSameMonth(day, firstDayCurrentMonth);
  const isSameToday = isToday(day);

  const isPositive = useMemo(() => {
    if (!dayData) return true;

    const { last_price, first_price } = dayData;
    if (last_price === "0" || first_price === "0") {
      const { up } = dayData.plan_info.kline_data;
      return up;
    } else {
      return Number(last_price) > Number(first_price);
    }
  }, [dayData]);

  const percent = useMemo(() => {
    if (!dayData) return "";
    const { last_price, first_price } = dayData;

    if (last_price === "0" || first_price === "0") {
      const { mid } = dayData.plan_info.kline_data;
      if (mid.is_random) {
        const maxP = formatPercentNum(Number(mid.max_value) / 100);
        if (maxP) return `${maxP}%`;

        const minP = formatPercentNum(Number(mid.min_value) / 100);
        return `${minP}%`;
      } else {
        const acc = formatPercentNum(Number(mid.acc_value) / 100);
        return `${acc}%`;
      }
    } else {
      const last = Number(last_price);
      const first = Number(first_price);
      const diff = last - first;
      const percent = (diff / first) * 100;
      return `${formatPercentNum(percent)}%`;
    }
  }, [dayData]);

  const txCount = useMemo(() => {
    return dayData?.pre_schedule_list.length;
  }, [dayData]);

  const tasksCompletedPercent = useMemo(() => {
    if (!tasks?.length) return 0;

    const completed = tasks.filter((t) => t.status === 4).length;
    const percent = formatPercentNum((completed / tasks.length) * 100);

    return percent;
  }, [tasks]);

  const taskStatus = useMemo(() => {
    if (!tasks?.length) return null;

    const allDone = tasks.every((t) => t.status === 4);
    const hasFail = tasks.some((t) => t.status === 5);
    const hasUnDone = tasks.some((t) => t.status !== 4);

    if (allDone) return "done";
    if (hasFail) return "fail";
    if (hasUnDone) return "uncertainty";
  }, [tasks]);

  const gasUsed = useMemo(() => {
    if (!tasks?.length) return null;
    const gweiGas = tasks.reduce((acc, cur) => {
      return acc + Number(cur.gasUsed || 0);
    }, 0);

    const useEth = numbro(gweiGas / 10 ** 9).format({
      mantissa: 6,
    });

    return useEth;
  }, [tasks]);

  return (
    <div
      onClick={onClick}
      data-month={isThisMonth ? "curr" : "other"}
      data-selected={isSelected}
      className="relative flex h-[130px] w-full cursor-pointer flex-col rounded-md border border-[#bfbfbf] px-[6px] py-2 data-[selected=true]:border-b-4 data-[selected=true]:border-[#0E56E666] data-[selected=true]:border-b-[#0E56E6] data-[selected=true]:bg-[#0E56E605] data-[month=other]:opacity-40"
    >
      {dayData && taskStatus && <StatusMarker status={taskStatus} />}

      <div className="px-[6px]">
        <div className="flex items-center">
          <div
            data-month={isThisMonth ? "curr" : "other"}
            data-today={isSameToday}
            className="mr-1 flex items-center justify-center text-lg leading-[26px] text-[#0E56E6] data-[today=true]:h-[30px] data-[today=true]:w-[30px] data-[today=true]:rounded-full data-[today=true]:border data-[today=true]:border-[#0e56e6] data-[today=true]:p-[2px] data-[month=other]:text-[#333]"
          >
            {format(day, "d")}
          </div>
          <div className="text-sm leading-5">
            {dayData && <ProfitNum isPositive={isPositive} numText={percent} />}
          </div>
        </div>

        {dayData && (
          <>
            {isBeforeDay && (
              <>
                <div className="mt-1 text-xs leading-[17px] text-[#707070]">
                  Gas Used
                </div>
                <div className="text-sm text-[#333]">
                  <span className="TruncateSingleLine">{gasUsed}</span>
                  ETH
                </div>
              </>
            )}
            <div className="mt-[6px] text-xs text-[#707070]">Tx</div>
            <div className="text-sm text-[#333]">
              {txCount} ({tasksCompletedPercent}%)
            </div>
          </>
        )}
      </div>

      {!isBeforeDay && <NewPlanText />}
    </div>
  );
}

function NewPlanText() {
  const T = useTranslations("Common");
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="absolute bottom-1 left-1 flex h-5 w-[95%] items-center rounded-sm bg-[#0E56E60F]"
    >
      <Image
        src="/icons/plan.svg"
        alt="plan"
        width={14}
        height={14}
        className="mx-1"
      />
      <div className="text-xs text-[#0E56E6]">
        {isHovered ? T("NotSet") : T("NewPlan")}
      </div>
    </div>
  );
}

function ProfitNum({
  isPositive,
  numText,
}: {
  isPositive: boolean;
  numText: string;
}) {
  return (
    <span
      data-state={isPositive ? "positive" : "negative"}
      className="data-[state='negative']:text-[#D42C1F] data-[state='positive']:text-[#07D498]"
    >
      {numText}
    </span>
  );
}

function StatusMarker({ status }: { status: "done" | "uncertainty" | "fail" }) {
  const marker = {
    done: SuccessMarker,
    uncertainty: UncertaintyMarker,
    fail: ExclamationMarker,
  };
  return (
    <Image
      className="absolute -right-[4px] -top-[4px]"
      src={marker[status]}
      width={20}
      height={20}
      alt="marker"
    />
  );
}
