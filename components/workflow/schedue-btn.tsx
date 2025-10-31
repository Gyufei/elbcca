import { useTranslations } from "next-intl";
import { BasicButton } from "./components/button";
import { useState, forwardRef, ForwardedRef, useImperativeHandle } from "react";
import { NetworkChainType } from "@/lib/types/network";
import ActionTip, { IActionType } from "../shared/action-tip";
import { GAS_TOKEN_ADDRESS } from "@/lib/constants/global";
import { TestTxResult } from "./test-tx-result";

interface ScheduleBtnProps {
  networkName?: string;
  params: Record<string, any>;
  gasBalance: number | null;
  priorityFee: string;
  onAfterAction: () => void;
  signAction: () => Record<string, any> | null;
  sendAction: () => Record<string, any> | null;
  isVa: boolean;
}

export interface ScheduleBtnMethods {
  onOpenTestResult: (res: any) => void;
}

export const ScheduleBtn = forwardRef(function ScheduleBtn(
  {
    networkName,
    params,
    priorityFee,
    gasBalance,
    onAfterAction = () => {},
    signAction = () => null,
    sendAction = () => null,
    isVa = false,
  }: ScheduleBtnProps,
  ref: ForwardedRef<ScheduleBtnMethods>,
) {
  const [loading, setLoading] = useState<boolean>(false);
  const [testTxDialogOpen, setTestTxDialogOpen] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [sendTxResult, setSendTxResult] = useState<{
    type: IActionType;
    message: string;
  } | null>();

  const T = useTranslations("Common");

  // 使用 useImperativeHandle 自定义暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    onOpenTestResult: onOpenTestResult,
  }));

  function onOpenTestResult(res: any) {
    setTestResult(res);
    setTestTxDialogOpen(true);
  }

  async function handleSend() {
    setLoading(true);
    if (!isVa) {
      const testRes = await testTxBeforeSend();
      if (!testRes) {
        setLoading(false);
        return;
      }
    }

    await sendQuery();
    setLoading(false);
  }

  async function testTxBeforeSend() {
    try {
      const res = await signAction();
      if (!res) {
        return;
      }
      if (networkName === NetworkChainType.SOLANA) {
        if (!res.compute_units) {
          throw new Error("gas insufficient");
        }
        if (res.compute_units) {
          const pf = params?.priority_fee ? params.priority_fee : priorityFee;
          const gasCost =
            Math.ceil((Number(res.compute_units) * Number(pf)) / 10 ** 6) /
              10 ** 9 +
            0.000005;
          const amountCost = gasCost;
          if (Number(amountCost) > Number(gasBalance || 0)) {
            throw new Error("gas insufficient");
          }
          return true;
        }
      } else {
        if (!res.gaslimit) {
          throw new Error("gas insufficient");
        }
        const gasCost = (Number(res.gaslimit) * Number(params?.gas)) / 10 ** 9;

        const isGasToken = params.token0?.token_address === GAS_TOKEN_ADDRESS;
        const amountCost = isGasToken
          ? gasCost + Number(params.token0.num)
          : gasCost;

        if (Number(amountCost) > Number(gasBalance || 0)) {
          throw new Error("gas insufficient");
        }

        return true;
      }

      return true;
    } catch (e) {
      setTestResult({
        gasInsufficient: true,
      });
      setTestTxDialogOpen(true);
      return null;
    }
  }

  async function sendQuery() {
    setLoading(true);
    try {
      const res = await sendAction();
      if (res) {
        setSendTxResult({
          type: "success",
          message: T("ScheduleSuccess"),
        });
        onAfterAction();
      }
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
        onClick={() => handleSend()}
      >
        <span>{T("Schedule")}</span>
      </BasicButton>
      <ActionTip
        type={sendTxResult?.type || "success"}
        handleClose={() => setSendTxResult(null)}
        message={sendTxResult?.message || null}
      />
      <TestTxResult
        open={testTxDialogOpen}
        message={testResult}
        onOpenChange={setTestTxDialogOpen}
        sureAction={() => sendQuery()}
      />
    </>
  );
});
