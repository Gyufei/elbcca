import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IToken } from "@/lib/types/token";

export default function TokenSelect({
  tokens,
  token,
  handleTokenSelect,
}: {
  tokens: Array<IToken>;
  token: IToken | null;
  handleTokenSelect: (_t: IToken | null) => void;
}) {
  const handleSelect = (add: string) => {
    const token = tokens.find((token: IToken) => token.address === add);
    handleTokenSelect(token || null);
  };

  return (
    <Select
      value={token?.address || undefined}
      onValueChange={(e) => handleSelect(e)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select Token" />
      </SelectTrigger>
      <SelectContent>
        {(tokens || []).map((t) => (
          <SelectItem key={t.address} value={t.address}>
            {t.symbol}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
