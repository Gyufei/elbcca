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

export default function NetworkOp({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { networkList } = useContext(NetworkContext);

  const selectOptions = useMemo(() => {
    return [
      {
        value: "NotSet",
        label: "Not Set",
        logo: null,
      },
      ...networkList.map((item) => ({
        value: item.chain_name,
        label: item.chain_name,
        logo: networkConfigs[item.currency_name as NetworkChainType]?.logo,
      })),
    ];
  }, [networkList]);

  const selectedOp = useMemo(() => {
    return selectOptions.find((item) => item.value === value);
  }, [value, selectOptions]);

  return (
    <Select value={value} onValueChange={(e) => onChange(e)}>
      <SelectTrigger className="w-fit gap-2 p-2">
        <SelectValue>
          {value && (
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
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {(selectOptions || []).map((item) => (
          <SelectItem showIndicator={false} key={item.value} value={item.value}>
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
