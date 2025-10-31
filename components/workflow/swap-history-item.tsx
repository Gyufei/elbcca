import { useContext, useMemo } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import Image from "next/image";

import { ITask, StatusEnum } from "@/lib/types/task";
import TruncateText from "@/components/shared/trunc-text";
import SwapHistoryItemStatus from "./swap-history-items-status";
import { NetworkContext } from "@/lib/providers/network-provider";
import { cn, toNonExponential } from "@/lib/utils";
import useIndexStore from "@/lib/state";
import fetcher from "@/lib/fetcher";
import useSWRMutation from "swr/mutation";
import { DexImgMap } from "@/lib/constants/global";
import SwapHistoryItemMemo from "./swap-history-items-memo";
import { NetworkChainType } from "@/lib/types/network";
import useSWR from "swr";
import { useParseTasks } from "@/lib/hooks/use-parse-task";

export default function SwapHistoryItem({
  isVa,
  task,
  onCancel,
  subOpenTaskId,
  onOpenSubTask,
  isSub = false,
  isLast = false,
}: {
  task: ITask;
  onCancel: () => void;
  isVa: boolean;
  subOpenTaskId: number | null;
  onOpenSubTask: (taskId: number | null) => void;
  isSub?: boolean;
  isLast?: boolean;
}) {
  const { network, networkName } = useContext(NetworkContext);
  const userPathMap = useIndexStore((state) => state.userPathMap());
  const { parsedTaskFunc, isCanParse } = useParseTasks();

  const isSwap = task.op === 1;
  const isTransfer = task.op === 2;
  const isApprove = task.op === 3;
  const taskTxData = task.data;

  const executed_txs = task.executed_txs || 0;
  const total_txs = task.total_txs || 0;

  const vaExecutedText = useMemo(() => {
    if (task.status === StatusEnum.queue) {
      return `Queued: ${total_txs}`;
    } else if (task.status === StatusEnum.pending) {
      return `Executing: ${executed_txs}/${total_txs}`;
    } else if (task.status === StatusEnum.finished) {
      return `Executed: ${executed_txs}/${total_txs}`;
    }

    return "";
  }, [task.status, executed_txs, total_txs]);

  const fetchSubTasks = async (): Promise<Array<ITask> | undefined> => {
    if (!isVa || !isCanParse) return;

    const taskRes: Array<Record<string, any>> = await fetcher(
      `${userPathMap.vaHistoryDetail}?va_tx_id=${task.id}`,
    );

    if (!taskRes) return undefined;

    const parsed = parsedTaskFunc(taskRes);

    return parsed;
  };

  const { data: subTasks } = useSWR(
    isVa ? `va-detail-${task.id}` : null,
    fetchSubTasks,
  );

  const handleGoToExplorer = () => {
    if (!network) return;
    window.open(`${network?.explorer_url}tx/${task.txHash}`);
  };

  const cancelFetcher = async () => {
    if (!task.id) return null;
    if (isSub) return null;

    const res = await fetcher(
      `${isVa ? userPathMap.vaCancelTask : userPathMap.cancelTask}?record_id=${
        task.id
      }`,
      {
        method: "POST",
        body: "",
      },
    );

    onCancel();
    return res;
  };

  const { trigger: cancelAction } = useSWRMutation(
    "Cancel Task",
    cancelFetcher,
  );

  const handleCancelQueue = () => {
    cancelAction();
  };

  function onSubToggle() {
    onOpenSubTask(task.id === subOpenTaskId ? null : task.id);
  }

  return (
    <div
      className={cn(
        "flex flex-col rounded-md border border-border-color bg-custom-bg-white text-sm first:mt-4",
        isSub ? "rounded-none border-l-0 border-r-0 border-l-primary" : "",
        isLast && "rounded-b-md border-b-0 px-3",
      )}
    >
      <div className="flex flex-col gap-y-2 p-3">
        <div className="flex justify-between text-content-color">
          <div>{task.date}</div>
          <OpDisplay task={task} onClick={handleGoToExplorer} />
        </div>

        <div className="flex justify-between text-base text-title-color">
          <div className="flex items-center font-medium">
            <TruncateText
              text={isVa ? `[${task.data.va_name}]` : task.data.account}
            />
          </div>
          <div className="TruncateSingleLine max-w-[200px]">
            {networkName !== NetworkChainType.SOLANA && (
              <>
                {isVa ? "Max Gas Price:" : "Gas: "}
                {toNonExponential((Number(taskTxData?.gas) || 0) / 10 ** 9) +
                  " Gwei"}
              </>
            )}
          </div>
        </div>

        {(isSwap && taskTxData?.recipient !== taskTxData?.account) ||
        isTransfer ? (
          <div className="flex justify-between text-content-color">
            {taskTxData?.recipient !== taskTxData?.account && (
              <div>
                Recipient: <TruncateText text={taskTxData?.recipient || ""} />
              </div>
            )}
            {isTransfer && (
              <div className="TruncateSingleLine max-w-[200px]">
                Value: {taskTxData?.amount}
              </div>
            )}
          </div>
        ) : null}

        {isSwap ? (
          <div className="flex justify-between text-content-color">
            <div>
              {taskTxData.token_in_name && taskTxData.token_out_name && (
                <>
                  {taskTxData.token_in_name}
                  <span>&rarr;</span>
                  {taskTxData.token_out_name}
                </>
              )}
            </div>
            <div className="TruncateSingleLine max-w-[200px]">
              Amount: {taskTxData?.amount}
            </div>
          </div>
        ) : null}

        <div className="flex justify-between">
          <div className="flex items-center justify-between">
            <SwapHistoryItemStatus
              status={task.status}
              onCancelQueue={handleCancelQueue}
              isSub={isSub}
            />
            <SwapHistoryItemMemo status={task.status} memo={task.memo} />
          </div>
          {!isApprove && networkName !== NetworkChainType.SOLANA && !isVa && (
            <div>Nonce: {taskTxData?.nonce}</div>
          )}
          {isVa && <div>{vaExecutedText}</div>}
        </div>
      </div>

      {isVa && subTasks && subTasks.length > 0 && (
        <div className="flex items-center justify-center">
          <ChevronDown
            className={cn(
              "h-4 w-4 cursor-pointer text-primary",
              subOpenTaskId === task.id ? "rotate-180" : "",
            )}
            onClick={onSubToggle}
          />
        </div>
      )}

      {isVa &&
        subTasks &&
        subTasks.length > 0 &&
        subOpenTaskId === task.id &&
        subTasks?.map((t: ITask, index: number) => (
          <SwapHistoryItem
            key={t.id}
            task={t}
            isVa={false}
            onCancel={() => {}}
            subOpenTaskId={null}
            onOpenSubTask={() => {}}
            isSub={true}
            isLast={index === subTasks.length - 1}
          />
        ))}
    </div>
  );
}

function OpDisplay({ task, onClick }: { task: ITask; onClick: () => void }) {
  const name = task.opName;
  // const isSwap = task.op === 1;
  const isApprove = task.op === 3;
  const taskTxData = task.data;

  const imgSrc = useMemo(() => {
    if (name.toLowerCase().includes("uniswap")) {
      return DexImgMap["uniswap"];
    }
    if (name.toLowerCase().includes("pancakeswap")) {
      return DexImgMap["pancakeSwap"];
    }
  }, [name]);

  return (
    <div className="flex items-center">
      [
      {/* {isSwap && <span>Swap</span>}
      {isApprove && <span>Approve</span>} */}
      {name}
      {imgSrc && (
        <Image
          src={imgSrc}
          width={20}
          height={20}
          alt="logo"
          className="mx-1"
        />
      )}
      ]{isApprove && taskTxData.token_name && `(${taskTxData.token_name})`}
      {task.txHash && (
        <ExternalLink
          className="mb-1 ml-1 h-4 w-4 cursor-pointer text-primary"
          onClick={onClick}
        />
      )}
    </div>
  );
}
