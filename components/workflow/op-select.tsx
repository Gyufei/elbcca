import Image from "next/image";
import { useContext, useEffect, useMemo } from "react";
import useSWR from "swr";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SystemEndPointPathMap } from "@/lib/end-point";
import fetcher from "@/lib/fetcher";
import { NetworkContext } from "@/lib/providers/network-provider";
import { IOp } from "@/lib/types/op";
import { DexImgMap } from "@/lib/constants/global";
import { ArrowLeftRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function OpSelect({
  op,
  handleOpSelect,
}: {
  op: IOp | null;
  handleOpSelect: (_o: IOp) => void;
}) {
   const T = useTranslations("Common");
  const { network } = useContext(NetworkContext);
  const networkId = network?.chain_id;

  const { data: opList = [] } = useSWR(() => {
    return networkId
      ? `${SystemEndPointPathMap.ops}?chain_id=${networkId}`
      : null;
  }, fetcher);

  const displayOpList = useMemo(() => {
    if (!opList?.length) return [];
    return opList.filter((op: Record<string, any>) => op.op_id !== 3);
  }, [opList]);


  useEffect(() => {
    const opIndex = (opList || []).findIndex((item: Record<string, any>) => {
      const { op_id, op_name } = item;
      if (!op) return false
      return op.op_id===op_id && op.op_name===op_name;
    })
    if (opList?.length && opIndex === -1) {
      const defaultOp = opList.find((op: Record<string, any>) => op.op_id === 1) || opList.find((op: Record<string, any>, index: number) => index === 0 && op.op_id !== 3)
      handleOpSelect(defaultOp);
    }
  }, [opList, JSON.stringify(op)]);

  const handleSelect = (opName: string) => {
    const op = opList.find((op: Record<string, any>) => op.op_name === opName);
    handleOpSelect(op);
  };

  return (
    <Select value={op?.op_name} onValueChange={(e) => handleSelect(e)}>
      <SelectTrigger>
        <SelectValue placeholder={T("SelectOP")}>
          {op && (
            <div className="flex items-center">
              <OpLogo op={op} />
              <span className="ml-1">{op.op_name}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {(displayOpList || []).map((op: IOp) => (
          <SelectItem showIndicator={false} key={op.op_name} value={op.op_name}>
            <div className="flex items-center">
              <OpLogo op={op} />
              <span className="ml-1">{op.op_name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function OpLogo({ op }: { op: IOp }) {
  const getImageSrc = (op: IOp) => {
    if (!op || op.op_id !== 1) return "";

    if (op.op_id === 1) {
      if (op.op_name.includes("Pancake")) {
        return DexImgMap.pancakeSwap;
      }

      if (op.op_name.includes("Uniswap")) {
        return DexImgMap.uniswap;
      }

      if (op.op_name.includes("Swap")) {
        return DexImgMap.uniswap;
      }
    }

    return "";
  };

  return op?.op_id === 2 ? (
    <ArrowLeftRight className="h-4 w-4" />
  ) : getImageSrc(op) ? (
    <Image src={getImageSrc(op)} width={20} height={20} alt="logo" />
  ) : null;
}
