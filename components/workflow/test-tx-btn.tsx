import { useTranslations } from "next-intl";
import { BasicButton } from "./components/button";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { NetworkChainType } from "@/lib/types/network";

export function TestTxBtn({
  networkName,
  params,
  priorityFee,
  gasPrice,
  signAction = () => null,
  onAfterAction = () => {},
  onShowTxResult = () => {},
}: {
  networkName?: string;
  params: Record<string, any>;
  priorityFee: string;
  gasPrice: string;
  onAfterAction: () => void;
  signAction: () => Record<string, any> | null;
  onShowTxResult: (res: any) => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  const T = useTranslations("Common");

  async function handleSign() {
    try {
      setLoading(true);
      const res = await signAction();
      setLoading(false);
      if (!res) return;
      handleShowTxResult(res);
      onAfterAction();
    } catch (e: any) {
      toast({
        variant: "destructive",
        description: e.info,
      });
      setLoading(false);
    }
  }

  function handleShowTxResult(res: Record<string, any>) {
    if (networkName === NetworkChainType.SOLANA) {
      if (res.compute_units) {
        const pf = params?.priority_fee ? params.priority_fee : priorityFee;
        res.gas =
          Math.ceil((Number(res.compute_units) * Number(pf)) / 10 ** 6) /
            10 ** 9 +
          0.000005;
      }
    } else {
      if (res.gaslimit) {
        const gp = params?.gas ? params.gas : gasPrice;
        res.gas = (Number(res.gaslimit) * Number(gp)) / 10 ** 9;
      }
    }
    onShowTxResult(res);
  }

  return (
    <>
      <BasicButton
        loading={loading}
        disabled={loading}
        onClick={() => handleSign()}
      >
        <span>{T("TestTx")}</span>
      </BasicButton>
    </>
  );
}
