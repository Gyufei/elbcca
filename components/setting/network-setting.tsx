"use client";

import { useRouter } from "@/app/navigation";
import { networkConfigs, networkList } from "@/lib/constants/network-config";
import { SystemEndPointPathMap } from "@/lib/end-point";
import fetcher from "@/lib/fetcher";
import { NetworkChainType } from "@/lib/types/network";
import { useTranslations } from "next-intl";
import Image from 'next/image';
import useSWR from "swr";

export const networkMap = {
  "Solana": "Solana",
  "BNBChain": "BNB Chain",
  "Ethereum": "Ethereum",
}

export default function NetworkSetting() {
  const T = useTranslations("Common");
  const router = useRouter();
  const {data: networkList  } = useSWR(SystemEndPointPathMap.networks, fetcher);
  console.log(networkList, "networkList");
  
  return (
    <div className="flex flex-col mt-6 gap-y-3">
      <div className="flex flex-row items-center justify-between">
        <div className="text-lg text-[#333333] font-bold">{T("NetworkSettings")}</div>
        <div className="text-sm gap-2 text-[#707070] h-[24px] flex flex-row items-center">
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
      <div className="flex flex-row gap-3 flex-wrap">
        {
           (networkList || []).map((item) => {
            return (
              <div 
                key={item.chain_id} 
                className="cursor-pointer h-[40px] rounded-[6px] text-base flex flex-row items-center px-3 border border-[#BFBFBF]"
                onClick={() => router.push(`/setting/networks?name=${item.currency_name}&chainId=${item.chain_id}`)}
              >
                <Image 
                  src={networkConfigs[item.currency_name as NetworkChainType].logo}
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
            )
           })
        }
      </div>
    </div>
  );
}
