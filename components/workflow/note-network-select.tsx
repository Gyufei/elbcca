import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContext, useMemo } from "react";
import Image from "next/image";
import { networkConfigs } from "@/lib/constants/network-config";
import { NetworkContext } from "@/lib/providers/network-provider";
import { NetworkChainType } from "@/lib/types/network";

export const NoteNetLogoConfig = {
  1: "/icons/eth.svg",
  56: "/icons/BNBChain.svg",
  901: "/icons/Solana.svg",
  11155111: "/icons/eth.svg",
  903: "/icons/Solana.svg",
};

export default function NetworkOp({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const { networkList } = useContext(NetworkContext);

  const selectOptions = useMemo(() => {
    return [
      {
        value: 0,
        label: "Not Set",
        logo: null,
      },
      ...networkList.map((item) => ({
        value: item.chain_id,
        label: item.chain_name,
        logo: NoteNetLogoConfig[item.chain_id as keyof typeof NoteNetLogoConfig],
      })),
    ];
  }, [networkList]);

  const selectedOp = useMemo(() => {
    return selectOptions.find((item) => item.value === value);
  }, [value, selectOptions]);

  return (
    <Select value={value.toString()} onValueChange={(e) => onChange(Number(e))}>
      <SelectTrigger className="w-fit gap-2 p-2">
        <SelectValue>
          {Number(value) !== 0 ? (
            <div className="flex items-center">
              {(selectedOp as Record<string, any>)?.["logo"] && (
                <Image
                  src={(selectedOp as Record<string, any>)?.["logo"]}
                  width={20}
                  height={20}
                  alt="logo"
                />
              )}
              <span className="ml-1">
                {(selectedOp as Record<string, any>)?.["label"]}
              </span>
            </div>
          ) : (
            <div className="flex items-center">
              <span className="ml-1">
                {(selectedOp as Record<string, any>)?.["label"]}
              </span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {(selectOptions || []).map((item) => (
          <SelectItem
            showIndicator={false}
            key={item.value}
            value={item.value.toString()}
          >
            <div className="flex items-center">
              {item.logo && (
                <Image src={item["logo"]} width={20} height={20} alt="logo" />
              )}
              <span className="ml-1">{item.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
