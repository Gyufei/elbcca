"use client";

import { useDashboardDayApply } from "@/lib/hooks/use-dashboard-day-apply";
import { Button } from "../ui/button";
import Empty from "../shared/empty";
import SwapHistoryItem from "../workflow/swap-history-item";

import Plan from "./plan";
import Rules from "./rules";
import { useDashboardDaySave } from "@/lib/hooks/use-dashboard-day-save";
import LoadingIcon from "../shared/loading-icon";
import { useDashboardReset } from "@/lib/hooks/use-dashboard-reset";
import { ITask } from "@/lib/types/task";
import useIndexStore from "@/lib/state";
import { IDayData } from "@/lib/hooks/use-dashboard-data";
import { useTranslations } from "next-intl";

export default function DayOperation({
  dayData,
  tasks,
  onCancel,
}: {
  dayData: IDayData | null;
  tasks: Array<ITask>;
  onCancel: () => void;
}) {
  const T = useTranslations("Common");
  const isBeforeDay = useIndexStore((state) => state.isBeforeDay());

  const { saveLoading, saveAction } = useDashboardDaySave();
  const { applyLoading, applyAction, cancelApplyAction } =
    useDashboardDayApply();
  const { resetAction } = useDashboardReset();

  const isApply = dayData?.is_apply;

  const handleApply = () => {
    if (isApply) {
      cancelApplyAction();
    } else {
      applyAction();
    }
  };

  return (
    <div className="w-[400px] border-l border-[#d6d6d6] bg-[#fafafa]">
      <div className="p-3">
        <Plan />
        <Rules />
        <div className="flex justify-between">
          <Button
            disabled={isBeforeDay}
            onClick={() => resetAction()}
            className="w-[100px] border border-primary bg-white text-primary hover:brightness-95"
          >
            {T("Reset")}
          </Button>
          <Button
            onClick={saveAction}
            disabled={saveLoading || isBeforeDay}
            className="w-[100px] border border-primary bg-white text-primary hover:brightness-95"
          >
            <LoadingIcon isLoading={saveLoading} />
            {T("Save")}
          </Button>
          <Button
            onClick={handleApply}
            disabled={applyLoading || isBeforeDay}
            className="w-[152px] border border-primary bg-primary text-white hover:brightness-95"
          >
            <LoadingIcon className="text-white" isLoading={applyLoading} />
            {T(isApply ? "CancelApply" : "Apply")}
          </Button>
        </div>
      </div>

      <div className="relative border-t">
        <div className="px-3 py-1 text-sm text-[#707070]  shadow-md">
          {T("Transactions")}
        </div>
        <div className="flex h-[calc(100vh-455px)] flex-col justify-stretch gap-y-3 overflow-y-auto px-3 pb-2">
          {tasks?.length ? (
            tasks.map((task) => (
              <SwapHistoryItem key={task.id} task={task} onCancel={onCancel} />
            ))
          ) : Array.isArray(tasks) ? (
            <Empty />
          ) : null}
        </div>
      </div>
    </div>
  );
}
