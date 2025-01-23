import { DexImgMap } from "@/lib/constants/global";
import fetcher from "@/lib/fetcher";
import { IOp } from "@/lib/types/op";

const getImageSrc = (op: IOp) => {
  if (op.op_id && op.op_id >= 4) return "";
  if (!op || op.op_id !== 1) return DexImgMap.transfer;

  if (op.op_id === 1) {
    if (op.op_name.includes("Pancake")) {
      return DexImgMap.pancakeSwap;
    }

    if (op.op_name.includes("Uniswap")) {
      return DexImgMap.uniswap;
    }

    if (op.op_name.includes("Swap")) {
      return DexImgMap.swap;
    }
  }

  return "";
};

export const fetchOp = async (url: string, networkName?: string) => {
  try {
    const res = await fetcher(url, {
      method: "GET",
    });
    const displayRes = (res || []).filter((op: IOp) => op.op_id !== 3)
    return displayRes.map((item: IOp) => {
      return {
        logo: getImageSrc(item),
        ...item
      }
    }) || [];

  } catch {
    return []
  }
}

