import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { networkRouting } from "@/lib/constants/network-config";
import { NetworkContext } from "@/lib/providers/network-provider";
import { NetworkChainType } from "@/lib/types/network";
import { useContext, useMemo } from "react";

export default function RoutingSelect({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (_t: string | null) => void;
}) {
  const { network } = useContext(NetworkContext);
  const networkId = network?.chain_id || null;
  const networkName = network?.currency_name || null;

  const routings = useMemo(() => {
    if (!networkId) return [];
    return networkRouting[networkName as  NetworkChainType]
  }, [networkId, networkName])
  
  const handleSelect = (v: string) => {
    onChange(v)
  };

  
  return (
    <Select
      value={value || undefined}
      onValueChange={(e) => {
        handleSelect(e)
      }}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(routings || []).map((t) => (
          <SelectItem key={t.value} value={t.value}>
            {t.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
