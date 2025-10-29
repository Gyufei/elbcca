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
import { VaContext } from "@/lib/providers/va-provider";

const SwapHistory = forwardRef((props: any, ref: any) => {
  const T = useTranslations("Common");
  const { currentAccountType } = useContext(VaContext);
  const isVa = currentAccountType === "VirtualAccount";
  const [subOpenTaskId, setSubOpenTaskId] = useState<number | null>(null);

  const userPathMap = useIndexStore((state) => state.userPathMap());
  const { networkId } = useContext(NetworkContext);

  const [filterTaskDate, setFilterTaskDate] = useState<{
    min: Date | null;
    max: Date | null;
  }>({
    min: subDays(new Date(), 30),
    max: addDays(new Date(), 5),
  });

  const handleMinDateChange = (d: Date | null) => {
    setFilterTaskDate((prev) => ({
      ...prev,
      min: d,
    }));
  };

  const handleMaxDateChange = (d: Date | null) => {
    const date = d ? setHours(setMinutes(setSeconds(d, 59), 59), 23) : null;

    setFilterTaskDate((prev) => ({
      ...prev,
      max: date,
    }));
  };

  const { parsedTaskFunc, isCanParse } = useParseTasks();

  const getQueryStr = () => {
    let max = new Date(filterTaskDate.max || "").getTime();
    let min = new Date(filterTaskDate.min || "").getTime();
    if (max < min) {
      [max, min] = [min, max];
    }
    return `chain_id=${
      networkId || ""
    }&execute_time_maximum=${max}&execute_time_minimum=${min}`;
  };

  const fetchTasks = async (): Promise<Array<ITask> | undefined> => {
    if (!isCanParse || (!filterTaskDate.min && !filterTaskDate.max)) {
      return undefined;
    }

    const taskRes: Array<Record<string, any>> = await fetcher(
      isVa
        ? `${userPathMap.vaHistory}?${getQueryStr()}`
        : `${userPathMap.swapHistory}?${getQueryStr()}`,
    );

    if (!taskRes) return undefined;

    const parsed = parsedTaskFunc(taskRes);

    return parsed;
  };

  const {
    data: tasks,
    mutate: filterTrigger,
    isLoading: filtering,
  } = useSWR("fetch-tasks", fetchTasks, {
    refreshInterval: 15000,
  });

  useEffect(() => {
    if (isCanParse) {
      filterTrigger(undefined, {
        optimisticData: undefined,
      });
    }
  }, [isCanParse, filterTrigger]);

  const handleSearch = useCallback(() => {
    if (!isCanParse) return null;
    if (!filterTaskDate.min && !filterTaskDate.max) {
      return null;
    } else {
      filterTrigger(undefined, {
        optimisticData: undefined,
      });
      return true;
    }
  }, [isCanParse, filterTaskDate, filterTrigger]);

  const [searchText, setSearchText] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks?.filter((task) => {
      if (searchText === "") {
        return true;
      } else {
        const isTxHash = task.txHash && task.txHash?.includes(searchText);
        const isAccount =
          task.data?.account && task.data?.account.includes(searchText);
        const isReception =
          task.data?.recipient && task.data?.recipient.includes(searchText);
        return isTxHash || isAccount || isReception;
      }
    });
  }, [tasks, searchText]);

  useImperativeHandle(ref, () => ({
    handleSearch,
  }));

  return (
    <>
      <div
        style={{
          boxShadow: "inset 0px -1px 0px 0px #D6D6D6",
        }}
        className="bg-custom-bg-white px-3 py-2"
      >
        <Input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="rounded-3xl bg-custom-bg-white"
          type="text"
          placeholder={T("Search")}
        />
      </div>
      <div className="flex items-center justify-between gap-x-1 px-3 pb-8 pt-3">
        <DatePicker
          format="yyyy-MM-dd"
          slotProps={{
            textField: {
              size: "small",
              fullWidth: true,
            },
          }}
          value={filterTaskDate.min}
          onChange={(e) => handleMinDateChange(e)}
        />
        <div>-</div>
        <DatePicker
          format="yyyy-MM-dd"
          slotProps={{ textField: { size: "small", fullWidth: true } }}
          value={filterTaskDate.max}
          onChange={(e) => handleMaxDateChange(e)}
        />
      </div>

      <div className="relative border-t">
        <div className="h-8 border-b shadow-md"></div>
        <Button
          disabled={filtering}
          onClick={() => handleSearch()}
          className="disabled:opacity-1 absolute top-[-20px] mx-3 flex w-[95%] items-center justify-center rounded border bg-white py-2 text-title-color hover:bg-custom-bg-white"
        >
          <LoadingIcon isLoading={filtering} />
          {T("FilterTask")}
        </Button>
        <div className="flex h-[calc(100vh-190px)] flex-col justify-stretch gap-y-3 overflow-y-auto px-3 pb-2 md:h-[calc(100vh-245px)]">
          {filteredTasks?.length ? (
            filteredTasks.map((task) => (
              <SwapHistoryItem
                key={task.id}
                isVa={isVa}
                task={task}
                onCancel={handleSearch}
                subOpenTaskId={subOpenTaskId}
                onOpenSubTask={setSubOpenTaskId}
              />
            ))
          ) : Array.isArray(tasks) ? (
            <Empty />
          ) : null}
        </div>
      </div>
    </>
  );
});

SwapHistory.displayName = "SwapHistory";
export default SwapHistory;
