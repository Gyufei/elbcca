import { useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { INetwork } from "@/lib/types/network";
import useSWR from "swr";
import { SystemEndPointPathMap } from "@/lib/end-point";
import fetcher from "@/lib/fetcher";
import { useTranslations } from "next-intl";

export default function NetworkSelect({
  curretNetwork,
  handleSelect,
}: {
  curretNetwork: INetwork | null;
  handleSelect: (
    value: INetwork
  ) => void;
}) {
  const T = useTranslations("Common");
  const {data: networkList  } = useSWR(SystemEndPointPathMap.networks, fetcher);
  const [popOpen, setPopOpen] = useState(false);

  const handleSelectNetwork = (value: INetwork) => {
    handleSelect(value)
    setPopOpen(false);
  };

  return (
    <Popover
      open={popOpen}
      onOpenChange={(isOpen) => setPopOpen(isOpen)}
    >
      <PopoverTrigger className="w-[350px]">
        <div
          className="flex items-center transition-all duration-75 active:bg-gray-100"
          onClick={() => setPopOpen(!popOpen)}
        >
          {curretNetwork ? (
            <>
              <div className="mr-2 text-title-color">
                {curretNetwork.chain_name}
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
      <PopoverContent className="w-[160px] px-0 py-2" align="start">
        <div className=" rounded-md bg-white">
          <div className="flex flex-col">
            {(networkList || []).map((option: INetwork) => (
              <div
                key={option.chain_id}
                className="flex cursor-pointer items-center h-10 pl-3 hover:bg-[#F6F7F8]"
                onClick={() => handleSelectNetwork(option)}
              >
                {option.chain_name}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
