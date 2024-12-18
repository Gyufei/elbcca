"use client";

import { useRouter } from "@/app/navigation";
import { useTranslations } from "next-intl";
import Image from 'next/image';

export const networkMap = {
  "Solana": "Solana",
  "BNBChain": "BNB Chain",
  "Ethereum": "Ethereum",
}

const networkList = [
  { name: 'Solana', icon: '/icons/Solana.svg', link: 'Solana'},
  { name: 'BNB Chain', icon: '/icons/BNBChain.svg', link: 'BNBChain'},
  { name: 'Ethereum', icon: '/icons/eth.svg', link: 'Ethereum'},
]

export default function NetworkSetting() {
  const T = useTranslations("Common");
  const router = useRouter();
  
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
           networkList.map((item) => {
            return (
              <div 
                key={item.name} className="cursor-pointer h-[40px] rounded-[6px] text-base flex flex-row items-center px-3 border border-[#BFBFBF]"
                onClick={() => router.push(`/setting/networks?type=${item.link}`)}
              >
                <Image 
                  src={item.icon}
                  width={16}
                  height={16}
                  alt="choose"
                  className="mr-1"
                />
                {item.name}
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
