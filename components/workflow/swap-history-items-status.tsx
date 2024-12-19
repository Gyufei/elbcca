import { StatusEnum } from "@/lib/types/task";
import { useMemo, useState } from "react";

export default function SwapHistoryItemStatus({
  status,
  onCancelQueue,
}: {
  status: StatusEnum;
  onCancelQueue?: () => void;
}) {
  const colorMap = {
    [StatusEnum["pre-queue"]]: {
      color: "#777777",
      bg: "#F8F8F8",
      border: "#E0E0E0",
    },
    [StatusEnum.queue]: {
      color: "#0572ec",
      bg: "rgba(5, 114, 236, 0.1)",
      border: " rgba(5, 114, 236, 0.4)",
    },
    [StatusEnum.pending]: {
      color: "#EF814F",
      bg: "rgba(239, 129, 79, 0.1)",
      border: "rgba(239, 129, 79, 0.4)",
    },
    [StatusEnum.finished]: {
      color: "#07D498",
      bg: "rgba(7, 212, 152, 0.1)",
      border: "rgba(7, 212, 152, 0.4)",
    },
    [StatusEnum.failed]: {
      color: "#D42C1F",
      bg: "rgba(212, 44, 31, 0.1)",
      border: "rgba(212, 44, 31, 0.4)",
    },
    [StatusEnum.canceled]: {
      color: "#707070",
      bg: "#E9EAEE",
      border: "#bfbfbf",
    },
    [StatusEnum.replaced]: {
      color: "#FFFFFF",
      bg: "#3388FF",
      border: "#73B2FF",
    },
  };

  const colorVars = colorMap[status];

  const statusText = useMemo(() => {
    const t = StatusEnum[status];
    return t;
  }, [status]);

  const isCanCancel = useMemo(
    () => status === StatusEnum["pre-queue"] || status === StatusEnum.queue,
    [status],
  );

  const [isHover, setIsHover] = useState(false);

  return isCanCancel ? (
    <div
      style={{
        color: !isHover ? colorVars.color : "#fff",
        backgroundColor: !isHover ? colorVars.bg : "rgba(212, 44, 31, 0.8)",
        border: `1px solid ${
          !isHover ? colorVars.border : "rgba(212, 44, 31, 0.8)"
        }`,
      }}
      onMouseOver={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
      onClick={onCancelQueue}
      className="w-[100px] cursor-pointer rounded-full text-xs hover:text-white"
    >
      <div className="flex items-center justify-center">
        {isHover ? "dequeue" : statusText}
      </div>
    </div>
  ) : (
    <div
      style={{
        color: colorVars.color,
        backgroundColor: colorVars.bg,
        border: `1px solid ${colorVars.border}`,
      }}
      className="rounded-full bg-[#e9eaee] px-3 text-sm"
    >
      <div className="flex items-center">{statusText}</div>
    </div>
  );
}
