import { useContext, useMemo } from "react";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

import { ITask } from "@/lib/types/task";
import TruncateText from "@/components/shared/trunc-text";
import SwapHistoryItemStatus from "./swap-history-items-status";
import { NetworkContext } from "@/lib/providers/network-provider";
import { toNonExponential } from "@/lib/utils";
import useIndexStore from "@/lib/state";
import fetcher from "@/lib/fetcher";
import useSWRMutation from "swr/mutation";
import { DexImgMap } from "@/lib/constants/global";
import SwapHistoryItemMemo from "./swap-history-items-memo";

export default function SwapHistoryItem({
  task,
  onCancel,
}: {
  task: ITask;
  onCancel: () => void;
}) {
  const { network } = useContext(NetworkContext);
  const userPathMap = useIndexStore((state) => state.userPathMap());

  const isSwap = task.op === 1;
  const isTransfer = task.op === 2;
  const isApprove = task.op === 3;
  const taskTxData = task.data;

  const handleGoToExplorer = () => {
    window.open(`${network?.block_explorer_url}tx/${task.txHash}`);
  };

  const cancelFetcher = async () => {
    if (!task.id) return null;

    const res = await fetcher(
      `${userPathMap.cancelTask}?record_id=${task.id}`,
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

  return (
    <div className="flex flex-col gap-y-2 rounded-md border border-border-color bg-custom-bg-white p-3 text-sm first:mt-4">
      <div className="flex justify-between text-content-color">
        <div>{task.date}</div>
        <OpDisplay task={task} onClick={handleGoToExplorer} />
      </div>

      <div className="flex justify-between text-base text-title-color">
        <div className="flex items-center font-medium">
          <TruncateText text={task.data.account} />
        </div>
        <div className="TruncateSingleLine max-w-[200px]">
          Gas:{" "}
          {toNonExponential((Number(taskTxData?.gas) || 0) / 10 ** 9) + " Gwei"}
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
            {taskTxData.tokenInName}
            <span>&rarr;</span>
            {taskTxData.tokenOutName}
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
          />
          <SwapHistoryItemMemo status={task.status} memo={task.memo} />
        </div>
        {!isApprove && <div>Nonce: {taskTxData?.nonce}</div>}
      </div>
    </div>
  );
}

function OpDisplay({ task, onClick }: { task: ITask; onClick: () => void }) {
  const name = task.opName;
  const isSwap = task.op === 1;
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
      [{isSwap && <span>Swap</span>}
      {isApprove && <span>Approve</span>}
      {imgSrc ? (
        <Image
          src={imgSrc}
          width={20}
          height={20}
          alt="logo"
          className="mx-1"
        />
      ) : (
        name
      )}
      ]{isApprove ? `(${taskTxData.tokenName})` : null}
      {task.txHash && (
        <ExternalLink
          className="mb-1 ml-1 h-4 w-4 cursor-pointer text-primary"
          onClick={onClick}
        />
      )}
    </div>
  );
}
