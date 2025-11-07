"use client";

import { useRouter } from "@/app/navigation";
import { networkConfigs } from "@/lib/constants/network-config";
import { SystemEndPointPathMap } from "@/lib/end-point";
import fetcher from "@/lib/fetcher";
import { NetworkChainType } from "@/lib/types/network";
import { useTranslations } from "next-intl";
import Image from "next/image";
import useSWR from "swr";

export const networkMap = {
  Solana: "Solana",
  BNBChain: "BNB Chain",
  Ethereum: "Ethereum",
};

export default function NetworkSetting() {
  const T = useTranslations("Common");
  const router = useRouter();
  const { data: networkList } = useSWR(SystemEndPointPathMap.networks, fetcher);

  return (
    <div className="mt-6 flex flex-col gap-y-3">
      <div className="flex flex-row items-center justify-between">
        <div className="text-lg font-bold text-[#333333]">
          {T("NetworkSettings")}
        </div>
        <div className="flex h-[24px] flex-row items-center gap-2 text-sm text-[#707070]">
          {T("LearnMore")}
          <Image
            src={"/icons/share.svg"}
            width={16}
            height={16}
            alt="choose"
            className="ml-2"
          />
        </div>
      </div>
      <div className="flex flex-row flex-wrap gap-3">
        {(networkList || []).map((item: any) => {
          return (
            <div
              key={item.chain_id}
              className="flex h-[40px] cursor-pointer flex-row items-center rounded-[6px] border border-[#BFBFBF] px-3 text-base"
              onClick={() =>
                router.push(
                  `/setting/networks?name=${item.currency_name}&chainId=${item.chain_id}`,
                )
              }
            >
              <Image
                src={
                  networkConfigs[item.currency_name as NetworkChainType]?.logo
                }
                width={16}
                height={16}
                alt="choose"
                className="mr-1"
              />
              {item.chain_name}
              <Image
                src={"/icons/share-blue.svg"}
                width={16}
                height={16}
                alt="choose"
                className="ml-3"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
