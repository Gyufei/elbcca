import { useContext, useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { INetwork } from "@/lib/types/network";
import { useTranslations } from "next-intl";
import Image from 'next/image';
import { networkConfigs } from "@/lib/constants/network-config";
import { NetworkChainType } from "@/lib/types/network";
import { NetworkContext } from "@/lib/providers/network-provider";

export default function NetworkSelect({
  size = 'default',
  currentNetwork,
  handleSelect,
}: {
  size?: 'large' | 'default';
  currentNetwork: INetwork | null;
  handleSelect: (
    value: INetwork
  ) => void;
}) {
  const T = useTranslations("Common");
  const { networkList  } = useContext(NetworkContext)
  const [popOpen, setPopOpen] = useState(false);

  const handleSelectNetwork = (value: INetwork) => {
    handleSelect(value)
    setPopOpen(false);
  };

  const imgW = size === 'large' ? 20 : 16;
  const textS = size === 'large' ? "text-[18px] leading-[24px]" : "text-[16px] leading-[20px]";

  return (
    <Popover
      open={popOpen}
      onOpenChange={(isOpen) => setPopOpen(isOpen)}
    >
      <PopoverTrigger className="w-full">
        <div
          className="flex items-center transition-all duration-75 active:bg-gray-100"
          onClick={() => setPopOpen(!popOpen)}
        >
          {currentNetwork ? (
            <>
              <div className={`mr-2 text-title-color flex align-items ${textS}`}>
                {
                  networkConfigs[currentNetwork.currency_name as NetworkChainType]?.logo && (
                    <Image 
                      src={networkConfigs[currentNetwork.currency_name as NetworkChainType]?.logo || ''}
                      width={imgW}
                      height={imgW}
                      alt="choose"
                      className="mr-[5px]"
                    />
                  )
                }
                {currentNetwork.chain_name}
              </div>
            </>
          ) : (
            <div className="text-sm text-content-color">{T("SelectNetwork")}</div>
          )}
          <ChevronDown
            className={`h-4 w-4 text-gray-600 transition-all ${
              popOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] px-0 py-2" align="start">
        <div className=" rounded-md bg-white">
          <div className="flex flex-col">
            {(networkList || []).map((option: INetwork) => (
              <div
                key={option.chain_id}
                className={`flex cursor-pointer items-center h-10 pl-3 hover:bg-[#F6F7F8] ${textS} align-items`}
                onClick={() => handleSelectNetwork(option)}
              >
                {
                  networkConfigs[option.currency_name as NetworkChainType]?.logo && (
                    <Image 
                      src={networkConfigs[option.currency_name as NetworkChainType].logo}
                      width={imgW}
                      height={imgW}
                      alt="choose"
                      className="mr-[5px]"
                    />
                  )
                }
                {option.chain_name}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
