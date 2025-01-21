import { useTranslations } from "next-intl";
import { BasicButton } from "./components/button";
import { useState } from "react";
import ActionTip, { IActionType } from "../shared/action-tip";

export function ApproveBtn({
  onAfterAction = () => {},
  approveAction = () => null
}: {
  approveAction: () => Record<string, any> | null;
  onAfterAction: () => void;

}) {
  const [loading, setLoading] = useState<boolean>(false);
 
  const [sendTxResult, setSendTxResult] = useState<{
      type: IActionType;
      message: string;
    } | null>();

  const T = useTranslations("Common");

  async function handleApprove() {
    setLoading(true);
    try {
      await approveAction();
      setLoading(false);
      setSendTxResult({
        type: "success",
        message: T("ApproveSuccess")
      });

      onAfterAction();
    } catch (e: any) {
      setSendTxResult({
        type: "error",
        message: `${e.status}: ${e.info}`,
      });
      setLoading(false);
    }
  }

  return (
    <>
      <BasicButton 
        loading={loading}
        disabled={loading}
        onClick={() => handleApprove()}
      >
        <span>{T("Approve")}</span>
      </BasicButton>
      
      <ActionTip
        type={sendTxResult?.type || "success"}
        handleClose={() => setSendTxResult(null)}
        message={sendTxResult?.message || null}
      />
    </>
  );
}
