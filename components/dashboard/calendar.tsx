"use client";

import { useMemo, useState } from "react";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { DayNames } from "@/lib/constants/dashboard-const";
import useIndexStore from "@/lib/state";
import CalendarDay from "./calendar-day";
import { useDashboardData } from "@/lib/hooks/use-dashboard-data";
import { useDashboardReset } from "@/lib/hooks/use-dashboard-reset";
import { useMonthHistory } from "@/lib/hooks/use-month-history";
import DayOperation from "./day-operation";
import { useLocale, useTranslations } from "next-intl";

export default function Calendar() {
  const T = useTranslations("Common");
  const { resetAction } = useDashboardReset();
  const selectedDay = useIndexStore((state) => state.selectedDay);
  const setSelectedDay = useIndexStore((state) => state.setSelectedDay);

  const today = startOfToday();
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));

  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const daysOfMonth = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(firstDayCurrentMonth, { weekStartsOn: 0 }),
        end: endOfWeek(endOfMonth(firstDayCurrentMonth), { weekStartsOn: 0 }),
      }),
    [firstDayCurrentMonth],
  );

  const { data: daysData } = useDashboardData(
    daysOfMonth[0],
    daysOfMonth[daysOfMonth.length - 1],
  );

  const { data: tasks, mutate: refreshTasks } = useMonthHistory(
    daysOfMonth[0],
    daysOfMonth[daysOfMonth.length - 1],
  );

  function prevMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function handleSelected(day: Date) {
    setSelectedDay(day);

    const dayData = daysData?.find(
      (d) => d.schedule_date === format(day, "yyyy-MM-dd"),
    );

    if (dayData && dayData.plan_info) {
      resetAction(dayData.plan_info);
    } else {
      resetAction();
    }
  }

  const dayTasks = useMemo(() => {
    return tasks?.filter((t) => isSameDay(new Date(t.date), selectedDay));
  }, [tasks, selectedDay]);

  const transMonth = useMemo(() => {
    const arr = format(firstDayCurrentMonth, "MMMM yyyy").split(" ");

    return T(arr[0]) + " " + arr[1]
  }, [firstDayCurrentMonth])

  return (
    <>
      <div className="flex h-full min-w-[800px] flex-1 flex-col">
        <div className="border-b border-[#d6d6d6] bg-[#f6f7f8] py-3">
          <div className="mb-2 flex items-center justify-center">
            <button type="button" className="mr-2" onClick={prevMonth}>
              <ChevronLeft size={20} />
            </button>
            <h2 className="mx-3 text-lg">
              {transMonth}
            </h2>
            <button
              type="button"
              className="flex justify-end"
              onClick={nextMonth}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-[repeat(7,minmax(100px,_1fr))] gap-4 pl-4 pr-8">
            {DayNames.map((day, i) => {
              return (
                <div
                  key={i}
                  className="LabelText flex w-full items-center justify-center"
                >
                  {T(day)}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid flex-1 grid-cols-[repeat(7,minmax(100px,_1fr))] gap-4 justify-items-center gap-y-3 overflow-y-auto bg-[#fafafa] pb-4 pt-3 px-4">
          {daysOfMonth.map((day) => {
            const dayData = daysData?.find(
              (d) => d.schedule_date === format(day, "yyyy-MM-dd"),
            );

            const dTasks = tasks?.filter((t) =>
              isSameDay(new Date(t.date), day),
            );

            return (
              <CalendarDay
                tasks={dTasks || []}
                dayData={dayData || null}
                key={day.toString()}
                day={day}
                selectedDay={selectedDay}
                firstDayCurrentMonth={firstDayCurrentMonth}
                onClick={() => handleSelected(day)}
              />
            );
          })}
        </div>
      </div>

      <DayOperation
        dayData={
          daysData?.find(
            (d) => d.schedule_date === format(selectedDay, "yyyy-MM-dd"),
          ) || null
        }
        tasks={dayTasks || []}
        onCancel={() => refreshTasks()}
      />
    </>
  );
}
