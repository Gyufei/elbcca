import { useMemo, useState,} from "react";
import { IOp } from "@/lib/types/op";
import { useTranslations } from "next-intl";
import { BasicButton } from "./components/button";
import { toast } from "@/components/ui/use-toast";
import fetcher from "@/lib/fetcher";

export default function UsdcBtn({
  op,
  params,
  onAfterAction = () => {},
}: {
  op: IOp | null;
  params: Record<string, any>;
  onAfterAction: () => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
 
  const T = useTranslations("Common");

  async function handleSign() {
    try {
      setLoading(true);
      const res = await fetcher("tet", {
        method: "POST",
        body: JSON.stringify(params),
      });
      setLoading(false);
      if (!res) return;
      onAfterAction();
    } catch (e: any) {
      toast({
        variant: "destructive",
        description: e.info,
      });
      setLoading(false);
    }
  }

  const btnText = useMemo(() => {
    if (op?.op_id === 1) {
      return '创建订单'
    }
    if (op?.op_id === 2) {
      return '取消订单'
    }
    if (op?.op_id === 3) {
      return '交易订单'
    }
    if (op?.op_id === 4) {
      return '提取代币'
    }
    return '';
  }, [op?.op_id])

  
  return (
    <BasicButton 
      loading={loading}
      disabled={loading}
      onClick={() => handleSign()}
    >
      <span>{btnText}</span>
    </BasicButton>
  );
}

