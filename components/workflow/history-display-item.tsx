"use client";

import React, { useMemo, useState } from "react";
import { ExternalLink, ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";
import { DexImgMap } from "@/lib/constants/global";

export interface HistoryDisplayItemDataRow {
  leftLabel?: string;
  leftValue?: string;
  rightLabel?: string;
  rightValue?: string;
}

export interface HistoryDisplayItemProps {
  date: string;
  opName: string;
  isApprove?: boolean;
  approveTokenName?: string;
  txHash?: string;
  explorerUrl?: string;

  titleLeftText: string;
  titleRightText?: string; // e.g. Gas 信息

  rows?: HistoryDisplayItemDataRow[]; // 额外行，如收款人/金额、兑换数量等

  statusNode: React.ReactNode; // 左下状态（已封装自外部）
  memoNode?: React.ReactNode; // 备忘（已封装自外部）

  rightFooterText?: string; // 右下角，如 Nonce 或 VA 执行进度

  childrenData?: HistoryDisplayItemProps[]; // 嵌套子项的数据
  className?: string;
}

export default function HistoryDisplayItem(props: HistoryDisplayItemProps) {
  const {
    date,
    opName,
    isApprove,
    approveTokenName,
    txHash,
    explorerUrl,
    titleLeftText,
    titleRightText,
    rows,
    statusNode,
    memoNode,
    rightFooterText,
    childrenData,
    className,
  } = props;

  const imgSrc = useMemo(() => {
    const name = opName?.toLowerCase?.() || "";
    if (name.includes("uniswap")) return DexImgMap["uniswap"];
    if (name.includes("pancakeswap")) return DexImgMap["pancakeSwap"];
    return undefined;
  }, [opName]);

  const handleOpenExplorer = () => {
    if (!explorerUrl || !txHash) return;
    window.open(`${explorerUrl}tx/${txHash}`);
  };

  const [expanded, setExpanded] = useState(false);

  const hasChildren = (childrenData && childrenData.length > 0) || false;

  return (
    <div
      className={clsx(
        "flex flex-col gap-y-2 rounded-md border border-border-color bg-custom-bg-white p-3 text-sm first:mt-4",
        className,
      )}
    >
      <div className="flex justify-between text-content-color">
        <div>{date}</div>
        <div className="flex items-center">
          [
          {opName}
          {imgSrc && (
            <Image src={imgSrc} width={20} height={20} alt="logo" className="mx-1" />
          )}
          ]
          {isApprove && approveTokenName && `(${approveTokenName})`}
          {txHash && (
            <ExternalLink
              className="mb-1 ml-1 h-4 w-4 cursor-pointer text-primary"
              onClick={handleOpenExplorer}
            />
          )}
        </div>
      </div>

      <div className="flex justify-between text-base text-title-color">
        <div className="flex items-center font-medium">{titleLeftText}</div>
        <div className="TruncateSingleLine max-w-[200px]">{titleRightText}</div>
      </div>

      {rows?.map((r, idx) => (
        <div key={idx} className="flex justify-between text-content-color">
          <div>
            {r.leftLabel && `${r.leftLabel}: `}
            {r.leftValue}
          </div>
          <div className="TruncateSingleLine max-w-[200px]">
            {r.rightLabel && `${r.rightLabel}: `}
            {r.rightValue}
          </div>
        </div>
      ))}

      <div className="flex justify-between">
        <div className="flex items-center justify-between">
          {statusNode}
          {memoNode}
        </div>
        <div className="flex items-center gap-2">
          {rightFooterText}
          {hasChildren && (
            <button
              type="button"
              className="flex items-center text-primary"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {hasChildren && expanded &&
        childrenData?.map((child, idx) => (
          <div key={`child-${idx}`} className="ml-4 mt-2">
            <HistoryDisplayItem {...child} />
          </div>
        ))}
    </div>
  );
}


